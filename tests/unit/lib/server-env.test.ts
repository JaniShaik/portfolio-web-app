// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getRateLimitEnv } from "@/lib/server-env";

describe("getRateLimitEnv", () => {
  beforeEach(() => {
    for (const name of [
      "UPSTASH_REDIS_REST_URL",
      "UPSTASH_REDIS_REST_TOKEN",
      "KV_REST_API_URL",
      "KV_REST_API_TOKEN",
      "CONTACT_RATE_LIMIT_MAX",
      "CONTACT_RATE_LIMIT_WINDOW_SECONDS",
      "CONTACT_RATE_LIMIT_DAILY_MAX",
    ]) {
      vi.stubEnv(name, "");
    }
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns null when Redis is not configured", () => {
    expect(getRateLimitEnv()).toBeNull();
  });

  it("applies default thresholds", () => {
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://example.upstash.io");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "token");
    expect(getRateLimitEnv()).toMatchObject({ maxRequests: 5, windowSeconds: 3600, dailyMax: 100 });
  });

  it("accepts Vercel KV variable names and custom thresholds", () => {
    vi.stubEnv("KV_REST_API_URL", "https://example.upstash.io");
    vi.stubEnv("KV_REST_API_TOKEN", "token");
    vi.stubEnv("CONTACT_RATE_LIMIT_MAX", "3");
    vi.stubEnv("CONTACT_RATE_LIMIT_WINDOW_SECONDS", "600");
    expect(getRateLimitEnv()).toMatchObject({ maxRequests: 3, windowSeconds: 600 });
  });

  it("throws on invalid thresholds", () => {
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://example.upstash.io");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "token");
    vi.stubEnv("CONTACT_RATE_LIMIT_MAX", "0");
    expect(() => getRateLimitEnv()).toThrow(/CONTACT_RATE_LIMIT_MAX/);
  });
});
