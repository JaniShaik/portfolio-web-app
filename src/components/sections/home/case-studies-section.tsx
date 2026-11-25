import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { RevealGroup } from "@/components/animations/reveal-group";
import { REVEAL_ITEM } from "@/components/animations/reveal-item";
import { Container } from "@/components/shared/container";
import { caseStudiesContent } from "@/data/case-studies";
import type { CaseStudiesContent } from "@/types";
import { SectionHeading } from "./section-heading";

interface CaseStudiesSectionProps {
  content?: CaseStudiesContent;
}

/** Homepage "Impact & Case Studies": detailed case study cards in a 1/2-column grid. */
export function CaseStudiesSection({ content = caseStudiesContent }: CaseStudiesSectionProps) {
  return (
    <section
      id="featured-projects"
      aria-labelledby="case-studies-title"
      className="scroll-mt-20 border-t section-spacing"
    >
      <Container>
        <RevealGroup>
          <div {...REVEAL_ITEM}>
            <SectionHeading id="case-studies-title" content={content} />
          </div>
          <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
            {content.items.map((study, index) => (
              <li key={study.id} {...REVEAL_ITEM}>
                <article className="flex h-full flex-col justify-between overflow-hidden rounded-xs border bg-muted lg:bg-background">
                  <div className="p-4 md:p-8">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b pb-4 md:mb-6 md:pb-6">
                      <p className="font-mono text-label-sm tracking-wider text-muted-foreground uppercase">
                        Case Study {String(index + 1).padStart(2, "0")}
                        <span className="hidden md:inline">
                          {" "}
                          {"//"} {study.category}
                        </span>
                      </p>
                      <p className="rounded-xs border bg-background px-2.5 py-1 text-label-sm font-semibold text-brand lg:bg-muted">
                        {study.impact}
                      </p>
                    </div>
                    <h3 className="mb-2 text-headline-sm font-semibold text-foreground md:mb-3 md:text-headline-md">
                      {study.title}
                    </h3>
                    <p className="mb-4 text-body-sm leading-relaxed text-muted-foreground md:mb-6 md:text-body-md md:leading-relaxed">
                      {study.summary}
                    </p>
                    <ul
                      aria-label={`${study.title} technologies`}
                      className="flex flex-wrap gap-1.5 md:gap-2"
                    >
                      {/* Static, never reordered and stateless: the index is a stable key. */}
                      {study.technologies.map((technology, technologyIndex) => (
                        <li
                          key={technologyIndex}
                          className="rounded-xs border bg-background px-2.5 py-1 text-label-sm font-medium text-foreground lg:bg-muted"
                        >
                          {technology}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex items-center justify-between gap-4 border-t px-4 py-3 md:px-8 md:py-4 lg:bg-muted">
                    <p className="font-mono text-label-sm text-muted-foreground uppercase">
                      Domain: {study.domain}
                    </p>
                    {study.href ? (
                      <Link
                        href={study.href}
                        className="group inline-flex shrink-0 items-center gap-1.5 text-label-md font-semibold text-foreground focus-ring transition-colors hover:text-brand"
                      >
                        View Case Study<span className="sr-only">: {study.title}</span>
                        <ArrowRightIcon
                          aria-hidden="true"
                          className="size-4 transition-transform motion-safe:group-hover:translate-x-1"
                        />
                      </Link>
                    ) : null}
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </RevealGroup>
      </Container>
    </section>
  );
}
