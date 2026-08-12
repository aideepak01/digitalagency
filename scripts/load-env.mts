/**
 * Standalone scripts do not go through Next's env loading, so read `.env.local`
 * then `.env` the same way Next does (first file to define a key wins).
 */
import { existsSync } from "node:fs";
import { resolve } from "node:path";

export function loadEnv(): void {
  for (const file of [".env.local", ".env"]) {
    const path = resolve(process.cwd(), file);
    if (!existsSync(path)) continue;
    try {
      process.loadEnvFile(path);
    } catch {
      // Throws only if the file cannot be read or parsed. Keys already set —
      // by an earlier file or by the real environment — are left alone, which
      // is exactly the precedence we want.
    }
  }
}
