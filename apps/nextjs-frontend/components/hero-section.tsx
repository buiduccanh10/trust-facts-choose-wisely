"use client";

import { useHeroCanvas } from "@/hooks/use-hero-canvas";
import { useClaimSimulator } from "@/hooks/use-claim-simulator";
import { useScrollVisibility } from "@/hooks/use-scroll-visibility";

function HeroCanvas() {
  const canvasRef = useHeroCanvas();
  return <canvas ref={canvasRef} id="net" aria-hidden="true" />;
}

function ExampleClaim() {
  const { example, step } = useClaimSimulator();

  return (
    <aside className="claim" aria-label="Minh họa cách kiểm chứng một tin">
      <div className="claim-head">
        <span>Tin vừa nhận</span>
        <span>Tình huống mô phỏng</span>
      </div>
      <div className="post">
        <div className="who">
          <span className="avatar">{example.avatar}</span>
          <div>
            <b>{example.who}</b>
            <span className="meta">{example.meta}</span>
          </div>
        </div>
        <p>{example.text}</p>
      </div>
      <ol className="vsteps" aria-live="off">
        {["Ai đăng?", "Bằng chứng?", "Nguồn khác?", "Chọn gì?"].map((label, index) => (
          <li className={step >= index + 1 ? "on" : ""} key={label}>
            <span className="k">{"WISE"[index]}</span>
            <span className="res">
              <b>{label}</b>
              <span>{index === 3 ? example.choice : example.clues[index]}</span>
            </span>
          </li>
        ))}
      </ol>
      <div className="stamp-row">
        <span className={`stamp ${example.tone} ${step >= 4 ? "on" : ""}`}>
          {example.stamp}
        </span>
      </div>
    </aside>
  );
}

export function HeroSection() {
  return (
    <section className="hero" id="hero">
      <div className="blob b1">
        <i />
      </div>
      <div className="blob b2">
        <i />
      </div>
      <div className="blob b3">
        <i />
      </div>
      <HeroCanvas />
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <span className="eyebrow">Giáo dục tư duy phản biện · Nông sản và OCOP</span>
          <h1 className="h1">
            <span className="l1">Trust Facts,</span>
            <span className="l2">
              Choose <em>Wisely.</em>
            </span>
          </h1>
          <p className="sub">Think Critically. Verify Confidently.</p>
          <p className="lede">
            RightWISE giúp học sinh học cách dừng lại trước một thông tin, hỏi về nguồn, đối chiếu bằng chứng rồi mới chọn tin, chia sẻ hay bỏ qua. Chúng ta bắt đầu từ chính nông sản và sản phẩm OCOP của quê hương.
          </p>
          <div className="cta">
            <a className="btn btn-primary" href="#thu-thach">
              Kiểm chứng một tin ngay
            </a>
            <a className="btn btn-ghost" href="#quy-trinh">
              Xem quy trình WISE
            </a>
          </div>
        </div>
        <ExampleClaim />
      </div>
    </section>
  );
}

export function FloatingCameraLink() {
  const isVisible = useScrollVisibility(480);

  return (
    <a className="fab" id="fab" href="#kiem-tra-anh" hidden={!isVisible}>
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M6 15h8l3-5h14l3 5h8v22H6z" />
        <circle cx="24" cy="26" r="7" />
      </svg>
      Chụp ảnh kiểm tra
    </a>
  );
}
