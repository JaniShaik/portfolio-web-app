// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/contact/route";
import { sendContactEmail } from "@/lib/email/send-contact-email";
import { checkContactRateLimit } from "@/lib/security/rate-limit";
import { CONTACT_MAX_BODY_BYTES, siteConfig } from "@/lib/constants";

vi.mock("@/lib/email/send-contact-email", () => ({ sendContactEmail: vi.fn() }));
vi.mock("@/lib/security/rate-limit", () => ({ checkContactRateLimit: vi.fn() }));

const sendEmail = vi.mocked(sendContactEmail);
const rateLimit = vi.mocked(checkContactRateLimit);

const SITE_ORIGIN = new URL(siteConfig.url).origin;

function postJson(body: unknown, headers: Record<string, string> = {}): Request {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: SITE_ORIGIN, ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

/** Streams `totalBytes` without a Content-Length header (chunked upload). */
function postStream(totalBytes: number): Request {
  const chunk = new TextEncoder().encode("a".repeat(1024));
  let sent = 0;
  const stream = new ReadableStream<Uint8Array>({
    pull(controller) {
      if (sent >= totalBytes) {
        controller.close();
        return;
      }
      controller.enqueue(chunk);
      sent += chunk.byteLength;
    },
  });
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: SITE_ORIGIN },
    body: stream,
    duplex: "half",
  } as RequestInit);
}

const validPayload = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  message: "Hello! I would like to discuss an architecture engagement.",
};

describe("POST /api/contact", () => {
  beforeEach(() => {
    vi.stubEnv("RESEND_API_KEY", "re_test_key");
    vi.stubEnv("CONTACT_EMAIL", "owner@example.com");
    vi.stubEnv("VERCEL", "1");
    rateLimit.mockResolvedValue({ status: "allowed" });
    sendEmail.mockResolvedValue({ ok: true, id: "email_123" });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });

  it("sends a valid submission and returns 200", async () => {
    const response = await POST(postJson(validPayload, { "x-real-ip": "203.0.113.7" }));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ success: true });
    expect(rateLimit).toHaveBeenCalledWith("203.0.113.7");
    expect(sendEmail).toHaveBeenCalledWith(
      expect.objectContaining(validPayload),
      expect.objectContaining({ CONTACT_EMAIL: "owner@example.com" }),
    );
  });

  it("trims surrounding whitespace from the email and sends the normalized value", async () => {
    const response = await POST(postJson({ ...validPayload, email: "  ada@example.com \n" }));

    expect(response.status).toBe(200);
    expect(sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({ email: "ada@example.com" }),
      expect.anything(),
    );
  });

  it("rejects an invalid email with 422 and does not send", async () => {
    const response = await POST(postJson({ ...validPayload, email: "not-an-email" }));

    expect(response.status).toBe(422);
    expect(await response.json()).toMatchObject({ issues: { email: expect.any(Array) } });
    expect(rateLimit).not.toHaveBeenCalled();
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("rejects malformed JSON with 400", async () => {
    const response = await POST(postJson("{not json"));
    expect(response.status).toBe(400);
  });

  it("rejects non-JSON content types with 415", async () => {
    const response = await POST(postJson(validPayload, { "Content-Type": "text/plain" }));
    expect(response.status).toBe(415);
  });

  it("rejects a declared Content-Length over the limit with 413", async () => {
    const response = await POST(
      postJson(validPayload, { "Content-Length": String(CONTACT_MAX_BODY_BYTES + 1) }),
    );
    expect(response.status).toBe(413);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("rejects an oversized body without Content-Length with 413", async () => {
    const response = await POST(postStream(CONTACT_MAX_BODY_BYTES * 50));
    expect(response.status).toBe(413);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("rejects a body larger than the limit even if the message field is short", async () => {
    const padded = { ...validPayload, padding: "x".repeat(CONTACT_MAX_BODY_BYTES) };
    const response = await POST(postJson(padded));
    expect(response.status).toBe(413);
  });

  it("returns 429 with Retry-After when the rate limit is exceeded", async () => {
    rateLimit.mockResolvedValue({ status: "limited", retryAfterSeconds: 120 });

    const response = await POST(postJson(validPayload));

    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBe("120");
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("fails closed with 503 when the rate limiter is unavailable", async () => {
    rateLimit.mockResolvedValue({
      status: "unavailable",
      reason: "Rate limiting is not configured",
    });
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    const response = await POST(postJson(validPayload));

    expect(response.status).toBe(503);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it.each([
    ["a foreign origin", { Origin: "https://evil.example" }],
    ["an opaque origin", { Origin: "null" }],
  ])("rejects %s with 403", async (_label, headers) => {
    const response = await POST(postJson(validPayload, headers));
    expect(response.status).toBe(403);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("rejects a request without an Origin header with 403", async () => {
    const request = new Request("http://localhost/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validPayload),
    });
    const response = await POST(request);
    expect(response.status).toBe(403);
  });

  it("silently accepts honeypot submissions without sending or counting them", async () => {
    const response = await POST(postJson({ ...validPayload, website: "https://spam.example" }));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ success: true });
    expect(rateLimit).not.toHaveBeenCalled();
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("uses a shared identifier when the client IP cannot be trusted", async () => {
    vi.stubEnv("VERCEL", "");
    await POST(postJson(validPayload, { "x-forwarded-for": "198.51.100.1" }));
    expect(rateLimit).toHaveBeenCalledWith("unknown");
  });

  it("returns 503 when the email integration is not configured", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    vi.stubEnv("CONTACT_EMAIL", "");

    const response = await POST(postJson(validPayload));
    expect(response.status).toBe(503);
    expect(rateLimit).not.toHaveBeenCalled();
  });

  it("returns 502 when email delivery fails", async () => {
    sendEmail.mockResolvedValue({ ok: false, error: "provider down" });
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    const response = await POST(postJson(validPayload));
    expect(response.status).toBe(502);
  });
});
