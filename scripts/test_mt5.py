#!/usr/bin/env python3
"""
Test MetaTrader 5 connection.

Quick script to verify MT5 credentials and connection.
"""

import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from dotenv import load_dotenv
import os
import MetaTrader5 as mt5


def main():
    """Test MT5 connection."""

    # Load environment
    load_dotenv()

    login = int(os.getenv("MT5_LOGIN", "0"))
    password = os.getenv("MT5_PASSWORD", "")
    server = os.getenv("MT5_SERVER", "")

    print("🔧 Testing MetaTrader 5 Connection")
    print("=" * 50)
    print(f"Login: {login}")
    print(f"Server: {server}")
    print()

    # Initialize
    print("Initializing MT5...")
    if not mt5.initialize():
        error = mt5.last_error()
        print(f"❌ Initialization failed: {error}")
        print()
        print("Possible issues:")
        print("  1. MT5 terminal is not running")
        print("  2. MetaTrader5 package not installed correctly")
        return

    print("✅ MT5 initialized")

    # Login
    print()
    print("Logging in...")
    if not mt5.login(login=login, password=password, server=server):
        error = mt5.last_error()
        print(f"❌ Login failed: {error}")
        print()
        print("Possible issues:")
        print("  1. Wrong login/password/server")
        print("  2. Account is disabled")
        print("  3. Server is unavailable")
        mt5.shutdown()
        return

    print("✅ Login successful")

    # Get account info
    print()
    print("Account Information:")
    print("-" * 50)

    account_info = mt5.account_info()
    if account_info:
        print(f"Account: {account_info.login}")
        print(f"Server: {account_info.server}")
        print(f"Name: {account_info.name}")
        print(f"Currency: {account_info.currency}")
        print(f"Balance: {account_info.balance:.2f}")
        print(f"Equity: {account_info.equity:.2f}")
        print(f"Margin: {account_info.margin:.2f}")
        print(f"Free Margin: {account_info.margin_free:.2f}")
        print(f"Leverage: 1:{account_info.leverage}")
    else:
        print("❌ Could not retrieve account info")

    # Test symbol
    print()
    print("Testing symbol: XAUUSD")
    symbol_info = mt5.symbol_info("XAUUSD")

    if symbol_info:
        print("✅ Symbol found")
        print(f"  Bid: {symbol_info.bid}")
        print(f"  Ask: {symbol_info.ask}")
        print(f"  Spread: {symbol_info.spread}")
        print(f"  Volume min: {symbol_info.volume_min}")
        print(f"  Volume max: {symbol_info.volume_max}")
        print(f"  Volume step: {symbol_info.volume_step}")
    else:
        print("❌ Symbol not found")
        print("  Try enabling the symbol in MT5 Market Watch")

    # Disconnect
    print()
    mt5.shutdown()
    print("✅ MT5 connection test completed successfully!")


if __name__ == "__main__":
    main()
