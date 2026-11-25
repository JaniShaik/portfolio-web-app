<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Portfolio Web App — Agent Guide

Living documentation for Claude Code and other coding agents. Keep it accurate: update it whenever architecture, conventions or implementation status change, and never record planned work as done. Commands and environment variables are documented in `README.md`; `CLAUDE.md` holds the short project rules.

## A. Project overview

- **Purpose:** personal portfolio of **Jani Shaik**, Technology Leader & Enterprise AI Architect (Hyderabad, India).
- **Audience:** technology leaders, hiring managers and engineering peers evaluating architecture, AI and leadership experience.
- **Stack:** Next.js 16 App Router (Cache Components + partial prefetching enabled), React 19, TypeScript 5 strict (`noUncheckedIndexedAccess`), Tailwind CSS 4 (CSS-first tokens), shadcn/ui on Base UI, Lucide icons, Motion, MDX, React Hook Form + Zod, Resend, Vitest + RTL, Playwright, pnpm 12, Node 24+.
- **UX source of truth:** Google Stitch project **"Portfolio New"** (ID `15341465597716774495`), design system **"Clinical Cobalt Monochrome"**. Screens: _Homepage (Desktop 1440px)_ and _Homepage (Mobile 390px)_. Access it through the Stitch MCP server (`list_screens`, `get_screen`, `download_file`).
- **Workflow:** features are built with Claude Code, one feature branch per feature or section, reviewed via PRs into `main`.

## B. Architecture

```text
src/app/                    Routing only
  (marketing)/layout.tsx    Wraps every public page in <SiteShell> (skip link, Header, <main>, Footer)
  (marketing)/*/page.tsx    / about experience expertise projects architecture insights contact
  api/contact/route.ts      POST contact endpoint (origin/size/honeypot/Zod/rate-limit guards → Resend)
  not-found.tsx             404, also wrapped in <SiteShell>
  sitemap.ts, robots.ts     Generated from data/navigation.ts and siteConfig
  globals.css               Tailwind entry + all design tokens
src/components/
  layout/                   header, navigation (desktop), mobile-navigation (Sheet), footer,
                            copyright-year (client), site-shell
  sections/                 Page sections — currently only philosophy-section
  shared/                   container, page-placeholder, brand-icons (LinkedIn/GitHub SVG marks)
  ui/                       shadcn primitives (button, card, input, label, separator, sheet, textarea)
  animations/               scroll reveal (useScrollReveal, FadeIn, RevealGroup + REVEAL_ITEM) and CountUp: CSS transitions + IntersectionObserver
src/data/                   Typed content: profile, navigation, social-links, footer, philosophy, skills
src/lib/                    constants (siteConfig), seo, utils (cn, joinUrl, isActivePath), env,
                            server-env, security/, validations/, email/
src/types/                  Shared domain types
public/documents/           jani-shaik-resume.pdf
tests/unit|integration|e2e  Vitest (jsdom/node) and Playwright (desktop Chrome + Pixel 7)
```

**Single sources of truth — reuse, never duplicate:**

| Concern            | Source                                                                                                         |
| ------------------ | -------------------------------------------------------------------------------------------------------------- |
| Person/brand data  | `data/profile.ts` (name, role, headline, location, email, resume)                                              |
| Site brand and SEO | `lib/constants.ts` → `siteConfig.name` derives from `profile.name`; used by header, footer, metadata           |
| Public pages       | `pages` in `data/navigation.ts`; `publicRoutes` (sitemap), `mainNavigation`, `footerNavigation` derive from it |
| Section anchors    | `philosophyLink` / `PHILOSOPHY_SECTION_ID` — anchors are never sitemap entries                                 |
| Email link         | `emailLink` in `data/social-links.ts` (the only `mailto:` builder)                                             |

Tests enforce that `pages` matches the `page.tsx` files on disk and that every page is linked from the header or footer. When adding a page, add it to `pages` and to a menu.

**Rendering:** Server Components by default; client components only for interaction (`navigation`, `mobile-navigation`, `copyright-year`, `animations/*`, `ui/sheet`). **Motion:** hero entrance is CSS-only (`motion-safe:animate-fade-up` + `animation-delay-*` tokens); below-the-fold content reveals once via `RevealGroup`/`FadeIn` (server-rendered visible, hidden only after mount, never under reduced motion). Import `REVEAL_ITEM` from `reveal-item.ts`, not the client module: client-module values become client references in Server Components. With Cache Components, `new Date()`/`Math.random()` during prerender fail the build — compute them in a client component or wrap request-time work in `<Suspense>`.

**Styling:** Tailwind utilities on semantic tokens from `globals.css`. `cn()` uses a `tailwind-merge` config that knows the custom font-size tokens — register any new `--text-*` token there too, or `cn()` will drop it.

## C. Design guidelines

- **Palette:** white canvas (`bg-background`, #FFFFFF), near-black text (`text-foreground`, #111111), grey secondary text (`text-muted-foreground`, #666666), subtle surfaces (`bg-muted`, #F7F7F7), hairline borders (`border`, #E8E8E8), nav text `text-subtle-foreground` (#434655). Cobalt is reserved for active states and primary actions: `text-primary`/`bg-primary` (#004AC6), `bg-brand` (#2563EB) with `hover:bg-brand-hover` (#1D4ED8).
- **Type (Geist):** `text-headline-sm`, `text-body-md`, `text-body-sm`, `text-label-md`, `text-label-sm`, plus fluid `text-heading`/`text-display`. Labels are uppercase with wide tracking.
- **Layout:** `container-page` = 1200px max, 20px mobile / 48px desktop padding. Mobile-first; breakpoints sm 640, md 768, lg 1024, xl 1280.
- **Shape and depth:** chips and buttons `rounded-xs` (2px, as rendered in Stitch); no drop shadows — depth comes from borders and surface tone.
- **Focus:** use the `focus-ring` utility (2px cobalt outline) on custom links and controls.
- **Preserve the approved UX:** compare against the Stitch screens before changing layout, spacing or copy. Record unavoidable deviations in PR notes and in this file.

## D. Coding standards

- kebab-case files, PascalCase components, camelCase utilities, `useCamelCase` hooks; named exports (default only where Next.js requires).
- No `any`; explicit types, `import type`, `satisfies` for typed config objects.
- Content in `data/`/`content/`, presentation in `components/`, logic in `lib/`. No hard-coded brand, route, email or location strings in components.
- **Accessibility:** semantic landmarks with unique labels (`Main`, `Mobile`, `Social links`, `Directory`); `aria-current="page"` for active links; decorative icons `aria-hidden`; icon-only links need `aria-label`; external links say "(opens in a new tab)"; touch targets ≥ 44px in the mobile menu; Base UI dialogs handle focus trap, Escape and `aria-expanded`.
- **Validation and security:** Zod schemas in `lib/validations/`; server secrets only via `lib/server-env.ts` (`server-only`); external links use `rel="noopener noreferrer"`; never commit `.env*` (except `.env.example`).
- **Testing:** unit/component tests in `tests/unit` (Vitest can't render async Server Components — use Playwright for those); route handlers in `tests/integration`; user flows in `tests/e2e`. Add tests with every feature and run `pnpm validate` plus `pnpm test:e2e` before a PR.

## E. Completed: Header and Footer

- **Header** (`components/layout/header.tsx`, server): sticky 80px bar with border. Brand link (`siteConfig.name`, uppercase) + role chip (≥ sm); desktop nav (≥ xl); Resume download button; Social links nav with LinkedIn/GitHub brand marks + Email (≥ md); profile badge; menu button (< xl).
- **Navigation:** Home, About, Experience, Expertise, Projects, Insights, Philosophy (`/#philosophy`), Contact. Active item shows cobalt text + underline (`isActivePath`). Eight items fit the 1200px container only with 16px nav gaps (Stitch had 24px for seven items); an e2e test guards against header overflow.
- **Mobile navigation:** Base UI Sheet from the right; closes on selection and Escape; focus returns to the trigger.
- **Footer** (`components/layout/footer.tsx`): name, headline, bio, location (once, from profile); Directory nav (`footerNavigation`, including Experience and Architecture); email (shared `emailLink`) and availability; Curriculum Vitae download and "Initiate Dialogue" → `/contact`; copyright line.
- **Copyright year:** `copyright-year.tsx` reads the year in the browser (`useSyncExternalStore`), so no server cache or revalidation is involved; the static HTML omits the year until hydration.
- **Resume:** `profile.resume.href` = `/documents/jani-shaik-resume.pdf`, used by both header and footer.
- **Philosophy section:** minimal homepage section (`components/sections/philosophy-section.tsx`, content in `data/philosophy.ts`) that is the anchor target for Philosophy links.
- **Branding/SEO:** title template `%s | Jani Shaik`; `applicationName` and Open Graph `siteName` = `siteConfig.name`.

## F. Progress tracker

- [x] Project scaffolding (routing, tooling, CI, testing, design-token foundation)
- [x] Contact API endpoint with security guards (email inactive until Resend/Upstash are configured)
- [x] Stitch design tokens applied in `globals.css`
- [x] Header (desktop + mobile navigation)
- [x] Footer
- [x] Navigation and route configuration (single source of truth, sitemap)
- [x] Resume PDF integration
- [x] Homepage Philosophy section (minimal version from Stitch)
- [ ] Homepage Hero section
- [ ] Homepage impact metrics, expertise, case studies, insights, education/certifications and closing CTA sections
- [ ] About page
- [ ] Experience page
- [ ] Expertise page
- [ ] Projects page / case studies
- [ ] Architecture page
- [ ] Insights page
- [ ] Contact page and form (UI)
- [ ] SEO finalisation (real site description, Open Graph image)
- [ ] Real LinkedIn/GitHub URLs and confirmed contact email
- [ ] Final testing and deployment

## G. Git workflow

- `main` is the primary branch; never commit or push to it directly.
- One branch per feature/section: `feature/<name>`, `fix/<name>`, `chore/<name>`.
- Review the full diff before committing; use Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`).
- Run `pnpm validate` and `pnpm test:e2e` before raising a PR. The pre-commit hook runs lint-staged.
- PRs target `main`. Never merge PRs automatically.

## H. Guidance for future sessions

1. Inspect the existing implementation and this file before modifying anything.
2. Fetch the relevant Stitch screen before implementing UI; don't invent design.
3. Preserve the architecture, design tokens and single sources of truth above; avoid unnecessary refactoring and duplicate config.
4. Maintain accessibility, responsiveness (check 1440/1280/768/390/375px for overflow) and performance (prefer static rendering).
5. Update this file and the progress tracker when significant work lands. Only mark items done once they are implemented and verified.
