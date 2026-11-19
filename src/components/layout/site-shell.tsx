import type { ReactNode } from "react";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { cn } from "@/lib/utils";

interface SiteShellProps {
  children: ReactNode;
  /** Extra classes for the `<main>` landmark. */
  mainClassName?: string;
}

/**
 * Public site chrome: skip link, header, main landmark and footer.
 * Used by the marketing layout and by the root not-found page, which renders
 * outside the `(marketing)` route group.
 */
export function SiteShell({ children, mainClassName }: SiteShellProps) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only z-50 rounded-md bg-background px-4 py-2 focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:ring-3 focus:ring-ring/50"
      >
        Skip to main content
      </a>
      <Header />
      <main id="main-content" className={cn("flex-1", mainClassName)}>
        {children}
      </main>
      <Footer />
    </>
  );
}
