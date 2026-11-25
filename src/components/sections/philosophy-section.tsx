import { RevealGroup } from "@/components/animations/reveal-group";
import { REVEAL_ITEM } from "@/components/animations/reveal-item";
import { Container } from "@/components/shared/container";
import { PHILOSOPHY_SECTION_ID } from "@/data/navigation";
import { philosophyContent } from "@/data/philosophy";
import { siteConfig } from "@/lib/constants";

/** Homepage "Leadership Philosophy" section; target of the Philosophy navigation links. */
export function PhilosophySection() {
  const titleId = `${PHILOSOPHY_SECTION_ID}-title`;

  return (
    <section
      id={PHILOSOPHY_SECTION_ID}
      aria-labelledby={titleId}
      className="scroll-mt-20 border-t section-spacing"
    >
      <Container>
        <RevealGroup>
          <p
            {...REVEAL_ITEM}
            className="mb-6 flex items-center gap-3 text-label-sm font-semibold tracking-widest text-brand uppercase"
          >
            {philosophyContent.eyebrow}
            <span aria-hidden="true" className="h-px w-10 bg-border" />
          </p>
          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
            <div {...REVEAL_ITEM} className="space-y-6 lg:col-span-5">
              <h2 id={titleId} className="text-heading font-semibold tracking-tight">
                {philosophyContent.title}{" "}
                <span className="text-muted-foreground">{philosophyContent.titleAccent}</span>
              </h2>
              <figure className="rounded-xs border bg-muted p-8">
                <blockquote className="text-body-md font-medium text-foreground">
                  <p>“{philosophyContent.quote}”</p>
                </blockquote>
                <figcaption className="mt-6">
                  <span className="block text-label-md font-semibold text-foreground">
                    {siteConfig.name}
                  </span>
                  <span className="block text-label-sm text-muted-foreground">
                    {philosophyContent.quoteAttribution}
                  </span>
                </figcaption>
              </figure>
            </div>
            <ul className="divide-y border-t lg:col-span-7 lg:border-t-0">
              {philosophyContent.tenets.map((tenet) => (
                <li key={tenet.title} {...REVEAL_ITEM} className="space-y-1 py-5">
                  <h3 className="text-headline-sm font-semibold text-foreground">{tenet.title}</h3>
                  <p className="text-body-sm leading-relaxed text-muted-foreground">
                    {tenet.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </RevealGroup>
      </Container>
    </section>
  );
}
