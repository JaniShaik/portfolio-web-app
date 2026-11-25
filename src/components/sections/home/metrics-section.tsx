import { CountUp } from "@/components/animations/count-up";
import { Container } from "@/components/shared/container";
import { metricsContent } from "@/data/home";
import type { MetricsContent } from "@/types";

interface MetricsSectionProps {
  content?: MetricsContent;
}

/**
 * Impact metrics shown below the hero: a 2×2 tile grid on small screens and a
 * divided four-column ribbon from `lg`, following the Stitch homepage design.
 */
export function MetricsSection({ content = metricsContent }: MetricsSectionProps) {
  return (
    <section aria-labelledby="metrics-title" className="border-b bg-muted py-6 lg:py-0">
      <Container>
        <h2
          id="metrics-title"
          className="mb-4 text-label-sm tracking-widest text-muted-foreground uppercase lg:sr-only"
        >
          {content.title}
        </h2>
        <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-xs border bg-border lg:grid-cols-4 lg:gap-0 lg:divide-x lg:overflow-visible lg:rounded-none lg:border-0 lg:bg-transparent">
          {content.items.map((metric) => (
            <li
              key={metric.label}
              className="flex flex-col bg-background p-4 sm:p-6 lg:bg-transparent lg:px-6 lg:py-10 lg:first:pl-0 lg:last:pr-0"
            >
              <p className="text-headline-lg-mobile text-foreground sm:text-4xl sm:font-semibold sm:tracking-tight lg:text-5xl">
                <CountUp value={metric.value} />
                {metric.suffix ? (
                  <span className="font-light text-brand">{metric.suffix}</span>
                ) : null}
              </p>
              <p className="mt-1 text-label-sm leading-tight text-muted-foreground sm:mt-2 sm:text-label-md sm:leading-snug">
                {metric.label}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
