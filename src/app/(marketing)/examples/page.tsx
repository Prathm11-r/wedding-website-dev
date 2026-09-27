import Link from "next/link";
import { Sparkles, ArrowRight, Eye, Heart, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

const REAL_EXAMPLES = [
  {
    couple: "Geneviève & Julian",
    location: "Château de Chantilly • France",
    date: "September 18, 2027",
    template: "The Grand Château",
    vibe: "French Neoclassical & Champagne Gold",
    image:
      "https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=800&q=80",
    slug: "chateau",
  },
  {
    couple: "Alessia & Matteo",
    location: "Villa La Foce • Tuscany, Italy",
    date: "June 14, 2027",
    template: "Tuscan Garden",
    vibe: "Olive Groves & Travertine Textures",
    image:
      "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80",
    slug: "tuscan",
  },
  {
    couple: "Sienna & Alexander",
    location: "The Pierre Penthouse • New York",
    date: "October 29, 2027",
    template: "Midnight Velvet",
    vibe: "Metropolitan Editorial & Liquid Gold",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    slug: "noir",
  },
  {
    couple: "Camille & Sébastien",
    location: "Hôtel du Cap-Eden-Roc • Antibes",
    date: "July 10, 2027",
    template: "Côte d'Azur",
    vibe: "Mediterranean Azure & Deckle Ivory",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    slug: "riviera",
  },
];

export const metadata = {
  title: "Real Wedding Websites & Couple Invocations",
  description:
    "Explore real wedding websites and celebrations crafted with EverAfter. Live interactive previews with 3D effects, RSVPs, and custom designs.",
};

export default function ExamplesPage() {
  return (
    <div className="bg-neutral-surface min-h-screen py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-16 sm:mb-20">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold uppercase tracking-widest text-primary-deep mb-4 shadow-soft-sm">
            <Heart className="h-3.5 w-3.5 text-primary" />
            Celebrations in the Wild
          </span>
          <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-neutral-dark">
            Real Weddings, Beautifully Told
          </h1>
          <p className="mt-4 text-base sm:text-lg text-neutral-mid leading-relaxed font-light">
            Browse through real celebrations built with EverAfter. Open live previews on your mobile or desktop and experience the tactile elegance firsthand.
          </p>
        </div>

        {/* Examples Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
          {REAL_EXAMPLES.map((ex) => (
            <div
              key={ex.couple}
              className="group rounded-3xl bg-white border border-border/80 shadow-3d-card overflow-hidden flex flex-col justify-between transition-all duration-500 hover:-translate-y-1.5 hover:shadow-3d-floating hover:border-primary/50"
            >
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-neutral-200">
                  <img
                    src={ex.image}
                    alt={ex.couple}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-white/95 text-neutral-dark shadow-soft-sm backdrop-blur-sm">
                      {ex.template}
                    </span>
                  </div>
                </div>

                <div className="p-8">
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-neutral-dark group-hover:text-primary-deep transition-colors">
                    {ex.couple}
                  </h3>
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary-deep mt-1 mb-4">
                    {ex.vibe}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-mid pt-2 border-t border-border/60">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-primary-deep" />
                      {ex.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-primary-deep" />
                      {ex.location}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-8 pt-0 flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs font-semibold py-5 border-border hover:bg-neutral-light"
                  asChild
                >
                  <Link href={`/templates/${ex.slug}`}>
                    <Eye className="h-3.5 w-3.5 mr-1.5 text-primary-deep" />
                    Open Live Site
                  </Link>
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  className="flex-1 text-xs font-semibold py-5"
                  asChild
                >
                  <Link href={`/wedding/new?template=${ex.slug}`}>
                    Start Like This
                    <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
