"use client";

import * as React from "react";
import Link from "next/link";
import { Sparkles, Calendar, MapPin, Heart, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type ThemeStyle = "chateau" | "tuscan" | "noir";

interface ThemeConfig {
  name: string;
  subtitle: string;
  bgGradient: string;
  cardBg: string;
  textColor: string;
  subtextColor: string;
  accentColor: string;
  goldBorder: string;
  waxSealColor: string;
  couple: string;
  date: string;
  venue: string;
  tagline: string;
}

const THEMES: Record<ThemeStyle, ThemeConfig> = {
  chateau: {
    name: "The Grand Château",
    subtitle: "French Neoclassical & Champagne Gold",
    bgGradient: "from-[#FAF7F2] via-[#F4EFE6] to-[#ECE3D4]",
    cardBg: "bg-[#FCFAF7]",
    textColor: "text-[#1C1C1C]",
    subtextColor: "text-[#6E6659]",
    accentColor: "#C9A96E",
    goldBorder: "border-[#DFB76C]/60",
    waxSealColor: "radial-gradient(circle at 35% 35%, #F4EBD9 0%, #C9A96E 50%, #8A6424 100%)",
    couple: "Geneviève & Julian",
    date: "Saturday, September 18, 2027",
    venue: "Château de Chantilly • Oise, France",
    tagline: "Together with their families, request the honour of your presence.",
  },
  tuscan: {
    name: "Tuscan Garden",
    subtitle: "Olive Groves, Travertine & Cypress",
    bgGradient: "from-[#F5F7F3] via-[#EAEFE6] to-[#DCE4D6]",
    cardBg: "bg-[#F9FAF8]",
    textColor: "text-[#1E241E]",
    subtextColor: "text-[#586455]",
    accentColor: "#7A8F74",
    goldBorder: "border-[#8FA389]/60",
    waxSealColor: "radial-gradient(circle at 35% 35%, #E5ECE2 0%, #7A8F74 50%, #3B4D36 100%)",
    couple: "Alessia & Matteo",
    date: "Sunday, June 14, 2027",
    venue: "Villa La Foce • Val d'Orcia, Tuscany",
    tagline: "Under the olive boughs, celebrating the commencement of forever.",
  },
  noir: {
    name: "Midnight Velvet",
    subtitle: "Metropolitan Editorial & Liquid Gold",
    bgGradient: "from-[#1C1B1F] via-[#141316] to-[#0A0A0C]",
    cardBg: "bg-[#18171B]",
    textColor: "text-[#F8F6F0]",
    subtextColor: "text-[#B8B4AA]",
    accentColor: "#ECC880",
    goldBorder: "border-[#ECC880]/50",
    waxSealColor: "radial-gradient(circle at 35% 35%, #ECC880 0%, #C9A96E 40%, #523D15 100%)",
    couple: "Sienna & Alexander",
    date: "Friday, October 29, 2027",
    venue: "The Pierre Penthouse • Manhattan, New York",
    tagline: "An evening of black tie, champagne, and boundless devotion.",
  },
};

export function HeroShowcase3D() {
  const [activeTheme, setActiveTheme] = React.useState<ThemeStyle>("chateau");
  const [isHovered, setIsHovered] = React.useState(false);
  const [rsvpChecked, setRsvpChecked] = React.useState(false);

  const theme = THEMES[activeTheme];

  return (
    <div className="w-full flex flex-col items-center">
      {/* ── Theme Switcher Controls ────────────────────────────────────────── */}
      <div className="mb-8 inline-flex items-center gap-1.5 p-1.5 rounded-full bg-white/90 border border-border/80 shadow-soft-md backdrop-blur-md">
        <span className="text-xs font-semibold uppercase tracking-wider text-neutral-mid pl-3 pr-2 hidden sm:inline-block">
          Interactive Theme:
        </span>
        {(["chateau", "tuscan", "noir"] as ThemeStyle[]).map((key) => {
          const t = THEMES[key];
          const isSelected = activeTheme === key;
          return (
            <button
              key={key}
              onClick={() => setActiveTheme(key)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-300 flex items-center gap-1.5 ${
                isSelected
                  ? "bg-neutral-dark text-white shadow-soft-sm scale-[1.02]"
                  : "text-neutral-mid hover:text-neutral-dark hover:bg-neutral-light"
              }`}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: t.accentColor }}
              />
              {t.name}
            </button>
          );
        })}
      </div>

      {/* ── 3D Spatial Canvas ──────────────────────────────────────────────── */}
      <div
        className="relative w-full max-w-4xl py-6 perspective-1500 flex items-center justify-center min-h-[460px] sm:min-h-[500px]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Ambient lighting halo behind cards */}
        <div
          className="absolute w-[500px] h-[340px] rounded-full blur-[100px] opacity-40 transition-colors duration-700 pointer-events-none -z-10"
          style={{
            background:
              activeTheme === "noir"
                ? "radial-gradient(circle, rgba(236,200,128,0.25) 0%, rgba(0,0,0,0) 70%)"
                : activeTheme === "tuscan"
                ? "radial-gradient(circle, rgba(122,143,116,0.3) 0%, rgba(201,169,110,0.1) 70%)"
                : "radial-gradient(circle, rgba(201,169,110,0.35) 0%, rgba(232,213,196,0.2) 70%)",
          }}
        />

        {/* ── Layer 1: Left RSVP Summary Card (Tilted Behind) ─────────────── */}
        <div
          className={`absolute left-0 sm:left-4 -top-2 w-64 sm:w-72 p-5 rounded-2xl border shadow-soft-xl transition-all duration-700 pointer-events-none hidden md:block preserve-3d ${
            activeTheme === "noir"
              ? "bg-[#1E1D22] border-white/10 text-white"
              : "bg-white/95 border-border text-neutral-dark"
          }`}
          style={{
            transform: isHovered
              ? "rotateY(-18deg) rotateX(8deg) translateZ(10px) translateX(-35px)"
              : "rotateY(-12deg) rotateX(6deg) translateZ(0px) translateX(-15px)",
          }}
        >
          <div className="flex items-center justify-between border-b border-border/50 pb-3 mb-3">
            <span className="text-[11px] font-mono uppercase tracking-widest text-primary-dark">
              Guest Registry & RSVP
            </span>
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center py-1">
              <span className="text-neutral-mid">Confirmed Guests</span>
              <span className="font-semibold font-mono">142 of 150</span>
            </div>
            <div className="w-full bg-neutral-200/50 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{ width: "94%", backgroundColor: theme.accentColor }}
              />
            </div>
            <div className="pt-2 flex items-center justify-between text-[11px] text-neutral-mid">
              <span>Dietary: 18 Vegan, 6 GF</span>
              <span className="text-emerald-600 font-medium">95% Responded</span>
            </div>
          </div>
        </div>

        {/* ── Layer 2: Main Editorial Invitation Suite (Centerpiece) ────────── */}
        <div
          className={`relative z-20 w-[92%] sm:w-[500px] rounded-3xl p-8 sm:p-10 border shadow-3d-floating transition-all duration-700 preserve-3d ${theme.cardBg} ${theme.goldBorder}`}
          style={{
            transform: isHovered
              ? "rotateX(2deg) rotateY(-2deg) translateZ(40px) translateY(-8px)"
              : "rotateX(6deg) rotateY(-5deg) translateZ(20px)",
          }}
        >
          {/* Subtle deckle hairline border */}
          <div className="absolute inset-2.5 rounded-[22px] border border-dashed border-[#DFB76C]/30 pointer-events-none" />

          {/* Intaglio Wax Seal Emblem */}
          <div className="flex justify-center -mt-3 mb-6">
            <div
              className="relative h-14 w-14 rounded-full flex items-center justify-center shadow-wax-seal transition-transform duration-300 hover:scale-110 cursor-pointer"
              style={{ background: theme.waxSealColor }}
              title="EverAfter Luxury Wax Monogram"
            >
              <div className="w-11 h-11 rounded-full border border-white/40 flex items-center justify-center">
                <span className="font-display font-bold text-xs tracking-wider text-[#2B1D08]">
                  EA
                </span>
              </div>
            </div>
          </div>

          {/* Headline Text */}
          <div className="text-center space-y-3">
            <p className="text-[11px] uppercase tracking-[0.25em] font-medium text-primary-deep">
              The Wedding Celebration of
            </p>

            <h2
              className={`font-display text-3xl sm:text-4xl font-bold tracking-tight transition-colors duration-500 ${theme.textColor}`}
            >
              {theme.couple}
            </h2>

            <p className={`text-xs sm:text-sm italic leading-relaxed max-w-xs mx-auto ${theme.subtextColor}`}>
              {theme.tagline}
            </p>

            {/* Date and Location with metallic divider */}
            <div className="pt-4 mt-4 border-t border-[#DFB76C]/40 space-y-2">
              <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-medium">
                <Calendar className="h-3.5 w-3.5 text-primary-deep" />
                <span className={theme.textColor}>{theme.date}</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs text-neutral-mid">
                <MapPin className="h-3.5 w-3.5 text-primary-deep" />
                <span>{theme.venue}</span>
              </div>
            </div>

            {/* Interactive RSVP Clickable Demo */}
            <div className="pt-5 mt-3">
              <button
                onClick={() => setRsvpChecked(!rsvpChecked)}
                className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-medium tracking-wide transition-all duration-300 flex items-center justify-center gap-2 ${
                  rsvpChecked
                    ? "bg-emerald-600 text-white shadow-soft-sm"
                    : "bg-primary text-white hover:bg-primary-dark shadow-soft-md shadow-primary/25 hover:shadow-primary/40"
                }`}
              >
                {rsvpChecked ? (
                  <>
                    <Check className="h-4 w-4" />
                    Attendance Confirmed with Pleasure
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Tap to Test Interactive RSVP Flow
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ── Layer 3: Right Mobile Device Mockup (Floating Front Right) ────── */}
        <div
          className={`absolute right-0 sm:right-4 -bottom-4 w-60 sm:w-64 p-4 rounded-3xl border shadow-soft-xl transition-all duration-700 z-30 hidden md:block preserve-3d ${
            activeTheme === "noir"
              ? "bg-[#141316] border-white/10 text-white"
              : "bg-white border-border text-neutral-dark"
          }`}
          style={{
            transform: isHovered
              ? "rotateY(14deg) rotateX(-6deg) translateZ(50px) translateX(30px)"
              : "rotateY(10deg) rotateX(-4deg) translateZ(30px) translateX(15px)",
          }}
        >
          {/* Mobile phone notch and header */}
          <div className="flex justify-between items-center pb-2.5 mb-2.5 border-b border-border/50 text-[10px] text-neutral-mid">
            <span className="font-mono">9:41</span>
            <div className="h-3 w-16 bg-neutral-200/60 rounded-full" />
            <span className="text-[9px]">5G 100%</span>
          </div>

          <div className="space-y-2.5 text-left">
            <div className="h-24 rounded-xl overflow-hidden relative bg-neutral-100">
              <img
                src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80"
                alt="Couple"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-2">
                <span className="text-white text-[11px] font-display font-semibold">
                  Countdown: 142 Days Left
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] pt-1">
              <span className="font-medium">Dress Code</span>
              <span className="text-primary-deep text-[10px] font-semibold uppercase tracking-wider">
                Black Tie Preferred
              </span>
            </div>

            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-between text-[10px]">
              <span className="text-primary-deep font-medium">Apple Calendar Synced</span>
              <Check className="h-3 w-3 text-primary-deep" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Subtitle and Quick Links ───────────────────────────────────────── */}
      <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 text-xs text-neutral-mid">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Interactive 3D WebGL & CSS Perspective
        </span>
        <span className="hidden sm:inline">•</span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Multi-tenant Subdomain Isolation
        </span>
        <span className="hidden sm:inline">•</span>
        <Link
          href="/wedding/sarah-and-james"
          target="_blank"
          className="font-medium text-primary-deep hover:underline flex items-center gap-1"
        >
          Explore Sample Live Wedding <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
