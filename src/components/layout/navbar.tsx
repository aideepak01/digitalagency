"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ArrowRight, ChevronRight } from "lucide-react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { navLinks } from "@/data/site";
import { services } from "@/data/services";
import { industries } from "@/data/industries";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const pathname = usePathname();
  const { scrollY } = useScroll();

  // Engages almost immediately: content starts passing under the header on the
  // very first pixel of scroll, so waiting until 16px leaves a visible gap.
  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 2);
  });

  const [lastPathname, setLastPathname] = React.useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setMobileOpen(false);
  }

  const featuredServices = services.slice(0, 8);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:px-4 sm:pt-4"
    >
      {/* Opaque header surface. Must stay fully opaque — any translucency or
          fade lets page text show through while scrolling. inset-0 stops it
          exactly at the header's bottom edge, so content is hidden above that
          line and appears cleanly below it. */}
      <div
        aria-hidden
        className={cn(
          "header-scrim pointer-events-none absolute inset-0 transition-opacity duration-300",
          scrolled ? "opacity-100" : "opacity-0"
        )}
      />

      {/* The scrim supplies the header surface once scrolled, so this stays a
          transparent layout container. Giving it its own background here would
          render as a stray outlined box against the opaque scrim. */}
      <div className="container-brand relative flex w-full items-center justify-between px-3 py-2 sm:px-4">
        <Logo />

        <NavigationMenu viewport={false} className="hidden lg:flex">
          <NavigationMenuList className="gap-1">
            {navLinks.map((link) => {
              if (link.label === "Services") {
                return (
                  <NavigationMenuItem key={link.href}>
                    <NavigationMenuTrigger className="bg-transparent text-sm">
                      Services
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid w-[640px] grid-cols-2 gap-1 p-4">
                        <div className="col-span-2 grid grid-cols-2 gap-1">
                          {featuredServices.map((service) => (
                            <NavigationMenuLink key={service.slug} asChild>
                              <Link
                                href={`/services/${service.slug}`}
                                className="flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-muted"
                              >
                                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-brand/10 text-primary">
                                  <service.icon className="size-4" />
                                </span>
                                <span className="flex flex-col">
                                  <span className="text-sm font-medium text-foreground">
                                    {service.shortName}
                                  </span>
                                  <span className="line-clamp-1 text-xs text-muted-foreground">
                                    {service.tagline}
                                  </span>
                                </span>
                              </Link>
                            </NavigationMenuLink>
                          ))}
                        </div>
                        <div className="col-span-2 mt-1 flex items-center justify-between rounded-xl bg-muted/60 px-4 py-3">
                          <span className="text-sm text-muted-foreground">
                            Explore all 16 services we offer
                          </span>
                          <Link
                            href="/services"
                            className="flex items-center gap-1 text-sm font-medium text-primary"
                          >
                            View all <ChevronRight className="size-3.5" />
                          </Link>
                        </div>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                );
              }

              if (link.label === "Industries") {
                return (
                  <NavigationMenuItem key={link.href}>
                    <NavigationMenuTrigger className="bg-transparent text-sm">
                      Industries
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid w-[480px] grid-cols-2 gap-1 p-4">
                        {industries.map((industry) => (
                          <NavigationMenuLink key={industry.slug} asChild>
                            <Link
                              href={`/industries/${industry.slug}`}
                              className="flex items-center gap-3 rounded-xl p-2.5 transition-colors hover:bg-muted"
                            >
                              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-brand/10 text-primary">
                                <industry.icon className="size-4" />
                              </span>
                              <span className="text-sm font-medium text-foreground">
                                {industry.name}
                              </span>
                            </Link>
                          </NavigationMenuLink>
                        ))}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                );
              }

              return (
                <NavigationMenuItem key={link.href}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={link.href}
                      className="rounded-lg px-2.5 py-1.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              );
            })}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="hidden items-center gap-2 lg:flex">
          <ThemeToggle />
          <Button asChild variant="ghost" className="h-9 px-3 text-sm">
            <Link href="/contact">Contact</Link>
          </Button>
          <Button
            asChild
            className="h-9 rounded-full bg-gradient-brand px-4 text-sm text-white hover:opacity-90"
          >
            <Link href="/contact#consultation">
              Book Free Consultation
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <ThemeToggle />
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85%] sm:max-w-sm">
              <SheetHeader>
                <SheetTitle asChild>
                  <Logo />
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 overflow-y-auto px-4 pb-4">
                {navLinks.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <Link
                      href={link.href}
                      className="rounded-lg px-3 py-2.5 text-base font-medium text-foreground transition-colors hover:bg-muted"
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
                <div className="my-2 h-px bg-border" />
                <p className="px-3 pb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Popular services
                </p>
                {featuredServices.slice(0, 5).map((service) => (
                  <SheetClose asChild key={service.slug}>
                    <Link
                      href={`/services/${service.slug}`}
                      className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      {service.shortName}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
              <div className="mt-auto flex flex-col gap-2 border-t border-border p-4">
                <SheetClose asChild>
                  <Button asChild variant="outline">
                    <Link href="/contact">Contact Us</Link>
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button asChild className="bg-gradient-brand text-white hover:opacity-90">
                    <Link href="/contact#consultation">
                      Book Free Consultation
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </Button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}
