import type { Scenario, VerdictOption, ProbeOption } from "@/types/lab";

export const labScenarios: Scenario[] = [
  {
    who: "Nông Sản Sạch 24h",
    meta: "Trang mới lập, 3 ngày trước",
    text: "KHẨN CẤP: Bưởi da xanh vùng Đồi Sương bị tiêm hóa chất tăng ngọt, ăn vào hỏng gan! Chia sẻ ngay trước khi quá muộn!!!",
    clues: {
      W: "Trang mới lập, không rõ người quản lý và không có lịch sử hoạt động đáng tin cậy.",
      I: "Bài đăng không cung cấp kết quả kiểm nghiệm, tài liệu hay bằng chứng có thể kiểm tra.",
      S: "Chưa có nguồn độc lập hoặc cơ quan quản lý xác nhận thông tin này.",
    },
    answer: "bad",
    explanation:
      "Bài đăng đánh vào nỗi sợ, giục chia sẻ gấp, ẩn danh và không có bằng chứng nào kiểm tra được. Chưa chứng minh được là sai, nhưng không đủ căn cứ để tin hay chia sẻ.",
  },
  {
    who: "Văn phòng điều phối OCOP huyện Đồi Sương",
    meta: "Trang cơ quan địa phương, đăng 2 ngày trước",
    text: "Công bố kết quả đánh giá OCOP năm nay: Chè Shan tuyết Làng Mây đạt 4 sao. Danh sách đầy đủ xem tại cổng thông tin của tỉnh.",
    chips: ["Có đường dẫn tới danh sách", "Có số điện thoại liên hệ"],
    clues: {
      W: "Trang do cơ quan địa phương quản lý, có địa chỉ, số điện thoại và lịch sử đăng bài nhiều năm.",
      I: "Bài ghi rõ thời điểm đánh giá và dẫn tới danh sách công bố chính thức.",
      S: "Danh sách trên cổng thông tin của tỉnh có đúng sản phẩm này, cùng xếp hạng.",
    },
    answer: "good",
    explanation:
      "Người đăng rõ ràng, có tài liệu gốc để kiểm tra và hai nguồn độc lập khớp nhau. Tin này đáng tin. Kiểm chứng không có nghĩa là nghi ngờ mọi thứ.",
  },
  {
    who: "Chị Mai Review Đồ Ăn",
    meta: "Tài khoản cá nhân, 18 nghìn người theo dõi",
    text: "Mẹo phân biệt: mật ong thật không bao giờ đóng đường. Hũ nào đóng đường là mật pha, đừng mua nhé cả nhà!",
    chips: ["18 nghìn người theo dõi", "Dựa trên kinh nghiệm cá nhân"],
    clues: {
      W: "Một người làm nội dung ẩm thực, không phải chuyên gia về ong mật hay thực phẩm. Không bán mật ong.",
      I: "Chỉ dựa trên kinh nghiệm cá nhân, không dẫn nguồn khoa học hay kết quả kiểm nghiệm.",
      S: "Tài liệu của các tổ chức về thực phẩm và nuôi ong cho biết mật ong nguyên chất có thể kết tinh tự nhiên, tùy thành phần đường và nhiệt độ bảo quản.",
    },
    answer: "bad",
    explanation:
      "Nghe hợp lý và đến từ người có nhiều người theo dõi, nhưng khẳng định này sai vì kết tinh là hiện tượng tự nhiên của mật ong. Số người theo dõi không thay thế cho bằng chứng.",
  },
  {
    who: "Anh Tuấn Livestream",
    meta: "Người bán hàng, đang bán trong buổi phát",
    text: "Nước mắm truyền thống Cồn Sóng hơn hẳn nước mắm công nghiệp: đạm cao gấp đôi, đã có phiếu kiểm nghiệm! Chốt đơn hôm nay giảm 30%.",
    chips: ["Giảm giá có hạn", "Phiếu kiểm nghiệm chỉ hiện lướt qua"],
    clues: {
      W: "Người đăng chính là người bán, nên có lợi khi bạn tin và mua ngay.",
      I: "Phiếu kiểm nghiệm chỉ hiện lướt trong video, bị che tên đơn vị và ngày cấp, không đọc được số liệu.",
      S: "Chưa tìm thấy kết quả kiểm nghiệm độc lập nào về sản phẩm này.",
    },
    answer: "unsure",
    explanation:
      "Chưa thể kết luận đúng hay sai. Người bán có lợi ích, bằng chứng bị che và chưa có nguồn độc lập. Cách chọn khôn ngoan là chờ thêm căn cứ rồi mới mua hay chia sẻ.",
  },
];

export const verdictOptions: VerdictOption[] = [
  { key: "good", label: "Đáng tin" },
  { key: "unsure", label: "Chưa đủ căn cứ" },
  { key: "bad", label: "Có dấu hiệu sai lệch" },
];

export const probeOptions: ProbeOption[] = [
  { key: "W", label: "Ai đăng, và ai được lợi?" },
  { key: "I", label: "Bằng chứng gốc ở đâu?" },
  { key: "S", label: "Các nguồn khác nói gì?" },
];
