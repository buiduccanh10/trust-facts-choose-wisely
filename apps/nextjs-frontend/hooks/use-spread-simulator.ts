"use client";

import { useState, useMemo } from "react";
import { formatSimulatorNumber } from "@/utils/formatters";
import type { SpreadBarItem, SpreadCalculationResult } from "@/types/simulator";

const SIMULATOR_LABELS = [
  "Người đăng",
  "Lượt 1",
  "Lượt 2",
  "Lượt 3",
  "Lượt 4",
  "Lượt 5",
];

export function useSpreadSimulator(initialChecked = 3) {
  const [checked, setChecked] = useState(initialChecked);

  const simulation: SpreadCalculationResult = useMemo(() => {
    const onward = 3 * (1 - checked / 10);
    const rawValues = SIMULATOR_LABELS.map((_, index) =>
      index === 0 ? 1 : Math.pow(onward, index)
    );
    const total = rawValues.reduce((sum, value) => sum + value, 0);

    const bars: SpreadBarItem[] = rawValues.map((value, index) => ({
      label: SIMULATOR_LABELS[index],
      value,
      widthPercentage: value <= 0.05 ? 0 : Math.max((value / 243) * 100, 1.6),
      formattedValue: formatSimulatorNumber(value),
    }));

    return {
      bars,
      total,
      formattedTotal: formatSimulatorNumber(total),
      onward,
    };
  }, [checked]);

  return {
    checked,
    setChecked,
    ...simulation,
  };
}
