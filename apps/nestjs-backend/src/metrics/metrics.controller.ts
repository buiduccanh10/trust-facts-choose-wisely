import { Controller, Post } from "@nestjs/common";
import { MetricsService } from "./metrics.service";

@Controller("api/v1/metrics")
export class MetricsController {
  constructor(private readonly metrics: MetricsService) {}

  @Post("pageview")
  async recordPageView() {
    return { data: await this.metrics.recordPageView() };
  }
}
