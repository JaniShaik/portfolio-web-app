# CLAUDE.md

## Project

Personal portfolio Next.js application for Jani Shaik.

- Next.js 16 App Router, Cache Components, partial prefetching
- React 19.3 and TypeScript 5 strict mode
- Tailwind CSS 4 with CSS-first design tokens
- Base UI/shadcn components
- pnpm 12 and Node.js 24+
- Vitest/React Testing Library and Playwright

## Commands

- `pnpm dev` — start the development server
- `pnpm lint` / `pnpm lint:fix` — ESLint checks/fixes
- `pnpm format:check` / `pnpm format` — Prettier checks/changes
- `pnpm typecheck` — generate Next route types and run TypeScript
- `pnpm test` — run unit/integration tests
- `pnpm test:e2e` — run Playwright tests
- `pnpm build` — create a production build
- `pnpm validate` — run lint, formatting, typecheck, tests, and build

## Architecture

- `src/app/` — routing, layouts, metadata, and route handlers
- `src/components/layout/` — header, footer, and navigation
- `src/components/sections/` — page-specific section components
- `src/components/shared/` — reusable site-level building blocks
- `src/components/ui/` — shadcn/Base UI primitives
- `src/data/` — typed static content and navigation data
- `src/content/` — MDX projects, articles, and experience
- `src/lib/` — utilities, SEO, environment, validation, and integrations
- `src/types/` — shared domain types
- `tests/unit/`, `tests/integration/`, `tests/e2e/` — test suites

## Conventions

- Prefer Server Components; add `"use client"` only for interactivity.
- Keep routing in `src/app/`, content in `src/data/` or `src/content/`, presentation in `src/components/`, and logic/integrations in `src/lib/`.
- Use kebab-case filenames, PascalCase components, camelCase utilities, and `useCamelCase` hooks.
- Use named exports for reusable code; use default exports only where Next.js requires them.
- Never use `any`; use explicit types and type-only imports where appropriate.
- Keep `noUncheckedIndexedAccess` and strict TypeScript behavior in mind.
- Read the relevant bundled guide in `node_modules/next/dist/docs/` before changing Next.js APIs or cache behavior.
- Update design tokens in `src/app/globals.css` before restyling components.
- Never commit real environment secrets; use `.env.local` and the variables documented in `README.md`.
- Run focused tests while developing, then `pnpm validate` before completing significant changes.

## Next.js 16

This project uses a Next.js version newer than common training examples. Follow `AGENTS.md` and verify framework APIs against the installed bundled documentation. Cache Components and partial prefetching are enabled in `next.config.ts`; wrap dynamic request-dependent rendering in Suspense or cache it intentionally.

## Git Workflow

- Branch names: `feature/<short-name>`, `fix/<short-name>`, or `chore/<short-name>`.
- Use focused changes and Conventional Commit prefixes such as `feat:`, `fix:`, `chore:`, or `docs:`.
- The pre-commit hook runs lint-staged; run `pnpm validate` before pushing.
