import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "./schema";

export type Database = NodePgDatabase<typeof schema>;

/**
 * Production runs `next start` as a long-lived Hostinger Node app, so one pool
 * is created per process and reused. In dev, Next's HMR re-evaluates modules on
 * every edit, which would leak a new pool each time — hence the global cache.
 */
const globalForDb = globalThis as unknown as {
  __sbabuPool?: Pool;
  __sbabuDb?: Database;
};

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

function createPool(): Pool {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  return new Pool({
    connectionString,
    // Hostinger runs a small number of app instances against a managed
    // Postgres with a modest connection ceiling — keep the pool tight.
    max: Number(process.env.DATABASE_POOL_MAX ?? 5),
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
    // Managed providers (Neon/Supabase) terminate plain connections. Opt out
    // only when the URL explicitly disables SSL, e.g. a local dev database.
    ssl: /sslmode=(disable|off)/.test(connectionString) ? false : { rejectUnauthorized: false },
  });
}

export function getDb(): Database {
  if (!globalForDb.__sbabuDb) {
    const pool = createPool();
    // An idle client erroring out (provider restart, network blip) emits on the
    // pool; without a listener Node treats it as an unhandled error and exits.
    pool.on("error", (error) => {
      console.error("[db] idle client error:", error.message);
    });
    globalForDb.__sbabuPool = pool;
    globalForDb.__sbabuDb = drizzle(pool, { schema });
  }
  return globalForDb.__sbabuDb;
}

let warnedAboutMissingUrl = false;

/**
 * Runs a query, falling back to `fallback` if the database is unreachable or
 * unconfigured.
 *
 * This is what lets `npm run build` succeed in CI, where no DATABASE_URL
 * exists: content queries return empty results and the build still completes.
 * The Hostinger production build has a real DATABASE_URL and prerenders real
 * content, so degradation never reaches visitors.
 */
export async function safeQuery<T>(
  label: string,
  run: (db: Database) => Promise<T>,
  fallback: T,
): Promise<T> {
  if (!isDatabaseConfigured()) {
    if (!warnedAboutMissingUrl) {
      warnedAboutMissingUrl = true;
      console.warn(
        "[db] DATABASE_URL is not set — content queries return empty results. " +
          "This is expected during CI builds and fatal in production.",
      );
    }
    return fallback;
  }

  try {
    return await run(getDb());
  } catch (error) {
    console.error(`[db] query failed (${label}):`, error instanceof Error ? error.message : error);
    return fallback;
  }
}

/**
 * Like `safeQuery`, but rethrows. Use for writes (form submissions, admin
 * mutations) where silently swallowing a failure would lose data.
 */
export async function query<T>(run: (db: Database) => Promise<T>): Promise<T> {
  if (!isDatabaseConfigured()) {
    throw new Error("DATABASE_URL is not set");
  }
  return run(getDb());
}

export { schema };
