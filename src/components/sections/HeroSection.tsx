import * as React from "react";
import Link from "next/link";
import { Heart, Calendar, MapPin, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { HeroSectionProps } from "@/types/builder";

export function HeroSection({
  headline,
  subheadline,
  date_text,
  location_text,
  image_url,
  overlay_opacity = 25,
  cta_text = "RSVP With Pleasure",
  cta_link = "#rsvp",
}: HeroSectionProps) {
  // Extract initials for monogram
  const names = headline.split(/&|and|\+/i);
  const initials = names.length >= 2
    ? `${names[0].trim().charAt(0)} & ${names[1].trim().charAt(0)}`
    : "EA";

  return (
    <section className="relative isolate overflow-hidden bg-neutral-surface px-6 py-28 sm:py-36 lg:px-8 text-center border-b border-border/70">
      {/* Background imagery with subtle cinematic parallax feel */}
      {image_url && (
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center transition-transform duration-1000 scale-[1.02]"
          style={{ backgroundImage: `url(${image_url})` }}
        />
      )}

      {/* Atmospheric luxury overlay */}
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-b from-[#FBF9F5]/90 via-[#F7F4F0]/85 to-[#FBF9F5]/95 backdrop-blur-[2px]"
        style={{ opacity: `${overlay_opacity}%` }}
      />

      {/* Ambient warm champagne radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-primary/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="mx-auto max-w-3xl relative">
        {/* Monogram Crest Wax Seal */}
        <div className="flex justify-center mb-8">
          <div
            className="relative h-16 w-16 rounded-full flex items-center justify-center shadow-wax-seal transition-transform duration-300 hover:scale-105"
            style={{
              background: "radial-gradient(circle at 35% 35%, #F4EBD9 0%, #C9A96E 50%, #8A6424 100%)",
            }}
          >
            <div className="w-13 h-13 rounded-full border border-white/40 flex items-center justify-center p-1">
              <span className="font-display font-bold text-xs tracking-widest text-[#2B1D08]">
                {initials}
              </span>
            </div>
          </div>
        </div>

        {/* Eyebrow */}
        {subheadline && (
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="font-sans text-xs sm:text-sm uppercase tracking-[0.25em] text-primary-deep font-semibold">
              {subheadline}
            </span>
          </div>
        )}

        {/* Main Couple Names */}
        <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-neutral-dark mb-6 leading-[1.15]">
          {headline}
        </h1>

        {/* Wedding Date & Location in Framed Hairline Ribbon */}
        {(date_text || location_text) && (
          <div className="relative inline-flex flex-wrap items-center justify-center gap-4 sm:gap-8 py-4 px-8 rounded-2xl bg-white/80 border border-[#DFB76C]/40 shadow-soft-sm my-6 text-sm sm:text-base text-neutral-dark backdrop-blur-md">
            {date_text && (
              <div className="flex items-center gap-2.5">
                <Calendar className="h-4 w-4 text-primary-deep" />
                <span className="font-medium tracking-wide">{date_text}</span>
              </div>
            )}
            {date_text && location_text && (
              <span className="text-primary-deep/40 hidden sm:inline">•</span>
            )}
            {location_text && (
              <div className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-primary-deep" />
                <span className="font-medium tracking-wide">{location_text}</span>
              </div>
            )}
          </div>
        )}

        {/* RSVP CTA Button */}
        {cta_text && (
          <div className="mt-8 flex justify-center">
            <Button
              size="lg"
              className="px-10 py-6 text-sm tracking-widest uppercase font-semibold shadow-soft-xl shadow-primary/25 hover:shadow-primary/40 transition-all duration-300"
              asChild
            >
              <Link href={cta_link}>
                <Sparkles className="h-4 w-4 mr-2" />
                {cta_text}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
