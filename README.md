# Kora Kaagaz — web

Marketing site for Kora Kaagaz, built with Next.js 16 (App Router), React 19 and Tailwind CSS 4.

## Requirements

- **Node.js ≥ 20.9** (Next 16 minimum)
- **pnpm 10.15** — pinned via `packageManager`; run `corepack enable` once and the right version is used automatically

## Getting started

```bash
corepack enable
pnpm install
cp .env.example .env.local   # then fill in values
pnpm dev                     # http://localhost:3000
```

| Script           | What it does                 |
| ---------------- | ---------------------------- |
| `pnpm dev`       | Dev server                   |
| `pnpm build`     | Production build             |
| `pnpm start`     | Serve the production build   |
| `pnpm lint`      | ESLint                       |
| `pnpm typecheck` | TypeScript, no emit          |

## Environment variables

All variables are `NEXT_PUBLIC_*`, so they are **inlined at build time** — after changing one in
Vercel, redeploy. See `.env.example` for the full list; they are read in `lib/config.ts`.

| Variable                                   | Required | Notes                                                            |
| ------------------------------------------ | -------- | ---------------------------------------------------------------- |
| `NEXT_PUBLIC_STUDIO_EMAIL`                 | Yes      | Contact form falls back to a `mailto:` to this address           |
| `NEXT_PUBLIC_FORM_ENDPOINT`                | No       | If set, the contact form POSTs JSON here instead                 |
| `NEXT_PUBLIC_INSTAGRAM_URL` / `_LINKEDIN_URL` / `_BEHANCE_URL` | No | Social links                                     |
| `NEXT_PUBLIC_HERO_FIELD`, `NEXT_PUBLIC_CURSOR_STYLE`, `NEXT_PUBLIC_CUSTOM_CURSOR`, `NEXT_PUBLIC_INTRO`, `NEXT_PUBLIC_MOTION`, `NEXT_PUBLIC_SCRIPT_ACCENT` | No | Visual toggles; defaults in `lib/config.ts` |

`VERCEL_ENV` is set by Vercel. Only `production` deployments are indexable; every other environment
(previews, `dev`) serves a `disallow` robots.txt and `noindex` meta tag.

## Branches & deployment

| Branch      | Purpose                         | Deploys to                         |
| ----------- | ------------------------------- | ---------------------------------- |
| `main`      | Production                      | korakaagaz.co                      |
| `dev`       | Integration / staging           | Vercel preview (staging domain)    |
| `feature/*` | Short-lived work                | Per-branch Vercel preview URL      |

Workflow: branch from `dev` → PR into `dev` → review on the preview/staging URL → PR `dev` → `main`
to release. CI (`.github/workflows/ci.yml`) runs lint, typecheck and build on every PR and push to
`main`/`dev`.
