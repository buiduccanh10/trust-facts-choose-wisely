"use client";

import { useState } from "react";

export function CopyControl({ prompts }: { prompts: string[] }) {
  const [message, setMessage] = useState("");
  const copy = async () => {
    const text = prompts.map((prompt, index) => `${"WISE"[index]} · ${prompt}`).join("\n");
    try {
      await navigator.clipboard.writeText(`Thẻ WISE, 30 giây\n${text}`);
      setMessage("Đã chép thẻ vào clipboard.");
    } catch {
      setMessage("Trình duyệt chưa cho phép chép nội dung. Hãy thử trên kết nối bảo mật.");
    }
  };
  return <><button type="button" className="btn" onClick={copy}>Chép thẻ để dán vào nhóm lớp</button><span className="copy-state" aria-live="polite">{message}</span></>;
}
