import type { CSSProperties } from "react";
import { CopyControl } from "@/components/copy-control";

export function MissionSection() {
  return (
    <section className="mission" aria-label="Sứ mệnh">
      <div className="wrap mission-grid">
        <span className="eyebrow">Sứ mệnh</span>
        <p className="big rise">Giúp học sinh trở thành những người dùng Internet biết <mark>nhận diện thông tin đáng tin cậy</mark>, kiểm chứng nguồn tin và đưa ra quyết định có căn cứ.</p>
      </div>
    </section>
  );
}

export function WiseProcessSection() {
  const steps = [
    { letter: "W", en: "Who", title: "Ai đăng, và ai được lợi?", text: "Xem trang cá nhân, thời điểm lập trang và các bài đăng trước đó. Nếu người đăng đang bán hàng, họ có lợi khi bạn tin ngay." },
    { letter: "I", en: "Is there evidence", title: "Bằng chứng gốc ở đâu?", text: "Tìm tài liệu gốc như kết quả kiểm nghiệm, giấy chứng nhận hay số liệu có ngày tháng và tên đơn vị cấp. Ảnh chụp mờ chưa phải bằng chứng." },
    { letter: "S", en: "Search other sources", title: "Đối chiếu nguồn khác", text: "Tìm ít nhất hai nguồn độc lập: cơ quan quản lý, báo chí chính thống, tổ chức chuyên môn. Một tin được chia sẻ nhiều lần vẫn có thể chỉ có một nguồn." },
    { letter: "E", en: "Evaluate and choose", title: "Cân nhắc rồi chọn", text: "Đủ căn cứ thì tin. Chưa đủ thì chờ. Có dấu hiệu sai thì không chia sẻ, và nhắn lại với người đã gửi cho bạn." },
  ];
  return (
    <section className="sec wise-sec" id="quy-trinh">
      <div className="wrap">
        <div className="sec-head"><span className="eyebrow">Quy trình WISE</span><h2 className="h2">Bốn câu hỏi trước khi chia sẻ.</h2><p className="lede">Mỗi chữ trong WISE là một câu hỏi. Học sinh có thể đi hết bốn bước trong khoảng nửa phút.</p></div>
        <ol className="wise">
          {steps.map((step, index) => <li className="step rise" style={{ "--i": index } as CSSProperties} key={step.letter}>
            <span className="big" aria-hidden="true">{step.letter}</span><span className="en">{step.en}</span><h3>{step.title}</h3><p>{step.text}</p>
          </li>)}
        </ol>
      </div>
    </section>
  );
}

export function ClassroomSection() {
  return (
    <section className="sec" id="lop-hoc" style={{ background: "var(--white)", borderTop: "1px solid var(--line)" }}>
      <div className="wrap room-grid">
        <PocketCard />
        <div>
          <div className="sec-head"><span className="eyebrow">Mang vào lớp học</span><h2 className="h2">Từ bài đăng đến cánh đồng.</h2><p className="lede">Ba hoạt động giáo viên có thể dùng ngay, từ một tiết học đến một dự án ngắn.</p></div>
          <div className="acts">
            <Activity time="15 phút" title="Săn tin theo nhóm" description="Mỗi nhóm nhận ba bài đăng mô phỏng về nông sản, dùng thẻ WISE để xếp vào ba nhóm: đáng tin, chưa đủ căn cứ, có dấu hiệu sai lệch." outcome="Bảng xếp nhóm, mỗi lựa chọn có một lý do." />
            <Activity time="1 tuần" title="Truy nguồn sản phẩm quê em" description="Chọn một sản phẩm địa phương, tìm tài liệu gốc về nơi sản xuất, chứng nhận và đánh giá. Gặp người làm ra sản phẩm nếu có thể." outcome="Một trang thông tin xác thực, ghi rõ nguồn." />
            <Activity time="20 phút" title="Phản hồi có trách nhiệm" description="Soạn tin nhắn lịch sự gửi lại người đã chuyển tiếp một tin sai trong nhóm gia đình, kèm nguồn đúng và lời cảm ơn vì đã quan tâm." outcome="Một tin nhắn mẫu có dẫn nguồn." />
          </div>
        </div>
      </div>
    </section>
  );
}

function Activity({ time, title, description, outcome }: { time: string; title: string; description: string; outcome: string }) {
  return <article className="act"><span className="tm">{time}</span><div><h3>{title}</h3><p>{description}</p><p className="out"><b>Sản phẩm</b>{outcome}</p></div></article>;
}

function PocketCard() {
  const prompts = ["Ai đăng, và ai được lợi nếu mình tin?", "Bằng chứng gốc ở đâu, có ngày tháng và đơn vị cấp không?", "Có ít nhất hai nguồn độc lập nói giống vậy không?", "Đủ căn cứ thì tin. Chưa đủ thì chờ. Có dấu hiệu sai thì không chia sẻ."];
  return (
    <div className="pocket">
      <span className="eyebrow">Thẻ bỏ túi</span><h3>Thẻ WISE, 30 giây</h3>
      <ol id="cardList">{prompts.map((prompt, index) => <li key={prompt}><b>{"WISE"[index]}</b><span>{prompt}</span></li>)}</ol>
      <CopyControl prompts={prompts} />
    </div>
  );
}

