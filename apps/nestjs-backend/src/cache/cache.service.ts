import { Injectable, Logger } from "@nestjs/common";
import { Redis } from "@upstash/redis";

const TTL_SECONDS = 24 * 60 * 60;

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);
  private readonly memory = new Map<string, { value: unknown; expiresAt: number }>();
  private readonly redis?: Redis;

  constructor() {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    if (url && token) this.redis = new Redis({ url, token });
    if (!this.redis) this.logger.warn("Upstash is not configured; using per-instance memory cache with a 24-hour TTL.");
  }

  async get<T>(key: string): Promise<T | null> {
    if (this.redis) {
      try {
        return (await this.redis.get<T>(key)) ?? null;
      } catch (error) {
        this.logger.warn(`Cache read failed: ${error instanceof Error ? error.message : "unknown error"}`);
      }
    }
    const entry = this.memory.get(key);
    if (!entry) return null;
    if (entry.expiresAt <= Date.now()) {
      this.memory.delete(key);
      return null;
    }
    return entry.value as T;
  }

  async set(key: string, value: unknown): Promise<void> {
    if (this.redis) {
      try {
        await this.redis.set(key, value, { ex: TTL_SECONDS });
        return;
      } catch (error) {
        this.logger.warn(`Cache write failed: ${error instanceof Error ? error.message : "unknown error"}`);
      }
    }
    this.memory.set(key, { value, expiresAt: Date.now() + TTL_SECONDS * 1000 });
  }
}
