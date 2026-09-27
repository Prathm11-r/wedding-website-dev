import * as React from "react";
import { Sparkles, Heart } from "lucide-react";
import type { OurStorySectionProps } from "@/types/builder";

export function OurStorySection({
  heading = "Our Love Story",
  subheading = "How forever began",
  body = "From our very first encounter at a sunlit café in Saint-Germain-des-Prés to quiet walks along the Seine, every moment has led us to this chapter. We are deeply grateful to gather our dearest friends and family to witness our sacred union.",
  image_url = "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1000&q=80",
  quote = "In all the world, there is no heart for me like yours. In all the world, there is no love for you like mine.",
}: OurStorySectionProps) {
  // Milestones for editorial timeline
  const milestones = [
    { year: "Autumn 2021", event: "The First Meeting", detail: "An unexpected introduction over espresso in Paris." },
    { year: "Summer 2024", event: "The Proposal", detail: "At twilight overlooking the cliffs of Amalfi." },
    { year: "September 2027", event: "The Forever Vow", detail: "Surrounded by everyone we hold dearest." },
  ];

  return (
    <section id="story" className="bg-neutral-surface py-24 sm:py-32 px-6 border-b border-border/70 relative">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-primary-deep font-semibold mb-2 block">
            {subheading}
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-bold text-neutral-dark">
            {heading}
          </h2>
        </div>

        {/* Editorial Two-Column Spread */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: 3D Editorial Photo Polaroid with Tape Accent */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative p-3.5 bg-white rounded-3xl border border-border/80 shadow-3d-floating transform -rotate-1 hover:rotate-0 transition-transform duration-500 max-w-sm">
              {/* Decorative deckle tape */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-[#E8D5C4]/60 backdrop-blur-sm rounded-sm transform rotate-1 shadow-sm" />

              <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-neutral-100">
                <img
                  src={image_url}
                  alt="Our Story"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>

              <div className="pt-3 pb-1 text-center">
                <p className="font-display italic text-xs text-neutral-mid">
                  Portraits on the cliffs of Amalfi • 35mm Film
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Prose & Milestone Timeline */}
          <div className="lg:col-span-7 space-y-8">
            {/* Story Text with Drop-Cap Styling */}
            <div className="text-neutral-dark text-base sm:text-lg leading-relaxed font-light first-letter:float-left first-letter:text-5xl first-letter:pr-3 first-letter:font-display first-letter:font-bold first-letter:text-primary-deep">
              {body}
            </div>

            {/* Editorial Pull Quote */}
            {quote && (
              <blockquote className="relative p-6 rounded-2xl bg-white border-l-4 border-primary shadow-soft-sm my-6">
                <span className="font-display text-4xl text-primary/40 leading-none select-none absolute -top-1 left-3">
                  “
                </span>
                <p className="font-display italic text-lg sm:text-xl text-neutral-dark pl-4">
                  {quote}
                </p>
              </blockquote>
            )}

            {/* Milestone Chapter Track */}
            <div className="pt-4 border-t border-border/80">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-primary-deep mb-4">
                Milestones Along Our Journey
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {milestones.map((m) => (
                  <div key={m.year} className="p-3.5 rounded-xl bg-white border border-border shadow-soft-sm">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-primary-deep font-semibold block mb-1">
                      {m.year}
                    </span>
                    <h5 className="font-display font-bold text-sm text-neutral-dark mb-0.5">
                      {m.event}
                    </h5>
                    <p className="text-xs text-neutral-mid">{m.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
