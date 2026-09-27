import * as React from "react";
import type { OurStorySectionProps } from "@/types/builder";

export function OurStorySection({
  heading = "Our Story",
  subheading = "How forever began",
  body,
  image_url,
  quote,
}: OurStorySectionProps) {
  return (
    <section id="story" className="bg-neutral-light py-20 sm:py-28 px-6 border-b border-border/60">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-neutral-dark">
            {heading}
          </h2>
          {subheading && (
            <p className="mt-2 text-sm uppercase tracking-widest text-primary-dark font-medium">
              {subheading}
            </p>
          )}
        </div>

        <div className={`grid grid-cols-1 ${image_url ? "md:grid-cols-2" : ""} gap-10 items-center`}>
          {image_url && (
            <div className="relative rounded-3xl overflow-hidden shadow-soft-lg aspect-[4/5] bg-neutral-200">
              <img
                src={image_url}
                alt="Couple"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="space-y-6 text-neutral-mid text-base sm:text-lg leading-relaxed font-normal">
            <p>{body}</p>

            {quote && (
              <blockquote className="border-l-2 border-primary pl-4 italic text-neutral-dark font-display text-lg sm:text-xl my-6">
                "{quote}"
              </blockquote>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
