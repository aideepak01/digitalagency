/**
 * Carries the previous deploy's hashed assets forward into the new build.
 *
 * Hostinger's hPanel Node.js app builds in place, so `next build` wipes
 * `.next/static` and writes freshly hashed chunks. Any HTML still cached at the
 * CDN edge — or already sitting in a visitor's tab — keeps requesting the old
 * chunk names, gets a 404, and React dies during hydration with the
 * "a client-side exception has occurred" error page.
 *
 * `next build` deletes everything in `.next` except `cache`
 * (see `recursiveDelete(distDir, /^cache/)` in next/dist/build/index.js), so
 * `stash` parks the outgoing assets there before the build and `restore` merges
 * them back afterwards. Chunk filenames are content-hashed, so merging can only
 * ever add names the new build didn't produce — it never shadows a new file.
 *
 * Wired up as npm `prebuild` / `postbuild`. Never fails the build: a deploy that
 * skips retention is still a working deploy, just one with a brief window where
 * stale HTML breaks.
 */
import { existsSync } from "node:fs";
import { cp, mkdir, readdir, readFile, rm } from "node:fs/promises";
import path from "node:path";

/** How many previous builds to keep. Two covers a rollback or a quick re-deploy. */
const KEEP = 2;

const distDir = path.resolve(".next");
const staticDir = path.join(distDir, "static");
const stashRoot = path.join(distDir, "cache", "retained-static");

/** Newest first — names are `<epoch-ms>-<buildId>`, so lexical sort is chronological. */
async function stashes() {
  if (!existsSync(stashRoot)) return [];
  const entries = await readdir(stashRoot, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()
    .reverse();
}

async function stash() {
  if (!existsSync(staticDir)) return "no previous build to retain";

  const buildId = existsSync(path.join(distDir, "BUILD_ID"))
    ? (await readFile(path.join(distDir, "BUILD_ID"), "utf8")).trim()
    : "unknown";

  const existing = await stashes();
  if (existing.some((name) => name.endsWith(`-${buildId}`))) {
    return `build ${buildId} already retained`;
  }

  await mkdir(stashRoot, { recursive: true });
  await cp(staticDir, path.join(stashRoot, `${Date.now()}-${buildId}`), {
    recursive: true,
  });

  const stale = (await stashes()).slice(KEEP);
  await Promise.all(
    stale.map((name) => rm(path.join(stashRoot, name), { recursive: true, force: true }))
  );

  return `retained build ${buildId}${stale.length ? `, pruned ${stale.length}` : ""}`;
}

async function restore() {
  const retained = await stashes();
  if (retained.length === 0) return "nothing retained";

  for (const name of retained) {
    // force:false leaves the new build's files untouched and copies only the
    // names it no longer emits, so older stashes can't clobber newer assets.
    await cp(path.join(stashRoot, name), staticDir, {
      recursive: true,
      force: false,
      errorOnExist: false,
    });
  }

  return `merged ${retained.length} previous build(s) into .next/static`;
}

const mode = process.argv[2];

// CI builds only verify that the app compiles — nothing serves their output, and
// stashing there would push dead assets into the shared `.next/cache` key.
if (process.env.CI) {
  console.log(`retain-static (${mode}): skipped on CI`);
  process.exit(0);
}

try {
  const result = mode === "stash" ? await stash() : mode === "restore" ? await restore() : null;
  if (result === null) {
    console.error("retain-static: expected `stash` or `restore`");
    process.exit(1);
  }
  console.log(`retain-static (${mode}): ${result}`);
} catch (error) {
  console.warn(`retain-static (${mode}) skipped:`, error.message);
}
