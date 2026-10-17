# RightWISE - Kiểm Chứng Nhãn Mác Nông Sản & OCOP Bằng Gemini AI (Free Tier)

> **Trust Facts, Choose Wisely · Think Critically, Verify Confidently**  
> Dự án giáo dục tư duy phản biện và xác thực nhãn mác sản phẩm nông sản, đặc sản OCOP Việt Nam sử dụng **Gemini 1.5 Flash Vision (Google AI Studio Free Tier)** và Cơ sở dữ liệu OCOP chính hãng.

---

## 🌟 Tính Năng Nổi Bật (Cách 1: Gemini API Free Tier)

1. **Hoàn toàn MIỄN PHÍ 100%**:
   - Sử dụng **Google AI Studio Gemini API Free Tier**: **15 lượt gọi/phút**, tối đa **1.500 lượt gọi/ngày** (0đ, không cần thẻ tín dụng).
   - Nhận diện chữ tiếng Việt, logo, nhãn mác cong/nhăn/nghiêng cực kỳ chính xác.
2. **Đối chiếu thực tế trực quan (Side-by-Side)**:
   - **Ảnh 2 (Ảnh bạn chụp / tải lên)**: AI đọc tên cơ sở, địa chỉ sản xuất, loại sản phẩm, số sao OCOP tự in.
   - **Ảnh 1 (Hồ sơ & Giấy chứng nhận chính hãng)**: Tự động truy vấn CSDL OCOP chuẩn để lấy hình ảnh giấy chứng nhận, chủ thể được cấp phép, mã số OCOP và thời hạn hiệu lực.
3. **Phát hiện dấu hiệu làm giả / làm nhái**:
   - Cảnh báo tự ý nâng sao OCOP (ví dụ: sản phẩm chỉ đạt 4 sao nhưng nhãn tự in 5 sao).
   - Cảnh báo mạo danh thương hiệu (tên giống cơ sở nổi tiếng nhưng địa chỉ ở nơi khác).
   - Nhận diện nhãn thiếu mã truy xuất nguồn gốc QR code / mã vạch.
4. **Bộ ảnh mẫu thực tế 1-Click**:
   - Tích hợp sẵn ảnh chụp nhãn mác thực tế (Bánh gai Ninh Giang Nga Tới chuẩn 4 sao, Bánh gai nhái mập mờ, Chè Tân Cương Hảo Đạt 5 sao, Gạo ST25 Ông Cua 5 sao, Nước mắm Khải Hoàn Phú Quốc 5 sao) để thử nghiệm ngay lập tức.
5. **Cài đặt API Key linh hoạt**:
   - Có thể nhập key trực tiếp trên giao diện web (lưu trong `localStorage`) hoặc cấu hình file `backend/.env`.

---

## 🏗️ Kiến Trúc Hệ Thống

```
trust-facts-choose-wisely/
├── backend/
│   ├── main.py               # FastAPI Server (API endpoints + phục vụ Static Frontend)
│   ├── gemini_service.py     # Gemini Vision 1.5/2.0 Flash integration
│   ├── db.py                 # Quản lý CSDL OCOP & Fuzzy Matcher (Rapidfuzz)
│   ├── data/
│   │   ├── ocop_database.json # CSDL sản phẩm OCOP chính hãng (Nga Tới, Tuyết Nga, Hảo Đạt, ...)
│   │   ├── certified_images/  # Ảnh giấy chứng nhận & con dấu chính thức (Ảnh 1)
│   │   └── sample_images/     # Ảnh chụp thực tế nhãn mác bao bì (Ảnh 2)
│   ├── requirements.txt      # Thư viện Python
│   └── .env.example          # Mẫu cấu hình môi trường
├── docs/
│   └── index.html            # Frontend hoàn chỉnh (RightWISE + AI Verification Suite)
├── start.py                  # Script khởi chạy 1 lệnh duy nhất
└── README.md
```

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy (3 Bước Đơn Giản)

### Bước 1: Chuẩn bị môi trường Python

```bash
# Tạo môi trường ảo (nếu chưa có)
python3 -m venv venv

# Kích hoạt môi trường ảo
source venv/bin/activate    # Trên macOS / Linux
# venv\Scripts\activate     # Trên Windows

# Cài đặt các thư viện cần thiết
pip install -r backend/requirements.txt
```

### Bước 2: Lấy Gemini API Key Miễn Phí (Mất 30 giây)

1. Truy cập: **[Google AI Studio](https://aistudio.google.com/)**
2. Đăng nhập bằng tài khoản Gmail của bạn.
3. Bấm nút **"Create API Key"** (hoặc "Get API key").
4. Cấu hình key bằng một trong hai cách:
   - **Cách A (Khuyên dùng):** Mở web lên, bấm biểu tượng **⚙️ Cài đặt API** trên góc phải thanh công cụ và dán key vào.
   - **Cách B:** Điền vào file `backend/.env`:
     ```env
     GEMINI_API_KEY=AIzaSy...
     ```

### Bước 3: Khởi chạy ứng dụng

Chạy lệnh:
```bash
python start.py
```

Mở trình duyệt truy cập:
👉 **http://localhost:8000/**

*(Tài liệu API Swagger UI có tại: http://localhost:8000/docs)*

---

## 🧪 Cách Thử Nghiệm

1. Vào mục **"Kiểm tra ảnh bằng điện thoại"** trên trang chủ.
2. **Cách 1 - Thử nhanh với 1 click:**  
   Bấm vào một trong các chip ảnh mẫu:
   - 🌾 *Bánh gai Nga Tới (4 sao Hải Dương)* -> Kết quả: **✅ Trùng khớp OCOP chính hãng**.
   - ⚠️ *Bánh gai nhái (Tự in 5 sao, địa chỉ mờ)* -> Kết quả: **🚨 Cảnh báo tự ý nâng sao OCOP & Mạo danh**.
   - 🍵 *Trà Tân Cương Hảo Đạt (5 sao Quốc gia)*.
   - 🍚 *Gạo ST25 Ông Cua (5 sao)*.
   - 🐟 *Nước mắm Khải Hoàn (5 sao)*.
3. **Cách 2 - Kiểm tra ảnh chụp thực tế của bạn:**  
   - Bấm **"Chụp ảnh bao bì bây giờ"** (trên điện thoại) hoặc **"Chọn ảnh tem mác có sẵn"**.
   - Bấm nút xanh **"✨ Phân tích bằng Gemini AI & Đối chiếu OCOP"**.
   - Hệ thống sẽ hiển thị **Ảnh 2** (ảnh bạn tải lên) song song cùng **Ảnh 1** (giấy chứng nhận chính hãng trong CSDL OCOP) kèm bảng phân tích 4 tiêu chí xác thực.

---

## 📡 API Endpoints

| Phương thức | Đường dẫn | Chức năng |
| :--- | :--- | :--- |
| `POST` | `/api/verify` | Nhận ảnh nhãn mác, gọi Gemini Vision AI và đối chiếu CSDL OCOP |
| `GET` | `/api/ocop-products` | Danh sách các sản phẩm OCOP chính thức trong CSDL |
| `GET` | `/api/ocop-products/{id}` | Chi tiết một sản phẩm OCOP |
| `GET` | `/api/categories` | Danh sách các ngành hàng OCOP |
| `GET` | `/api/samples` | Danh sách ảnh mẫu thử nghiệm nhanh |
| `GET` | `/api/health` | Trạng thái server & cấu hình Gemini API |

---

## 🛡️ Bản Quyền & Giấy Phép
Dự án được xây dựng phục vụ giáo dục tư duy phản biện cộng đồng và bảo vệ giá trị nông sản bản địa Việt Nam.
