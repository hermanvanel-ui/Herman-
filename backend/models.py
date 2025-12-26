"""Data models for the Telegram-MT5 trade copier."""

from datetime import datetime
from enum import Enum
from typing import Optional, List
from pydantic import BaseModel, Field


class TradeDirection(str, Enum):
    """Trade direction."""
    BUY = "BUY"
    SELL = "SELL"


class OrderType(str, Enum):
    """Order type."""
    MARKET = "MARKET"
    LIMIT = "LIMIT"
    STOP = "STOP"


class SignalAction(str, Enum):
    """Signal action type."""
    OPEN = "OPEN"
    CLOSE = "CLOSE"
    MODIFY = "MODIFY"
    PARTIAL_CLOSE = "PARTIAL_CLOSE"
    MOVE_SL_TO_BE = "MOVE_SL_TO_BE"


class TradeStatus(str, Enum):
    """Trade execution status."""
    PENDING = "PENDING"
    PARSED = "PARSED"
    EXECUTED = "EXECUTED"
    FAILED = "FAILED"
    SKIPPED = "SKIPPED"


class ParsedSignal(BaseModel):
    """Parsed trading signal from Telegram."""

    # Message metadata
    message_id: int
    message_text: str
    message_hash: str
    timestamp: datetime

    # Signal data
    action: SignalAction
    direction: Optional[TradeDirection] = None
    symbol: Optional[str] = None
    entry_price: Optional[float] = None
    stop_loss: Optional[float] = None
    take_profits: List[float] = Field(default_factory=list)

    # Order type
    order_type: OrderType = OrderType.MARKET

    # Modification data (for MODIFY, CLOSE, etc.)
    close_percentage: Optional[float] = None  # For partial close

    # Metadata
    raw_data: dict = Field(default_factory=dict)
    confidence: float = 1.0  # Parsing confidence (0-1)

    class Config:
        use_enum_values = True


class MT5Order(BaseModel):
    """MT5 order details."""

    symbol: str
    direction: TradeDirection
    volume: float
    entry_price: Optional[float] = None
    stop_loss: Optional[float] = None
    take_profit: Optional[float] = None
    order_type: OrderType = OrderType.MARKET
    magic_number: int = 0
    comment: str = ""
    slippage: int = 10

    class Config:
        use_enum_values = True


class MT5OrderResult(BaseModel):
    """Result of MT5 order execution."""

    success: bool
    ticket: Optional[int] = None
    price: Optional[float] = None
    volume: Optional[float] = None
    error_code: Optional[int] = None
    error_message: Optional[str] = None
    retcode: Optional[int] = None

    class Config:
        use_enum_values = True


class TradeRecord(BaseModel):
    """Database record for a trade."""

    id: Optional[int] = None
    message_id: int
    message_hash: str
    message_text: str
    timestamp: datetime

    # Parsed signal
    action: SignalAction
    symbol: Optional[str] = None
    direction: Optional[TradeDirection] = None
    entry_price: Optional[float] = None
    stop_loss: Optional[float] = None
    take_profit: Optional[float] = None

    # Execution
    status: TradeStatus
    mt5_ticket: Optional[int] = None
    executed_price: Optional[float] = None
    executed_volume: Optional[float] = None
    error_message: Optional[str] = None

    # Timestamps
    parsed_at: Optional[datetime] = None
    executed_at: Optional[datetime] = None

    class Config:
        use_enum_values = True


class SystemStatus(BaseModel):
    """Overall system status."""

    # Telegram
    telegram_connected: bool = False
    telegram_channel: Optional[str] = None
    telegram_last_message_id: Optional[int] = None
    telegram_last_check: Optional[datetime] = None
    telegram_error: Optional[str] = None

    # MT5
    mt5_connected: bool = False
    mt5_account: Optional[int] = None
    mt5_server: Optional[str] = None
    mt5_balance: Optional[float] = None
    mt5_equity: Optional[float] = None
    mt5_error: Optional[str] = None

    # Application
    app_uptime: Optional[float] = None
    app_mode: str = "LIVE"  # LIVE or DRY_RUN
    total_signals: int = 0
    total_executed: int = 0
    total_failed: int = 0

    # Recent errors
    recent_errors: List[dict] = Field(default_factory=list)

    class Config:
        use_enum_values = True


class AppConfig(BaseModel):
    """Application configuration."""

    # Telegram
    telegram_bot_token: Optional[str] = None
    telegram_api_id: Optional[int] = None
    telegram_api_hash: Optional[str] = None
    telegram_phone: Optional[str] = None
    telegram_channel_id: str
    use_telegram_bot: bool = True

    # MT5
    mt5_login: int
    mt5_password: str
    mt5_server: str

    # Trading
    default_lot_size: float = 0.01
    risk_percentage: float = 1.0
    max_slippage: int = 10
    magic_number: int = 123456
    symbol_mapping: dict = Field(default_factory=dict)

    # Application
    host: str = "0.0.0.0"
    port: int = 8000
    dry_run: bool = False
    debug: bool = False
    database_path: str = "./data/trades.db"
    log_level: str = "INFO"
    log_file: str = "./logs/app.log"

    class Config:
        use_enum_values = True
