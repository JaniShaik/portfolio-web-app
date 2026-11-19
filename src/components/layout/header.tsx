import Link from "next/link";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { Navigation } from "@/components/layout/navigation";
import { Container } from "@/components/shared/container";
import { siteConfig } from "@/lib/constants";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href="/" className="text-base font-semibold tracking-tight">
          {siteConfig.name}
        </Link>
        <Navigation />
        <MobileNavigation />
      </Container>
    </header>
  );
}
