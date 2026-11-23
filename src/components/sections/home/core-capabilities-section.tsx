import {
  ArrowRightLeftIcon,
  BrainCircuitIcon,
  CloudIcon,
  CodeIcon,
  type LucideIcon,
  ShieldCheckIcon,
  WorkflowIcon,
} from "lucide-react";
import { Container } from "@/components/shared/container";
import { coreCapabilitiesContent } from "@/data/core-capabilities";
import type { CapabilityIcon, CoreCapabilitiesContent } from "@/types";
import { SectionHeading } from "./section-heading";

const capabilityIcons: Record<CapabilityIcon, LucideIcon> = {
  architecture: WorkflowIcon,
  modernization: ArrowRightLeftIcon,
  backend: CodeIcon,
  ai: BrainCircuitIcon,
  cloud: CloudIcon,
  leadership: ShieldCheckIcon,
};

interface CoreCapabilitiesSectionProps {
  content?: CoreCapabilitiesContent;
}

/**
 * Homepage "Core Capabilities": numbered capability cards in a 1/2/3-column grid. Icons and
 * tags appear from `md`, matching the compact Stitch mobile cards.
 */
export function CoreCapabilitiesSection({
  content = coreCapabilitiesContent,
}: CoreCapabilitiesSectionProps) {
  return (
    <section
      id="expertise"
      aria-labelledby="core-capabilities-title"
      className="scroll-mt-20 border-t bg-muted py-10 md:py-20 lg:py-28"
    >
      <Container>
        <SectionHeading id="core-capabilities-title" content={content} />
        <ul className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {content.items.map((capability, index) => {
            const Icon = capabilityIcons[capability.icon];
            return (
              <li
                key={capability.title}
                className="flex flex-col justify-between rounded-xs border bg-background p-4 transition-colors duration-200 hover:border-foreground md:p-7"
              >
                <div>
                  <div className="mb-2 flex items-center justify-between md:mb-5">
                    <span className="font-mono text-label-sm text-muted-foreground">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <Icon aria-hidden="true" className="hidden size-5 text-brand md:block" />
                  </div>
                  <h3 className="mb-1 text-headline-sm font-semibold text-foreground md:mb-3">
                    {capability.title}
                  </h3>
                  <p className="text-body-sm leading-relaxed text-muted-foreground md:mb-6">
                    {capability.description}
                  </p>
                </div>
                <ul
                  aria-label={`${capability.title} technologies`}
                  className="hidden flex-wrap gap-1.5 border-t pt-4 md:flex"
                >
                  {capability.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-xs border bg-muted px-2 py-0.5 text-label-sm text-muted-foreground"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
