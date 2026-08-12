import {
  AppWindow,
  Atom,
  Bot,
  Building2,
  Cloud,
  Factory,
  GitBranch,
  Globe,
  GraduationCap,
  HardHat,
  HeartPulse,
  Home,
  Hotel,
  Landmark,
  Layers,
  LifeBuoy,
  MessageSquare,
  Palette,
  Plane,
  Rocket,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Triangle,
  Truck,
  Users,
  Webhook,
  Workflow,
  Wrench,
  type LucideIcon,
} from "lucide-react";

/**
 * Icons used to be React components stored directly in `src/data/*.ts`
 * (`icon: Bot`). A database cannot store a component, so content rows now carry
 * an `iconName` string that is resolved here.
 *
 * This registry is deliberately an explicit static map. Re-exporting all of
 * lucide-react, or resolving names through a dynamic `import()`, would either
 * pull thousands of icons into the bundle or turn every icon into a separate
 * network request.
 *
 * Adding an icon: import it above and add it here — then it becomes selectable
 * in the admin icon picker automatically.
 */
export const iconRegistry = {
  AppWindow,
  Atom,
  Bot,
  Building2,
  Cloud,
  Factory,
  GitBranch,
  Globe,
  GraduationCap,
  HardHat,
  HeartPulse,
  Home,
  Hotel,
  Landmark,
  Layers,
  LifeBuoy,
  MessageSquare,
  Palette,
  Plane,
  Rocket,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Triangle,
  Truck,
  Users,
  Webhook,
  Workflow,
  Wrench,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof iconRegistry;

export const iconNames = Object.keys(iconRegistry) as IconName[];

const FALLBACK_ICON: LucideIcon = Sparkles;

/** Resolves a stored icon name, falling back rather than crashing a page. */
export function getIcon(name: string | null | undefined): LucideIcon {
  if (!name) return FALLBACK_ICON;
  return iconRegistry[name as IconName] ?? FALLBACK_ICON;
}

export function isIconName(name: string): name is IconName {
  return name in iconRegistry;
}
