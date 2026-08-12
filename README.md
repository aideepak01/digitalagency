This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Database

All site content and every form submission live in PostgreSQL. There is no
hardcoded content: the former `src/data/*.ts` modules were migrated into the
database and deleted (their exact contents are preserved in `db/seed-data.json`,
which the seed script loads).

First-time setup:

```bash
cp .env.example .env.local   # fill in DATABASE_URL and AUTH_SECRET at minimum
npm run db:migrate           # apply ./drizzle migrations
npm run db:seed              # load db/seed-data.json
npm run db:create-admin -- you@sbabuai.com 'a-long-password' 'Your Name'
```

Then sign in at `/admin` to edit content and read submissions.

- **Schema** — `src/lib/db/schema.ts`. After changing it run `npm run db:generate`
  to emit SQL into `./drizzle`, then `npm run db:migrate` to apply it.
- **Reads** — `src/lib/db/content.ts` and `src/lib/db/settings.ts`. Every read
  goes through `safeQuery`, which returns an empty result if the database is
  unreachable rather than throwing. That is what lets `npm run build` succeed in
  CI, where no `DATABASE_URL` exists. **A build with no database prerenders empty
  pages** — fine for CI, fatal if it ever happened on the production host.
- **Writes** — form endpoints under `src/app/api/`, admin mutations in
  `src/lib/admin/actions.ts`. These use `query`, which throws, because silently
  swallowing a failed write would lose a customer.
- **Rendering** — public pages are static with `revalidate = 300`; admin
  mutations call `revalidatePath`, so edits appear without waiting for it.

Two things cannot live in the database and must not be moved there:

- **Icons** are React components. Content rows store an `iconName` resolved
  through the explicit registry in `src/lib/icons.ts`.
- **Cover gradients** are Tailwind class strings. Tailwind only emits classes it
  finds in source files, so a class stored solely in a database row renders
  unstyled. Rows store a *key* resolved through `src/lib/gradients.ts`.

## Deploying

Production runs as a Hostinger hPanel Node.js app that pulls `main` and builds in
place.

**Migrations do not run automatically.** The webhook only pulls and builds, and
`prebuild`/`postbuild` are reserved for `retain-static.mjs`. After deploying a
release that changes the schema, run `npm run db:migrate` once from the hPanel
Node.js console. Deliberately manual: an automatic migration inside a deploy that
can be retried is a good way to half-apply one.

Environment variables are set in hPanel, not committed — see `.env.example`.
`UPLOAD_DIR` in particular must point outside the repository, because the deploy
rebuilds the project tree in place and would otherwise wipe stored résumés.

Three pieces of the deploy setup exist to stop a release from breaking live
pages, and all should stay:

- **`headers()` in `next.config.mjs`** caps how long the CDN may hold a page's
  HTML (`s-maxage=60`). Next otherwise sends `s-maxage=31536000` for prerendered
  pages, which let Hostinger's CDN serve a deploy's HTML for a year.
- **`scripts/retain-static.mjs`** (npm `prebuild`/`postbuild`) carries the last two
  builds' hashed assets into `.next/static`, so HTML cached anywhere — the CDN, a
  visitor's open tab — can still load the chunks it was built against.
- **`api/` is excluded from that same `headers()` matcher.** Form submissions and
  admin reads must never be held by a CDN; the route handlers set their own
  `no-store`.

Without the first two, cached HTML requests chunk filenames the newest build no
longer emits; the 404 kills hydration and every visitor gets Next's "a
client-side exception has occurred" page.

Changing the domain is now an admin edit: **Site settings → Site URL**. Canonical
tags, Open Graph, JSON-LD, `robots.txt`, and the sitemap all derive from it.
`NEXT_PUBLIC_SITE_URL` is only a fallback for when the database is unreachable.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
