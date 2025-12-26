# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-12-26

### Added
- ✅ Initial release
- ✅ Telegram monitoring (Bot API + Telethon support)
- ✅ Multi-format signal parser (20+ formats)
- ✅ MT5 execution bridge with Python MetaTrader5
- ✅ SQLite database for anti-duplicate tracking
- ✅ Dry-run mode for safe testing
- ✅ Web-based UI panel with real-time updates
- ✅ WebSocket support for live status
- ✅ Comprehensive logging system
- ✅ Support for multiple signal actions:
  - OPEN (BUY/SELL with entry, SL, TP)
  - CLOSE (full position close)
  - PARTIAL_CLOSE (percentage-based)
  - MOVE_SL_TO_BE (move stop loss to breakeven)
- ✅ Symbol mapping configuration
- ✅ Risk management (lot sizing, slippage control)
- ✅ Magic number support for trade isolation
- ✅ Unit tests for parser
- ✅ Sample signals for testing
- ✅ Comprehensive documentation
- ✅ Setup scripts (MT5 test, Telethon auth)
- ✅ Makefile for common operations

### Security
- ✅ Credentials in .env (not in code)
- ✅ No secrets in logs
- ✅ Input validation
- ✅ Anti-duplicate protection

### Documentation
- ✅ README.md with full instructions
- ✅ CONTRIBUTING.md for developers
- ✅ Inline code documentation
- ✅ .env.example template

## [Unreleased]

### Planned Features
- [ ] Multiple TP support (partial closes at each TP level)
- [ ] Trailing stop loss
- [ ] Break-even automation
- [ ] Multiple Telegram channels support
- [ ] Trade journal export (CSV/Excel)
- [ ] Telegram notifications on execution
- [ ] Risk calculator (automatic lot sizing based on account balance)
- [ ] Position size limits
- [ ] Daily/weekly trade limits
- [ ] Backtesting mode
- [ ] Strategy analytics
- [ ] Mobile-responsive UI improvements
- [ ] Docker support
- [ ] Cloud deployment guides (AWS, GCP, Azure)

### Known Issues
- MT5 must be running on same machine (no remote support yet)
- First-time Telethon auth requires manual code input
- Session file stored locally (not encrypted)

---

## Version History

- **1.0.0** (2024-12-26): Initial stable release
