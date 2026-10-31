import axios from "axios";
import type { ApiErrorResponse } from "@/types/api";

/**
 * Extracts a user-friendly error message from any error, with special handling for Axios errors.
 */
export function getApiErrorMessage(error: unknown, fallbackMessage = "Không thể kết nối tới RightWISE API."): string {
  if (axios.isAxiosError(error)) {
    // Check timeout or aborted connection
    if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
      return "Yêu cầu quá thời gian chờ (timeout). Vui lòng thử lại.";
    }

    // Check network failure
    if (!error.response) {
      return "Không thể kết nối tới máy chủ. Vui lòng kiểm tra kết nối mạng của bạn.";
    }

    // Check response body message
    const data = error.response.data as ApiErrorResponse | undefined;
    if (data?.message) {
      if (Array.isArray(data.message)) {
        return data.message.join(", ");
      }
      return data.message;
    }

    if (error.response.status === 413) {
      return "Tệp tải lên quá lớn, máy chủ từ chối xử lý.";
    }

    if (error.response.status === 404) {
      return "Không tìm thấy tài nguyên yêu cầu.";
    }

    if (error.response.status >= 500) {
      return "Máy chủ gặp sự cố khi xử lý dữ liệu. Vui lòng thử lại sau.";
    }
  }

  if (error instanceof Error) {
    if (/load failed|failed to fetch|network/i.test(error.message)) {
      return "Yêu cầu quá thời gian chờ (timeout) hoặc kết nối mạng bị gián đoạn. Vui lòng thử lại.";
    }
    return error.message || fallbackMessage;
  }

  return fallbackMessage;
}
