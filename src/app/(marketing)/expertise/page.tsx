import { PagePlaceholder } from "@/components/shared/page-placeholder";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Expertise",
  description:
    "Digital engineering, software architecture, cloud engineering, AI/GenAI and engineering leadership.",
  path: "/expertise",
});

export default function ExpertisePage() {
  return <PagePlaceholder title="Expertise" />;
}
