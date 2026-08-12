import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/shared/reveal";
import { ApplicationForm } from "@/components/shared/application-form";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";
import { getJobBySlug, getJobOpenings } from "@/lib/db/content";
import { getSiteConfig } from "@/lib/db/settings";

/** See the note in `services/[slug]/page.tsx` — builds must survive no DB. */
export const dynamicParams = true;

export async function generateStaticParams() {
  const jobs = await getJobOpenings();
  return jobs.map((job) => ({ slug: job.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [job, siteConfig] = await Promise.all([getJobBySlug(slug), getSiteConfig()]);
  if (!job) return {};

  return {
    title: job.title,
    description: job.description,
    alternates: { canonical: `/careers/${job.slug}` },
    openGraph: {
      title: `${job.title} | Careers at ${siteConfig.name}`,
      description: job.description,
      url: `${siteConfig.url}/careers/${job.slug}`,
    },
  };
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  if (!job) notFound();

  const breadcrumb = await breadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Careers", url: "/careers" },
    { name: job.title, url: `/careers/${job.slug}` },
  ]);

  return (
    <>
      <JsonLd data={breadcrumb} />

      <section className="section-pad">
        <div className="container-brand grid grid-cols-1 gap-14 lg:grid-cols-[1fr_1.2fr]">
          <Reveal>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{job.department}</Badge>
              <Badge variant="secondary">{job.location}</Badge>
              <Badge variant="secondary">{job.type}</Badge>
            </div>
            <h1 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {job.title}
            </h1>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              {job.description}
            </p>

            <h2 className="mt-8 text-base font-semibold text-foreground">
              What we&apos;re looking for
            </h2>
            <ul className="mt-4 flex flex-col gap-3">
              {job.requirements.map((requirement) => (
                <li key={requirement} className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span className="text-sm leading-relaxed text-muted-foreground">
                    {requirement}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1} className="rounded-3xl border border-border bg-card p-6 sm:p-8">
            <h2 className="mb-6 text-lg font-semibold text-foreground">Apply for this role</h2>
            <ApplicationForm jobSlug={job.slug} jobTitle={job.title} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
