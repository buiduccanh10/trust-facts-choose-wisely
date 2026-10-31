"use client";

import { useVerificationLab } from "@/hooks/use-verification-lab";
import { verdictOptions, probeOptions } from "@/data/lab-scenarios";

export function VerificationLabSection() {
  const {
    current,
    scenario,
    clues,
    answer,
    answers,
    hint,
    stats,
    scenarios,
    chooseScenario,
    toggleClue,
    submitVerdict,
    reset,
  } = useVerificationLab();

  return (
    <section className="sec" id="thu-thach" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="sec-head">
          <span className="eyebrow">Phòng kiểm chứng</span>
          <h2 className="h2">Đọc tin, mở manh mối, rồi mới kết luận.</h2>
          <p className="lede">
            Bốn tình huống mô phỏng về nông sản và sản phẩm OCOP. Tên sản phẩm, tên trang và địa danh đều là hư cấu. Có tin đáng tin, có tin chưa đủ căn cứ, có tin sai.
          </p>
        </div>

        <div className="lab" id="lab">
          <div className="tabs" role="group" aria-label="Chọn tình huống">
            {scenarios.map((_, index) => {
              const response = answers[index];
              const status = response
                ? response === scenarios[index].answer
                  ? "ok"
                  : "no"
                : "";
              return (
                <button
                  type="button"
                  className="tab"
                  key={index}
                  aria-current={index === current}
                  onClick={() => chooseScenario(index)}
                >
                  <span className={`dot ${status}`} />
                  Tình huống {index + 1}
                </button>
              );
            })}
          </div>

          <div className="lab-main">
            <article className="post-card" aria-live="polite">
              <span className="tagline">Tin nhận được · mô phỏng</span>
              <div className="who">
                <span className="avatar">{scenario.who.charAt(0)}</span>
                <div>
                  <b>{scenario.who}</b>
                  <span className="meta">{scenario.meta}</span>
                </div>
              </div>
              <p className="txt">{scenario.text}</p>
              {scenario.chips?.length ? (
                <div className="chips">
                  {scenario.chips.map((chip) => (
                    <span className="chip" key={chip}>
                      {chip}
                    </span>
                  ))}
                </div>
              ) : null}
            </article>

            <div className="side">
              <h3>
                Manh mối <small>mở ít nhất hai</small>
              </h3>
              <div className="probes">
                {probeOptions.map((probe) => {
                  const isOpen = clues.includes(probe.key);
                  return (
                    <div className={`probe ${isOpen ? "open" : ""}`} key={probe.key}>
                      <button
                        type="button"
                        className="pbtn"
                        aria-expanded={isOpen}
                        onClick={() => toggleClue(probe.key)}
                      >
                        <span className="pk">{probe.key}</span>
                        <span>{probe.label}</span>
                        <span className="chev">{isOpen ? "−" : "+"}</span>
                      </button>
                      {isOpen ? (
                        <p className="pres">{scenario.clues[probe.key]}</p>
                      ) : null}
                    </div>
                  );
                })}
              </div>

              <h3>Kết luận của bạn</h3>
              <div className="verdicts">
                {verdictOptions.map((verdict) => {
                  let className = "vbtn";
                  if (answer) {
                    className +=
                      verdict.key === scenario.answer
                        ? " right"
                        : verdict.key === answer
                        ? " wrong"
                        : " dim";
                  }
                  return (
                    <button
                      type="button"
                      className={className}
                      key={verdict.key}
                      disabled={Boolean(answer)}
                      onClick={() => submitVerdict(verdict.key)}
                    >
                      {verdict.label}
                    </button>
                  );
                })}
              </div>

              <p className="hint" aria-live="polite">
                {hint}
              </p>

              <div aria-live="polite">
                {answer ? (
                  <div className={`fb ${answer === scenario.answer ? "ok" : "no"}`}>
                    <b>
                      {answer === scenario.answer ? "Chính xác." : "Chưa đúng."}{" "}
                      Kết luận phù hợp:{" "}
                      {verdictOptions.find((item) => item.key === scenario.answer)?.label}.
                    </b>
                    <span>{scenario.explanation}</span>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="lab-foot">
            <span className="score">
              Đúng {stats.right}/4 · đã trả lời {stats.done}/4
              {stats.done === 4
                ? stats.right === 4
                  ? " · Bạn kiểm chứng rất chắc tay."
                  : " · Thử lại và mở đủ ba manh mối trước khi kết luận."
                : ""}
            </span>
            <button type="button" className="btn btn-ghost btn-sm" onClick={reset}>
              Làm lại từ đầu
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
