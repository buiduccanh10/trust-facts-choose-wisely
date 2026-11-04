import { Injectable } from "@nestjs/common";
import { CacheService } from "../cache/cache.service";

const PAGE_VIEWS_KEY = "rightwise:metrics:pageviews";

@Injectable()
export class MetricsService {
  constructor(private readonly cache: CacheService) {}

  async recordPageView() {
    return {
      count: await this.cache.incrementCounter(PAGE_VIEWS_KEY),
      persistent: this.cache.usesPersistentStore,
    };
  }
}
