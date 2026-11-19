import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PagePlaceholder } from "@/components/shared/page-placeholder";

describe("PagePlaceholder", () => {
  it("renders the title as the page's level-one heading", () => {
    render(<PagePlaceholder title="About" />);

    expect(screen.getByRole("heading", { level: 1, name: "About" })).toBeInTheDocument();
  });

  it("labels the section with the heading for assistive technology", () => {
    render(<PagePlaceholder title="Projects" />);

    expect(screen.getByRole("region", { name: "Projects" })).toBeInTheDocument();
  });

  it("shows a default development message and allows overriding it", () => {
    const { rerender } = render(<PagePlaceholder title="Insights" />);
    expect(screen.getByText(/under development/i)).toBeInTheDocument();

    rerender(<PagePlaceholder title="Insights" description="Coming soon." />);
    expect(screen.getByText("Coming soon.")).toBeInTheDocument();
  });
});
