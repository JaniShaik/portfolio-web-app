// @vitest-environment node
import { describe, expect, it } from "vitest";
import { caseStudiesContent } from "@/data/case-studies";
import { coreCapabilitiesContent } from "@/data/core-capabilities";
import { insightsContent } from "@/data/insights";

const isUnique = (values: readonly string[]) => new Set(values).size === values.length;

describe("homepage content data", () => {
  it.each([
    ["core capabilities", coreCapabilitiesContent.items],
    ["case studies", caseStudiesContent.items],
    ["insights", insightsContent.items],
  ])("gives every %s item a unique id", (_, items) => {
    expect(isUnique(items.map((item) => item.id))).toBe(true);
  });

  it("does not repeat a tag within a card", () => {
    for (const capability of coreCapabilitiesContent.items)
      expect(isUnique(capability.tags)).toBe(true);
    for (const study of caseStudiesContent.items) expect(isUnique(study.technologies)).toBe(true);
  });
});
