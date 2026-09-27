import * as React from "react";
import Link from "next/link";
import { Heart, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { RsvpSectionProps } from "@/types/builder";

interface RsvpSectionWrapperProps extends RsvpSectionProps {
  weddingSlug?: string;
}

export function RsvpSection({
  heading = "Celebrate With Us",
  subheading = "We eagerly anticipate sharing this sacred milestone with our loved ones",
  deadline_text = "August 1st, 2027",
  weddingSlug,
}: RsvpSectionWrapperProps) {
  const rsvpHref = weddingSlug ? `/wedding/${weddingSlug}/rsvp` : "#rsvp";

  return (
    <section id="rsvp" className="relative overflow-hidden bg-[#141316] text-white py-28 sm:py-36 px-6 text-center">
      {/* Ambient gold glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto space-y-6">
        {/* Monogram Wax Seal */}
        <div className="flex justify-center mb-4">
          <div
            className="relative h-16 w-16 rounded-full flex items-center justify-center shadow-wax-seal transition-transform duration-300 hover:scale-105"
            style={{
              background: "radial-gradient(circle at 35% 35%, #ECC880 0%, #C9A96E 40%, #523D15 100%)",
            }}
          >
            <div className="w-13 h-13 rounded-full border border-white/40 flex items-center justify-center p-1">
              <span className="font-display font-bold text-xs tracking-widest text-[#2B1D08]">
                RSVP
              </span>
            </div>
          </div>
        </div>

        <h2 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-white">
          {heading}
        </h2>

        {subheading && (
          <p className="text-base sm:text-xl text-white/80 font-light max-w-xl mx-auto leading-relaxed">
            {subheading}
          </p>
        )}

        {deadline_text && (
          <div className="pt-2">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-primary-champagne text-xs uppercase tracking-widest font-semibold border border-white/10 backdrop-blur-sm">
              <Sparkles className="h-3 w-3 text-primary" />
              Kindly respond by {deadline_text}
            </span>
          </div>
        )}

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            className="w-full sm:w-auto px-10 py-6 text-sm tracking-widest uppercase font-semibold shadow-soft-xl bg-primary hover:bg-primary-dark text-neutral-dark"
            asChild
          >
            <Link href={rsvpHref}>
              Submit Your RSVP Online
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>

        <p className="text-xs text-white/50 pt-2 flex items-center justify-center gap-1.5">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
          Frictionless 1-click confirmation • Dietary preferences & plus-ones included
        </p>
      </div>
    </section>
  );
}
