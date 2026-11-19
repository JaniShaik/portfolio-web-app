import { PagePlaceholder } from "@/components/shared/page-placeholder";
import { siteConfig } from "@/lib/constants";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: siteConfig.title,
  absoluteTitle: true,
  description: siteConfig.description,
  path: "/",
});

export default function HomePage() {
  return <PagePlaceholder title="Home" />;
}
