"""Main application orchestrating Telegram monitoring and MT5 execution."""

import asyncio
import logging
from datetime import datetime
from typing import Optional
from contextlib import asynccontextmanager

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, JSONResponse
import uvicorn

from backend.config import CONFIG
from backend.models import (
    ParsedSignal,
    MT5Order,
    TradeStatus,
    SystemStatus,
    SignalAction,
    TradeDirection,
    OrderType
)
from backend.database import TradeDatabase
from backend.signal_parser import SignalParser
from backend.mt5_bridge import MT5Bridge
from backend.telegram_client import TelegramMonitor

# Configure logging
logging.basicConfig(
    level=getattr(logging, CONFIG.log_level),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(CONFIG.log_file),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)


class TradeCopier:
    """Main trade copier orchestrator."""

    def __init__(self):
        """Initialize trade copier."""

        # Components
        self.db = TradeDatabase(CONFIG.database_path)
        self.parser = SignalParser(CONFIG.symbol_mapping)
        self.mt5 = MT5Bridge(
            login=CONFIG.mt5_login,
            password=CONFIG.mt5_password,
            server=CONFIG.mt5_server,
            magic_number=CONFIG.magic_number,
            dry_run=CONFIG.dry_run
        )
        self.telegram = TelegramMonitor(
            use_bot=CONFIG.use_telegram_bot,
            bot_token=CONFIG.telegram_bot_token,
            api_id=CONFIG.telegram_api_id,
            api_hash=CONFIG.telegram_api_hash,
            phone=CONFIG.telegram_phone,
            channel_id=CONFIG.telegram_channel_id,
            parser=self.parser,
            on_signal=self.handle_signal
        )

        # State
        self.start_time = datetime.now()
        self.recent_errors = []
        self.websocket_clients = []

    async def start(self):
        """Start the trade copier."""

        logger.info("Starting Trade Copier...")
        logger.info(f"Mode: {'DRY RUN' if CONFIG.dry_run else 'LIVE'}")

        # Connect to MT5
        logger.info("Connecting to MT5...")
        if not self.mt5.connect():
            logger.error("Failed to connect to MT5")
            raise RuntimeError("MT5 connection failed")

        # Start Telegram monitoring
        logger.info("Starting Telegram monitor...")
        await self.telegram.start()

        logger.info("Trade Copier started successfully")

    async def stop(self):
        """Stop the trade copier."""

        logger.info("Stopping Trade Copier...")

        # Stop Telegram
        await self.telegram.stop()

        # Disconnect MT5
        self.mt5.disconnect()

        logger.info("Trade Copier stopped")

    async def handle_signal(self, signal: ParsedSignal):
        """Handle a parsed trading signal."""

        logger.info(f"Handling signal: {signal.action} {signal.symbol}")

        try:
            # Check for duplicate
            if self.db.is_duplicate(signal.message_hash):
                logger.warning(f"Duplicate signal detected (hash: {signal.message_hash[:8]}...), skipping")
                return

            # Save to database
            record_id = self.db.save_parsed_signal(signal, TradeStatus.PARSED)

            # Execute based on action
            if signal.action == SignalAction.OPEN:
                await self._execute_open_signal(signal, record_id)
            elif signal.action == SignalAction.CLOSE:
                await self._execute_close_signal(signal, record_id)
            elif signal.action == SignalAction.PARTIAL_CLOSE:
                await self._execute_partial_close_signal(signal, record_id)
            elif signal.action == SignalAction.MOVE_SL_TO_BE:
                await self._execute_move_be_signal(signal, record_id)
            else:
                logger.warning(f"Unsupported action: {signal.action}")
                self.db.update_execution(
                    record_id,
                    TradeStatus.SKIPPED,
                    error_message="Unsupported action"
                )

            # Broadcast update to WebSocket clients
            await self._broadcast_status()

        except Exception as e:
            logger.error(f"Error handling signal: {e}", exc_info=True)
            self._add_error(str(e))

    async def _execute_open_signal(self, signal: ParsedSignal, record_id: int):
        """Execute an OPEN signal."""

        if not signal.symbol or not signal.direction:
            logger.error("Missing symbol or direction for OPEN signal")
            self.db.update_execution(
                record_id,
                TradeStatus.FAILED,
                error_message="Missing required fields"
            )
            return

        # Create MT5 order
        order = MT5Order(
            symbol=signal.symbol,
            direction=signal.direction,
            volume=CONFIG.default_lot_size,
            entry_price=signal.entry_price,
            stop_loss=signal.stop_loss,
            take_profit=signal.take_profits[0] if signal.take_profits else None,
            order_type=signal.order_type,
            magic_number=CONFIG.magic_number,
            comment=f"TG_COPY:{signal.message_id}",
            slippage=CONFIG.max_slippage
        )

        # Execute order
        result = self.mt5.execute_order(order)

        # Update database
        if result.success:
            logger.info(f"Order executed successfully: ticket={result.ticket}")
            self.db.update_execution(
                record_id,
                TradeStatus.EXECUTED,
                mt5_ticket=result.ticket,
                executed_price=result.price,
                executed_volume=result.volume
            )
        else:
            logger.error(f"Order execution failed: {result.error_message}")
            self.db.update_execution(
                record_id,
                TradeStatus.FAILED,
                error_message=result.error_message
            )
            self._add_error(result.error_message or "Unknown error")

    async def _execute_close_signal(self, signal: ParsedSignal, record_id: int):
        """Execute a CLOSE signal."""

        if not signal.symbol:
            logger.warning("CLOSE signal without symbol - will close last position")
            # Could implement: close last opened position
            self.db.update_execution(
                record_id,
                TradeStatus.SKIPPED,
                error_message="Symbol not specified for CLOSE"
            )
            return

        result = self.mt5.close_position(signal.symbol, percentage=100.0)

        if result.success:
            logger.info(f"Position closed: {signal.symbol}")
            self.db.update_execution(
                record_id,
                TradeStatus.EXECUTED,
                mt5_ticket=result.ticket
            )
        else:
            logger.error(f"Failed to close position: {result.error_message}")
            self.db.update_execution(
                record_id,
                TradeStatus.FAILED,
                error_message=result.error_message
            )
            self._add_error(result.error_message or "Close failed")

    async def _execute_partial_close_signal(self, signal: ParsedSignal, record_id: int):
        """Execute a PARTIAL_CLOSE signal."""

        if not signal.symbol or not signal.close_percentage:
            self.db.update_execution(
                record_id,
                TradeStatus.FAILED,
                error_message="Missing symbol or percentage"
            )
            return

        result = self.mt5.close_position(signal.symbol, percentage=signal.close_percentage)

        if result.success:
            logger.info(f"Partial close ({signal.close_percentage}%): {signal.symbol}")
            self.db.update_execution(
                record_id,
                TradeStatus.EXECUTED,
                mt5_ticket=result.ticket
            )
        else:
            logger.error(f"Partial close failed: {result.error_message}")
            self.db.update_execution(
                record_id,
                TradeStatus.FAILED,
                error_message=result.error_message
            )
            self._add_error(result.error_message or "Partial close failed")

    async def _execute_move_be_signal(self, signal: ParsedSignal, record_id: int):
        """Execute a MOVE_SL_TO_BE signal."""

        if not signal.symbol:
            logger.warning("MOVE_SL_TO_BE signal without symbol")
            self.db.update_execution(
                record_id,
                TradeStatus.SKIPPED,
                error_message="Symbol not specified"
            )
            return

        result = self.mt5.move_sl_to_breakeven(signal.symbol)

        if result.success:
            logger.info(f"Moved SL to BE: {signal.symbol}")
            self.db.update_execution(
                record_id,
                TradeStatus.EXECUTED,
                mt5_ticket=result.ticket
            )
        else:
            logger.error(f"Move SL to BE failed: {result.error_message}")
            self.db.update_execution(
                record_id,
                TradeStatus.FAILED,
                error_message=result.error_message
            )
            self._add_error(result.error_message or "Move BE failed")

    def get_status(self) -> SystemStatus:
        """Get system status."""

        # Telegram status
        telegram_status = self.telegram.get_status()

        # MT5 status
        mt5_connected = self.mt5.is_connected()
        mt5_info = self.mt5.get_account_info() if mt5_connected else None

        # Database stats
        db_stats = self.db.get_stats()

        # Uptime
        uptime = (datetime.now() - self.start_time).total_seconds()

        return SystemStatus(
            # Telegram
            telegram_connected=telegram_status["connected"],
            telegram_channel=telegram_status["channel"],
            telegram_last_message_id=telegram_status["last_message_id"],
            telegram_last_check=datetime.fromisoformat(telegram_status["last_check"]) if telegram_status["last_check"] else None,
            telegram_error=telegram_status["error"],

            # MT5
            mt5_connected=mt5_connected,
            mt5_account=mt5_info["login"] if mt5_info else None,
            mt5_server=mt5_info["server"] if mt5_info else None,
            mt5_balance=mt5_info["balance"] if mt5_info else None,
            mt5_equity=mt5_info["equity"] if mt5_info else None,
            mt5_error=None if mt5_connected else "Not connected",

            # Application
            app_uptime=uptime,
            app_mode="DRY_RUN" if CONFIG.dry_run else "LIVE",
            total_signals=db_stats["total_signals"],
            total_executed=db_stats["total_executed"],
            total_failed=db_stats["total_failed"],

            # Errors
            recent_errors=self.recent_errors[-10:]  # Last 10 errors
        )

    def _add_error(self, error: str):
        """Add error to recent errors list."""

        self.recent_errors.append({
            "timestamp": datetime.now().isoformat(),
            "error": error
        })

        # Keep only last 50
        if len(self.recent_errors) > 50:
            self.recent_errors = self.recent_errors[-50:]

    async def _broadcast_status(self):
        """Broadcast status to all WebSocket clients."""

        if not self.websocket_clients:
            return

        try:
            status = self.get_status()
            message = status.model_dump_json()

            # Send to all connected clients
            disconnected = []
            for ws in self.websocket_clients:
                try:
                    await ws.send_text(message)
                except Exception:
                    disconnected.append(ws)

            # Remove disconnected clients
            for ws in disconnected:
                self.websocket_clients.remove(ws)

        except Exception as e:
            logger.error(f"Error broadcasting status: {e}")


# Global trade copier instance
copier: Optional[TradeCopier] = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager."""

    global copier

    # Startup
    copier = TradeCopier()
    await copier.start()

    yield

    # Shutdown
    if copier:
        await copier.stop()


# Create FastAPI app
app = FastAPI(
    title="Telegram MT5 Trade Copier",
    description="Copy trades from Telegram to MetaTrader 5",
    version="1.0.0",
    lifespan=lifespan
)


# API Endpoints

@app.get("/")
async def root():
    """Serve the UI panel."""

    with open("frontend/index.html", "r") as f:
        return HTMLResponse(content=f.read())


@app.get("/api/status")
async def get_status():
    """Get system status."""

    if not copier:
        return JSONResponse({"error": "System not initialized"}, status_code=503)

    status = copier.get_status()
    return status


@app.get("/api/trades")
async def get_trades(limit: int = 100):
    """Get recent trades."""

    if not copier:
        return JSONResponse({"error": "System not initialized"}, status_code=503)

    trades = copier.db.get_recent_trades(limit=limit)
    return [t.model_dump() for t in trades]


@app.get("/api/positions")
async def get_positions():
    """Get open MT5 positions."""

    if not copier:
        return JSONResponse({"error": "System not initialized"}, status_code=503)

    positions = copier.mt5.get_positions()
    return positions


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time status updates."""

    await websocket.accept()

    if copier:
        copier.websocket_clients.append(websocket)

    try:
        # Send initial status
        if copier:
            status = copier.get_status()
            await websocket.send_text(status.model_dump_json())

        # Keep connection alive
        while True:
            await websocket.receive_text()

    except WebSocketDisconnect:
        if copier and websocket in copier.websocket_clients:
            copier.websocket_clients.remove(websocket)


# Mount static files
app.mount("/static", StaticFiles(directory="frontend/static"), name="static")


def run():
    """Run the application."""

    logger.info(f"Starting server on {CONFIG.host}:{CONFIG.port}")

    uvicorn.run(
        "backend.main:app",
        host=CONFIG.host,
        port=CONFIG.port,
        log_level=CONFIG.log_level.lower(),
        reload=CONFIG.debug
    )


if __name__ == "__main__":
    run()
