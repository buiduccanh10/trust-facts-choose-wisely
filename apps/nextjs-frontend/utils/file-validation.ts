import { MAX_FILE_BYTES } from "./constants";

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateImageFile(file?: File | null): FileValidationResult {
  if (!file) {
    return { isValid: false, error: "Không tìm thấy tệp." };
  }

  if (!file.type.startsWith("image/")) {
    return {
      isValid: false,
      error: "Tệp này không phải ảnh. Hãy chọn JPEG, PNG hoặc WebP.",
    };
  }

  if (file.size > MAX_FILE_BYTES) {
    return {
      isValid: false,
      error: "Ảnh vượt quá giới hạn 12 MB. Hãy chọn ảnh nhỏ hơn.",
    };
  }

  return { isValid: true };
}
