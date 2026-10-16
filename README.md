# Kora Kaagaz — web

Marketing site for Kora Kaagaz. The site is **The Broadsheet**: the studio portfolio set as a
newspaper, with a 3D ink roller that prints the front page as you scroll. It is a static bundle
exported from Claude Design, served at `/` by a thin Next.js 16 app that also handles `robots.txt`,
`sitemap.xml`, 404s and preview noindex.

The previous design (a Next.js/React component site) is preserved at git tag **`v1-classic`**.

## Requirements

- **Node.js ≥ 20.9** (Next 16 minimum)
- **pnpm 10.15** — pinned via `packageManager`; run `corepack enable` once and the right version is used automatically

## Getting started

```bash
corepack enable
pnpm install
pnpm dev                     # http://localhost:3000
```

| Script           | What it does                 |
| ---------------- | ---------------------------- |
| `pnpm dev`       | Dev server                   |
| `pnpm build`     | Production build             |
| `pnpm start`     | Serve the production build   |
| `pnpm lint`      | ESLint                       |
| `pnpm typecheck` | TypeScript, no emit          |

## How the site is served

- `public/broadsheet/index.html`: the whole page (about 1.3 MB: fonts, runtime, React loader and
  the front page's photos, inlined).
- `public/broadsheet/img/`: 78 WebP portfolio images, lazy-loaded with blurred previews.
- `next.config.ts` rewrites `/` → `/broadsheet/index.html` and `/img/*` → `/broadsheet/img/*`
  (the page requests its images by the relative path `img/<name>.webp`).

To preview the bundle without Next, serve `public/broadsheet/` with any static server, e.g.
`python3 -m http.server 8765 --directory public/broadsheet`.

### Editing content

`index.html` unpacks two JSON blocks at load time:

- `<script type="__bundler/manifest">` maps each asset uuid to base64 data (fonts, runtime, React,
  front-page photos).
- `<script type="__bundler/template">` holds the page as a JSON string: markup with `{{ }}`
  bindings and a `Component` class with the data (`SITES`, `DECKS`, `CAMPAIGNS`, `MERCH`,
  `GALLERIES`, `WORK`) and the scroll and lightbox logic.

To change content, decode the template JSON, edit it, and encode it back. To add an image, drop a
WebP into `public/broadsheet/img/` and add an entry to the template's `ASSETS` map (path, size and
a tiny `lq` preview).

## Enquiries

The Reply form (Classifieds, P. 09) posts JSON to `app/api/enquiry/route.ts`, which validates it
and emails it to the studio inbox through Google Workspace SMTP (`smtp.gmail.com`), with the
visitor's address as Reply-To. If sending fails, the form shows an error with the studio address.
The Back page's Contact column also links `team@korakaagaz.co`.

## Environment variables

| Variable     | Required | Notes                                                                  |
| ------------ | -------- | ---------------------------------------------------------------------- |
| `SMTP_USER`  | Yes      | Workspace account that sends enquiries, `team@korakaagaz.co`           |
| `SMTP_PASS`  | Yes      | A Google **app password** for `SMTP_USER` (needs 2-Step Verification)  |
| `ENQUIRY_TO` | No       | Deliver to a different inbox; defaults to `SMTP_USER`                  |

Without `SMTP_USER`/`SMTP_PASS` the form answers "Enquiries are not set up yet."

`VERCEL_ENV` is set by Vercel: only `production` deployments are indexable; every other environment
(previews, `dev`) serves a `disallow` robots.txt and an `X-Robots-Tag: noindex` header.

## Branches & deployment

| Branch      | Purpose                         | Deploys to                         |
| ----------- | ------------------------------- | ---------------------------------- |
| `main`      | Production                      | korakaagaz.co                      |
| `dev`       | Integration / staging           | Vercel preview (staging domain)    |
| `feature/*` | Short-lived work                | Per-branch Vercel preview URL      |

Workflow: branch from `dev` → PR into `dev` → review on the preview/staging URL → PR `dev` → `main`
to release. CI (`.github/workflows/ci.yml`) runs lint, typecheck and build on every PR and push to
`main`/`dev`.
