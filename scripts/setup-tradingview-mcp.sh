#!/usr/bin/env bash
#
# Setup script for the "claudeverstradingview" MCP server on macOS.
#
# What it does:
#   1. Clones hermanvanel-ui/claudeverstradingview into ~/claudeverstradingview
#      (or pulls the latest if the directory already exists).
#   2. Runs `npm install` in that directory.
#   3. Merges the MCP server entry into ~/.claude/.mcp.json without
#      overwriting any existing servers. A timestamped backup is created
#      before any modification.
#   4. Copies rules.example.json to rules.json (only if rules.json does
#      not already exist) and opens it in the default editor.
#   5. Prints next-step instructions (restart Claude Code + run
#      tv_health_check).
#
# Run from your Mac:
#     bash scripts/setup-tradingview-mcp.sh
#
# The script is idempotent: re-running it is safe.

set -euo pipefail

REPO_URL="https://github.com/hermanvanel-ui/claudeverstradingview.git"
TARGET_DIR="${HOME}/claudeverstradingview"
MCP_FILE="${HOME}/.claude/.mcp.json"
SERVER_NAME="claudeverstradingview"
SERVER_ENTRYPOINT="${TARGET_DIR}/src/server.js"

log()  { printf '\033[1;34m[setup]\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33m[warn]\033[0m  %s\n' "$*" >&2; }
die()  { printf '\033[1;31m[error]\033[0m %s\n' "$*" >&2; exit 1; }

command -v git  >/dev/null 2>&1 || die "git is required but not installed."
command -v node >/dev/null 2>&1 || die "node is required but not installed."
command -v npm  >/dev/null 2>&1 || die "npm is required but not installed."

# ---- 1. Clone (or update) the repo -----------------------------------------

if [ -d "${TARGET_DIR}/.git" ]; then
  log "Repo already present at ${TARGET_DIR} — pulling latest."
  git -C "${TARGET_DIR}" pull --ff-only
else
  log "Cloning ${REPO_URL} into ${TARGET_DIR}"
  git clone "${REPO_URL}" "${TARGET_DIR}"
fi

# ---- 2. npm install --------------------------------------------------------

log "Running npm install in ${TARGET_DIR}"
( cd "${TARGET_DIR}" && npm install )

[ -f "${SERVER_ENTRYPOINT}" ] || warn "Expected entrypoint not found: ${SERVER_ENTRYPOINT}"

# ---- 3. Merge into ~/.claude/.mcp.json -------------------------------------

mkdir -p "$(dirname "${MCP_FILE}")"

if [ -f "${MCP_FILE}" ]; then
  BACKUP="${MCP_FILE}.bak.$(date +%Y%m%d-%H%M%S)"
  cp "${MCP_FILE}" "${BACKUP}"
  log "Backed up existing config to ${BACKUP}"
else
  printf '{}\n' > "${MCP_FILE}"
  log "Created empty ${MCP_FILE}"
fi

log "Merging MCP server entry '${SERVER_NAME}' into ${MCP_FILE}"

node - "${MCP_FILE}" "${SERVER_NAME}" "${SERVER_ENTRYPOINT}" <<'NODE'
const fs = require("fs");
const [, , file, name, entrypoint] = process.argv;

let cfg = {};
try {
  const raw = fs.readFileSync(file, "utf8").trim();
  cfg = raw ? JSON.parse(raw) : {};
} catch (err) {
  console.error(`Could not parse ${file}: ${err.message}`);
  process.exit(1);
}

if (typeof cfg !== "object" || cfg === null || Array.isArray(cfg)) {
  console.error(`Top-level value in ${file} must be a JSON object.`);
  process.exit(1);
}

cfg.mcpServers = cfg.mcpServers && typeof cfg.mcpServers === "object"
  ? cfg.mcpServers
  : {};

cfg.mcpServers[name] = {
  command: "node",
  args: [entrypoint],
};

fs.writeFileSync(file, JSON.stringify(cfg, null, 2) + "\n");
NODE

# ---- 4. rules.json ---------------------------------------------------------

RULES_EXAMPLE="${TARGET_DIR}/rules.example.json"
RULES_FILE="${TARGET_DIR}/rules.json"

if [ ! -f "${RULES_EXAMPLE}" ]; then
  warn "rules.example.json not found at ${RULES_EXAMPLE} — skipping rules copy."
else
  if [ -f "${RULES_FILE}" ]; then
    log "rules.json already exists — leaving it as-is."
  else
    cp "${RULES_EXAMPLE}" "${RULES_FILE}"
    log "Copied rules.example.json -> rules.json"
  fi

  if command -v open >/dev/null 2>&1; then
    log "Opening rules.json"
    open "${RULES_FILE}" || warn "Could not open rules.json automatically."
  else
    log "rules.json: ${RULES_FILE} (open it manually to edit)."
  fi
fi

# ---- 5. Next steps ---------------------------------------------------------

cat <<EOF

----------------------------------------------------------------------
Setup complete.

Next steps:
  1. Quit and relaunch Claude Code so it re-reads ~/.claude/.mcp.json.
  2. In a fresh session, run the MCP tool:  tv_health_check
     (it will appear once the server is loaded — try /mcp to confirm
     the 'claudeverstradingview' server shows as connected.)

Files touched:
  - ${TARGET_DIR}
  - ${MCP_FILE}
  - ${RULES_FILE}
----------------------------------------------------------------------
EOF
