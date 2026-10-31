"use client";

import { useState, useCallback } from "react";

export function useClipboardCopy(resetDelayMs = 3000) {
  const [message, setMessage] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setMessage("Đã chép thẻ vào clipboard.");
        setIsCopied(true);
      } catch {
        setMessage(
          "Trình duyệt chưa cho phép chép nội dung. Hãy thử trên kết nối bảo mật."
        );
        setIsCopied(false);
      }

      if (resetDelayMs > 0) {
        setTimeout(() => {
          setMessage("");
          setIsCopied(false);
        }, resetDelayMs);
      }
    },
    [resetDelayMs]
  );

  return {
    message,
    isCopied,
    copy,
  };
}
