# Quick Start Guide

Get up and running in 5 minutes!

## 1. Prerequisites ✅

- Python 3.9+ installed
- MetaTrader 5 installed and running
- Telegram account with access to trading signals channel

## 2. Installation ⚡

```bash
# Clone and enter directory
cd Herman-

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create configuration
cp .env.example .env
```

## 3. Configuration ⚙️

Edit `.env` with your credentials:

### Telegram (choose ONE option):

**Option A: Bot (easier, recommended)**
```env
TELEGRAM_BOT_TOKEN=123456:ABC...  # Get from @BotFather
TELEGRAM_CHANNEL_ID=@your_channel
USE_TELEGRAM_BOT=true
```

**Option B: User Client (for private channels)**
```env
TELEGRAM_API_ID=12345678          # From https://my.telegram.org/apps
TELEGRAM_API_HASH=abc123...
TELEGRAM_PHONE=+1234567890
USE_TELEGRAM_BOT=false
```

### MT5:
```env
MT5_LOGIN=12345678
MT5_PASSWORD=your_password
MT5_SERVER=YourBroker-Demo
```

### Trading:
```env
DEFAULT_LOT_SIZE=0.01
DRY_RUN=true  # ⚠️ Keep true for testing!
```

## 4. Test Connection 🧪

```bash
# Test MT5
python scripts/test_mt5.py

# If using Telethon (user client):
python scripts/telethon_auth.py
```

## 5. Run in Dry-Run Mode 🏃

```bash
# Start the application
python run.py

# Or with make:
make dry-run
```

## 6. Open Dashboard 📊

Open browser: http://localhost:8000

You should see:
- ✅ Telegram Connected
- ✅ MT5 Connected
- Stats: 0 signals received (will increase as signals arrive)

## 7. Test Signal Parsing 🧪

Send a test message to your channel:
```
BUY XAUUSD @ 2054 SL 2046 TP 2070
```

Check dashboard - you should see:
- New trade in "Recent Trades"
- Status: EXECUTED (simulated)
- No actual MT5 order (dry-run mode)

## 8. Go Live (when ready) 🚀

⚠️ **ONLY after extensive testing!**

```bash
# Edit .env
DRY_RUN=false

# Start (asks for confirmation)
make run
```

## Common Issues 🔧

### MT5 not connecting
- Ensure MT5 terminal is open
- Check login/password/server in .env
- Enable algo trading: Tools → Options → Expert Advisors

### Telegram not receiving messages
**Bot mode:**
- Add bot as channel admin
- Check bot token is correct

**User mode:**
- Run `python scripts/telethon_auth.py`
- Check API ID/Hash from https://my.telegram.org/apps

### Signal not parsed
- Check format matches examples in `tests/signals_samples.txt`
- View logs: `tail -f logs/app.log`

## Next Steps 📚

1. Read full [README.md](README.md)
2. Check [signal formats](tests/signals_samples.txt)
3. Review [configuration options](.env.example)
4. Join community / report issues

## Quick Commands 🎯

```bash
make install        # Install dependencies
make test          # Run tests
make dry-run       # Run in dry-run mode
make run           # Run in live mode (asks confirmation)
make logs          # View logs
make db-stats      # View trade statistics
make backup        # Backup database
```

---

Happy trading! 📈

*Remember: Always test in dry-run mode first!*
