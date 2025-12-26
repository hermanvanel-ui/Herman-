"""Telegram client for monitoring trading signals."""

import logging
import asyncio
from typing import Optional, Callable, Awaitable
from datetime import datetime

from telegram import Update
from telegram.ext import (
    Application,
    MessageHandler,
    filters,
    ContextTypes
)
from telethon import TelegramClient, events
from telethon.sessions import StringSession

from backend.signal_parser import SignalParser, is_likely_signal
from backend.models import ParsedSignal

logger = logging.getLogger(__name__)


class TelegramMonitor:
    """
    Unified Telegram monitor supporting both Bot API and Telethon.
    """

    def __init__(
        self,
        use_bot: bool,
        bot_token: Optional[str] = None,
        api_id: Optional[int] = None,
        api_hash: Optional[str] = None,
        phone: Optional[str] = None,
        channel_id: str = "",
        parser: Optional[SignalParser] = None,
        on_signal: Optional[Callable[[ParsedSignal], Awaitable[None]]] = None
    ):
        """Initialize Telegram monitor."""
        self.use_bot = use_bot
        self.bot_token = bot_token
        self.api_id = api_id
        self.api_hash = api_hash
        self.phone = phone
        self.channel_id = channel_id
        self.parser = parser or SignalParser()
        self.on_signal = on_signal

        self.bot_app: Optional[Application] = None
        self.telethon_client: Optional[TelegramClient] = None

        self.connected = False
        self.last_message_id: Optional[int] = None
        self.last_check: Optional[datetime] = None
        self.error_message: Optional[str] = None

    async def start(self):
        """Start monitoring Telegram channel."""

        try:
            if self.use_bot:
                await self._start_bot()
            else:
                await self._start_telethon()

            self.connected = True
            self.error_message = None
            logger.info("Telegram monitor started successfully")

        except Exception as e:
            logger.error(f"Failed to start Telegram monitor: {e}")
            self.error_message = str(e)
            self.connected = False
            raise

    async def stop(self):
        """Stop monitoring."""

        if self.bot_app:
            await self.bot_app.stop()
            await self.bot_app.shutdown()
            self.bot_app = None

        if self.telethon_client:
            await self.telethon_client.disconnect()
            self.telethon_client = None

        self.connected = False
        logger.info("Telegram monitor stopped")

    async def _start_bot(self):
        """Start Bot API monitoring."""

        if not self.bot_token:
            raise ValueError("Bot token is required for bot mode")

        logger.info("Starting Telegram Bot...")

        # Create application
        self.bot_app = Application.builder().token(self.bot_token).build()

        # Add message handler
        async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
            """Handle incoming messages."""

            if not update.message or not update.message.text:
                return

            # Check if message is from target channel
            chat_id = str(update.message.chat.id)
            if not self._is_target_channel(chat_id):
                return

            message_id = update.message.message_id
            message_text = update.message.text

            logger.info(f"Received message {message_id} from {chat_id}")

            # Update last check
            self.last_message_id = message_id
            self.last_check = datetime.now()

            # Quick filter
            if not is_likely_signal(message_text):
                logger.debug(f"Message {message_id} doesn't look like a signal")
                return

            # Parse signal
            await self._process_message(message_id, message_text)

        self.bot_app.add_handler(
            MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message)
        )

        # Start bot
        await self.bot_app.initialize()
        await self.bot_app.start()
        await self.bot_app.updater.start_polling()

        logger.info(f"Bot started, monitoring channel: {self.channel_id}")

    async def _start_telethon(self):
        """Start Telethon user client monitoring."""

        if not self.api_id or not self.api_hash:
            raise ValueError("API ID and hash are required for Telethon mode")

        logger.info("Starting Telethon user client...")

        # Create session
        session_file = "telegram_session"

        # Create client
        self.telethon_client = TelegramClient(
            session_file,
            self.api_id,
            self.api_hash
        )

        # Connect
        await self.telethon_client.connect()

        # Check if authorized
        if not await self.telethon_client.is_user_authorized():
            logger.info("User not authorized, requesting phone code...")

            if not self.phone:
                raise ValueError("Phone number is required for first-time auth")

            await self.telethon_client.send_code_request(self.phone)

            # Note: In production, you'd need a way to receive the code
            # For now, we'll raise an error with instructions
            raise RuntimeError(
                "First-time authentication required. "
                "Please run the authentication script separately. "
                "See docs/telethon_auth.md for instructions."
            )

        # Register event handler for new messages
        @self.telethon_client.on(events.NewMessage(chats=self.channel_id))
        async def handle_new_message(event):
            """Handle new messages from channel."""

            message_id = event.message.id
            message_text = event.message.text or ""

            logger.info(f"Received message {message_id} from Telethon")

            # Update last check
            self.last_message_id = message_id
            self.last_check = datetime.now()

            # Quick filter
            if not is_likely_signal(message_text):
                logger.debug(f"Message {message_id} doesn't look like a signal")
                return

            # Parse signal
            await self._process_message(message_id, message_text)

        # Start listening
        logger.info(f"Telethon started, monitoring channel: {self.channel_id}")

        # Keep running (this will be managed by the main event loop)

    async def _process_message(self, message_id: int, message_text: str):
        """Process a message and extract signal."""

        try:
            # Parse signal
            signal = self.parser.parse(message_id, message_text)

            if signal:
                logger.info(
                    f"Parsed signal: {signal.action} {signal.symbol or 'N/A'} "
                    f"{signal.direction or ''}"
                )

                # Call callback
                if self.on_signal:
                    await self.on_signal(signal)
            else:
                logger.debug(f"Could not parse signal from message {message_id}")

        except Exception as e:
            logger.error(f"Error processing message {message_id}: {e}")

    def _is_target_channel(self, chat_id: str) -> bool:
        """Check if chat ID matches target channel."""

        # Normalize channel ID (with/without @ or -)
        target = self.channel_id.replace("@", "").replace("-", "")
        current = chat_id.replace("@", "").replace("-", "")

        return target == current or target in current or current in target

    async def run_forever(self):
        """Run the client forever (for Telethon)."""

        if self.telethon_client:
            await self.telethon_client.run_until_disconnected()

    def get_status(self) -> dict:
        """Get current status."""

        return {
            "connected": self.connected,
            "channel": self.channel_id,
            "last_message_id": self.last_message_id,
            "last_check": self.last_check.isoformat() if self.last_check else None,
            "error": self.error_message,
            "mode": "bot" if self.use_bot else "user_client"
        }


class TelegramAuthHelper:
    """Helper for Telethon authentication (one-time setup)."""

    @staticmethod
    async def authenticate(api_id: int, api_hash: str, phone: str) -> str:
        """
        Perform one-time authentication and return session string.
        This should be run separately from the main application.
        """

        client = TelegramClient(StringSession(), api_id, api_hash)

        await client.connect()

        if not await client.is_user_authorized():
            await client.send_code_request(phone)

            # Get code from user (terminal input)
            code = input(f"Enter the code sent to {phone}: ")

            try:
                await client.sign_in(phone, code)
            except Exception as e:
                # May need 2FA password
                password = input("2FA password (if enabled): ")
                await client.sign_in(password=password)

        # Get session string
        session_string = client.session.save()

        await client.disconnect()

        return session_string
