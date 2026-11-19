import { PagePlaceholder } from "@/components/shared/page-placeholder";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Contact",
  description: "Get in touch to discuss opportunities, advisory or speaking.",
  path: "/contact",
});

export default function ContactPage() {
  return <PagePlaceholder title="Contact" />;
}
