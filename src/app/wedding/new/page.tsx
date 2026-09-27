"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Heart,
  Calendar,
  MapPin,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Globe,
  Loader2,
  Palette,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TEMPLATES } from "@/lib/templates";

function WeddingNewWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTemplate = searchParams.get("template") || "chateau";

  const [step, setStep] = React.useState<number>(1);
  const [partnerOne, setPartnerOne] = React.useState("Sarah Jenkins");
  const [partnerTwo, setPartnerTwo] = React.useState("James Miller");
  const [weddingDate, setWeddingDate] = React.useState("2027-06-19");
  const [location, setLocation] = React.useState("Napa Valley, California");
  const [selectedTemplate, setSelectedTemplate] = React.useState(initialTemplate);
  const [subdomain, setSubdomain] = React.useState("sarah-and-james");
  const [isLoading, setIsLoading] = React.useState(false);

  // Auto-generate subdomain from partner names
  React.useEffect(() => {
    if (partnerOne && partnerTwo) {
      const p1 = partnerOne.trim().split(" ")[0].toLowerCase();
      const p2 = partnerTwo.trim().split(" ")[0].toLowerCase();
      setSubdomain(`${p1}-and-${p2}`);
    }
  }, [partnerOne, partnerTwo]);

  const handleLaunch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate creation in Supabase
    setTimeout(() => {
      setIsLoading(false);
      router.push(`/website`);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-neutral-surface flex flex-col justify-center items-center px-6 py-16">
      <div className="max-w-xl w-full bg-white p-8 sm:p-12 rounded-3xl border border-border/80 shadow-3d-card relative">
        {/* Subtle deckle border */}
        <div className="absolute inset-2 rounded-2xl border border-dashed border-[#DFB76C]/30 pointer-events-none" />

        {/* Intaglio Monogram Crest */}
        <div className="flex justify-center -mt-4 mb-6">
          <div
            className="relative h-14 w-14 rounded-full flex items-center justify-center shadow-wax-seal"
            style={{
              background: "radial-gradient(circle at 35% 35%, #F4EBD9 0%, #C9A96E 50%, #8A6424 100%)",
            }}
          >
            <div className="w-11 h-11 rounded-full border border-white/40 flex items-center justify-center p-1">
              <span className="font-display font-bold text-xs tracking-wider text-[#2B1D08]">
                EA
              </span>
            </div>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                step >= s ? "w-8 bg-primary" : "w-4 bg-neutral-200"
              }`}
            />
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <span className="text-xs uppercase tracking-widest text-primary-deep font-semibold block mb-1">
                Step 1 of 3
              </span>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-neutral-dark">
                Who is celebrating?
              </h1>
              <p className="text-xs sm:text-sm text-neutral-mid mt-1 font-light">
                Enter your names as you would like them to appear on invitations.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-dark mb-1.5">
                  Partner One Full Name
                </label>
                <input
                  type="text"
                  value={partnerOne}
                  onChange={(e) => setPartnerOne(e.target.value)}
                  placeholder="e.g. Geneviève Laurent"
                  className="w-full rounded-xl border border-border px-4 py-2.5 text-neutral-dark text-sm bg-neutral-surface focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-dark mb-1.5">
                  Partner Two Full Name
                </label>
                <input
                  type="text"
                  value={partnerTwo}
                  onChange={(e) => setPartnerTwo(e.target.value)}
                  placeholder="e.g. Julian Montgomery"
                  className="w-full rounded-xl border border-border px-4 py-2.5 text-neutral-dark text-sm bg-neutral-surface focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <Button
              className="w-full py-5 text-xs uppercase tracking-widest font-semibold mt-4 shadow-soft-md"
              onClick={() => setStep(2)}
              disabled={!partnerOne || !partnerTwo}
            >
              Continue to Wedding Details
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <span className="text-xs uppercase tracking-widest text-primary-deep font-semibold block mb-1">
                Step 2 of 3
              </span>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-neutral-dark">
                When & Where?
              </h1>
              <p className="text-xs sm:text-sm text-neutral-mid mt-1 font-light">
                You can always adjust or refine these dates later in your settings.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-dark mb-1.5">
                  Wedding Date
                </label>
                <input
                  type="date"
                  value={weddingDate}
                  onChange={(e) => setWeddingDate(e.target.value)}
                  className="w-full rounded-xl border border-border px-4 py-2.5 text-neutral-dark text-sm bg-neutral-surface focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-dark mb-1.5">
                  Venue or Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Château de Chantilly • Oise, France"
                  className="w-full rounded-xl border border-border px-4 py-2.5 text-neutral-dark text-sm bg-neutral-surface focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <Button
                variant="outline"
                className="w-1/3 py-5 text-xs font-semibold"
                onClick={() => setStep(1)}
              >
                <ArrowLeft className="h-4 w-4 mr-1.5" />
                Back
              </Button>
              <Button
                className="w-2/3 py-5 text-xs uppercase tracking-widest font-semibold shadow-soft-md"
                onClick={() => setStep(3)}
              >
                Choose Design Template
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <form onSubmit={handleLaunch} className="space-y-6">
            <div className="text-center">
              <span className="text-xs uppercase tracking-widest text-primary-deep font-semibold block mb-1">
                Step 3 of 3
              </span>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-neutral-dark">
                Select Your Aesthetic
              </h1>
              <p className="text-xs sm:text-sm text-neutral-mid mt-1 font-light">
                Pick your signature theme and your personalized link.
              </p>
            </div>

            {/* Template Selector Radio Cards */}
            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {TEMPLATES.map((tmpl) => (
                <div
                  key={tmpl.id}
                  onClick={() => setSelectedTemplate(tmpl.id)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    selectedTemplate === tmpl.id
                      ? "border-primary bg-primary/10 shadow-soft-sm"
                      : "border-border hover:bg-neutral-light bg-neutral-surface"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl overflow-hidden shrink-0 bg-neutral-200">
                      <img
                        src={tmpl.coverImage}
                        alt={tmpl.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-display text-sm font-bold text-neutral-dark">
                        {tmpl.name}
                      </h4>
                      <p className="text-[11px] text-neutral-mid">{tmpl.vibe}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {tmpl.palette.slice(0, 3).map((c) => (
                        <span
                          key={c}
                          className="h-2.5 w-2.5 rounded-full border border-black/10"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                    {selectedTemplate === tmpl.id && (
                      <CheckCircle2 className="h-4 w-4 text-primary-deep" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Subdomain Input */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-dark mb-1.5">
                Your Free Website Link
              </label>
              <div className="flex items-center rounded-xl border border-border bg-neutral-surface px-3 py-2 text-xs">
                <Globe className="h-4 w-4 text-primary-deep mr-2 shrink-0" />
                <input
                  type="text"
                  value={subdomain}
                  onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                  className="bg-transparent focus:outline-none font-semibold text-neutral-dark w-full"
                />
                <span className="text-neutral-mid font-mono shrink-0">.everafter.com</span>
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <Button
                type="button"
                variant="outline"
                className="w-1/3 py-5 text-xs font-semibold"
                onClick={() => setStep(2)}
              >
                <ArrowLeft className="h-4 w-4 mr-1.5" />
                Back
              </Button>
              <Button
                type="submit"
                className="w-2/3 py-5 text-xs uppercase tracking-widest font-semibold shadow-soft-xl shadow-primary/25"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Launching Atelier...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Launch Wedding Website
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function WeddingNewPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-neutral-surface flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
      <WeddingNewWizard />
    </React.Suspense>
  );
}
