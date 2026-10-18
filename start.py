#!/usr/bin/env python3
"""
RightWISE - Launch Script (Cách 1: Gemini API Free Tier)
Starts the FastAPI backend and serves the frontend at http://localhost:8000
"""

import sys
import os
import webbrowser
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
VENV_PYTHON = BASE_DIR / "venv" / "bin" / "python"

if sys.executable != str(VENV_PYTHON) and VENV_PYTHON.exists():
    os.execv(str(VENV_PYTHON), [str(VENV_PYTHON)] + sys.argv)

import uvicorn
from dotenv import load_dotenv

load_dotenv(BASE_DIR / "backend" / ".env")

def main():
    port = int(os.getenv("PORT", "8000"))
    host = os.getenv("HOST", "0.0.0.0")
    has_key = bool(os.getenv("GEMINI_API_KEY", "").strip())

    print("\n" + "=" * 65)
    print("🌾 RightWISE - Nông sản & OCOP AI Verification (Cách 1: Gemini Free Tier)")
    print("=" * 65)
    print(f"🚀 Ứng dụng đang chạy tại:   http://localhost:{port}/")
    print("=" * 65 + "\n")

    uvicorn.run("backend.main:app", host=host, port=port, reload=True)

if __name__ == "__main__":
    main()
