"use client";

import { useState, useEffect } from "react";
import { heroExamples } from "@/data/hero-examples";

export function useClaimSimulator(intervalMs = 900) {
  const [active, setActive] = useState(0);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setStep((current) => {
        if (current < 4) return current + 1;
        setActive((index) => (index + 1) % heroExamples.length);
        return 0;
      });
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [intervalMs]);

  const currentExample = heroExamples[active];

  return {
    example: currentExample,
    step,
    active,
  };
}
