import { z } from "zod";

/** Shared between the contact form (client) and the contact API route (server). */
export const contactFormSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  // Trim first, then validate, so pasted/autofilled addresses with stray whitespace pass
  // and the normalized value is what reaches the email integration.
  email: z.string().trim().pipe(z.email("Please enter a valid email address").max(254)),
  subject: z.string().trim().max(150).optional(),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message must be at most 5000 characters"),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

/**
 * Honeypot field name. The contact form must render a visually hidden, non-focusable
 * input with this name (`tabIndex={-1}`, `autoComplete="off"`, `aria-hidden`) and leave
 * it empty. Humans never fill it; naive bots do. It is intentionally not part of
 * `contactFormSchema` and is stripped before validation.
 */
export const CONTACT_HONEYPOT_FIELD = "website";
