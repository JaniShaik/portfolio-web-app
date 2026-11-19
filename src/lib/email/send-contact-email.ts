import "server-only";
import { Resend } from "resend";
import type { EmailEnv } from "@/lib/server-env";
import type { ContactFormValues } from "@/lib/validations/contact";

// Resend's shared test sender. Replace with an address on a verified domain.
const DEFAULT_FROM = "Portfolio Contact <onboarding@resend.dev>";

export type SendContactEmailResult = { ok: true; id: string } | { ok: false; error: string };

/** Server-only: deliver a validated contact submission via Resend. */
export async function sendContactEmail(
  values: ContactFormValues,
  env: EmailEnv,
): Promise<SendContactEmailResult> {
  const resend = new Resend(env.RESEND_API_KEY);

  const { data, error } = await resend.emails.send({
    from: DEFAULT_FROM,
    to: env.CONTACT_EMAIL,
    replyTo: values.email,
    subject: values.subject?.length
      ? `[Portfolio] ${values.subject}`
      : `[Portfolio] New message from ${values.name}`,
    text: [`Name: ${values.name}`, `Email: ${values.email}`, "", values.message].join("\n"),
  });

  if (error || !data) {
    return { ok: false, error: error?.message ?? "Unknown email delivery error" };
  }
  return { ok: true, id: data.id };
}
