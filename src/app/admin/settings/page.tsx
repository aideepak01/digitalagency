import { getSiteConfig } from "@/lib/db/settings";

import { SettingsForm } from "./settings-form";

export default async function AdminSettingsPage() {
  const settings = await getSiteConfig();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Site settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          These values feed the header, footer, metadata, and structured data on every page.
        </p>
      </div>

      <SettingsForm settings={settings} />
    </div>
  );
}
