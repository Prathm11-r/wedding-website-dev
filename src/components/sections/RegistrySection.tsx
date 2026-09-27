import * as React from "react";
import Link from "next/link";
import { Gift, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { RegistrySectionProps } from "@/types/builder";

export function RegistrySection({
  heading = "Gift Registry",
  subheading = "Your presence is our favorite present",
  note,
  registries = [],
}: RegistrySectionProps) {
  return (
    <section id="registry" className="bg-neutral-light py-20 sm:py-28 px-6 border-b border-border/60">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 text-primary mb-4">
          <Gift className="h-6 w-6" />
        </div>

        <h2 className="font-display text-3xl sm:text-4xl font-bold text-neutral-dark">
          {heading}
        </h2>
        {subheading && (
          <p className="mt-2 text-sm text-neutral-mid">{subheading}</p>
        )}

        {note && (
          <p className="mt-6 text-sm sm:text-base text-neutral-mid max-w-xl mx-auto leading-relaxed">
            {note}
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12 max-w-2xl mx-auto">
          {registries.map((reg) => (
            <div
              key={reg.id || reg.name}
              className="bg-white p-6 sm:p-8 rounded-2xl border border-border shadow-soft-sm flex flex-col justify-between items-center text-center"
            >
              <div>
                <h3 className="font-display text-xl font-bold text-neutral-dark mb-2">
                  {reg.name}
                </h3>
                {reg.description && (
                  <p className="text-sm text-neutral-mid mb-6">{reg.description}</p>
                )}
              </div>

              <Button variant="outline" className="w-full" asChild>
                <Link href={reg.url} target="_blank" rel="noopener noreferrer">
                  View Registry
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
