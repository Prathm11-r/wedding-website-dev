import * as React from "react";
import { Clock, MapPin, Sparkles, ExternalLink } from "lucide-react";
import type { ScheduleSectionProps } from "@/types/builder";

export function ScheduleSection({
  heading = "Wedding Itinerary & Order of Events",
  subheading = "Celebrate every milestone with us",
  events = [
    {
      id: "ev-1",
      title: "Sacred Ceremony & Vows",
      time: "4:00 PM",
      location: "The Formal Orangery, Château de Chantilly",
      description: "Please arrive 20 minutes prior. Music commences at 3:45 PM.",
      dress_code: "Black Tie / Formal Evening",
    },
    {
      id: "ev-2",
      title: "Champagne Reception & Canapés",
      time: "5:30 PM",
      location: "The Grand Terrace & Parterre Lawn",
      description: "Enjoy vintage champagne, local oysters, and classical jazz quartet under the sunset.",
      dress_code: "Black Tie",
    },
    {
      id: "ev-3",
      title: "Candlelit Banquet & Toasts",
      time: "7:00 PM",
      location: "The Galerie des Cerfs",
      description: "A four-course French banquet curated with wine pairings and family speeches.",
      dress_code: "Black Tie",
    },
    {
      id: "ev-4",
      title: "The First Dance & Midnight Revelry",
      time: "9:30 PM until Late",
      location: "The Rotunda Ballroom",
      description: "Dancing, signature cocktails, and late-night crêpes under the chandeliers.",
      dress_code: "Celebratory Black Tie",
    },
  ],
}: ScheduleSectionProps) {
  return (
    <section id="schedule" className="bg-white py-24 sm:py-32 px-6 border-b border-border/70 relative">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <span className="text-xs uppercase tracking-[0.25em] text-primary-deep font-semibold mb-2 block">
            {subheading}
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-bold text-neutral-dark">
            {heading}
          </h2>
        </div>

        {/* Timeline Stream */}
        <div className="relative border-l-2 border-[#DFB76C]/40 ml-4 sm:ml-32 space-y-12 pl-6 sm:pl-12">
          {events.map((event, idx) => (
            <div key={event.id || idx} className="relative group">
              {/* Timeline Marker Dot with Gold Sheen */}
              <div className="absolute -left-[33px] sm:-left-[57px] top-2 h-5 w-5 rounded-full border-2 border-primary bg-white shadow-soft-md group-hover:bg-primary group-hover:scale-125 transition-all duration-300 flex items-center justify-center">
                <span className="h-1.5 w-1.5 rounded-full bg-primary-deep group-hover:bg-white" />
              </div>

              {/* Event Card */}
              <div className="bg-neutral-surface p-6 sm:p-8 rounded-3xl border border-border shadow-3d-card hover:border-primary/40 hover:shadow-soft-lg transition-all duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-neutral-dark">
                    {event.title}
                  </h3>
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-full bg-primary/10 text-primary-deep border border-primary/20 w-fit">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{event.time}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs sm:text-sm text-neutral-mid mb-3">
                  <MapPin className="h-4 w-4 text-primary-deep shrink-0" />
                  <span>{event.location}</span>
                </div>

                {event.description && (
                  <p className="text-sm text-neutral-mid leading-relaxed mt-2 font-light">
                    {event.description}
                  </p>
                )}

                {event.dress_code && (
                  <div className="mt-5 pt-4 border-t border-border/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-neutral-dark font-medium">
                      <Sparkles className="h-3.5 w-3.5 text-primary-deep" />
                      <span>Attire: {event.dress_code}</span>
                    </div>

                    <span className="text-[11px] text-primary-deep font-medium hover:underline flex items-center gap-1 cursor-pointer">
                      Directions <ExternalLink className="h-3 w-3" />
                    </span>
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
