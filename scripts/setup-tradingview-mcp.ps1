#requires -Version 5
<#
.SYNOPSIS
  Install/refresh the claudeverstradingview MCP server on Windows.

.DESCRIPTION
  1. Extracts a local zip (or pulls from a git URL) into the target dir.
  2. Runs npm install.
  3. Merges the MCP server entry into ~/.claude/.mcp.json (preserving
     any existing servers; backs up the previous file with a timestamp).
  4. Copies rules.example.json -> rules.json (skip if already present)
     and opens it.
  5. Prints next-step instructions.

  Idempotent: safe to re-run.

.PARAMETER Zip
  Path to the claudeverstradingview-main.zip you downloaded.

.PARAMETER RepoUrl
  Git URL to clone if -Zip is not given.

.PARAMETER TargetDir
  Where to install. Default: $HOME\claudeverstradingview

.EXAMPLE
  powershell -ExecutionPolicy Bypass -File .\setup-tradingview-mcp.ps1 `
      -Zip "$HOME\Downloads\claudeverstradingview-main.zip"
#>
[CmdletBinding()]
param(
  [string]$Zip = "",
  [string]$RepoUrl = "https://github.com/hermanvanel-ui/claudeverstradingview.git",
  [string]$TargetDir = (Join-Path $HOME 'claudeverstradingview')
)

$ErrorActionPreference = 'Stop'

function Log  { param($m) Write-Host "[setup] $m" -ForegroundColor Cyan }
function Warn { param($m) Write-Host "[warn]  $m" -ForegroundColor Yellow }
function Die  { param($m) Write-Host "[error] $m" -ForegroundColor Red; exit 1 }

foreach ($t in 'node','npm') {
  if (-not (Get-Command $t -ErrorAction SilentlyContinue)) { Die "$t not found on PATH." }
}

$ServerName       = 'claudeverstradingview'
$ServerEntrypoint = (Join-Path $TargetDir 'src\server.js')
$McpFile          = Join-Path $HOME '.claude\.mcp.json'

# ---- 1. Provision -----------------------------------------------------------

if (Test-Path (Join-Path $TargetDir 'package.json')) {
  Log "Project already at $TargetDir - skipping fetch."
}
elseif ($Zip) {
  if (-not (Test-Path $Zip)) { Die "Zip not found: $Zip" }
  Log "Extracting $Zip -> $TargetDir"
  $staging = Join-Path $env:TEMP ("cvtv-stage-" + [System.Guid]::NewGuid().ToString('N'))
  New-Item -ItemType Directory -Path $staging | Out-Null
  try {
    Expand-Archive -Path $Zip -DestinationPath $staging -Force
    $inner = Get-ChildItem -Path $staging -Directory
    if ($inner.Count -eq 1 -and (Test-Path (Join-Path $inner[0].FullName 'package.json'))) {
      $src = $inner[0].FullName
    } elseif (Test-Path (Join-Path $staging 'package.json')) {
      $src = $staging
    } else {
      Die "Zip does not contain a package.json at its root."
    }
    if (-not (Test-Path $TargetDir)) { New-Item -ItemType Directory -Path $TargetDir | Out-Null }
    Copy-Item -Path (Join-Path $src '*') -Destination $TargetDir -Recurse -Force
  } finally {
    Remove-Item $staging -Recurse -Force -ErrorAction SilentlyContinue
  }
}
else {
  if (-not (Get-Command git -ErrorAction SilentlyContinue)) { Die "git not found and no -Zip provided." }
  Log "Cloning $RepoUrl -> $TargetDir"
  git clone $RepoUrl $TargetDir
  if ($LASTEXITCODE -ne 0) { Die "git clone failed." }
}

# ---- 2. npm install ---------------------------------------------------------

Log "Running npm install in $TargetDir"
Push-Location $TargetDir
try {
  npm install
  if ($LASTEXITCODE -ne 0) { Die "npm install failed." }
} finally {
  Pop-Location
}

if (-not (Test-Path $ServerEntrypoint)) {
  Warn "Expected entrypoint missing: $ServerEntrypoint"
}

# ---- 3. Merge into ~/.claude/.mcp.json --------------------------------------

$mcpDir = Split-Path $McpFile -Parent
if (-not (Test-Path $mcpDir)) { New-Item -ItemType Directory -Path $mcpDir | Out-Null }

if (Test-Path $McpFile) {
  $backup = "$McpFile.bak.$(Get-Date -Format 'yyyyMMdd-HHmmss')"
  Copy-Item $McpFile $backup
  Log "Backed up existing config to $backup"
} else {
  Set-Content -Path $McpFile -Value "{}" -Encoding UTF8
  Log "Created empty $McpFile"
}

# Use Node for the JSON merge so existing servers are preserved exactly as-is.
$mergeScript = Join-Path $env:TEMP ("cvtv-merge-" + [System.Guid]::NewGuid().ToString('N') + ".js")
@'
const fs = require("fs");
const [, , file, name, entrypoint] = process.argv;
let cfg = {};
const raw = fs.readFileSync(file, "utf8").trim();
if (raw) cfg = JSON.parse(raw);
if (typeof cfg !== "object" || cfg === null || Array.isArray(cfg)) {
  throw new Error("Top-level value in " + file + " must be a JSON object.");
}
cfg.mcpServers = (cfg.mcpServers && typeof cfg.mcpServers === "object") ? cfg.mcpServers : {};
cfg.mcpServers[name] = { command: "node", args: [entrypoint] };
fs.writeFileSync(file, JSON.stringify(cfg, null, 2) + "\n");
'@ | Set-Content -Path $mergeScript -Encoding UTF8

# Use forward slashes in the entrypoint - Node accepts them on Windows and they
# avoid JSON backslash-escaping headaches when humans hand-edit the file later.
$entrypointForJson = $ServerEntrypoint -replace '\\','/'

Log "Merging MCP server entry '$ServerName' into $McpFile"
& node $mergeScript $McpFile $ServerName $entrypointForJson
$mergeExit = $LASTEXITCODE
Remove-Item $mergeScript -ErrorAction SilentlyContinue
if ($mergeExit -ne 0) { Die "MCP config merge failed (node exit $mergeExit)." }

# ---- 4. rules.json ----------------------------------------------------------

$rulesExample = Join-Path $TargetDir 'rules.example.json'
$rulesFile    = Join-Path $TargetDir 'rules.json'

if (-not (Test-Path $rulesExample)) {
  Warn "rules.example.json not found - skipping."
} elseif (Test-Path $rulesFile) {
  Log "rules.json already exists - leaving it as-is."
} else {
  Copy-Item $rulesExample $rulesFile
  Log "Copied rules.example.json -> rules.json"
}
if (Test-Path $rulesFile) {
  try { Invoke-Item $rulesFile } catch { Warn "Could not open rules.json: $($_.Exception.Message)" }
}

# ---- 5. Next steps ----------------------------------------------------------

@"

----------------------------------------------------------------------
Setup complete.

Next steps:
  1. Make sure TradingView Desktop is running with the Chrome DevTools
     port open:
         & "`$env:LOCALAPPDATA\TradingView\TradingView.exe" --remote-debugging-port=9222
     (Adjust the path if TradingView is installed elsewhere.)

  2. Fully quit Claude Code (right-click tray icon -> Quit, or close
     every window) and relaunch it so ~/.claude/.mcp.json is re-read.

  3. In a fresh session: type /mcp - you should see
        $ServerName  connected
     Then run the tool: tv_health_check

Files touched:
  - $TargetDir
  - $McpFile
  - $rulesFile
----------------------------------------------------------------------
"@ | Write-Host
