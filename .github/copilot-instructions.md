# Copilot Instructions for Herman-

## Project Overview

**Herman-** is a **Telegram → MetaTrader 5 Trade Copier** system that automatically replicates trading signals from Telegram channels into MetaTrader 5.

### Core Architecture

The system has three main components with clear separation:

- **Backend** (`backend/`): FastAPI server + orchestration (Python async)
- **Frontend** (`frontend/`): Real-time dashboard via WebSocket updates
- **Scripts** (`scripts/`): Utilities for testing, setup, auth
- **Tests** (`tests/`): Unit tests for parser (20+ signal format samples in `signals_samples.txt`)

### Data Flow

```
Telegram Channel → TelegramMonitor → SignalParser → MT5Bridge → MetaTrader 5
                                        ↓
                                  TradeDatabase
                                  (anti-duplicate)
                                        ↓
                                   Frontend/UI
```

## Critical Workflows

### Local Development
- **Setup**: `make install` (Python 3.9+) → `make setup` (creates `.env` from example)
- **Config**: Fill `.env` with Telegram credentials (Bot API OR Telethon+phone)
- **Test parsing**: `make test-parser` runs `pytest tests/test_parser.py -v`
- **MT5 test**: `make test-mt5` verifies connection via `scripts/test_mt5.py`
- **Dry-run**: `make dry-run` or `DRY_RUN=true python run.py` (safe testing, no real trades)
- **Live mode**: `make run` (prompts confirmation, executes real trades)
- **Logs**: `make logs` (live tail), `make logs-errors` (filter errors)
- **Database**: `make db-recent` shows recent trades, `make backup` creates timestamped backup

### Entry Point
- Main: `python run.py` starts FastAPI server on localhost:8000
- Orchestrator: [backend/main.py](backend/main.py) creates `TradeCopier` class combining all components

## Component Details & Patterns

### Signal Parser (`signal_parser.py`)
- Recognizes 20+ signal formats (BUY/SELL, symbols, entry/SL/TP, PARTIAL_CLOSE, MOVE_SL_TO_BE)
- **Key pattern**: Regex-based extraction with symbol mapping support
- Input: raw message text + message metadata (id, hash, timestamp)
- Output: `ParsedSignal` (Pydantic model with confidence score, raw_data)
- Used in: Test function `is_likely_signal()` filters noise before parsing
- **Convention**: Symbol mapping (`GOLD→XAUUSD`) via config

### MT5 Bridge (`mt5_bridge.py`)
- Direct MetaTrader 5 integration via `MetaTrader5` Python library
- **Dry-run mode**: Simulates execution when `DRY_RUN=true` (no actual trades)
- **Key properties**: magic_number (order labeling), slippage limits, risk percentage
- Output: `MT5OrderResult` with ticket number, execution price, errors
- Error handling: Reconnection logic, rate limiting

### Database (`database.py`)
- SQLite anti-duplicate system: hashes message text+id
- Indexes: message_hash (UNIQUE), message_id, status, mt5_ticket
- **Critical**: `message_hash` MUST be unique; duplicates are skipped via [SKIP_DUPLICATE_MESSAGES](backend/main.py#L200)
- Tracks: PENDING → PARSED → EXECUTED/FAILED statuses

### Telegram Client (`telegram_client.py`)
- Dual mode: Bot API (public channels) OR Telethon (private channels)
- Configuration: `USE_TELEGRAM_BOT=true` selects mode; Telethon needs phone auth
- Auth flow: `make auth-telegram` runs `scripts/telethon_auth.py` (one-time only)
- Callback: Signals trigger `on_signal` async callback in TradeCopier

### Frontend (`frontend/`)
- Single-page HTML with WebSocket for real-time updates
- Updates via `/ws` endpoint; refreshes system status, recent trades, errors
- Displays: Telegram/MT5 connection status, trade stats, open positions (from MT5)

## Configuration & Environment

**Required (.env)**:
```env
# Choose Telegram method
USE_TELEGRAM_BOT=true  # Bot API (public channels)
TELEGRAM_BOT_TOKEN=...  # OR Telethon credentials:
TELEGRAM_API_ID=...
TELEGRAM_API_HASH=...
TELEGRAM_PHONE=...
TELEGRAM_CHANNEL_ID=...

# MT5 Terminal (must be running on same machine)
MT5_LOGIN=...
MT5_PASSWORD=...
MT5_SERVER=...

# Trading
DEFAULT_LOT_SIZE=0.01
RISK_PERCENTAGE=1.0
MAX_SLIPPAGE=10
SYMBOL_MAPPING={"GOLD":"XAUUSD","GU":"GBPUSD"}  # JSON or KEY=VALUE

# App
HOST=0.0.0.0
PORT=8000
DRY_RUN=false  # ⚠️ Set true for testing
LOG_LEVEL=INFO
```

## Testing & Validation

- **Unit tests**: `pytest tests/test_parser.py -v` with 20+ signal formats
- **Test signals**: See [tests/signals_samples.txt](tests/signals_samples.txt) for format examples
- **Parser validation**: Each signal test checks direction, symbol, entry, SL, TP parsing
- **No integration tests**: MT5 requires live terminal (tested manually via `make test-mt5`)

## Key Models (Pydantic)

- `ParsedSignal`: Message data + parsed action/direction/symbol/prices + confidence
- `MT5Order`: Symbol, direction, volume, prices
- `TradeRecord`: Database schema matching
- `SignalAction` enum: OPEN, CLOSE, MODIFY, PARTIAL_CLOSE, MOVE_SL_TO_BE
- `TradeStatus` enum: PENDING, PARSED, EXECUTED, FAILED, SKIPPED
- `AppConfig`: Configuration holder with validation

## Important Caveats

1. **MT5 Terminal**: Must be running locally; app connects via MetaTrader5 Python library
2. **Dry-run safety**: Always test with `DRY_RUN=true` before live trades
3. **Message deduplication**: Via `message_hash`; same message won't execute twice
4. **Symbol mapping required**: Unknown symbols are skipped; configure in `.env`
5. **Telethon auth**: One-time phone verification needed; stored in local session
6. **WebSocket**: Frontend auto-reconnects every 5s if server unavailable

## File Organization Quick Reference

- `backend/main.py` — TradeCopier orchestrator, FastAPI routes, WebSocket handler
- `backend/config.py` — AppConfig loading from .env with validation
- `backend/models.py` — All Pydantic models (ParsedSignal, MT5Order, etc.)
- `backend/signal_parser.py` — Multi-format regex parser with symbol mapping
- `backend/mt5_bridge.py` — MT5 connection, order execution, dry-run simulation
- `backend/database.py` — SQLite schema, anti-duplicate logic, trade record storage
- `backend/telegram_client.py` — Bot API + Telethon dual-mode monitoring
- `frontend/static/app.js` — WebSocket client, real-time UI updates
- `tests/test_parser.py` — Pytest suite with 20+ signal format examples
- `scripts/test_mt5.py` — MT5 connection tester
- `scripts/telethon_auth.py` — Phone auth setup for Telethon
- `Makefile` — All development commands (install, test, run, dry-run, logs, db utilities)
