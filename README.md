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

## Deploying

Production runs as a Hostinger hPanel Node.js app that pulls `main` and builds in
place. Two pieces of that setup exist to stop a deploy from breaking live pages,
and both should stay:

- **`headers()` in `next.config.mjs`** caps how long the CDN may hold a page's
  HTML (`s-maxage=60`). Next otherwise sends `s-maxage=31536000` for prerendered
  pages, which let Hostinger's CDN serve a deploy's HTML for a year.
- **`scripts/retain-static.mjs`** (npm `prebuild`/`postbuild`) carries the last two
  builds' hashed assets into `.next/static`, so HTML cached anywhere — the CDN, a
  visitor's open tab — can still load the chunks it was built against.

Without them, cached HTML requests chunk filenames the newest build no longer
emits; the 404 kills hydration and every visitor gets Next's "a client-side
exception has occurred" page.

Changing the domain means editing `url` in `src/data/site.ts` — canonical tags,
Open Graph, JSON-LD, `robots.txt`, and the sitemap all derive from it.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
