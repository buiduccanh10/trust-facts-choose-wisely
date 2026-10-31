export type PillarItem = {
  en: string;
  vi: string;
  orbLines: string[];
  orbEnLines: string[];
  text: string;
  question: string;
  skills: string[];
};

export const pillarsData: PillarItem[] = [
  {
    en: "Critical Thinking",
    vi: "Tư duy phản biện",
    orbLines: ["Tư duy", "phản biện"],
    orbEnLines: ["CRITICAL", "THINKING"],
    text: "Dừng lại trước khi tin. Phân biệt điều được nói là sự kiện, điều là ý kiến và điều chỉ nhằm khiến mình sợ hay giận.",
    question: "Bài đăng này muốn mình cảm thấy gì, và vì sao?",
    skills: [
      "Tách sự kiện khỏi ý kiến trong một bài đăng",
      "Nhận ra lời giục gấp và cảm xúc bị khuấy động",
    ],
  },
  {
    en: "Digital Literacy",
    vi: "Năng lực thông tin số",
    orbLines: ["Năng lực", "thông tin số"],
    orbEnLines: ["DIGITAL", "LITERACY"],
    text: "Đọc được dấu vết của một thông tin: ai đăng, đăng khi nào, trích từ đâu, hình ảnh có bị cắt ghép hay lấy từ chuyện khác không.",
    question: "Tin này xuất hiện đầu tiên ở đâu?",
    skills: [
      "Xem hồ sơ người đăng và thời điểm đăng",
      "Tìm lại ảnh, video và trích dẫn về nơi xuất phát",
    ],
  },
  {
    en: "Informed Choice",
    vi: "Lựa chọn dựa trên bằng chứng",
    orbLines: ["Lựa chọn", "có căn cứ"],
    orbEnLines: ["INFORMED", "CHOICE"],
    text: "Chọn mua, chia sẻ hay bỏ qua dựa trên căn cứ kiểm chứng được, thay vì dựa vào số lượt thích hay cảm giác quen tai.",
    question: "Mình đã có đủ căn cứ để chọn chưa?",
    skills: [
      "Phân biệt đủ căn cứ, chưa đủ căn cứ và có dấu hiệu sai",
      "Giải thích lựa chọn của mình bằng bằng chứng",
    ],
  },
];
