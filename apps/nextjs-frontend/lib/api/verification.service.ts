import { apiClient } from "./axios-client";
import type { ApiResponse } from "@/types/api";
import type { VerificationResultData } from "@/types/verification";

export const verificationService = {
  /**
   * Uploads an image to verify product and OCOP certification.
   */
  async verifyImage(file: Blob | File): Promise<VerificationResultData> {
    const formData = new FormData();
    formData.append("file", file, "rightwise-label.jpg");

    const response = await apiClient.post<ApiResponse<VerificationResultData>>(
      "/api/v1/verifications/image",
      formData
    );

    return response.data.data;
  },

  /**
   * Verifies product claims from an article/product web link.
   */
  async verifyUrl(url: string): Promise<VerificationResultData> {
    const response = await apiClient.post<ApiResponse<VerificationResultData>>(
      "/api/v1/verifications/url",
      { url: url.trim() },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.data;
  },
};
