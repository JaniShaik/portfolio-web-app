import { PhilosophySection } from "@/components/sections/philosophy-section";
import { BackgroundImpactSection, HeroSection, MetricsSection } from "@/components/sections/home";
import { siteConfig } from "@/lib/constants";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: siteConfig.title,
  absoluteTitle: true,
  description: siteConfig.description,
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <MetricsSection />
      <BackgroundImpactSection />
      <PhilosophySection />
    </>
  );
}
