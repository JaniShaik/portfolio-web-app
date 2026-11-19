import { Container } from "@/components/shared/container";
import { socialLinks } from "@/data/social-links";
import { siteConfig } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-auto border-t">
      <Container className="flex flex-col gap-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>© {siteConfig.name}. All rights reserved.</p>
        <nav aria-label="Social">
          <ul className="flex items-center gap-4">
            {socialLinks.map((link) => (
              <li key={link.platform}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-foreground"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </footer>
  );
}
