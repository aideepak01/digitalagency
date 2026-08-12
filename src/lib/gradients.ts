/**
 * Cover gradients are stored in the database as *keys*, resolved here to
 * literal Tailwind class strings.
 *
 * Tailwind v4 generates utilities by scanning source files. A class that exists
 * only in a database row is never emitted, so a DB-driven
 * `className={`bg-gradient-to-br ${row.gradient}`}` renders with no gradient at
 * all. Keeping the class strings as literals in this file is what makes them
 * visible to the scanner.
 *
 * Adding a gradient: add an entry here (full literal string, no interpolation)
 * and it becomes selectable in the admin.
 */
export const gradients = {
  "violet-fuchsia-cyan": "from-violet-500 via-fuchsia-500 to-cyan-400",
  "cyan-sky-indigo": "from-cyan-400 via-sky-500 to-indigo-600",
  "emerald-teal-indigo": "from-emerald-400 via-teal-500 to-indigo-600",
  "amber-orange-rose": "from-amber-400 via-orange-500 to-rose-500",
  "rose-pink-violet": "from-rose-400 via-pink-500 to-violet-600",
  "indigo-violet-purple": "from-indigo-500 via-violet-500 to-purple-600",
  "yellow-amber-orange": "from-yellow-400 via-amber-500 to-orange-600",
} as const;

export type GradientKey = keyof typeof gradients;

export const gradientKeys = Object.keys(gradients) as GradientKey[];

export const DEFAULT_GRADIENT_KEY: GradientKey = "violet-fuchsia-cyan";

/** Resolves a stored gradient key to its Tailwind classes. */
export function getGradient(key: string | null | undefined): string {
  if (!key) return gradients[DEFAULT_GRADIENT_KEY];
  return gradients[key as GradientKey] ?? gradients[DEFAULT_GRADIENT_KEY];
}

export function isGradientKey(key: string): key is GradientKey {
  return key in gradients;
}

/** Reverse lookup, used by the seed to convert legacy class strings to keys. */
export function gradientKeyFromClasses(classes: string): GradientKey {
  const match = gradientKeys.find((key) => gradients[key] === classes);
  return match ?? DEFAULT_GRADIENT_KEY;
}
