# WEBSITE_CONTEXT.md
> **Single Source of Truth — EverAfter Wedding SaaS**
> Last updated: 2026-09-27 | Website CTO

---

## 1. Startup Description

**EverAfter** is a multi-tenant wedding website builder SaaS that allows couples to create a beautiful, personalized wedding website in minutes. The platform also serves professional wedding planners who manage multiple couples.

EverAfter removes the technical burden from couples — no code, no design skills needed — while providing professional planners with a unified dashboard to coordinate multiple weddings simultaneously.

---

## 2. Product / Service Description

A web-based SaaS platform with two primary product surfaces:

1. **Couple Dashboard** — Private workspace where couples build and manage their wedding website, guest list, RSVPs, seating chart, photo gallery, registry links, and wedding day timeline.
2. **Couple's Public Wedding Website** — A beautiful, fully customizable public-facing website hosted on a subdomain (e.g., `jane-and-john.everafter.com`) or custom domain (paid), accessible by guests.
3. **Planner Dashboard** (paid tier) — A professional view for wedding planners to manage and switch between multiple couple accounts.

---

## 3. Target Audience

### Primary
- **Engaged couples** (ages 24–40, global) planning their wedding
- **Professional wedding planners** managing multiple events

### Secondary
- **Wedding guests** — who interact with the public wedding site (RSVP, view details, upload photos)

### Personas
| Persona | Goal | Pain Point |
|---|---|---|
| The Couple | Create a stunning wedding website and manage logistics effortlessly | Overwhelmed by planning; want one place for everything |
| The Planner | Efficiently coordinate multiple weddings without juggling tools | Fragmented tools, no single view across clients |
| The Guest | Easily RSVP, find venue details, and share memories | Confusing paper invites; no easy way to share photos |

---

## 4. Brand Identity

- **Name:** EverAfter
- **Tagline:** *Your love story, beautifully told.*
- **Tone:** Warm, elegant, modern, trustworthy — celebratory without being over-the-top
- **Visual Style:** Clean and refined with soft romantic accents; designed to feel premium even on the free tier

### Color Palette (CTO Decision — to be refined by Design Agent)
| Role | Value | Notes |
|---|---|---|
| Primary | `#C9A96E` | Warm gold — elegance and celebration |
| Primary Dark | `#A07840` | Hover/active states |
| Neutral Dark | `#1C1C1C` | Headings, body text |
| Neutral Mid | `#6B6B6B` | Secondary text |
| Neutral Light | `#F7F4F0` | Backgrounds, cards |
| White | `#FFFFFF` | Pure white surfaces |
| Accent | `#E8D5C4` | Blush/rose accent |
| Error | `#DC2626` | Error states |
| Success | `#16A34A` | Success states |

### Typography
- **Display/Headings:** `Playfair Display` (serif — romantic, elegant)
- **Body:** `Inter` (sans-serif — clean, readable at all sizes)
- **Monospace:** `JetBrains Mono` (code/dev use only)

---

## 5. Brand Voice

- **Warm** — Speak to couples as if you're a trusted friend helping them celebrate
- **Clear** — No jargon; everything should be immediately understandable
- **Elegant** — Elevated language without being pretentious
- **Honest** — Never over-promise; state capabilities accurately

---

## 6. Business Goals

1. Acquire couples at scale through organic search and word-of-mouth (guests become users)
2. Convert free users to paid with high-value features (custom domain, advanced themes, planner access)
3. Establish EverAfter as the default wedding website builder globally
4. Generate predictable recurring revenue via subscriptions
5. Build network effects: guests of weddings built on EverAfter become future couples

---

## 7. Website Goals

The EverAfter **marketing website** (`everafter.com`):
1. Clearly explain what EverAfter does in under 5 seconds
2. Drive signups (primary CTA: "Start for free")
3. Showcase theme examples / demos
4. Build trust (how it works, feature highlights)
5. Capture planner leads (secondary CTA: "I'm a wedding planner")
6. Rank for SEO queries like "free wedding website builder"

---

## 8. Important Pages

### Marketing Site
| Page | Purpose |
|---|---|
| `/` | Homepage — hero, value prop, feature highlights, CTA |
| `/features` | Feature deep-dives |
| `/pricing` | Freemium tier comparison |
| `/themes` | Gallery of website themes/templates |
| `/for-planners` | Landing page targeting professional planners |
| `/blog` | SEO content marketing |
| `/about` | Company story |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |

### App (Authenticated)
| Page | Purpose |
|---|---|
| `/app/dashboard` | Couple's main dashboard |
| `/app/website` | Website builder (theme, content) |
| `/app/guests` | Guest list management |
| `/app/rsvp` | RSVP responses overview |
| `/app/seating` | Seating chart planner |
| `/app/registry` | Registry links manager |
| `/app/gallery` | Photo gallery manager |
| `/app/timeline` | Wedding day timeline editor |
| `/app/settings` | Account, billing, custom domain |
| `/planner` | Planner dashboard (multi-wedding view) |

### Public Wedding Site (subdomain/custom domain)
| Page | Purpose |
|---|---|
| `/` | Couple's wedding homepage |
| `/rsvp` | RSVP form for guests |
| `/details` | Venue, schedule, travel info |
| `/registry` | Registry links |
| `/gallery` | Shared photo gallery |
| `/faq` | Couple's FAQ for guests |

---

## 9. Core User Journeys

### Journey 1: New Couple Signup
`Homepage → "Start for Free" → Sign up (email/Google) → Onboarding wizard → Pick theme → Personalize → Share link with guests`

### Journey 2: Guest RSVPs
`Receives invitation link → Opens couple's wedding website → Clicks "RSVP" → Fills form → Confirmation shown`

### Journey 3: Couple Upgrades to Premium
`Hits free tier limit (custom domain, theme, etc.) → Prompted to upgrade → Clicks "Upgrade" → Stripe checkout → Feature unlocked`

### Journey 4: Planner Onboarding
`"For Planners" page → Signs up as planner → Purchases Planner Pro → Adds couple accounts → Manages all from dashboard`

---

## 10. Current Technology Stack

| Layer | Technology | Notes |
|---|---|---|
| Frontend | Next.js 14 (App Router) + TypeScript | SSR/SSG for SEO + performance |
| Styling | Tailwind CSS + shadcn/ui | Design system components |
| Database | Supabase (PostgreSQL) | Multi-tenant data model |
| Auth | Supabase Auth | Magic link + Google OAuth |
| Storage | Supabase Storage | Photo uploads, gallery |
| Payments | Stripe | Subscriptions + one-time |
| Email | Resend | Transactional emails |
| Hosting | Vercel | Edge network, zero-config Next.js |
| Custom Domains | Vercel Domains API | Couple custom domains |
| Analytics | Vercel Analytics (+ Plausible later) | Privacy-friendly |
| CMS (Blog) | MDX files (v1), Sanity or Contentlayer (v2) | Blog content |

---

## 11. Current Architecture

See `docs/ARCHITECTURE.md` for full details.

**Multi-tenancy model:** Subdomain routing via Next.js middleware.
- `everafter.com` → Marketing site
- `app.everafter.com` → Application (authenticated)
- `*.everafter.com` → Couples' public wedding sites
- `customdomain.com` → Custom domain mapped to a couple's site (paid)

---

## 12. Database Architecture

See `docs/DATABASE.md` for full schema.

**Core tables:** `users`, `weddings`, `wedding_members`, `guests`, `rsvps`, `tables` (seating), `seats`, `registry_items`, `photos`, `subscriptions`, `plans`, `domains`

**Isolation strategy:** Row-Level Security (RLS) on all tables via Supabase. Every sensitive table has `wedding_id` FK and RLS policies.

---

## 13. Integrations

| Integration | Purpose | Status |
|---|---|---|
| Stripe | Subscriptions + billing | Planned |
| Supabase Auth | Authentication | Planned |
| Resend | Transactional email | Planned |
| Vercel Domains API | Custom domains | Planned |
| Google Fonts | Typography | Planned |
| Unsplash API | Stock photos for themes | Future |

---

## 14. Hosting / Deployment

- **Platform:** Vercel
- **Environments:** `development` (local), `preview` (PR deploys), `production`
- **Custom domains:** Vercel project custom domain support
- **Environment variables:** Managed in Vercel dashboard + local `.env.local`
- **CI/CD:** Vercel auto-deploy on push to `main` branch

---

## 15. Security Requirements

- All auth via Supabase Auth (no custom password handling)
- Row-Level Security enforced at database level
- API routes validate session server-side on every request
- No PII in client-side logs
- Stripe handles all payment data (no card data touches our servers)
- HTTPS enforced (Vercel)
- CSP headers configured
- Rate limiting on RSVP submission and auth endpoints

See `docs/SECURITY.md` for full threat model.

---

## 16. SEO Requirements

- Server-side rendered pages for all public routes
- Proper `<title>` and `<meta description>` on every page
- JSON-LD structured data on homepage and couple pages
- `sitemap.xml` for marketing site
- `robots.txt` configured
- Open Graph + Twitter Card metadata on all public pages
- Image alt text on all images
- Semantic HTML throughout

See `docs/SEO_STRATEGY.md`.

---

## 17. Performance Requirements

- Core Web Vitals: LCP < 2.5s, FID/INP < 200ms, CLS < 0.1
- Lighthouse score ≥ 90 on marketing pages
- Image optimization via `next/image`
- Font optimization via `next/font`
- No layout shift from fonts or images

See `docs/PERFORMANCE.md`.

---

## 18. Accessibility Requirements

- WCAG 2.1 AA compliance target
- Keyboard navigable throughout
- Sufficient color contrast (4.5:1 minimum)
- All form fields properly labeled
- Semantic HTML structure
- Focus indicators visible

See `docs/ACCESSIBILITY.md`.

---

## 19. Known Limitations (Day 0)

- Project is newly initialized — no code yet
- No live deployment
- No actual users or data
- Custom domain setup requires Vercel integration (to be built)
- Blog CMS is MDX files in v1 (simple, may need migration later)

---

## 20. Future Plans

| Feature | Priority | Version |
|---|---|---|
| Mobile app (React Native) | High | v2 |
| AI wedding website copywriter | High | v2 |
| Vendor directory integration | Medium | v2 |
| White-label for agencies | Medium | v2 |
| Multi-language support | High | v2 |
| Offline mode / PWA | Low | v3 |
| Budget tracker | Medium | v2 |
| Video backgrounds for wedding sites | Low | v2 |

---

## 21. Important Design Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Tech stack | Next.js + Supabase + Vercel | Best-in-class DX, SSR for SEO, zero-infra overhead |
| Multi-tenancy | Subdomain routing | Scalable, standard SaaS approach; clean URL separation |
| Auth strategy | Supabase Auth (magic link + Google) | No password management; secure; good UX |
| Styling | Tailwind + shadcn/ui | Rapid development; accessible components; customizable |
| Payments | Stripe | Industry standard; global; excellent API |
| Pricing | Freemium | Maximizes top-of-funnel; guests become users; industry norm |
| Database | Supabase (PostgreSQL + RLS) | Real-time, good free tier, built-in auth integration, RLS for security |
| Email | Resend | Developer-friendly, excellent deliverability |

---

*This document is maintained by the Website CTO. All major changes must be reflected here.*
