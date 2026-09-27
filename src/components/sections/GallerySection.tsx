import * as React from "react";
import { Images } from "lucide-react";
import type { GallerySectionProps } from "@/types/builder";

export function GallerySection({
  heading = "Captured Moments",
  subheading = "Memories along our journey",
  images = [],
}: GallerySectionProps) {
  return (
    <section id="gallery" className="bg-white py-20 sm:py-28 px-6 border-b border-border/60">
      <div className="max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 text-primary mb-4">
          <Images className="h-6 w-6" />
        </div>

        <h2 className="font-display text-3xl sm:text-4xl font-bold text-neutral-dark">
          {heading}
        </h2>
        {subheading && (
          <p className="mt-2 text-sm text-neutral-mid">{subheading}</p>
        )}

        {images.length === 0 ? (
          <div className="mt-12 p-12 rounded-3xl border border-dashed border-border bg-neutral-light/50 max-w-lg mx-auto">
            <p className="text-neutral-mid text-sm">Photos will appear here once uploaded.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-12">
            {images.map((img) => (
              <div
                key={img.id || img.url}
                className="group relative rounded-2xl overflow-hidden aspect-square bg-neutral-100 shadow-soft-sm"
              >
                <img
                  src={img.url}
                  alt={img.caption || "Wedding photo"}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {img.caption && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-white text-xs text-left opacity-0 group-hover:opacity-100 transition-opacity">
                    {img.caption}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
