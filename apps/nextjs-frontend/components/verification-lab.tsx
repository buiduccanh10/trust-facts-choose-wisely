"use client";

import { useMemo, useState } from "react";

type Verdict = "good" | "unsure" | "bad";
type ClueKey = "W" | "I" | "S";
type Scenario = {
  who: string; meta: string; text: string; chips?: string[];
  clues: Record<ClueKey, string>; answer: Verdict; explanation: string;
};
const scenarios: Scenario[] = [
  {
    who: "Nông Sản Sạch 24h", meta: "Trang mới lập, 3 ngày trước",
    text: "KHẨN CẤP: Bưởi da xanh vùng Đồi Sương bị tiêm hóa chất tăng ngọt, ăn vào hỏng gan! Chia sẻ ngay trước khi quá muộn!!!",
    clues: { W: "Trang mới lập, không rõ người quản lý và không có lịch sử hoạt động đáng tin cậy.", I: "Bài đăng không cung cấp kết quả kiểm nghiệm, tài liệu hay bằng chứng có thể kiểm tra.", S: "Chưa có nguồn độc lập hoặc cơ quan quản lý xác nhận thông tin này." },
    answer: "bad", explanation: "Bài đăng đánh vào nỗi sợ, giục chia sẻ gấp, ẩn danh và không có bằng chứng nào kiểm tra được. Chưa chứng minh được là sai, nhưng không đủ căn cứ để tin hay chia sẻ.",
  },
  {
    who: "Văn phòng điều phối OCOP huyện Đồi Sương", meta: "Trang cơ quan địa phương, đăng 2 ngày trước",
    text: "Công bố kết quả đánh giá OCOP năm nay: Chè Shan tuyết Làng Mây đạt 4 sao. Danh sách đầy đủ xem tại cổng thông tin của tỉnh.",
    chips: ["Có đường dẫn tới danh sách", "Có số điện thoại liên hệ"],
    clues: { W: "Trang do cơ quan địa phương quản lý, có địa chỉ, số điện thoại và lịch sử đăng bài nhiều năm.", I: "Bài ghi rõ thời điểm đánh giá và dẫn tới danh sách công bố chính thức.", S: "Danh sách trên cổng thông tin của tỉnh có đúng sản phẩm này, cùng xếp hạng." },
    answer: "good", explanation: "Người đăng rõ ràng, có tài liệu gốc để kiểm tra và hai nguồn độc lập khớp nhau. Tin này đáng tin. Kiểm chứng không có nghĩa là nghi ngờ mọi thứ.",
  },
  {
    who: "Chị Mai Review Đồ Ăn", meta: "Tài khoản cá nhân, 18 nghìn người theo dõi",
    text: "Mẹo phân biệt: mật ong thật không bao giờ đóng đường. Hũ nào đóng đường là mật pha, đừng mua nhé cả nhà!",
    chips: ["18 nghìn người theo dõi", "Dựa trên kinh nghiệm cá nhân"],
    clues: { W: "Một người làm nội dung ẩm thực, không phải chuyên gia về ong mật hay thực phẩm. Không bán mật ong.", I: "Chỉ dựa trên kinh nghiệm cá nhân, không dẫn nguồn khoa học hay kết quả kiểm nghiệm.", S: "Tài liệu của các tổ chức về thực phẩm và nuôi ong cho biết mật ong nguyên chất có thể kết tinh tự nhiên, tùy thành phần đường và nhiệt độ bảo quản." },
    answer: "bad", explanation: "Nghe hợp lý và đến từ người có nhiều người theo dõi, nhưng khẳng định này sai vì kết tinh là hiện tượng tự nhiên của mật ong. Số người theo dõi không thay thế cho bằng chứng.",
  },
  {
    who: "Anh Tuấn Livestream", meta: "Người bán hàng, đang bán trong buổi phát",
    text: "Nước mắm truyền thống Cồn Sóng hơn hẳn nước mắm công nghiệp: đạm cao gấp đôi, đã có phiếu kiểm nghiệm! Chốt đơn hôm nay giảm 30%.",
    chips: ["Giảm giá có hạn", "Phiếu kiểm nghiệm chỉ hiện lướt qua"],
    clues: { W: "Người đăng chính là người bán, nên có lợi khi bạn tin và mua ngay.", I: "Phiếu kiểm nghiệm chỉ hiện lướt trong video, bị che tên đơn vị và ngày cấp, không đọc được số liệu.", S: "Chưa tìm thấy kết quả kiểm nghiệm độc lập nào về sản phẩm này." },
    answer: "unsure", explanation: "Chưa thể kết luận đúng hay sai. Người bán có lợi ích, bằng chứng bị che và chưa có nguồn độc lập. Cách chọn khôn ngoan là chờ thêm căn cứ rồi mới mua hay chia sẻ.",
  },
];
const verdicts: { key: Verdict; label: string }[] = [
  { key: "good", label: "Đáng tin" },
  { key: "unsure", label: "Chưa đủ căn cứ" },
  { key: "bad", label: "Có dấu hiệu sai lệch" },
];
const probes: { key: ClueKey; label: string }[] = [
  { key: "W", label: "Ai đăng, và ai được lợi?" },
  { key: "I", label: "Bằng chứng gốc ở đâu?" },
  { key: "S", label: "Các nguồn khác nói gì?" },
];

export function VerificationLabSection() {
  const [current, setCurrent] = useState(0);
  const [opened, setOpened] = useState<Record<number, ClueKey[]>>({});
  const [answers, setAnswers] = useState<Record<number, Verdict>>({});
  const [hint, setHint] = useState("");
  const scenario = scenarios[current];
  const clues = opened[current] ?? [];
  const answer = answers[current];
  const stats = useMemo(() => {
    const done = Object.keys(answers).length;
    const right = scenarios.reduce((total, item, index) => total + (answers[index] === item.answer ? 1 : 0), 0);
    return { done, right };
  }, [answers]);
  const chooseScenario = (index: number) => { setCurrent(index); setHint(""); };
  const toggleClue = (key: ClueKey) => {
    setOpened((previous) => {
      const existing = previous[current] ?? [];
      return { ...previous, [current]: existing.includes(key) ? existing.filter((value) => value !== key) : [...existing, key] };
    });
    setHint("");
  };
  const submitVerdict = (verdict: Verdict) => {
    if (clues.length < 2) { setHint("Hãy mở ít nhất hai manh mối trước khi kết luận."); return; }
    setAnswers((previous) => ({ ...previous, [current]: verdict }));
    setHint("");
  };
  const reset = () => { setCurrent(0); setOpened({}); setAnswers({}); setHint(""); };

  return (
    <section className="sec" id="thu-thach" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="sec-head"><span className="eyebrow">Phòng kiểm chứng</span><h2 className="h2">Đọc tin, mở manh mối, rồi mới kết luận.</h2><p className="lede">Bốn tình huống mô phỏng về nông sản và sản phẩm OCOP. Tên sản phẩm, tên trang và địa danh đều là hư cấu. Có tin đáng tin, có tin chưa đủ căn cứ, có tin sai.</p></div>
        <div className="lab" id="lab">
          <div className="tabs" role="group" aria-label="Chọn tình huống">{scenarios.map((_, index) => {
            const response = answers[index];
            const status = response ? response === scenarios[index].answer ? "ok" : "no" : "";
            return <button type="button" className="tab" key={index} aria-current={index === current} onClick={() => chooseScenario(index)}><span className={`dot ${status}`} />Tình huống {index + 1}</button>;
          })}</div>
          <div className="lab-main">
            <article className="post-card" aria-live="polite"><span className="tagline">Tin nhận được · mô phỏng</span><div className="who"><span className="avatar">{scenario.who.charAt(0)}</span><div><b>{scenario.who}</b><span className="meta">{scenario.meta}</span></div></div><p className="txt">{scenario.text}</p>{scenario.chips?.length ? <div className="chips">{scenario.chips.map((chip) => <span className="chip" key={chip}>{chip}</span>)}</div> : null}</article>
            <div className="side">
              <h3>Manh mối <small>mở ít nhất hai</small></h3>
              <div className="probes">{probes.map((probe) => {
                const isOpen = clues.includes(probe.key);
                return <div className={`probe ${isOpen ? "open" : ""}`} key={probe.key}><button type="button" className="pbtn" aria-expanded={isOpen} onClick={() => toggleClue(probe.key)}><span className="pk">{probe.key}</span><span>{probe.label}</span><span className="chev">{isOpen ? "−" : "+"}</span></button>{isOpen ? <p className="pres">{scenario.clues[probe.key]}</p> : null}</div>;
              })}</div>
              <h3>Kết luận của bạn</h3>
              <div className="verdicts">{verdicts.map((verdict) => {
                let className = "vbtn";
                if (answer) className += verdict.key === scenario.answer ? " right" : verdict.key === answer ? " wrong" : " dim";
                return <button type="button" className={className} key={verdict.key} disabled={Boolean(answer)} onClick={() => submitVerdict(verdict.key)}>{verdict.label}</button>;
              })}</div>
              <p className="hint" aria-live="polite">{hint}</p>
              <div aria-live="polite">{answer ? <div className={`fb ${answer === scenario.answer ? "ok" : "no"}`}><b>{answer === scenario.answer ? "Chính xác." : "Chưa đúng."} Kết luận phù hợp: {verdicts.find((item) => item.key === scenario.answer)?.label}.</b><span>{scenario.explanation}</span></div> : null}</div>
            </div>
          </div>
          <div className="lab-foot"><span className="score">Đúng {stats.right}/4 · đã trả lời {stats.done}/4{stats.done === 4 ? stats.right === 4 ? " · Bạn kiểm chứng rất chắc tay." : " · Thử lại và mở đủ ba manh mối trước khi kết luận." : ""}</span><button type="button" className="btn btn-ghost btn-sm" onClick={reset}>Làm lại từ đầu</button></div>
        </div>
      </div>
    </section>
  );
}
