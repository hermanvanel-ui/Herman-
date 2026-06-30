#!/usr/bin/env bash
#
# Setup script for the "claudeverstradingview" MCP server on macOS.
#
# What it does:
#   1. Provisions the project at ~/claudeverstradingview from one of:
#        - a local zip:  --zip <path>      (e.g. a download from GitHub)
#        - a git repo:   --repo <url>      (default: $REPO_URL below)
#        - already-extracted directory: skipped automatically
#   2. Runs `npm install`.
#   3. Merges the MCP server entry into ~/.claude/.mcp.json without
#      overwriting any existing servers. A timestamped backup is created
#      before any modification.
#   4. Copies rules.example.json to rules.json (only if rules.json does
#      not already exist) and opens it in the default editor.
#   5. Prints next-step instructions (launch TradingView with
#      --remote-debugging-port=9222, restart Claude Code, run
#      tv_health_check).
#
# Usage:
#     bash scripts/setup-tradingview-mcp.sh
#     bash scripts/setup-tradingview-mcp.sh --zip ~/Downloads/claudeverstradingview-main.zip
#     bash scripts/setup-tradingview-mcp.sh --repo https://github.com/owner/repo.git
#
# The script is idempotent: re-running it is safe.

set -euo pipefail

REPO_URL="https://github.com/hermanvanel-ui/claudeverstradingview.git"
TARGET_DIR="${HOME}/claudeverstradingview"
MCP_FILE="${HOME}/.claude/.mcp.json"
SERVER_NAME="claudeverstradingview"
SERVER_ENTRYPOINT="${TARGET_DIR}/src/server.js"
SOURCE_ZIP=""

while [ $# -gt 0 ]; do
  case "$1" in
    --zip)  SOURCE_ZIP="${2:?--zip needs a path}"; shift 2;;
    --repo) REPO_URL="${2:?--repo needs a url}"; shift 2;;
    --dir)  TARGET_DIR="${2:?--dir needs a path}"; SERVER_ENTRYPOINT="${TARGET_DIR}/src/server.js"; shift 2;;
    -h|--help)
      sed -n '2,28p' "$0"; exit 0;;
    *) echo "Unknown option: $1" >&2; exit 2;;
  esac
done

log()  { printf '\033[1;34m[setup]\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33m[warn]\033[0m  %s\n' "$*" >&2; }
die()  { printf '\033[1;31m[error]\033[0m %s\n' "$*" >&2; exit 1; }

command -v node >/dev/null 2>&1 || die "node is required but not installed."
command -v npm  >/dev/null 2>&1 || die "npm is required but not installed."
if [ -z "${SOURCE_ZIP}" ] && [ ! -f "${TARGET_DIR}/package.json" ]; then
  command -v git >/dev/null 2>&1 || die "git is required when --zip is not used."
fi

# ---- 1. Provision the project at TARGET_DIR --------------------------------

if [ -f "${TARGET_DIR}/package.json" ]; then
  log "Project already present at ${TARGET_DIR} — skipping fetch."
  if [ -d "${TARGET_DIR}/.git" ] && [ -z "${SOURCE_ZIP}" ]; then
    log "Pulling latest from origin."
    git -C "${TARGET_DIR}" pull --ff-only || warn "git pull failed (continuing)."
  fi
elif [ -n "${SOURCE_ZIP}" ]; then
  command -v unzip >/dev/null 2>&1 || die "unzip is required to use --zip."
  [ -f "${SOURCE_ZIP}" ] || die "Zip not found: ${SOURCE_ZIP}"

  log "Extracting ${SOURCE_ZIP} -> ${TARGET_DIR}"
  STAGING="$(mktemp -d)"
  trap 'rm -rf "${STAGING}"' EXIT
  unzip -q "${SOURCE_ZIP}" -d "${STAGING}"

  # Most GitHub zips wrap everything in a single top-level dir (e.g.
  # "claudeverstradingview-main/"). Detect and unwrap it.
  ENTRIES=( "${STAGING}"/* )
  if [ "${#ENTRIES[@]}" -eq 1 ] && [ -d "${ENTRIES[0]}" ]; then
    SRC="${ENTRIES[0]}"
  else
    SRC="${STAGING}"
  fi
  [ -f "${SRC}/package.json" ] || die "Zip does not contain a package.json at its root."

  mkdir -p "${TARGET_DIR}"
  # Copy contents (including dotfiles) without nuking unrelated files.
  cp -R "${SRC}/." "${TARGET_DIR}/"
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
