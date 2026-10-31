"use client";

import { useState, useEffect, useCallback, type ChangeEvent, type DragEvent } from "react";
import type { VerificationMode, VerificationResultData } from "@/types/verification";
import { verificationService } from "@/lib/api/verification.service";
import { validateImageFile } from "@/utils/file-validation";
import { compressImageForVerification } from "@/utils/image-compression";
import { getApiErrorMessage } from "@/utils/error";

export function useVerification() {
  const [mode, setModeState] = useState<VerificationMode>("image");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<VerificationResultData | null>(null);

  // Manage object URL lifecycle for image preview
  useEffect(() => {
    if (!file) {
      setPreviewUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  const setMode = useCallback((newMode: VerificationMode) => {
    setModeState(newMode);
    setResult(null);
    setError("");
  }, []);

  const chooseFile = useCallback((nextFile?: File | null) => {
    setError("");
    setResult(null);

    if (!nextFile) return;

    const validation = validateImageFile(nextFile);
    if (!validation.isValid) {
      setFile(null);
      setError(validation.error || "Tệp không hợp lệ.");
      return;
    }

    setFile(nextFile);
  }, []);

  const onFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      chooseFile(event.target.files?.[0]);
      event.target.value = "";
    },
    [chooseFile]
  );

  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      chooseFile(event.dataTransfer.files?.[0]);
    },
    [chooseFile]
  );

  const clearFile = useCallback(() => {
    setFile(null);
    setError("");
  }, []);

  const runVerification = useCallback(async () => {
    setError("");
    setResult(null);

    if (mode === "image" && !file) {
      setError("Vui lòng chụp ảnh hoặc chọn ảnh nhãn mác trước.");
      return;
    }

    if (mode === "url" && !url.trim()) {
      setError("Vui lòng nhập đường dẫn sản phẩm cần kiểm tra.");
      return;
    }

    setLoading(true);

    try {
      if (mode === "image" && file) {
        const preparedImage = await compressImageForVerification(file);
        const data = await verificationService.verifyImage(preparedImage);
        setResult(data);
      } else {
        const data = await verificationService.verifyUrl(url.trim());
        setResult(data);
      }
    } catch (cause) {
      setError(getApiErrorMessage(cause));
    } finally {
      setLoading(false);
    }
  }, [mode, file, url]);

  const reset = useCallback(() => {
    setFile(null);
    setUrl("");
    setResult(null);
    setError("");
    setModeState("image");
  }, []);

  return {
    mode,
    setMode,
    file,
    previewUrl,
    url,
    setUrl,
    loading,
    error,
    result,
    chooseFile,
    clearFile,
    onFileChange,
    onDrop,
    runVerification,
    reset,
  };
}
