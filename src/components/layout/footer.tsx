import { ArrowRightIcon, ClockIcon, DownloadIcon, MailIcon, MapPinIcon } from "lucide-react";
import Link from "next/link";
import { CopyrightYear } from "@/components/layout/copyright-year";
import { Container } from "@/components/shared/container";
import { footerContent } from "@/data/footer";
import { footerNavigation, pages } from "@/data/navigation";
import { profile } from "@/data/profile";
import { emailLink } from "@/data/social-links";
import { siteConfig } from "@/lib/constants";

const headingClassName =
  "mb-4 text-label-md font-semibold tracking-wider text-foreground uppercase";

export function Footer() {
  return (
    <footer className="mt-auto border-t bg-muted">
      <Container className="py-10">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          <div className="flex flex-col justify-between md:col-span-5 md:pr-6">
            <div className="space-y-1">
              <p className="text-headline-sm font-semibold tracking-tight text-foreground">
                {siteConfig.name}
              </p>
              <p className="text-body-sm leading-relaxed text-muted-foreground">
                {profile.headline}
              </p>
              <p className="mt-4 max-w-sm text-body-sm text-muted-foreground">
                {footerContent.bio}
              </p>
            </div>
            <p className="mt-6 flex items-center gap-1 text-label-sm text-muted-foreground">
              <MapPinIcon aria-hidden="true" className="size-4 text-primary" />
              {profile.location}
            </p>
          </div>

          <nav aria-labelledby="footer-directory" className="md:col-span-3">
            <h2 id="footer-directory" className={headingClassName}>
              Directory
            </h2>
            <ul className="space-y-1">
              {footerNavigation.map((item) => (
                <li key={item.href} className="text-body-sm">
                  <Link
                    href={item.href}
                    className="text-muted-foreground focus-ring transition-colors hover:text-foreground"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-4">
            <h2 className={headingClassName}>Engagements &amp; Channels</h2>
            <ul className="mb-6 space-y-1 text-body-sm text-muted-foreground">
              {emailLink && profile.email ? (
                <li className="flex items-center gap-1">
                  <MailIcon aria-hidden="true" className="size-4" />
                  <a
                    href={emailLink.href}
                    className="focus-ring transition-colors hover:text-foreground"
                  >
                    {profile.email}
                  </a>
                </li>
              ) : null}
              <li className="flex items-center gap-1">
                <ClockIcon aria-hidden="true" className="size-4" />
                {footerContent.availability}
              </li>
            </ul>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {profile.resume ? (
                <a
                  href={profile.resume.href}
                  download
                  className="inline-flex items-center gap-1 rounded-xs border bg-background px-2 py-1.5 text-label-sm text-foreground focus-ring transition-all hover:border-foreground"
                >
                  <DownloadIcon aria-hidden="true" className="size-4 text-primary" />
                  Curriculum Vitae <span className="sr-only">(PDF)</span>
                </a>
              ) : null}
              <Link
                href={pages.contact.href}
                className="inline-flex items-center gap-1 rounded-xs bg-brand px-2 py-1.5 text-label-sm text-primary-foreground focus-ring transition-all hover:bg-brand-hover"
              >
                Initiate Dialogue
                <ArrowRightIcon aria-hidden="true" className="size-3.5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t pt-4 text-center text-label-sm text-muted-foreground lg:flex-row lg:text-left">
          <p>
            © <CopyrightYear />
            {siteConfig.name}. {footerContent.copyrightNote}
          </p>
          <p>{footerContent.practice}</p>
        </div>
      </Container>
    </footer>
  );
}
