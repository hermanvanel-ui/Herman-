#!/usr/bin/env python3
"""
Main entry point for the Telegram MT5 Trade Copier.
"""

import sys
import os

# Add backend to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from backend.main import run

if __name__ == "__main__":
    run()
