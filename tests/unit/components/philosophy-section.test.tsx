import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PhilosophySection } from "@/components/sections/philosophy-section";
import { philosophyLink } from "@/data/navigation";

describe("PhilosophySection", () => {
  it("is the target of the Philosophy navigation anchor", () => {
    const { container } = render(<PhilosophySection />);
    const anchorId = philosophyLink.href.split("#")[1] ?? "";

    expect(container.querySelector(`#${anchorId}`)).toBe(
      screen.getByRole("region", { name: /Technology Is Built by People/ }),
    );
  });
});
