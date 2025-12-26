"""Unit tests for signal parser."""

import pytest
from backend.signal_parser import SignalParser, is_likely_signal
from backend.models import SignalAction, TradeDirection, OrderType


class TestSignalParser:
    """Test suite for SignalParser."""

    def setup_method(self):
        """Setup test fixtures."""
        self.parser = SignalParser(symbol_mapping={
            "GOLD": "XAUUSD",
            "GU": "GBPUSD",
            "EU": "EURUSD"
        })

    def test_basic_buy_signal(self):
        """Test parsing basic BUY signal."""
        signal = self.parser.parse(
            message_id=1,
            message_text="BUY XAUUSD @ 2054 SL 2046 TP 2070"
        )

        assert signal is not None
        assert signal.action == SignalAction.OPEN
        assert signal.direction == TradeDirection.BUY
        assert signal.symbol == "XAUUSD"
        assert signal.entry_price == 2054
        assert signal.stop_loss == 2046
        assert signal.take_profits == [2070]

    def test_basic_sell_signal(self):
        """Test parsing basic SELL signal."""
        signal = self.parser.parse(
            message_id=2,
            message_text="SELL EURUSD @ 1.0900 SL 1.0930 TP 1.0870"
        )

        assert signal is not None
        assert signal.action == SignalAction.OPEN
        assert signal.direction == TradeDirection.SELL
        assert signal.symbol == "EURUSD"
        assert signal.entry_price == 1.0900
        assert signal.stop_loss == 1.0930
        assert signal.take_profits == [1.0870]

    def test_lowercase_signal(self):
        """Test parsing lowercase signal."""
        signal = self.parser.parse(
            message_id=3,
            message_text="sell eurusd now SL:1.0920 TP:1.0880"
        )

        assert signal is not None
        assert signal.direction == TradeDirection.SELL
        assert signal.symbol == "EURUSD"

    def test_symbol_mapping(self):
        """Test symbol mapping."""
        signal = self.parser.parse(
            message_id=4,
            message_text="BUY GOLD @ 2055 SL 2045 TP 2070"
        )

        assert signal is not None
        assert signal.symbol == "XAUUSD"  # Mapped from GOLD

    def test_symbol_shortcut(self):
        """Test symbol shortcut (GU -> GBPUSD)."""
        signal = self.parser.parse(
            message_id=5,
            message_text="GU BUY @ 1.2680 SL: 1.2650 TP: 1.2730"
        )

        assert signal is not None
        assert signal.symbol == "GBPUSD"

    def test_multiple_tps(self):
        """Test parsing multiple take profit levels."""
        signal = self.parser.parse(
            message_id=6,
            message_text="SELL EURUSD @ 1.0900 SL 1.0930 TP1 1.0870 TP2 1.0850 TP3 1.0820"
        )

        assert signal is not None
        assert len(signal.take_profits) >= 2
        assert 1.0870 in signal.take_profits
        assert 1.0850 in signal.take_profits

    def test_market_order_no_entry(self):
        """Test parsing signal without entry price (market order)."""
        signal = self.parser.parse(
            message_id=7,
            message_text="BUY BTCUSD SL 42000 TP 48000"
        )

        assert signal is not None
        assert signal.direction == TradeDirection.BUY
        assert signal.entry_price is None  # Market order
        assert signal.stop_loss == 42000
        assert signal.take_profits == [48000]

    def test_close_signal(self):
        """Test parsing CLOSE signal."""
        signal = self.parser.parse(
            message_id=8,
            message_text="CLOSE XAUUSD"
        )

        assert signal is not None
        assert signal.action == SignalAction.CLOSE
        assert signal.symbol == "XAUUSD"

    def test_partial_close_signal(self):
        """Test parsing partial close signal."""
        signal = self.parser.parse(
            message_id=9,
            message_text="Close 50% EURUSD"
        )

        assert signal is not None
        assert signal.action == SignalAction.PARTIAL_CLOSE
        assert signal.close_percentage == 50
        assert signal.symbol == "EURUSD"

    def test_move_sl_to_be_signal(self):
        """Test parsing move SL to breakeven signal."""
        signal = self.parser.parse(
            message_id=10,
            message_text="Move SL to BE GBPUSD"
        )

        assert signal is not None
        assert signal.action == SignalAction.MOVE_SL_TO_BE
        assert signal.symbol == "GBPUSD"

    def test_move_sl_to_breakeven_variation(self):
        """Test parsing alternative move to breakeven format."""
        signal = self.parser.parse(
            message_id=11,
            message_text="XAUUSD move stop loss to entry"
        )

        assert signal is not None
        assert signal.action == SignalAction.MOVE_SL_TO_BE
        assert signal.symbol == "XAUUSD"

    def test_signal_with_extra_text(self):
        """Test parsing signal with additional text."""
        signal = self.parser.parse(
            message_id=12,
            message_text="""
            🔥 SIGNAL ALERT 🔥
            BUY EURUSD @ 1.0850
            SL: 1.0820
            TP: 1.0900
            Good luck!
            """
        )

        assert signal is not None
        assert signal.direction == TradeDirection.BUY
        assert signal.symbol == "EURUSD"
        assert signal.entry_price == 1.0850
        assert signal.stop_loss == 1.0820
        assert signal.take_profits == [1.0900]

    def test_pair_with_slash(self):
        """Test parsing pair with slash (GBP/USD)."""
        signal = self.parser.parse(
            message_id=13,
            message_text="BUY GBP/USD @ 1.2700 SL 1.2670 TP 1.2750"
        )

        assert signal is not None
        assert signal.symbol == "GBPUSD"  # Slash removed

    def test_range_entry(self):
        """Test parsing range entry."""
        signal = self.parser.parse(
            message_id=14,
            message_text="XAUUSD BUY 2050-2052 SL 2044 TP1 2060"
        )

        assert signal is not None
        # Should take midpoint of range
        assert signal.entry_price == 2051  # (2050 + 2052) / 2

    def test_long_short_notation(self):
        """Test parsing LONG/SHORT instead of BUY/SELL."""
        signal = self.parser.parse(
            message_id=15,
            message_text="LONG GOLD at 2055.5 stop loss 2047 take profit 2068"
        )

        assert signal is not None
        assert signal.direction == TradeDirection.BUY  # LONG = BUY
        assert signal.symbol == "XAUUSD"

    def test_invalid_message(self):
        """Test that non-signal messages return None."""
        signal = self.parser.parse(
            message_id=16,
            message_text="Good morning everyone! Have a great day."
        )

        assert signal is None

    def test_is_likely_signal_filter(self):
        """Test quick signal filter."""
        assert is_likely_signal("BUY XAUUSD @ 2054 SL 2046 TP 2070") is True
        assert is_likely_signal("SELL EURUSD now") is True
        assert is_likely_signal("Close GOLD") is True
        assert is_likely_signal("Move SL to BE") is True
        assert is_likely_signal("Good morning!") is False
        assert is_likely_signal("What's the weather like?") is False

    def test_confidence_score(self):
        """Test confidence scoring."""
        # Complete signal should have high confidence
        signal1 = self.parser.parse(
            message_id=17,
            message_text="BUY XAUUSD @ 2054 SL 2046 TP 2070"
        )
        assert signal1.confidence >= 0.8

        # Incomplete signal should have lower confidence
        signal2 = self.parser.parse(
            message_id=18,
            message_text="BUY XAUUSD"
        )
        assert signal2.confidence < 0.8

    def test_duplicate_hash(self):
        """Test that same message produces same hash."""
        signal1 = self.parser.parse(
            message_id=19,
            message_text="BUY XAUUSD @ 2054 SL 2046 TP 2070"
        )
        signal2 = self.parser.parse(
            message_id=19,
            message_text="BUY XAUUSD @ 2054 SL 2046 TP 2070"
        )

        assert signal1.message_hash == signal2.message_hash


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
