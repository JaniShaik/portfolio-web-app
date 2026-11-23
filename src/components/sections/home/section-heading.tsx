import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { SectionHeadingContent } from "@/types";

interface SectionHeadingProps {
  /** `id` of the `<h2>`, referenced by the section's `aria-labelledby`. */
  id: string;
  content: SectionHeadingContent;
  /** Optional trailing element, e.g. a desktop "view all" link. */
  action?: ReactNode;
  /** Extra classes, e.g. to tighten the bottom margin when content follows directly. */
  className?: string;
}

/**
 * Stitch homepage section header: numbered eyebrow and title on the left, intro (and an
 * optional action) on the right from `md`; stacked on mobile.
 */
export function SectionHeading({ id, content, action, className }: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-6 flex flex-col justify-between gap-1 md:mb-12 md:flex-row md:items-end md:gap-4",
        className,
      )}
    >
      <div>
        <p className="mb-1 flex items-center gap-3 text-label-sm font-semibold tracking-widest text-brand uppercase md:mb-3">
          {content.eyebrow}
          <span aria-hidden="true" className="hidden h-px w-10 bg-border md:block" />
        </p>
        <h2 id={id} className="text-headline-md text-foreground lg:text-headline-lg">
          {content.title}
        </h2>
      </div>
      {content.intro || action ? (
        <div className="flex flex-col items-start gap-3 md:items-end">
          {content.intro ? (
            <p className="max-w-md text-body-sm text-muted-foreground">{content.intro}</p>
          ) : null}
          {action}
        </div>
      ) : null}
    </div>
  );
}
