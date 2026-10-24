# RightWISE

> Tài liệu nhập môn dành cho học sinh cấp 3 muốn hiểu và thử sửa dự án. Không cần biết hết mọi thứ trước khi bắt đầu: hãy đi từ khái niệm nhỏ, chạy ứng dụng, rồi chọn một phần để khám phá.

RightWISE là website giúp người dùng đọc thông tin trên nhãn sản phẩm hoặc trong một đường dẫn, rồi tìm thông tin công khai về sản phẩm và nguồn sản xuất để tham khảo. Kết quả giúp người dùng tự đối chiếu; đây **không phải** kết luận pháp lý hay xác nhận chứng nhận OCOP.

## Mục lục

- [1. Trước khi viết code: máy tính làm theo chỉ dẫn](#1-trước-khi-viết-code-máy-tính-làm-theo-chỉ-dẫn)
- [2. Cài công cụ và chạy JavaScript lần đầu](#2-cài-công-cụ-lần-đầu)
- [3. JavaScript cơ bản: biến và kiểu dữ liệu](#3-javascript-cơ-bản-biến-và-kiểu-dữ-liệu)
- [4. TypeScript khác JavaScript thế nào?](#4-typescript-khác-javascript-thế-nào)
- [5. Website này gồm những phần nào?](#5-website-này-gồm-những-phần-nào)
- [6. Cài đặt và chạy RightWISE](#6-cài-đặt-và-chạy-rightwise)
- [7. Khám phá và sửa giao diện](#7-khám-phá-và-sửa-giao-diện)
- [8. Khám phá backend](#8-khám-phá-backend)
- [9. Các lệnh thường dùng](#9-các-lệnh-thường-dùng)
- [10. Đưa ứng dụng lên mạng](#10-đưa-ứng-dụng-lên-mạng)
- [11. Bắt đầu từ đâu?](#11-bắt-đầu-từ-đâu)

## 1. Trước khi viết code: máy tính làm theo chỉ dẫn

**Lập trình** là viết chỉ dẫn để máy tính làm một việc. Máy tính không tự hiểu ý định của mình; nó chỉ làm theo lệnh và dữ liệu mình đưa.

Một chương trình thường đi theo vòng này:

1. **Nhận dữ liệu vào**: người dùng chọn ảnh nhãn sản phẩm.
2. **Xử lý**: chương trình kiểm tra ảnh, gửi ảnh để đọc thông tin.
3. **Đưa kết quả ra**: trang hiện tên sản phẩm hoặc thông báo lỗi.

Có thể hình dung như một công thức nấu ăn: nguyên liệu là dữ liệu đầu vào, các bước nấu là thuật toán, món ăn hoàn thành là kết quả.

### Thuật toán là gì?

**Thuật toán** là danh sách các bước rõ ràng để giải một bài toán. Ví dụ thuật toán kiểm tra ảnh:

1. Chờ người dùng chọn tệp.
2. Nếu chưa chọn tệp, báo “Hãy chọn ảnh”.
3. Nếu tệp không phải ảnh, báo lỗi.
4. Nếu ảnh hợp lệ, gửi ảnh tới backend.
5. Chờ backend xử lý.
6. Hiện thông tin nhận được hoặc báo lỗi.

Sau này khi đọc code, hãy thử hỏi: “Dòng này nhận dữ liệu, xử lý hay hiển thị kết quả?”

### Tệp code là gì?

Tệp code là một tệp văn bản chứa các lệnh. Tên tệp thường có phần mở rộng cho biết ngôn ngữ hoặc mục đích:

- **.js**: tệp JavaScript.
- **.ts**: tệp TypeScript.
- **.tsx**: TypeScript có chứa cú pháp giao diện React.
- **.css**: quy tắc trang trí giao diện.

Đuôi tệp phải đúng. Nếu vô tình lưu thành index.js.txt, máy tính sẽ coi đó là tệp văn bản thường chứ không phải tệp JavaScript.

## 2. Cài công cụ lần đầu

Để viết và chạy ví dụ JavaScript, cần có một trình soạn thảo code và Node.js. Sau đó mới cần cài thư viện của dự án.

### Bước 1: Cài VS Code

VS Code là ứng dụng miễn phí để mở thư mục dự án, viết code và mở terminal ngay trong thư mục đó.

1. Vào [trang tải VS Code chính thức](https://code.visualstudio.com/).
2. Chọn phiên bản cho Windows hoặc macOS.
3. Mở tệp vừa tải và làm theo các bước cài đặt mặc định.
4. Mở VS Code sau khi cài xong.

### Bước 2: Cài Node.js phiên bản dự án cần

**Node.js** là chương trình chạy JavaScript ngoài trình duyệt. Trong repo này, phiên bản yêu cầu là **Node.js 24.x**.

1. Vào [trang tải Node.js chính thức](https://nodejs.org/en/download).
2. Chọn phiên bản **24.x LTS** và đúng hệ điều hành máy tính. Windows thường dùng trình cài đặt .msi; macOS thường dùng .pkg.
3. Mở tệp tải về, đồng ý các bước cài đặt mặc định.
4. Đóng rồi mở lại VS Code để terminal nhận ra Node.js mới cài.

Kiểm tra đã cài chưa:

- Trong VS Code, mở menu **Terminal → New Terminal**.
- Gõ lệnh dưới đây rồi nhấn Enter:

~~~sh
node --version
~~~

Nếu thấy kết quả bắt đầu bằng v24, ví dụ v24.12.0, Node.js đã sẵn sàng. Kiểm tra thêm npm, trình quản lý gói đi kèm Node.js:

~~~sh
npm --version
~~~

Nếu thấy thông báo “node is not recognized” trên Windows hoặc “command not found” trên macOS, hãy đóng/mở lại VS Code. Nếu vẫn còn, cài lại Node.js và kiểm tra đã chọn đúng hệ điều hành chưa.

### Bước 3: Tạo một tệp JavaScript đầu tiên

Bài tập này tạo một thư mục riêng, chưa đụng đến code của RightWISE.

1. Trong VS Code, chọn **File → Open Folder**.
2. Tạo một thư mục mới, ví dụ **Documents/lap-javascript**, rồi mở thư mục đó.
3. Trong Explorer bên trái, bấm nút **New File** và đặt tên chính xác là **index.js**.
4. Dán đoạn code này vào:

~~~js
const ten = "RightWISE";
console.log("Xin chào, " + ten + "!");
~~~

5. Lưu bằng Ctrl+S trên Windows hoặc Cmd+S trên macOS.
6. Chọn **Terminal → New Terminal**. Terminal mở ở thư mục đang được mở trong VS Code.
7. Gõ lệnh sau rồi nhấn Enter:

~~~sh
node index.js
~~~

Kết quả mong đợi:

~~~text
Xin chào, RightWISE!
~~~

Lệnh này có nghĩa là: nhờ Node.js chạy tệp tên index.js trong thư mục terminal hiện tại. Nếu terminal báo không tìm thấy index.js, hãy nhìn dòng đường dẫn trong terminal: có thể bạn đang ở nhầm thư mục. Mở đúng thư mục trong VS Code hoặc chuyển thư mục bằng lệnh cd.

> **Phân biệt hai việc:** node index.js dùng để chạy một tệp JavaScript đơn giản. Repo RightWISE không có tệp index.js ở thư mục gốc. Repo có nhiều ứng dụng và thư viện, vì vậy chạy bằng các lệnh pnpm dev:web và pnpm dev:api ở mục 5.

## 3. JavaScript cơ bản: biến và kiểu dữ liệu

### Biến là gì?

**Biến** là tên mình đặt cho một giá trị để chương trình lưu và sử dụng. Ví dụ, tenSanPham là tên biến còn "Trà Shan Tuyết" là giá trị.

~~~js
const tenSanPham = "Trà Shan Tuyết";
let soSao = 4;

console.log(tenSanPham);
console.log(soSao);
~~~

- **const**: dùng mặc định khi không cần gán biến sang một giá trị khác.
- **let**: dùng khi biến cần nhận giá trị mới.
- **var**: cách khai báo cũ. Người mới nên dùng const hoặc let vì hành vi của chúng dễ hiểu và ít gây lỗi hơn.

~~~js
let trangThai = "đang chờ";
trangThai = "đã hoàn tất"; // Được phép vì khai báo bằng let

const ten = "RightWISE";
// ten = "Khác"; // Lỗi: không thể gán lại biến const
~~~

Lưu ý: const ngăn mình gán biến sang một giá trị khác, nhưng nếu giá trị là object hoặc array thì nội dung bên trong vẫn có thể thay đổi. Xem các ví dụ bên dưới.

### Những kiểu dữ liệu thường gặp

| Kiểu | Dùng để lưu | Ví dụ |
| --- | --- | --- |
| String (chuỗi) | Chữ, tên, URL hoặc thông báo | "Mật ong", "https://example.com" |
| Number (số) | Số nguyên hoặc số thập phân | 4, 12.5 |
| Boolean (đúng/sai) | Một câu trả lời chỉ có true hoặc false | true, false |
| Undefined | Biến đã được khai báo nhưng chưa có giá trị | let ketQua; |
| Null | Chủ động ghi rằng hiện không có giá trị | const anh = null; |
| Array (mảng) | Danh sách nhiều giá trị theo thứ tự | ["Trà", "Mật ong"] |
| Object (đối tượng) | Một nhóm thông tin có tên trường | { ten: "Trà", soSao: 4 } |

JavaScript còn có các kiểu ít cần dùng lúc mới bắt đầu: **BigInt** lưu số nguyên cực lớn, **Symbol** tạo giá trị định danh duy nhất. **Function** là hàm; trong JavaScript hàm cũng là một loại object đặc biệt. Array, object và function là các kiểu dữ liệu dạng tham chiếu; các kiểu còn lại trong bảng đầu là kiểu nguyên thủy.

~~~js
const tenSanPham = "Trà";           // String
const soSao = 4;                    // Number
const daXacMinh = false;            // Boolean
let ketQuaTimKiem;                  // Undefined vì chưa gán giá trị
const diaChi = null;                // Null: chưa có địa chỉ
const diemRatLon = 12345678901234567890n; // BigInt, có chữ n cuối
const maDuyNhat = Symbol("ma");     // Symbol
~~~

Muốn biết kiểu của một giá trị, dùng typeof:

~~~js
console.log(typeof "Trà"); // string
console.log(typeof 4);     // number
console.log(typeof true);  // boolean
~~~

Một điều dễ gây ngạc nhiên: typeof null trả về "object" vì lý do lịch sử của JavaScript. Khi kiểm tra giá trị null, so sánh trực tiếp với null.

### Array (mảng): danh sách theo thứ tự

Dùng **array** khi có nhiều giá trị cùng loại hoặc cùng nhóm, chẳng hạn danh sách tên sản phẩm.

~~~js
const sanPhams = ["Trà", "Mật ong", "Gạo"];
~~~

Các vị trí trong array được đánh số từ **0**, không phải từ 1:

~~~js
console.log(sanPhams[0]); // "Trà", phần tử đầu tiên
console.log(sanPhams[1]); // "Mật ong", phần tử thứ hai
console.log(sanPhams.length); // 3, số phần tử
~~~

Đọc một phần tử không làm thay đổi array. Có thể thêm phần tử cuối danh sách bằng push:

~~~js
const tenSanPhams = ["Trà", "Mật ong", "Gạo"];
tenSanPhams.push("Hạt điều");
console.log(tenSanPhams); // ["Trà", "Mật ong", "Gạo", "Hạt điều"]
~~~

Duyệt qua toàn bộ danh sách bằng for...of:

~~~js
for (const sanPham of sanPhams) {
  console.log(sanPham);
}
~~~

**Dùng array khi:** cần giữ một danh sách có thứ tự, ví dụ nhiều sản phẩm, nhiều nguồn tham khảo hoặc nhiều lỗi kiểm tra. Nếu muốn lấy phần tử theo tên thuộc tính, dùng object.

### Object (đối tượng): một vật có nhiều thông tin

Dùng **object** để gom nhiều thuộc tính mô tả cùng một thứ. Ví dụ mỗi sản phẩm có tên, thương hiệu và số sao:

~~~js
const sanPham = {
  ten: "Trà Shan Tuyết",
  thuongHieu: "Làng Mây",
  soSao: 4
};
~~~

Đọc giá trị bằng dấu chấm:

~~~js
console.log(sanPham.ten);        // "Trà Shan Tuyết"
console.log(sanPham["soSao"]);   // 4
~~~

Có thể đổi một thuộc tính nếu khai báo object bằng const; const chỉ ngăn thay toàn bộ biến sang object khác:

~~~js
const monHang = { ten: "Trà Shan Tuyết", soSao: 4 };
monHang.soSao = 5;
console.log(monHang.soSao); // 5
~~~

**Dùng object khi:** một vật có nhiều thông tin mang tên rõ ràng, ví dụ một sản phẩm hoặc một kết quả kiểm tra. Danh sách các sản phẩm có thể là array chứa nhiều object:

~~~js
const danhSach = [
  { ten: "Trà Shan Tuyết", soSao: 4 },
  { ten: "Mật ong rừng", soSao: 3 }
];

console.log(danhSach[0].ten); // "Trà Shan Tuyết"
console.log(danhSach[1].soSao); // 3
~~~

Trong JavaScript, phần tử cuối của array có chỉ số là length - 1. Nếu hỏi vị trí không tồn tại, kết quả thường là undefined:

~~~js
console.log(danhSach[2]); // undefined, vì danh sách chỉ có vị trí 0 và 1
~~~

### Ghép biến, so sánh và quyết định

Dấu + có thể cộng số hoặc nối chuỗi. Khi nối chữ và số, cần chú ý kiểu dữ liệu:

~~~js
console.log(2 + 3);          // 5
console.log("Số sao: " + 4); // "Số sao: 4"
~~~

Các phép so sánh hay gặp là > (lớn hơn), < (nhỏ hơn), >= (lớn hơn hoặc bằng), === (bằng nhau) và !== (khác nhau). Nên dùng === để so sánh vì nó không tự đổi kiểu dữ liệu.

~~~js
const soSao = 4;

if (soSao >= 4) {
  console.log("Có từ 4 sao trở lên");
} else {
  console.log("Có ít hơn 4 sao");
}
~~~

### Hàm: đặt tên cho một nhóm lệnh

**Hàm** gom các lệnh để gọi lại. Thông tin đưa vào hàm gọi là tham số; kết quả hàm gửi ra bằng return.

~~~js
function loiChao(ten) {
  return "Xin chào, " + ten + "!";
}

const loiChaoCuaAn = loiChao("An");
console.log(loiChaoCuaAn); // "Xin chào, An!"
~~~

Nếu cần lặp lại một việc cho từng phần tử, dùng vòng lặp:

~~~js
const sanPhams = ["Trà", "Mật ong", "Gạo"];

for (const sanPham of sanPhams) {
  console.log("Đang xem: " + sanPham);
}
~~~

### Kết nối với dự án

Trong RightWISE, dữ liệu cũng có những dạng tương tự:

- URL người dùng nhập là **string**.
- Trạng thái đang gửi yêu cầu là **boolean**: đang tải hay không.
- Danh sách nguồn tìm được là **array**.
- Thông tin một sản phẩm là **object**, có các trường như tên, thương hiệu và địa chỉ.
- Chưa có hạng sao có thể được biểu diễn bằng **null**.
- Một hàm nhận ảnh, gửi API hoặc định dạng kết quả sẽ thực hiện từng bước của thuật toán.

Đọc code bằng cách tìm biến được khai báo, xem kiểu dữ liệu đang lưu, rồi tìm chỗ biến đó được dùng. Hãy thử đổi giá trị trong bài tập index.js và chạy lại node index.js để thấy kết quả thay đổi.

## 4. TypeScript khác JavaScript thế nào?

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

## 5. Website này gồm những phần nào?

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

## 6. Cài đặt và chạy RightWISE

Mục 2 hướng dẫn cài Node.js và tạo một tệp JavaScript đơn giản. Để chạy repo này còn cần cài các thư viện mà hai ứng dụng sử dụng. Làm lần lượt các bước sau.

### Bước 1: Kiểm tra Node.js

Mở dự án bằng VS Code, chọn **Terminal → New Terminal**, rồi chạy:

~~~sh
node --version
~~~

Repo này cần Node.js 24.x. Nếu máy chưa có hoặc hiện phiên bản khác, làm lại bước cài Node.js ở mục 2, Bước 2.

### Bước 2: Cài pnpm

**pnpm** là công cụ tải và quản lý thư viện cho dự án. Máy đã cài Node.js thì cài đúng phiên bản pnpm repo đang yêu cầu:

~~~sh
npm install --global pnpm@12.11.2
~~~

Đóng/mở lại terminal, rồi kiểm tra:

~~~sh
pnpm --version
~~~

Kết quả cần là 12.11.2. Nếu lệnh npm hoặc pnpm không chạy, khởi động lại VS Code trước; nếu vẫn lỗi, nhờ giáo viên kiểm tra quyền cài phần mềm trên máy.

### Bước 3: Mở đúng thư mục repo và tải thư viện

Trong VS Code, chọn **File → Open Folder** và mở thư mục repo trust-facts-choose-wisely. Đây là thư mục có file package.json ở ngoài cùng. Trong terminal, kiểm tra mình đang ở đúng thư mục:

~~~sh
ls
~~~

Trên Windows PowerShell, có thể dùng dir thay vì ls. Kết quả cần có package.json, pnpm-workspace.yaml và thư mục apps.

Sau đó chạy:

~~~sh
pnpm install
~~~

Lệnh này đọc danh sách thư viện trong package.json rồi tải chúng. Cần kết nối Internet. Chỉ phải cài lại khi thư viện của dự án thay đổi hoặc khi thiết lập repo trên máy mới.

### Bước 4: Tạo file cấu hình local

Trong terminal đang ở thư mục gốc repo, chạy:

~~~sh
cp apps/nestjs-backend/.env.example apps/nestjs-backend/.env
cp apps/nextjs-frontend/.env.example apps/nextjs-frontend/.env.local
~~~

Trên Windows PowerShell nếu lệnh cp báo lỗi, dùng hai lệnh sau:

~~~powershell
Copy-Item apps/nestjs-backend/.env.example apps/nestjs-backend/.env
Copy-Item apps/nextjs-frontend/.env.example apps/nextjs-frontend/.env.local
~~~

Mở apps/nestjs-backend/.env trong VS Code, điền AI_GATEWAY_API_KEY do người quản lý dự án cung cấp. Đây là mật khẩu cho backend gọi dịch vụ AI. Không chia sẻ key, không chụp màn hình có key và không commit file .env lên Git.

Nếu không có key, vẫn có thể xem trang web, sửa chữ và CSS; chức năng tra cứu thật cần key để gọi dịch vụ AI.

UPSTASH_REDIS_REST_URL và UPSTASH_REDIS_REST_TOKEN có thể để trống khi học local. Khi không cấu hình Redis, API dùng bộ nhớ tạm của tiến trình để lưu kết quả trong 24 giờ.

### Bước 5: Khởi động API và website

Cần chạy cả hai ứng dụng cùng lúc. Trong VS Code, chọn **Terminal → New Terminal** hai lần để có hai terminal. Để thấy cách gọi terminal thứ nhất và thứ hai rõ ràng:

**Terminal 1 — API/backend:**

~~~sh
pnpm dev:api
~~~

Chờ đến khi terminal báo ứng dụng đã khởi động. Đừng đóng terminal này.

**Terminal 2 — website/frontend:**

~~~sh
pnpm dev:web
~~~

Mở trình duyệt và vào [http://localhost:3001](http://localhost:3001). Khi xong, quay về từng terminal và nhấn Ctrl+C để dừng ứng dụng.

### Nếu gặp lỗi

- **node, npm hoặc pnpm không nhận dạng được:** đóng/mở VS Code để terminal tải lại cấu hình; kiểm tra các lệnh --version.
- **Cannot find module hoặc thiếu thư viện:** kiểm tra terminal đang ở thư mục gốc repo, rồi chạy pnpm install.
- **Cổng đã được sử dụng:** có thể một bản web/API khác vẫn đang chạy. Tìm terminal cũ và nhấn Ctrl+C.
- **Website mở được nhưng không tra cứu được:** kiểm tra API có đang chạy ở terminal 1 và AI_GATEWAY_API_KEY đã được điền chưa.
- **Ảnh/link báo lỗi:** xem thông báo trên trang và terminal API; không phải mọi trang web đều cho phép máy chủ đọc nội dung.

## 7. Khám phá và sửa giao diện

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

## 8. Khám phá backend

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

## 9. Các lệnh thường dùng

Chạy các lệnh ở thư mục gốc repo:

| Lệnh | Việc thực hiện |
| --- | --- |
| pnpm dev:web | Chạy frontend ở chế độ phát triển. |
| pnpm dev:api | Chạy backend và tự khởi động lại khi code thay đổi. |
| pnpm typecheck | Kiểm tra kiểu TypeScript trong các ứng dụng. |
| pnpm build:web | Tạo bản build frontend. |
| pnpm build:api | Tạo bản build backend. |
| pnpm test | Chạy các bài test của API. |

## 10. Đưa ứng dụng lên mạng

Repo được cấu hình để triển khai thành **hai project Vercel riêng** từ cùng Git repository:

1. Tạo project web với Root Directory apps/nextjs-frontend.
2. Tạo project API với Root Directory apps/nestjs-backend.
3. Cấu hình AI_GATEWAY_API_KEY cho API; có thể thêm UPSTASH_REDIS_REST_URL và UPSTASH_REDIS_REST_TOKEN để dùng cache chung.
4. Cấu hình WEB_ORIGIN ở API bằng domain của web.
5. Cấu hình NEXT_PUBLIC_API_BASE_URL ở web bằng domain của API.
6. Deploy API trước, rồi deploy web.

Các biến bí mật chỉ đặt trong phần Environment Variables của Vercel, không commit vào Git. Xem thêm ví dụ trong .env.example của từng ứng dụng.

## 11. Bắt đầu từ đâu?

Nếu mới làm quen với lập trình, có thể khám phá từng bước:

1. Chạy được website theo [mục 5](#5-chạy-dự-án-trên-máy).
2. Mở apps/nextjs-frontend/app/page.tsx, tìm component HeroSection hoặc ClassroomSection.
3. Thử sửa một dòng chữ, lưu lại và xem trang tự cập nhật.
4. Tìm class CSS của dòng chữ đó trong apps/nextjs-frontend/app/globals.css và thử đổi màu.
5. Đọc verification-widget.tsx để xem thao tác nút gọi API ra sao.
6. Lần theo endpoint từ controller đến service ở apps/nestjs-backend/src/verification/.

Không cần hiểu toàn bộ repo trong một lần. Hãy chọn một thao tác nhìn thấy trên trang, tìm component tạo ra nó, rồi lần theo dữ liệu mà component gửi hoặc nhận.
