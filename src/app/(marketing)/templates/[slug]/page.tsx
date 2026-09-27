"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Laptop,
  Smartphone,
  Sparkles,
  ArrowRight,
  Check,
  Lock,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionRenderer } from "@/components/sections/SectionRenderer";
import { getTemplateById, TEMPLATES } from "@/lib/templates";

export default function TemplatePreviewPage() {
  const params = useParams();
  const router = useRouter();
  const slug = (params?.slug as string) || "chateau";

  const template = getTemplateById(slug) || TEMPLATES[0];
  const [device, setDevice] = React.useState<"desktop" | "mobile">("desktop");

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F1EA]">
      {/* ── Sticky Template Viewer Header ───────────────────────────────────── */}
      <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center justify-between border-b border-border/80 bg-white/95 backdrop-blur-md px-4 sm:px-8 shadow-soft-sm">
        {/* Left: Back & Template Info */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-xs font-semibold text-neutral-dark hover:text-primary-deep"
          >
            <Link href="/templates">
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              <span className="hidden sm:inline">All Templates</span>
            </Link>
          </Button>

          <div className="h-5 w-px bg-border hidden sm:block" />

          <div className="flex items-center gap-2">
            <h1 className="font-display font-bold text-base sm:text-lg text-neutral-dark">
              {template.name}
            </h1>
            <span className="hidden md:inline-block text-[10px] uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary-deep border border-primary/20">
              {template.category}
            </span>
          </div>

          {/* Palette Swatches */}
          <div className="hidden lg:flex items-center gap-1.5 ml-2">
            {template.palette.map((color) => (
              <span
                key={color}
                className="h-3 w-3 rounded-full border border-black/10"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Center: Device Toggle */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-neutral-light border border-border">
          <button
            onClick={() => setDevice("desktop")}
            className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
              device === "desktop"
                ? "bg-white text-neutral-dark shadow-soft-sm"
                : "text-neutral-mid hover:text-neutral-dark"
            }`}
            title="Desktop View"
          >
            <Laptop className="h-4 w-4" />
          </button>
          <button
            onClick={() => setDevice("mobile")}
            className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
              device === "mobile"
                ? "bg-white text-neutral-dark shadow-soft-sm"
                : "text-neutral-mid hover:text-neutral-dark"
            }`}
            title="Mobile View"
          >
            <Smartphone className="h-4 w-4" />
          </button>
        </div>

        {/* Right: CTA to use template */}
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            className="shadow-soft-md shadow-primary/25 text-xs font-semibold px-4"
            asChild
          >
            <Link href={`/wedding/new?template=${template.id}`}>
              Use This Template
              <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
            </Link>
          </Button>
        </div>
      </header>

      {/* ── Main Viewport Canvas ───────────────────────────────────────────── */}
      <main className="flex-1 flex justify-center items-start overflow-y-auto p-0 sm:p-6 lg:p-8">
        {device === "desktop" ? (
          <div className="w-full bg-white shadow-soft-lg min-h-screen">
            <SectionRenderer
              sections={template.sections}
              weddingSlug={`demo-${template.id}`}
            />
          </div>
        ) : (
          <div className="my-6 w-[390px] rounded-[48px] border-[10px] border-neutral-900 bg-white shadow-3d-floating overflow-hidden ring-4 ring-neutral-300">
            {/* iPhone Dynamic Island Header */}
            <div className="bg-neutral-900 text-white px-6 pt-3 pb-2 flex items-center justify-between text-xs select-none">
              <span className="font-mono text-[11px]">9:41</span>
              <div className="h-4 w-24 bg-black rounded-full" />
              <span className="text-[10px] font-mono">5G 100%</span>
            </div>

            {/* Mobile Scrollable Viewport */}
            <div className="max-h-[750px] overflow-y-auto">
              <SectionRenderer
                sections={template.sections}
                weddingSlug={`demo-${template.id}`}
              />
            </div>

            {/* iPhone Home Bar */}
            <div className="bg-neutral-900 py-3 flex justify-center">
              <div className="h-1 w-32 bg-white/40 rounded-full" />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
