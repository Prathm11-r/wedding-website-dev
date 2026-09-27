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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionRenderer } from "@/components/sections/SectionRenderer";
import { DEFAULT_PAGE_SECTIONS, type PageSectionModel, type SectionType } from "@/types/builder";

export default function WebsiteBuilderPage() {
  const [sections, setSections] = React.useState<PageSectionModel[]>(DEFAULT_PAGE_SECTIONS);
  const [activeSectionId, setActiveSectionId] = React.useState<string>("sec-hero");
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

    // Update sort_order
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

    // Simulate saving to database
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 600);
  };

  return (
    <div className="flex h-[calc(100vh-5rem)] flex-col -m-6 lg:-m-8">
      {/* ── Top Bar ───────────────────────────────────────────────────────── */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-white px-6">
        <div className="flex items-center gap-3">
          <Globe className="h-5 w-5 text-primary" />
          <h1 className="font-display text-lg font-bold text-neutral-dark">
            Website Builder & Customizer
          </h1>
          <span className="hidden sm:inline-block rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-700 ring-1 ring-green-200">
            Auto-Draft Saved
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Device toggle */}
          <div className="hidden sm:flex items-center rounded-lg border border-border p-0.5 bg-neutral-light">
            <button
              onClick={() => setPreviewDevice("desktop")}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                previewDevice === "desktop"
                  ? "bg-white text-neutral-dark shadow-sm"
                  : "text-neutral-mid hover:text-neutral-dark"
              }`}
              title="Desktop preview"
            >
              <Laptop className="h-4 w-4" />
            </button>
            <button
              onClick={() => setPreviewDevice("mobile")}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                previewDevice === "mobile"
                  ? "bg-white text-neutral-dark shadow-sm"
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
          >
            <Link href="/wedding/sarah-and-james" target="_blank" rel="noopener noreferrer">
              View Live Site
              <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </Button>

          <Button
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
          >
            {saveSuccess ? (
              <>
                <CheckCircle className="mr-1.5 h-4 w-4 text-green-400" />
                Published!
              </>
            ) : (
              <>
                <Save className="mr-1.5 h-4 w-4" />
                {isSaving ? "Saving..." : "Save & Publish"}
              </>
            )}
          </Button>
        </div>
      </header>

      {/* ── Main Workspace ─────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel: Sections List & Inspector */}
        <div className="w-80 sm:w-96 flex flex-col border-r border-border bg-white overflow-y-auto">
          {/* Section List Accordion */}
          <div className="p-4 border-b border-border bg-neutral-light/40">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-mid">
                Page Sections ({sections.length})
              </h2>
            </div>

            <div className="space-y-1.5">
              {sections.map((sec, idx) => (
                <div
                  key={sec.id}
                  onClick={() => setActiveSectionId(sec.id)}
                  className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm cursor-pointer transition-all ${
                    activeSectionId === sec.id
                      ? "bg-primary/10 border border-primary text-primary-dark font-medium shadow-soft-sm"
                      : "hover:bg-neutral-light border border-transparent text-neutral-dark"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="text-xs uppercase px-1.5 py-0.5 rounded bg-neutral-200 text-neutral-700 font-mono text-[10px]">
                      {sec.type}
                    </span>
                    <span className="truncate">
                      {(sec.props as any).heading || (sec.props as any).headline || sec.type}
                    </span>
                  </div>

                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => moveSection(idx, "up")}
                      disabled={idx === 0}
                      className="p-1 text-neutral-mid hover:text-neutral-dark disabled:opacity-30"
                      title="Move up"
                    >
                      <MoveUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => moveSection(idx, "down")}
                      disabled={idx === sections.length - 1}
                      className="p-1 text-neutral-mid hover:text-neutral-dark disabled:opacity-30"
                      title="Move down"
                    >
                      <MoveDown className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => toggleVisibility(sec.id)}
                      className={`p-1 ${sec.is_visible ? "text-primary" : "text-neutral-300"}`}
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
          <div className="p-5 flex-1 space-y-4">
            <div className="border-b border-border pb-3">
              <span className="text-xs uppercase font-semibold text-primary tracking-wider">
                Editing Section
              </span>
              <h3 className="font-display text-xl font-bold text-neutral-dark capitalize mt-0.5">
                {activeSection.type.replace("_", " ")}
              </h3>
            </div>

            {/* Dynamic Form fields based on section type */}
            {activeSection.type === "hero" && (
              <div className="space-y-4 text-sm">
                <div>
                  <label className="block font-medium text-neutral-dark mb-1">Headline</label>
                  <input
                    type="text"
                    value={(activeSection.props as any).headline || ""}
                    onChange={(e) => updateActiveProp("headline", e.target.value)}
                    className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-dark mb-1">Subheadline</label>
                  <input
                    type="text"
                    value={(activeSection.props as any).subheadline || ""}
                    onChange={(e) => updateActiveProp("subheadline", e.target.value)}
                    className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-dark mb-1">Date Display</label>
                  <input
                    type="text"
                    value={(activeSection.props as any).date_text || ""}
                    onChange={(e) => updateActiveProp("date_text", e.target.value)}
                    className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-dark mb-1">Location Display</label>
                  <input
                    type="text"
                    value={(activeSection.props as any).location_text || ""}
                    onChange={(e) => updateActiveProp("location_text", e.target.value)}
                    className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-dark mb-1">Button Text</label>
                  <input
                    type="text"
                    value={(activeSection.props as any).cta_text || ""}
                    onChange={(e) => updateActiveProp("cta_text", e.target.value)}
                    className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            )}

            {activeSection.type === "our_story" && (
              <div className="space-y-4 text-sm">
                <div>
                  <label className="block font-medium text-neutral-dark mb-1">Section Heading</label>
                  <input
                    type="text"
                    value={(activeSection.props as any).heading || ""}
                    onChange={(e) => updateActiveProp("heading", e.target.value)}
                    className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-dark mb-1">Subheading</label>
                  <input
                    type="text"
                    value={(activeSection.props as any).subheading || ""}
                    onChange={(e) => updateActiveProp("subheading", e.target.value)}
                    className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-dark mb-1">Your Story</label>
                  <textarea
                    rows={5}
                    value={(activeSection.props as any).body || ""}
                    onChange={(e) => updateActiveProp("body", e.target.value)}
                    className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            )}

            {activeSection.type === "countdown" && (
              <div className="space-y-4 text-sm">
                <div>
                  <label className="block font-medium text-neutral-dark mb-1">Heading</label>
                  <input
                    type="text"
                    value={(activeSection.props as any).heading || ""}
                    onChange={(e) => updateActiveProp("heading", e.target.value)}
                    className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-dark mb-1">Subheading</label>
                  <input
                    type="text"
                    value={(activeSection.props as any).subheading || ""}
                    onChange={(e) => updateActiveProp("subheading", e.target.value)}
                    className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            )}

            {activeSection.type === "rsvp" && (
              <div className="space-y-4 text-sm">
                <div>
                  <label className="block font-medium text-neutral-dark mb-1">Heading</label>
                  <input
                    type="text"
                    value={(activeSection.props as any).heading || ""}
                    onChange={(e) => updateActiveProp("heading", e.target.value)}
                    className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-dark mb-1">Subheading</label>
                  <input
                    type="text"
                    value={(activeSection.props as any).subheading || ""}
                    onChange={(e) => updateActiveProp("subheading", e.target.value)}
                    className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-dark mb-1">RSVP Deadline Text</label>
                  <input
                    type="text"
                    value={(activeSection.props as any).deadline_text || ""}
                    onChange={(e) => updateActiveProp("deadline_text", e.target.value)}
                    placeholder="e.g. May 1st, 2027"
                    className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Live Dynamic Preview Canvas */}
        <div className="flex-1 bg-neutral-100 overflow-y-auto p-4 sm:p-8 flex justify-center items-start">
          <div
            className={`transition-all duration-300 bg-white shadow-soft-xl rounded-2xl overflow-hidden border border-border ${
              previewDevice === "mobile"
                ? "w-[375px] my-4 ring-8 ring-neutral-dark/10 rounded-[36px]"
                : "w-full max-w-4xl"
            }`}
          >
            <div className="bg-neutral-light border-b border-border/60 px-4 py-2 flex items-center justify-between text-xs text-neutral-mid">
              <span className="font-mono">Live Site Preview</span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                Synchronized
              </span>
            </div>
            <SectionRenderer sections={sections} weddingSlug="preview" />
          </div>
        </div>
      </div>
    </div>
  );
}
