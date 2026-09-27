import * as React from "react";
import Link from "next/link";
import { Heart, Calendar, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { HeroSectionProps } from "@/types/builder";

export function HeroSection({
  headline,
  subheadline,
  date_text,
  location_text,
  image_url,
  overlay_opacity = 20,
  cta_text = "RSVP Now",
  cta_link = "#rsvp",
}: HeroSectionProps) {
  return (
    <section className="relative isolate overflow-hidden bg-neutral-light px-6 py-24 sm:py-32 lg:px-8 text-center border-b border-border/60">
      {image_url && (
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center"
          style={{ backgroundImage: `url(${image_url})` }}
        />
      )}

      {/* Decorative gradient / overlay */}
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-b from-white/90 via-neutral-light/80 to-white/95"
        style={{ opacity: `${overlay_opacity}%` }}
      />

      <div className="mx-auto max-w-3xl">
        <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 text-primary mb-6 shadow-soft-sm">
          <Heart className="h-6 w-6 fill-primary" />
        </div>

        {subheadline && (
          <p className="font-sans text-sm sm:text-base uppercase tracking-widest text-primary-dark font-semibold mb-3">
            {subheadline}
          </p>
        )}

        <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-neutral-dark mb-6">
          {headline}
        </h1>

        {(date_text || location_text) && (
          <div className="flex flex-wrap items-center justify-center gap-6 py-5 border-y border-border/80 my-8 text-sm sm:text-base text-neutral-dark max-w-xl mx-auto">
            {date_text && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span>{date_text}</span>
              </div>
            )}
            {date_text && location_text && <span className="text-border">•</span>}
            {location_text && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>{location_text}</span>
              </div>
            )}
          </div>
        )}

        {cta_text && (
          <div className="mt-8 flex justify-center">
            <Button size="lg" className="px-8 shadow-soft-md" asChild>
              <Link href={cta_link}>
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
