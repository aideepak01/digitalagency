import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { getSiteConfig } from "@/lib/db/settings";

/**
 * Root layout: the document shell only.
 *
 * The public site's navbar, footer, and JSON-LD live in `(site)/layout.tsx`, a
 * route group that does not affect URLs — that keeps the marketing chrome off
 * the `/admin` pages, which have their own shell.
 */

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const siteConfig = await getSiteConfig();

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: `${siteConfig.name} — ${siteConfig.tagline}`,
      template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    keywords: [
      "AI development agency",
      "software development agency",
      "AI agents",
      "AI chatbots",
      "Next.js development",
      "Laravel development",
      "custom software development",
      "web application development",
      "mobile app development",
    ],
    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    creator: siteConfig.name,
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      url: siteConfig.url,
      title: `${siteConfig.name} — ${siteConfig.tagline}`,
      description: siteConfig.description,
      siteName: siteConfig.name,
      images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: siteConfig.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${siteConfig.name} — ${siteConfig.tagline}`,
      description: siteConfig.description,
      images: [siteConfig.ogImage],
      creator: "@sbabuai",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    icons: {
      icon: "/favicon.ico",
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
