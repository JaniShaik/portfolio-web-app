import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/layout/site-shell";
import { Container } from "@/components/shared/container";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

/**
 * Root 404. It renders under the root layout only (not `(marketing)/layout`),
 * so it wraps itself in the shared site shell to keep the header, navigation,
 * skip link and footer.
 */
export default function NotFound() {
  return (
    <SiteShell mainClassName="flex items-center">
      <Container className="py-section text-center">
        <p className="text-sm font-medium text-muted-foreground">404</p>
        <h1 className="mt-2 text-heading font-semibold">Page not found</h1>
        <p className="mt-4 text-muted-foreground">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link href="/" className={buttonVariants({ className: "mt-8" })}>
          Back to home
        </Link>
      </Container>
    </SiteShell>
  );
}
