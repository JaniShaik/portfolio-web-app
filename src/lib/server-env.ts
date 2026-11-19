import "server-only";
import { z } from "zod";

/**
 * Server-only environment configuration (secrets and integration settings).
 * `import "server-only"` makes the build fail if a Client Component imports this
 * module, so these values can never be bundled for the browser. Public, client-safe
 * values live in `@/lib/env`.
 */

/** Trimmed env value, treating empty strings as unset. */
function readEnv(name: string): string | undefined {
  return process.env[name]?.trim() || undefined;
}

function formatIssues(error: z.ZodError): string {
  return error.issues.map((issue) => issue.message).join("; ");
}

const emailEnvSchema = z.object({
  RESEND_API_KEY: z.string().min(1, "RESEND_API_KEY is required"),
  CONTACT_EMAIL: z.email("CONTACT_EMAIL must be a valid email address"),
});

export type EmailEnv = z.infer<typeof emailEnvSchema>;

/**
 * Email (Resend) configuration.
 * Returns `null` when the integration is not configured at all, and throws when
 * it is partially or incorrectly configured, so misconfiguration is visible.
 */
export function getEmailEnv(): EmailEnv | null {
  const raw = {
    RESEND_API_KEY: readEnv("RESEND_API_KEY"),
    CONTACT_EMAIL: readEnv("CONTACT_EMAIL"),
  };

  if (!raw.RESEND_API_KEY && !raw.CONTACT_EMAIL) {
    return null;
  }

  const parsed = emailEnvSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(`Invalid email configuration: ${formatIssues(parsed.error)}`);
  }
  return parsed.data;
}

const positiveInt = (name: string) =>
  z.coerce
    .number({ error: `${name} must be a positive integer` })
    .int()
    .positive();

const rateLimitEnvSchema = z.object({
  redisUrl: z.url({ protocol: /^https$/, error: "UPSTASH_REDIS_REST_URL must be an https URL" }),
  redisToken: z.string().min(1, "UPSTASH_REDIS_REST_TOKEN is required"),
  /** Max contact submissions per client IP within `windowSeconds`. */
  maxRequests: positiveInt("CONTACT_RATE_LIMIT_MAX").default(5),
  windowSeconds: positiveInt("CONTACT_RATE_LIMIT_WINDOW_SECONDS").default(3600),
  /** Site-wide cap on submissions per day, protecting the email quota from distributed abuse. */
  dailyMax: positiveInt("CONTACT_RATE_LIMIT_DAILY_MAX").default(100),
});

export type RateLimitEnv = z.infer<typeof rateLimitEnvSchema>;

/**
 * Upstash Redis rate-limit configuration. Accepts the `UPSTASH_REDIS_REST_*` names or
 * the `KV_REST_API_*` names injected by the Vercel Marketplace Upstash integration.
 * Returns `null` when Redis is not configured, and throws on partial/invalid config.
 */
export function getRateLimitEnv(): RateLimitEnv | null {
  const redisUrl = readEnv("UPSTASH_REDIS_REST_URL") ?? readEnv("KV_REST_API_URL");
  const redisToken = readEnv("UPSTASH_REDIS_REST_TOKEN") ?? readEnv("KV_REST_API_TOKEN");

  if (!redisUrl && !redisToken) {
    return null;
  }

  const parsed = rateLimitEnvSchema.safeParse({
    redisUrl,
    redisToken,
    maxRequests: readEnv("CONTACT_RATE_LIMIT_MAX"),
    windowSeconds: readEnv("CONTACT_RATE_LIMIT_WINDOW_SECONDS"),
    dailyMax: readEnv("CONTACT_RATE_LIMIT_DAILY_MAX"),
  });
  if (!parsed.success) {
    throw new Error(`Invalid rate limit configuration: ${formatIssues(parsed.error)}`);
  }
  return parsed.data;
}
