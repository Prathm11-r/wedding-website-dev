import * as React from "react";
import Link from "next/link";
import { Gift, ExternalLink, Heart, Sparkles, Plane, Home, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { RegistrySectionProps } from "@/types/builder";

const DEFAULT_REGISTRIES = [
  {
    id: "reg-1",
    name: "Amalfi Coast Honeymoon Voyage",
    description: "Contribute to our dream coastal journey, cliffside dinners, and Mediterranean sailing.",
    url: "https://www.zola.com",
    category: "Experience",
    icon: Plane,
  },
  {
    id: "reg-2",
    name: "Williams Sonoma & Le Creuset",
    description: "Curated heirloom cookware and artisanal table settings for our home.",
    url: "https://www.williams-sonoma.com",
    category: "Culinary Atelier",
    icon: Utensils,
  },
  {
    id: "reg-3",
    name: "Crate & Barrel Home Sanctuary",
    description: "Bespoke linen bedding, crystal glassware, and mid-century lighting.",
    url: "https://www.crateandbarrel.com",
    category: "Interior Design",
    icon: Home,
  },
];

export function RegistrySection({
  heading = "Curated Gift Registry",
  subheading = "Your presence is our most cherished present",
  note = "Should you wish to honor us with a gift, we have created a registry of experiences and heirloom items to begin our new life together.",
  registries = [],
}: RegistrySectionProps) {
  const displayRegistries = registries.length > 0
    ? registries.map((r) => ({ ...r, icon: Gift, category: "Registry" }))
    : DEFAULT_REGISTRIES;

  return (
    <section id="registry" className="bg-white py-24 sm:py-32 px-6 border-b border-border/70 relative">
      <div className="max-w-4xl mx-auto text-center">
        {/* Monogram / Icon Crest */}
        <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 text-primary mb-4 shadow-soft-sm">
          <Gift className="h-6 w-6 text-primary-deep" />
        </div>

        <span className="text-xs uppercase tracking-[0.25em] text-primary-deep font-semibold mb-2 block">
          {subheading}
        </span>

        <h2 className="font-display text-3xl sm:text-5xl font-bold text-neutral-dark mb-4">
          {heading}
        </h2>

        {note && (
          <p className="mt-4 text-sm sm:text-base text-neutral-mid max-w-xl mx-auto leading-relaxed font-light mb-14">
            {note}
          </p>
        )}

        {/* Registry Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {displayRegistries.map((reg) => {
            const Icon = (reg as any).icon || Gift;
            return (
              <div
                key={reg.id || reg.name}
                className="bg-neutral-surface p-6 sm:p-8 rounded-3xl border border-border shadow-3d-card flex flex-col justify-between items-center text-center transition-all duration-300 hover:-translate-y-1 hover:border-primary/40"
              >
                <div className="w-full flex flex-col items-center">
                  <div className="h-12 w-12 rounded-2xl bg-white border border-border shadow-soft-sm flex items-center justify-center text-primary-deep mb-4">
                    <Icon className="h-5 w-5" />
                  </div>

                  <span className="text-[10px] font-mono uppercase tracking-widest text-primary-deep mb-1 font-semibold">
                    {(reg as any).category || "Gift Fund"}
                  </span>

                  <h3 className="font-display text-xl font-bold text-neutral-dark mb-2">
                    {reg.name}
                  </h3>

                  {reg.description && (
                    <p className="text-xs text-neutral-mid leading-relaxed mb-6 font-light">
                      {reg.description}
                    </p>
                  )}
                </div>

                <Button variant="outline" className="w-full text-xs font-semibold border-border hover:bg-white" asChild>
                  <Link href={reg.url} target="_blank" rel="noopener noreferrer">
                    View Registry Details
                    <ExternalLink className="h-3.5 w-3.5 ml-2" />
                  </Link>
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
