import { PagePlaceholder } from "@/components/shared/page-placeholder";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Experience",
  description: "Roles, responsibilities and outcomes across a career in technology leadership.",
  path: "/experience",
});

export default function ExperiencePage() {
  return <PagePlaceholder title="Experience" />;
}
