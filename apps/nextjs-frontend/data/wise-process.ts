export type WiseStep = {
  letter: string;
  en: string;
  title: string;
  text: string;
};

export type ClassroomActivity = {
  time: string;
  title: string;
  description: string;
  outcome: string;
};

export const wiseSteps: WiseStep[] = [
  {
    letter: "W",
    en: "Who",
    title: "Ai đăng, và ai được lợi?",
    text: "Xem trang cá nhân, thời điểm lập trang và các bài đăng trước đó. Nếu người đăng đang bán hàng, họ có lợi khi bạn tin ngay.",
  },
  {
    letter: "I",
    en: "Is there evidence",
    title: "Bằng chứng gốc ở đâu?",
    text: "Tìm tài liệu gốc như kết quả kiểm nghiệm, giấy chứng nhận hay số liệu có ngày tháng và tên đơn vị cấp. Ảnh chụp mờ chưa phải bằng chứng.",
  },
  {
    letter: "S",
    en: "Search other sources",
    title: "Đối chiếu nguồn khác",
    text: "Tìm ít nhất hai nguồn độc lập: cơ quan quản lý, báo chí chính thống, tổ chức chuyên môn. Một tin được chia sẻ nhiều lần vẫn có thể chỉ có một nguồn.",
  },
  {
    letter: "E",
    en: "Evaluate and choose",
    title: "Cân nhắc rồi chọn",
    text: "Đủ căn cứ thì tin. Chưa đủ thì chờ. Có dấu hiệu sai thì không chia sẻ, và nhắn lại với người đã gửi cho bạn.",
  },
];

export const classroomActivities: ClassroomActivity[] = [
  {
    time: "15 phút",
    title: "Săn tin theo nhóm",
    description:
      "Mỗi nhóm nhận ba bài đăng mô phỏng về nông sản, dùng thẻ WISE để xếp vào ba nhóm: đáng tin, chưa đủ căn cứ, có dấu hiệu sai lệch.",
    outcome: "Bảng xếp nhóm, mỗi lựa chọn có một lý do.",
  },
  {
    time: "1 tuần",
    title: "Truy nguồn sản phẩm quê em",
    description:
      "Chọn một sản phẩm địa phương, tìm tài liệu gốc về nơi sản xuất, chứng nhận và đánh giá. Gặp người làm ra sản phẩm nếu có thể.",
    outcome: "Một trang thông tin xác thực, ghi rõ nguồn.",
  },
  {
    time: "20 phút",
    title: "Phản hồi có trách nhiệm",
    description:
      "Soạn tin nhắn lịch sự gửi lại người đã chuyển tiếp một tin sai trong nhóm gia đình, kèm nguồn đúng và lời cảm ơn vì đã quan tâm.",
    outcome: "Một tin nhắn mẫu có dẫn nguồn.",
  },
];

export const pocketCardPrompts: string[] = [
  "Ai đăng, và ai được lợi nếu mình tin?",
  "Bằng chứng gốc ở đâu, có ngày tháng và đơn vị cấp không?",
  "Có ít nhất hai nguồn độc lập nói giống vậy không?",
  "Đủ căn cứ thì tin. Chưa đủ thì chờ. Có dấu hiệu sai thì không chia sẻ.",
];
