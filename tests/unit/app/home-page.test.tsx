import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomePage from "@/app/(marketing)/page";

describe("HomePage", () => {
  it("numbers its section eyebrows sequentially in page order", () => {
    const { container } = render(<HomePage />);

    const numbers = [...container.querySelectorAll("section")]
      .map((section) => /^(\d{2}) \//.exec(section.textContent.trim()) ?? [])
      .flatMap((match) => (match[1] ? [Number(match[1])] : []));

    expect(numbers.length).toBeGreaterThan(1);
    expect(numbers).toEqual(numbers.map((_, index) => index + 1));
  });

  it("renders a single H1", () => {
    render(<HomePage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });
});
