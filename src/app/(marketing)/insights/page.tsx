import { PagePlaceholder } from "@/components/shared/page-placeholder";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Insights",
  description: "Articles and perspectives on engineering, architecture and AI.",
  path: "/insights",
});

export default function InsightsPage() {
  return <PagePlaceholder title="Insights" />;
}
