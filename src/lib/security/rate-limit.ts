import "server-only";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { getRateLimitEnv, type RateLimitEnv } from "@/lib/server-env";

export type RateLimitDecision =
  | { status: "allowed" }
  | { status: "limited"; retryAfterSeconds: number }
  | { status: "unavailable"; reason: string };

interface ContactLimiters {
  perClient: Ratelimit;
  global: Ratelimit;
}

// Created once per server instance so Upstash's ephemeral cache can short-circuit
// identifiers that are already blocked while the function is warm.
let limiters: ContactLimiters | null = null;

function getLimiters(env: RateLimitEnv): ContactLimiters {
  if (!limiters) {
    const redis = new Redis({ url: env.redisUrl, token: env.redisToken });
    limiters = {
      perClient: new Ratelimit({
        redis,
        prefix: "ratelimit:contact:client",
        limiter: Ratelimit.slidingWindow(env.maxRequests, `${env.windowSeconds} s`),
      }),
      global: new Ratelimit({
        redis,
        prefix: "ratelimit:contact:global",
        limiter: Ratelimit.fixedWindow(env.dailyMax, "1 d"),
      }),
    };
  }
  return limiters;
}

function limited(resetAtMs: number): RateLimitDecision {
  return {
    status: "limited",
    retryAfterSeconds: Math.max(1, Math.ceil((resetAtMs - Date.now()) / 1000)),
  };
}

/**
 * Distributed (Upstash Redis) rate limit for contact submissions: a per-client
 * sliding window plus a site-wide daily cap.
 *
 * Fails closed in production: when Redis is missing, misconfigured or unreachable
 * the caller should refuse to send email. Outside production an unconfigured limiter
 * is skipped so local development works without Redis.
 */
export async function checkContactRateLimit(clientId: string): Promise<RateLimitDecision> {
  let env: RateLimitEnv | null;
  try {
    env = getRateLimitEnv();
  } catch (error) {
    console.error("[rate-limit] Misconfigured:", error);
    return { status: "unavailable", reason: "Rate limiting is misconfigured" };
  }

  if (!env) {
    if (process.env.NODE_ENV === "production") {
      return { status: "unavailable", reason: "Rate limiting is not configured" };
    }
    return { status: "allowed" };
  }

  try {
    const { perClient, global } = getLimiters(env);

    const clientResult = await perClient.limit(clientId);
    // On Redis timeouts Upstash lets requests through; treat that as unavailable instead.
    if (clientResult.reason === "timeout") {
      return { status: "unavailable", reason: "Rate limit check timed out" };
    }
    if (!clientResult.success) {
      return limited(clientResult.reset);
    }

    const globalResult = await global.limit("all");
    if (globalResult.reason === "timeout") {
      return { status: "unavailable", reason: "Rate limit check timed out" };
    }
    if (!globalResult.success) {
      return limited(globalResult.reset);
    }

    return { status: "allowed" };
  } catch (error) {
    console.error("[rate-limit] Redis request failed:", error);
    return { status: "unavailable", reason: "Rate limit check failed" };
  }
}
