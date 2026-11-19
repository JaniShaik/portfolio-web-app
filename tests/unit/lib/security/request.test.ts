// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
import { siteConfig } from "@/lib/constants";
import { getClientIp, isAllowedOrigin, readJsonBody } from "@/lib/security/request";

function request(headers: Record<string, string>, body?: BodyInit): Request {
  return new Request("http://localhost/api/contact", { method: "POST", headers, body });
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("readJsonBody", () => {
  const json = { "Content-Type": "application/json; charset=utf-8" };

  it("parses a JSON body within the limit", async () => {
    await expect(readJsonBody(request(json, '{"a":1}'), 100)).resolves.toEqual({
      ok: true,
      data: { a: 1 },
    });
  });

  it("accepts a body exactly at the limit", async () => {
    const body = JSON.stringify("x".repeat(8)); // 10 bytes
    await expect(readJsonBody(request(json, body), 10)).resolves.toMatchObject({ ok: true });
  });

  it("returns 413 once the streamed body exceeds the limit", async () => {
    const body = JSON.stringify("x".repeat(9)); // 11 bytes
    await expect(readJsonBody(request(json, body), 10)).resolves.toMatchObject({ status: 413 });
  });

  it("returns 400 for an invalid Content-Length", async () => {
    const result = await readJsonBody(request({ ...json, "Content-Length": "abc" }, "{}"), 10);
    expect(result).toMatchObject({ status: 400 });
  });

  it("returns 400 for invalid UTF-8", async () => {
    const result = await readJsonBody(request(json, new Uint8Array([0x22, 0xff, 0x22])), 10);
    expect(result).toMatchObject({ status: 400 });
  });

  it("returns 400 for a missing body", async () => {
    await expect(readJsonBody(request(json), 10)).resolves.toMatchObject({ status: 400 });
  });

  it("returns 415 for a non-JSON content type", async () => {
    const result = await readJsonBody(request({ "Content-Type": "text/plain" }, "{}"), 10);
    expect(result).toMatchObject({ status: 415 });
  });
});

describe("getClientIp", () => {
  it("ignores forwarding headers outside trusted infrastructure", () => {
    vi.stubEnv("VERCEL", "");
    vi.stubEnv("TRUST_PROXY_HEADERS", "");
    expect(getClientIp(request({ "x-real-ip": "203.0.113.7" }))).toBeNull();
  });

  it("uses x-real-ip on Vercel", () => {
    vi.stubEnv("VERCEL", "1");
    expect(getClientIp(request({ "x-real-ip": "203.0.113.7" }))).toBe("203.0.113.7");
  });

  it("uses the right-most x-forwarded-for entry when explicitly trusted", () => {
    vi.stubEnv("VERCEL", "");
    vi.stubEnv("TRUST_PROXY_HEADERS", "true");
    const headers = { "x-forwarded-for": "1.1.1.1, 198.51.100.4" };
    expect(getClientIp(request(headers))).toBe("198.51.100.4");
  });

  it("rejects values that are not IP addresses", () => {
    vi.stubEnv("VERCEL", "1");
    expect(getClientIp(request({ "x-real-ip": "not-an-ip" }))).toBeNull();
  });
});

describe("isAllowedOrigin", () => {
  it("allows the configured site origin", () => {
    expect(isAllowedOrigin(request({ Origin: new URL(siteConfig.url).origin }))).toBe(true);
  });

  it("allows the current Vercel deployment URL", () => {
    vi.stubEnv("VERCEL_URL", "portfolio-git-feature.vercel.app");
    const headers = { Origin: "https://portfolio-git-feature.vercel.app" };
    expect(isAllowedOrigin(request(headers))).toBe(true);
  });

  it("rejects missing and foreign origins", () => {
    expect(isAllowedOrigin(request({}))).toBe(false);
    expect(isAllowedOrigin(request({ Origin: "https://evil.example" }))).toBe(false);
  });

  it("allows localhost on any port only in development", () => {
    const headers = { Origin: "http://localhost:4321" };
    vi.stubEnv("NODE_ENV", "production");
    expect(isAllowedOrigin(request(headers))).toBe(false);
    vi.stubEnv("NODE_ENV", "development");
    expect(isAllowedOrigin(request(headers))).toBe(true);
  });
});
