import type { CSSProperties } from "react";
import { CopyControl } from "@/components/copy-control";
import {
  wiseSteps,
  classroomActivities,
  pocketCardPrompts,
} from "@/data/wise-process";

export function MissionSection() {
  return (
    <section className="mission" aria-label="Sứ mệnh">
      <div className="wrap mission-grid">
        <span className="eyebrow">Sứ mệnh</span>
        <p className="big rise">
          Giúp học sinh trở thành những người dùng Internet biết{" "}
          <mark>nhận diện thông tin đáng tin cậy</mark>, kiểm chứng nguồn tin và đưa ra quyết định có căn cứ.
        </p>
      </div>
    </section>
  );
}

export function WiseProcessSection() {
  return (
    <section className="sec wise-sec" id="quy-trinh">
      <div className="wrap">
        <div className="sec-head">
          <span className="eyebrow">Quy trình WISE</span>
          <h2 className="h2">Bốn câu hỏi trước khi chia sẻ.</h2>
          <p className="lede">
            Mỗi chữ trong WISE là một câu hỏi. Học sinh có thể đi hết bốn bước trong khoảng nửa phút.
          </p>
        </div>
        <ol className="wise">
          {wiseSteps.map((step, index) => (
            <li
              className="step rise"
              style={{ "--i": index } as CSSProperties}
              key={step.letter}
            >
              <span className="big" aria-hidden="true">
                {step.letter}
              </span>
              <span className="en">{step.en}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function ClassroomSection() {
  return (
    <section
      className="sec"
      id="lop-hoc"
      style={{ background: "var(--white)", borderTop: "1px solid var(--line)" }}
    >
      <div className="wrap room-grid">
        <PocketCard />
        <div>
          <div className="sec-head">
            <span className="eyebrow">Mang vào lớp học</span>
            <h2 className="h2">Từ bài đăng đến cánh đồng.</h2>
            <p className="lede">
              Ba hoạt động giáo viên có thể dùng ngay, từ một tiết học đến một dự án ngắn.
            </p>
          </div>
          <div className="acts">
            {classroomActivities.map((activity) => (
              <Activity
                key={activity.title}
                time={activity.time}
                title={activity.title}
                description={activity.description}
                outcome={activity.outcome}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Activity({
  time,
  title,
  description,
  outcome,
}: {
  time: string;
  title: string;
  description: string;
  outcome: string;
}) {
  return (
    <article className="act">
      <span className="tm">{time}</span>
      <div>
        <h3>{title}</h3>
        <p>{description}</p>
        <p className="out">
          <b>Sản phẩm</b>
          {outcome}
        </p>
      </div>
    </article>
  );
}

function PocketCard() {
  return (
    <div className="pocket">
      <span className="eyebrow">Thẻ bỏ túi</span>
      <h3>Thẻ WISE, 30 giây</h3>
      <ol id="cardList">
        {pocketCardPrompts.map((prompt, index) => (
          <li key={prompt}>
            <b>{"WISE"[index]}</b>
            <span>{prompt}</span>
          </li>
        ))}
      </ol>
      <CopyControl prompts={pocketCardPrompts} />
    </div>
  );
}
