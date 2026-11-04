import { apiClient } from "./axios-client";

interface PageViewResponse {
  count: number;
  persistent: boolean;
}

export const metricsService = {
  async recordPageView(): Promise<PageViewResponse> {
    const response = await apiClient.post<{ data: PageViewResponse }>(
      "/api/v1/metrics/pageview"
    );
    return response.data.data;
  },
};
