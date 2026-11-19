// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const limit = vi.fn();

vi.mock("@upstash/redis", () => ({ Redis: vi.fn() }));
vi.mock("@upstash/ratelimit", () => {
  class Ratelimit {
    static slidingWindow = vi.fn();
    static fixedWindow = vi.fn();
    limit = limit;
  }
  return { Ratelimit };
});

async function loadModule() {
  // Fresh module per test: limiters are cached at module scope.
  vi.resetModules();
  return import("@/lib/security/rate-limit");
}

function configureRedis() {
  vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://example.upstash.io");
  vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "token");
}

const ok = { success: true, limit: 5, remaining: 4, reset: Date.now() + 60_000 };

describe("checkContactRateLimit", () => {
  beforeEach(() => {
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "");
    vi.stubEnv("KV_REST_API_URL", "");
    vi.stubEnv("KV_REST_API_TOKEN", "");
    vi.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    limit.mockReset();
  });

  it("allows requests under the limit", async () => {
    configureRedis();
    limit.mockResolvedValue(ok);
    const { checkContactRateLimit } = await loadModule();

    await expect(checkContactRateLimit("203.0.113.7")).resolves.toEqual({ status: "allowed" });
    expect(limit).toHaveBeenCalledWith("203.0.113.7");
  });

  it("reports the retry delay when the per-client limit is exceeded", async () => {
    configureRedis();
    limit.mockResolvedValueOnce({ ...ok, success: false, reset: Date.now() + 90_000 });
    const { checkContactRateLimit } = await loadModule();

    const decision = await checkContactRateLimit("203.0.113.7");
    expect(decision).toMatchObject({ status: "limited" });
    expect(decision.status === "limited" && decision.retryAfterSeconds).toBeGreaterThan(85);
    expect(limit).toHaveBeenCalledTimes(1);
  });

  it("enforces the site-wide daily cap", async () => {
    configureRedis();
    limit.mockResolvedValueOnce(ok).mockResolvedValueOnce({ ...ok, success: false });
    const { checkContactRateLimit } = await loadModule();

    await expect(checkContactRateLimit("203.0.113.7")).resolves.toMatchObject({
      status: "limited",
    });
    expect(limit).toHaveBeenLastCalledWith("all");
  });

  it("fails closed when Redis errors or times out", async () => {
    configureRedis();
    limit.mockRejectedValueOnce(new Error("network")).mockResolvedValueOnce({
      ...ok,
      reason: "timeout",
    });
    const { checkContactRateLimit } = await loadModule();

    await expect(checkContactRateLimit("a")).resolves.toMatchObject({ status: "unavailable" });
    await expect(checkContactRateLimit("a")).resolves.toMatchObject({ status: "unavailable" });
  });

  it("fails closed in production when Redis is not configured", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const { checkContactRateLimit } = await loadModule();
    await expect(checkContactRateLimit("a")).resolves.toMatchObject({ status: "unavailable" });
  });

  it("is skipped outside production when Redis is not configured", async () => {
    vi.stubEnv("NODE_ENV", "development");
    const { checkContactRateLimit } = await loadModule();
    await expect(checkContactRateLimit("a")).resolves.toEqual({ status: "allowed" });
    expect(limit).not.toHaveBeenCalled();
  });

  it("fails closed on partial configuration", async () => {
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://example.upstash.io");
    const { checkContactRateLimit } = await loadModule();
    await expect(checkContactRateLimit("a")).resolves.toMatchObject({ status: "unavailable" });
  });
});
