import { Container } from "@/components/shared/container";

interface PagePlaceholderProps {
  title: string;
  description?: string;
}

/** Temporary page body used while final designs are pending. */
export function PagePlaceholder({
  title,
  description = "This page is under development. Content will be added soon.",
}: PagePlaceholderProps) {
  return (
    <Container as="section" aria-labelledby="page-title" className="py-section lg:py-section-lg">
      <h1 id="page-title" className="text-heading font-semibold">
        {title}
      </h1>
      <p className="mt-4 max-w-prose-narrow text-muted-foreground">{description}</p>
    </Container>
  );
}
