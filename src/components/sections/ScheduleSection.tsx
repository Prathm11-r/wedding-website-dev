import * as React from "react";
import { Clock, MapPin, Sparkles } from "lucide-react";
import type { ScheduleSectionProps } from "@/types/builder";

export function ScheduleSection({
  heading = "Wedding Schedule",
  subheading = "Celebrate every milestone with us",
  events = [],
}: ScheduleSectionProps) {
  return (
    <section id="schedule" className="bg-white py-20 sm:py-28 px-6 border-b border-border/60">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-neutral-dark">
            {heading}
          </h2>
          {subheading && (
            <p className="mt-2 text-sm uppercase tracking-widest text-primary-dark font-medium">
              {subheading}
            </p>
          )}
        </div>

        <div className="relative border-l border-primary/30 ml-4 sm:ml-32 space-y-12 pl-6 sm:pl-10">
          {events.map((event, idx) => (
            <div key={event.id || idx} className="relative group">
              {/* Timeline marker */}
              <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 h-4 w-4 rounded-full border-2 border-primary bg-white shadow-soft-sm group-hover:bg-primary transition-colors" />

              <div className="bg-neutral-light p-6 sm:p-8 rounded-2xl border border-border shadow-soft-sm hover:shadow-soft-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-neutral-dark">
                    {event.title}
                  </h3>
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-primary/15 text-primary-dark w-fit">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{event.time}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-neutral-mid mb-3">
                  <MapPin className="h-4 w-4 text-primary shrink-0" />
                  <span>{event.location}</span>
                </div>

                {event.description && (
                  <p className="text-sm text-neutral-mid leading-relaxed mt-2">
                    {event.description}
                  </p>
                )}

                {event.dress_code && (
                  <div className="mt-4 pt-4 border-t border-border flex items-center gap-1.5 text-xs font-medium text-neutral-dark">
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                    <span>Attire: {event.dress_code}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
