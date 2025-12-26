#!/usr/bin/env python3
"""
System check script - verify all requirements before running.

Run this to check if everything is properly configured.
"""

import os
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

def check_python_version():
    """Check Python version."""
    print("🐍 Checking Python version...")
    version = sys.version_info

    if version.major < 3 or (version.major == 3 and version.minor < 9):
        print(f"  ❌ Python {version.major}.{version.minor} - Need 3.9+")
        return False

    print(f"  ✅ Python {version.major}.{version.minor}.{version.micro}")
    return True


def check_dependencies():
    """Check required packages."""
    print("\n📦 Checking dependencies...")

    required = [
        'fastapi',
        'uvicorn',
        'telegram',
        'telethon',
        'MetaTrader5',
        'pydantic',
        'sqlalchemy',
        'aiosqlite',
    ]

    missing = []

    for package in required:
        try:
            __import__(package)
            print(f"  ✅ {package}")
        except ImportError:
            print(f"  ❌ {package} - not installed")
            missing.append(package)

    if missing:
        print(f"\n  Missing packages: {', '.join(missing)}")
        print("  Install with: pip install -r requirements.txt")
        return False

    return True


def check_env_file():
    """Check .env configuration."""
    print("\n⚙️  Checking .env configuration...")

    if not os.path.exists('.env'):
        print("  ❌ .env file not found")
        print("  Create with: cp .env.example .env")
        return False

    print("  ✅ .env file exists")

    from dotenv import load_dotenv
    load_dotenv()

    # Check required variables
    required_vars = {
        'TELEGRAM_CHANNEL_ID': 'Telegram channel ID',
        'MT5_LOGIN': 'MT5 login',
        'MT5_PASSWORD': 'MT5 password',
        'MT5_SERVER': 'MT5 server',
    }

    missing = []

    for var, description in required_vars.items():
        value = os.getenv(var)
        if not value or value == "" or value.startswith("your_"):
            print(f"  ⚠️  {var} not configured ({description})")
            missing.append(var)
        else:
            # Don't print sensitive values
            if 'PASSWORD' in var or 'TOKEN' in var or 'HASH' in var:
                print(f"  ✅ {var} (set)")
            else:
                print(f"  ✅ {var} = {value}")

    # Check Telegram mode
    use_bot = os.getenv('USE_TELEGRAM_BOT', 'true').lower() == 'true'

    if use_bot:
        bot_token = os.getenv('TELEGRAM_BOT_TOKEN')
        if not bot_token or bot_token.startswith('your_'):
            print("  ⚠️  TELEGRAM_BOT_TOKEN not configured")
            missing.append('TELEGRAM_BOT_TOKEN')
    else:
        api_id = os.getenv('TELEGRAM_API_ID')
        api_hash = os.getenv('TELEGRAM_API_HASH')
        phone = os.getenv('TELEGRAM_PHONE')

        if not api_id or api_id == "0":
            print("  ⚠️  TELEGRAM_API_ID not configured")
            missing.append('TELEGRAM_API_ID')
        if not api_hash or api_hash.startswith('your_'):
            print("  ⚠️  TELEGRAM_API_HASH not configured")
            missing.append('TELEGRAM_API_HASH')
        if not phone or phone.startswith('+'):
            print("  ⚠️  TELEGRAM_PHONE not configured")
            missing.append('TELEGRAM_PHONE')

    if missing:
        print(f"\n  Missing config: {', '.join(missing)}")
        print("  Edit .env with your credentials")
        return False

    return True


def check_directories():
    """Check required directories exist."""
    print("\n📁 Checking directories...")

    dirs = ['data', 'logs', 'frontend', 'backend', 'tests']

    for dir_name in dirs:
        if os.path.exists(dir_name):
            print(f"  ✅ {dir_name}/")
        else:
            print(f"  ⚠️  {dir_name}/ not found - creating...")
            os.makedirs(dir_name, exist_ok=True)

    return True


def check_mt5():
    """Check MT5 connection (optional)."""
    print("\n💹 Checking MT5 (optional)...")

    try:
        import MetaTrader5 as mt5

        if not mt5.initialize():
            print("  ⚠️  MT5 not running or not accessible")
            print("  Start MT5 terminal before running the application")
            return True  # Not critical for setup check

        print("  ✅ MT5 terminal accessible")
        mt5.shutdown()
        return True

    except Exception as e:
        print(f"  ⚠️  Could not check MT5: {e}")
        return True  # Not critical


def main():
    """Run all checks."""
    print("=" * 60)
    print("  TELEGRAM MT5 TRADE COPIER - SYSTEM CHECK")
    print("=" * 60)

    checks = [
        check_python_version(),
        check_dependencies(),
        check_directories(),
        check_env_file(),
        check_mt5(),
    ]

    print("\n" + "=" * 60)

    if all(checks[:-1]):  # Last check (MT5) is optional
        print("✅ ALL CHECKS PASSED!")
        print("\nYou can now run the application:")
        print("  python run.py")
        print("\nOr in dry-run mode:")
        print("  make dry-run")
        return 0
    else:
        print("❌ SOME CHECKS FAILED")
        print("\nPlease fix the issues above before running.")
        return 1


if __name__ == "__main__":
    sys.exit(main())
