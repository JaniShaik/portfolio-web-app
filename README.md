# Portfolio Web App

Personal portfolio website for a technology leader working across Digital Engineering, Software Architecture, Cloud Engineering, AI/GenAI and Engineering Leadership.

> **Status:** Scaffolding only. All routes render placeholder content. Final page designs (from Google Stitch) and real content are still to be implemented.

## Technology stack

| Concern              | Choice                                                              |
| -------------------- | ------------------------------------------------------------------- |
| Framework            | Next.js 16 (App Router, Turbopack, Cache Components)                |
| Language             | TypeScript 5 (strict, `noUncheckedIndexedAccess`)                   |
| Runtime              | Node.js 24 LTS or newer                                             |
| Package manager      | pnpm 12                                                             |
| Styling              | Tailwind CSS 4 (CSS-first config in `src/app/globals.css`)          |
| UI components        | shadcn/ui (`base-nova` style, built on Base UI)                     |
| Icons                | Lucide React                                                        |
| Animation            | Motion for React (`motion/react`)                                   |
| Content              | MDX via `@next/mdx` (local files)                                   |
| Forms and validation | React Hook Form + Zod                                               |
| Email                | Resend (integration prepared, inactive until configured)            |
| Testing              | Vitest + React Testing Library (unit/integration), Playwright (E2E) |
| Code quality         | ESLint 9 (flat config) + Prettier (with Tailwind class sorting)     |
| Git hooks            | Husky + lint-staged                                                 |
| CI / Deployment      | GitHub Actions / Vercel                                             |

## Prerequisites

- **Node.js 24+** (see `.nvmrc`; `nvm use` picks it up)
- **pnpm 12** — the exact version is pinned in `package.json` → `packageManager`. Install with `npm install -g pnpm` (Node 25+ no longer bundles Corepack).
- Git

## Getting started

```bash
git clone https://github.com/JaniShaik/portfolio-web-app.git
cd portfolio-web-app
pnpm install              # also installs the Husky git hooks
cp .env.example .env.local
pnpm dev                  # http://localhost:3000
```

## Commands

| Command                 | Description                                                           |
| ----------------------- | --------------------------------------------------------------------- |
| `pnpm dev`              | Start the dev server (Turbopack)                                      |
| `pnpm build`            | Create a production build                                             |
| `pnpm start`            | Serve the production build                                            |
| `pnpm lint`             | Run ESLint                                                            |
| `pnpm lint:fix`         | Run ESLint with auto-fix                                              |
| `pnpm format`           | Format all files with Prettier                                        |
| `pnpm format:check`     | Verify formatting (used in CI)                                        |
| `pnpm typecheck`        | Generate Next.js route types and run `tsc --noEmit`                   |
| `pnpm test`             | Run unit and integration tests once                                   |
| `pnpm test:watch`       | Run Vitest in watch mode                                              |
| `pnpm test:e2e:install` | Download the Playwright Chromium browser (first time only)            |
| `pnpm test:e2e`         | Build, start on port 3100 and run Playwright tests (desktop + mobile) |
| `pnpm validate`         | Lint, format check, type-check, test and build — same as CI           |

## Folder structure

```text
src/
├── app/                      # Routing only: layouts, pages, route handlers, metadata files
│   ├── (marketing)/          # Route group for public pages; shares header/footer layout
│   │   ├── layout.tsx        # Skip link, Header, <main>, Footer
│   │   ├── page.tsx          # /
│   │   └── about|experience|expertise|projects|architecture|insights|contact/page.tsx
│   ├── api/contact/route.ts  # POST endpoint: Zod validation → Resend
│   ├── layout.tsx            # Root <html>/<body>, fonts, default metadata
│   ├── globals.css           # Tailwind entry + design tokens
│   ├── not-found.tsx         # 404 page
│   ├── sitemap.ts            # /sitemap.xml (generated from data/navigation.ts)
│   └── robots.ts             # /robots.txt
├── components/
│   ├── ui/                   # shadcn/ui primitives (generated; content-agnostic)
│   ├── layout/               # Header, footer, desktop + mobile navigation
│   ├── sections/             # Page sections (hero, timeline …) — to be built
│   ├── shared/               # Reusable building blocks (Container, PagePlaceholder)
│   └── animations/           # Motion wrappers (FadeIn) — client components
├── content/                  # MDX content: projects/, articles/, experience/
├── data/                     # Typed static data: profile, navigation, skills, social links
├── hooks/                    # Custom React hooks (useCamelCase)
├── lib/
│   ├── utils.ts              # cn(), joinUrl(), isActivePath()
│   ├── constants.ts          # siteConfig (name, title, description, URL)
│   ├── env.ts                # Public (client-safe) environment access + Zod validation
│   ├── server-env.ts         # Server-only secrets/config (email, rate limiting)
│   ├── security/             # Contact API guards: origin, body size, client IP, rate limit (server-only)
│   ├── seo.ts                # defaultMetadata + createPageMetadata()
│   ├── validations/          # Zod schemas shared by client and server
│   └── email/                # Resend integration (server-only)
├── types/                    # Shared domain types (project, experience, profile …)
├── styles/                   # Additional stylesheets (e.g. MDX prose) if needed
└── mdx-components.tsx        # Global MDX element → component mapping (required by @next/mdx)

public/                       # images/{profile,projects,common}, icons, fonts, documents
tests/
├── setup.ts                  # jest-dom matchers + RTL cleanup
├── unit/                     # Pure functions and components (jsdom)
├── integration/              # Route handlers and module interactions (node env)
└── e2e/                      # Playwright specs against a production build
```

### Conventions

- **Server Components by default.** Add `"use client"` only for interactivity (navigation state, animations, forms).
- **Separation of concerns:** `data/` holds content, `components/` holds presentation, `lib/` holds logic and integrations. UI components never import from `data/` directly except layout components that are explicitly site-specific.
- **Naming:** files in `kebab-case`, components in `PascalCase`, hooks as `useCamelCase`, utilities in `camelCase`. Named exports for reusable code; default exports only where Next.js requires them (pages, layouts, route files).
- **No `any`** — enforced by ESLint. Type-only imports use `import { type X }`.
- **Adding shadcn components:** `pnpm dlx shadcn@latest add <component>`. Add only what you use.

### Rendering model

`cacheComponents` and `partialPrefetching` are enabled (the Next.js 16 defaults for new projects). Every placeholder page is prerendered as static HTML. If you later read request data (`cookies()`, `headers()`, `searchParams`) or uncached data, wrap that part in `<Suspense>` or cache it with `"use cache"` — see `node_modules/next/dist/docs/01-app/02-guides/` for the bundled guides.

## Design system

Defined in `src/app/globals.css`:

- **Colours:** semantic CSS variables (`--background`, `--primary`, `--muted` …) in `oklch`, exposed as Tailwind utilities (`bg-background`, `text-muted-foreground`).
- **Themes:** light is the default. Dark tokens exist under `.dark`; enable later by toggling the `dark` class on `<html>` (e.g. with `next-themes`).
- **Typography:** Geist Sans/Mono via `next/font`; `font-heading` for headings; fluid `text-display` and `text-heading` sizes.
- **Spacing:** Tailwind's 0.25rem scale plus `gutter`, `gutter-lg`, `section`, `section-lg` tokens (e.g. `py-section`).
- **Radius:** all derived from `--radius` (`rounded-sm` … `rounded-4xl`).
- **Containers:** `max-w-prose-narrow`, `max-w-content`, `max-w-wide`, and the `container-page` utility.
- **Breakpoints:** `sm 640`, `md 768`, `lg 1024`, `xl 1280`, `2xl 1536` (px). Styles are mobile-first.
- **Variants:** `Button` (`default`, `outline`, `secondary`, `ghost`, `destructive`, `link`; multiple sizes) and `Card` (`default`, `sm`). Use `buttonVariants()` to style links as buttons.

To apply the Google Stitch designs, update the token values first; components pick them up automatically.

## Content (MDX)

Place MDX files in `src/content/{projects,articles,experience}/` and describe them with an exported `metadata` object typed by `ProjectMetadata`, `ArticleMetadata` or `ExperienceMetadata` from `@/types`:

```mdx
export const metadata = {
  title: "Platform modernisation",
  slug: "platform-modernisation",
  summary: "…",
  date: "2025-01-31",
  status: "completed",
  technologies: ["AWS", "Kubernetes"],
};

## Context

…
```

Import with `import Project from "@/content/projects/platform-modernisation.mdx"`, or dynamically in a `[slug]` route with `generateStaticParams`. Style markdown elements globally in `src/mdx-components.tsx`.

## Environment variables

Copy `.env.example` to `.env.local` (git-ignored). Never commit real values.

| Variable                                              | Scope  | Required                 | Purpose                                                                                                                                  |
| ----------------------------------------------------- | ------ | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                                | Public | No                       | Canonical URL for metadata, sitemap, robots. Falls back to Vercel URL, then localhost.                                                   |
| `RESEND_API_KEY`                                      | Server | No                       | Resend API key for the contact endpoint                                                                                                  |
| `CONTACT_EMAIL`                                       | Server | No                       | Inbox that receives contact submissions                                                                                                  |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | Server | In production, for email | Upstash Redis for distributed contact rate limiting. `KV_REST_API_URL` / `KV_REST_API_TOKEN` (Vercel Marketplace integration) also work. |
| `CONTACT_RATE_LIMIT_MAX`                              | Server | No                       | Submissions allowed per client IP per window (default `5`)                                                                               |
| `CONTACT_RATE_LIMIT_WINDOW_SECONDS`                   | Server | No                       | Per-IP window length in seconds (default `3600`)                                                                                         |
| `CONTACT_RATE_LIMIT_DAILY_MAX`                        | Server | No                       | Site-wide submissions per day, protecting the email quota (default `100`)                                                                |
| `TRUST_PROXY_HEADERS`                                 | Server | No                       | Self-hosting only: `true` to trust `x-real-ip` / `x-forwarded-for` from your reverse proxy. Trusted automatically on Vercel.             |

Public values are validated in `src/lib/env.ts` and server-only values in `src/lib/server-env.ts` (which imports `server-only`, so a Client Component importing it fails the build):

- An invalid `NEXT_PUBLIC_SITE_URL` fails the build with a clear message.
- If neither email variable is set, `POST /api/contact` returns **503** and the build is unaffected.
- If only one email variable is set (or `CONTACT_EMAIL` is invalid), the endpoint logs the problem and returns 503.
- In production the contact endpoint **fails closed**: if email is configured but Upstash Redis is missing, misconfigured or unreachable, it returns 503 rather than sending unthrottled email. Outside production, rate limiting is skipped when Redis is not configured.

### Contact API protections

`POST /api/contact` checks, in order: `Origin` matches the site (`NEXT_PUBLIC_SITE_URL` or the Vercel deployment URLs) → 403; `Content-Type: application/json` → 415; body ≤ 10 KB, enforced while streaming → 413; valid JSON → 400; honeypot field `website` empty (if filled, the endpoint returns a fake 200 without sending); Zod validation → 422; per-IP and daily rate limits → 429 with `Retry-After`. When building the contact form, render the `website` honeypot as a visually hidden input with `tabIndex={-1}` and `autoComplete="off"`, and send requests with `fetch` and a JSON body.

Before going live with email, verify a sending domain in Resend and replace the `onboarding@resend.dev` sender in `src/lib/email/send-contact-email.ts`.

## Testing

- **Unit** (`tests/unit`): utilities and the `PagePlaceholder` component.
- **Unit** also covers the contact request guards, rate limiter, server env parsing, email normalization, `FadeIn` (SSR visibility, hydration, reduced motion), mobile navigation and `robots.txt`.
- **Integration** (`tests/integration`): the contact route handler (success, validation, malformed JSON, oversized bodies, origin, honeypot, rate limiting, unconfigured email).
- **E2E** (`tests/e2e`): home page loads, desktop and mobile navigation work, unknown routes return 404 with the full site header/footer, and the contact API rejects cross-origin and oversized requests. Runs on desktop Chrome and a Pixel 7 viewport.

Vitest cannot render `async` Server Components; cover those with Playwright.

## Git workflow

1. Branch from `main`: `feature/<short-name>`, `fix/<short-name>` or `chore/<short-name>`.
2. Commit in small, focused steps. [Conventional Commits](https://www.conventionalcommits.org/) are recommended (`feat:`, `fix:`, `chore:` …).
3. The **pre-commit hook** runs lint-staged: ESLint `--fix` and Prettier on staged files.
4. Run `pnpm validate` before pushing.
5. Open a pull request into `main`. CI must pass before merging; Vercel posts a preview deployment for each PR.

## Continuous integration

`.github/workflows/ci.yml` runs on pushes and pull requests to `main`: install (frozen lockfile) → lint → format check → type-check → unit/integration tests → production build → Playwright E2E tests (reusing that build via `PLAYWRIGHT_SKIP_BUILD=1`). It uses a placeholder `NEXT_PUBLIC_SITE_URL` and no secrets. The Playwright HTML report is uploaded as an artifact when the job fails.

## Deployment (Vercel)

1. Import the GitHub repository in Vercel. The framework (Next.js) and pnpm (from `packageManager`) are detected automatically.
2. In **Settings → General**, set the Node.js version to **24.x**.
3. In **Settings → Environment Variables**, add `NEXT_PUBLIC_SITE_URL` (production domain) and, when ready, `RESEND_API_KEY` and `CONTACT_EMAIL`. Enabling email in production also requires Upstash Redis: add it from the Vercel Marketplace (injects `KV_REST_API_*`) or set `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`.
4. Pushes to `main` deploy to production; pull requests get preview deployments.
5. After adding a custom domain, update `NEXT_PUBLIC_SITE_URL` and redeploy so canonical URLs and the sitemap use it.

## Pending setup

- Replace placeholders in `src/data/*` and `src/lib/constants.ts` (site name, title, description, social links).
- Add a default Open Graph image at `src/app/opengraph-image.png` (1200×630) and a real favicon.
- Implement page designs and sections from the Google Stitch UX designs.
- Build the contact form (React Hook Form + `contactFormSchema`) and add rate limiting or bot protection to `/api/contact` before enabling email.
- Optional: dark-mode toggle, analytics, E2E job in CI.
