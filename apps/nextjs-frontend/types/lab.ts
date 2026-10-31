export type Verdict = "good" | "unsure" | "bad";

export type ClueKey = "W" | "I" | "S";

export type Scenario = {
  who: string;
  meta: string;
  text: string;
  chips?: string[];
  clues: Record<ClueKey, string>;
  answer: Verdict;
  explanation: string;
};

export type VerdictOption = {
  key: Verdict;
  label: string;
};

export type ProbeOption = {
  key: ClueKey;
  label: string;
};

export type LabStats = {
  done: number;
  right: number;
};
