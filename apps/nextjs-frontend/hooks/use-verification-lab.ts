"use client";

import { useState, useMemo, useCallback } from "react";
import type { Verdict, ClueKey, LabStats } from "@/types/lab";
import { labScenarios } from "@/data/lab-scenarios";

export function useVerificationLab() {
  const [current, setCurrent] = useState(0);
  const [opened, setOpened] = useState<Record<number, ClueKey[]>>({});
  const [answers, setAnswers] = useState<Record<number, Verdict>>({});
  const [hint, setHint] = useState("");

  const scenario = labScenarios[current];
  const clues = opened[current] ?? [];
  const answer = answers[current];

  const stats: LabStats = useMemo(() => {
    const done = Object.keys(answers).length;
    const right = labScenarios.reduce(
      (total, item, index) => total + (answers[index] === item.answer ? 1 : 0),
      0
    );
    return { done, right };
  }, [answers]);

  const chooseScenario = useCallback((index: number) => {
    setCurrent(index);
    setHint("");
  }, []);

  const toggleClue = useCallback(
    (key: ClueKey) => {
      setOpened((previous) => {
        const existing = previous[current] ?? [];
        const next = existing.includes(key)
          ? existing.filter((value) => value !== key)
          : [...existing, key];
        return { ...previous, [current]: next };
      });
      setHint("");
    },
    [current]
  );

  const submitVerdict = useCallback(
    (verdict: Verdict) => {
      if (clues.length < 2) {
        setHint("Hãy mở ít nhất hai manh mối trước khi kết luận.");
        return;
      }
      setAnswers((previous) => ({ ...previous, [current]: verdict }));
      setHint("");
    },
    [clues.length, current]
  );

  const reset = useCallback(() => {
    setCurrent(0);
    setOpened({});
    setAnswers({});
    setHint("");
  }, []);

  return {
    current,
    scenario,
    clues,
    answer,
    answers,
    hint,
    stats,
    scenarios: labScenarios,
    chooseScenario,
    toggleClue,
    submitVerdict,
    reset,
  };
}
