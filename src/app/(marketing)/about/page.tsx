import { PagePlaceholder } from "@/components/shared/page-placeholder";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "About",
  description: "Professional background, leadership philosophy and career journey.",
  path: "/about",
});

export default function AboutPage() {
  return <PagePlaceholder title="About" />;
}
