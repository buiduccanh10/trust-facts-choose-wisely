"""
RightWISE - Gemini Vision Service
Tra cứu, đối chiếu và thẩm định chứng chỉ OCOP địa phương bằng Gemini Vision.
Hoàn toàn sử dụng Google GenAI thật, không sử dụng dữ liệu giả lập (mock data).
"""

import os
import re
import json
import logging
from io import BytesIO
from typing import Dict, Any, Optional
from html.parser import HTMLParser
import httpx
from PIL import Image
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger("gemini_service")

OCOP_VERIFY_PROMPT = """
Bạn là chuyên gia thẩm định chất lượng và chương trình Mỗi Xã Một Sản Phẩm (OCOP) của Bộ Nông nghiệp & Phát triển Nông thôn Việt Nam.
Nhiệm vụ của bạn là đọc ảnh nhãn mác/bao bì sản phẩm do người dùng chụp và tải lên, sau đó tra cứu và đối chiếu với hồ sơ chứng nhận OCOP của địa phương:

1. ĐỌC THÔNG TIN TỪ NHÃN (OCR TIẾNG VIỆT CHÍNH XÁC):
   - Tên cơ sở sản xuất / Hộ kinh doanh / Doanh nghiệp / Thương hiệu in trên nhãn.
   - Địa chỉ hoặc địa phương sản xuất ghi trên nhãn (thôn/xã/thị trấn, quận/huyện, tỉnh/thành phố).
   - Loại sản phẩm (ví dụ: Bánh gai, Bánh gấc, Trà/Chè Tân Cương, Gạo ST25, Nước mắm Phú Quốc, Mật ong rừng, Tỏi Lý Sơn, Bánh đậu xanh,...).
   - Thông tin OCOP in trên nhãn: Sản phẩm có in logo OCOP không? Có ghi số sao OCOP không (3 sao, 4 sao, 5 sao)? Có mã số chứng nhận hoặc mã QR/barcode không?
   - Các thông tin khác: ngày sản xuất, hạn sử dụng, tiêu chuẩn, SĐT liên hệ nếu đọc được.

2. TRA CỨU & ĐỐI CHIẾU CHỨNG CHỈ OCOP ĐỊA PHƯƠNG:
   - Cơ sở / thương hiệu này tại địa phương đó (tỉnh/huyện tương ứng) có nằm trong danh mục sản phẩm OCOP chính thức được UBND tỉnh/huyện hoặc Hội đồng OCOP địa phương đánh giá, phân hạng và công nhận không?
   - Nếu có: Đạt chứng chỉ OCOP mấy sao thực tế? Thuộc năm/đợt công nhận nào? Cơ quan nào cấp quyết định công nhận (ví dụ UBND tỉnh Hải Dương, UBND tỉnh Thái Nguyên, UBND tỉnh Sóc Trăng, Hội đồng OCOP Quốc gia,...)?
   - So khớp giữa nhãn mác và chứng chỉ thực tế:
     + Số sao trên nhãn có khớp với số sao chính thức không? (Cảnh báo nếu tự ý nâng sao, ví dụ: thực tế chỉ đạt 4 sao nhưng nhãn in 5 sao Quốc gia).
     + Địa chỉ ghi trên nhãn có đúng vùng địa lý được cấp chứng nhận OCOP không? (Cảnh báo mạo danh địa phương / mượn danh đặc sản).
     + Nếu cơ sở chưa từng được cấp OCOP mà nhãn tự gắn logo/chữ OCOP: Cảnh báo gian lận thương mại.

3. TRẢ VỀ ĐỊNH DẠNG JSON DUY NHẤT VỚI CẤU TRÚC SAU:
{
  "extracted": {
    "brand": "Tên cơ sở hoặc thương hiệu đọc được từ nhãn",
    "product_name": "Tên loại sản phẩm",
    "location": "Địa chỉ / địa phương sản xuất ghi trên nhãn",
    "claimed_stars": 4, // Số nguyên 3, 4, 5 hoặc null nếu không ghi
    "has_ocop_logo": true/false,
    "has_qr_code": true/false,
    "raw_text_summary": "Tóm tắt ngắn gọn các dòng chữ chính đọc được từ bao bì"
  },
  "local_ocop_record": {
    "is_certified": true/false,
    "official_stars": 4, // Số nguyên 3, 4, 5 hoặc null nếu chưa có chứng chỉ
    "official_product_name": "Tên sản phẩm được công nhận trong hồ sơ OCOP",
    "certifying_authority": "UBND tỉnh / Cơ quan có thẩm quyền công nhận OCOP",
    "district": "Quận/Huyện",
    "province": "Tỉnh/Thành phố",
    "recognition_details": "Thông tin về đợt/năm công nhận OCOP của địa phương"
  },
  "verdict": {
    "code": "AUTHENTIC_OCOP" | "SUSPICIOUS_INFLATED_STARS" | "SUSPICIOUS_LOCATION_OR_BRAND" | "NOT_CERTIFIED_OCOP" | "INSUFFICIENT_INFO",
    "title": "Tiêu đề kết luận súc tích (ví dụ: 'ĐẠT CHUẨN OCOP 4 SAO TỈNH HẢI DƯƠNG' hoặc 'CẢNH BÁO: TỰ Ý NÂNG SAO OCOP')",
    "severity": "success" | "danger" | "warning", // success: chính hãng; danger: có dấu hiệu mạo danh/tự nâng sao; warning: chưa có chứng chỉ hoặc thiếu thông tin
    "confidence_score": 95 // Số nguyên từ 0 đến 100
  },
  "comparison_text": "VĂN BẢN ĐỐI CHIẾU CHI TIẾT (Từ 2 đến 4 đoạn văn mạch lạc: Nêu rõ cơ sở này tại địa phương có được cấp chứng chỉ OCOP không, cấp mấy sao, cơ quan nào cấp; đối chiếu cụ thể với nhãn mác trong ảnh; chỉ ra điểm trùng khớp hoặc điểm bất thường).",
  "comparison_points": [
    {
      "criteria": "Tên cơ sở / Thương hiệu",
      "on_label": "Thông tin đọc được từ nhãn",
      "official_record": "Thông tin đăng ký OCOP địa phương",
      "is_match": true/false,
      "note": "Đánh giá ngắn"
    },
    {
      "criteria": "Địa phương sản xuất",
      "on_label": "Địa chỉ ghi trên bao bì",
      "official_record": "Địa bàn được thẩm định OCOP",
      "is_match": true/false,
      "note": "Đánh giá ngắn"
    },
    {
      "criteria": "Xếp hạng sao OCOP",
      "on_label": "Số sao ghi trên bao bì",
      "official_record": "Số sao OCOP địa phương công nhận",
      "is_match": true/false,
      "note": "Đánh giá ngắn"
    },
    {
      "criteria": "Chứng chỉ OCOP địa phương",
      "on_label": "Logo & Tem OCOP trên nhãn",
      "official_record": "Quyết định công nhận của UBND tỉnh",
      "is_match": true/false,
      "note": "Đánh giá ngắn"
    }
  ],
  "consumer_advice": "Lời khuyên thực tế cho người tiêu dùng để kiểm chứng sản phẩm này ngoài đời thực (quét mã QR, kiểm tra bao bì niêm phong, kênh tra cứu địa phương)."
}
"""

OCOP_URL_VERIFY_PROMPT = """
Bạn là chuyên gia thẩm định chất lượng và chương trình Mỗi Xã Một Sản Phẩm (OCOP) của Bộ Nông nghiệp & Phát triển Nông thôn Việt Nam.
Nhiệm vụ của bạn là đọc và phân tích nội dung một liên kết bài viết / bài đăng bán hàng / trang giới thiệu sản phẩm nông sản, đặc sản OCOP do người dùng cung cấp. Sau đó tra cứu và đối chiếu với hồ sơ chứng nhận OCOP chính thức của địa phương:

1. ĐỌC VÀ TRÍCH XUẤT THÔNG TIN TỪ BÀI VIẾT / LINK SẢN PHẨM:
   - Tên sản phẩm / hàng hoá được giới thiệu trong bài viết.
   - Tên cơ sở sản xuất / Hộ kinh doanh / Hợp tác xã / Doanh nghiệp / Thương hiệu hoặc chủ thể bán hàng.
   - Địa chỉ hoặc địa bàn sản xuất (xã/thôn, quận/huyện, tỉnh/thành phố).
   - Các tuyên bố về OCOP trong bài viết/sản phẩm: Bài viết có quảng cáo sản phẩm đạt OCOP không? Ghi là đạt mấy sao (3 sao, 4 sao, 5 sao)? Có đề cập giấy chứng nhận, quyết định của UBND tỉnh/huyện không?
   - Nhận định sơ bộ về nội dung: bài viết chính thống, bài báo, bài đăng mạng xã hội (Facebook/TikTok), hay gian hàng thương mại điện tử (Shopee/Lazada/Tiki,...).

2. TRA CỨU & ĐỐI CHIẾU CHỨNG CHỈ OCOP ĐỊA PHƯƠNG:
   - Cơ sở / thương hiệu này tại địa phương đó (tỉnh/huyện tương ứng) có nằm trong danh mục sản phẩm OCOP chính thức được UBND tỉnh/huyện hoặc Hội đồng OCOP công nhận không?
   - Nếu có: Đạt chứng chỉ OCOP mấy sao thực tế? Thuộc năm/đợt công nhận nào? Cơ quan nào cấp quyết định công nhận (ví dụ UBND tỉnh Hải Dương, UBND tỉnh Thái Nguyên, UBND tỉnh Sóc Trăng, Hội đồng OCOP Quốc gia,...)?
   - So khớp giữa quảng cáo/bài viết và chứng chỉ thực tế:
     + Số sao bài viết quảng bá có khớp với số sao OCOP chính thức không? (Cảnh báo nếu tự ý thổi phồng / nâng sao).
     + Địa chỉ/vùng trồng có đúng vùng địa lý được cấp chứng nhận OCOP không? (Cảnh báo mượn danh đặc sản).
     + Nếu cơ sở chưa từng được cấp OCOP mà bài viết tự gắn mác sản phẩm OCOP để bán giá cao: Cảnh báo gian lận thương mại.

3. TRẢ VỀ ĐỊNH DẠNG JSON DUY NHẤT VỚI CẤU TRÚC SAU:
{
  "extracted": {
    "brand": "Tên cơ sở / thương hiệu hoặc nhà bán hàng trích xuất được",
    "product_name": "Tên loại sản phẩm",
    "location": "Địa chỉ / địa phương sản xuất ghi trong bài",
    "claimed_stars": 4, // Số nguyên 3, 4, 5 hoặc null nếu không ghi
    "has_ocop_logo": true/false, // Có đề cập/hiển thị logo OCOP không
    "has_qr_code": true/false,
    "raw_text_summary": "Tóm tắt ngắn gọn các nội dung quảng cáo chính từ bài viết/link"
  },
  "local_ocop_record": {
    "is_certified": true/false,
    "official_stars": 4, // Số nguyên 3, 4, 5 hoặc null nếu chưa có chứng chỉ
    "official_product_name": "Tên sản phẩm được công nhận trong hồ sơ OCOP",
    "certifying_authority": "UBND tỉnh / Cơ quan có thẩm quyền công nhận OCOP",
    "district": "Quận/Huyện",
    "province": "Tỉnh/Thành phố",
    "recognition_details": "Thông tin về đợt/năm công nhận OCOP của địa phương"
  },
  "verdict": {
    "code": "AUTHENTIC_OCOP" | "SUSPICIOUS_INFLATED_STARS" | "SUSPICIOUS_LOCATION_OR_BRAND" | "NOT_CERTIFIED_OCOP" | "INSUFFICIENT_INFO",
    "title": "Tiêu đề kết luận súc tích (ví dụ: 'SẢN PHẨM ĐẠT CHUẨN OCOP 4 SAO TỈNH HẢI DƯƠNG' hoặc 'CẢNH BÁO: BÀI VIẾT TỰ GẮN MÁC OCOP')",
    "severity": "success" | "warning" | "danger",
    "confidence_score": 95
  },
  "comparison_text": "Đoạn văn phân tích đối chiếu toàn diện (2-4 đoạn rõ ràng, khách quan): Nêu rõ bài viết quảng bá những gì, thực tế đối chiếu với hồ sơ OCOP tỉnh ra sao, có đúng chuẩn không, có điểm gì bất thường không.",
  "comparison_points": [
    {
      "criteria": "Tên cơ sở / Thương hiệu",
      "on_label": "Thông tin bài viết quảng cáo",
      "official_record": "Chủ thể trong hồ sơ OCOP chính thức",
      "is_match": true/false,
      "note": "Đánh giá ngắn"
    },
    {
      "criteria": "Địa phương sản xuất",
      "on_label": "Địa chỉ trong bài",
      "official_record": "Địa bàn được công nhận OCOP",
      "is_match": true/false,
      "note": "Đánh giá ngắn"
    },
    {
      "criteria": "Xếp hạng sao OCOP",
      "on_label": "Số sao bài viết tuyên bố",
      "official_record": "Số sao OCOP địa phương công nhận",
      "is_match": true/false,
      "note": "Đánh giá ngắn"
    },
    {
      "criteria": "Chứng chỉ OCOP địa phương",
      "on_label": "Tuyên bố OCOP trong bài",
      "official_record": "Quyết định công nhận của UBND tỉnh",
      "is_match": true/false,
      "note": "Đánh giá ngắn"
    }
  ],
  "consumer_advice": "Lời khuyên thực tế cho người tiêu dùng trước khi đặt mua từ bài viết/link này (cách kiểm tra mã QR, đối chiếu fanpage/website chính thức của HTX, kênh tra cứu OCOP tỉnh)."
}
"""

class SimpleHTMLTextExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.title = ""
        self.meta_desc = ""
        self.og_title = ""
        self.og_desc = ""
        self.og_image = ""
        self._in_title = False
        self._ignore = False
        self.text_parts = []

    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        if tag in ["script", "style", "noscript", "svg", "nav", "footer", "iframe"]:
            self._ignore = True
        elif tag == "title":
            self._in_title = True
        elif tag == "meta":
            prop = attrs_dict.get("property", "").lower()
            name = attrs_dict.get("name", "").lower()
            content = attrs_dict.get("content", "")
            if prop == "og:title":
                self.og_title = content
            elif prop == "og:description":
                self.og_desc = content
            elif prop == "og:image":
                self.og_image = content
            elif name == "description":
                self.meta_desc = content

    def handle_endtag(self, tag):
        if tag in ["script", "style", "noscript", "svg", "nav", "footer", "iframe"]:
            self._ignore = False
        elif tag == "title":
            self._in_title = False
        elif tag in ["p", "h1", "h2", "h3", "h4", "div", "li", "br", "tr"]:
            self.text_parts.append("\n")

    def handle_data(self, data):
        if self._in_title:
            self.title += data
        elif not self._ignore:
            t = data.strip()
            if t:
                self.text_parts.append(t + " ")

    def get_clean_text(self, max_length: int = 5000) -> str:
        raw = "".join(self.text_parts)
        cleaned = re.sub(r"[ \t]+", " ", raw)
        cleaned = re.sub(r"\n\s*\n+", "\n\n", cleaned).strip()
        if len(cleaned) > max_length:
            cleaned = cleaned[:max_length] + "...\n(Nội dung đã được rút gọn)"
        return cleaned

def extract_json_from_response(text: str) -> Dict[str, Any]:
    text = text.strip()
    if text.startswith("```json"):
        text = text[7:]
    elif text.startswith("```"):
        text = text[3:]
    if text.endswith("```"):
        text = text[:-3]
    text = text.strip()
    return json.loads(text)

class GeminiOCOPService:
    def __init__(self):
        self.preferred_models = ["gemini-3.1-flash-lite", "gemini-3.6-flash", "gemini-3.8-flash", "gemini-flash-latest"]

    def get_api_key(self, client_key: Optional[str] = None) -> str:
        key = (client_key or os.getenv("GEMINI_API_KEY", "")).strip()
        return key

    def is_configured(self, client_key: Optional[str] = None) -> bool:
        key = self.get_api_key(client_key)
        return len(key) > 10 and not key.startswith("YOUR_")

    async def verify_image_ocop(
        self,
        image_bytes: bytes,
        mime_type: str = "image/jpeg",
        category_hint: Optional[str] = None,
        client_api_key: Optional[str] = None,
        model_name: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Gửi ảnh trực tiếp tới Gemini Vision để đọc nhãn và đối chiếu chứng chỉ OCOP địa phương.
        Không sử dụng mock data.
        """
        api_key = self.get_api_key(client_api_key)
        if not self.is_configured(api_key):
            raise ValueError(
                "Chưa tìm thấy GEMINI_API_KEY hợp lệ. Vui lòng cấu hình GEMINI_API_KEY trong file backend/.env hoặc nhập vào giao diện web."
            )

        # Validate image with PIL
        try:
            pil_image = Image.open(BytesIO(image_bytes))
            if pil_image.mode in ("RGBA", "P"):
                pil_image = pil_image.convert("RGB")
            buf = BytesIO()
            pil_image.save(buf, format="JPEG", quality=90)
            clean_jpeg_bytes = buf.getvalue()
        except Exception as e:
            raise ValueError(f"Không thể đọc file ảnh: {str(e)}")

        prompt = OCOP_VERIFY_PROMPT
        if category_hint and category_hint.lower() not in ["tất cả", "auto", "tự động", "all"]:
            prompt += f"\n\nLưu ý thêm từ người dùng: Sản phẩm có thể thuộc nhóm ngành hàng: {category_hint}."

        primary_model = model_name or "gemini-3.1-flash-lite"
        models_to_try = [primary_model]
        for m in self.preferred_models:
            if m != primary_model and m not in models_to_try:
                models_to_try.append(m)
        models_to_try = models_to_try[:2]

        last_error = None
        for m in models_to_try:
            if not m:
                continue
            try:
                from google import genai
                from google.genai import types

                client = genai.Client(api_key=api_key)
                response = client.models.generate_content(
                    model=m,
                    contents=[
                        prompt,
                        types.Part.from_bytes(data=clean_jpeg_bytes, mime_type="image/jpeg"),
                    ],
                    config=types.GenerateContentConfig(
                        temperature=0.1,
                        response_mime_type="application/json"
                    ),
                )
                raw_text = response.text or "{}"
                result = extract_json_from_response(raw_text)
                result["_model_used"] = m
                result["_success"] = True
                return result
            except Exception as e:
                logger.warning(f"Thử nghiệm model {m} thất bại: {e}")
                last_error = e

        # Fallback to direct REST API if SDK has any issues
        try:
            import httpx
            import base64

            b64_img = base64.b64encode(clean_jpeg_bytes).decode("utf-8")
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key={api_key}"
            payload = {
                "contents": [{
                    "parts": [
                        {"text": prompt},
                        {"inline_data": {"mime_type": "image/jpeg", "data": b64_img}}
                    ]
                }],
                "generationConfig": {
                    "temperature": 0.1,
                    "response_mime_type": "application/json"
                }
            }
            async with httpx.AsyncClient(timeout=45.0) as http_client:
                resp = await http_client.post(url, json=payload)
                if resp.status_code == 200:
                    data = resp.json()
                    raw_text = data["candidates"][0]["content"]["parts"][0]["text"]
                    result = extract_json_from_response(raw_text)
                    result["_model_used"] = "gemini-flash-latest (REST)"
                    result["_success"] = True
                    return result
                else:
                    raise RuntimeError(f"Google AI Studio trả về lỗi HTTP {resp.status_code}: {resp.text}")
        except Exception as rest_err:
            raise RuntimeError(f"Lỗi khi gọi Gemini Vision API: {str(last_error or rest_err)}")

    async def verify_url_ocop(
        self,
        url: str,
        client_api_key: Optional[str] = None,
        model_name: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Thẩm định sản phẩm OCOP qua link bài viết hoặc link sản phẩm (Facebook, Shopee, tin tức, website).
        1. Tải và trích xuất nội dung văn bản & ảnh đại diện từ link.
        2. Gửi tới Gemini để phân tích các tuyên bố về OCOP.
        3. Đối chiếu với hồ sơ OCOP địa phương và trả về kết quả JSON chuẩn.
        """
        api_key = self.get_api_key(client_api_key)
        if not self.is_configured(api_key):
            raise ValueError(
                "Chưa tìm thấy GEMINI_API_KEY hợp lệ. Vui lòng cấu hình GEMINI_API_KEY trong file backend/.env hoặc trên Vercel."
            )

        clean_url = (url or "").strip()
        if not clean_url:
            raise ValueError("Đường dẫn (URL) bài viết hoặc sản phẩm không được để trống.")

        if not clean_url.startswith("http://") and not clean_url.startswith("https://"):
            clean_url = "https://" + clean_url

        page_title = ""
        page_desc = ""
        main_content = ""
        og_image_url = ""
        clean_jpeg_bytes: Optional[bytes] = None

        headers = {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Language": "vi,en-US;q=0.9,en;q=0.8",
        }

        try:
            async with httpx.AsyncClient(timeout=12.0, follow_redirects=True, headers=headers) as client:
                resp = await client.get(clean_url)
                if resp.status_code == 200:
                    html_content = resp.text
                    parser = SimpleHTMLTextExtractor()
                    parser.feed(html_content)
                    page_title = parser.og_title or parser.title or ""
                    page_desc = parser.og_desc or parser.meta_desc or ""
                    main_content = parser.get_clean_text(max_length=5000)
                    og_image_url = parser.og_image

                    # Nếu có og:image hợp lệ, thử tải ảnh đại diện sản phẩm
                    if og_image_url and (og_image_url.startswith("http://") or og_image_url.startswith("https://")):
                        try:
                            img_resp = await client.get(og_image_url, timeout=5.0)
                            if img_resp.status_code == 200 and len(img_resp.content) > 1000:
                                pil_img = Image.open(BytesIO(img_resp.content))
                                if pil_img.mode in ("RGBA", "P"):
                                    pil_img = pil_img.convert("RGB")
                                buf = BytesIO()
                                pil_img.save(buf, format="JPEG", quality=85)
                                clean_jpeg_bytes = buf.getvalue()
                        except Exception as img_err:
                            logger.info(f"Không thể tải ảnh preview từ og:image ({og_image_url}): {img_err}")
                else:
                    main_content = f"Trang web phản hồi mã HTTP {resp.status_code}. Đường dẫn cần thẩm định: {clean_url}"
        except Exception as crawl_err:
            logger.warning(f"Không thể tải trực tiếp trang web {clean_url}: {crawl_err}")
            main_content = f"Không thể tải trực tiếp văn bản từ liên kết (do trang bảo vệ hoặc chặn bot crawler). Đường dẫn cần thẩm định: {clean_url}"

        # Xây dựng prompt tổng hợp thông tin bài viết
        prompt_with_data = f"""{OCOP_URL_VERIFY_PROMPT}

THÔNG TIN BÀI VIẾT / LINK SẢN PHẨM CẦN THẨM ĐỊNH:
- Đường dẫn URL: {clean_url}
- Tiêu đề trang / bài viết: {page_title or 'Chưa xác định'}
- Tóm tắt mô tả: {page_desc or 'Chưa xác định'}
- Nội dung trích xuất từ trang:
{main_content or 'Chưa có trích xuất chi tiết'}

Hãy thực hiện thẩm định đối chiếu toàn diện các thông tin trên và trả về kết quả JSON theo đúng định dạng được yêu cầu."""

        primary_model = model_name or "gemini-3.1-flash-lite"
        models_to_try = [primary_model]
        for m in self.preferred_models:
            if m != primary_model and m not in models_to_try:
                models_to_try.append(m)
        models_to_try = models_to_try[:2]

        last_error = None
        for m in models_to_try:
            if not m:
                continue
            try:
                from google import genai
                from google.genai import types

                client = genai.Client(api_key=api_key)
                
                contents_list = [prompt_with_data]
                if clean_jpeg_bytes:
                    contents_list.append(types.Part.from_bytes(data=clean_jpeg_bytes, mime_type="image/jpeg"))

                response = client.models.generate_content(
                    model=m,
                    contents=contents_list,
                    config=types.GenerateContentConfig(
                        temperature=0.1,
                        response_mime_type="application/json"
                    ),
                )
                raw_text = response.text or "{}"
                result = extract_json_from_response(raw_text)
                result["_model_used"] = m
                result["_success"] = True
                result["_source_type"] = "URL"
                result["_url"] = clean_url
                result["_page_title"] = page_title
                result["_og_image"] = og_image_url if clean_jpeg_bytes else ""
                return result
            except Exception as e:
                logger.warning(f"Thử nghiệm model {m} cho URL thất bại: {e}")
                last_error = e

        # Fallback to direct REST API
        try:
            parts = [{"text": prompt_with_data}]
            if clean_jpeg_bytes:
                import base64
                b64_img = base64.b64encode(clean_jpeg_bytes).decode("utf-8")
                parts.append({"inline_data": {"mime_type": "image/jpeg", "data": b64_img}})

            url_api = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key={api_key}"
            payload = {
                "contents": [{"parts": parts}],
                "generationConfig": {
                    "temperature": 0.1,
                    "response_mime_type": "application/json"
                }
            }
            async with httpx.AsyncClient(timeout=45.0) as http_client:
                resp = await http_client.post(url_api, json=payload)
                if resp.status_code == 200:
                    data = resp.json()
                    raw_text = data["candidates"][0]["content"]["parts"][0]["text"]
                    result = extract_json_from_response(raw_text)
                    result["_model_used"] = "gemini-flash-latest (REST)"
                    result["_success"] = True
                    result["_source_type"] = "URL"
                    result["_url"] = clean_url
                    result["_page_title"] = page_title
                    result["_og_image"] = og_image_url if clean_jpeg_bytes else ""
                    return result
                else:
                    raise RuntimeError(f"Google AI Studio trả về lỗi HTTP {resp.status_code}: {resp.text}")
        except Exception as rest_err:
            raise RuntimeError(f"Lỗi khi thẩm định URL qua Gemini API: {str(last_error or rest_err)}")

gemini_service = GeminiOCOPService()
