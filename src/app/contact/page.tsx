import type { Metadata } from "next";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { ContactForm } from "@/components/shared/contact-form";
import { ConsultationForm } from "@/components/shared/consultation-form";
import { QuoteForm } from "@/components/shared/quote-form";
import { Reveal } from "@/components/shared/reveal";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";
import {
  TwitterIcon,
  LinkedinIcon,
  GithubIcon,
  InstagramIcon,
  DribbbleIcon,
} from "@/components/icons/social-icons";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${siteConfig.name}. Send a message, book a free consultation, or request a project estimate.`,
  alternates: { canonical: "/contact" },
};

const socialLinks = [
  { href: siteConfig.social.twitter, icon: TwitterIcon, label: "Twitter" },
  { href: siteConfig.social.linkedin, icon: LinkedinIcon, label: "LinkedIn" },
  { href: siteConfig.social.github, icon: GithubIcon, label: "GitHub" },
  { href: siteConfig.social.instagram, icon: InstagramIcon, label: "Instagram" },
  { href: siteConfig.social.dribbble, icon: DribbbleIcon, label: "Dribbble" },
];

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Contact", url: "/contact" },
        ])}
      />

      <section className="section-pad pb-12">
        <div className="container-brand">
          <SectionHeading
            as="h1"
            eyebrow="Contact"
            title="Let's talk about your project"
            description="Whether you're ready to start or just exploring options, we'll respond within one business day."
          />
        </div>
      </section>

      <section className="pb-12">
        <div className="container-brand grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Mail, label: "Email us", value: siteConfig.email, href: `mailto:${siteConfig.email}` },
            { icon: Phone, label: "Call us", value: siteConfig.phone, href: `tel:${siteConfig.phone}` },
            {
              icon: MapPin,
              label: "Visit us",
              value: `${siteConfig.address.city}, ${siteConfig.address.state}`,
            },
            { icon: Clock, label: "Response time", value: "Within 1 business day" },
          ].map((item, index) => (
            <Reveal key={item.label} delay={index * 0.06}>
              <div className="flex h-full flex-col gap-3 rounded-2xl border border-border bg-card p-6">
                <span className="flex size-10 items-center justify-center rounded-lg bg-gradient-brand/10 text-primary">
                  <item.icon className="size-5" />
                </span>
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                {item.href ? (
                  <a href={item.href} className="text-sm text-muted-foreground hover:text-primary">
                    {item.value}
                  </a>
                ) : (
                  <p className="text-sm text-muted-foreground">{item.value}</p>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="message" className="scroll-mt-28 section-pad">
        <div className="container-brand grid grid-cols-1 gap-14 lg:grid-cols-[1fr_1.3fr]">
          <Reveal>
            <span className="text-sm font-semibold uppercase tracking-wide text-primary">
              General inquiry
            </span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
              Send us a message
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Have a question, partnership idea, or press inquiry? Drop us a note and we&apos;ll route
              it to the right person on our team.
            </p>
            <div className="mt-8 flex items-center gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <social.icon className="size-4" />
                </a>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.1} className="rounded-3xl border border-border bg-card p-6 sm:p-8">
            <ContactForm />
          </Reveal>
        </div>
      </section>

      <section id="consultation" className="scroll-mt-28 section-pad bg-muted/30">
        <div className="container-brand grid grid-cols-1 gap-14 lg:grid-cols-[1fr_1.3fr]">
          <Reveal>
            <span className="text-sm font-semibold uppercase tracking-wide text-primary">
              Free consultation
            </span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
              Book a free consultation
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Talk through your project with a senior member of our team — no sales pitch, just
              honest guidance on scope, approach, and timeline.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="rounded-3xl border border-border bg-card p-6 sm:p-8">
            <ConsultationForm />
          </Reveal>
        </div>
      </section>

      <section id="quote" className="scroll-mt-28 section-pad">
        <div className="container-brand grid grid-cols-1 gap-14 lg:grid-cols-[1fr_1.3fr]">
          <Reveal>
            <span className="text-sm font-semibold uppercase tracking-wide text-primary">
              Project estimate
            </span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
              Get a project estimate
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Share a few details about your project and we&apos;ll come back with a realistic scope,
              timeline, and budget range within two business days.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="rounded-3xl border border-border bg-card p-6 sm:p-8">
            <QuoteForm />
          </Reveal>
        </div>
      </section>

      <section className="section-pad bg-muted/30">
        <div className="container-brand">
          <SectionHeading eyebrow="Our office" title="Where to find us" />
          <Reveal delay={0.1} className="mt-12 grid grid-cols-1 overflow-hidden rounded-3xl border border-border lg:grid-cols-[1fr_1.2fr]">
            <div className="flex flex-col justify-center gap-4 bg-card p-8 sm:p-10">
              <span className="flex size-12 items-center justify-center rounded-xl bg-gradient-brand/10 text-primary">
                <MapPin className="size-5" />
              </span>
              <h3 className="text-xl font-semibold text-foreground">{siteConfig.legalName}</h3>
              <p className="text-base leading-relaxed text-muted-foreground">
                {siteConfig.address.full}
              </p>
            </div>
            <div className="relative flex min-h-[280px] items-center justify-center bg-gradient-brand-radial bg-muted">
              <div className="absolute inset-0 opacity-[0.15] bg-gradient-brand" />
              <div className="relative flex flex-col items-center gap-2 text-center">
                <MapPin className="size-8 text-primary" />
                <p className="text-sm font-medium text-foreground">
                  Interactive map available on the live site
                </p>
                <p className="text-xs text-muted-foreground">
                  {siteConfig.address.city}, {siteConfig.address.state}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
