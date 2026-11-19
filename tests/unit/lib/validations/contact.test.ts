import { describe, expect, it } from "vitest";
import { contactFormSchema } from "@/lib/validations/contact";

const base = { name: "Ada Lovelace", message: "Hello, this is a long enough message." };

describe("contactFormSchema email", () => {
  it.each(["ada@example.com ", " ada@example.com", "\tada@example.com\n"])(
    "trims %j before validating",
    (email) => {
      const result = contactFormSchema.safeParse({ ...base, email });
      expect(result.success && result.data.email).toBe("ada@example.com");
    },
  );

  it.each(["", "   ", "not-an-email", "ada@", "ada @example.com"])("rejects %j", (email) => {
    expect(contactFormSchema.safeParse({ ...base, email }).success).toBe(false);
  });
});
