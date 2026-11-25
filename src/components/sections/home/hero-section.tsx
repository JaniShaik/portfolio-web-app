import { ArrowRightIcon, BadgeCheckIcon, PlusIcon, UserIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/shared/container";
import { heroContent } from "@/data/home";
import { profile } from "@/data/profile";
import { cn } from "@/lib/utils";

const ctaBaseClassName =
  "group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xs px-6 text-label-md font-medium focus-ring transition-colors duration-150 sm:w-auto";

/**
 * Homepage hero. Mobile stacks narrative → portrait → CTAs (Stitch mobile design);
 * from `lg` the narrative and CTAs sit in a 7-column left track with the portrait on the right.
 */
export function HeroSection() {
  const { designation, headline, introduction, primaryCta, secondaryCta, portrait } = heroContent;

  return (
    <section aria-labelledby="hero-title" className="border-b">
      <Container className="pt-4 pb-6 md:py-16 lg:py-24">
        <div className="grid grid-cols-1 gap-6 md:gap-12 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:gap-x-8 lg:gap-y-10">
          <div className="lg:col-span-7 lg:pr-6">
            <p className="mb-4 inline-flex items-start gap-2.5 rounded-xs border bg-muted px-3 py-1.5 text-label-sm font-semibold tracking-wider text-foreground uppercase motion-safe:animate-fade-up md:mb-6">
              <span
                aria-hidden="true"
                className="mt-0.75 size-2 shrink-0 rounded-full bg-brand motion-safe:animate-pulse"
              />
              {designation}
            </p>
            <h1
              id="hero-title"
              className="mb-2 text-headline-lg-mobile text-foreground motion-safe:animate-fade-up motion-safe:animation-delay-80 md:mb-6 md:text-headline-display"
            >
              {headline}
            </h1>
            <p className="max-w-2xl text-body-md leading-relaxed text-muted-foreground motion-safe:animate-fade-up motion-safe:animation-delay-160 md:text-body-lg md:leading-relaxed">
              {introduction}
            </p>
          </div>

          <figure className="w-full motion-safe:animate-fade-up motion-safe:animation-delay-200 sm:max-w-md lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1 lg:max-w-none lg:motion-safe:animate-fade-in-left">
            <div className="relative rounded-xs border bg-muted p-2">
              <div className="relative aspect-square overflow-hidden rounded-xs border bg-background lg:aspect-4/5">
                {portrait.image ? (
                  <Image
                    src={portrait.image.src}
                    alt={portrait.image.alt}
                    fill
                    preload
                    sizes="(min-width: 1024px) 440px, (min-width: 640px) 448px, 100vw"
                    className="object-cover object-top contrast-[1.05] grayscale"
                  />
                ) : (
                  <div
                    aria-hidden="true"
                    className="flex size-full items-center justify-center bg-muted text-border"
                  >
                    <UserIcon className="size-24" strokeWidth={1} />
                  </div>
                )}
                <div className="absolute bottom-2 left-2 flex items-center justify-between gap-3 rounded-xs bg-background/90 backdrop-blur-sm lg:right-3 lg:bottom-3 lg:left-3 lg:border lg:bg-background/95 lg:p-3">
                  <div className="hidden lg:block">
                    <p className="text-body-sm font-semibold tracking-tight text-foreground">
                      {profile.name}
                    </p>
                    <p className="text-label-sm text-muted-foreground">{profile.role}</p>
                  </div>
                  <p className="flex items-center gap-1.5 rounded-xs px-2 py-1 text-label-sm text-foreground lg:border lg:bg-muted">
                    <BadgeCheckIcon
                      aria-hidden="true"
                      className="hidden size-3.5 text-brand lg:block"
                    />
                    {portrait.badge}
                  </p>
                </div>
              </div>
              <figcaption className="flex items-center justify-between px-1 pt-2 lg:hidden">
                <span className="text-label-md text-foreground">{profile.name}</span>
                <span className="text-label-sm text-muted-foreground">{profile.role}</span>
              </figcaption>
              <div
                aria-hidden="true"
                className="mt-2.5 hidden items-center justify-between px-1 text-label-sm text-muted-foreground lg:flex"
              >
                <span className="tracking-widest uppercase">{portrait.legend.reference}</span>
                <span className="font-mono">{portrait.legend.coordinates}</span>
              </div>
            </div>
          </figure>

          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-4 lg:col-span-7 lg:pr-6">
            <Link
              href={primaryCta.href}
              className={cn(
                ctaBaseClassName,
                "bg-foreground text-background hover:bg-foreground-hover motion-safe:animate-fade-up motion-safe:animation-delay-240",
              )}
            >
              {primaryCta.label}
              <ArrowRightIcon
                aria-hidden="true"
                className="size-4.5 transition-transform duration-200 motion-safe:group-hover:translate-x-0.5"
              />
            </Link>
            <Link
              href={secondaryCta.href}
              className={cn(
                ctaBaseClassName,
                "border bg-background text-foreground hover:border-foreground hover:bg-muted motion-safe:animate-fade-up motion-safe:animation-delay-320",
              )}
            >
              {secondaryCta.label}
              <PlusIcon
                aria-hidden="true"
                className="size-4 transition-transform duration-200 motion-safe:group-hover:rotate-90"
              />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
