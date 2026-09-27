import * as React from "react";
import { Images, Camera, Upload, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { GallerySectionProps } from "@/types/builder";

const DEFAULT_GALLERY_IMAGES = [
  {
    id: "g1",
    url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    caption: "Golden hour in the gardens",
  },
  {
    id: "g2",
    url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
    caption: "The first dance",
  },
  {
    id: "g3",
    url: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80",
    caption: "Champagne celebration",
  },
  {
    id: "g4",
    url: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80",
    caption: "Under the Tuscan olive groves",
  },
  {
    id: "g5",
    url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
    caption: "Portraits by the Mediterranean",
  },
  {
    id: "g6",
    url: "https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=800&q=80",
    caption: "The evening grand banquet",
  },
];

export function GallerySection({
  heading = "Captured Moments",
  subheading = "Memories along our journey & live guest stream",
  images = [],
}: GallerySectionProps) {
  const displayImages = images.length > 0 ? images : DEFAULT_GALLERY_IMAGES;

  return (
    <section id="gallery" className="bg-neutral-surface py-24 sm:py-32 px-6 border-b border-border/70 relative">
      <div className="max-w-6xl mx-auto text-center">
        {/* Header */}
        <span className="text-xs uppercase tracking-[0.25em] text-primary-deep font-semibold mb-2 block">
          {subheading}
        </span>
        <h2 className="font-display text-3xl sm:text-5xl font-bold text-neutral-dark mb-4">
          {heading}
        </h2>
        <p className="text-sm sm:text-base text-neutral-mid max-w-xl mx-auto mb-14 font-light">
          A glimpse into the milestones that brought us here. Guests are invited to upload their favorite candid captures throughout the celebration.
        </p>

        {/* 3D Masonry & Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayImages.map((img) => (
            <div
              key={img.id || img.url}
              className="group relative rounded-3xl overflow-hidden aspect-[4/5] bg-neutral-200 border border-border shadow-3d-card transition-all duration-500 hover:-translate-y-1.5 hover:shadow-soft-xl"
            >
              <img
                src={img.url}
                alt={img.caption || "Wedding moment"}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Ambient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-left">
                {img.caption && (
                  <p className="text-white font-display text-base font-semibold">
                    {img.caption}
                  </p>
                )}
                <span className="text-white/70 text-xs mt-1 flex items-center gap-1">
                  <Camera className="h-3 w-3" /> Shared with Love
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Guest Photo Upload Banner */}
        <div className="mt-14 p-8 rounded-3xl bg-white border border-[#DFB76C]/40 shadow-soft-lg max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-1">
            <h4 className="font-display text-lg font-bold text-neutral-dark flex items-center justify-center sm:justify-start gap-2">
              <Sparkles className="h-4 w-4 text-primary-deep" />
              Live Guest Photo Drop
            </h4>
            <p className="text-xs text-neutral-mid">
              Take photos during the reception? Share them directly to our high-resolution couple vault.
            </p>
          </div>
          <Button size="sm" className="shrink-0 shadow-soft-md" asChild>
            <a href="#upload" onClick={(e) => { e.preventDefault(); alert("Photo upload prompt: Guests can upload uncompressed photos directly from their mobile camera roll."); }}>
              <Upload className="h-3.5 w-3.5 mr-2" />
              Upload Photos
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
