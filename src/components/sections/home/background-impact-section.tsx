import {
  ArrowRightIcon,
  CompassIcon,
  CpuIcon,
  type LucideIcon,
  NetworkIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/shared/container";
import { backgroundImpactContent } from "@/data/background-impact";

/** Decorative icons for the journey cards, in journey order. */
const stageIcons: readonly LucideIcon[] = [CpuIcon, UsersIcon, NetworkIcon, CompassIcon];

/**
 * Homepage "Background & Impact" section. Mobile stacks narrative → journey cards → link
 * (Stitch mobile design); from `lg` the narrative and link share a 7-column left track
 * with the journey cards on the right.
 */
export function BackgroundImpactSection() {
  const { eyebrow, headline, narrative, journey, link } = backgroundImpactContent;
  const leadLines = headline.slice(0, -1);
  const accentLine = headline.at(-1);

  return (
    <section aria-labelledby="background-impact-title" className="py-10 md:py-20 lg:py-28">
      <Container>
        <p className="mb-1 flex items-center gap-3 text-label-sm font-semibold tracking-widest text-brand uppercase lg:mb-6">
          {eyebrow}
          <span aria-hidden="true" className="hidden h-px w-12 bg-border lg:block" />
        </p>

        <div className="grid grid-cols-1 gap-6 md:gap-12 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:gap-x-16 lg:gap-y-8">
          <div className="lg:col-span-7">
            <h2
              id="background-impact-title"
              className="mb-4 text-headline-md text-foreground lg:mb-8 lg:text-headline-lg lg:leading-tight"
            >
              {leadLines.map((line) => (
                <span key={line} className="lg:block">
                  {line}{" "}
                </span>
              ))}
              <span className="text-muted-foreground lg:block">{accentLine}</span>
            </h2>
            <div className="space-y-2 text-body-md leading-relaxed text-muted-foreground lg:space-y-4">
              {narrative.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>

          <ol className="space-y-2 lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1 lg:space-y-4">
            {journey.map((stage, index) => {
              const Icon = stageIcons[index];
              return (
                <li
                  key={stage.title}
                  className="rounded-xs border bg-muted p-4 transition-colors duration-200 lg:bg-background lg:p-6 lg:hover:border-foreground"
                >
                  <div className="mb-1 flex items-center justify-between lg:mb-3">
                    <p className="text-label-sm tracking-wider text-foreground uppercase lg:font-mono lg:tracking-widest lg:text-muted-foreground">
                      {String(index + 1).padStart(2, "0")} — {stage.label}
                    </p>
                    {Icon ? (
                      <Icon
                        aria-hidden="true"
                        className="hidden size-4.5 text-muted-foreground lg:block"
                      />
                    ) : null}
                  </div>
                  <h3 className="mb-1 text-headline-sm font-semibold text-foreground lg:mb-2">
                    {stage.title}
                  </h3>
                  <p className="text-body-sm leading-relaxed text-muted-foreground">
                    {stage.themes.join(" · ")}
                  </p>
                </li>
              );
            })}
          </ol>

          <div className="lg:col-span-7">
            <Link
              href={link.href}
              className="group inline-flex items-center gap-2 py-1 text-label-md font-semibold text-foreground focus-ring transition-colors hover:text-brand"
            >
              {link.label}
              <ArrowRightIcon
                aria-hidden="true"
                className="size-4 transition-transform motion-safe:group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
