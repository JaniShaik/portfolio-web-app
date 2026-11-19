import { AtSignIcon, DownloadIcon, GlobeIcon, MailIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { Navigation } from "@/components/layout/navigation";
import { GitHubIcon, LinkedInIcon } from "@/components/shared/brand-icons";
import { Container } from "@/components/shared/container";
import { pages } from "@/data/navigation";
import { profile } from "@/data/profile";
import { socialLinks } from "@/data/social-links";
import { siteConfig } from "@/lib/constants";
import type { SocialPlatform } from "@/types";

interface SocialIcon {
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  /** Filled brand marks read heavier than stroked glyphs, so they render slightly smaller. */
  className: string;
}

const socialIcons: Record<SocialPlatform, SocialIcon> = {
  linkedin: { Icon: LinkedInIcon, className: "size-4" },
  github: { Icon: GitHubIcon, className: "size-4" },
  email: { Icon: MailIcon, className: "size-4.5" },
  x: { Icon: AtSignIcon, className: "size-4.5" },
  website: { Icon: GlobeIcon, className: "size-4.5" },
};

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur-md">
      <Container className="flex h-20 items-center justify-between gap-4">
        <div className="flex shrink-0 items-center gap-2">
          <Link
            href={pages.home.href}
            className="text-headline-sm font-semibold tracking-tight text-foreground uppercase focus-ring transition-colors hover:text-primary"
          >
            {siteConfig.name}
          </Link>
          <span className="hidden items-center rounded-xs border bg-muted px-1 py-0.5 text-label-sm tracking-wider text-muted-foreground uppercase sm:inline-flex">
            {profile.role}
          </span>
        </div>

        <Navigation />

        <div className="flex shrink-0 items-center gap-4 xl:gap-3">
          {profile.resume ? (
            <a
              href={profile.resume.href}
              download
              className="inline-flex items-center gap-1 rounded-xs border bg-background px-2 py-1.5 text-label-md text-foreground focus-ring transition-all hover:border-foreground hover:bg-muted"
            >
              <DownloadIcon aria-hidden="true" className="size-4 text-muted-foreground" />
              Resume <span className="sr-only">(PDF)</span>
            </a>
          ) : null}

          <nav aria-label="Social links" className="hidden border-l pl-2 md:block">
            <ul className="flex items-center gap-1">
              {socialLinks.map((link) => {
                const { Icon, className } = socialIcons[link.platform];
                const isExternal = link.href.startsWith("http");
                return (
                  <li key={link.platform}>
                    <a
                      href={link.href}
                      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      aria-label={isExternal ? `${link.label} (opens in a new tab)` : link.label}
                      className="flex size-8 items-center justify-center rounded-xs text-muted-foreground focus-ring transition-colors hover:text-primary"
                    >
                      <Icon aria-hidden="true" className={className} />
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <span
            aria-hidden="true"
            className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground"
          >
            <UserIcon className="size-4.5" />
          </span>

          <MobileNavigation />
        </div>
      </Container>
    </header>
  );
}
