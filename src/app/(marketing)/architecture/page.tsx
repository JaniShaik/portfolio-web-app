import { PagePlaceholder } from "@/components/shared/page-placeholder";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Architecture",
  description: "Architecture approaches, patterns and reference designs.",
  path: "/architecture",
});

export default function ArchitecturePage() {
  return <PagePlaceholder title="Architecture" />;
}
