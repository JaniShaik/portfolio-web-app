// @vitest-environment node
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { profile } from "@/data/profile";
import { emailLink, socialLinks } from "@/data/social-links";

const publicDir = path.resolve(import.meta.dirname, "../../../public");

describe("profile.resume", () => {
  it("points to the uploaded PDF in public/documents", () => {
    expect(profile.resume?.href).toBe("/documents/jani-shaik-resume.pdf");

    const file = path.join(publicDir, profile.resume?.href ?? "");
    expect(existsSync(file)).toBe(true);
    expect(readFileSync(file).subarray(0, 5).toString("latin1")).toBe("%PDF-");
  });
});

describe("email link", () => {
  it("is built once from profile.email and shared with the social links", () => {
    expect(emailLink?.href).toBe(`mailto:${profile.email}`);
    expect(socialLinks.filter((link) => link.platform === "email")).toEqual([emailLink]);
  });
});
