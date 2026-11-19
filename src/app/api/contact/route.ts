import { NextResponse } from "next/server";
import { z } from "zod";
import { CONTACT_MAX_BODY_BYTES } from "@/lib/constants";
import { sendContactEmail } from "@/lib/email/send-contact-email";
import { checkContactRateLimit } from "@/lib/security/rate-limit";
import { getClientIp, isAllowedOrigin, readJsonBody } from "@/lib/security/request";
import { getEmailEnv, type EmailEnv } from "@/lib/server-env";
import { CONTACT_HONEYPOT_FIELD, contactFormSchema } from "@/lib/validations/contact";

function isHoneypotFilled(body: unknown): boolean {
  if (typeof body !== "object" || body === null) return false;
  const value = (body as Record<string, unknown>)[CONTACT_HONEYPOT_FIELD];
  return value !== undefined && value !== null && value !== "";
}

export async function POST(request: Request): Promise<NextResponse> {
  if (!isAllowedOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await readJsonBody(request, CONTACT_MAX_BODY_BYTES);
  if (!body.ok) {
    return NextResponse.json({ error: body.error }, { status: body.status });
  }

  // Pretend success so bots get no signal, but never send or count the submission.
  if (isHoneypotFilled(body.data)) {
    return NextResponse.json({ success: true }, { status: 200 });
  }

  const parsed = contactFormSchema.safeParse(body.data);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: z.flattenError(parsed.error).fieldErrors },
      { status: 422 },
    );
  }

  let emailEnv: EmailEnv | null;
  try {
    emailEnv = getEmailEnv();
  } catch (error) {
    console.error("[contact] Email integration misconfigured:", error);
    return NextResponse.json({ error: "Contact service unavailable" }, { status: 503 });
  }

  if (!emailEnv) {
    return NextResponse.json({ error: "Contact service is not configured yet" }, { status: 503 });
  }

  // Only submissions that would actually send email count towards the limit, so a
  // legitimate visitor fixing validation errors is not locked out.
  const rateLimit = await checkContactRateLimit(getClientIp(request) ?? "unknown");
  if (rateLimit.status === "limited") {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds) } },
    );
  }
  if (rateLimit.status === "unavailable") {
    console.error("[contact] Rate limiter unavailable:", rateLimit.reason);
    return NextResponse.json({ error: "Contact service unavailable" }, { status: 503 });
  }

  const result = await sendContactEmail(parsed.data, emailEnv);
  if (!result.ok) {
    console.error("[contact] Email delivery failed:", result.error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 502 });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
