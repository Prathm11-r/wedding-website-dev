import * as React from "react";
import type { PageSectionModel } from "@/types/builder";
import { HeroSection } from "./HeroSection";
import { CountdownSection } from "./CountdownSection";
import { OurStorySection } from "./OurStorySection";
import { ScheduleSection } from "./ScheduleSection";
import { RegistrySection } from "./RegistrySection";
import { GallerySection } from "./GallerySection";
import { RsvpSection } from "./RsvpSection";

interface SectionRendererProps {
  sections: PageSectionModel[];
  weddingSlug?: string;
}

export function SectionRenderer({ sections, weddingSlug }: SectionRendererProps) {
  const visibleSections = sections
    .filter((s) => s.is_visible)
    .sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="flex flex-col w-full">
      {visibleSections.map((sec) => {
        switch (sec.type) {
          case "hero":
            return <HeroSection key={sec.id} {...(sec.props as any)} />;
          case "countdown":
            return <CountdownSection key={sec.id} {...(sec.props as any)} />;
          case "our_story":
            return <OurStorySection key={sec.id} {...(sec.props as any)} />;
          case "schedule":
            return <ScheduleSection key={sec.id} {...(sec.props as any)} />;
          case "registry":
            return <RegistrySection key={sec.id} {...(sec.props as any)} />;
          case "gallery":
            return <GallerySection key={sec.id} {...(sec.props as any)} />;
          case "rsvp":
            return (
              <RsvpSection
                key={sec.id}
                {...(sec.props as any)}
                weddingSlug={weddingSlug}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
