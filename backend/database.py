"""Database management for trade records and anti-duplicate tracking."""

import hashlib
import sqlite3
from datetime import datetime
from typing import List, Optional
from pathlib import Path
import logging

from backend.models import ParsedSignal, TradeRecord, TradeStatus, SignalAction

logger = logging.getLogger(__name__)


class TradeDatabase:
    """SQLite database for trade records."""

    def __init__(self, db_path: str):
        """Initialize database connection."""
        self.db_path = db_path

        # Ensure directory exists
        Path(db_path).parent.mkdir(parents=True, exist_ok=True)

        # Initialize schema
        self._init_schema()

    def _init_schema(self):
        """Create database schema if not exists."""
        with sqlite3.connect(self.db_path) as conn:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS trades (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    message_id INTEGER NOT NULL,
                    message_hash TEXT NOT NULL UNIQUE,
                    message_text TEXT NOT NULL,
                    timestamp TIMESTAMP NOT NULL,

                    -- Parsed signal
                    action TEXT NOT NULL,
                    symbol TEXT,
                    direction TEXT,
                    entry_price REAL,
                    stop_loss REAL,
                    take_profit REAL,

                    -- Execution
                    status TEXT NOT NULL,
                    mt5_ticket INTEGER,
                    executed_price REAL,
                    executed_volume REAL,
                    error_message TEXT,

                    -- Timestamps
                    parsed_at TIMESTAMP,
                    executed_at TIMESTAMP,

                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)

            # Indexes for performance
            conn.execute(
                "CREATE INDEX IF NOT EXISTS idx_message_hash ON trades(message_hash)"
            )
            conn.execute(
                "CREATE INDEX IF NOT EXISTS idx_message_id ON trades(message_id)"
            )
            conn.execute(
                "CREATE INDEX IF NOT EXISTS idx_status ON trades(status)"
            )
            conn.execute(
                "CREATE INDEX IF NOT EXISTS idx_mt5_ticket ON trades(mt5_ticket)"
            )

            conn.commit()

    @staticmethod
    def compute_message_hash(message_id: int, message_text: str) -> str:
        """Compute unique hash for a message."""
        data = f"{message_id}:{message_text}"
        return hashlib.sha256(data.encode()).hexdigest()

    def is_duplicate(self, message_hash: str) -> bool:
        """Check if message has already been processed."""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.execute(
                "SELECT COUNT(*) FROM trades WHERE message_hash = ?",
                (message_hash,)
            )
            count = cursor.fetchone()[0]
            return count > 0

    def save_parsed_signal(self, signal: ParsedSignal, status: TradeStatus) -> int:
        """Save parsed signal to database."""

        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.execute("""
                INSERT INTO trades (
                    message_id, message_hash, message_text, timestamp,
                    action, symbol, direction, entry_price, stop_loss, take_profit,
                    status, parsed_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                signal.message_id,
                signal.message_hash,
                signal.message_text,
                signal.timestamp,
                signal.action.value,
                signal.symbol,
                signal.direction.value if signal.direction else None,
                signal.entry_price,
                signal.stop_loss,
                signal.take_profits[0] if signal.take_profits else None,
                status.value,
                datetime.now()
            ))
            conn.commit()
            return cursor.lastrowid

    def update_execution(
        self,
        record_id: int,
        status: TradeStatus,
        mt5_ticket: Optional[int] = None,
        executed_price: Optional[float] = None,
        executed_volume: Optional[float] = None,
        error_message: Optional[str] = None
    ):
        """Update trade record with execution results."""

        with sqlite3.connect(self.db_path) as conn:
            conn.execute("""
                UPDATE trades
                SET status = ?,
                    mt5_ticket = ?,
                    executed_price = ?,
                    executed_volume = ?,
                    error_message = ?,
                    executed_at = ?
                WHERE id = ?
            """, (
                status.value,
                mt5_ticket,
                executed_price,
                executed_volume,
                error_message,
                datetime.now(),
                record_id
            ))
            conn.commit()

    def get_trade_by_message_hash(self, message_hash: str) -> Optional[TradeRecord]:
        """Get trade record by message hash."""

        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.execute(
                "SELECT * FROM trades WHERE message_hash = ?",
                (message_hash,)
            )
            row = cursor.fetchone()

            if row:
                return self._row_to_record(row)
            return None

    def get_recent_trades(self, limit: int = 100) -> List[TradeRecord]:
        """Get recent trade records."""

        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.execute(
                "SELECT * FROM trades ORDER BY timestamp DESC LIMIT ?",
                (limit,)
            )
            rows = cursor.fetchall()
            return [self._row_to_record(row) for row in rows]

    def get_stats(self) -> dict:
        """Get database statistics."""

        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.execute("""
                SELECT
                    COUNT(*) as total,
                    SUM(CASE WHEN status = 'EXECUTED' THEN 1 ELSE 0 END) as executed,
                    SUM(CASE WHEN status = 'FAILED' THEN 1 ELSE 0 END) as failed,
                    SUM(CASE WHEN status = 'SKIPPED' THEN 1 ELSE 0 END) as skipped
                FROM trades
            """)
            row = cursor.fetchone()

            return {
                "total_signals": row[0] or 0,
                "total_executed": row[1] or 0,
                "total_failed": row[2] or 0,
                "total_skipped": row[3] or 0
            }

    def _row_to_record(self, row: sqlite3.Row) -> TradeRecord:
        """Convert database row to TradeRecord."""

        return TradeRecord(
            id=row["id"],
            message_id=row["message_id"],
            message_hash=row["message_hash"],
            message_text=row["message_text"],
            timestamp=datetime.fromisoformat(row["timestamp"]),
            action=SignalAction(row["action"]),
            symbol=row["symbol"],
            direction=row["direction"],
            entry_price=row["entry_price"],
            stop_loss=row["stop_loss"],
            take_profit=row["take_profit"],
            status=TradeStatus(row["status"]),
            mt5_ticket=row["mt5_ticket"],
            executed_price=row["executed_price"],
            executed_volume=row["executed_volume"],
            error_message=row["error_message"],
            parsed_at=datetime.fromisoformat(row["parsed_at"]) if row["parsed_at"] else None,
            executed_at=datetime.fromisoformat(row["executed_at"]) if row["executed_at"] else None
        )
