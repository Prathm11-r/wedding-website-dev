"use client";

import * as React from "react";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
  Plus,
  Save,
  Globe,
  Sparkles,
  ExternalLink,
  Laptop,
  Smartphone,
  CheckCircle,
  Palette,
  Layers,
  Lock,
  RotateCcw,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionRenderer } from "@/components/sections/SectionRenderer";
import { DEFAULT_PAGE_SECTIONS, type PageSectionModel } from "@/types/builder";

type ThemePreset = "chateau" | "tuscan" | "noir";

const THEME_PRESETS: Record<ThemePreset, { name: string; tag: string; bg: string; primary: string; border: string }> = {
  chateau: {
    name: "The Grand Château",
    tag: "Neoclassical & Gold",
    bg: "bg-[#FBF9F5]",
    primary: "#C9A96E",
    border: "border-[#DFB76C]/60",
  },
  tuscan: {
    name: "Tuscan Garden",
    tag: "Olive & Travertine",
    bg: "bg-[#F5F7F3]",
    primary: "#7A8F74",
    border: "border-[#8FA389]/60",
  },
  noir: {
    name: "Midnight Velvet",
    tag: "Metropolitan Editorial",
    bg: "bg-[#141316]",
    primary: "#ECC880",
    border: "border-[#ECC880]/50",
  },
};

export default function WebsiteBuilderPage() {
  const [sections, setSections] = React.useState<PageSectionModel[]>(DEFAULT_PAGE_SECTIONS);
  const [activeSectionId, setActiveSectionId] = React.useState<string>("sec-hero");
  const [activeTheme, setActiveTheme] = React.useState<ThemePreset>("chateau");
  const [previewDevice, setPreviewDevice] = React.useState<"desktop" | "mobile">("desktop");
  const [isSaving, setIsSaving] = React.useState(false);
  const [saveSuccess, setSaveSuccess] = React.useState(false);

  const activeSection = sections.find((s) => s.id === activeSectionId) || sections[0];

  const moveSection = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const newSections = [...sections];
    const [moved] = newSections.splice(index, 1);
    newSections.splice(targetIndex, 0, moved);

    const updated = newSections.map((sec, idx) => ({ ...sec, sort_order: idx }));
    setSections(updated);
  };

  const toggleVisibility = (id: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, is_visible: !s.is_visible } : s))
    );
  };

  const updateActiveProp = (key: string, value: any) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === activeSectionId
          ? {
              ...s,
              props: {
                ...(s.props as any),
                [key]: value,
              },
            }
          : s
      )
    );
  };

  const handleSave = () => {
    setIsSaving(true);
    setSaveSuccess(false);

    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 700);
  };

  return (
    <div className="flex h-[calc(100vh-5rem)] flex-col -m-6 lg:-m-8 bg-[#F8F7F4]">
      {/* ── Top Bar ───────────────────────────────────────────────────────── */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-border/80 bg-white px-6 z-20 shadow-soft-sm">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#ECC880] to-[#9F7A38] p-[1.5px] flex items-center justify-center text-xs font-bold text-white shadow-soft-sm">
            EA
          </div>
          <div>
            <h1 className="font-display text-base font-bold text-neutral-dark flex items-center gap-2">
              EverAfter Atelier Studio
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Live Sync
              </span>
            </h1>
          </div>
        </div>

        {/* Theme presets bar in header */}
        <div className="hidden md:flex items-center gap-2 p-1 rounded-full bg-neutral-light border border-border">
          {(["chateau", "tuscan", "noir"] as ThemePreset[]).map((key) => {
            const t = THEME_PRESETS[key];
            const isSelected = activeTheme === key;
            return (
              <button
                key={key}
                onClick={() => setActiveTheme(key)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-white text-neutral-dark shadow-soft-sm font-semibold"
                    : "text-neutral-mid hover:text-neutral-dark"
                }`}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: t.primary }}
                />
                {t.name}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          {/* Device Toggle */}
          <div className="flex items-center rounded-xl border border-border p-1 bg-neutral-light">
            <button
              onClick={() => setPreviewDevice("desktop")}
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                previewDevice === "desktop"
                  ? "bg-white text-neutral-dark shadow-soft-sm"
                  : "text-neutral-mid hover:text-neutral-dark"
              }`}
              title="Desktop preview"
            >
              <Laptop className="h-4 w-4" />
            </button>
            <button
              onClick={() => setPreviewDevice("mobile")}
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                previewDevice === "mobile"
                  ? "bg-white text-neutral-dark shadow-soft-sm"
                  : "text-neutral-mid hover:text-neutral-dark"
              }`}
              title="Mobile preview"
            >
              <Smartphone className="h-4 w-4" />
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            asChild
            className="hidden sm:inline-flex border-border/80"
          >
            <Link href="/wedding/sarah-and-james" target="_blank" rel="noopener noreferrer">
              Open Public Site
              <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </Button>

          <Button
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
            className="shadow-soft-md shadow-primary/20"
          >
            {saveSuccess ? (
              <>
                <CheckCircle className="mr-1.5 h-4 w-4 text-emerald-400" />
                Published to CDN!
              </>
            ) : (
              <>
                <Save className="mr-1.5 h-4 w-4" />
                {isSaving ? "Publishing..." : "Save & Publish"}
              </>
            )}
          </Button>
        </div>
      </header>

      {/* ── Main Studio Workspace ─────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel: Sections List & Property Inspector */}
        <div className="w-80 sm:w-96 flex flex-col border-r border-border/80 bg-white overflow-y-auto shrink-0 shadow-soft-sm">
          {/* Section List Accordion */}
          <div className="p-4 border-b border-border bg-neutral-light/50">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-mid flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-primary-deep" />
                Active Sections ({sections.length})
              </span>
              <span className="text-[11px] text-primary-deep font-semibold">
                Drag or Reorder
              </span>
            </div>

            <div className="space-y-1.5">
              {sections.map((sec, idx) => (
                <div
                  key={sec.id}
                  onClick={() => setActiveSectionId(sec.id)}
                  className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm cursor-pointer transition-all ${
                    activeSectionId === sec.id
                      ? "bg-primary/10 border border-primary text-primary-deep font-semibold shadow-soft-sm"
                      : "hover:bg-neutral-light border border-transparent text-neutral-dark"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-neutral-200 text-neutral-700">
                      {sec.type}
                    </span>
                    <span className="truncate text-xs">
                      {(sec.props as any).heading || (sec.props as any).headline || sec.type}
                    </span>
                  </div>

                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => moveSection(idx, "up")}
                      disabled={idx === 0}
                      className="p-1 text-neutral-mid hover:text-neutral-dark disabled:opacity-20"
                      title="Move up"
                    >
                      <MoveUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => moveSection(idx, "down")}
                      disabled={idx === sections.length - 1}
                      className="p-1 text-neutral-mid hover:text-neutral-dark disabled:opacity-20"
                      title="Move down"
                    >
                      <MoveDown className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => toggleVisibility(sec.id)}
                      className={`p-1 ${sec.is_visible ? "text-primary-deep" : "text-neutral-300"}`}
                      title={sec.is_visible ? "Hide section" : "Show section"}
                    >
                      {sec.is_visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section Property Editor / Inspector */}
          <div className="p-5 flex-1 space-y-5">
            <div className="border-b border-border pb-3">
              <span className="text-[11px] uppercase font-semibold text-primary-deep tracking-wider block">
                Section Inspector
              </span>
              <h3 className="font-display text-xl font-bold text-neutral-dark capitalize mt-0.5">
                {activeSection.type.replace("_", " ")}
              </h3>
            </div>

            {/* Dynamic Form fields based on section type */}
            {activeSection.type === "hero" && (
              <div className="space-y-4 text-xs sm:text-sm">
                <div>
                  <label className="block font-medium text-neutral-dark mb-1">Couple Headline</label>
                  <input
                    type="text"
                    value={(activeSection.props as any).headline || ""}
                    onChange={(e) => updateActiveProp("headline", e.target.value)}
                    className="w-full rounded-xl border border-border px-3.5 py-2 text-xs focus:border-primary focus:outline-none bg-neutral-surface"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-dark mb-1">Subheadline / Eyebrow</label>
                  <input
                    type="text"
                    value={(activeSection.props as any).subheadline || ""}
                    onChange={(e) => updateActiveProp("subheadline", e.target.value)}
                    className="w-full rounded-xl border border-border px-3.5 py-2 text-xs focus:border-primary focus:outline-none bg-neutral-surface"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-dark mb-1">Wedding Date Text</label>
                  <input
                    type="text"
                    value={(activeSection.props as any).date_text || ""}
                    onChange={(e) => updateActiveProp("date_text", e.target.value)}
                    className="w-full rounded-xl border border-border px-3.5 py-2 text-xs focus:border-primary focus:outline-none bg-neutral-surface"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-dark mb-1">Location Text</label>
                  <input
                    type="text"
                    value={(activeSection.props as any).location_text || ""}
                    onChange={(e) => updateActiveProp("location_text", e.target.value)}
                    className="w-full rounded-xl border border-border px-3.5 py-2 text-xs focus:border-primary focus:outline-none bg-neutral-surface"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-dark mb-1">RSVP Button Label</label>
                  <input
                    type="text"
                    value={(activeSection.props as any).cta_text || ""}
                    onChange={(e) => updateActiveProp("cta_text", e.target.value)}
                    className="w-full rounded-xl border border-border px-3.5 py-2 text-xs focus:border-primary focus:outline-none bg-neutral-surface"
                  />
                </div>
              </div>
            )}

            {activeSection.type === "our_story" && (
              <div className="space-y-4 text-xs sm:text-sm">
                <div>
                  <label className="block font-medium text-neutral-dark mb-1">Section Heading</label>
                  <input
                    type="text"
                    value={(activeSection.props as any).heading || ""}
                    onChange={(e) => updateActiveProp("heading", e.target.value)}
                    className="w-full rounded-xl border border-border px-3.5 py-2 text-xs focus:border-primary focus:outline-none bg-neutral-surface"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-dark mb-1">Subheading</label>
                  <input
                    type="text"
                    value={(activeSection.props as any).subheading || ""}
                    onChange={(e) => updateActiveProp("subheading", e.target.value)}
                    className="w-full rounded-xl border border-border px-3.5 py-2 text-xs focus:border-primary focus:outline-none bg-neutral-surface"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-dark mb-1">Your Story Narrative</label>
                  <textarea
                    rows={6}
                    value={(activeSection.props as any).body || ""}
                    onChange={(e) => updateActiveProp("body", e.target.value)}
                    className="w-full rounded-xl border border-border px-3.5 py-2 text-xs focus:border-primary focus:outline-none bg-neutral-surface leading-relaxed"
                  />
                </div>
              </div>
            )}

            {activeSection.type === "countdown" && (
              <div className="space-y-4 text-xs sm:text-sm">
                <div>
                  <label className="block font-medium text-neutral-dark mb-1">Heading</label>
                  <input
                    type="text"
                    value={(activeSection.props as any).heading || ""}
                    onChange={(e) => updateActiveProp("heading", e.target.value)}
                    className="w-full rounded-xl border border-border px-3.5 py-2 text-xs focus:border-primary focus:outline-none bg-neutral-surface"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-dark mb-1">Subheading</label>
                  <input
                    type="text"
                    value={(activeSection.props as any).subheading || ""}
                    onChange={(e) => updateActiveProp("subheading", e.target.value)}
                    className="w-full rounded-xl border border-border px-3.5 py-2 text-xs focus:border-primary focus:outline-none bg-neutral-surface"
                  />
                </div>
              </div>
            )}

            {activeSection.type === "rsvp" && (
              <div className="space-y-4 text-xs sm:text-sm">
                <div>
                  <label className="block font-medium text-neutral-dark mb-1">Heading</label>
                  <input
                    type="text"
                    value={(activeSection.props as any).heading || ""}
                    onChange={(e) => updateActiveProp("heading", e.target.value)}
                    className="w-full rounded-xl border border-border px-3.5 py-2 text-xs focus:border-primary focus:outline-none bg-neutral-surface"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-dark mb-1">Subheading</label>
                  <input
                    type="text"
                    value={(activeSection.props as any).subheading || ""}
                    onChange={(e) => updateActiveProp("subheading", e.target.value)}
                    className="w-full rounded-xl border border-border px-3.5 py-2 text-xs focus:border-primary focus:outline-none bg-neutral-surface"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-dark mb-1">RSVP Deadline Text</label>
                  <input
                    type="text"
                    value={(activeSection.props as any).deadline_text || ""}
                    onChange={(e) => updateActiveProp("deadline_text", e.target.value)}
                    placeholder="e.g. August 1st, 2027"
                    className="w-full rounded-xl border border-border px-3.5 py-2 text-xs focus:border-primary focus:outline-none bg-neutral-surface"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Live Realistic 3D Device Frame & Synchronized Preview */}
        <div className="flex-1 bg-[#EFECE6] overflow-y-auto p-4 sm:p-10 flex justify-center items-start">
          <div
            className={`transition-all duration-500 bg-white shadow-3d-floating overflow-hidden ${
              previewDevice === "mobile"
                ? "w-[390px] my-6 rounded-[48px] border-[10px] border-neutral-900 ring-4 ring-neutral-300 shadow-2xl"
                : "w-full max-w-5xl rounded-3xl border border-border"
            }`}
          >
            {/* Realistic Device Chrome */}
            {previewDevice === "desktop" ? (
              <div className="bg-neutral-100 border-b border-border/80 px-4 py-3 flex items-center justify-between text-xs text-neutral-mid">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-red-400" />
                    <span className="h-3 w-3 rounded-full bg-amber-400" />
                    <span className="h-3 w-3 rounded-full bg-emerald-400" />
                  </div>
                </div>

                <div className="flex items-center justify-center gap-1.5 bg-white border border-border rounded-lg py-1 px-4 text-[11px] font-mono text-neutral-dark shadow-inner min-w-[280px]">
                  <Lock className="h-3 w-3 text-emerald-600" />
                  <span className="text-emerald-700">https://</span>
                  <span>sarah-and-james.everafter.com</span>
                </div>

                <span className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-600">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live Preview
                </span>
              </div>
            ) : (
              <div className="bg-neutral-900 text-white px-6 pt-3 pb-2 flex items-center justify-between text-xs">
                <span className="font-mono text-[11px]">9:41</span>
                {/* Dynamic island */}
                <div className="h-4 w-24 bg-black rounded-full" />
                <span className="text-[10px] font-mono">5G 100%</span>
              </div>
            )}

            {/* Rendered Live Website Canvas */}
            <div className={`overflow-x-hidden ${THEME_PRESETS[activeTheme].bg}`}>
              <SectionRenderer sections={sections} weddingSlug="preview" />
            </div>

            {/* Mobile Home Bar */}
            {previewDevice === "mobile" && (
              <div className="bg-neutral-900 py-3 flex justify-center">
                <div className="h-1 w-32 bg-white/40 rounded-full" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
