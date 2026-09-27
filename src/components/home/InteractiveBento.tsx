"use client";

import * as React from "react";
import {
  Heart,
  CheckCircle2,
  Users,
  ShieldCheck,
  Lock,
  Sparkles,
  Camera,
  Utensils,
  ChevronRight,
  Send,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function InteractiveBento() {
  // RSVP Simulator State
  const [rsvpAttending, setRsvpAttending] = React.useState<boolean>(true);
  const [selectedMeal, setSelectedMeal] = React.useState<string>("Chilean Sea Bass");
  const [plusOne, setPlusOne] = React.useState<boolean>(true);
  const [rsvpSubmitted, setRsvpSubmitted] = React.useState<boolean>(false);

  // Seating Table State
  const [activeSeat, setActiveSeat] = React.useState<number>(1);

  // Custom Domain Simulator State
  const [domainMode, setDomainMode] = React.useState<"subdomain" | "custom">("custom");

  const seats = [
    { id: 1, name: "Geneviève D. (Bride)", role: "Bride", meal: "Sea Bass" },
    { id: 2, name: "Julian M. (Groom)", role: "Groom", meal: "Truffle Tart" },
    { id: 3, name: "Clara Vance", role: "Maid of Honor", meal: "Vegan" },
    { id: 4, name: "Henry Thorne", role: "Best Man", meal: "Sea Bass" },
    { id: 5, name: "Beatrice Laurent", role: "Bridesmaid", meal: "Sea Bass" },
    { id: 6, name: "Marcus Sterling", role: "Groomsman", meal: "GF Ribeye" },
    { id: 7, name: "Eleanor Vance", role: "Family", meal: "Truffle Tart" },
    { id: 8, name: "William Vance", role: "Family", meal: "Sea Bass" },
  ];

  return (
    <section id="features" className="py-24 px-6 sm:py-32 bg-neutral-surface border-y border-border/70 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="mx-auto max-w-7xl relative z-10">
        {/* Section Heading */}
        <div className="mx-auto max-w-3xl text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold uppercase tracking-widest text-primary-deep mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            Tactile Architectural Tools
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-neutral-dark">
            Crafted for pure elegance. <br />
            <span className="text-gold-gradient">Engineered for seamless precision.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-neutral-mid leading-relaxed">
            Every feature is designed with the refinement of a bespoke Parisian atelier and the reliability of modern multi-tenant cloud software.
          </p>
        </div>

        {/* ── Bento Grid ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">
          {/* ── CARD 1: Interactive Live RSVP Engine (7 cols) ─────────────── */}
          <div className="md:col-span-12 lg:col-span-7 rounded-3xl p-8 sm:p-10 bg-white border border-border/80 shadow-3d-card flex flex-col justify-between relative group hover:border-primary/40 transition-all duration-300">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary-deep px-3 py-1 rounded-full bg-primary/10">
                  <Heart className="h-3.5 w-3.5 fill-primary" />
                  Guest Experience
                </span>
                <span className="text-xs font-mono text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Live Interactive Widget
                </span>
              </div>

              <h3 className="font-display text-2xl sm:text-3xl font-bold text-neutral-dark mb-2">
                Frictionless 1-Click RSVP Engine
              </h3>
              <p className="text-sm text-neutral-mid leading-relaxed mb-6">
                Guests respond effortlessly on any phone or browser. Collect meal preferences, plus-ones, and heartfelt messages with zero app installation.
              </p>
            </div>

            {/* Interactive RSVP Simulation Canvas */}
            <div className="bg-neutral-light/70 rounded-2xl p-5 sm:p-6 border border-border/80 shadow-inner">
              <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
                <div>
                  <h4 className="text-sm font-semibold text-neutral-dark">Geneviève & Julian's Reception</h4>
                  <p className="text-xs text-neutral-mid">Château de Chantilly • RSVP by August 1st</p>
                </div>
                <span className="text-[11px] font-mono font-medium text-primary-deep bg-white px-2 py-0.5 rounded border border-border">
                  Token: #VIP-4082
                </span>
              </div>

              {rsvpSubmitted ? (
                <div className="py-8 text-center space-y-3">
                  <div className="inline-flex h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 items-center justify-center mx-auto">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <h5 className="font-display text-lg font-bold text-neutral-dark">
                    RSVP Confirmed with Pleasure!
                  </h5>
                  <p className="text-xs text-neutral-mid max-w-xs mx-auto">
                    A confirmation email and calendar invite have been dispatched. We cannot wait to celebrate with you.
                  </p>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setRsvpSubmitted(false)}
                    className="text-xs text-primary-deep hover:underline mt-2"
                  >
                    Reset and Try Again
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Attendance Toggle */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setRsvpAttending(true)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-semibold transition-all border ${
                        rsvpAttending
                          ? "bg-neutral-dark text-white border-neutral-dark shadow-soft-sm"
                          : "bg-white text-neutral-dark border-border hover:bg-neutral-50"
                      }`}
                    >
                      Accept with Pleasure
                    </button>
                    <button
                      onClick={() => setRsvpAttending(false)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-semibold transition-all border ${
                        !rsvpAttending
                          ? "bg-neutral-dark text-white border-neutral-dark shadow-soft-sm"
                          : "bg-white text-neutral-dark border-border hover:bg-neutral-50"
                      }`}
                    >
                      Decline with Regret
                    </button>
                  </div>

                  {rsvpAttending && (
                    <div className="space-y-3 pt-2">
                      <div>
                        <label className="text-xs font-medium text-neutral-dark flex items-center gap-1.5 mb-1.5">
                          <Utensils className="h-3.5 w-3.5 text-primary-deep" />
                          Curated Culinary Course Selection:
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {[
                            "Chilean Sea Bass & Caviar Velouté",
                            "Truffle Morels & Forest Risotto (V)",
                          ].map((meal) => (
                            <button
                              key={meal}
                              onClick={() => setSelectedMeal(meal)}
                              className={`p-2 rounded-lg text-left text-xs font-medium border transition-colors flex items-center justify-between ${
                                selectedMeal === meal
                                  ? "bg-primary/10 border-primary text-primary-deep"
                                  : "bg-white border-border text-neutral-mid hover:text-neutral-dark"
                              }`}
                            >
                              <span className="truncate">{meal}</span>
                              {selectedMeal === meal && <Check className="h-3 w-3 shrink-0 ml-1" />}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs text-neutral-dark font-medium">
                          Bringing Plus-One Companion?
                        </span>
                        <button
                          onClick={() => setPlusOne(!plusOne)}
                          className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                            plusOne
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-neutral-200 text-neutral-600"
                          }`}
                        >
                          {plusOne ? "+1 Included (Clara V.)" : "Solo Guest"}
                        </button>
                      </div>
                    </div>
                  )}

                  <Button
                    size="sm"
                    className="w-full text-xs font-semibold shadow-soft-md shadow-primary/20"
                    onClick={() => setRsvpSubmitted(true)}
                  >
                    <Send className="h-3.5 w-3.5 mr-2" />
                    Submit RSVP Response
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* ── CARD 2: Interactive 3D Seating Studio (5 cols) ─────────────── */}
          <div className="md:col-span-12 lg:col-span-5 rounded-3xl p-8 sm:p-10 bg-white border border-border/80 shadow-3d-card flex flex-col justify-between group hover:border-primary/40 transition-all duration-300">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary-deep px-3 py-1 rounded-full bg-primary/10">
                  <Users className="h-3.5 w-3.5 text-primary" />
                  Floorplan & Seating
                </span>
                <span className="text-xs font-mono text-primary-deep">VIP Table #1</span>
              </div>

              <h3 className="font-display text-2xl font-bold text-neutral-dark mb-2">
                Interactive Seating Studio
              </h3>
              <p className="text-sm text-neutral-mid leading-relaxed mb-6">
                Drag-and-drop table layouts, real-time dietary badges, and head-table coordinator notes.
              </p>
            </div>

            {/* Circular Table Visualizer */}
            <div className="relative p-6 rounded-2xl bg-neutral-light/70 border border-border flex flex-col items-center justify-center">
              {/* Table Centerpiece */}
              <div className="relative w-36 h-36 rounded-full border-2 border-dashed border-primary/50 bg-white shadow-soft-md flex flex-col items-center justify-center p-3 text-center my-6">
                <div className="h-8 w-8 rounded-full bg-primary/15 flex items-center justify-center text-primary-deep mb-1">
                  <Sparkles className="h-4 w-4" />
                </div>
                <span className="font-display font-bold text-xs text-neutral-dark">The Royal Table</span>
                <span className="text-[10px] text-neutral-mid">8 Guests Confirmed</span>
              </div>

              {/* 8 Satellite Seats around Table */}
              <div className="grid grid-cols-4 gap-2 w-full mt-2">
                {seats.map((seat) => (
                  <button
                    key={seat.id}
                    onClick={() => setActiveSeat(seat.id)}
                    className={`p-2 rounded-xl text-center text-[11px] font-medium border transition-all ${
                      activeSeat === seat.id
                        ? "bg-primary text-white border-primary shadow-soft-sm scale-105"
                        : "bg-white text-neutral-dark border-border hover:bg-neutral-50"
                    }`}
                  >
                    <div className="font-bold text-[10px] opacity-80">Seat {seat.id}</div>
                    <div className="truncate text-[10px]">{seat.name.split(" ")[0]}</div>
                  </button>
                ))}
              </div>

              {/* Active Seat Details Badge */}
              <div className="mt-4 pt-3 border-t border-border w-full flex items-center justify-between text-xs">
                <span className="font-medium text-neutral-dark">
                  {seats.find((s) => s.id === activeSeat)?.name}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary-deep font-semibold">
                  Course: {seats.find((s) => s.id === activeSeat)?.meal}
                </span>
              </div>
            </div>
          </div>

          {/* ── CARD 3: Custom Domain & Privacy Vault (6 cols) ─────────────── */}
          <div className="md:col-span-12 lg:col-span-6 rounded-3xl p-8 sm:p-10 bg-white border border-border/80 shadow-3d-card flex flex-col justify-between group hover:border-primary/40 transition-all duration-300">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary-deep px-3 py-1 rounded-full bg-primary/10">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                  White-Label & Privacy
                </span>
                <span className="text-xs font-mono text-primary-deep">SSL • Cloudflare Edge</span>
              </div>

              <h3 className="font-display text-2xl font-bold text-neutral-dark mb-2">
                Your Own Custom Domain
              </h3>
              <p className="text-sm text-neutral-mid leading-relaxed mb-6">
                Connect your bespoke `.com` domain with automatic TLS certificates, password-protected guest lists, and zero third-party advertising.
              </p>
            </div>

            {/* Interactive Domain Switcher & Browser URL Bar */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-1 bg-neutral-light rounded-xl border border-border">
                <button
                  onClick={() => setDomainMode("subdomain")}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                    domainMode === "subdomain"
                      ? "bg-white text-neutral-dark shadow-sm"
                      : "text-neutral-mid hover:text-neutral-dark"
                  }`}
                >
                  Free Subdomain
                </button>
                <button
                  onClick={() => setDomainMode("custom")}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                    domainMode === "custom"
                      ? "bg-white text-neutral-dark shadow-sm"
                      : "text-neutral-mid hover:text-neutral-dark"
                  }`}
                >
                  Custom Domain (Premium)
                </button>
              </div>

              {/* Realistic Safari / Chrome Address Bar Mockup */}
              <div className="rounded-xl border border-border bg-neutral-50 p-3 shadow-inner space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                  </div>
                  <div className="flex-1 flex items-center justify-center gap-1.5 bg-white border border-border rounded-lg py-1 px-3 text-[11px] font-mono text-neutral-dark shadow-sm">
                    <Lock className="h-3 w-3 text-emerald-600 shrink-0" />
                    <span className="text-emerald-700 font-semibold">https://</span>
                    <span className="font-bold">
                      {domainMode === "custom"
                        ? "genevieve-and-julian.com"
                        : "julian.everafter.com"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1 text-neutral-mid">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    Automatic Free SSL Certificate
                  </span>
                  <span className="font-semibold text-neutral-dark">100% Ad-Free</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── CARD 4: High-Resolution Photo Stream (6 cols) ─────────────── */}
          <div className="md:col-span-12 lg:col-span-6 rounded-3xl p-8 sm:p-10 bg-white border border-border/80 shadow-3d-card flex flex-col justify-between group hover:border-primary/40 transition-all duration-300">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary-deep px-3 py-1 rounded-full bg-primary/10">
                  <Camera className="h-3.5 w-3.5 text-primary" />
                  High-Fidelity Memories
                </span>
                <span className="text-xs font-mono text-primary-deep">CDN Cloud Storage</span>
              </div>

              <h3 className="font-display text-2xl font-bold text-neutral-dark mb-2">
                Shared Guest Photo Stream
              </h3>
              <p className="text-sm text-neutral-mid leading-relaxed mb-6">
                Let guests scan a QR code at your reception to upload candid high-resolution photos directly to your private moderated gallery.
              </p>
            </div>

            {/* 3D Tilted Polaroid Layout */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="rounded-xl overflow-hidden shadow-soft-md border border-border bg-white p-1.5 transform -rotate-3 transition-transform hover:rotate-0 hover:scale-105 duration-300">
                <div className="aspect-square bg-neutral-200 rounded-lg overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=400&q=80"
                    alt="First Dance"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-[10px] text-center font-display font-medium text-neutral-dark mt-1.5">
                  The First Dance
                </p>
              </div>

              <div className="rounded-xl overflow-hidden shadow-soft-md border border-border bg-white p-1.5 transform rotate-2 transition-transform hover:rotate-0 hover:scale-105 duration-300">
                <div className="aspect-square bg-neutral-200 rounded-lg overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=400&q=80"
                    alt="Champagne Toast"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-[10px] text-center font-display font-medium text-neutral-dark mt-1.5">
                  Champagne Toast
                </p>
              </div>

              <div className="rounded-xl overflow-hidden shadow-soft-md border border-border bg-white p-1.5 transform -rotate-1 transition-transform hover:rotate-0 hover:scale-105 duration-300">
                <div className="aspect-square bg-neutral-200 rounded-lg overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=400&q=80"
                    alt="Sunset Portraits"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-[10px] text-center font-display font-medium text-neutral-dark mt-1.5">
                  Sunset in Provence
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
