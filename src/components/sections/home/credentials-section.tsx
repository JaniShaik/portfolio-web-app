import {
  ArrowRightIcon,
  BadgeCheckIcon,
  BriefcaseIcon,
  CloudIcon,
  FileTextIcon,
  LayersIcon,
  type LucideIcon,
  SparklesIcon,
} from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/shared/container";
import { credentialsContent } from "@/data/credentials";
import { pages } from "@/data/navigation";
import { profile } from "@/data/profile";
import { emailLink, socialLinks } from "@/data/social-links";
import { cn, getLinkKind } from "@/lib/utils";
import type { CredentialsContent, FoundationIcon } from "@/types";
import { SectionHeading } from "./section-heading";

const foundationIcons: Record<FoundationIcon, LucideIcon> = {
  experience: BriefcaseIcon,
  architecture: LayersIcon,
  cloud: CloudIcon,
  ai: SparklesIcon,
};

const ctaClassName =
  "inline-flex h-12 items-center justify-center gap-2 rounded-xs px-8 text-label-md font-medium focus-ring transition-colors";

/** Profiles shown beside the CTAs; email is already the primary CTA. */
const profileLinks = socialLinks.filter((link) => link.platform !== "email");

interface CredentialsSectionProps {
  content?: CredentialsContent;
}

/**
 * Homepage "Credentials & Direct Strategic Channel": professional foundations beside the
 * section narrative, followed by the engagement panel (the section's focal point).
 */
export function CredentialsSection({ content = credentialsContent }: CredentialsSectionProps) {
  const { channel } = content;
  // "Let's Connect" opens the profile email; without one it falls back to the contact page.
  const connectClassName = cn(
    ctaClassName,
    "bg-foreground text-background hover:bg-foreground-hover",
  );
  const connectContent = (
    <>
      {channel.connectLabel}
      <ArrowRightIcon aria-hidden="true" className="size-4.5" />
    </>
  );

  return (
    <section
      id="credentials"
      aria-labelledby="credentials-title"
      className="scroll-mt-20 border-t section-spacing"
    >
      <Container>
        <div className="grid grid-cols-1 items-start gap-6 md:gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading
              id="credentials-title"
              content={{ eyebrow: content.eyebrow, title: content.title }}
              className="mb-4 md:mb-6"
            />
            <div className="space-y-4 text-body-md leading-relaxed text-muted-foreground">
              {/* Static, never reordered and stateless: the index is a stable key. */}
              {content.narrative.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="space-y-6 lg:col-span-7">
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
              {content.foundations.map((foundation) => {
                const Icon = foundationIcons[foundation.icon];
                return (
                  <li key={foundation.id} className="rounded-xs border bg-background p-4 md:p-6">
                    <div className="mb-3 flex items-start gap-2">
                      <Icon aria-hidden="true" className="mt-0.75 size-4.5 shrink-0 text-brand" />
                      <h3 className="text-headline-sm font-semibold text-foreground">
                        {foundation.title}
                      </h3>
                    </div>
                    <ul className="space-y-1.5 text-body-sm leading-relaxed text-muted-foreground">
                      {/* Static, never reordered and stateless: the index is a stable key. */}
                      {foundation.points.map((point, pointIndex) => (
                        <li key={pointIndex} className="flex gap-2">
                          <span aria-hidden="true" className="text-border">
                            —
                          </span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              })}
            </ul>

            {content.certifications.length > 0 ? (
              <div className="rounded-xs border bg-background p-4 md:p-6">
                <h3 className="mb-3 text-headline-sm font-semibold text-foreground">
                  Industry Certifications
                </h3>
                <ul className="divide-y">
                  {content.certifications.map((certification) => (
                    <li
                      key={certification.id}
                      className="flex items-center justify-between gap-3 py-2"
                    >
                      <span className="text-body-sm text-foreground">
                        {certification.name}
                        <span className="block text-label-sm text-muted-foreground">
                          {certification.issuer}
                        </span>
                      </span>
                      <BadgeCheckIcon aria-hidden="true" className="size-4.5 shrink-0 text-brand" />
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-8 rounded-xs border bg-muted p-6 text-center sm:p-10 lg:mt-16 lg:flex-row lg:justify-between lg:gap-10 lg:p-16 lg:text-left">
          <div className="max-w-2xl space-y-4">
            <p className="inline-flex items-center gap-2 text-label-sm font-semibold tracking-wider text-brand uppercase">
              <span aria-hidden="true" className="size-2 rounded-full bg-brand" />
              {channel.label}
            </p>
            <h3 className="text-headline-md text-foreground lg:text-headline-lg">
              {channel.title}
            </h3>
            {/* Static, never reordered and stateless: the index is a stable key. */}
            {channel.description.map((paragraph, index) => (
              <p
                key={index}
                className="text-body-md leading-relaxed text-muted-foreground lg:text-body-lg lg:leading-relaxed"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto lg:items-stretch">
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              {emailLink ? (
                <a href={emailLink.href} className={connectClassName}>
                  {connectContent}
                </a>
              ) : (
                <Link href={pages.contact.href} className={connectClassName}>
                  {connectContent}
                </Link>
              )}
              {profile.resume ? (
                <a
                  href={profile.resume.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${channel.resumeLabel} (PDF, opens in a new tab)`}
                  className={cn(
                    ctaClassName,
                    "border bg-background text-foreground hover:border-foreground hover:bg-muted",
                  )}
                >
                  <FileTextIcon aria-hidden="true" className="size-4" />
                  {channel.resumeLabel}
                </a>
              ) : null}
            </div>

            {profileLinks.length > 0 ? (
              <ul
                aria-label="Professional profiles"
                className="flex items-center justify-center gap-4 pt-1 lg:justify-start"
              >
                {profileLinks.map((link) => {
                  const isExternal = getLinkKind(link.href) === "external";
                  return (
                    <li key={link.platform}>
                      <a
                        href={link.href}
                        {...(isExternal
                          ? {
                              target: "_blank",
                              rel: "noopener noreferrer",
                              "aria-label": `${link.label} (opens in a new tab)`,
                            }
                          : {})}
                        className="text-label-md text-muted-foreground focus-ring transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
