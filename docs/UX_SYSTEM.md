# UX_SYSTEM.md
> **EverAfter — UX System & Design Specification**
> Last updated: 2026-09-27 | Website CTO

---

## Table of Contents

1. [UX Principles](#1-ux-principles)
2. [Information Architecture](#2-information-architecture)
3. [Navigation Design](#3-navigation-design)
4. [Core User Flows](#4-core-user-flows)
5. [Page-by-Page UX Specs](#5-page-by-page-ux-specs)
6. [Form Design Principles](#6-form-design-principles)
7. [Loading States & Skeleton Patterns](#7-loading-states--skeleton-patterns)
8. [Empty States](#8-empty-states)
9. [Error States](#9-error-states)
10. [Mobile UX Considerations](#10-mobile-ux-considerations)
11. [Responsive Breakpoint Behavior](#11-responsive-breakpoint-behavior)
12. [Onboarding UX — New Couple Wizard](#12-onboarding-ux--new-couple-wizard)

---

## 1. UX Principles

These principles are the foundation of every interface decision made in EverAfter. When in doubt, resolve conflicts by referencing these in order.

### 1.1 Celebrate, Don't Overwhelm

Wedding planning is emotionally charged. Every screen must feel joyful and manageable — not like a productivity tool. Use progressive disclosure: surface only what the user needs at that moment. Hide complexity behind "Advanced" toggles or secondary screens.

> **Example:** The couple dashboard shows 4 core cards (guests, website, RSVP, seating) — not a wall of metrics.

### 1.2 Zero-Config First Impression

The moment a couple signs up, they must see something beautiful immediately — not a blank state requiring setup. Pre-populate the website builder with their names, a default theme, and placeholder content so the "wow" moment happens in the first 60 seconds.

### 1.3 Guests Are First-Class Users

Guests visit the public wedding site for one reason: to feel included and get the information they need. The public site must be zero-friction — no account required, no downloads, no confusion. RSVP submission must be completable in under 90 seconds.

### 1.4 Clarity Over Creativity

Avoid clever UI metaphors that require a tutorial. Label buttons with verbs that say exactly what they do ("Add Guest", "Publish Website", "Confirm RSVP"). Never rely on icon-only affordances without a text label in primary actions.

### 1.5 Errors Are Human

If a user makes a mistake, the system takes responsibility for guiding them back. Error messages must explain what went wrong and offer a concrete next step. Never show raw error codes to end users.

### 1.6 Trust is the Product

Couples are sharing their most important life event. The UI must signal security, reliability, and permanence at every touchpoint — through polished design, confirmations, and responsive feedback (saving states, success toasts, email confirmations).

### 1.7 Mobile is Real Primary

A significant portion of couples will onboard and manage their wedding from a mobile device. All interactive elements must be touch-friendly (min 44×44px tap targets). No feature is "mobile-optional."

### 1.8 Accessibility is Non-Negotiable

Target WCAG 2.1 AA. This is not a nice-to-have: guests of many backgrounds and abilities will use the public site. Every interactive element must be keyboard-reachable, screen-reader-annotated, and have sufficient contrast.

### 1.9 Feedback is Instant

Every action must produce immediate visual feedback:
- Button clicks → loading state within 100ms
- Form saves → inline success indicator
- Background saves (auto-save in builder) → subtle "Saved" chip in the top bar

### 1.10 The Upgrade Path Must Never Feel Like a Wall

Premium prompts must feel like an invitation, not a block. When a free user hits a limit, show what they'd gain — not just what they can't have. Use "soft walls" (preview the locked feature, then prompt) rather than hard blocks.

---

## 2. Information Architecture

### 2.1 Marketing Site Sitemap

```
everafter.com/
├── /                          Homepage
├── /features                  Feature highlights (all)
│   └── /features/[slug]       Individual feature deep-dive
├── /pricing                   Pricing tiers + FAQ
├── /themes                    Template gallery (browsable without signup)
│   └── /themes/[slug]         Theme preview + "Use this theme" CTA
├── /for-planners              Landing page: professional planners
├── /blog                      SEO blog index
│   └── /blog/[slug]           Blog post
├── /about                     Company story + team
├── /contact                   Contact form
├── /privacy                   Privacy policy
├── /terms                     Terms of service
├── /sitemap.xml               (auto-generated)
└── /robots.txt                (auto-generated)
```

### 2.2 App Sitemap (Couple Dashboard — `app.everafter.com`)

```
app.everafter.com/
├── /login                     Auth — login / magic link / Google OAuth
├── /signup                    Auth — registration entry point
├── /onboarding                Onboarding wizard (new couples only)
│   ├── /onboarding/welcome    Step 1: Names + wedding date
│   ├── /onboarding/theme      Step 2: Choose a theme
│   ├── /onboarding/details    Step 3: Venue + city
│   └── /onboarding/share      Step 4: Preview + share link
├── /dashboard                 Main couple dashboard (overview)
├── /website                   Website builder
│   ├── /website/editor        Visual page editor
│   ├── /website/theme         Theme picker + customizer
│   └── /website/settings      Site settings (slug, domain, privacy)
├── /guests                    Guest list manager
│   ├── /guests/[id]           Individual guest detail
│   └── /guests/import         CSV import flow
├── /rsvp                      RSVP response overview
│   └── /rsvp/[id]             Individual RSVP detail
├── /seating                   Seating chart planner
├── /registry                  Registry links manager
├── /gallery                   Photo gallery manager
├── /timeline                  Wedding day timeline editor
└── /settings                  Account settings
    ├── /settings/profile      Profile + wedding info
    ├── /settings/billing      Subscription + invoices
    └── /settings/domain       Custom domain setup
```

### 2.3 Public Wedding Site Sitemap (`[slug].everafter.com` or custom domain)

```
[couple-slug].everafter.com/
├── /                          Couple's wedding homepage
│   └── (hero, countdown, our story, venue snapshot)
├── /rsvp                      RSVP form
├── /details                   Event details (venue, schedule, dress code, travel)
├── /registry                  Registry links + descriptions
├── /gallery                   Shared photo gallery + guest upload
└── /faq                       Couple's FAQ for guests
```

> **Note:** All public site pages are SSR-rendered. The URL structure is determined by the couple's site slug or custom domain, resolved via Next.js middleware.

### 2.4 Planner Dashboard Sitemap (`app.everafter.com/planner`)

```
/planner/
├── /planner                   Dashboard — all managed couples (overview cards)
├── /planner/couples           Full list view of all couples
│   └── /planner/couples/[id]  Jump to a specific couple's dashboard
├── /planner/add-couple        Invite/create a new couple account
├── /planner/calendar          Unified calendar view (all weddings)
└── /planner/settings          Planner profile + billing
```

---

## 3. Navigation Design

### 3.1 Marketing Site Navigation

**Top Nav (desktop) — sticky, transparent-to-white on scroll:**

```
[EverAfter logo]    Features   Pricing   Themes   For Planners   Blog   [Log In]  [Start for Free →]
```

- Logo: links to `/`
- Links: text-only, no dropdowns except "Features" (mega-menu or dropdown on hover)
- "Log In": ghost button (text style)
- "Start for Free →": primary gold filled button
- On scroll past hero: nav background transitions from transparent → `#FFFFFF` with subtle shadow
- Active link: gold underline indicator

**Features Dropdown (hover/focus):**
```
┌─────────────────────────────────────────┐
│ Website Builder    Guest List & RSVPs   │
│ Seating Chart      Photo Gallery        │
│ Registry           Wedding Timeline     │
│ ─────────────────────────────────────   │
│ 🏆 For Professional Planners →          │
└─────────────────────────────────────────┘
```

**Footer (3-column grid):**
```
Column 1: Logo + tagline + social icons
Column 2: Product (Features, Pricing, Themes, For Planners)
Column 3: Company (About, Blog, Contact, Privacy, Terms)
```

**Mobile Marketing Nav:**
- Hamburger icon (top-right) → full-screen slide-in drawer
- All links listed vertically
- "Start for Free" CTA button pinned at bottom of drawer

---

### 3.2 App Navigation (Couple Dashboard)

**Layout:** Two-panel — collapsible left sidebar + top bar

**Top Bar (always visible):**
```
[≡ Sidebar toggle]  [EverAfter logo]  ——————————  [Auto-save chip]  [🔗 View Site]  [⬆ Upgrade]  [👤 Avatar menu]
```

- **Auto-save chip:** Appears as "Saved ✓" (green) or "Saving…" (spinner) in website builder
- **View Site:** Opens couple's public site in new tab
- **Upgrade:** Shown only on free tier — gold accent, not intrusive
- **Avatar menu:** Profile, Settings, Billing, Log Out

**Left Sidebar (desktop — 240px wide, collapsible to 60px icon-rail):**
```
┌──────────────────────┐
│  🏠  Dashboard        │
│  🌐  Website Builder  │
│  👥  Guests           │
│  ✉️  RSVPs            │
│  🪑  Seating Chart    │
│  🎁  Registry         │
│  📷  Gallery          │
│  📅  Timeline         │
│  ⚙️  Settings         │
│                       │
│  ─────────────────    │
│  💎 Upgrade to Pro   │  (free tier only)
└──────────────────────┘
```

- Active item: gold left-border accent + light gold background
- Icon + label in expanded mode; icon + tooltip in collapsed mode
- Sidebar state persisted in `localStorage`

**Planner-specific sidebar additions:**
```
│  👔  My Couples       │
│  📆  Calendar         │
```

---

### 3.3 Mobile Navigation Patterns

**App — Mobile (< 768px):**
- No sidebar. Replace with bottom tab bar (5 max items):
  ```
  [🏠 Home]  [👥 Guests]  [✉️ RSVPs]  [🌐 Site]  [⋯ More]
  ```
- "More" tab opens a bottom sheet with remaining navigation items (Seating, Registry, Gallery, Timeline, Settings)
- Active tab: gold icon + label
- Bottom tab bar: 56px height, safe-area padding for iOS notch

**Public Site — Mobile:**
- Sticky top nav: Logo (centered) + hamburger
- Full-screen overlay menu on hamburger tap
- RSVP CTA button always visible as sticky bottom bar on homepage

---

## 4. Core User Flows

### 4.1 New Couple Signup & Onboarding

**Entry points:** Marketing homepage CTA, /signup, Google/social referral

```
Step 1 — Landing & Sign Up
  ↓
  User clicks "Start for Free" on homepage
  ↓
  /signup — Two options presented:
    a) Continue with Google (OAuth)
    b) Sign up with email (Supabase magic link)
  ↓
  If magic link: "Check your inbox" screen shown (resend option after 60s)
  ↓
  User clicks magic link → authenticated session created

Step 2 — Onboarding Wizard (4 steps, dismissible after Step 2)
  ↓
  /onboarding/welcome
    - "What are your names?" — Partner 1 name, Partner 2 name
    - "When's the big day?" — Date picker (no past dates)
    - CTA: "Let's go →"
  ↓
  /onboarding/theme
    - "Pick a style for your site"
    - 6 theme cards shown (3 free, 3 premium with lock icon)
    - Hovering a theme shows a live preview panel on right
    - CTA: "Use this theme →"
  ↓
  /onboarding/details (optional but prompted)
    - "Where's the celebration?"
    - Venue name, City/Region (text fields)
    - "You can always add more details later"
    - CTA: "Almost there →" or "Skip for now →"
  ↓
  /onboarding/share
    - "Your wedding site is ready! 🎉"
    - Live preview of their site (iframe, non-interactive)
    - Their site URL shown with copy button
    - Share buttons: WhatsApp, Email, Copy link
    - CTA: "Go to my dashboard →"

Step 3 — Post-Onboarding Dashboard
  ↓
  /dashboard — Shows "Getting Started" checklist widget:
    ✓ Create your site (done)
    □ Add your first guest
    □ Set up your registry
    □ Upload a photo
    □ Share with guests
```

**Success metric:** Couple shares their site URL within first session.

---

### 4.2 Guest RSVP Flow

**Entry point:** Guest receives invitation link (e.g., `jane-and-john.everafter.com`)

```
Step 1 — Landing on the Couple's Wedding Site
  ↓
  Guest lands on / (public homepage)
  Countdown timer, hero photo, couple names visible immediately
  Sticky "RSVP" button visible on mobile
  ↓
  Guest clicks "RSVP" CTA (in nav or hero button)

Step 2 — RSVP Page (/rsvp)
  ↓
  "Are you on the guest list?"
    - Name lookup field (type-ahead search against guest list)
    - "I wasn't invited directly" option → manual entry mode
  ↓
  Guest found → their name pre-filled
  ↓
  RSVP Form (single page):
    - Attending? [Yes / No] — large toggle buttons
    - If Yes:
        - Meal preference (shown only if couple configured it)
        - Plus-one? (shown only if guest has plus-one allowance)
        - Dietary restrictions (optional text)
        - Message to couple (optional textarea)
    - If No:
        - Message to couple (optional)
  ↓
  Submit → loading state (button shows spinner)
  ↓
  Confirmation screen:
    - "Thank you, [Name]! 🎉 We'll see you on [date]!"  (or "We'll miss you!")
    - Add to calendar button (Google / Apple / iCal)
    - Link back to site: "View full wedding details →"
```

**Constraints:**
- No login required for guests
- RSVP submissions are rate-limited (max 5/minute per IP)
- Duplicate RSVP: re-visiting the RSVP page shows existing response with "Change your RSVP" option

---

### 4.3 Upgrade to Paid Flow

**Entry points:**
- Sidebar "Upgrade to Pro" pill (free tier)
- Feature lock icon click (e.g., custom domain, premium theme)
- `/settings/billing` page

```
Step 1 — Trigger (Soft Wall)
  ↓
  User clicks a locked feature (e.g., custom domain input)
  ↓
  Upgrade modal appears:
    - Feature preview (screenshot or animation of the locked feature)
    - Benefit headline: "Make it truly yours with a custom domain"
    - List of 3–4 premium benefits (bullet points)
    - Price: "$X/month — cancel anytime"
    - CTA: "Upgrade to Pro →"
    - "Maybe later" (dismisses, does not nag again for 24h)

Step 2 — Plan Selection (if multiple tiers)
  ↓
  /settings/billing — or inline within modal
  Plan comparison table (Couple Free vs. Couple Pro vs. Couple Premium)
  Toggle: Monthly / Annual (annual highlighted with "Save 20%")
  ↓
  User selects plan → "Continue to checkout →"

Step 3 — Stripe Checkout
  ↓
  Stripe-hosted checkout session opens (new tab or embedded)
  Pre-filled with user's email
  ↓
  Payment entered + confirmed

Step 4 — Success
  ↓
  Redirect to /settings/billing?success=true
  Success banner: "You're now on Pro! 🎉 Your new features are active."
  Locked features immediately unlocked (real-time subscription update via Supabase)
```

---

### 4.4 Planner Account Setup & Couple Management

**Entry point:** `/for-planners` → "Get Started as a Planner"

```
Step 1 — Planner Signup
  ↓
  Directed to /signup?role=planner
  Standard auth (Google / magic link)
  ↓
  Account created with role = PLANNER

Step 2 — Planner Onboarding (2-step, minimal)
  ↓
  Step 1: "Tell us about yourself"
    - Full name, Business/Agency name (optional)
    - How many weddings do you manage per year? (dropdown — for analytics)
  ↓
  Step 2: "Choose your plan"
    - Planner Pro plan presented with feature list
    - Stripe checkout

Step 3 — Planner Dashboard (/planner)
  ↓
  Empty state: "Add your first couple to get started"
  ↓
  Click "Add Couple" → modal:
    Option A: Invite an existing EverAfter couple (by email)
    Option B: Create a new couple account (planner manages it directly)
      - Enter partner names, wedding date, email
      - System creates couple account + sends invite email

Step 4 — Couple Management
  ↓
  /planner/couples — card grid of all managed couples:
    [Couple Photo/Initials] [Names] [Date] [RSVP count] [Status badge]
  ↓
  Click couple card → "Switch to couple" → loads that couple's dashboard
    (URL: /dashboard?as=couple_id, visually shows "Viewing as [Names]" banner)
  ↓
  Planner can return to their dashboard via: "← Back to planner view" link in top bar
```

---

### 4.5 Photo Upload Flow (Guest-Facing)

**Entry point:** Public gallery page (`/gallery`)

```
Step 1 — Gallery Page
  ↓
  Guest views photo grid
  "Share your photos" CTA button (prominent, top-right of gallery)

Step 2 — Upload Entry
  ↓
  No login required
  "Who are you?" form:
    - Name (text — so couple can credit them)
    - Optional: email (to notify when couple hearts their photo)
  ↓
  File picker opens (accept: image/*)
  OR drag-and-drop zone

Step 3 — Upload
  ↓
  Files selected → thumbnail previews shown immediately (client-side)
  Per-file progress bars animate as files upload to Supabase Storage
  ↓
  Each file shows: thumbnail | filename | progress bar | ✓ / ✗
  Failed files show retry button

Step 4 — Completion
  ↓
  "Your photos were shared! The couple will love these. 💕"
  ↓
  Uploaded photos appear in gallery immediately (or after couple approval if moderation is ON)
  ↓
  Couple receives a Resend notification email: "[Guest name] shared 3 photos"
```

---

## 5. Page-by-Page UX Specs

### 5.1 Homepage (Marketing — `/`)

**Goal:** Communicate value in 5 seconds, drive "Start for Free" signups.

**Structure:**

```
[Sticky Nav]

[Hero Section]
  - Headline (Playfair Display, 56px desktop): "Your love story, beautifully told."
  - Subheadline (Inter, 20px): "Create a stunning wedding website in minutes. Free."
  - CTA cluster: [Start for Free →] [See an example →]
  - Hero image: Mosaic of 3–4 beautiful wedding site screenshots / mockups
  - Animated countdown timer demo (subtle, in background)

[Social Proof Bar]
  - "Trusted by 10,000+ couples worldwide" — logos or avatar stack + star rating

[How It Works — 3-step]
  1. Sign up free   2. Customize your site   3. Share with guests
  Each step: icon + title + 1 sentence. Connected by dashed line on desktop.

[Feature Highlights — alternating rows]
  Row 1: [Screenshot left] | [Headline + 3 bullets right] — Website Builder
  Row 2: [Headline + 3 bullets left] | [Screenshot right] — Guest List & RSVP
  Row 3: [Screenshot left] | [Headline + 3 bullets right] — Seating Chart
  Row 4: [Screenshot left] | [Headline + 3 bullets right] — Photo Gallery

[Theme Showcase]
  - "Beautiful themes for every style"
  - Horizontally scrollable theme cards (6 visible) with names (e.g., "Garden", "Minimal", "Classic")
  - CTA: "Browse all themes →"

[Testimonials]
  - 3-column quote cards, couple names + photo
  - Auto-advancing carousel on mobile

[For Planners Callout]
  - Distinct background color section
  - "Are you a wedding professional?" headline
  - 3 planner benefits + CTA: "Learn more →"

[Final CTA]
  - "Start building your wedding site today — it's free."
  - [Start for Free →] button

[Footer]
```

**UX Notes:**
- Hero CTA "See an example" opens a real public demo site (`demo.everafter.com`) in a new tab
- All CTAs use `role="button"` and focus rings
- Images lazy-loaded below the fold

---

### 5.2 Pricing Page (`/pricing`)

**Structure:**

```
[Sticky Nav]

[Header]
  - H1: "Simple, transparent pricing"
  - Monthly / Annual toggle (pill switch — annual default to show savings)
  - "Save 20% annually" badge near toggle

[Plan Cards — 3 columns desktop, stacked mobile]
  ┌─────────────┐  ┌─────────────────┐  ┌────────────────┐
  │   Free      │  │   Pro  ★ POPULAR │  │   Premium      │
  │  $0/mo      │  │   $9/mo         │  │   $19/mo       │
  │             │  │                 │  │                │
  │  Feature    │  │  Feature list   │  │  Feature list  │
  │  list       │  │  (Pro includes  │  │  (includes all │
  │             │  │  all Free)      │  │  Pro)          │
  │  [Get       │  │  [Start Pro →]  │  │  [Go Premium]  │
  │  Started]   │  │                 │  │                │
  └─────────────┘  └─────────────────┘  └────────────────┘

  + Planner Pro card (full width, distinct styling, e.g., dark background)
    - "For Wedding Professionals" — $49/month, manage unlimited couples

[Feature Comparison Table]
  - Toggled visible with "Compare all features" disclosure
  - Rows: every feature; Columns: Free | Pro | Premium | Planner Pro
  - ✓ / ✗ / number (e.g., "Up to 50 guests" / "Unlimited")

[FAQ Accordion — 6–8 questions]
  "Can I cancel anytime?" / "What happens to my site if I downgrade?" / etc.

[CTA Section]
  - "Still deciding? Start free — no credit card required."

[Footer]
```

**UX Notes:**
- "Pro" card has a gold border + "Most Popular" badge
- Annual pricing shown by default; monthly shown on toggle
- Price displayed with strikethrough original + discounted on annual toggle
- Clicking any plan CTA that requires auth → redirect to /signup?plan=pro

---

### 5.3 Couple Dashboard (`/dashboard`)

**Goal:** Give a clear, calm overview of the wedding at a glance. Surface the most important next actions.

**Structure:**

```
[Top Bar] [Sidebar]

[Main Content — 12-col grid]

  Row 1: Welcome + Date countdown
    - "Welcome back, [Name] & [Name]!" (H2, Playfair)
    - Countdown: "[X] days until your wedding 🎉" — large number, gold accent
    - Sub-info: "Wedding date: [date] · [City]"

  Row 2: Key Metrics — 4 stat cards (3-col each)
    ┌────────────┐ ┌────────────┐ ┌──────────────┐ ┌────────────────┐
    │  Guests    │ │  RSVPs     │ │  Site Views  │ │  Photos        │
    │   48 total │ │  32 / 48  │ │   1,204      │ │  87 uploaded   │
    │  [Manage]  │ │  [View]   │ │  (last 30d)  │ │  [Gallery]     │
    └────────────┘ └────────────┘ └──────────────┘ └────────────────┘

  Row 3: Getting Started Checklist (shown until all complete)
    - Progress bar: 3/5 complete
    - ✓ Create your site
    - ✓ Add your first guest
    - □ Set up your registry → [Set up now]
    - □ Upload a photo → [Upload now]
    - □ Share with guests → [Share now]

  Row 4: Two-column split
    Left (7-col): Recent RSVP Activity feed
      - Latest 5 RSVPs, each showing: Name | Status (Attending/Declined) | Time
      - [View all RSVPs →] link at bottom

    Right (5-col): Quick Actions
      - [+ Add Guest]
      - [✏️ Edit Website]
      - [🔗 Copy Site Link]
      - [📧 Email Guests]

  Row 5: Website Preview Card
    - Thumbnail iframe (non-interactive) of their live site
    - [Edit site] and [View site] buttons
    - Site URL with copy icon
```

---

### 5.4 Website Builder (`/website/editor`)

**Goal:** Visually edit the public wedding site with no code. Fast, delightful, auto-saving.

**Layout:** Split-pane editor

```
┌─────────────────────────────────────────────────────────────────┐
│ TOP BAR: [← Dashboard]  "Website Builder"  [Saving... / Saved ✓]  [Preview] [Publish] │
├──────────────────────┬──────────────────────────────────────────┤
│ LEFT PANEL (320px)   │ RIGHT PANEL — LIVE PREVIEW               │
│                      │                                          │
│ SECTIONS (accordion) │  ┌──────────────────────────────────┐   │
│ ▼ Hero               │  │  [Live iframe of their site]     │   │
│   • Couple names     │  │                                  │   │
│   • Tagline          │  │  Clicking a section in preview   │   │
│   • Hero photo       │  │  scrolls/focuses the left panel  │   │
│ ▶ Our Story          │  │                                  │   │
│ ▶ Event Details      │  └──────────────────────────────────┘   │
│ ▶ Registry           │                                          │
│ ▶ Gallery            │  Device toggle: [Desktop] [Tablet] [Mobile]│
│ ▶ FAQ                │                                          │
│ ──────────────────── │                                          │
│ THEME               │                                          │
│ [Change Theme →]    │                                          │
│ ──────────────────── │                                          │
│ SECTIONS (reorder)  │                                          │
│ [+ Add Section]     │                                          │
└──────────────────────┴──────────────────────────────────────────┘
```

**Field patterns:**
- Text fields: inline editable (click text in preview or use left panel)
- Photo upload: drag-and-drop or click in left panel → Supabase Storage upload
- Rich text: minimal toolbar (bold, italic, link only) — no complex formatting

**Auto-save behavior:**
- Changes saved to DB after 1500ms of inactivity (debounced)
- Top bar shows "Saving…" → "Saved ✓"
- Publish ≠ save: saved changes are drafts; "Publish" makes them live

**Publish flow:**
- Click "Publish" → confirmation tooltip: "This will update your live site. Continue?" with [Publish now] / [Cancel]
- Success: top bar flashes green "Published! ✓"

---

### 5.5 Guest List Manager (`/guests`)

**Goal:** Add, organize, import, and track all wedding guests efficiently.

**Structure:**

```
[Page Header]
  H1: "Guest List" | Subtitle: "48 guests · 32 RSVPs received"
  Actions: [+ Add Guest]  [Import CSV]  [Export CSV]

[Filter/Search Bar]
  [🔍 Search by name]  [Filter by: RSVP status ▾]  [Filter by: Group ▾]  [Filter by: Table ▾]

[Guest Table]
  Columns: □ Select | Name | Email | RSVP Status | Plus One | Dietary | Group | Actions
  Row: checkbox | "Jane Smith" | jane@email.com | ✅ Attending | +1 (confirmed) | Vegetarian | Bride's side | [Edit] [...]
  ──────
  Pagination: 25 / 50 / 100 per page

[Bulk Actions Bar] (appears when ≥1 row selected)
  "3 selected" [Send RSVP reminder] [Move to group] [Delete]
```

**Add Guest modal:**
```
  Name* | Email | Phone | Group (dropdown: Bride's side / Groom's side / Mutual / VIP)
  Plus-one allowed? [toggle]
  Plus-one name (shown if toggle on)
  Dietary restrictions (text)
  Notes (textarea, private — visible only to couple)
  [Cancel] [Add Guest →]
```

**Import CSV:**
- Download sample CSV template link
- Drag-and-drop or click to upload
- Column mapping UI: "Match your columns to our fields"
- Preview table: first 5 rows shown before confirming import
- Duplicate detection: warn if email already exists

---

### 5.6 RSVP Response View (`/rsvp`)

**Goal:** Give the couple a clear view of all RSVP responses and outstanding invitations.

**Structure:**

```
[Page Header]
  H1: "RSVPs"
  Summary stats bar: ✅ Attending: 32  ❌ Declined: 4  ⏳ Awaiting: 12

[Tabs]: All | Attending | Declined | Awaiting Response

[Response Cards or Table]
  Each row:
    Name | RSVP Status | Plus One | Meal Preference | Date Responded | Message (if left) | [View] [Edit]

[Reminder Actions]
  Banner (if "Awaiting" tab): "12 guests haven't responded yet."
  [Send reminder email to all pending →]
  (Opens email composer modal with editable template)
```

**Individual RSVP detail (/rsvp/[id]):**
- Full RSVP form data in read-only view
- Couple can manually override RSVP status (for phone/in-person responses)
- Private notes field for couple

---

### 5.7 Seating Chart (`/seating`)

**Goal:** Visually arrange guests at tables with drag-and-drop simplicity.

**Layout:** Canvas-based drag-and-drop tool

```
┌─────────────────────────────────────────────────────────────────┐
│ [Page Header]  "Seating Chart"  [+ Add Table]  [Auto-assign ✨]  [Export PDF] │
├─────────────────────┬───────────────────────────────────────────┤
│ GUEST PANEL (280px) │ CANVAS (scrollable / zoomable)            │
│                     │                                           │
│ Unassigned (16)     │   [Table 1 — "Garden"]        [Table 2]  │
│ ─────────────       │   ╔══════════╗                            │
│ 🔍 Search guests    │   ║  8 seats ║                            │
│                     │   ║ • Jane S │                            │
│ [Jane Smith]        │   ║ • Mark T │                            │
│ [Bob Johnson]       │   ║ [empty]  │                            │
│ [Amy Chen]  ...     │   ╚══════════╝                            │
│                     │                                           │
│ Drag guests to      │   Click table to edit (name, size)        │
│ tables on right →   │   Drag guests from left panel to seats    │
│                     │   Drag guests between tables              │
└─────────────────────┴───────────────────────────────────────────┘
```

**Table card:**
- Shows table name, seat count (e.g., "6/8 filled"), and assigned guest names
- Click to expand detail panel on right
- Click guest chip in table → "Move to…" dropdown or drag

**Auto-assign:**
- "✨ Auto-assign" button → modal: "We'll assign unassigned guests to empty seats. This won't move already-assigned guests." [Auto-assign] [Cancel]

---

### 5.8 Planner Dashboard (`/planner`)

**Goal:** Give planners a unified view of all their managed weddings.

**Structure:**

```
[Page Header]
  H1: "My Couples"  | "[Planner Name] — Planner Pro"
  Action: [+ Add Couple]

[Summary Bar]
  Total couples: 12 | Upcoming this month: 3 | Total guests managed: 847

[Filter/Sort]
  [🔍 Search couples]  [Sort by: Wedding date ▾]  [Status: All ▾]

[Couple Cards Grid — 3 columns desktop, 2 tablet, 1 mobile]
  Each card:
  ┌─────────────────────────┐
  │ [Cover photo / initials]│
  │ Jane & John             │
  │ 📅 March 15, 2027       │
  │ 📍 Rome, Italy          │
  │ ─────────────────────── │
  │ 42 guests | 28 RSVPs   │
  │ [Open Dashboard →]      │
  └─────────────────────────┘
  Status badge: Upcoming / This Month / Past (color-coded)

[Calendar View tab]
  Month view showing all wedding dates as event chips
  Clicking a date → couple quick-view popover
```

**"Viewing as couple" mode:**
- When planner opens a couple's dashboard, a persistent top banner appears:
  ```
  👔 Viewing as: Jane & John's wedding   [← Back to Planner View]
  ```
- All actions performed in this mode are logged as "performed by planner [name]"

---

### 5.9 Public Couple Wedding Site — Homepage

**Goal:** Immerse guests in the couple's love story; provide key info; drive RSVP completion.

**Structure:**

```
[Site Nav — couple-branded]
  [Couple Logo/Names]  Home | Our Story | Details | Registry | Gallery | FAQ  [RSVP →]

[Hero Section]
  - Full-viewport photo (couple's hero image)
  - Overlay: "Jane & John" (Playfair, 72px) + "March 15, 2027 · Rome, Italy"
  - Countdown timer: [XX Days] [XX Hours] [XX Minutes] [XX Seconds]
  - [RSVP Now] button

[Our Story]
  - Couple's written story
  - Optional timeline (e.g., "How we met", "The proposal")

[Event Details Snapshot]
  - Ceremony: [venue, time]
  - Reception: [venue, time]
  - [Full details →] link to /details

[Registry Preview]
  - 2–3 registry links shown as buttons
  - [View all gifts →]

[Photo Gallery Teaser]
  - 6-photo masonry grid
  - [View all photos →] + [Share your photos] button

[Footer — couple branded]
  Powered by EverAfter (with link — free tier only; removable on Pro)
```

---

### 5.10 Public Wedding Site — RSVP Page (`/rsvp`)

**Goal:** Make RSVPing effortless and delightful. Complete in under 90 seconds.

**Structure:**

```
[Site Nav]

[RSVP Header]
  - "Will you join us?" (H1, Playfair)
  - Wedding date + venue shown for context

[Guest Lookup]
  - "Find your invitation" (label)
  - Text input with type-ahead: "Start typing your name..."
  - Guest results appear as dropdown within 200ms
  - "Not finding your name? Continue anyway →" (opens manual entry mode)

[RSVP Form] (shown after guest selected)
  - Pre-filled: "[Name], are you able to attend?" (personalized greeting)
  - Large toggle: [✅ Attending] [❌ Unable to attend]
  - If Attending:
      - Meal preference (dropdown — if couple enabled)
      - Dietary needs (text)
      - Plus-one (if allowed): Plus-one name field
      - Message to couple (textarea, optional)
  - If Declining:
      - Message to couple (textarea, optional)
  - [Confirm RSVP →] button

[Confirmation State]
  - Animated checkmark (CSS animation, no library needed)
  - "We'll see you there! 🎉" or "We'll miss you! 💕"
  - Add to calendar: [Google Calendar] [Apple Calendar] [Download .ics]
  - "View wedding details →" link
```

---

## 6. Form Design Principles

### 6.1 Layout

- **Single-column forms** for all primary flows (signup, RSVP, add guest, onboarding wizard)
- **Two-column grids** only for side-by-side fields that are semantically related (e.g., First Name | Last Name; Start Time | End Time)
- Maximum form width: **560px** centered on screen
- Group related fields with visible section headers or subtle separators

### 6.2 Labels & Placeholders

- Every field has a **persistent label above it** (never inside the field only)
- Placeholder text provides a format example, not a label: e.g., label = "Wedding date", placeholder = "e.g. 15 March 2027"
- Required fields: marked with a red asterisk `*` after the label; a note "* Required" appears below the form title
- Optional fields: labelled as "(optional)" in muted gray text after the label

### 6.3 Validation Rules

| Timing | Rule |
|---|---|
| **On blur** | Validate field when user leaves it (not while typing) |
| **On submit** | Re-validate all fields; scroll to first error |
| **Real-time** | Only for fields that benefit from it: password strength, email format after `@` is typed, URL slug availability |

### 6.4 Error Message Style

- Display inline, directly below the field that has the error
- Red text (`#DC2626`), 14px, with a `⚠` prefix icon
- Copy format: specific, actionable: ✅ "Enter a valid email address (e.g. you@example.com)" ❌ "Invalid email"
- Never use all-caps for error messages
- ARIA: `aria-describedby` linking input to error message; `aria-invalid="true"` on errored inputs

### 6.5 Submission States

| State | Button Text | Button Style |
|---|---|---|
| Default | "Submit" / "Save" / "Confirm RSVP" | Gold filled |
| Loading | Spinner + "Saving…" | Gold filled, disabled, opacity 70% |
| Success | "✓ Saved" (reverts to default after 2s) | Green filled (briefly) |
| Error | Reverts to default; error message shown above form | Gold filled |

### 6.6 Multi-step Forms (Wizard)

- Progress indicator: numbered step pills at top (e.g., `① → ② → ③ → ④`)
- Active step: gold filled circle; completed steps: gold outline with checkmark
- "Back" button always visible (top-left, text style) — never loses previously entered data
- "Next" button disabled until required fields in current step are valid
- Step data auto-saved to `localStorage` as user progresses (survives refresh)

### 6.7 Destructive Actions

- Any action that deletes data (delete guest, clear RSVP, remove table) must show a **confirmation dialog**:
  ```
  "Delete Jane Smith?"
  "This will also remove their RSVP response. This cannot be undone."
  [Cancel] [Delete guest]
  ```
- Destructive button: red fill (`#DC2626`) — used only in this confirmation dialog, nowhere else
- Default focus: set to "Cancel" in the dialog

---

## 7. Loading States & Skeleton Patterns

### 7.1 Principles

- Show loading feedback within **100ms** of an action being triggered
- Never block the entire page for partial data loads — load sections independently
- Skeleton screens preferred over spinners for content-heavy pages (dashboard, guest list, gallery)
- Spinners acceptable for: button actions, small in-place loads, modal openings

### 7.2 Skeleton Components

**Stat Card Skeleton:**
```
┌─────────────────┐
│ ▓▓▓▓▓▓▓  14px  │  ← shimmer gray bar (label)
│ ▓▓▓▓  28px      │  ← shimmer gray bar (number)
│ ▓▓▓▓▓▓  12px   │  ← shimmer gray bar (sub-label)
└─────────────────┘
```

**Guest Table Skeleton:**
- 10 rows of shimmer bars: `[□] [▓▓▓▓▓▓▓▓] [▓▓▓▓▓▓] [▓▓▓] [▓▓]`
- Column widths match actual data widths to prevent layout shift

**Gallery Skeleton:**
- Masonry grid of uniform gray rectangles (different heights to suggest photos)
- Shimmer animation: `background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite;`

**Website Builder Preview Skeleton:**
- Full-height gray rectangle with centered "Loading preview…" text + spinner

### 7.3 Page-Level Loading

- Marketing pages: no loading state (SSR — content arrives with HTML)
- App pages: show skeleton of the page layout for up to 500ms; fallback to full-page spinner if > 500ms

### 7.4 Button Loading Pattern

```tsx
// Pattern for all primary action buttons
<Button disabled={isLoading}>
  {isLoading ? <Spinner size="sm" /> : null}
  {isLoading ? "Saving…" : "Save Changes"}
</Button>
```

---

## 8. Empty States

Each empty state follows the pattern: **Illustration → Headline → Subtext → CTA**

### 8.1 Guest List — No Guests Yet

```
[Illustration: soft watercolor-style two chairs at a table]
"Your guest list is empty"
"Add your loved ones so you can track RSVPs, plan seating, and send updates."
[+ Add your first guest]  [Import from CSV]
```

### 8.2 RSVP Overview — No Responses Yet

```
[Illustration: envelope with heart]
"No RSVPs yet"
"Once guests visit your site and respond, their answers will appear here. Share your site to get started!"
[🔗 Copy site link]  [📧 Send invitations]
```

### 8.3 Photo Gallery — No Photos Yet

```
[Illustration: camera with sparkles]
"No photos yet"
"Your gallery will fill up as guests share their memories. You can also upload photos from your devices."
[📷 Upload photos]  [Share gallery link]
```

### 8.4 Seating Chart — No Guests Assigned

```
[Illustration: empty round tables with chairs]
"Your seating chart is a blank canvas"
"Add tables below, then drag guests from the panel on the left to assign their seats."
[+ Add your first table]
```

### 8.5 Registry — No Items Added

```
[Illustration: gift box with bow]
"No registry links yet"
"Add links to your registries so guests know where to shop for the perfect gift."
[+ Add registry link]
```

### 8.6 Planner Dashboard — No Couples Yet

```
[Illustration: two people holding hands on a calendar]
"You haven't added any couples yet"
"Add your first couple to start managing their wedding from one place."
[+ Add couple]
```

### 8.7 Timeline — No Events Added

```
[Illustration: clock with confetti]
"Build your wedding day timeline"
"Add ceremony, cocktail hour, reception, and any other events to keep your day on track."
[+ Add event]
```

**Design rules for empty states:**
- Illustrations: consistent soft watercolor style, muted palette — never jarring or overly cartoonish
- Headline: max 6 words, reassuring not alarming ("No guests yet" not "Error: list is empty")
- Subtext: explain what this section is for + encourage action
- CTA: always at least one primary action button; max two buttons in empty state
- No empty states without a CTA

---

## 9. Error States

### 9.1 404 — Page Not Found

**Context:** Applies to both marketing site and app.

```
[Full-page centered layout]

[Illustration: couple looking at a map with a question mark — romantic, not alarming]

"Oops — this page took a detour."
"The page you're looking for doesn't exist or may have moved."

[Go to Homepage]  [Go back]
```

**For public wedding sites:**
```
"We couldn't find this wedding site."
"The link may have expired, or the couple may have changed their site address."
[Browse EverAfter →]  (drives marketing conversion)
```

### 9.2 500 — Server Error

```
[Illustration: a ring with a crack — subtle, not catastrophic]

"Something went wrong on our end."
"Our team has been notified. Please try again in a moment — your data is safe."

[Try again]  [Go to Dashboard]
```

**Behavior:**
- Auto-retry in 5 seconds (show countdown: "Retrying in 5…")
- Log the error automatically (Vercel analytics + Sentry in production)
- Never show stack traces or technical details to users

### 9.3 Expired Invitation / RSVP Link

**Context:** Guest visits a wedding site that has been made private, deleted, or RSVP window has closed.

```
[Full-page, on public site branding if possible]

"This RSVP form is now closed."
"The deadline for responding has passed. If you still need to let the couple know, please contact them directly."

[No CTA — intentional, since we don't want guests to navigate elsewhere]
```

If the site is private (password-protected in future):
```
"This wedding site is private."
"Enter the code from your invitation to continue."
[Password field] [Enter →]
```

### 9.4 Network / Offline State

```
[Persistent top banner — amber background]
"⚠ You appear to be offline. Changes will be saved when your connection returns."
```

- Banner dismisses automatically when connection is restored
- Form submissions are blocked with tooltip: "Please check your internet connection"
- Auto-save in website builder queues changes locally until reconnected

### 9.5 Auth Error (Session Expired)

```
[Modal overlay — cannot be dismissed]
"Your session has expired."
"Please sign in again to continue. Your work has been saved."
[Sign in again →]
```

- Clicking "Sign in again" opens auth in a modal/popup (not full redirect) so no work context is lost on re-auth

### 9.6 Upgrade Required Error

```
[Inline prompt — not a blocking error]
"This feature requires a Pro subscription."
[See what's included →]  [Upgrade now →]
```

---

## 10. Mobile UX Considerations

### 10.1 Touch Targets

- Minimum tap target: **44×44px** for all interactive elements (WCAG 2.5.5)
- Increase padding on small text links in lists: min `py-3` (12px vertical padding)
- No hover-only affordances — all hover states have a touch equivalent
- Avoid targets closer than 8px apart (prevent mis-taps)

### 10.2 Keyboard & Input

- Set `inputmode` appropriately:
  - Email: `inputmode="email"` + `type="email"`
  - Phone: `inputmode="tel"` + `type="tel"`
  - Dates: use native `type="date"` on mobile; custom date picker on desktop
  - Number: `inputmode="numeric"`
- Avoid full-page keyboard displacement — use `position: fixed` for modals carefully; test that iOS virtual keyboard doesn't obscure submit buttons
- "Done" / "Next" on iOS keyboard should advance to next field (use `enterkeyhint="next"` on all non-final fields)

### 10.3 Gestures

- Swipe right to go back: support native browser back gesture (never override it)
- Gallery: horizontal swipe through photos in lightbox
- Guest list table: horizontal scroll (not horizontal swipe navigation) — use `overflow-x: auto`
- Seating chart: pinch-to-zoom on canvas (canvas implements its own touch handlers)

### 10.4 Mobile-Specific Layout Changes

| Component | Desktop | Mobile |
|---|---|---|
| Sidebar nav | Fixed left, 240px | Bottom tab bar (5 items) |
| Guest table | Full table with columns | Card list (name + status badge per row) |
| Seating chart | Side panel + canvas | Canvas full-screen + floating guest panel (slide-up) |
| Website builder | Split panel (left settings + right preview) | Tabs: [Edit] / [Preview] |
| Dashboard stat cards | 4-column grid | 2-column grid (2×2) |
| RSVP form | Centered 560px max | Full-width with horizontal padding |
| Plan comparison | 3-column table | Stacked cards with feature list per plan |

### 10.5 Performance on Mobile

- Avoid loading the full website builder preview iframe on mobile (load on [Preview] tab tap)
- Lazy-load gallery images; use `loading="lazy"` and `decoding="async"` on all `<img>` tags
- Prefetch next onboarding step data when user is on the previous step
- No autoplaying video on mobile

### 10.6 Gestures in the Seating Chart (Mobile Adaptation)

- Full canvas mode: guest panel collapses to a bottom-sheet drawer
- Long-press a guest name → drag to a table (custom touch drag implementation)
- Double-tap a table → opens table edit sheet

---

## 11. Responsive Breakpoint Behavior

### 11.1 Breakpoints (Tailwind CSS)

| Name | Prefix | Min Width | Primary Use |
|---|---|---|---|
| Mobile | (default) | 0px | Base styles — single column, bottom nav |
| Small | `sm:` | 640px | Minor layout adjustments (e.g., 2-col grids) |
| Medium | `md:` | 768px | Sidebar appears, table views, 2-col forms |
| Large | `lg:` | 1024px | Full desktop layout, multi-column grids |
| Extra Large | `xl:` | 1280px | Max content width clamp, 3–4 col grids |
| 2XL | `2xl:` | 1536px | Large monitor optimizations (rare, mostly just wider content) |

### 11.2 Key Responsive Behavior Table

| Element | Mobile (0–767px) | Tablet (768–1023px) | Desktop (1024px+) |
|---|---|---|---|
| Marketing hero | Single column, stacked image | 60/40 split | 50/50 split |
| Feature rows | Stacked (image → text) | Stacked | Alternating side-by-side |
| Pricing cards | Stacked vertically | 2-col (Free+Pro / Premium stacked) | 3-col |
| Dashboard stat cards | 2×2 grid | 2×2 grid | 1×4 grid |
| App sidebar | Hidden (bottom tab bar) | Icon-rail (60px) | Full sidebar (240px) |
| Guest list | Cards (no table) | Simplified table | Full table |
| Seating chart | Canvas full-screen + slide-up panel | Canvas + narrow panel | Split canvas + 280px panel |
| Top nav (marketing) | Hamburger drawer | Hamburger drawer | Full horizontal nav |
| Footer | Single column | 2 columns | 3 columns |
| Onboarding wizard | Full-screen steps | Centered card (max 540px) | Centered card (max 560px) |

### 11.3 Max Content Width

- Marketing pages: `max-w-7xl` (1280px) centered with `px-6` gutter
- App pages: `max-w-screen` (full-width in the content area to the right of sidebar)
- Modals: `max-w-md` (448px) for small / `max-w-xl` (576px) for large
- Forms: `max-w-lg` (512px) centered

### 11.4 Image Responsive Strategy

Use `next/image` with `sizes` attribute on all images:

```tsx
// Hero image on marketing site
<Image
  src={heroUrl}
  alt="Wedding couple"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 640px"
  priority
  fill
  className="object-cover"
/>

// Gallery thumbnail
<Image
  src={photoUrl}
  alt={altText}
  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
  width={400}
  height={300}
  className="object-cover rounded-lg"
/>
```

---

## 12. Onboarding UX — New Couple Wizard

### 12.1 Design Intent

The onboarding wizard is the highest-leverage screen in the product. A couple who completes onboarding and sees their site within the first session has dramatically higher retention and conversion rates. Every design decision here must minimize drop-off.

**Guiding principles for the wizard:**
1. Each step has a single, focused input task
2. Progress is always visible and feels fast
3. Skip options exist for optional steps — never block on "nice to have" data
4. The finish line is tangible: seeing the live site is the final step

### 12.2 Wizard Structure

```
/onboarding/welcome → /onboarding/theme → /onboarding/details → /onboarding/share
     Step 1                 Step 2               Step 3               Step 4
```

**Chrome:**
```
[EverAfter logo — centered top]
[Step indicator: ● ○ ○ ○ ]   "Step 1 of 4"
────────────────────────────────────
[Step content — centered, max 560px]
────────────────────────────────────
[← Back] (hidden on step 1)          [Continue →]
[Skip this step] (optional steps only — muted link, not button)
```

---

### 12.3 Step 1 — Welcome (`/onboarding/welcome`)

**Headline:** "Let's build your wedding site! 🎉"

**Fields:**
```
Partner 1's name*   [________________]
Partner 2's name*   [________________]

When's the big day?*
[  Month  ▾ ]  [  Day  ▾ ]  [  Year  ▾ ]
```

**UX Notes:**
- Names are pre-filled from auth data if available (given name from Google OAuth)
- Date picker uses three separate dropdowns (not a calendar popup) — avoids mobile picker hell
- Validation on "Continue": both names required, date required and must be in the future
- Error if past date: "Your big day should be in the future — unless you're already married! 😄 Update it below."

---

### 12.4 Step 2 — Theme (`/onboarding/theme`)

**Headline:** "Choose a style for your site"

**Layout:**
```
[6 theme cards in a 3×2 grid — 2×2 on mobile]

┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ [thumbnail]  │  │ [thumbnail]  │  │ [thumbnail]  │
│  Garden      │  │  Classic     │  │  Modern      │
│  Free        │  │  Free        │  │  Free        │
└──────────────┘  └──────────────┘  └──────────────┘

┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ [thumbnail]  │  │ [thumbnail]  │  │ [thumbnail]  │
│  Luxe        │  │  Botanical   │  │  Minimal     │
│  🔒 Pro      │  │  🔒 Pro      │  │  🔒 Pro      │
└──────────────┘  └──────────────┘  └──────────────┘
```

**Interaction:**
- Single-click a free theme → card gets gold ring border (selected state), live preview panel updates on desktop
- Clicking a Pro theme → card highlights + tooltip: "Unlock with Pro 🔒 — Continue with this theme and upgrade later, or pick a free one."
  - Option A: "Choose anyway" (reserves the Pro theme, prompts upgrade after onboarding)
  - Option B: "Pick a free theme" (deselects)
- Default selection: first free theme (pre-selected on load so user can click "Continue" immediately)

**Preview panel (desktop only — ≥1024px):**
```
┌──────────────────────────────────────────────────────┐
│                Right side (40% width)                 │
│  "Preview"                                            │
│  ┌────────────────────────────────┐                  │
│  │  [Live-ish preview of theme   │                  │
│  │   with couple's actual names  │                  │
│  │   from step 1]                │                  │
│  └────────────────────────────────┘                  │
└──────────────────────────────────────────────────────┘
```

---

### 12.5 Step 3 — Details (`/onboarding/details`)

**Headline:** "Where's the celebration?"

**Fields:**
```
Venue name         [________________________________]   (optional)
City or region*    [________________________________]   (required — used in countdown display)
Country*           [  United States               ▾]

Ceremony time      [HH : MM] [AM/PM ▾]              (optional)
```

**UX notes:**
- City/region is the minimum needed for the public site (shows in hero: "March 15 · Rome, Italy")
- "You can add full venue address, directions, and hotel blocks later in the Details section" — muted helper text
- "Skip for now" link below CTA skips to Step 4

---

### 12.6 Step 4 — Share (`/onboarding/share`)

**Headline:** "Your site is live! 🎉"

**Layout:**
```
[Animated confetti burst — CSS, no library]

Your wedding site is at:
┌──────────────────────────────────────────────┐
│  jane-and-john.everafter.com          [Copy] │
└──────────────────────────────────────────────┘

[Live preview of their site — scrollable iframe or static screenshot]

Share with your people:
[📱 WhatsApp]  [📧 Email]  [🔗 Copy link]

[Go to my dashboard →]   (primary CTA)
[Customize my site →]    (secondary CTA — links to /website)
```

**UX notes:**
- Copy button: shows "Copied! ✓" for 2 seconds on click
- WhatsApp share: `https://wa.me/?text=We're getting married! See our site: [url]`
- Email share: `mailto:?subject=Our wedding site&body=We're getting married! See our site: [url]`
- The site URL slug is auto-generated from partner names (e.g., "jane-and-john") — de-duped with numeric suffix if taken
- "Go to my dashboard" is the stronger visual CTA (gold filled); "Customize" is text/ghost

---

### 12.7 Post-Onboarding Retention Hooks

After the user lands on `/dashboard` from onboarding:

1. **Getting Started checklist** widget (see 5.3) — collapses once all items complete
2. **Day 1 email** (via Resend, sent 1 hour after signup):
   - Subject: "Your wedding site is live, [Name]!"
   - Content: Link to their site, 3 quick next steps (add guests, registry, upload a photo)
3. **Day 3 email** (if no guests added):
   - Subject: "Your guests are waiting 🎉"
   - Content: How to add/import guests + RSVP link sharing guide

---

*This document is maintained by the Website CTO. All major UX decisions must be reflected here before implementation begins.*
