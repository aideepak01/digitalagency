import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { JsonLd, organizationSchema, websiteSchema } from "@/lib/schema";
import { getIndustries, getServices } from "@/lib/db/content";
import { getNavLinks } from "@/lib/db/settings";

/**
 * Public site shell.
 *
 * Content is served from Postgres but still rendered statically and refreshed
 * on an interval, rather than queried on every request: this is a marketing
 * site, and a database blip should not take pages down. Admin mutations call
 * `revalidatePath`, so edits appear without waiting for the window to lapse.
 */
export const revalidate = 300;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  // The navbar is a client component and cannot query the database itself, so
  // its menus are read here and passed down as plain serialisable values.
  const [navLinks, services, industries, organization, website] = await Promise.all([
    getNavLinks(),
    getServices(),
    getIndustries(),
    organizationSchema(),
    websiteSchema(),
  ]);

  return (
    <>
      <JsonLd data={organization} />
      <JsonLd data={website} />
      <Navbar
        navLinks={navLinks}
        services={services.map((service) => ({
          slug: service.slug,
          shortName: service.shortName,
          tagline: service.tagline,
          iconName: service.iconName,
        }))}
        industries={industries.map((industry) => ({
          slug: industry.slug,
          name: industry.name,
          iconName: industry.iconName,
        }))}
        totalServices={services.length}
      />
      <main className="flex-1 pt-[76px]">{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
