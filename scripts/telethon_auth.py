#!/usr/bin/env python3
"""
One-time Telethon authentication script.

Run this once to authenticate your Telegram account for Telethon user mode.
"""

import asyncio
import os
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from dotenv import load_dotenv
from telethon import TelegramClient
from telethon.sessions import StringSession


async def main():
    """Authenticate and create session."""

    # Load environment
    load_dotenv()

    api_id = os.getenv("TELEGRAM_API_ID")
    api_hash = os.getenv("TELEGRAM_API_HASH")
    phone = os.getenv("TELEGRAM_PHONE")

    if not api_id or not api_hash or not phone:
        print("❌ Error: Missing Telegram credentials in .env")
        print()
        print("Please set in .env:")
        print("  TELEGRAM_API_ID=your_api_id")
        print("  TELEGRAM_API_HASH=your_api_hash")
        print("  TELEGRAM_PHONE=+33612345678")
        print()
        print("Get API ID/Hash from: https://my.telegram.org/apps")
        return

    print("🔐 Telegram Authentication")
    print("=" * 50)
    print(f"API ID: {api_id}")
    print(f"Phone: {phone}")
    print()

    # Create session file
    session_file = "telegram_session"

    # Create client
    client = TelegramClient(session_file, int(api_id), api_hash)

    await client.connect()

    # Check if already authorized
    if await client.is_user_authorized():
        print("✅ Already authenticated!")
        me = await client.get_me()
        print(f"Logged in as: {me.first_name} {me.last_name or ''} (@{me.username or 'no username'})")
        await client.disconnect()
        return

    # Request code
    print("📱 Requesting authentication code...")
    await client.send_code_request(phone)

    print()
    print("A code has been sent to your Telegram app.")
    code = input("Enter the code: ").strip()

    try:
        # Sign in
        await client.sign_in(phone, code)

    except Exception as e:
        # May need 2FA password
        if "password" in str(e).lower() or "2fa" in str(e).lower():
            print()
            print("Two-factor authentication is enabled.")
            password = input("Enter your 2FA password: ").strip()
            await client.sign_in(password=password)
        else:
            raise

    # Success
    me = await client.get_me()
    print()
    print("✅ Authentication successful!")
    print(f"Logged in as: {me.first_name} {me.last_name or ''} (@{me.username or 'no username'})")
    print()
    print(f"Session saved to: {session_file}.session")
    print()
    print("You can now run the main application:")
    print("  python run.py")

    await client.disconnect()


if __name__ == "__main__":
    asyncio.run(main())
