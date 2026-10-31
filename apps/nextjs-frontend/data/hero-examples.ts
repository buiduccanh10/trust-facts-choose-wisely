export type HeroExample = {
  avatar: string;
  who: string;
  meta: string;
  text: string;
  clues: string[];
  choice: string;
  stamp: string;
  tone: "good" | "bad";
};

export const heroExamples: readonly HeroExample[] = [
  {
    avatar: "N",
    who: "Nông Sản Sạch 24h",
    meta: "Trang lập cách đây 3 ngày",
    text: "KHẨN: Trái cây vùng Đồi Sương bị tiêm chất kích thích, ăn vào hại gan. Chia sẻ ngay cho người thân!",
    clues: [
      "Trang lập 3 ngày, không rõ chủ trang.",
      "Không có kết quả kiểm nghiệm nào đính kèm.",
      "Không cơ quan hay báo chí nào đưa tin.",
    ],
    choice: "Chưa nên tin, chưa nên chia sẻ.",
    stamp: "Dấu hiệu sai lệch",
    tone: "bad",
  },
  {
    avatar: "O",
    who: "Văn phòng OCOP huyện Đồi Sương",
    meta: "Trang cơ quan, hoạt động nhiều năm",
    text: "Công bố kết quả đánh giá OCOP: Chè Shan tuyết Làng Mây đạt 4 sao. Xem danh sách đầy đủ trên cổng thông tin của tỉnh.",
    clues: [
      "Trang của cơ quan địa phương, có liên hệ rõ.",
      "Dẫn tới danh sách công bố chính thức.",
      "Cổng thông tin của tỉnh có cùng kết quả.",
    ],
    choice: "Có thể tin, nhớ mở danh sách gốc để đối chiếu.",
    stamp: "Có nguồn xác thực",
    tone: "good",
  },
] as const;
