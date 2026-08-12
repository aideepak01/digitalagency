import type { Metadata } from "next";

import { AdminSidebar, type NavGroup } from "@/components/admin/admin-sidebar";
import { getSession } from "@/lib/auth";
import { collections, type CollectionGroup } from "@/lib/admin/collections";
import { leadTypes } from "@/lib/admin/leads";
import { leadStats } from "@/lib/admin/stats";

/**
 * The admin reads and writes live data on every request — never prerender it,
 * and keep it out of search results.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

const groupLabels: Record<CollectionGroup, string> = {
  pages: "Pages",
  sections: "Site sections",
  structure: "Structure",
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  // The login page lives under /admin too, so render it without the chrome
  // rather than giving it a separate route tree.
  if (!session) {
    return <>{children}</>;
  }

  // One aggregate query drives every unread badge in the sidebar.
  const stats = await leadStats();
  const unreadByKey = new Map(stats.map((stat) => [stat.key, stat.unread]));
  const totalUnread = stats.reduce((sum, stat) => sum + stat.unread, 0);

  const groups: NavGroup[] = [
    {
      label: "",
      items: [{ href: "/admin", label: "Dashboard", icon: "LayoutDashboard" }],
    },
    {
      label: "Submissions",
      items: leadTypes.map((lead) => ({
        href: `/admin/leads/${lead.key}`,
        label: lead.label,
        icon: "Inbox",
        badge: unreadByKey.get(lead.key) ?? 0,
      })),
    },
    ...(["pages", "sections", "structure"] as CollectionGroup[]).map((group) => ({
      label: groupLabels[group],
      items: collections
        .filter((collection) => collection.group === group)
        .map((collection) => ({
          href: `/admin/collections/${collection.key}`,
          label: collection.label,
          icon: collection.icon,
        })),
    })),
    {
      label: "Configuration",
      items: [{ href: "/admin/settings", label: "Site settings", icon: "Settings" }],
    },
  ];

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <AdminSidebar
        email={session.email}
        name={session.name}
        groups={groups}
        totalUnread={totalUnread}
      />
      <main className="min-w-0 flex-1 p-5 sm:p-6 lg:p-10">{children}</main>
    </div>
  );
}
