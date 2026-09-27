import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, Sparkles, CheckCircle, ArrowRight, Smartphone, ShieldCheck, Clock, Users } from "lucide-react";

// ─── Value propositions (Truthful, non-fabricated metrics) ──────────────────────

const VALUE_PROPS = [
  {
    icon: Clock,
    title: "Instant Setup",
    subtitle: "Launch your custom site in under 5 minutes",
  },
  {
    icon: Smartphone,
    title: "Mobile First",
    subtitle: "Designed to look stunning on every phone and screen",
  },
  {
    icon: ShieldCheck,
    title: "Ad-Free & Private",
    subtitle: "Your personal memories stay secure and private",
  },
  {
    icon: Users,
    title: "Guest Friendly",
    subtitle: "Seamless 1-click RSVP with zero app installation",
  },
] as const;

const FEATURES = [
  {
    icon: Sparkles,
    title: "Curated Designer Themes",
    description:
      "Choose from professionally crafted wedding themes. Customize typography, color palettes, and photography to match your wedding aesthetic.",
  },
  {
    icon: CheckCircle,
    title: "Effortless Online RSVPs",
    description:
      "Collect guest confirmations, dietary preferences, and plus-ones. Automatic real-time tracking keeps your headcounts organized.",
  },
  {
    icon: Heart,
    title: "Share Your Love Story",
    description:
      "Showcase high-resolution photo galleries, a timeline of your milestone moments, venue directions, and dress codes for your guests.",
  },
] as const;

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <main className="flex flex-col">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden bg-neutral-light px-6 pt-24 pb-20 sm:pt-32 sm:pb-28 lg:px-8">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-accent opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>

        <div className="mx-auto max-w-2xl text-center">
          {/* Eyebrow */}
          <div className="mb-6 flex items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary-dark ring-1 ring-primary/20">
              <Heart className="h-3.5 w-3.5 fill-primary text-primary" aria-hidden="true" />
              The modern wedding website builder
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-display-lg font-bold tracking-tight text-neutral-dark sm:text-display-xl">
            Your love story,{" "}
            <span className="text-primary">beautifully told.</span>
          </h1>

          {/* Sub-headline */}
          <p className="mt-6 text-lg leading-8 text-neutral-mid">
            EverAfter helps you create a breathtaking wedding website in minutes
            — complete with RSVPs, registry links, and everything your guests need,
            all in one elegant place.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/auth/signup">
                Start for free
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button size="lg" variant="ghost" asChild>
              <Link href="/pricing">View plans</Link>
            </Button>
          </div>

          <p className="mt-4 text-sm text-neutral-mid">
            No credit card required · Free tier available
          </p>
        </div>
      </section>

      {/* ── Key Highlights (Truthful product attributes) ──────────────────── */}
      <section className="border-y border-border bg-white py-12 px-6">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {VALUE_PROPS.map(({ icon: Icon, title, subtitle }) => (
              <div key={title} className="flex flex-col items-center gap-2 text-center">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="font-display text-lg font-semibold text-neutral-dark">
                  {title}
                </h3>
                <p className="text-sm text-neutral-mid">{subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <section id="features" className="bg-neutral-light py-24 px-6 sm:py-32">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="font-display text-display-md font-bold text-neutral-dark">
              Everything you need for your wedding
            </h2>
            <p className="mt-4 text-lg text-neutral-mid">
              Designed to take the stress out of coordination so you can focus on celebrating.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <article
                key={title}
                className="rounded-2xl bg-white p-8 shadow-soft-md ring-1 ring-border"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
                </div>
                <h3 className="font-display text-xl font-semibold text-neutral-dark">
                  {title}
                </h3>
                <p className="mt-3 text-neutral-mid leading-relaxed">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────────────── */}
      <section className="bg-neutral-dark py-24 px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-display-md font-bold text-white">
            Ready to build your wedding website?
          </h2>
          <p className="mt-4 text-lg text-white/70">
            Create your free account today and start sharing your journey with loved ones.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/auth/signup">
                Get started for free
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
              <Link href="/pricing">Compare plans</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
