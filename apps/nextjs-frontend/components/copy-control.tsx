"use client";

import { useClipboardCopy } from "@/hooks/use-clipboard-copy";

interface CopyControlProps {
  prompts: string[];
}

export function CopyControl({ prompts }: CopyControlProps) {
  const { message, copy } = useClipboardCopy();

  const handleCopy = () => {
    const text = prompts
      .map((prompt, index) => `${"WISE"[index]} · ${prompt}`)
      .join("\n");
    void copy(`Thẻ WISE, 30 giây\n${text}`);
  };

  return (
    <>
      <button type="button" className="btn" onClick={handleCopy}>
        Chép thẻ để dán vào nhóm lớp
      </button>
      <span className="copy-state" aria-live="polite">
        {message}
      </span>
    </>
  );
}
