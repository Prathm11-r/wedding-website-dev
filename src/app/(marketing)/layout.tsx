import Link from "next/link";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

// ─── Navbar ───────────────────────────────────────────────────────────────────

function MarketingNavbar() {
  const navLinks = [
    { label: "Features",  href: "/#features" },
    { label: "Templates", href: "/templates" },
    { label: "Themes & 3D Studio", href: "/#themes" },
    { label: "Pricing",   href: "/pricing" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/70">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 group"
          aria-label="EverAfter home"
        >
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#ECC880] via-[#C9A96E] to-[#9F7A38] p-[1.5px] shadow-soft-sm transition-transform group-hover:scale-105">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center font-display font-bold text-xs text-primary-deep tracking-wider">
              EA
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-display text-xl font-bold tracking-tight text-neutral-dark">
              EverAfter
            </span>
            <span className="text-[10px] tracking-widest uppercase text-primary-deep font-medium -mt-1">
              Atelier & SaaS
            </span>
          </div>
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden items-center gap-8 md:flex" role="list">
          {navLinks.map(({ label, href }) => (
            <li key={label}>
              <Link
                href={href}
                className="text-sm font-medium text-neutral-mid transition-colors hover:text-primary-deep"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Auth & Demo CTAs */}
        <div className="flex items-center gap-3">
          <Link
            href="/templates/chateau"
            className="hidden sm:inline-flex items-center text-xs font-semibold text-primary-deep px-3.5 py-1.5 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors border border-primary/20"
          >
            Live Demo ↗
          </Link>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/auth/login">Log in</Link>
          </Button>
          <Button size="sm" className="shadow-soft-md shadow-primary/20" asChild>
            <Link href="/wedding/new">Start Your Website</Link>
          </Button>
        </div>
      </nav>
    </header>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function MarketingFooter() {
  const footerSections = [
    {
      heading: "Product",
      links: [
        { label: "Features",  href: "/#features" },
        { label: "Templates", href: "/templates" },
        { label: "Pricing",   href: "/pricing" },
        { label: "Examples",  href: "/examples" },
        { label: "Changelog", href: "/changelog" },
      ],
    },
    {
      heading: "Company",
      links: [
        { label: "About",   href: "/about" },
        { label: "Blog",    href: "/blog" },
        { label: "Careers", href: "/careers" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      heading: "Legal",
      links: [
        { label: "Privacy Policy",    href: "/legal/privacy" },
        { label: "Terms of Service",  href: "/legal/terms" },
        { label: "Cookie Policy",     href: "/legal/cookies" },
      ],
    },
  ];

  return (
    <footer className="border-t border-border bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {/* Brand column */}
          <div className="col-span-2 sm:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-2 font-display text-lg font-bold text-neutral-dark"
              aria-label="EverAfter home"
            >
              <Heart className="h-4 w-4 fill-primary text-primary" aria-hidden="true" />
              EverAfter
            </Link>
            <p className="mt-3 text-sm leading-6 text-neutral-mid">
              Beautiful wedding websites for every love story.
            </p>
          </div>

          {/* Link columns */}
          {footerSections.map(({ heading, links }) => (
            <div key={heading}>
              <h3 className="text-sm font-semibold text-neutral-dark">{heading}</h3>
              <ul role="list" className="mt-4 space-y-2">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-neutral-mid transition-colors hover:text-neutral-dark"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-border pt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-neutral-mid">
            © {new Date().getFullYear()} EverAfter, Inc. All rights reserved.
          </p>
          <p className="text-sm text-neutral-mid flex items-center gap-1">
            Made with{" "}
            <Heart className="h-3.5 w-3.5 fill-red-400 text-red-400" aria-label="love" />{" "}
            for couples everywhere
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── Layout ───────────────────────────────────────────────────────────────────

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingNavbar />
      <div className="flex-1">{children}</div>
      <MarketingFooter />
    </div>
  );
}
