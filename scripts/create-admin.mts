/**
 * Creates or updates an admin user.
 *
 * Run: npm run db:create-admin -- <email> <password> [name]
 * or set ADMIN_EMAIL / ADMIN_PASSWORD / ADMIN_NAME in the environment.
 */
import bcrypt from "bcryptjs";
import { drizzle } from "drizzle-orm/node-postgres";
import { sql } from "drizzle-orm";
import { Pool } from "pg";

import * as schema from "../src/lib/db/schema";
import { loadEnv } from "./load-env.mjs";

loadEnv();

const [argEmail, argPassword, argName] = process.argv.slice(2);
const email = (argEmail ?? process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
const password = argPassword ?? process.env.ADMIN_PASSWORD ?? "";
const name = argName ?? process.env.ADMIN_NAME ?? "Administrator";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}
if (!email || !password) {
  console.error("Usage: npm run db:create-admin -- <email> <password> [name]");
  process.exit(1);
}
if (password.length < 12) {
  console.error("Password must be at least 12 characters.");
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  max: 1,
  ssl: /sslmode=(disable|off)/.test(connectionString) ? false : { rejectUnauthorized: false },
});
const db = drizzle(pool, { schema });

try {
  const passwordHash = await bcrypt.hash(password, 12);
  await db
    .insert(schema.adminUsers)
    .values({ email, name, passwordHash })
    .onConflictDoUpdate({
      target: schema.adminUsers.email,
      set: { passwordHash, name, isActive: true, updatedAt: sql`now()` },
    });
  console.log(`Admin user ready: ${email}`);
} catch (error) {
  console.error("Failed to create admin user:", error);
  process.exitCode = 1;
} finally {
  await pool.end();
}
