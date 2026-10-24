# RightWISE

> Tài liệu nhập môn dành cho học sinh cấp 3 muốn hiểu và thử sửa dự án. Không cần biết hết mọi thứ trước khi bắt đầu: hãy đi từ khái niệm nhỏ, chạy ứng dụng, rồi chọn một phần để khám phá.

RightWISE là website giúp người dùng đọc thông tin trên nhãn sản phẩm hoặc trong một đường dẫn, rồi tìm thông tin công khai về sản phẩm và nguồn sản xuất để tham khảo. Kết quả giúp người dùng tự đối chiếu; đây **không phải** kết luận pháp lý hay xác nhận chứng nhận OCOP.

## Mục lục

- [1. Lập trình là gì?](#1-lập-trình-là-gì)
- [2. JavaScript là gì?](#2-javascript-là-gì)
- [3. TypeScript khác JavaScript thế nào?](#3-typescript-khác-javascript-thế-nào)
- [4. Website này gồm những phần nào?](#4-website-này-gồm-những-phần-nào)
- [5. Chạy dự án trên máy](#5-chạy-dự-án-trên-máy)
- [6. Khám phá và sửa giao diện](#6-khám-phá-và-sửa-giao-diện)
- [7. Khám phá backend](#7-khám-phá-backend)
- [8. Các lệnh thường dùng](#8-các-lệnh-thường-dùng)
- [9. Đưa ứng dụng lên mạng](#9-đưa-ứng-dụng-lên-mạng)
- [10. Bắt đầu từ đâu?](#10-bắt-đầu-từ-đâu)

## 1. Lập trình là gì?

**Lập trình** là viết những chỉ dẫn để máy tính làm một việc. Máy tính không tự đoán ý mình; nó đọc lệnh theo quy tắc, xử lý dữ liệu rồi tạo ra kết quả.

Một chương trình đơn giản thường có ba bước:

1. **Nhận dữ liệu vào**: ví dụ người dùng chọn ảnh nhãn sản phẩm.
2. **Xử lý**: kiểm tra ảnh có hợp lệ không, rồi gửi ảnh đi đọc thông tin.
3. **Đưa kết quả ra**: hiển thị tên sản phẩm và thông tin tìm được.

### Biến là gì?

**Biến** là một cái tên dùng để lưu giá trị để chương trình có thể dùng lại.

~~~js
const tenSanPham = "Trà Shan Tuyết";
let soSao = 4;

console.log(tenSanPham); // In: Trà Shan Tuyết
console.log(soSao);      // In: 4
~~~

Trong JavaScript, const dùng khi không định gán lại biến; let dùng khi giá trị sẽ thay đổi. console.log in thông tin ra cửa sổ terminal hoặc bảng Console của trình duyệt để mình quan sát.

### Điều kiện, lặp và hàm

**Điều kiện** giúp chương trình chọn việc cần làm tùy theo tình huống:

~~~js
if (soSao >= 4) {
  console.log("Sản phẩm có từ 4 sao trở lên");
} else {
  console.log("Sản phẩm có ít hơn 4 sao");
}
~~~

**Vòng lặp** chạy lại một việc nhiều lần. Ví dụ in tên từng sản phẩm trong danh sách:

~~~js
const sanPhams = ["Trà", "Mật ong", "Gạo"];

for (const sanPham of sanPhams) {
  console.log(sanPham);
}
~~~

**Hàm** là một nhóm lệnh có tên, có thể gọi lại khi cần. Hàm dưới đây nhận tên rồi trả lời lời chào:

~~~js
function chao(ten) {
  return `Xin chào, ${ten}!`;
}

console.log(chao("An"));
~~~

### Thuật toán là gì?

**Thuật toán** là các bước rõ ràng để giải một bài toán. Chẳng hạn, để kiểm tra một ảnh sản phẩm:

1. Hỏi người dùng chọn ảnh.
2. Kiểm tra tệp có phải ảnh và có quá lớn không.
3. Gửi ảnh tới máy chủ.
4. Nhận thông tin máy chủ trả về.
5. Hiển thị thông tin hoặc báo lỗi.

Các bước đó chính là ý tưởng của tính năng kiểm tra ảnh trong RightWISE. Code biến các bước thành lệnh mà máy tính có thể chạy.

## 2. JavaScript là gì?

**JavaScript (JS)** là ngôn ngữ lập trình phổ biến trên web. Trình duyệt dùng JS để tạo tương tác: bấm nút, mở tab, kiểm tra biểu mẫu, cập nhật nội dung mà không cần tải lại toàn bộ trang. JavaScript cũng chạy được bên ngoài trình duyệt, ví dụ bằng **Node.js**.

Một tệp JavaScript cơ bản thường có đuôi .js. Ví dụ, lưu đoạn này trong hello.js:

~~~js
const ten = "RightWISE";
console.log(`Xin chào từ ${ten}!`);
~~~

Có thể chạy bằng Node.js trong terminal:

~~~sh
node hello.js
~~~

Trong dự án này, mã nguồn có đuôi .ts hoặc .tsx vì được viết bằng TypeScript. Công cụ của Next.js và NestJS sẽ xử lý mã TypeScript để chạy ứng dụng.

## 3. TypeScript khác JavaScript thế nào?

**TypeScript (TS)** bổ sung kiểu dữ liệu cho JavaScript. Có thể xem nó là JavaScript có thêm cách mô tả dữ liệu mong đợi. Trước khi chạy, TypeScript kiểm tra một số lỗi thường gặp, ví dụ dùng nhầm chữ với số hoặc quên xử lý giá trị có thể bị thiếu.

JavaScript:

~~~js
function cong(a, b) {
  return a + b;
}
~~~

TypeScript:

~~~ts
function cong(a: number, b: number): number {
  return a + b;
}
~~~

Trong ví dụ TS, a: number nói rằng a phải là số, còn : number sau dấu ngoặc nói hàm trả về một số.

RightWISE dùng TypeScript vì nhiều phần trao đổi dữ liệu với nhau: giao diện gửi ảnh hoặc đường dẫn, backend trả về thông tin sản phẩm, trạng thái và nguồn tham khảo. Kiểu dữ liệu giúp diễn tả dữ liệu nào cần có và giúp phát hiện lỗi ngay lúc viết code. Trình duyệt không chạy trực tiếp cú pháp kiểu TS; Next.js/NestJS cùng TypeScript sẽ biên dịch và đóng gói ứng dụng.

> TSX là tệp TypeScript có thêm cú pháp giao diện JSX của React. Ví dụ các thành phần UI trong apps/nextjs-frontend/components/ đều là .tsx.

## 4. Website này gồm những phần nào?

Repo chia thành hai ứng dụng trong một workspace pnpm — kiểu tổ chức này thường gọi là **monorepo**:

| Phần | Công nghệ | Việc chính | Địa chỉ khi chạy local |
| --- | --- | --- | --- |
| Web frontend | Next.js, React, TypeScript | Hiển thị trang và nhận thao tác của người dùng | http://localhost:3001 |
| API backend | NestJS, TypeScript | Nhận yêu cầu, xử lý ảnh/đường dẫn, gọi dịch vụ AI và trả kết quả | http://localhost:3000 |

~~~mermaid
flowchart LR
    U[Người dùng] --> W[Web: Next.js và React]
    W -->|Ảnh hoặc đường dẫn| A[API: NestJS]
    A -->|Đọc thông tin và tìm nguồn| AI[Dịch vụ AI Gateway và Tako Search]
    AI --> A
    A -->|Kết quả JSON| W
    W --> U
~~~

**Frontend** là phần chạy trong trình duyệt mà người dùng nhìn thấy. **Backend** là phần xử lý phía máy chủ. **API** là những địa chỉ và quy ước để frontend gửi yêu cầu cho backend.

### Cấu trúc thư mục chính

~~~text
.
├── apps/
│   ├── nextjs-frontend/   # Website Next.js
│   │   ├── app/           # Trang chính, khung trang và CSS
│   │   └── components/    # Các phần UI nhỏ có thể tái sử dụng
│   └── nestjs-backend/    # API NestJS
│       └── src/           # Điểm khởi động, controller, service và kiểu dữ liệu
├── package.json           # Lệnh dùng chung cho cả repo
├── pnpm-workspace.yaml    # Khai báo các ứng dụng trong workspace
└── README.md              # Tài liệu bạn đang đọc
~~~

## 5. Chạy dự án trên máy

### Cài công cụ cần thiết

- **Node.js 24.x** — phiên bản được khai báo trong repo.
- **pnpm 12.11.2** — trình quản lý các gói thư viện. Có thể bật pnpm thông qua Corepack đi kèm Node.js:

~~~sh
corepack enable
corepack prepare pnpm@12.11.2 --activate
~~~

### Cài thư viện và tạo file cấu hình

Mở terminal ở thư mục gốc của repo, rồi chạy:

~~~sh
pnpm install
cp apps/nestjs-backend/.env.example apps/nestjs-backend/.env
cp apps/nextjs-frontend/.env.example apps/nextjs-frontend/.env.local
~~~

Mở apps/nestjs-backend/.env, điền AI_GATEWAY_API_KEY do người quản lý dự án cung cấp. Không đưa API key vào code, README, ảnh chụp màn hình công khai hoặc Git. Nếu không có key, phần giao diện vẫn chạy nhưng tính năng tra cứu cần backend và sẽ không hoàn tất.

UPSTASH_REDIS_REST_URL và UPSTASH_REDIS_REST_TOKEN có thể để trống khi học và chạy local. Khi thiếu Redis, API dùng bộ nhớ tạm của tiến trình để lưu kết quả trong 24 giờ; khi deploy nhiều máy chủ, Upstash giúp chia sẻ cache giữa các máy.

### Khởi động hai ứng dụng

Mở **hai cửa sổ terminal** tại thư mục gốc repo. Chạy một lệnh trong mỗi cửa sổ:

~~~sh
pnpm dev:api
~~~

~~~
pnpm dev:web
~~~

Mở http://localhost:3001 trong trình duyệt. Web gọi API ở http://localhost:3000; hai tiến trình cần chạy đồng thời để tính năng kiểm tra hoạt động.

## 6. Khám phá và sửa giao diện

### React và component

**React** là thư viện để xây dựng giao diện từ các khối nhỏ gọi là **component**. Một component có thể là một nút, thẻ kết quả, phần đầu trang hoặc cả một khu vực lớn. Dự án này đặt component trong apps/nextjs-frontend/components/.

Trang chủ ghép các component với nhau ở [apps/nextjs-frontend/app/page.tsx](apps/nextjs-frontend/app/page.tsx). Khung HTML chung, tiêu đề tab trình duyệt và nạp CSS được khai báo ở [apps/nextjs-frontend/app/layout.tsx](apps/nextjs-frontend/app/layout.tsx).

| Tệp component | Chức năng |
| --- | --- |
| verification-widget.tsx | Khu vực chính để chọn ảnh hoặc nhập link, gửi yêu cầu đến API, và quản lý trạng thái đang tải/lỗi/kết quả. |
| verification-result.tsx | Trình bày kết quả backend trả về và nút kiểm tra sản phẩm khác. |
| site-chrome.tsx | Thanh điều hướng đầu trang và chân trang. |
| hero-section.tsx | Phần giới thiệu lớn đầu trang và nút camera nổi. |
| content-sections.tsx | Các phần giới thiệu sứ mệnh, quy trình RightWISE và nội dung cho lớp học. |
| spread-simulator.tsx | Mô phỏng cách thông tin lan truyền. |
| pillars-section.tsx | Trình bày các nguyên tắc/chủ đề chính. |
| verification-lab.tsx | Bài tập tương tác: đọc tình huống, mở manh mối và chọn kết luận. |
| pointer-highlight.tsx | Hiệu ứng con trỏ trang trí. |
| copy-control.tsx | Nút sao chép nội dung vào clipboard. |

### Component hoạt động ra sao?

Component thường trả về JSX — cú pháp gần giống HTML — để mô tả thứ cần hiện trên trang. Ví dụ, đây là một component React rất nhỏ:

~~~tsx
function LoiChao() {
  return <h1>Chào cả lớp!</h1>;
}
~~~

Component có thể nhận dữ liệu qua **props** và lưu trạng thái thay đổi qua **state**. Trong verification-widget.tsx, file lưu ảnh đã chọn, loading cho biết API đang xử lý, còn result giữ kết quả để hiển thị. Khi người dùng bấm nút, hàm xử lý gửi yêu cầu rồi cập nhật state; React dựng lại phần giao diện liên quan.

### CSS dùng để làm gì, sửa ở đâu?

**CSS** quyết định giao diện trông như thế nào: màu sắc, cỡ chữ, khoảng cách, bố cục, viền và cách trang thích nghi với màn hình nhỏ. Phần lớn style của website nằm trong [apps/nextjs-frontend/app/globals.css](apps/nextjs-frontend/app/globals.css). Ví dụ component dùng class snap-card, CSS có thể chọn class đó bằng .snap-card { ... }.

Khi muốn thay giao diện, hãy thử theo thứ tự:

1. Tìm component tương ứng trong components/ để sửa chữ, nội dung hoặc cách tương tác.
2. Tìm tên class của phần tử đó trong globals.css để sửa màu, cỡ chữ hoặc bố cục.
3. Lưu tệp và xem trang đang chạy ở http://localhost:3001; Next.js thường tự cập nhật.

Một số style nhỏ được viết trực tiếp trên JSX bằng thuộc tính style. Các style dùng chung và thiết kế chính vẫn tập trung trong globals.css.

### Đường đi của thao tác kiểm tra

Trong verification-widget.tsx, luồng cơ bản là:

1. Người dùng chọn chế độ ảnh hoặc đường dẫn.
2. Component kiểm tra dữ liệu đầu vào và báo lỗi nếu chưa hợp lệ.
3. Với ảnh, trình duyệt nén ảnh trước khi gửi. Với đường dẫn, trình duyệt gửi chuỗi JSON.
4. Component gọi endpoint backend bằng fetch.
5. Khi nhận phản hồi, component lưu kết quả vào state và hiển thị VerificationResultPanel.

Muốn thay nội dung kết quả, xem verification-result.tsx. Nếu thay cấu trúc dữ liệu phản hồi, cần sửa đồng bộ kiểu VerificationResultData ở đầu tệp kết quả và kiểu VerificationResponse phía API.

## 7. Khám phá backend

Backend dùng **NestJS**, một framework Node.js giúp chia mã thành các phần có trách nhiệm rõ ràng. Trong dự án, các vai trò chính là:

- **Controller** nhận request HTTP, đọc dữ liệu đầu vào và gọi xử lý phù hợp.
- **Service** thực hiện công việc nghiệp vụ như chuẩn hóa ảnh, gọi AI hoặc tạo kết quả.
- **Module** đăng ký controller và service để NestJS biết cách kết nối chúng.
- **Type/interface** mô tả hình dạng dữ liệu giữa các phần.

### Tệp backend nên xem trước

| Tệp | Vai trò |
| --- | --- |
| apps/nestjs-backend/src/main.ts | Điểm khởi động API; bật CORS, kiểm tra dữ liệu đầu vào và mở cổng server. |
| apps/nestjs-backend/src/app.module.ts | Đăng ký các controller và service của ứng dụng. |
| apps/nestjs-backend/src/app.controller.ts | Endpoint kiểm tra sức khỏe /api/v1/health và danh mục /api/v1/catalog/categories. |
| apps/nestjs-backend/src/verification/verification.controller.ts | Nhận ảnh hoặc URL tại các endpoint kiểm tra. |
| apps/nestjs-backend/src/verification/verification.service.ts | Điều phối quy trình kiểm tra ảnh/URL và ghép dữ liệu thành kết quả. |
| apps/nestjs-backend/src/ai/ai-gateway.service.ts | Gọi AI Gateway để đọc nhãn/trang và tìm thông tin sản phẩm qua Tako Search. |
| apps/nestjs-backend/src/verification/url-safety.ts | Chuẩn hóa và kiểm tra URL trước khi máy chủ truy cập trang. |
| apps/nestjs-backend/src/verification/match-evidence.ts | So sánh thông tin trích xuất với bằng chứng tìm được, tạo kết luận và lời khuyên. |
| apps/nestjs-backend/src/verification/verification.types.ts | Mô tả dữ liệu kết quả API. |
| apps/nestjs-backend/src/cache/cache.service.ts | Lưu kết quả 24 giờ để hạn chế phải xử lý/truy vấn lại cùng dữ liệu. |

### Hai endpoint kiểm tra

| Phương thức và đường dẫn | Gửi lên | Ý nghĩa |
| --- | --- | --- |
| POST /api/v1/verifications/image | Ảnh dạng multipart/form-data, trường tên file | Đọc thông tin trên nhãn ảnh rồi tìm nguồn công khai để đối chiếu. |
| POST /api/v1/verifications/url | JSON như { "url": "https://..." } | Đọc nội dung trang công khai, nhận diện sản phẩm rồi tìm nguồn đối chiếu. |

GET /api/v1/health kiểm tra API có chạy và đã có cấu hình AI chưa. GET /api/v1/catalog/categories trả về các danh mục hiện có.

### Backend xử lý thế nào?

**Với ảnh:** controller nhận ảnh → service kiểm tra và chuẩn hóa ảnh → tìm cache → nếu chưa có, AI Gateway trích xuất thông tin nhìn thấy → Tako Search tìm nguồn công khai → match-evidence.ts tạo dữ liệu kết quả → API trả JSON cho frontend.

**Với URL:** controller nhận URL → url-safety.ts chỉ cho phép truy cập trang HTTP/HTTPS công khai và kiểm tra chuyển hướng → backend lấy nội dung trang → AI trích xuất thông tin sản phẩm → bước tìm kiếm, đối chiếu và trả kết quả tương tự luồng ảnh.

Backend lưu dữ liệu cache, không lưu ảnh tải lên hay nội dung trang vào kho lưu trữ lâu dài của ứng dụng. Thông tin trả về là thông tin tìm được để tham khảo. Nếu muốn thay cách kết luận, hãy đọc match-evidence.ts và kiểu kết quả trước khi sửa; không nên hiểu kết quả tìm kiếm là bằng chứng chứng nhận pháp lý.

## 8. Các lệnh thường dùng

Chạy các lệnh ở thư mục gốc repo:

| Lệnh | Việc thực hiện |
| --- | --- |
| pnpm dev:web | Chạy frontend ở chế độ phát triển. |
| pnpm dev:api | Chạy backend và tự khởi động lại khi code thay đổi. |
| pnpm typecheck | Kiểm tra kiểu TypeScript trong các ứng dụng. |
| pnpm build:web | Tạo bản build frontend. |
| pnpm build:api | Tạo bản build backend. |
| pnpm test | Chạy các bài test của API. |

## 9. Đưa ứng dụng lên mạng

Repo được cấu hình để triển khai thành **hai project Vercel riêng** từ cùng Git repository:

1. Tạo project web với Root Directory apps/nextjs-frontend.
2. Tạo project API với Root Directory apps/nestjs-backend.
3. Cấu hình AI_GATEWAY_API_KEY cho API; có thể thêm UPSTASH_REDIS_REST_URL và UPSTASH_REDIS_REST_TOKEN để dùng cache chung.
4. Cấu hình WEB_ORIGIN ở API bằng domain của web.
5. Cấu hình NEXT_PUBLIC_API_BASE_URL ở web bằng domain của API.
6. Deploy API trước, rồi deploy web.

Các biến bí mật chỉ đặt trong phần Environment Variables của Vercel, không commit vào Git. Xem thêm ví dụ trong .env.example của từng ứng dụng.

## 10. Bắt đầu từ đâu?

Nếu mới làm quen với lập trình, có thể khám phá từng bước:

1. Chạy được website theo [mục 5](#5-chạy-dự-án-trên-máy).
2. Mở apps/nextjs-frontend/app/page.tsx, tìm component HeroSection hoặc ClassroomSection.
3. Thử sửa một dòng chữ, lưu lại và xem trang tự cập nhật.
4. Tìm class CSS của dòng chữ đó trong apps/nextjs-frontend/app/globals.css và thử đổi màu.
5. Đọc verification-widget.tsx để xem thao tác nút gọi API ra sao.
6. Lần theo endpoint từ controller đến service ở apps/nestjs-backend/src/verification/.

Không cần hiểu toàn bộ repo trong một lần. Hãy chọn một thao tác nhìn thấy trên trang, tìm component tạo ra nó, rồi lần theo dữ liệu mà component gửi hoặc nhận.
