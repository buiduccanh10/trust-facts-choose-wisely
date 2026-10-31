"use client";

import { useState } from "react";
import { pillarsData } from "@/data/pillars";

export function PillarsSection() {
  const [selected, setSelected] = useState(0);
  const pillar = pillarsData[selected];

  return (
    <section
      className="sec"
      id="tru-cot"
      style={{ background: "var(--white)", borderBlock: "1px solid var(--line)" }}
    >
      <div className="wrap">
        <div className="sec-head">
          <span className="eyebrow">Ba trụ cột</span>
          <h2 className="h2">Ba năng lực chồng lên nhau.</h2>
          <p className="lede">
            Biết hỏi, biết tìm dấu vết, biết chọn. Chạm vào từng vòng tròn để xem mỗi năng lực cho học sinh luyện điều gì.
          </p>
        </div>

        <div className="pil-grid">
          <div className="venn" role="group" aria-label="Ba trụ cột của RightWISE">
            {pillarsData.map((item, index) => (
              <button
                type="button"
                className={`orb o${index + 1}`}
                aria-pressed={selected === index}
                onMouseEnter={() => setSelected(index)}
                onFocus={() => setSelected(index)}
                onClick={() => setSelected(index)}
                key={item.en}
              >
                <span className="vi">
                  {item.orbLines[0]}
                  <br />
                  {item.orbLines[1]}
                </span>
                <span className="en">
                  {item.orbEnLines[0]}
                  <br />
                  {item.orbEnLines[1]}
                </span>
              </button>
            ))}
            <span className="venn-core" aria-hidden="true">
              Right
              <br />
              WISE
            </span>
          </div>

          <div className="panel" aria-live="polite">
            <span className="en">{pillar.en}</span>
            <h3>{pillar.vi}</h3>
            <p>{pillar.text}</p>
            <p className="q">{pillar.question}</p>
            <span className="lbl">Học sinh luyện</span>
            <ul>
              {pillar.skills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
