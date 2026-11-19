import "server-only";
import { isIP } from "node:net";
import { siteConfig } from "@/lib/constants";

export type ReadJsonBodyResult =
  { ok: true; data: unknown } | { ok: false; status: 400 | 413 | 415; error: string };

/**
 * Read and parse a JSON request body without ever buffering more than `maxBytes`.
 *
 * `Content-Length` is checked up front when present, and the byte limit is also
 * enforced while streaming, so chunked requests (or a lying `Content-Length`)
 * cannot bypass it.
 */
export async function readJsonBody(
  request: Request,
  maxBytes: number,
): Promise<ReadJsonBodyResult> {
  const mediaType = request.headers.get("content-type")?.split(";")[0]?.trim().toLowerCase();
  if (mediaType !== "application/json") {
    return { ok: false, status: 415, error: "Content-Type must be application/json" };
  }

  const contentLength = request.headers.get("content-length");
  if (contentLength !== null) {
    if (!/^\d+$/.test(contentLength.trim())) {
      return { ok: false, status: 400, error: "Invalid Content-Length header" };
    }
    if (Number(contentLength) > maxBytes) {
      return { ok: false, status: 413, error: "Request body too large" };
    }
  }

  if (!request.body) {
    return { ok: false, status: 400, error: "Request body is required" };
  }

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let received = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      received += value.byteLength;
      if (received > maxBytes) {
        await reader.cancel().catch(() => undefined);
        return { ok: false, status: 413, error: "Request body too large" };
      }
      chunks.push(value);
    }
  } catch {
    return { ok: false, status: 400, error: "Could not read request body" };
  }

  const bytes = new Uint8Array(received);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  try {
    return { ok: true, data: JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes)) };
  } catch {
    return { ok: false, status: 400, error: "Invalid JSON body" };
  }
}

/**
 * Forwarding headers are only trusted when a known proxy sets them: on Vercel the edge
 * network overwrites `x-real-ip` / `x-forwarded-for` with the real client address.
 * Self-hosted deployments behind a trusted reverse proxy can opt in explicitly.
 */
function trustProxyHeaders(): boolean {
  return process.env.VERCEL === "1" || process.env.TRUST_PROXY_HEADERS === "true";
}

/** Best-effort client IP from trusted infrastructure headers, or `null` if unknown. */
export function getClientIp(request: Request): string | null {
  if (!trustProxyHeaders()) {
    return null;
  }

  // Prefer the single-value header set by the proxy. Otherwise use the right-most
  // `x-forwarded-for` entry: the one appended by the trusted proxy itself, which a
  // client cannot spoof (client-supplied values appear further left).
  const candidate =
    request.headers.get("x-real-ip")?.trim() ||
    request.headers.get("x-forwarded-for")?.split(",").at(-1)?.trim();

  return candidate && isIP(candidate) ? candidate : null;
}

function getAllowedOrigins(): Set<string> {
  const origins = new Set([new URL(siteConfig.url).origin]);
  // Vercel deployment and preview URLs (system env vars, hostnames without scheme).
  for (const host of [
    process.env.VERCEL_URL,
    process.env.VERCEL_BRANCH_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
  ]) {
    if (host?.trim()) origins.add(`https://${host.trim()}`);
  }
  return origins;
}

function isLocalDevOrigin(origin: string): boolean {
  try {
    const { hostname } = new URL(origin);
    return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]";
  } catch {
    return false;
  }
}

/**
 * Reject requests whose `Origin` is missing or not this site. Browsers always send
 * `Origin` on cross-origin and same-origin `fetch` POSTs, so legitimate form
 * submissions pass; this blocks cross-site and casual scripted abuse.
 */
export function isAllowedOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin || origin === "null") {
    return false;
  }
  if (process.env.NODE_ENV === "development" && isLocalDevOrigin(origin)) {
    return true;
  }
  return getAllowedOrigins().has(origin);
}
