.PHONY: help install test run dry-run clean logs

help:  ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

install:  ## Install dependencies
	pip install -r requirements.txt

test:  ## Run tests
	pytest tests/ -v

test-parser:  ## Test signal parser only
	pytest tests/test_parser.py -v

dry-run:  ## Run in dry-run mode (safe testing)
	@echo "Starting in DRY RUN mode..."
	@DRY_RUN=true python run.py

run:  ## Run in LIVE mode (CAUTION: real trades!)
	@echo "⚠️  WARNING: Starting in LIVE mode - real trades will be executed!"
	@read -p "Are you sure? (yes/no): " confirm && [ "$$confirm" = "yes" ] || exit 1
	@python run.py

test-mt5:  ## Test MT5 connection
	python scripts/test_mt5.py

auth-telegram:  ## Authenticate Telethon (first time only)
	python scripts/telethon_auth.py

logs:  ## Show application logs
	tail -f logs/app.log

logs-errors:  ## Show only errors from logs
	grep ERROR logs/app.log | tail -20

clean:  ## Clean cache and temporary files
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
	find . -type f -name "*.pyo" -delete

db-stats:  ## Show database statistics
	@sqlite3 data/trades.db "SELECT status, COUNT(*) as count FROM trades GROUP BY status;"

db-recent:  ## Show recent trades
	@sqlite3 data/trades.db "SELECT timestamp, action, symbol, direction, status FROM trades ORDER BY timestamp DESC LIMIT 10;"

backup:  ## Backup database
	@mkdir -p backups
	@cp data/trades.db backups/trades_$(shell date +%Y%m%d_%H%M%S).db
	@echo "Backup created in backups/"

setup:  ## Initial setup (create .env from example)
	@if [ ! -f .env ]; then \
		cp .env.example .env; \
		echo "✅ Created .env file - please edit it with your credentials"; \
	else \
		echo "⚠️  .env already exists"; \
	fi

check-config:  ## Check configuration
	@echo "Checking configuration..."
	@python -c "from backend.config import CONFIG; print('✅ Configuration loaded successfully')"
