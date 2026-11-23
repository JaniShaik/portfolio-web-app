import { ArrowRightIcon, ArrowUpRightIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Container } from "@/components/shared/container";
import { insightsContent } from "@/data/insights";
import { cn, getLinkKind } from "@/lib/utils";
import type { InsightsContent } from "@/types";
import { SectionHeading } from "./section-heading";

interface InsightLinkProps {
  href: string;
  className?: string;
  children: ReactNode;
}

/**
 * App routes use `next/link`; `http(s)` and protocol-relative URLs open in a new tab and
 * announce it; anchors, `mailto:` and other links stay in the current tab.
 */
function InsightLink({ href, className, children }: InsightLinkProps) {
  const kind = getLinkKind(href);
  const classes = cn(
    "inline-flex items-center gap-1.5 text-label-md font-medium text-foreground focus-ring transition-colors hover:text-brand",
    className,
  );

  if (kind === "external") {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
        <span className="sr-only"> (opens in a new tab)</span>
        <ArrowUpRightIcon aria-hidden="true" className="size-4" />
      </a>
    );
  }

  const icon = <ArrowRightIcon aria-hidden="true" className="size-4" />;
  if (kind === "internal") {
    return (
      <Link href={href} className={classes}>
        {children}
        {icon}
      </Link>
    );
  }
  return (
    <a href={href} className={classes}>
      {children}
      {icon}
    </a>
  );
}

interface InsightsSectionProps {
  content?: InsightsContent;
}

/**
 * Homepage "Writing & Perspectives": topic or article cards in a 1/3-column grid. Cards only
 * link out once an item has an `href`, so unpublished topics never render empty links.
 */
export function InsightsSection({ content = insightsContent }: InsightsSectionProps) {
  const { allLink } = content;

  return (
    <section
      id="insights"
      aria-labelledby="insights-title"
      className="scroll-mt-20 border-t bg-muted section-spacing"
    >
      <Container>
        <SectionHeading
          id="insights-title"
          content={content}
          action={
            allLink ? (
              <InsightLink href={allLink.href} className="hidden md:inline-flex">
                {allLink.label}
              </InsightLink>
            ) : null
          }
        />
        <ul className="grid grid-cols-1 gap-2 md:grid-cols-3 md:gap-6">
          {content.items.map((item) => (
            <li key={item.id}>
              <article className="flex h-full flex-col justify-between rounded-xs border bg-background p-4 md:p-7">
                <div>
                  <div className="mb-2 flex items-center justify-between gap-3 text-label-sm md:mb-4">
                    <p className="font-medium text-brand uppercase">{item.category}</p>
                    {item.meta ? <p className="text-muted-foreground">{item.meta}</p> : null}
                  </div>
                  <h3 className="mb-1 text-headline-sm leading-snug font-semibold text-foreground md:mb-3">
                    {item.title}
                  </h3>
                  <p className="text-body-sm leading-relaxed text-muted-foreground">
                    {item.summary}
                  </p>
                </div>
                {item.href ? (
                  <div className="mt-4 border-t pt-4 md:mt-6">
                    <InsightLink href={item.href}>
                      Read article<span className="sr-only">: {item.title}</span>
                    </InsightLink>
                  </div>
                ) : null}
              </article>
            </li>
          ))}
        </ul>
        {allLink ? (
          <InsightLink
            href={allLink.href}
            className="mt-6 h-11 w-full justify-center rounded-xs border bg-background md:hidden"
          >
            {allLink.label}
          </InsightLink>
        ) : null}
      </Container>
    </section>
  );
}
