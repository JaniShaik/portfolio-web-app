import { PagePlaceholder } from "@/components/shared/page-placeholder";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Projects",
  description: "Selected projects and case studies.",
  path: "/projects",
});

export default function ProjectsPage() {
  return <PagePlaceholder title="Projects" />;
}
