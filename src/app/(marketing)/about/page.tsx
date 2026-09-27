import Link from "next/link";
import { Heart, Sparkles, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "About EverAfter — The Wedding Website Atelier",
  description:
    "EverAfter was created to replace flat, generic wedding templates with three-dimensional, editorial digital ateliers.",
};

export default function AboutPage() {
  return (
    <div className="bg-neutral-surface min-h-screen py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold uppercase tracking-widest text-primary-deep mb-4 shadow-soft-sm">
            <Heart className="h-3.5 w-3.5 text-primary" />
            Our Mission & Story
          </span>
          <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-neutral-dark">
            Elevating the Art of Wedding Stationery
          </h1>
          <p className="mt-4 text-base sm:text-lg text-neutral-mid leading-relaxed font-light max-w-2xl mx-auto">
            We believe your digital wedding invitation should evoke the tactile grace of heavy cotton cardstock, gold wax seals, and bespoke editorial typography.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-border/80 shadow-3d-card space-y-8 text-neutral-dark leading-relaxed font-light text-base sm:text-lg">
          <div>
            <h2 className="font-display text-2xl font-bold mb-3 text-neutral-dark">
              Departing from Cookie-Cutter Templates
            </h2>
            <p className="text-neutral-mid text-sm sm:text-base leading-relaxed">
              For years, couples planning their weddings were forced to settle for flat, ad-cluttered platforms designed a decade ago. EverAfter was conceived as a digital atelier: combining three-dimensional spatial depth, curated type pairings, and multi-tenant security to give couples an experience worthy of their love story.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-border/70">
            <div className="p-6 rounded-2xl bg-neutral-surface border border-border/60">
              <Sparkles className="h-6 w-6 text-primary-deep mb-3" />
              <h3 className="font-display text-lg font-bold text-neutral-dark mb-1">
                Haute Couture Aesthetics
              </h3>
              <p className="text-xs text-neutral-mid leading-relaxed">
                Inspired by high-fashion wedding publications, deckle-edge letterpress printing, and classical European estates.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-surface border border-border/60">
              <Shield className="h-6 w-6 text-emerald-600 mb-3" />
              <h3 className="font-display text-lg font-bold text-neutral-dark mb-1">
                Zero Ads & Bank-Grade Privacy
              </h3>
              <p className="text-xs text-neutral-mid leading-relaxed">
                100% ad-free across all tiers. Row-level encrypted databases isolate guest responses, dietary allergies, and personal vows.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-border/70 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-display text-lg font-bold text-neutral-dark">
                Ready to tell your love story?
              </p>
              <p className="text-xs text-neutral-mid">
                Join thousands of couples creating their forever website.
              </p>
            </div>
            <Button size="lg" asChild className="shadow-soft-md shadow-primary/25">
              <Link href="/wedding/new">
                Start for Free
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
