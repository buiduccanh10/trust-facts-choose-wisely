"use client";

import { useEffect } from "react";

export function PointerHighlightEffect() {
  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      const target = event.target instanceof Element
        ? event.target.closest<HTMLElement>(".top, .claim, .snap-card, .sim, .lab, .pocket, .step, .btn, .bigbtn, .tab, .vbtn")
        : null;
      if (!target) return;
      const bounds = target.getBoundingClientRect();
      if (bounds.width === 0 || bounds.height === 0) return;
      target.style.setProperty("--mx", `${((event.clientX - bounds.left) / bounds.width) * 100}%`);
      target.style.setProperty("--my", `${((event.clientY - bounds.top) / bounds.height) * 100}%`);
    };
    document.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => document.removeEventListener("pointermove", onPointerMove);
  }, []);
  return null;
}
