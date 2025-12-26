"""MetaTrader 5 bridge for executing trades."""

import logging
from typing import Optional, List, Dict
from datetime import datetime
import MetaTrader5 as mt5

from backend.models import (
    MT5Order,
    MT5OrderResult,
    TradeDirection,
    OrderType,
    ParsedSignal,
    SignalAction
)

logger = logging.getLogger(__name__)


class MT5Bridge:
    """Bridge to MetaTrader 5 for trade execution."""

    def __init__(
        self,
        login: int,
        password: str,
        server: str,
        magic_number: int = 0,
        dry_run: bool = False
    ):
        """Initialize MT5 connection."""
        self.login = login
        self.password = password
        self.server = server
        self.magic_number = magic_number
        self.dry_run = dry_run
        self.connected = False

    def connect(self) -> bool:
        """Connect to MT5 terminal."""

        if self.dry_run:
            logger.info("DRY RUN MODE: Simulating MT5 connection")
            self.connected = True
            return True

        try:
            # Initialize MT5
            if not mt5.initialize():
                error = mt5.last_error()
                logger.error(f"MT5 initialization failed: {error}")
                return False

            # Login
            authorized = mt5.login(
                login=self.login,
                password=self.password,
                server=self.server
            )

            if not authorized:
                error = mt5.last_error()
                logger.error(f"MT5 login failed: {error}")
                mt5.shutdown()
                return False

            self.connected = True
            account_info = mt5.account_info()
            logger.info(
                f"Connected to MT5 - Account: {account_info.login}, "
                f"Server: {account_info.server}, "
                f"Balance: {account_info.balance}"
            )
            return True

        except Exception as e:
            logger.error(f"MT5 connection error: {e}")
            return False

    def disconnect(self):
        """Disconnect from MT5."""

        if self.dry_run:
            logger.info("DRY RUN MODE: Simulating MT5 disconnect")
            self.connected = False
            return

        if self.connected:
            mt5.shutdown()
            self.connected = False
            logger.info("Disconnected from MT5")

    def is_connected(self) -> bool:
        """Check if connected to MT5."""

        if self.dry_run:
            return self.connected

        if not self.connected:
            return False

        # Check if terminal is still alive
        account_info = mt5.account_info()
        return account_info is not None

    def get_account_info(self) -> Optional[Dict]:
        """Get MT5 account information."""

        if self.dry_run:
            return {
                "login": 12345678,
                "server": "Demo-Server",
                "balance": 10000.0,
                "equity": 10000.0,
                "margin": 0.0,
                "free_margin": 10000.0,
                "currency": "USD"
            }

        if not self.is_connected():
            return None

        try:
            account_info = mt5.account_info()
            if account_info is None:
                return None

            return {
                "login": account_info.login,
                "server": account_info.server,
                "balance": account_info.balance,
                "equity": account_info.equity,
                "margin": account_info.margin,
                "free_margin": account_info.margin_free,
                "currency": account_info.currency
            }

        except Exception as e:
            logger.error(f"Error getting account info: {e}")
            return None

    def execute_order(self, order: MT5Order) -> MT5OrderResult:
        """Execute a trading order."""

        if not self.is_connected():
            return MT5OrderResult(
                success=False,
                error_message="Not connected to MT5"
            )

        # Dry run mode
        if self.dry_run:
            logger.info(f"DRY RUN: Would execute order: {order}")
            return MT5OrderResult(
                success=True,
                ticket=999999,
                price=order.entry_price or 1.0,
                volume=order.volume
            )

        # Validate symbol
        symbol_info = mt5.symbol_info(order.symbol)
        if symbol_info is None:
            return MT5OrderResult(
                success=False,
                error_message=f"Symbol {order.symbol} not found"
            )

        if not symbol_info.visible:
            # Try to make symbol visible
            if not mt5.symbol_select(order.symbol, True):
                return MT5OrderResult(
                    success=False,
                    error_message=f"Failed to select symbol {order.symbol}"
                )

        # Normalize price and volume
        volume = self._normalize_volume(order.volume, symbol_info)
        if volume == 0:
            return MT5OrderResult(
                success=False,
                error_message=f"Invalid volume after normalization: {order.volume}"
            )

        # Prepare request
        request = self._build_request(order, symbol_info, volume)

        # Send order
        try:
            result = mt5.order_send(request)

            if result is None:
                error = mt5.last_error()
                return MT5OrderResult(
                    success=False,
                    error_code=error[0] if error else None,
                    error_message=f"Order failed: {error[1] if error else 'Unknown error'}"
                )

            if result.retcode != mt5.TRADE_RETCODE_DONE:
                return MT5OrderResult(
                    success=False,
                    retcode=result.retcode,
                    error_message=f"Order rejected: {result.comment}"
                )

            # Success
            logger.info(
                f"Order executed successfully: "
                f"Ticket={result.order}, "
                f"Symbol={order.symbol}, "
                f"Volume={result.volume}, "
                f"Price={result.price}"
            )

            return MT5OrderResult(
                success=True,
                ticket=result.order,
                price=result.price,
                volume=result.volume,
                retcode=result.retcode
            )

        except Exception as e:
            logger.error(f"Order execution error: {e}")
            return MT5OrderResult(
                success=False,
                error_message=f"Exception: {str(e)}"
            )

    def _build_request(self, order: MT5Order, symbol_info, volume: float) -> dict:
        """Build MT5 order request."""

        # Determine action and type
        if order.direction == TradeDirection.BUY:
            action = mt5.TRADE_ACTION_DEAL
            order_type = mt5.ORDER_TYPE_BUY
            price = mt5.symbol_info_tick(order.symbol).ask
        else:
            action = mt5.TRADE_ACTION_DEAL
            order_type = mt5.ORDER_TYPE_SELL
            price = mt5.symbol_info_tick(order.symbol).bid

        # Build request
        request = {
            "action": action,
            "symbol": order.symbol,
            "volume": volume,
            "type": order_type,
            "price": price,
            "deviation": order.slippage,
            "magic": order.magic_number,
            "comment": order.comment,
            "type_time": mt5.ORDER_TIME_GTC,
            "type_filling": mt5.ORDER_FILLING_IOC,
        }

        # Add SL/TP if provided
        if order.stop_loss:
            request["sl"] = order.stop_loss

        if order.take_profit:
            request["tp"] = order.take_profit

        return request

    def _normalize_volume(self, volume: float, symbol_info) -> float:
        """Normalize volume according to symbol requirements."""

        min_volume = symbol_info.volume_min
        max_volume = symbol_info.volume_max
        volume_step = symbol_info.volume_step

        # Clamp to min/max
        volume = max(min_volume, min(volume, max_volume))

        # Round to step
        if volume_step > 0:
            volume = round(volume / volume_step) * volume_step

        return volume

    def close_position(self, symbol: str, percentage: float = 100.0) -> MT5OrderResult:
        """Close a position (full or partial)."""

        if not self.is_connected():
            return MT5OrderResult(
                success=False,
                error_message="Not connected to MT5"
            )

        if self.dry_run:
            logger.info(f"DRY RUN: Would close {percentage}% of {symbol}")
            return MT5OrderResult(success=True, ticket=999999)

        # Get positions for this symbol
        positions = mt5.positions_get(symbol=symbol)

        if positions is None or len(positions) == 0:
            return MT5OrderResult(
                success=False,
                error_message=f"No open positions for {symbol}"
            )

        # Close each position (or partial)
        results = []
        for position in positions:
            # Filter by magic number if set
            if self.magic_number > 0 and position.magic != self.magic_number:
                continue

            volume_to_close = position.volume * (percentage / 100.0)

            # Create close request
            request = {
                "action": mt5.TRADE_ACTION_DEAL,
                "symbol": symbol,
                "volume": volume_to_close,
                "type": mt5.ORDER_TYPE_BUY if position.type == mt5.ORDER_TYPE_SELL else mt5.ORDER_TYPE_SELL,
                "position": position.ticket,
                "price": mt5.symbol_info_tick(symbol).bid if position.type == mt5.ORDER_TYPE_SELL else mt5.symbol_info_tick(symbol).ask,
                "deviation": 10,
                "magic": self.magic_number,
                "comment": f"Close {percentage}%",
                "type_time": mt5.ORDER_TIME_GTC,
                "type_filling": mt5.ORDER_FILLING_IOC,
            }

            result = mt5.order_send(request)
            results.append(result)

            if result.retcode == mt5.TRADE_RETCODE_DONE:
                logger.info(f"Closed {percentage}% of position {position.ticket}")
            else:
                logger.error(f"Failed to close position {position.ticket}: {result.comment}")

        # Return result of first close (simplified)
        if results and results[0].retcode == mt5.TRADE_RETCODE_DONE:
            return MT5OrderResult(
                success=True,
                ticket=results[0].order,
                price=results[0].price,
                volume=results[0].volume
            )

        return MT5OrderResult(
            success=False,
            error_message="Failed to close positions"
        )

    def modify_position_sl(self, symbol: str, new_sl: float) -> MT5OrderResult:
        """Modify stop loss of a position."""

        if not self.is_connected():
            return MT5OrderResult(
                success=False,
                error_message="Not connected to MT5"
            )

        if self.dry_run:
            logger.info(f"DRY RUN: Would modify SL of {symbol} to {new_sl}")
            return MT5OrderResult(success=True, ticket=999999)

        # Get positions for this symbol
        positions = mt5.positions_get(symbol=symbol)

        if positions is None or len(positions) == 0:
            return MT5OrderResult(
                success=False,
                error_message=f"No open positions for {symbol}"
            )

        # Modify each position
        for position in positions:
            # Filter by magic number
            if self.magic_number > 0 and position.magic != self.magic_number:
                continue

            request = {
                "action": mt5.TRADE_ACTION_SLTP,
                "symbol": symbol,
                "position": position.ticket,
                "sl": new_sl,
                "tp": position.tp,
            }

            result = mt5.order_send(request)

            if result.retcode == mt5.TRADE_RETCODE_DONE:
                logger.info(f"Modified SL of position {position.ticket} to {new_sl}")
                return MT5OrderResult(
                    success=True,
                    ticket=position.ticket
                )
            else:
                logger.error(f"Failed to modify SL: {result.comment}")

        return MT5OrderResult(
            success=False,
            error_message="Failed to modify SL"
        )

    def move_sl_to_breakeven(self, symbol: str) -> MT5OrderResult:
        """Move stop loss to breakeven (entry price)."""

        if not self.is_connected():
            return MT5OrderResult(
                success=False,
                error_message="Not connected to MT5"
            )

        # Get positions for this symbol
        if self.dry_run:
            logger.info(f"DRY RUN: Would move SL to BE for {symbol}")
            return MT5OrderResult(success=True, ticket=999999)

        positions = mt5.positions_get(symbol=symbol)

        if positions is None or len(positions) == 0:
            return MT5OrderResult(
                success=False,
                error_message=f"No open positions for {symbol}"
            )

        # Move SL to entry for each position
        for position in positions:
            # Filter by magic number
            if self.magic_number > 0 and position.magic != self.magic_number:
                continue

            # Use entry price as new SL
            new_sl = position.price_open

            return self.modify_position_sl(symbol, new_sl)

        return MT5OrderResult(
            success=False,
            error_message="No positions found to modify"
        )

    def get_positions(self, symbol: Optional[str] = None) -> List[dict]:
        """Get open positions."""

        if self.dry_run:
            return []

        if not self.is_connected():
            return []

        try:
            if symbol:
                positions = mt5.positions_get(symbol=symbol)
            else:
                positions = mt5.positions_get()

            if positions is None:
                return []

            # Filter by magic number if set
            if self.magic_number > 0:
                positions = [p for p in positions if p.magic == self.magic_number]

            return [
                {
                    "ticket": p.ticket,
                    "symbol": p.symbol,
                    "type": "BUY" if p.type == mt5.ORDER_TYPE_BUY else "SELL",
                    "volume": p.volume,
                    "price_open": p.price_open,
                    "sl": p.sl,
                    "tp": p.tp,
                    "profit": p.profit,
                    "comment": p.comment
                }
                for p in positions
            ]

        except Exception as e:
            logger.error(f"Error getting positions: {e}")
            return []
