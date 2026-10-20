"""
RightWISE - Backend API (Cách 1: Gemini API Free Tier)
Xác thực & Thẩm định OCOP địa phương bằng Gemini Vision 3.8 Flash.
Hoàn toàn sử dụng AI thực tế, không dùng mock data.
"""

import sys
import os
from pathlib import Path
from typing import Optional
from pydantic import BaseModel
from fastapi import FastAPI, File, UploadFile, Form, Header, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

load_dotenv(BASE_DIR / ".env")

from gemini_service import gemini_service

app = FastAPI(
    title="RightWISE - OCOP AI Verification API",
    description="Thẩm định nhãn mác & đối chiếu chứng chỉ OCOP địa phương bằng Gemini Vision (Google AI Studio Free Tier)",
    version="2.0.0"
)

# CORS setup for web development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

PUBLIC_DIR = BASE_DIR.parent / "public"
DOCS_DIR = BASE_DIR.parent / "docs"
STATIC_DIR = PUBLIC_DIR if (PUBLIC_DIR / "index.html").exists() else DOCS_DIR

@app.get("/health")
@app.get("/api/health")
async def health_check():
    """Kiểm tra trạng thái server và cấu hình Gemini API Key."""
    has_key = gemini_service.is_configured()
    return {
        "status": "ok",
        "gemini_api_configured": has_key,
        "model": "gemini-3.1-flash-lite",
        "provider": "Google AI Studio Free Tier (500 lượt/ngày, 15 RPM)",
        "mode": "LIVE_AI_VERIFICATION"
    }

@app.post("/verify")
@app.post("/api/verify")
async def verify_label(
    file: UploadFile = File(...),
    category: Optional[str] = Form(None),
    api_key: Optional[str] = Form(None),
    model: Optional[str] = Form("gemini-3.1-flash-lite"),
    x_gemini_key: Optional[str] = Header(None)
):
    """
    Flow chính:
    1. Nhận ảnh nhãn mác người dùng chụp / tải lên.
    2. Gửi trực tiếp tới Gemini Flash Vision (Google AI Studio Free Tier).
    3. Gemini OCR đọc nhãn, tra cứu dữ liệu OCOP địa phương và sinh văn bản đối chiếu chi tiết.
    4. Trả về kết quả thẩm định trực tiếp cho Frontend.
    """
    client_key = api_key or x_gemini_key

    # Đọc bytes từ file ảnh
    image_bytes = await file.read()
    if not image_bytes or len(image_bytes) < 100:
        raise HTTPException(status_code=400, detail="Tệp ảnh tải lên không hợp lệ hoặc rỗng.")

    mime_type = file.content_type or "image/jpeg"

    try:
        result = await gemini_service.verify_image_ocop(
            image_bytes=image_bytes,
            mime_type=mime_type,
            category_hint=category,
            client_api_key=client_key,
            model_name=model or "gemini-3.1-flash-lite"
        )
        return {
            "status": "success",
            "data": result
        }
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi phân tích Gemini AI: {str(e)}")

@app.post("/verify-url")
@app.post("/api/verify-url")
async def verify_url(
    request: Request,
    url: Optional[str] = Form(None),
    api_key: Optional[str] = Form(None),
    model: Optional[str] = Form(None),
    x_gemini_key: Optional[str] = Header(None)
):
    """
    Thẩm định OCOP qua đường link bài viết / bài đăng bán hàng / trang sản phẩm.
    Hỗ trợ cả JSON body (fetch) và Form data (POST).
    """
    target_url = url
    client_key = api_key
    model_name = model

    content_type = request.headers.get("content-type", "").lower()
    if "application/json" in content_type:
        try:
            body = await request.json()
            if isinstance(body, dict):
                target_url = body.get("url") or target_url
                client_key = body.get("api_key") or client_key
                model_name = body.get("model") or model_name
        except Exception:
            pass

    client_key = client_key or x_gemini_key
    model_name = model_name or "gemini-3.1-flash-lite"

    if not target_url or not target_url.strip():
        raise HTTPException(status_code=400, detail="Vui lòng cung cấp đường dẫn (URL) bài viết hoặc sản phẩm.")

    try:
        result = await gemini_service.verify_url_ocop(
            url=target_url.strip(),
            client_api_key=client_key,
            model_name=model_name
        )
        return {
            "status": "success",
            "data": result
        }
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi thẩm định link: {str(e)}")


# Phục vụ Frontend static files khi chạy trực tiếp qua Uvicorn / localhost
if STATIC_DIR.exists():
    @app.get("/")
    async def serve_index():
        index_file = STATIC_DIR / "index.html"
        if index_file.exists():
            return FileResponse(index_file)
        return {"message": "RightWISE API is running."}

    app.mount("/", StaticFiles(directory=str(STATIC_DIR), html=True), name="static")
