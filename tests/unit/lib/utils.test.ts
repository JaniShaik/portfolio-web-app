import { describe, expect, it } from "vitest";
import { cn, getLinkKind, isActivePath, joinUrl } from "@/lib/utils";

describe("cn", () => {
  it("joins conditional class names", () => {
    const isHidden = false;
    expect(cn("px-2", isHidden && "hidden", "py-1")).toBe("px-2 py-1");
  });

  it("resolves conflicting Tailwind classes in favour of the last one", () => {
    expect(cn("px-2 text-sm", "px-4")).toBe("text-sm px-4");
  });

  it("keeps custom font-size tokens alongside text colours", () => {
    expect(cn("text-label-md text-subtle-foreground", "text-primary")).toBe(
      "text-label-md text-primary",
    );
    expect(cn("text-label-md", "text-body-sm")).toBe("text-body-sm");
  });

  it.each(["headline-display", "headline-lg", "headline-md", "headline-lg-mobile", "body-lg"])(
    "treats text-%s as a font size, not a colour",
    (token) => {
      expect(cn(`text-${token}`, "text-foreground")).toBe(`text-${token} text-foreground`);
      expect(cn("text-foreground", `text-${token}`)).toBe(`text-foreground text-${token}`);
      expect(cn("text-body-sm", `text-${token}`)).toBe(`text-${token}`);
      expect(cn(`text-${token}`, "md:text-headline-display")).toBe(
        `text-${token} md:text-headline-display`,
      );
    },
  );
});

describe("joinUrl", () => {
  it("normalises slashes between base URL and path", () => {
    expect(joinUrl("https://example.com/", "/about")).toBe("https://example.com/about");
    expect(joinUrl("https://example.com", "about")).toBe("https://example.com/about");
  });

  it("returns the root URL with a trailing slash", () => {
    expect(joinUrl("https://example.com")).toBe("https://example.com/");
  });
});

describe("getLinkKind", () => {
  it.each([
    ["/projects", "internal"],
    ["/architecture", "internal"],
    ["/#philosophy", "internal"],
    ["//medium.com/@x/post", "external"],
    ["https://medium.com/article", "external"],
    ["http://example.com", "external"],
    ["HTTPS://EXAMPLE.COM", "external"],
    ["#insights", "anchor"],
    ["#topic", "anchor"],
    ["mailto:someone@example.com", "other"],
    ["tel:+911234567890", "other"],
  ] as const)("classifies %s as %s", (href, kind) => {
    expect(getLinkKind(href)).toBe(kind);
  });
});

describe("isActivePath", () => {
  it("matches the home route exactly", () => {
    expect(isActivePath("/", "/")).toBe(true);
    expect(isActivePath("/about", "/")).toBe(false);
  });

  it("matches a route and its nested routes", () => {
    expect(isActivePath("/projects", "/projects")).toBe(true);
    expect(isActivePath("/projects/case-study", "/projects")).toBe(true);
    expect(isActivePath("/projects-archive", "/projects")).toBe(false);
  });

  it("never marks in-page anchors as the current page", () => {
    expect(isActivePath("/", "/#philosophy")).toBe(false);
    expect(isActivePath("/experience", "/#philosophy")).toBe(false);
    expect(isActivePath("/projects", "/#philosophy")).toBe(false);
  });
});
