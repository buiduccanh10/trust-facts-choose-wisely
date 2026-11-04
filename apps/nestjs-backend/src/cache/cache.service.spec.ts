import { afterEach, describe, expect, it, vi } from "vitest";
import { CacheService } from "./cache.service";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("CacheService counters", () => {
  it("increments counters in local memory when Upstash is not configured", async () => {
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "");
    const cache = new CacheService();

    expect(cache.usesPersistentStore).toBe(false);
    await expect(cache.incrementCounter("pageviews")).resolves.toBe(1);
    await expect(cache.incrementCounter("pageviews")).resolves.toBe(2);
  });
});
