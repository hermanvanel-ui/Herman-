"""Signal parser for extracting trading information from Telegram messages."""

import re
from datetime import datetime
from typing import Optional, List, Tuple
import logging

from backend.models import (
    ParsedSignal,
    SignalAction,
    TradeDirection,
    OrderType
)
from backend.database import TradeDatabase

logger = logging.getLogger(__name__)


class SignalParser:
    """Parse trading signals from Telegram messages."""

    def __init__(self, symbol_mapping: dict = None):
        """Initialize parser with symbol mapping."""
        self.symbol_mapping = symbol_mapping or {}

        # Compile regex patterns
        self._compile_patterns()

    def _compile_patterns(self):
        """Compile regex patterns for signal parsing."""

        # Direction patterns
        self.buy_pattern = re.compile(
            r'\b(BUY|LONG|buy|long)\b',
            re.IGNORECASE
        )
        self.sell_pattern = re.compile(
            r'\b(SELL|SHORT|sell|short)\b',
            re.IGNORECASE
        )

        # Symbol patterns (common forex pairs and commodities)
        self.symbol_pattern = re.compile(
            r'\b([A-Z]{6}|GOLD|SILVER|XAUUSD|XAGUSD|BTCUSD|ETHUSD|[A-Z]{2}USD|USD[A-Z]{2}|'
            r'GU|EU|UJ|UC|NU|AU|GBP/USD|EUR/USD|USD/JPY|USD/CAD|NZD/USD|AUD/USD)\b',
            re.IGNORECASE
        )

        # Price patterns
        self.price_pattern = re.compile(
            r'(?:@|at|entry|price)?[\s:]*(\d+\.?\d*)',
            re.IGNORECASE
        )

        # SL pattern (multiple formats)
        self.sl_pattern = re.compile(
            r'(?:SL|sl|S\.L|stoploss|stop loss|stop)[\s:@]*(\d+\.?\d*)',
            re.IGNORECASE
        )

        # TP pattern (multiple TPs)
        self.tp_pattern = re.compile(
            r'(?:TP|tp|T\.P|takeprofit|take profit|target)[\s]*(\d+)?[\s:@]*(\d+\.?\d*)',
            re.IGNORECASE
        )

        # Range pattern (e.g., "2050-2052")
        self.range_pattern = re.compile(
            r'(\d+\.?\d*)\s*[-–]\s*(\d+\.?\d*)',
            re.IGNORECASE
        )

        # Close patterns
        self.close_pattern = re.compile(
            r'\b(close|exit|book profit)\b',
            re.IGNORECASE
        )

        # Partial close pattern
        self.partial_close_pattern = re.compile(
            r'\b(close|exit)\s*(\d+)%',
            re.IGNORECASE
        )

        # Move SL to BE pattern
        self.move_be_pattern = re.compile(
            r'\b(move|shift|put)\s*(SL|sl|stop|stoploss)\s*(to)?\s*(BE|breakeven|break even|entry)\b',
            re.IGNORECASE
        )

    def parse(self, message_id: int, message_text: str) -> Optional[ParsedSignal]:
        """
        Parse a Telegram message into a trading signal.

        Args:
            message_id: Telegram message ID
            message_text: Message text content

        Returns:
            ParsedSignal if successfully parsed, None otherwise
        """

        message_text = message_text.strip()

        # Compute hash for anti-duplicate
        message_hash = TradeDatabase.compute_message_hash(message_id, message_text)

        # Detect signal action
        action = self._detect_action(message_text)

        if action == SignalAction.OPEN:
            return self._parse_open_signal(message_id, message_text, message_hash)
        elif action == SignalAction.CLOSE:
            return self._parse_close_signal(message_id, message_text, message_hash)
        elif action == SignalAction.PARTIAL_CLOSE:
            return self._parse_partial_close_signal(message_id, message_text, message_hash)
        elif action == SignalAction.MOVE_SL_TO_BE:
            return self._parse_move_be_signal(message_id, message_text, message_hash)
        else:
            logger.debug(f"Could not detect action in message: {message_text[:100]}")
            return None

    def _detect_action(self, text: str) -> Optional[SignalAction]:
        """Detect the type of signal action."""

        # Check for move SL to BE
        if self.move_be_pattern.search(text):
            return SignalAction.MOVE_SL_TO_BE

        # Check for partial close
        if self.partial_close_pattern.search(text):
            return SignalAction.PARTIAL_CLOSE

        # Check for close
        if self.close_pattern.search(text):
            return SignalAction.CLOSE

        # Check for open (BUY/SELL present)
        if self.buy_pattern.search(text) or self.sell_pattern.search(text):
            return SignalAction.OPEN

        return None

    def _parse_open_signal(
        self,
        message_id: int,
        message_text: str,
        message_hash: str
    ) -> Optional[ParsedSignal]:
        """Parse an OPEN signal."""

        # Detect direction
        direction = None
        if self.buy_pattern.search(message_text):
            direction = TradeDirection.BUY
        elif self.sell_pattern.search(message_text):
            direction = TradeDirection.SELL

        if not direction:
            logger.warning(f"Could not detect direction in: {message_text[:100]}")
            return None

        # Extract symbol
        symbol = self._extract_symbol(message_text)
        if not symbol:
            logger.warning(f"Could not extract symbol from: {message_text[:100]}")
            return None

        # Normalize symbol
        symbol = self._normalize_symbol(symbol)

        # Extract entry price (optional for market orders)
        entry_price = self._extract_entry_price(message_text)

        # Extract SL
        stop_loss = self._extract_stop_loss(message_text)

        # Extract TPs
        take_profits = self._extract_take_profits(message_text)

        # Determine order type
        order_type = OrderType.MARKET
        if entry_price and self._is_pending_order(message_text):
            order_type = OrderType.LIMIT  # Simplified, could be STOP too

        signal = ParsedSignal(
            message_id=message_id,
            message_text=message_text,
            message_hash=message_hash,
            timestamp=datetime.now(),
            action=SignalAction.OPEN,
            direction=direction,
            symbol=symbol,
            entry_price=entry_price,
            stop_loss=stop_loss,
            take_profits=take_profits,
            order_type=order_type,
            confidence=self._calculate_confidence(
                symbol, direction, entry_price, stop_loss, take_profits
            )
        )

        return signal

    def _parse_close_signal(
        self,
        message_id: int,
        message_text: str,
        message_hash: str
    ) -> ParsedSignal:
        """Parse a CLOSE signal."""

        # Try to extract symbol
        symbol = self._extract_symbol(message_text)

        signal = ParsedSignal(
            message_id=message_id,
            message_text=message_text,
            message_hash=message_hash,
            timestamp=datetime.now(),
            action=SignalAction.CLOSE,
            symbol=symbol,  # May be None
            confidence=0.8 if symbol else 0.5
        )

        return signal

    def _parse_partial_close_signal(
        self,
        message_id: int,
        message_text: str,
        message_hash: str
    ) -> Optional[ParsedSignal]:
        """Parse a PARTIAL_CLOSE signal."""

        # Extract percentage
        match = self.partial_close_pattern.search(message_text)
        if not match:
            return None

        percentage = float(match.group(2))

        # Try to extract symbol
        symbol = self._extract_symbol(message_text)

        signal = ParsedSignal(
            message_id=message_id,
            message_text=message_text,
            message_hash=message_hash,
            timestamp=datetime.now(),
            action=SignalAction.PARTIAL_CLOSE,
            symbol=symbol,
            close_percentage=percentage,
            confidence=0.7 if symbol else 0.5
        )

        return signal

    def _parse_move_be_signal(
        self,
        message_id: int,
        message_text: str,
        message_hash: str
    ) -> ParsedSignal:
        """Parse a MOVE_SL_TO_BE signal."""

        # Try to extract symbol
        symbol = self._extract_symbol(message_text)

        signal = ParsedSignal(
            message_id=message_id,
            message_text=message_text,
            message_hash=message_hash,
            timestamp=datetime.now(),
            action=SignalAction.MOVE_SL_TO_BE,
            symbol=symbol,
            confidence=0.8 if symbol else 0.6
        )

        return signal

    def _extract_symbol(self, text: str) -> Optional[str]:
        """Extract trading symbol from text."""

        match = self.symbol_pattern.search(text)
        if match:
            return match.group(1).upper()
        return None

    def _normalize_symbol(self, symbol: str) -> str:
        """Normalize symbol using mapping."""

        symbol = symbol.upper()

        # Check mapping
        if symbol in self.symbol_mapping:
            return self.symbol_mapping[symbol]

        # Common normalizations
        normalizations = {
            "GOLD": "XAUUSD",
            "SILVER": "XAGUSD",
            "GU": "GBPUSD",
            "EU": "EURUSD",
            "UJ": "USDJPY",
            "UC": "USDCAD",
            "NU": "NZDUSD",
            "AU": "AUDUSD",
        }

        if symbol in normalizations:
            return normalizations[symbol]

        # Remove slashes (GBP/USD -> GBPUSD)
        symbol = symbol.replace("/", "")

        return symbol

    def _extract_entry_price(self, text: str) -> Optional[float]:
        """Extract entry price from text."""

        # Try to find price after @ or "at" or "entry"
        patterns = [
            r'(?:@|at|entry)[\s:]*(\d+\.?\d*)',
            r'(?:price)[\s:]*(\d+\.?\d*)',
        ]

        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                try:
                    return float(match.group(1))
                except ValueError:
                    pass

        # Check for range pattern (take midpoint)
        match = self.range_pattern.search(text)
        if match:
            try:
                low = float(match.group(1))
                high = float(match.group(2))
                return (low + high) / 2
            except ValueError:
                pass

        return None

    def _extract_stop_loss(self, text: str) -> Optional[float]:
        """Extract stop loss from text."""

        match = self.sl_pattern.search(text)
        if match:
            try:
                return float(match.group(1))
            except ValueError:
                pass

        return None

    def _extract_take_profits(self, text: str) -> List[float]:
        """Extract take profit levels from text."""

        tps = []

        # Find all TP matches
        for match in self.tp_pattern.finditer(text):
            try:
                price = float(match.group(2))
                tps.append(price)
            except (ValueError, IndexError):
                pass

        return sorted(tps)  # Return sorted

    def _is_pending_order(self, text: str) -> bool:
        """Check if this is a pending order."""

        pending_keywords = [
            r'\blimit\b',
            r'\bstop\b',
            r'\bpending\b',
            r'\bzone\b',
            r'\brange\b',
        ]

        for keyword in pending_keywords:
            if re.search(keyword, text, re.IGNORECASE):
                return True

        return False

    def _calculate_confidence(
        self,
        symbol: Optional[str],
        direction: Optional[TradeDirection],
        entry_price: Optional[float],
        stop_loss: Optional[float],
        take_profits: List[float]
    ) -> float:
        """Calculate parsing confidence score (0-1)."""

        confidence = 0.0

        # Symbol is required
        if symbol:
            confidence += 0.3
        else:
            return 0.0

        # Direction is required
        if direction:
            confidence += 0.3
        else:
            return 0.0

        # SL is important
        if stop_loss:
            confidence += 0.2

        # TP is nice to have
        if take_profits:
            confidence += 0.1

        # Entry price
        if entry_price:
            confidence += 0.1

        return min(confidence, 1.0)


def is_likely_signal(text: str) -> bool:
    """
    Quick check if a message is likely to contain a trading signal.
    Used for filtering before full parsing.
    """

    text_lower = text.lower()

    # Must contain trading keywords
    trading_keywords = [
        'buy', 'sell', 'long', 'short',
        'sl', 'tp', 'stop loss', 'take profit',
        'xauusd', 'eurusd', 'gbpusd', 'gold',
        'close', 'exit', 'breakeven', 'move sl'
    ]

    return any(keyword in text_lower for keyword in trading_keywords)
