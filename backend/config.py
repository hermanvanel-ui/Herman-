"""Configuration management."""

import os
import json
from typing import Dict, Any
from pathlib import Path
from dotenv import load_dotenv
from backend.models import AppConfig

# Load environment variables
load_dotenv()


def get_config() -> AppConfig:
    """Load configuration from environment variables."""

    # Parse symbol mapping
    symbol_mapping = {}
    symbol_mapping_str = os.getenv("SYMBOL_MAPPING", "{}")
    try:
        symbol_mapping = json.loads(symbol_mapping_str)
    except json.JSONDecodeError:
        # Fallback: parse as comma-separated KEY=VALUE pairs
        if symbol_mapping_str:
            for pair in symbol_mapping_str.split(","):
                if "=" in pair:
                    key, value = pair.split("=", 1)
                    symbol_mapping[key.strip()] = value.strip()

    config = AppConfig(
        # Telegram
        telegram_bot_token=os.getenv("TELEGRAM_BOT_TOKEN"),
        telegram_api_id=int(os.getenv("TELEGRAM_API_ID", "0")) or None,
        telegram_api_hash=os.getenv("TELEGRAM_API_HASH"),
        telegram_phone=os.getenv("TELEGRAM_PHONE"),
        telegram_channel_id=os.getenv("TELEGRAM_CHANNEL_ID", ""),
        use_telegram_bot=os.getenv("USE_TELEGRAM_BOT", "true").lower() == "true",

        # MT5
        mt5_login=int(os.getenv("MT5_LOGIN", "0")),
        mt5_password=os.getenv("MT5_PASSWORD", ""),
        mt5_server=os.getenv("MT5_SERVER", ""),

        # Trading
        default_lot_size=float(os.getenv("DEFAULT_LOT_SIZE", "0.01")),
        risk_percentage=float(os.getenv("RISK_PERCENTAGE", "1.0")),
        max_slippage=int(os.getenv("MAX_SLIPPAGE", "10")),
        magic_number=int(os.getenv("MAGIC_NUMBER", "123456")),
        symbol_mapping=symbol_mapping,

        # Application
        host=os.getenv("HOST", "0.0.0.0"),
        port=int(os.getenv("PORT", "8000")),
        dry_run=os.getenv("DRY_RUN", "false").lower() == "true",
        debug=os.getenv("DEBUG", "false").lower() == "true",
        database_path=os.getenv("DATABASE_PATH", "./data/trades.db"),
        log_level=os.getenv("LOG_LEVEL", "INFO"),
        log_file=os.getenv("LOG_FILE", "./logs/app.log"),
    )

    return config


def ensure_directories(config: AppConfig) -> None:
    """Ensure required directories exist."""

    # Database directory
    db_path = Path(config.database_path)
    db_path.parent.mkdir(parents=True, exist_ok=True)

    # Log directory
    log_path = Path(config.log_file)
    log_path.parent.mkdir(parents=True, exist_ok=True)


# Global config instance
CONFIG = get_config()
ensure_directories(CONFIG)
