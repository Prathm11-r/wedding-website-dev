# DESIGN_SYSTEM.md
> **Single Source of Truth — EverAfter Design Language**
> Last updated: 2026-09-27 | Website CTO

---

## Table of Contents

1. [Design Principles & Philosophy](#1-design-principles--philosophy)
2. [Color System](#2-color-system)
3. [Typography Scale](#3-typography-scale)
4. [Spacing System](#4-spacing-system)
5. [Border Radius System](#5-border-radius-system)
6. [Shadow System](#6-shadow-system)
7. [Breakpoints](#7-breakpoints)
8. [Component Specifications](#8-component-specifications)
9. [Icon System](#9-icon-system)
10. [Animation Principles](#10-animation-principles)
11. [Imagery Guidelines](#11-imagery-guidelines)
12. [Accessibility Design Rules](#12-accessibility-design-rules)
13. [Tailwind Configuration](#13-tailwind-configuration)

---

## 1. Design Principles & Philosophy

EverAfter's visual language is built around a single promise: **make every couple feel like their love story deserves to be beautifully presented** — regardless of their technical ability or budget tier.

### Core Principles

| Principle | Definition | Applied To |
|---|---|---|
| **Warmth First** | Every surface, interaction, and word should feel like it was crafted by a caring friend, not a faceless product | Color choices, rounded corners, friendly microcopy |
| **Quiet Elegance** | Premium should feel restrained, never loud. Gold accents whisper, not shout | Typography hierarchy, white space, accent usage |
| **Progressive Clarity** | Show the right amount of information at the right time. Never overwhelm | Dashboard layouts, onboarding flows, card density |
| **Inclusive by Default** | Beautiful design must never come at the cost of accessibility | Contrast ratios, focus states, semantic HTML |
| **Consistent but Flexible** | The design system is the floor, not the ceiling. Wedding themes extend it, never break it | Token usage in theme templates |

### Design Philosophy

- **White space is intentional.** EverAfter pages breathe. Cramped layouts signal a cheap product.
- **The couple's content is always the hero.** EverAfter's chrome steps back; photos, names, and dates step forward.
- **Free tier looks premium.** Conversion depends on couples showing their wedding site to guests. If the free site looks shabby, couples won't share it.
- **One primary action per screen.** Never compete for attention with multiple CTAs of equal weight.
- **Motion is functional, not decorative.** Animations confirm state changes; they don't perform.

---

## 2. Color System

### 2.1 Core Palette

| Token | Hex | RGB | Usage |
|---|---|---|---|
| `--color-primary` | `#C9A96E` | `201, 169, 110` | Primary buttons, active links, key highlights, gold accents |
| `--color-primary-dark` | `#A07840` | `160, 120, 64` | Hover/active states on primary elements |
| `--color-primary-light` | `#E8D4A8` | `232, 212, 168` | Tinted backgrounds, soft gold fills |
| `--color-primary-subtle` | `#FAF5EC` | `250, 245, 236` | Very light gold wash for section backgrounds |
| `--color-accent` | `#E8D5C4` | `232, 213, 196` | Blush/rose secondary accents, decorative elements |
| `--color-accent-dark` | `#C9A98C` | `201, 169, 140` | Hover state on accent elements |
| `--color-neutral-900` | `#1C1C1C` | `28, 28, 28` | Headings, primary body text |
| `--color-neutral-700` | `#3D3D3D` | `61, 61, 61` | Secondary headings |
| `--color-neutral-500` | `#6B6B6B` | `107, 107, 107` | Secondary/supporting text, placeholders |
| `--color-neutral-300` | `#B0B0B0` | `176, 176, 176` | Disabled text, borders on light backgrounds |
| `--color-neutral-200` | `#D9D9D9` | `217, 217, 217` | Dividers, input borders |
| `--color-neutral-100` | `#F0EDE9` | `240, 237, 233` | Subtle section dividers |
| `--color-neutral-50` | `#F7F4F0` | `247, 244, 240` | Page backgrounds, card fills, neutral surfaces |
| `--color-white` | `#FFFFFF` | `255, 255, 255` | Card surfaces, modal backgrounds, input fills |
| `--color-error` | `#DC2626` | `220, 38, 38` | Error states, destructive actions |
| `--color-error-light` | `#FEE2E2` | `254, 226, 226` | Error background tints |
| `--color-success` | `#16A34A` | `22, 163, 74` | Success states, confirmation messages |
| `--color-success-light` | `#DCFCE7` | `220, 252, 231` | Success background tints |
| `--color-warning` | `#D97706` | `217, 119, 6` | Warning states, upgrade prompts |
| `--color-warning-light` | `#FEF3C7` | `254, 243, 199` | Warning background tints |
| `--color-info` | `#2563EB` | `37, 99, 235` | Informational messages |
| `--color-info-light` | `#DBEAFE` | `219, 234, 254` | Info background tints |

### 2.2 Color Usage Rules

#### Primary Gold (`#C9A96E`)
- ✅ Primary CTA buttons
- ✅ Active navigation states
- ✅ Icon fills for key features
- ✅ Decorative rule lines / dividers in hero sections
- ✅ Badge accents (premium plan indicators)
- ❌ Never use as text color on white (fails WCAG AA — use `#7A5C28` or darker for text)
- ❌ Never use on `--color-accent` background (insufficient contrast)
- ❌ Never use for error or destructive states

#### Accent Blush (`#E8D5C4`)
- ✅ Subtle section background tints
- ✅ Decorative elements behind couple photos
- ✅ Card hover overlays
- ✅ Testimonial card backgrounds
- ❌ Never use as primary button color (too light, too passive)
- ❌ Never use text on this background without verifying contrast

#### Neutrals
- Neutral 900 (`#1C1C1C`) → All headings (H1–H4), primary body text
- Neutral 700 (`#3D3D3D`) → H5, H6, strong secondary text
- Neutral 500 (`#6B6B6B`) → Body secondary, meta text, timestamps, labels
- Neutral 300 (`#B0B0B0`) → Placeholder text, disabled states
- Neutral 200 (`#D9D9D9`) → All borders, input outlines, dividers
- Neutral 50 (`#F7F4F0`) → Main page background, app sidebar backgrounds

### 2.3 Semantic Color Mapping

| Semantic Role | Light Mode Token | Dark Mode Token |
|---|---|---|
| Page background | `neutral-50` (`#F7F4F0`) | `#121212` |
| Card surface | `white` (`#FFFFFF`) | `#1E1E1E` |
| Modal surface | `white` (`#FFFFFF`) | `#252525` |
| Heading text | `neutral-900` (`#1C1C1C`) | `#F0EDE9` |
| Body text | `neutral-900` (`#1C1C1C`) | `#D9D6D2` |
| Secondary text | `neutral-500` (`#6B6B6B`) | `#9C9691` |
| Border default | `neutral-200` (`#D9D9D9`) | `#3A3A3A` |
| Border subtle | `neutral-100` (`#F0EDE9`) | `#2A2A2A` |
| Primary action | `primary` (`#C9A96E`) | `#C9A96E` |
| Primary hover | `primary-dark` (`#A07840`) | `#D4B87E` |

### 2.4 Dark Mode Considerations

> [!NOTE]
> Dark mode is a **v2 feature**. The tokens above are defined now to prevent costly refactors later. All CSS custom properties should be declared inside a `:root` block and overridden inside a `[data-theme="dark"]` or `.dark` block. The Tailwind `darkMode: 'class'` strategy must be configured from day one.

**Dark mode philosophy for EverAfter:**
- Avoid pure `#000000` black — use `#121212` for depth
- The primary gold (`#C9A96E`) remains constant — it works on dark backgrounds
- Blush accent lightens slightly in dark mode to maintain visual softness
- Card elevations in dark mode are shown via lighter background fills (not shadows)

### 2.5 Color Do's and Don'ts

| ✅ Do | ❌ Don't |
|---|---|
| Use `neutral-900` on `white` for body text | Use `primary` gold as text color on white |
| Use `primary-dark` for gold text on light backgrounds | Use gold on blush backgrounds |
| Use semantic success/error colors only for their purpose | Use red for decorative elements |
| Reserve gold highlights for 1–2 elements per section | Use gold everywhere — it loses its premium signal |
| Test all new color combos with a contrast checker | Assume a color pair passes without verifying |

---

## 3. Typography Scale

### 3.1 Font Families

```css
/* In Next.js, load via next/font/google */
import { Playfair_Display, Inter } from 'next/font/google';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});
```

| Role | Family | Fallback Stack | Use For |
|---|---|---|---|
| Display / Headings | `Playfair Display` | `Georgia, "Times New Roman", serif` | H1–H4, hero text, pull quotes, feature names |
| Body / UI | `Inter` | `"Helvetica Neue", Arial, sans-serif` | H5–H6, body text, labels, buttons, inputs, navigation |
| Monospace | `JetBrains Mono` | `"Courier New", monospace` | Developer docs only — never in marketing or app UI |

### 3.2 Type Scale

Base: `16px` (`1rem`). Scale factor: **Major Third** (1.25x) for headings, fluid sizing for display.

| Token | Element | Size (rem) | Size (px) | Weight | Line Height | Letter Spacing | Font |
|---|---|---|---|---|---|---|---|
| `text-display-2xl` | Hero / Splash | `4.5rem` | `72px` | 700 | `1.1` | `-0.02em` | Playfair Display |
| `text-display-xl` | Section Hero | `3.75rem` | `60px` | 700 | `1.15` | `-0.02em` | Playfair Display |
| `text-h1` | Page Title | `3rem` | `48px` | 700 | `1.2` | `-0.01em` | Playfair Display |
| `text-h2` | Section Title | `2.25rem` | `36px` | 600 | `1.25` | `-0.01em` | Playfair Display |
| `text-h3` | Sub-section | `1.875rem` | `30px` | 600 | `1.3` | `0` | Playfair Display |
| `text-h4` | Card Title / Feature | `1.5rem` | `24px` | 600 | `1.35` | `0` | Playfair Display |
| `text-h5` | Sidebar / Widget Title | `1.25rem` | `20px` | 600 | `1.4` | `0` | Inter |
| `text-h6` | Small Section Label | `1.125rem` | `18px` | 600 | `1.4` | `0.01em` | Inter |
| `text-body-lg` | Lead paragraph | `1.125rem` | `18px` | 400 | `1.75` | `0` | Inter |
| `text-body` | Default body | `1rem` | `16px` | 400 | `1.625` | `0` | Inter |
| `text-body-sm` | Secondary content | `0.875rem` | `14px` | 400 | `1.5` | `0` | Inter |
| `text-caption` | Image captions, hints | `0.8125rem` | `13px` | 400 | `1.4` | `0.01em` | Inter |
| `text-label` | Form labels | `0.875rem` | `14px` | 500 | `1.25` | `0.01em` | Inter |
| `text-label-sm` | Small badges, tags | `0.75rem` | `12px` | 500 | `1.25` | `0.04em` | Inter |
| `text-overline` | Section pre-labels | `0.6875rem` | `11px` | 600 | `1.2` | `0.1em` | Inter |
| `text-button` | Button text | `0.9375rem` | `15px` | 600 | `1.25` | `0.01em` | Inter |

### 3.3 Responsive Typography

Display headings scale down on mobile to prevent overflow and maintain readability:

| Token | Mobile (< 640px) | Tablet (640–1024px) | Desktop (> 1024px) |
|---|---|---|---|
| `display-2xl` | `2.5rem` / 40px | `3.5rem` / 56px | `4.5rem` / 72px |
| `display-xl` | `2.25rem` / 36px | `3rem` / 48px | `3.75rem` / 60px |
| `h1` | `2rem` / 32px | `2.5rem` / 40px | `3rem` / 48px |
| `h2` | `1.625rem` / 26px | `1.875rem` / 30px | `2.25rem` / 36px |
| `h3` | `1.375rem` / 22px | `1.625rem` / 26px | `1.875rem` / 30px |
| `h4` | `1.25rem` / 20px | `1.375rem` / 22px | `1.5rem` / 24px |

### 3.4 Typography Usage Rules

- **Never use Playfair Display below `18px`** — serifs lose legibility at small sizes.
- **Body text minimum: `16px`** on desktop, **`16px`** on mobile. Never go below.
- **Caption / label minimum: `12px`** — and only for non-critical supplementary content.
- **Line length:** Constrain body text containers to `60–75ch` (characters) for optimal readability.
- **Italic Playfair** is used sparingly for decorative quotes, couple names in hero sections, and pull quotes.
- **Uppercase text** is reserved for `overline` labels only. Never uppercase full sentences.
- **Font weight 400** for body, **500** for labels, **600** for UI headings (Inter), **700** for display (Playfair).

---

## 4. Spacing System

Base unit: **4px**. All spacing values are multiples of 4.

### 4.1 Scale

| Token | px | rem | Tailwind | Common Use |
|---|---|---|---|---|
| `space-0` | `0px` | `0` | `0` | Reset |
| `space-px` | `1px` | — | `px` | Borders only |
| `space-0.5` | `2px` | `0.125rem` | `0.5` | Micro gaps |
| `space-1` | `4px` | `0.25rem` | `1` | Icon padding, badge gaps |
| `space-1.5` | `6px` | `0.375rem` | `1.5` | Tight inline elements |
| `space-2` | `8px` | `0.5rem` | `2` | Input padding (vertical), icon margins |
| `space-3` | `12px` | `0.75rem` | `3` | Small button padding, tag gaps |
| `space-4` | `16px` | `1rem` | `4` | Base unit — default element gap |
| `space-5` | `20px` | `1.25rem` | `5` | Card internal padding (sm) |
| `space-6` | `24px` | `1.5rem` | `6` | Button padding (md), form row gap |
| `space-7` | `28px` | `1.75rem` | `7` | Navigation height padding |
| `space-8` | `32px` | `2rem` | `8` | Section sub-component gap |
| `space-10` | `40px` | `2.5rem` | `10` | Card padding (default) |
| `space-12` | `48px` | `3rem` | `12` | Feature block gap |
| `space-14` | `56px` | `3.5rem` | `14` | Large card padding |
| `space-16` | `64px` | `4rem` | `16` | Section internal padding |
| `space-20` | `80px` | `5rem` | `20` | Section vertical padding (mobile) |
| `space-24` | `96px` | `6rem` | `24` | Section vertical padding (desktop) |
| `space-32` | `128px` | `8rem` | `32` | Hero top/bottom padding |

### 4.2 Spacing Decisions

| Context | Spacing Rule |
|---|---|
| Between a label and its input | `space-2` (8px) |
| Between form fields | `space-6` (24px) |
| Between card header and body | `space-4` (16px) |
| Between cards in a grid | `space-6` (24px) desktop, `space-4` (16px) mobile |
| Section padding (top/bottom) | `space-20` (80px) mobile, `space-24` (96px) desktop |
| Page horizontal padding | `space-4` (16px) mobile, `space-8` (32px) tablet, container-constrained desktop |
| Container max-width | `1280px` (`max-w-screen-xl`) with `auto` margins |
| Content max-width (reading) | `720px` for long-form text blocks |

---

## 5. Border Radius System

EverAfter uses a soft, modern radius scale. Hard corners are never used in product UI — they signal rigidity, not warmth.

| Token | Value | Tailwind | Use |
|---|---|---|---|
| `radius-none` | `0px` | `rounded-none` | Never in product UI; only for full-bleed images |
| `radius-sm` | `4px` | `rounded` | Input fields, small badges, tooltips |
| `radius-md` | `8px` | `rounded-md` | Buttons (all sizes), selects, checkboxes |
| `radius-lg` | `12px` | `rounded-lg` | Cards (default), dropdowns, popovers |
| `radius-xl` | `16px` | `rounded-xl` | Feature cards, image containers in cards |
| `radius-2xl` | `24px` | `rounded-2xl` | Modals, dialogs, large image frames |
| `radius-3xl` | `32px` | `rounded-3xl` | Hero image overlays, premium showcase cards |
| `radius-full` | `9999px` | `rounded-full` | Pill badges, avatar circles, toggle switches |

### Radius Usage Rules

- **Buttons** always use `radius-md` (`8px`) — not pill-shaped (avoids looking like a mobile app).
- **Cards** use `radius-lg` (`12px`) as default; hero/feature cards may use `radius-xl`.
- **Modals** use `radius-2xl` (`24px`) — feels like a deliberate overlay, not a browser dialog.
- **Avatars** always use `radius-full`.
- **Images** inside cards inherit the card's radius using `overflow-hidden` on the parent.

---

## 6. Shadow System

Shadows indicate elevation. EverAfter uses warm-tinted shadows (a slight gold/warm tone) rather than cold grey shadows — this aligns with the brand palette.

### 6.1 Four Elevation Levels

| Level | Token | CSS Value | Use |
|---|---|---|---|
| **0 — Flat** | `shadow-none` | `none` | On-background elements (no card) |
| **1 — Raised** | `shadow-sm` | `0 1px 3px rgba(28,28,28,0.08), 0 1px 2px rgba(28,28,28,0.05)` | Default cards, input focus ring backing, badges |
| **2 — Elevated** | `shadow-md` | `0 4px 12px rgba(28,28,28,0.10), 0 2px 4px rgba(28,28,28,0.06)` | Hover state cards, dropdowns, popovers |
| **3 — Floating** | `shadow-lg` | `0 10px 30px rgba(28,28,28,0.12), 0 4px 8px rgba(28,28,28,0.08)` | Modals, dialogs, date pickers |
| **4 — Overlay** | `shadow-xl` | `0 20px 60px rgba(28,28,28,0.16), 0 8px 16px rgba(28,28,28,0.10)` | Full-screen overlays, sticky headers on scroll |

### 6.2 Special Shadow: Gold Glow

Used on premium CTAs and upgrade prompts to signal the primary action.

```css
/* Gold Glow — primary button hover */
box-shadow: 0 4px 20px rgba(201, 169, 110, 0.4);
```

### 6.3 Shadow Rules

- Card **default state** → `shadow-sm`
- Card **hover state** → transition to `shadow-md`
- Never stack multiple shadows on a single element
- In dark mode, replace shadows with `border: 1px solid rgba(255,255,255,0.08)` + background lightness increase

---

## 7. Breakpoints

EverAfter is **mobile-first**. All styles are written for mobile, then overridden at larger breakpoints.

| Name | Prefix | Min Width | Device Target |
|---|---|---|---|
| **xs** | _(default)_ | `0px` | Small phones (360px+) |
| **sm** | `sm:` | `640px` | Large phones, small tablets |
| **md** | `md:` | `768px` | Tablets (portrait) |
| **lg** | `lg:` | `1024px` | Tablets (landscape), small laptops |
| **xl** | `xl:` | `1280px` | Desktops |
| **2xl** | `2xl:` | `1536px` | Wide desktops |

### Grid Layout by Breakpoint

| Context | Mobile | Tablet (md) | Desktop (xl) |
|---|---|---|---|
| Marketing grid | 1 col | 2 cols | 3–4 cols |
| Feature cards | 1 col | 2 cols | 3 cols |
| App dashboard | 1 col | 2 cols | Sidebar + main |
| Form layout | 1 col | 1–2 cols | 2 cols |

### Container Widths

```css
/* Global container — centered, horizontal padding only */
.container {
  width: 100%;
  max-width: 1280px; /* xl */
  margin: 0 auto;
  padding-left: 1rem;   /* 16px mobile */
  padding-right: 1rem;
}

@media (min-width: 640px) {
  .container { padding-left: 2rem; padding-right: 2rem; }
}

@media (min-width: 1024px) {
  .container { padding-left: 3rem; padding-right: 3rem; }
}
```

---

## 8. Component Specifications

### 8.1 Buttons

#### Variants

| Variant | Background | Text | Border | Hover Background | Use |
|---|---|---|---|---|---|
| **Primary** | `#C9A96E` | `#FFFFFF` | none | `#A07840` | Main CTA, form submit |
| **Secondary** | `#FFFFFF` | `#C9A96E` | `1.5px solid #C9A96E` | `#FAF5EC` | Secondary actions |
| **Ghost** | `transparent` | `#1C1C1C` | none | `#F7F4F0` | Tertiary actions, nav items |
| **Destructive** | `#DC2626` | `#FFFFFF` | none | `#B91C1C` | Delete, cancel subscription |
| **Link** | `transparent` | `#C9A96E` | none | underline | Inline text actions |

#### Sizes

| Size | Height | Padding (H) | Padding (V) | Font Size | Icon Size |
|---|---|---|---|---|---|
| **sm** | `32px` | `12px` | `8px` | `13px` / `0.8125rem` | `14px` |
| **md** | `40px` | `16px` | `10px` | `15px` / `0.9375rem` | `16px` |
| **lg** | `48px` | `24px` | `12px` | `16px` / `1rem` | `18px` |
| **xl** | `56px` | `32px` | `14px` | `17px` / `1.0625rem` | `20px` |

#### States

| State | Visual Change |
|---|---|
| **Default** | Base styles as above |
| **Hover** | Background shifts to hover color; `transform: translateY(-1px)`; gold glow on primary |
| **Active / Pressed** | `transform: translateY(0px)`; slightly darker background; no glow |
| **Focus** | `outline: 2px solid #C9A96E; outline-offset: 2px` |
| **Disabled** | `opacity: 0.45`; `cursor: not-allowed`; no hover transform |
| **Loading** | Replace text with spinner icon + "Loading…" text; disabled state styles apply |

#### Button Tailwind Classes (reference)

```tsx
// Primary MD
<button className="inline-flex items-center justify-center gap-2 h-10 px-4 py-2.5 rounded-md bg-primary text-white font-semibold text-[15px] tracking-[0.01em] transition-all duration-150 hover:bg-primary-dark hover:shadow-gold hover:-translate-y-px active:translate-y-0 focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 disabled:opacity-45 disabled:cursor-not-allowed disabled:transform-none" />

// Secondary MD
<button className="inline-flex items-center justify-center gap-2 h-10 px-4 py-2.5 rounded-md bg-white text-primary font-semibold text-[15px] border border-primary transition-all duration-150 hover:bg-primary-subtle focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 disabled:opacity-45 disabled:cursor-not-allowed" />

// Ghost MD
<button className="inline-flex items-center justify-center gap-2 h-10 px-4 py-2.5 rounded-md bg-transparent text-neutral-900 font-semibold text-[15px] transition-all duration-150 hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 disabled:opacity-45 disabled:cursor-not-allowed" />
```

---

### 8.2 Input Fields

#### Anatomy

```
[Icon?] [Placeholder/Value]                    [Trailing Icon?]
─────────────────────────────────────────────────────────────
Label text (above)
Helper / Error text (below)
```

#### States

| State | Border | Background | Text | Shadow / Glow |
|---|---|---|---|---|
| **Default** | `1.5px solid #D9D9D9` | `#FFFFFF` | `#1C1C1C` | `shadow-sm` |
| **Hover** | `1.5px solid #B0B0B0` | `#FFFFFF` | `#1C1C1C` | — |
| **Focused** | `2px solid #C9A96E` | `#FFFFFF` | `#1C1C1C` | `0 0 0 3px rgba(201,169,110,0.2)` |
| **Filled** | `1.5px solid #D9D9D9` | `#FFFFFF` | `#1C1C1C` | — |
| **Error** | `2px solid #DC2626` | `#FFFFFF` | `#1C1C1C` | `0 0 0 3px rgba(220,38,38,0.15)` |
| **Disabled** | `1.5px solid #E5E5E5` | `#F7F4F0` | `#B0B0B0` | none |
| **Read-only** | `1.5px dashed #D9D9D9` | `#F7F4F0` | `#6B6B6B` | none |

#### Sizing

| Size | Height | Padding (H) | Padding (V) | Font Size |
|---|---|---|---|---|
| **sm** | `32px` | `10px` | `6px` | `13px` |
| **md** | `40px` | `12px` | `8px` | `15px` |
| **lg** | `48px` | `16px` | `12px` | `16px` |

#### Label Placement Rules

- Labels are **always above** the input (never inside/floating). They are visible at all times.
- Labels use `text-label` token: `Inter 14px / 500 / #1C1C1C`
- Required fields show a red asterisk: `<span aria-hidden="true" class="text-error">*</span>`
- Helper text below: `text-caption` / `#6B6B6B`
- Error text below: `text-caption` / `#DC2626` + error icon

---

### 8.3 Cards

#### Basic Card

A general-purpose container for dashboard widgets, content blocks, and info panels.

```
╔══════════════════════════════════╗
║  [Optional Header / Title]       ║
║  ─────────────────────────────   ║
║  Card body content               ║
║                                  ║
║  [Optional Footer / Action]      ║
╚══════════════════════════════════╝
```

| Property | Value |
|---|---|
| Background | `#FFFFFF` |
| Border | `1px solid #F0EDE9` |
| Border Radius | `radius-lg` / `12px` |
| Padding | `24px` (desktop), `16px` (mobile) |
| Shadow | `shadow-sm` default; `shadow-md` on hover |
| Hover transition | `box-shadow 200ms ease, transform 200ms ease` |
| Hover transform | `translateY(-2px)` for interactive cards |

#### Wedding Theme Card

Used in the Themes Gallery (`/themes`) to preview couple website templates.

| Property | Value |
|---|---|
| Aspect Ratio | `3:2` (landscape preview) |
| Image Treatment | Full-bleed image top, rounded top corners |
| Card Radius | `radius-xl` / `16px` |
| Badge position | Top-right corner, inside image (8px inset) |
| Hover State | Scale image `1.03`, show "Preview" overlay button |
| Labels | Theme name in `text-h5`, style tag in `text-label-sm` badge |

#### Feature Card

Used on the marketing `/features` page and homepage feature grid.

| Property | Value |
|---|---|
| Background | `#FAF5EC` (primary-subtle) or `#FFFFFF` |
| Icon Container | `48×48px` circle, `bg-primary/10`, icon in `primary` color |
| Title | `text-h4` / Playfair Display |
| Body | `text-body` / Inter |
| No border | Background itself defines the container |
| Padding | `32px` |
| Radius | `radius-xl` / `16px` |

---

### 8.4 Badges

Badges communicate plan tier, status, or feature availability. They are small, inline, and never the primary focus.

| Variant | Background | Text Color | Border | Use |
|---|---|---|---|---|
| **Free** | `#F7F4F0` | `#6B6B6B` | `1px solid #D9D9D9` | Free tier indicators |
| **Premium** | `#FAF5EC` | `#A07840` | `1px solid #E8D4A8` | Premium feature lock, plan badge |
| **Planner** | `#1C1C1C` | `#C9A96E` | none | Planner Pro plan badge |
| **Success** | `#DCFCE7` | `#15803D` | none | RSVP confirmed, published status |
| **Warning** | `#FEF3C7` | `#B45309` | none | Pending, review needed |
| **Error** | `#FEE2E2` | `#B91C1C` | none | Failed, declined |
| **Info** | `#DBEAFE` | `#1D4ED8` | none | Informational, beta |
| **New** | `#C9A96E` | `#FFFFFF` | none | New features callout |

#### Badge Anatomy

```
╭────────────────╮
│ ● Label Text   │   Height: 20px (sm) / 24px (md)
╰────────────────╯   Padding: 4px 8px (sm) / 6px 10px (md)
                     Font: Inter 11px–12px / 500 / UPPERCASE
                     Radius: radius-full (pill shape)
```

---

### 8.5 Navigation

#### Top Navigation (Marketing Site)

| Property | Spec |
|---|---|
| Height | `64px` desktop, `56px` mobile |
| Background | `white` (solid); adds `shadow-sm` on scroll via JS class |
| Logo | Left-aligned; Playfair Display wordmark or SVG logo |
| Nav Links | `Inter 15px / 500`; color `neutral-700`; hover `primary` |
| Active Link | `primary` color + `2px` underline offset `4px` |
| CTA Button | Primary button "Start for free" (md size) |
| Sticky | `position: sticky; top: 0; z-index: 50` |
| Transition | `backdrop-filter blur` on scroll for frosted glass effect (optional) |

**Nav Items order (desktop):** Features | Themes | Pricing | For Planners | Blog | `[Sign In]` `[Start for free →]`

#### Mobile Navigation

| Property | Spec |
|---|---|
| Trigger | Hamburger icon (`Menu` from Lucide, 24px) at right of nav |
| Drawer | Full-width slide-down or right-side sheet (max-width `280px`) |
| Overlay | Semi-transparent backdrop `rgba(28,28,28,0.5)` |
| Links | `Inter 18px / 500`; stacked vertically; `space-y-1` |
| CTA | Full-width primary button at bottom of drawer |
| Close | `X` icon (`XIcon` from Lucide) in top-right of drawer |
| Animation | `transform: translateX(-100%)` → `translateX(0)` via `transition-transform 250ms ease` |

#### App Sidebar Navigation

| Property | Spec |
|---|---|
| Width | `240px` desktop, collapsed to `0` on mobile |
| Background | `#F7F4F0` (neutral-50) |
| Border | `1px solid #F0EDE9` on right |
| Logo | Top, 20px padding |
| Nav Items | Icon + Label; `16px Inter / 500`; `12px` left padding |
| Active State | `bg-primary-subtle` background; left `3px` gold border; text `primary-dark` |
| Hover State | `bg-neutral-100` background |
| Bottom Items | Settings, Help, User avatar/name |

---

### 8.6 Modal / Dialog

```
╔══════════════════════════════════════╗  ← shadow-lg, radius-2xl
║  [Close ×]                           ║
║  ──────────────────────────────────  ║
║  [Icon?]  Modal Title                ║  ← Playfair Display, h3 size
║                                      ║
║  Modal body text explaining the      ║
║  action or presenting content.       ║  ← Inter body
║                                      ║
║  ──────────────────────────────────  ║
║  [Secondary Action]  [Primary CTA]   ║  ← Right-aligned buttons
╚══════════════════════════════════════╝
```

| Property | Value |
|---|---|
| Max Width | `480px` (sm), `640px` (md), `800px` (lg) |
| Background | `#FFFFFF` |
| Padding | `32px` |
| Border Radius | `radius-2xl` / `24px` |
| Shadow | `shadow-lg` |
| Overlay | `rgba(28,28,28,0.6)` — full viewport |
| Open Animation | Fade in (`opacity 0→1`) + scale (`scale(0.97)→scale(1)`) — `200ms ease-out` |
| Close Animation | Reverse — `150ms ease-in` |
| Scroll | Dialog scrolls internally when content overflows; backdrop does not |
| Close Trigger | `×` button, `Escape` key, clicking backdrop (configurable) |
| Focus Trap | Required — first focusable element receives focus on open |
| `aria-modal` | `true`; `role="dialog"` |

---

### 8.7 Toast / Notification

Toasts appear in the **bottom-right** corner of the viewport on desktop, and **bottom-center** on mobile.

```
╭─────────────────────────────────────╮
│ ✓  RSVP submitted successfully!     │  ← Success toast
│    Jane & John's wedding list        │
╰─────────────────────────────────────╯
```

| Property | Value |
|---|---|
| Width | `360px` max desktop, full-width (minus 32px margin) mobile |
| Radius | `radius-lg` / `12px` |
| Shadow | `shadow-lg` |
| Padding | `16px` |
| Auto-dismiss | `4000ms` (success/info); `7000ms` (warning); manual only (error) |
| Animation | Slide up + fade in from bottom; slide down + fade out on dismiss |
| Stack | Up to 3 toasts stacked; oldest auto-dismissed first |

| Variant | Left Border | Icon | Background |
|---|---|---|---|
| **Success** | `4px solid #16A34A` | `CheckCircle` | `#FFFFFF` |
| **Error** | `4px solid #DC2626` | `XCircle` | `#FFFFFF` |
| **Warning** | `4px solid #D97706` | `AlertTriangle` | `#FFFFFF` |
| **Info** | `4px solid #2563EB` | `Info` | `#FFFFFF` |

---

### 8.8 Form Elements

#### Checkbox

| State | Appearance |
|---|---|
| Unchecked | `16×16px` square, `radius-sm`, `border: 1.5px solid #D9D9D9`, `bg-white` |
| Checked | `bg-primary` (`#C9A96E`), `border-primary`, white checkmark SVG inside |
| Focused | `outline: 2px solid #C9A96E; outline-offset: 2px` |
| Disabled | `bg-neutral-100`, `border-neutral-300`, cursor not-allowed |
| Indeterminate | `bg-primary`, white dash `-` icon inside |

#### Radio Button

| State | Appearance |
|---|---|
| Unselected | `16×16px` circle, `border: 1.5px solid #D9D9D9`, `bg-white` |
| Selected | Outer: `border: 2px solid #C9A96E`; Inner: `6×6px` filled circle `#C9A96E` |
| Focused | `outline: 2px solid #C9A96E; outline-offset: 2px` |
| Disabled | `bg-neutral-100`, `border-neutral-300` |

#### Select / Dropdown

Inherits Input Field spec for sizing and states. Additional:
- Trailing icon: `ChevronDown` from Lucide, `16px`, `neutral-500`
- Dropdown panel: `bg-white`, `shadow-md`, `radius-md`, `border: 1px solid #F0EDE9`
- Option hover: `bg-neutral-50`
- Option selected: `bg-primary-subtle`, text `primary-dark`, trailing `Check` icon
- Max dropdown height: `240px` with internal scroll

#### Textarea

Inherits Input Field spec. Additional:
- Min height: `96px` (3 rows)
- Resize: `vertical` only
- Has character count if limit set: `text-caption / neutral-500 / right-aligned` below

#### Toggle / Switch

| Property | Value |
|---|---|
| Track (off) | `40×22px`, `radius-full`, `bg-neutral-200` |
| Track (on) | `bg-primary` |
| Thumb | `18×18px` circle, `bg-white`, `shadow-sm`, `translate-x` animated |
| Transition | `150ms ease` for thumb position and track color |
| Focus | Track gets `outline: 2px solid #C9A96E; outline-offset: 2px` |

---

## 9. Icon System

### Library: Lucide React

All icons in EverAfter use **[Lucide React](https://lucide.dev)** — a clean, consistent, MIT-licensed icon set that ships as individual SVG components.

```bash
npm install lucide-react
```

### Icon Sizes

| Context | Size | Tailwind |
|---|---|---|
| Inline text (sm) | `14px` | `size-3.5` |
| Inline text (default) | `16px` | `size-4` |
| Button icon (sm) | `14px` | `size-3.5` |
| Button icon (md) | `16px` | `size-4` |
| Button icon (lg) | `18px` | `size-[18px]` |
| Nav item icon | `20px` | `size-5` |
| Feature icon (card) | `24px` | `size-6` |
| Feature icon (hero) | `32px` | `size-8` |
| Toast / Alert icon | `20px` | `size-5` |
| Empty state icon | `48px` | `size-12` |
| Large illustration icon | `64px` | `size-16` |

### Stroke Width

- **Default:** `1.5px` — Lucide's default; use for all UI icons
- **Bold:** `2px` — for very small icons (14px) where thin strokes disappear
- Never mix stroke widths within a single component

### Commonly Used Icons

| Feature | Icon |
|---|---|
| RSVP / Guest | `Users`, `UserCheck`, `UserPlus` |
| Photo Gallery | `Image`, `Camera`, `Images` |
| Registry | `Gift` |
| Timeline / Schedule | `Clock`, `Calendar` |
| Seating Chart | `LayoutGrid`, `Armchair` |
| Location / Venue | `MapPin` |
| Settings | `Settings2` |
| Billing | `CreditCard` |
| Upload | `Upload`, `ImagePlus` |
| Premium / Upgrade | `Sparkles`, `Crown` |
| Custom Domain | `Globe` |
| Share | `Share2` |
| Edit | `Pencil` |
| Delete | `Trash2` |
| Notifications | `Bell` |
| Email | `Mail` |
| Check / Success | `CheckCircle2` |
| Error / Warning | `AlertCircle`, `AlertTriangle` |
| Close | `X` |
| Menu (hamburger) | `Menu` |
| Arrow navigation | `ChevronRight`, `ChevronLeft`, `ArrowRight` |
| Drag handle | `GripVertical` |
| Loading | `Loader2` (with `animate-spin`) |

### Icon + Label Pairing

- Always pair icons with visible labels in navigation and primary actions (icons alone are ambiguous).
- Icons without labels are acceptable for: close buttons (`aria-label` required), icon-only toolbars with tooltips, and compact table actions.
- Icons inside buttons: `gap-2` between icon and text.
- Icons in nav sidebar: `gap-3` between icon and label.

---

## 10. Animation Principles

### 10.1 Duration Scale

| Name | Duration | Use |
|---|---|---|
| `instant` | `0ms` | Toggles that should feel immediate (no animation) |
| `fast` | `100ms` | Micro-interactions: button press, checkbox tick |
| `base` | `150ms` | State transitions: hover, focus ring appearance |
| `smooth` | `200ms` | UI transitions: dropdown open, toast slide |
| `moderate` | `300ms` | Panel opens: mobile nav, sidebar collapse |
| `deliberate` | `400ms` | Modal open/close, page section reveal |
| `slow` | `600ms` | Hero entrance animations, onboarding steps |

### 10.2 Easing Functions

| Name | CSS Value | Use |
|---|---|---|
| `ease-standard` | `cubic-bezier(0.4, 0, 0.2, 1)` | Default — most transitions |
| `ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | Elements leaving the screen |
| `ease-out` | `cubic-bezier(0, 0, 0.2, 1)` | Elements entering the screen |
| `ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Playful bounces — use sparingly (onboarding only) |
| `ease-linear` | `linear` | Spinners, loaders, continuous animations |

### 10.3 What to Animate

✅ **Always animate:**
- Button hover/active states (shadow, transform)
- Focus ring appearance
- Dropdown / popover open/close
- Modal open/close (fade + scale)
- Toast slide in/out
- Navigation transitions
- Card hover lift
- Loading spinners (`animate-spin`)
- Skeleton shimmer (`animate-pulse`)

⚠️ **Animate carefully:**
- Page transitions (keep subtle — `opacity` only, no slide)
- Scroll-triggered reveals (use `IntersectionObserver`, not scroll events)
- Accordion expand/collapse (height is expensive — use `max-height` workaround or `framer-motion layout`)

❌ **Never animate:**
- Background color changes on large surfaces (expensive paint)
- Font size changes
- Width/height during layout (prefer `transform: scale()`)
- Elements when `prefers-reduced-motion: reduce` is detected

### 10.4 Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

All animation components must check `useReducedMotion()` (via a custom hook or `framer-motion`) and skip animations when the user preference is set.

### 10.5 Loading States

- **Skeleton loaders** for content that loads in <3s (dashboard cards, list items)
- **Spinner** (`Loader2` + `animate-spin`) for actions (button loading state, form submit)
- **Progress bar** for multi-step uploads or long operations
- Never show a skeleton and a spinner simultaneously for the same element

---

## 11. Imagery Guidelines

### 11.1 Photo Style

EverAfter's imagery communicates romance, intimacy, and authentic human moments — not staged stock photography.

| Characteristic | Guideline |
|---|---|
| **Subject** | Real couples, hands, rings, flowers, nature details, candid emotions |
| **Lighting** | Warm, golden hour natural light preferred; soft indoor light acceptable |
| **Color Grading** | Warm-to-neutral tones; avoid desaturated, cold-blue, or overexposed styles |
| **Composition** | Negative space is welcome; hero images may have text overlaid |
| **Diversity** | Actively curate a diverse range of couples, cultures, and wedding styles |
| **Avoid** | Overly staged poses, stock-photo aesthetic, clip art, cold/harsh lighting |

### 11.2 Aspect Ratios

| Context | Ratio | Notes |
|---|---|---|
| Hero section (full-width) | `16:9` or `21:9` | Use `object-fit: cover`; focus point on couple |
| Theme card preview | `3:2` | Always landscape |
| Gallery grid (large) | `4:3` | Uniform grid |
| Gallery grid (portrait) | `3:4` | For portrait wedding photos |
| Feature card image | `16:9` | Top of card, full-width |
| Testimonial avatar | `1:1` | Circle crop |
| Blog cover image | `16:9` | Standard |
| Couple's wedding hero | `21:9` or `16:9` | Full-bleed on couple's public site |

### 11.3 Image Treatment

- **Hero overlays:** Semi-transparent gradient overlay when text appears over images. Use `linear-gradient(to bottom, rgba(28,28,28,0.2), rgba(28,28,28,0.6))` for readability.
- **Blush tint option:** For marketing imagery, a subtle blush overlay (`rgba(232,213,196,0.15)`) can add brand warmth.
- **Borders:** Images inside cards use `overflow-hidden` on the container; no explicit image border.
- **Loading:** Always use `next/image` with `placeholder="blur"` and a `blurDataURL` for LCP optimization.
- **Alt text:** Required on every image — describe the scene meaningfully (e.g., "Couple exchanging rings at sunset ceremony", not "wedding").

### 11.4 Illustration / Icon Imagery

- Line-art illustrations in gold (`#C9A96E`) on blush (`#FAF5EC`) backgrounds for empty states
- SVG preferred over PNG for all decorative graphics
- Do not use emoji as primary design elements
- Decorative dividers: thin gold rule (`1px solid #C9A96E`, 40px wide) centered under section titles

---

## 12. Accessibility Design Rules

> [!IMPORTANT]
> EverAfter targets **WCAG 2.1 AA** compliance. All design decisions must be validated against these rules before implementation.

### 12.1 Color Contrast

| Combination | Minimum Ratio | Notes |
|---|---|---|
| Body text on white | **4.5:1** | `#1C1C1C` on `#FFFFFF` = 19.2:1 ✅ |
| Body text on `neutral-50` | **4.5:1** | `#1C1C1C` on `#F7F4F0` = 18.1:1 ✅ |
| Secondary text on white | **4.5:1** | `#6B6B6B` on `#FFFFFF` = 5.74:1 ✅ |
| White text on `primary` | **3:1** (large) / **4.5:1** (normal) | `#FFFFFF` on `#C9A96E` = 2.42:1 ⚠️ — Use only for large/bold text or icons |
| White text on `primary-dark` | **4.5:1** | `#FFFFFF` on `#A07840` = 4.52:1 ✅ |
| `primary` text on white | — | `#C9A96E` on `#FFFFFF` = 2.42:1 ❌ — **Never use for body text** |
| `primary-dark` text on white | **4.5:1** | `#A07840` on `#FFFFFF` = 4.52:1 ✅ — Use for gold-colored links/labels |
| Error text on white | **4.5:1** | `#DC2626` on `#FFFFFF` = 5.9:1 ✅ |
| Placeholder text | **3:1** min | `#B0B0B0` on `#FFFFFF` = 2.32:1 ⚠️ — Use `#767676` (`neutral-400`) instead |

> [!CAUTION]
> The primary gold `#C9A96E` **fails WCAG AA as a text color on white**. Never use it for body text, link text in paragraphs, or label text. Only use as a background color or for decorative/large display elements. For gold-colored interactive text, use `#7A5C28` (dark gold) which passes at 7.1:1.

### 12.2 Focus States

All interactive elements **must** have a visible focus indicator. EverAfter's focus ring:

```css
/* Global focus visible ring */
:focus-visible {
  outline: 2px solid #C9A96E;
  outline-offset: 2px;
  border-radius: 4px; /* matches element radius */
}

/* Remove outline for mouse users */
:focus:not(:focus-visible) {
  outline: none;
}
```

- Focus rings must be visible against both white and `neutral-50` backgrounds
- Never suppress focus outlines with `outline: none` without an equally visible alternative
- The gold `2px` ring with `2px` offset passes visibility requirements

### 12.3 Font Size Minimums

| Context | Minimum Size | Notes |
|---|---|---|
| Body text | `16px` | Never go below on reading content |
| Labels / Form | `14px` | Minimum for form labels |
| Captions | `12px` | Absolute minimum; must be non-critical info |
| Button text | `14px` | `13px` allowed only for `sm` buttons in compact UI |
| Tooltip text | `13px` | Must have sufficient contrast on dark background |

### 12.4 Target Touch Sizes

- All interactive elements (buttons, links, checkboxes): minimum `44×44px` touch target (WCAG 2.5.5 AAA / 2.5.8 AA)
- Small interactive elements (icon buttons) must have `padding` applied to expand the clickable area even if the visual element is smaller

### 12.5 Semantic Structure

- Use `<h1>` exactly once per page (page title)
- Heading levels must not skip (h1 → h2 → h3, never h1 → h3)
- All form inputs have associated `<label>` via `for`/`id` or `aria-labelledby`
- Error messages use `role="alert"` or `aria-live="polite"`
- Images: all `<img>` have `alt`; decorative images use `alt=""`
- Navigation landmark: `<nav aria-label="Main navigation">`
- Main content: `<main id="main-content">` with skip link

### 12.6 Skip Link

```tsx
// First element in <body>, visually hidden until focused
<a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-md focus:font-medium">
  Skip to main content
</a>
```

### 12.7 ARIA Labels for Icon-Only Elements

```tsx
// Correct
<button aria-label="Close dialog"><X size={20} aria-hidden="true" /></button>

// Incorrect — screen reader announces nothing meaningful
<button><X size={20} /></button>
```

---

## 13. Tailwind Configuration

The following is the complete `tailwind.config.ts` implementing the EverAfter design system as Tailwind tokens.

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    // ─── Container ─────────────────────────────────────────────────────────
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '3rem',
        xl: '4rem',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
      },
    },

    // ─── Breakpoints (mobile-first) ─────────────────────────────────────────
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },

    extend: {
      // ─── Color Palette ───────────────────────────────────────────────────
      colors: {
        primary: {
          DEFAULT: '#C9A96E',
          dark: '#A07840',
          light: '#E8D4A8',
          subtle: '#FAF5EC',
          // For gold-colored text (WCAG AA compliant)
          text: '#7A5C28',
        },
        accent: {
          DEFAULT: '#E8D5C4',
          dark: '#C9A98C',
        },
        neutral: {
          50: '#F7F4F0',
          100: '#F0EDE9',
          200: '#D9D9D9',
          300: '#B0B0B0',
          400: '#767676',  // WCAG AA compliant for placeholder text
          500: '#6B6B6B',
          700: '#3D3D3D',
          900: '#1C1C1C',
        },
        error: {
          DEFAULT: '#DC2626',
          light: '#FEE2E2',
          dark: '#B91C1C',
        },
        success: {
          DEFAULT: '#16A34A',
          light: '#DCFCE7',
          dark: '#15803D',
        },
        warning: {
          DEFAULT: '#D97706',
          light: '#FEF3C7',
          dark: '#B45309',
        },
        info: {
          DEFAULT: '#2563EB',
          light: '#DBEAFE',
          dark: '#1D4ED8',
        },
      },

      // ─── Typography ──────────────────────────────────────────────────────
      fontFamily: {
        playfair: ['var(--font-playfair)', 'Georgia', 'Times New Roman', 'serif'],
        inter: ['var(--font-inter)', ...fontFamily.sans],
        sans: ['var(--font-inter)', ...fontFamily.sans],
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      fontSize: {
        // Display
        'display-2xl': ['4.5rem',   { lineHeight: '1.1',  letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-xl':  ['3.75rem',  { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '700' }],
        // Headings
        'h1':          ['3rem',     { lineHeight: '1.2',  letterSpacing: '-0.01em', fontWeight: '700' }],
        'h2':          ['2.25rem',  { lineHeight: '1.25', letterSpacing: '-0.01em', fontWeight: '600' }],
        'h3':          ['1.875rem', { lineHeight: '1.3',  letterSpacing: '0',       fontWeight: '600' }],
        'h4':          ['1.5rem',   { lineHeight: '1.35', letterSpacing: '0',       fontWeight: '600' }],
        'h5':          ['1.25rem',  { lineHeight: '1.4',  letterSpacing: '0',       fontWeight: '600' }],
        'h6':          ['1.125rem', { lineHeight: '1.4',  letterSpacing: '0.01em',  fontWeight: '600' }],
        // Body
        'body-lg':     ['1.125rem', { lineHeight: '1.75', letterSpacing: '0',       fontWeight: '400' }],
        'body':        ['1rem',     { lineHeight: '1.625',letterSpacing: '0',       fontWeight: '400' }],
        'body-sm':     ['0.875rem', { lineHeight: '1.5',  letterSpacing: '0',       fontWeight: '400' }],
        // UI
        'caption':     ['0.8125rem',{ lineHeight: '1.4',  letterSpacing: '0.01em',  fontWeight: '400' }],
        'label':       ['0.875rem', { lineHeight: '1.25', letterSpacing: '0.01em',  fontWeight: '500' }],
        'label-sm':    ['0.75rem',  { lineHeight: '1.25', letterSpacing: '0.04em',  fontWeight: '500' }],
        'overline':    ['0.6875rem',{ lineHeight: '1.2',  letterSpacing: '0.1em',   fontWeight: '600' }],
        'button':      ['0.9375rem',{ lineHeight: '1.25', letterSpacing: '0.01em',  fontWeight: '600' }],
      },

      // ─── Spacing ─────────────────────────────────────────────────────────
      // Tailwind's default 4px base scale is already correct.
      // Custom additions:
      spacing: {
        '18': '4.5rem',   // 72px — occasional need
        '22': '5.5rem',   // 88px — section gap variant
        '26': '6.5rem',   // 104px
        '30': '7.5rem',   // 120px — large section padding
        '128': '32rem',   // 512px — hero height minimum
      },

      // ─── Border Radius ───────────────────────────────────────────────────
      borderRadius: {
        'none': '0px',
        'sm':   '4px',
        DEFAULT:'8px',   // radius-md
        'md':   '8px',
        'lg':   '12px',
        'xl':   '16px',
        '2xl':  '24px',
        '3xl':  '32px',
        'full': '9999px',
      },

      // ─── Box Shadows ─────────────────────────────────────────────────────
      boxShadow: {
        'sm':   '0 1px 3px rgba(28,28,28,0.08), 0 1px 2px rgba(28,28,28,0.05)',
        DEFAULT:'0 4px 12px rgba(28,28,28,0.10), 0 2px 4px rgba(28,28,28,0.06)',
        'md':   '0 4px 12px rgba(28,28,28,0.10), 0 2px 4px rgba(28,28,28,0.06)',
        'lg':   '0 10px 30px rgba(28,28,28,0.12), 0 4px 8px rgba(28,28,28,0.08)',
        'xl':   '0 20px 60px rgba(28,28,28,0.16), 0 8px 16px rgba(28,28,28,0.10)',
        '2xl':  '0 25px 80px rgba(28,28,28,0.20)',
        // Brand-specific
        'gold': '0 4px 20px rgba(201,169,110,0.4)',     // Primary CTA glow
        'gold-lg': '0 8px 32px rgba(201,169,110,0.5)',  // Hero CTA glow
        'inner': 'inset 0 2px 4px rgba(28,28,28,0.06)',
        'none':  'none',
      },

      // ─── Animation / Transition ──────────────────────────────────────────
      transitionDuration: {
        '0':    '0ms',
        '100':  '100ms',
        '150':  '150ms',
        '200':  '200ms',
        '250':  '250ms',
        '300':  '300ms',
        '400':  '400ms',
        '600':  '600ms',
      },
      transitionTimingFunction: {
        'standard':  'cubic-bezier(0.4, 0, 0.2, 1)',
        'in':        'cubic-bezier(0.4, 0, 1, 1)',
        'out':       'cubic-bezier(0, 0, 0.2, 1)',
        'spring':    'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-out': {
          '0%':   { opacity: '1' },
          '100%': { opacity: '0' },
        },
        'slide-up': {
          '0%':   { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',   opacity: '1' },
        },
        'slide-down': {
          '0%':   { transform: 'translateY(-8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
        'scale-in': {
          '0%':   { transform: 'scale(0.97)', opacity: '0' },
          '100%': { transform: 'scale(1)',    opacity: '1' },
        },
        'shimmer': {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0'  },
        },
        'spin-slow': {
          '0%':   { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'fade-in':    'fade-in 200ms ease-out',
        'fade-out':   'fade-out 150ms ease-in',
        'slide-up':   'slide-up 200ms ease-out',
        'slide-down': 'slide-down 200ms ease-out',
        'scale-in':   'scale-in 200ms ease-out',
        'shimmer':    'shimmer 2s linear infinite',
        'spin-slow':  'spin-slow 3s linear infinite',
      },

      // ─── Z-Index Scale ───────────────────────────────────────────────────
      zIndex: {
        '0':   '0',
        '10':  '10',   // Cards
        '20':  '20',   // Dropdowns, tooltips
        '30':  '30',   // Sticky nav
        '40':  '40',   // Sidebar
        '50':  '50',   // Modal backdrop
        '60':  '60',   // Modal content
        '70':  '70',   // Toast notifications
        '100': '100',  // Skip link, top-of-page overlays
      },

      // ─── Max Width ───────────────────────────────────────────────────────
      maxWidth: {
        'reading': '72ch',  // Optimal for long-form text
        'prose':   '65ch',
        'form':    '480px',
        'content': '720px',
        'page':    '1280px',
      },

      // ─── Aspect Ratios ───────────────────────────────────────────────────
      aspectRatio: {
        'auto':  'auto',
        'square':'1 / 1',
        'video': '16 / 9',
        'wide':  '21 / 9',
        'card':  '3 / 2',
        'portrait': '3 / 4',
        'gallery': '4 / 3',
      },
    },
  },

  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class', // Apply form styles only via .form-input, .form-select, etc.
    }),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    // tailwindcss-animate (for shadcn/ui compatibility)
    require('tailwindcss-animate'),
  ],
};

export default config;
```

### 13.1 CSS Custom Properties (globals.css)

```css
/* src/app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* ── Brand Colors ─────────────────────────── */
    --color-primary:        201 169 110;   /* #C9A96E */
    --color-primary-dark:   160 120  64;   /* #A07840 */
    --color-primary-light:  232 212 168;   /* #E8D4A8 */
    --color-primary-subtle: 250 245 236;   /* #FAF5EC */
    --color-accent:         232 213 196;   /* #E8D5C4 */
    --color-accent-dark:    201 169 140;   /* #C9A98C */

    /* ── Neutrals ─────────────────────────────── */
    --color-neutral-900:    28  28  28;    /* #1C1C1C */
    --color-neutral-700:    61  61  61;    /* #3D3D3D */
    --color-neutral-500:   107 107 107;    /* #6B6B6B */
    --color-neutral-300:   176 176 176;    /* #B0B0B0 */
    --color-neutral-200:   217 217 217;    /* #D9D9D9 */
    --color-neutral-100:   240 237 233;    /* #F0EDE9 */
    --color-neutral-50:    247 244 240;    /* #F7F4F0 */

    /* ── Semantic ─────────────────────────────── */
    --color-bg:            247 244 240;    /* Page background */
    --color-surface:       255 255 255;    /* Card/modal surface */
    --color-border:        217 217 217;    /* Default border */
    --color-text:           28  28  28;    /* Primary text */
    --color-text-secondary: 107 107 107;   /* Secondary text */

    /* ── Status ───────────────────────────────── */
    --color-error:         220  38  38;    /* #DC2626 */
    --color-error-light:   254 226 226;    /* #FEE2E2 */
    --color-success:        22 163  74;    /* #16A34A */
    --color-success-light: 220 252 231;    /* #DCFCE7 */
    --color-warning:       217 119   6;    /* #D97706 */
    --color-warning-light: 254 243 199;    /* #FEF3C7 */
    --color-info:           37  99 235;    /* #2563EB */
    --color-info-light:    219 234 254;    /* #DBEAFE */

    /* ── Fonts ────────────────────────────────── */
    --font-playfair: 'Playfair Display', Georgia, serif;
    --font-inter:    'Inter', Helvetica Neue, Arial, sans-serif;

    /* ── Radius ───────────────────────────────── */
    --radius-sm:   4px;
    --radius-md:   8px;
    --radius-lg:  12px;
    --radius-xl:  16px;
    --radius-2xl: 24px;
    --radius-3xl: 32px;
  }

  /* Dark mode overrides — v2 */
  .dark {
    --color-bg:            18  18  18;    /* #121212 */
    --color-surface:       30  30  30;    /* #1E1E1E */
    --color-border:        58  58  58;    /* #3A3A3A */
    --color-text:          240 237 233;   /* #F0EDE9 */
    --color-text-secondary: 156 150 145;  /* #9C9691 */
  }

  /* ── Base HTML Resets ────────────────────────────── */
  html {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    scroll-behavior: smooth;
  }

  body {
    @apply bg-neutral-50 text-neutral-900 font-inter;
  }

  h1, h2, h3, h4 {
    @apply font-playfair;
  }

  h5, h6 {
    @apply font-inter;
  }

  /* ── Focus Visible ───────────────────────────────── */
  :focus-visible {
    outline: 2px solid #C9A96E;
    outline-offset: 2px;
    border-radius: 4px;
  }

  :focus:not(:focus-visible) {
    outline: none;
  }

  /* ── Reduced Motion ──────────────────────────────── */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
}

@layer components {
  /* ── Skeleton Loader ─────────────────────────────── */
  .skeleton {
    @apply animate-pulse bg-neutral-200 rounded-md;
  }

  .skeleton-shimmer {
    background: linear-gradient(90deg, #F0EDE9 25%, #E8E4DF 50%, #F0EDE9 75%);
    background-size: 200% 100%;
    @apply animate-shimmer rounded-md;
  }

  /* ── Gold Divider ────────────────────────────────── */
  .divider-gold {
    @apply mx-auto my-4 w-10 h-px bg-primary opacity-60;
  }

  /* ── Reading Width ───────────────────────────────── */
  .reading-width {
    @apply max-w-[72ch] mx-auto;
  }
}
```

---

## Appendix A — shadcn/ui Integration Notes

EverAfter uses **shadcn/ui** as a component foundation. The `components.json` configuration:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "stone",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

**Override strategy:** All shadcn/ui components are copied into `/src/components/ui/` and customized to use EverAfter design tokens. Never import from `shadcn/ui` directly — always import from `@/components/ui`.

---

## Appendix B — Design Token Quick Reference

| Need | Token / Class |
|---|---|
| Main gold color | `text-primary` / `bg-primary` / `#C9A96E` |
| Gold hover | `hover:bg-primary-dark` / `#A07840` |
| Gold for text (AA safe) | `text-primary-text` / `#7A5C28` |
| Page background | `bg-neutral-50` / `#F7F4F0` |
| Card surface | `bg-white` |
| Primary heading | `font-playfair text-h1 text-neutral-900` |
| Body text | `font-inter text-body text-neutral-900` |
| Secondary text | `font-inter text-body-sm text-neutral-500` |
| Default card | `bg-white rounded-lg shadow-sm border border-neutral-100 p-6` |
| Primary button | `bg-primary hover:bg-primary-dark text-white font-semibold rounded-md px-4 py-2.5` |
| Section spacing | `py-20 md:py-24` |
| Focus ring | `focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2` |

---

*This document is maintained by the Website CTO. Design decisions that deviate from this system require CTO sign-off and must be documented in WEBSITE_CHANGELOG.md.*
