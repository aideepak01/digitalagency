"use client";

import { useActionState } from "react";
import { AlertCircle, CheckCircle2, Loader2, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { saveSiteSettings, type ActionState } from "@/lib/admin/actions";
import type { SiteConfig } from "@/types";

const socialNetworks = ["twitter", "linkedin", "github", "instagram", "dribbble"] as const;

export function SettingsForm({ settings }: { settings: SiteConfig }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(saveSiteSettings, {
    ok: false,
    message: "",
  });

  return (
    <form action={formAction} className="flex max-w-3xl flex-col gap-8">
      <Section title="Identity">
        <TextField name="name" label="Site name" value={settings.name} />
        <TextField name="legalName" label="Legal name" value={settings.legalName} />
        <TextField name="tagline" label="Tagline" value={settings.tagline} />
        <AreaField name="description" label="Description" value={settings.description} />
        <TextField
          name="url"
          label="Site URL"
          value={settings.url}
          error={state.fieldErrors?.url}
          help="Canonical tags, Open Graph, JSON-LD, robots.txt, and the sitemap all derive from this."
        />
        <TextField name="ogImage" label="OG image path" value={settings.ogImage} />
        <TextField name="founded" label="Founded" value={settings.founded} />
      </Section>

      <Section title="Contact">
        <TextField name="email" label="Primary email" value={settings.email} />
        <TextField
          name="salesEmail"
          label="Sales email"
          value={settings.salesEmail}
          help="Form notifications are sent here unless NOTIFICATION_EMAIL overrides it."
        />
        <TextField name="phone" label="Phone" value={settings.phone} />
        <TextField name="whatsapp" label="WhatsApp number" value={settings.whatsapp} />
      </Section>

      <Section title="Address">
        <TextField name="address.street" label="Street" value={settings.address.street} />
        <TextField name="address.city" label="City" value={settings.address.city} />
        <TextField name="address.state" label="State" value={settings.address.state} />
        <TextField name="address.zip" label="Postcode" value={settings.address.zip} />
        <TextField name="address.country" label="Country" value={settings.address.country} />
        <TextField name="address.full" label="Full address" value={settings.address.full} />
      </Section>

      <Section title="Social">
        {socialNetworks.map((network) => (
          <TextField
            key={network}
            name={`social.${network}`}
            label={network[0].toUpperCase() + network.slice(1)}
            value={settings.social[network] ?? ""}
            help="Leave blank to hide this icon."
          />
        ))}
      </Section>

      <Section title="Stats">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="stats">Homepage stats</Label>
          <Textarea
            id="stats"
            name="stats"
            rows={8}
            defaultValue={JSON.stringify(settings.stats, null, 2)}
            className="font-mono text-xs"
          />
          <p className="text-xs text-muted-foreground">
            JSON list of {`{ "label", "value", "suffix" }`} objects.
          </p>
        </div>
      </Section>

      {state.message && (
        <p
          role="alert"
          className={`flex items-start gap-2 rounded-xl border px-4 py-3 text-sm ${
            state.ok
              ? "border-primary/30 bg-primary/5 text-primary"
              : "border-destructive/30 bg-destructive/5 text-destructive"
          }`}
        >
          {state.ok ? (
            <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
          ) : (
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
          )}
          {state.message}
        </p>
      )}

      <Button
        type="submit"
        disabled={pending}
        className="w-fit rounded-full bg-gradient-brand text-white hover:opacity-90"
      >
        {pending ? (
          <>
            <Loader2 className="size-4 animate-spin" /> Saving...
          </>
        ) : (
          <>
            <Save className="size-4" /> Save settings
          </>
        )}
      </Button>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h2>
      {children}
    </section>
  );
}

function TextField({
  name,
  label,
  value,
  help,
  error,
}: {
  name: string;
  label: string;
  value: string;
  help?: string;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} defaultValue={value} />
      {help && <p className="text-xs text-muted-foreground">{help}</p>}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function AreaField({ name, label, value }: { name: string; label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={name}>{label}</Label>
      <Textarea id={name} name={name} rows={4} defaultValue={value} />
    </div>
  );
}
