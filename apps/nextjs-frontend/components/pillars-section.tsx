"use client";

import { useState } from "react";

const pillars = [
  { en: "Critical Thinking", vi: "Tư duy phản biện", orb: <>Tư duy<br />phản biện</>, orbEn: <>CRITICAL<br />THINKING</>, text: "Dừng lại trước khi tin. Phân biệt điều được nói là sự kiện, điều là ý kiến và điều chỉ nhằm khiến mình sợ hay giận.", question: "Bài đăng này muốn mình cảm thấy gì, và vì sao?", skills: ["Tách sự kiện khỏi ý kiến trong một bài đăng", "Nhận ra lời giục gấp và cảm xúc bị khuấy động"] },
  { en: "Digital Literacy", vi: "Năng lực thông tin số", orb: <>Năng lực<br />thông tin số</>, orbEn: <>DIGITAL<br />LITERACY</>, text: "Đọc được dấu vết của một thông tin: ai đăng, đăng khi nào, trích từ đâu, hình ảnh có bị cắt ghép hay lấy từ chuyện khác không.", question: "Tin này xuất hiện đầu tiên ở đâu?", skills: ["Xem hồ sơ người đăng và thời điểm đăng", "Tìm lại ảnh, video và trích dẫn về nơi xuất phát"] },
  { en: "Informed Choice", vi: "Lựa chọn dựa trên bằng chứng", orb: <>Lựa chọn<br />có căn cứ</>, orbEn: <>INFORMED CHOICE</>, text: "Chọn mua, chia sẻ hay bỏ qua dựa trên căn cứ kiểm chứng được, thay vì dựa vào số lượt thích hay cảm giác quen tai.", question: "Mình đã có đủ căn cứ để chọn chưa?", skills: ["Phân biệt đủ căn cứ, chưa đủ căn cứ và có dấu hiệu sai", "Giải thích lựa chọn của mình bằng bằng chứng"] },
];

export function PillarsSection() {
  const [selected, setSelected] = useState(0);
  const pillar = pillars[selected];
  return (
    <section className="sec" id="tru-cot" style={{ background: "var(--white)", borderBlock: "1px solid var(--line)" }}>
      <div className="wrap">
        <div className="sec-head"><span className="eyebrow">Ba trụ cột</span><h2 className="h2">Ba năng lực chồng lên nhau.</h2><p className="lede">Biết hỏi, biết tìm dấu vết, biết chọn. Chạm vào từng vòng tròn để xem mỗi năng lực cho học sinh luyện điều gì.</p></div>
        <div className="pil-grid">
          <div className="venn" role="group" aria-label="Ba trụ cột của RightWISE">
            {pillars.map((item, index) => <button type="button" className={`orb o${index + 1}`} aria-pressed={selected === index} onMouseEnter={() => setSelected(index)} onFocus={() => setSelected(index)} onClick={() => setSelected(index)} key={item.en}><span className="vi">{item.orb}</span><span className="en">{item.orbEn}</span></button>)}
            <span className="venn-core" aria-hidden="true">Right<br />WISE</span>
          </div>
          <div className="panel" aria-live="polite"><span className="en">{pillar.en}</span><h3>{pillar.vi}</h3><p>{pillar.text}</p><p className="q">{pillar.question}</p><span className="lbl">Học sinh luyện</span><ul>{pillar.skills.map((skill) => <li key={skill}>{skill}</li>)}</ul></div>
        </div>
      </div>
    </section>
  );
}
