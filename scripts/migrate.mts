/**
 * Applies pending SQL migrations from ./drizzle.
 *
 * Uses drizzle-orm's runtime migrator (a production dependency) rather than the
 * drizzle-kit CLI, so this works on Hostinger where only the app's own
 * dependencies are guaranteed to be installed.
 *
 * Run: npm run db:migrate
 */
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";

import { loadEnv } from "./load-env.mjs";

loadEnv();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is not set — nothing to migrate.");
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  max: 1,
  ssl: /sslmode=(disable|off)/.test(connectionString) ? false : { rejectUnauthorized: false },
});

try {
  await migrate(drizzle(pool), { migrationsFolder: "./drizzle" });
  console.log("Migrations applied.");
} catch (error) {
  console.error("Migration failed:", error);
  process.exitCode = 1;
} finally {
  await pool.end();
}
