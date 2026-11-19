import { describe, expect, it } from "vitest";
import { cn, isActivePath, joinUrl } from "@/lib/utils";

describe("cn", () => {
  it("joins conditional class names", () => {
    const isHidden = false;
    expect(cn("px-2", isHidden && "hidden", "py-1")).toBe("px-2 py-1");
  });

  it("resolves conflicting Tailwind classes in favour of the last one", () => {
    expect(cn("px-2 text-sm", "px-4")).toBe("text-sm px-4");
  });
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
});
