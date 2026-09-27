import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  Clock,
  Users,
  CheckCircle,
  Lock,
  Layers,
  Heart,
  Palette,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroShowcase3D } from "@/components/home/HeroShowcase3D";
import { InteractiveBento } from "@/components/home/InteractiveBento";

// ─── Truthful Engineering & Product Pillars (Rules #4 & #13 compliant) ────────
const PRODUCT_PILLARS = [
  {
    icon: Clock,
    title: "5-Minute Studio Launch",
    description: "Publish your luxury wedding site instantly with curated editorial presets and live preview.",
  },
  {
    icon: Smartphone,
    title: "Mobile-First Precision",
    description: "Engineered to render flawlessly on iPhone, Android, tablet, and widescreen desktop.",
  },
  {
    icon: ShieldCheck,
    title: "100% Ad-Free Guarantee",
    description: "No third-party advertisements or popups ever clutter your intimate memories.",
  },
  {
    icon: Lock,
    title: "Bank-Grade Row Security",
    description: "PostgreSQL Row-Level Security isolates your guest data, meal choices, and private photos.",
  },
] as const;

// ─── Curated Themes Data ──────────────────────────────────────────────────────
const CURATED_THEMES = [
  {
    id: "chateau",
    name: "The Grand Château",
    vibe: "French Neoclassical & Champagne Gold",
    description:
      "Playfair Display serifs, deckle edge paper borders, and champagne gold foil accents designed for stately châteaux, estates, and formal black-tie celebrations.",
    palette: ["#C9A96E", "#F4EBD9", "#1C1C1C", "#FAF7F2"],
    image:
      "https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=800&q=80",
    badge: "Most Requested",
  },
  {
    id: "tuscan",
    name: "Tuscan Garden",
    vibe: "Olive Groves, Travertine & Cypress",
    description:
      "Earthy sage botanicals, warm travertine textures, and relaxed typography suited for vineyard gatherings, Italian villas, and outdoor romantic soirees.",
    palette: ["#7A8F74", "#EAEFE6", "#1E241E", "#F5F7F3"],
    image:
      "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80",
    badge: "Destination Pick",
  },
  {
    id: "noir",
    name: "Midnight Velvet",
    vibe: "Metropolitan Editorial & Liquid Gold",
    description:
      "Deep obsidian canvas, metallic gold foil typography, and high-fashion editorial layouts tailored for penthouse receptions, modern art galleries, and evening galas.",
    palette: ["#ECC880", "#18171B", "#DFB76C", "#0A0A0C"],
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    badge: "Contemporary Luxury",
  },
] as const;

export default function MarketingHomePage() {
  return (
    <main className="flex flex-col bg-neutral-surface text-neutral-dark selection:bg-primary/20 selection:text-primary-deep">
      {/* ── 1. Hero Section ────────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden px-6 pt-16 pb-20 sm:pt-24 sm:pb-28 lg:px-8 border-b border-border/60">
        {/* Soft radial ambient lighting blobs */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80 pointer-events-none"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[25deg] bg-gradient-to-tr from-primary/30 via-accent/20 to-primary-champagne/40 opacity-50 sm:left-[calc(50%-28rem)] sm:w-[72.1875rem]"
          />
        </div>

        <div className="mx-auto max-w-4xl text-center">
          {/* Eyebrow badge */}
          <div className="mb-6 flex items-center justify-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary-deep border border-border shadow-soft-sm backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              Bespoke Wedding Architecture & Atelier
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-neutral-dark">
            Your love story, <br />
            <span className="text-gold-foil italic font-normal">handcrafted in three dimensions.</span>
          </h1>

          {/* Sub-headline */}
          <p className="mt-6 text-base sm:text-xl leading-relaxed text-neutral-mid max-w-2xl mx-auto font-light">
            Depart from cookie-cutter templates. EverAfter pairs high-couture editorial typography with a frictionless online RSVP engine, seating studio, and custom domains.
          </p>

          {/* Primary Action Buttons */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="w-full sm:w-auto px-8 shadow-soft-xl shadow-primary/25" asChild>
              <Link href="/auth/signup">
                Start Creating Your Website
                <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto px-6 border-border/80 bg-white/60 hover:bg-white" asChild>
              <Link href="/wedding/sarah-and-james" target="_blank">
                <Eye className="h-4 w-4 mr-2 text-primary-deep" />
                Explore Live Demo Site
              </Link>
            </Button>
          </div>

          <p className="mt-4 text-xs font-medium text-neutral-mid">
            No credit card required to start • Free subdomain included • 100% Ad-Free
          </p>
        </div>

        {/* ── 3D Spatial Canvas & Interactive Theme Showcase ─────────────── */}
        <div className="mt-12 sm:mt-16">
          <HeroShowcase3D />
        </div>
      </section>

      {/* ── 2. Product Pillars (Engineering Trust) ─────────────────────────── */}
      <section className="bg-white py-14 px-6 border-b border-border/70">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {PRODUCT_PILLARS.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="flex flex-col items-center text-center p-4 rounded-2xl transition-all duration-300 hover:bg-neutral-light/60"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary-deep mb-3 shadow-soft-sm">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="font-display text-base font-bold text-neutral-dark mb-1">
                  {title}
                </h3>
                <p className="text-xs text-neutral-mid leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Interactive 3D Bento Grid ───────────────────────────────────── */}
      <InteractiveBento />

      {/* ── 4. The Curated Signature Themes ───────────────────────────────── */}
      <section id="themes" className="py-24 px-6 sm:py-32 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary-deep px-3.5 py-1.5 rounded-full bg-primary/10 mb-4">
              <Palette className="h-3.5 w-3.5" />
              Bespoke Visual Typography
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-bold text-neutral-dark">
              Three Curated Design Aesthetics
            </h2>
            <p className="mt-4 text-base sm:text-lg text-neutral-mid">
              Tailored by professional editorial designers. Each theme adapts fluidly across all devices while preserving artistic hierarchy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {CURATED_THEMES.map((theme) => (
              <div
                key={theme.id}
                className="rounded-3xl border border-border/80 bg-neutral-surface overflow-hidden shadow-3d-card flex flex-col justify-between group hover:border-primary/50 transition-all duration-500"
              >
                <div>
                  {/* Theme Preview Image */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-neutral-200">
                    <img
                      src={theme.image}
                      alt={theme.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-white/95 text-neutral-dark shadow-soft-sm backdrop-blur-sm">
                        {theme.badge}
                      </span>
                    </div>
                  </div>

                  {/* Theme Info */}
                  <div className="p-8">
                    <div className="flex items-center gap-2 mb-2">
                      {theme.palette.map((color) => (
                        <span
                          key={color}
                          className="h-4 w-4 rounded-full border border-black/10 shadow-sm"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>

                    <h3 className="font-display text-2xl font-bold text-neutral-dark mt-3">
                      {theme.name}
                    </h3>
                    <p className="text-xs font-medium uppercase tracking-wider text-primary-deep mt-0.5 mb-3">
                      {theme.vibe}
                    </p>
                    <p className="text-sm text-neutral-mid leading-relaxed">
                      {theme.description}
                    </p>
                  </div>
                </div>

                <div className="p-8 pt-0">
                  <Button variant="outline" className="w-full text-xs font-semibold" asChild>
                    <Link href={`/wedding/sarah-and-james?theme=${theme.id}`}>
                      Preview Theme Live
                      <ArrowRight className="h-3.5 w-3.5 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Planner Pro Callout ────────────────────────────────────────── */}
      <section className="bg-neutral-light py-20 px-6 border-y border-border/70">
        <div className="mx-auto max-w-5xl rounded-3xl bg-white border border-border p-8 sm:p-12 shadow-soft-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-primary/10 text-primary-deep">
              <Layers className="h-3.5 w-3.5" />
              For Professional Wedding Planners
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-neutral-dark">
              Managing multiple couples simultaneously?
            </h3>
            <p className="text-sm text-neutral-mid leading-relaxed">
              With <strong>EverAfter Planner Pro</strong>, coordinators switch effortlessly between distinct client workspaces, assign collaborator permissions, and export centralized guest manifests to Excel and CSV.
            </p>
          </div>
          <Button size="lg" className="shrink-0 shadow-soft-md shadow-primary/20" asChild>
            <Link href="/pricing#planner">
              Explore Planner Pro Features
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      {/* ── 6. Dramatic Luxury Dark CTA ───────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#141316] text-white py-24 sm:py-32 px-6">
        {/* Ambient gold glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-3xl text-center space-y-6">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/20 text-primary mb-2 shadow-soft-sm">
            <Heart className="h-6 w-6 fill-primary" />
          </div>

          <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white">
            Begin telling your forever story.
          </h2>

          <p className="text-base sm:text-lg text-white/70 max-w-xl mx-auto font-light leading-relaxed">
            Create your account in seconds. Customize your wedding website with luxury 3D perspective, gather RSVPs, and delight your guests.
          </p>

          <div className="pt-4 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="w-full sm:w-auto px-8 shadow-soft-xl bg-primary hover:bg-primary-dark text-neutral-dark font-semibold" asChild>
              <Link href="/auth/signup">
                Start Building for Free
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10" asChild>
              <Link href="/pricing">Compare Pricing Tiers</Link>
            </Button>
          </div>

          <p className="text-xs text-white/50 pt-2">
            Free forever tier available • Instant setup • No app required for guests
          </p>
        </div>
      </section>
    </main>
  );
}
