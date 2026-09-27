import Link from "next/link";
import { Sparkles, ArrowRight, Eye, Palette, Check, Layers, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TEMPLATES } from "@/lib/templates";

export const metadata = {
  title: "Curated Wedding Templates & Design Systems",
  description:
    "Explore EverAfter's high-fashion, editorial wedding website templates. From French châteaux to minimalist lofts, each design is responsive, accessible, and 3D crafted.",
};

export default function TemplatesPage() {
  return (
    <div className="bg-neutral-surface min-h-screen py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-16 sm:mb-20">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold uppercase tracking-widest text-primary-deep mb-4 shadow-soft-sm">
            <Sparkles className="h-3.5 w-3.5" />
            Curated Design Systems
          </span>
          <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-neutral-dark">
            Bespoke Templates for Every Love Story
          </h1>
          <p className="mt-4 text-base sm:text-lg text-neutral-mid leading-relaxed font-light">
            Crafted with editorial typography, tactile paper textures, and responsive 3D layouts. Every template is fully customizable with our live Atelier Studio.
          </p>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {TEMPLATES.map((tmpl) => (
            <div
              key={tmpl.id}
              className="group rounded-3xl bg-white border border-border/80 shadow-3d-card overflow-hidden flex flex-col justify-between transition-all duration-500 hover:-translate-y-1.5 hover:shadow-3d-floating hover:border-primary/50"
            >
              <div>
                {/* Cover Image & Category Pill */}
                <div className="relative aspect-[16/10] overflow-hidden bg-neutral-200">
                  <img
                    src={tmpl.coverImage}
                    alt={tmpl.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-white/95 text-neutral-dark shadow-soft-sm backdrop-blur-sm">
                      {tmpl.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-7 sm:p-8">
                  {/* Swatches */}
                  <div className="flex items-center gap-2 mb-3">
                    {tmpl.palette.map((color) => (
                      <span
                        key={color}
                        className="h-3.5 w-3.5 rounded-full border border-black/10 shadow-sm"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                    <span className="text-[11px] text-neutral-mid ml-2 font-mono">
                      {tmpl.fonts.display}
                    </span>
                  </div>

                  <h3 className="font-display text-2xl font-bold text-neutral-dark group-hover:text-primary-deep transition-colors">
                    {tmpl.name}
                  </h3>
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary-deep mt-0.5 mb-3">
                    {tmpl.vibe}
                  </p>
                  <p className="text-xs sm:text-sm text-neutral-mid leading-relaxed font-light">
                    {tmpl.description}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-7 sm:p-8 pt-0 flex items-center gap-3 border-t border-border/60 mt-4 pt-5">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs font-semibold py-5 border-border hover:bg-neutral-light"
                  asChild
                >
                  <Link href={`/templates/${tmpl.id}`}>
                    <Eye className="h-3.5 w-3.5 mr-1.5 text-primary-deep" />
                    Live Preview
                  </Link>
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  className="flex-1 text-xs font-semibold py-5"
                  asChild
                >
                  <Link href={`/wedding/new?template=${tmpl.id}`}>
                    Use Template
                    <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Customization Callout */}
        <div className="mt-20 p-8 sm:p-12 rounded-3xl bg-neutral-light border border-border/80 shadow-soft-sm flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="space-y-2 max-w-xl">
            <h3 className="font-display text-2xl font-bold text-neutral-dark">
              Want a custom palette or layout?
            </h3>
            <p className="text-xs sm:text-sm text-neutral-mid leading-relaxed">
              Every template can be personalized in the EverAfter Atelier Studio. Change typography, drag and drop sections, add countdown timers, and connect your own domain in minutes.
            </p>
          </div>
          <Button size="lg" asChild className="shrink-0 shadow-soft-md shadow-primary/25">
            <Link href="/wedding/new">
              Create Your Website Now
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
