import * as React from "react";
import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { RsvpSectionProps } from "@/types/builder";

interface RsvpSectionWrapperProps extends RsvpSectionProps {
  weddingSlug?: string;
}

export function RsvpSection({
  heading = "Kindly RSVP",
  subheading = "We look forward to celebrating together",
  deadline_text,
  weddingSlug,
}: RsvpSectionWrapperProps) {
  const rsvpHref = weddingSlug ? `/wedding/${weddingSlug}/rsvp` : "#rsvp";

  return (
    <section id="rsvp" className="bg-neutral-dark text-white py-20 sm:py-28 px-6 text-center">
      <div className="max-w-2xl mx-auto">
        <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/20 text-primary mb-6">
          <Heart className="h-6 w-6 fill-primary" />
        </div>

        <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight mb-4">
          {heading}
        </h2>

        {subheading && (
          <p className="text-lg text-white/80 font-light mb-6">
            {subheading}
          </p>
        )}

        {deadline_text && (
          <p className="text-sm uppercase tracking-widest text-primary font-semibold mb-8">
            Please respond by {deadline_text}
          </p>
        )}

        <div className="flex justify-center">
          <Button size="lg" className="px-8 shadow-soft-lg text-base" asChild>
            <Link href={rsvpHref}>
              Submit Your RSVP Online
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
