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
    print(f"📖 API Documentation:       http://localhost:{port}/docs")
    print(f"⚡ Trạng thái Gemini API:    {'✅ Đã cấu hình' if has_key else '💡 Demo mô phỏng (Có thể nhập key trực tiếp trên web)'}")
    print("-" * 65)
    print("⭐ Hướng dẫn lấy Gemini API Key MIỄN PHÍ 100%:")
    print("   1. Vào https://aistudio.google.com/ (Đăng nhập Gmail)")
    print("   2. Bấm 'Create API Key' (0đ, không cần thẻ tín dụng)")
    print("   3. Dán vào ô Cài đặt (⚙️) trên Web hoặc file backend/.env")
    print("=" * 65 + "\n")

    uvicorn.run("backend.main:app", host=host, port=port, reload=True)

if __name__ == "__main__":
    main()
