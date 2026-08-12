"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Award,
  Briefcase,
  BriefcaseBusiness,
  Building2,
  CircleHelp,
  Cpu,
  ExternalLink,
  FileText,
  GitBranch,
  Heart,
  Inbox,
  Layers,
  LayoutDashboard,
  LogOut,
  Menu,
  PanelBottom,
  Quote,
  Settings,
  Tags,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Admin navigation.
 *
 * A client component purely so it can read `usePathname` — without it there is
 * no active-route highlighting, and in a sidebar of twenty-plus links that is
 * the difference between navigable and disorienting. It receives plain
 * serialisable props: the collection registry cannot cross to the client
 * because it holds Drizzle table objects.
 */

/** Icons are addressed by name for the same reason content icons are. */
const navIcons: Record<string, LucideIcon> = {
  Award,
  Briefcase,
  BriefcaseBusiness,
  Building2,
  CircleHelp,
  Cpu,
  FileText,
  GitBranch,
  Heart,
  Inbox,
  Layers,
  LayoutDashboard,
  Menu,
  PanelBottom,
  Quote,
  Settings,
  Tags,
  Users,
};

export interface NavItem {
  href: string;
  label: string;
  icon: string;
  /** Unread count; rendered as a badge when above zero. */
  badge?: number;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export function AdminSidebar({
  email,
  name,
  groups,
  totalUnread,
}: {
  email: string;
  name: string;
  groups: NavGroup[];
  totalUnread: number;
}) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  // Navigating should dismiss the mobile drawer; without this it stays open
  // over the page you just asked for.
  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile top bar. The full sidebar as a stacked block pushed content
          hundreds of pixels down the page on a phone. */}
      <div className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border bg-background/95 px-4 py-3 backdrop-blur lg:hidden">
        <Link href="/admin" className="flex items-center gap-2 text-sm font-semibold">
          <span className="flex size-7 items-center justify-center rounded-lg bg-gradient-brand text-white">
            <LayoutDashboard className="size-4" />
          </span>
          Sbabu AI Admin
        </Link>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setOpen((current) => !current)}
          aria-expanded={open}
          aria-controls="admin-nav"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="size-4" /> : <Menu className="size-4" />}
          {totalUnread > 0 && !open && (
            <span className="ml-1 rounded-full bg-primary px-1.5 text-xs font-medium text-primary-foreground">
              {totalUnread}
            </span>
          )}
        </Button>
      </div>

      <aside
        id="admin-nav"
        className={cn(
          "shrink-0 flex-col gap-6 border-border bg-muted/30 p-4 lg:flex lg:h-screen lg:w-64 lg:sticky lg:top-0 lg:overflow-y-auto lg:border-r",
          open ? "flex border-b" : "hidden",
        )}
      >
        <div className="hidden lg:block">
          <Link href="/admin" className="flex items-center gap-2 text-sm font-semibold">
            <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-brand text-white">
              <LayoutDashboard className="size-4" />
            </span>
            Sbabu AI Admin
          </Link>
        </div>

        <nav className="flex flex-col gap-5 text-sm">
          {groups.map((group) => (
            <div key={group.label} className="flex flex-col gap-0.5">
              {group.label && (
                <p className="mb-1 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                  {group.label}
                </p>
              )}
              {group.items.map((item) => (
                <SidebarLink key={item.href} item={item} pathname={pathname} />
              ))}
            </div>
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-3 border-t border-border pt-4">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-3 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <ExternalLink className="size-3.5" /> View live site
          </a>

          <div className="px-3">
            <p className="truncate text-xs font-medium text-foreground">{name || "Signed in"}</p>
            <p className="truncate text-xs text-muted-foreground">{email}</p>
          </div>

          <form action="/admin/logout" method="post">
            <Button type="submit" variant="outline" size="sm" className="w-full">
              <LogOut className="size-4" /> Sign out
            </Button>
          </form>
        </div>
      </aside>
    </>
  );
}

function SidebarLink({ item, pathname }: { item: NavItem; pathname: string }) {
  const Icon = navIcons[item.icon] ?? LayoutDashboard;

  // Match the exact route or a descendant of it, and require a "/" boundary on
  // the descendant test: a bare startsWith lights up "Blog posts" whenever
  // "Blog categories" is open, since /admin/collections/blog is a string prefix
  // of /admin/collections/blog-categories. The dashboard is exact-only because
  // every admin route is a descendant of /admin.
  const active =
    item.href === "/admin"
      ? pathname === "/admin"
      : pathname === item.href || pathname.startsWith(`${item.href}/`);

  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-2.5 rounded-lg px-3 py-2 transition-colors",
        active
          ? "bg-primary/10 font-medium text-primary"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      <Icon className={cn("size-4 shrink-0", active && "text-primary")} />
      <span className="truncate">{item.label}</span>
      {item.badge ? (
        <span
          className={cn(
            "ml-auto rounded-full px-1.5 py-0.5 text-[11px] font-medium tabular-nums",
            active ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary",
          )}
        >
          {item.badge}
        </span>
      ) : null}
    </Link>
  );
}
