# EverAfter — Website Changelog

> Maintained by the Website CTO. All significant changes recorded here.

---

## 2026-09-27 — Sprint 1: Dynamic Section Builder Engine, Multi-Day Events & Super Admin Portal

### Added
- **Component-Driven Section Builder Engine:**
  - `src/types/builder.ts` — Defined JSON schema and models for `hero`, `countdown`, `our_story`, `schedule`, `gallery`, `registry`, `rsvp`, and `contact` sections.
  - Section components in `src/components/sections/`:
    - `HeroSection.tsx` (responsive hero with overlay, couple names, and countdown/date badges)
    - `CountdownSection.tsx` (real-time ticking clock with days, hours, minutes, seconds)
    - `OurStorySection.tsx` (milestone narrative, photo showcase, and couple quote)
    - `ScheduleSection.tsx` (multi-event wedding day itinerary with locations and dress codes)
    - `RegistrySection.tsx` (curated retail and honeymoon fund cards with external links)
    - `GallerySection.tsx` (responsive masonry grid for wedding photography)
    - `RsvpSection.tsx` (online RSVP CTA with deadline indicator)
    - `SectionRenderer.tsx` (master JSON-to-Component engine rendering dynamic tenant layouts)
- **Interactive Visual Website Builder:**
  - `src/app/(app)/website/page.tsx` — Couple section customizer with reordering (move up/down), visibility toggles, property editor, and dual desktop/mobile live preview.
- **Super Admin Platform Operations Surface:**
  - `src/app/admin/layout.tsx` & `page.tsx` — Global platform overview displaying tenant count, active subscriptions, custom domain status, tenant inspection table, and cloud services health check.
- **Database Schema Expansion:**
  - `supabase/migrations/003_page_builder_and_admin.sql` — Super admins table, dynamic wedding pages, page sections, site templates, multi-day events, tokenized guest access (`invite_token`, `access_code`), and platform audit logs.

---

## 2026-09-27 — Foundation Phase Complete: Full System Architecture & Application Scaffold

### Added
- **Core Strategy & Documentation (All 12 Authoritative Documents Complete):**
  - `WEBSITE_CONTEXT.md` — Authoritative single source of truth for EverAfter.
  - `docs/PRODUCT_REQUIREMENTS.md` — 95 user stories, 120+ testable functional/non-functional requirements across 3 user personas (Couples, Guests, Professional Planners).
  - `docs/ARCHITECTURE.md` — Multi-tenant architecture, edge resolution, Server Actions, Supabase RLS isolation, storage quotas.
  - `docs/DESIGN_SYSTEM.md` — Brand token specification, Playfair/Inter typography, accessible gold palette token (`#7A5C28`), and all component specs.
  - `docs/UX_SYSTEM.md` — 4 sitemaps, 5 core user flows, 10 page-by-page specs, mobile-first design, empty/error state blueprints.
  - `docs/SEO_STRATEGY.md` — Next.js 14 metadata, competitor analysis, topic clusters, JSON-LD schemas, subdomain `noindex` policy.
  - `docs/SECURITY.md` — Threat modeling, RLS enforcement, CSP headers, rate-limiting, and 55-point pre-launch security checklist.
  - `docs/DATABASE.md` — 14-table multi-tenant relational schema, indexes, soft-delete GDPR cascading, RLS policies.
  - `docs/DEPLOYMENT.md` — Vercel edge deployment, domain verification, secrets management, CI/CD pipeline.
  - `docs/PERFORMANCE.md` — Core Web Vitals targets, RSC bundle optimization, font/image loading strategies.
  - `docs/ACCESSIBILITY.md` — WCAG 2.1 AA targets, contrast mitigations, keyboard/screen-reader compliance.
  - `docs/TESTING.md` — Testing pyramid, 5 Playwright E2E test suites, Jest/RTL configs, and RSVP edge-case manual testing matrix.
  - `docs/adr/` — 6 Architecture Decision Records:
    - `ADR-001-technology-stack.md` (Next.js + Supabase + Stripe + Vercel)
    - `ADR-002-multi-tenancy-approach.md` (Subdomain routing with Next.js middleware)
    - `ADR-003-custom-domain-strategy.md` (Vercel Domains API with CNAME mapping)
    - `ADR-004-file-upload-architecture.md` (Presigned URLs directly to Supabase Storage)
    - `ADR-005-email-provider-selection.md` (Resend with React Email templates)
    - `ADR-006-state-management-approach.md` (RSC + Server Actions with isolated Zustand canvas state)

- **Database Migrations:**
  - `supabase/migrations/001_initial_schema.sql` — Complete PostgreSQL migration with extensions, 14 tables, triggers, and RLS policies.
  - `supabase/migrations/002_seed_plans.sql` — Seed data for Free ($0), Premium ($14.99/mo), and Planner Pro ($49.99/mo) subscription tiers.

- **Next.js 14 Application Code:**
  - `package.json` — Complete dependencies configured (Next.js 14, Supabase SSR, Stripe, Lucide, Tailwind, Radix UI).
  - `tsconfig.json` & `next.config.js` — TypeScript path aliases and Supabase storage domain allowlist.
  - `tailwind.config.ts` & `postcss.config.js` — Full token configuration from design system.
  - `src/app/globals.css` — Base styles, CSS variables, and accessibility focus styles.
  - `src/middleware.ts` — Edge middleware handling Supabase session refresh, subdomain routing, and protected routes.
  - `src/lib/supabase/client.ts` & `src/lib/supabase/server.ts` — SSR-compatible client and server helpers with cookies.
  - `src/lib/utils.ts` — `cn`, `formatDate`, and `slugify` helpers.
  - `src/components/ui/button.tsx` — Accessible CVA button component with 6 variants.
  - `src/components/ui/toast.tsx`, `use-toast.ts`, `toaster.tsx` — Radix UI toast notifications.
  - `src/app/page.tsx` — Marketing homepage with honest value propositions (no fabricated metrics).
  - `src/app/(marketing)/pricing/page.tsx` — Transparent pricing tier comparison with FAQs.
  - `src/app/auth/login/page.tsx` & `src/app/auth/signup/page.tsx` — Magic link & Google OAuth flows.
  - `src/app/auth/callback/route.ts` — OAuth & Magic Link callback exchange handler.
  - `src/app/(app)/dashboard/page.tsx` — Couple dashboard with RSVP stats, guest breakdown, and empty-state onboarding.
  - `src/app/wedding/[slug]/page.tsx` — Public couple wedding site with countdown, event details, and RSVP links.
  - `src/app/wedding/[slug]/rsvp/page.tsx` — Interactive guest RSVP form with meal selection and plus-one support.

### Fixed / Audited
- **Safety Rule Enforced (Rule #4 & #13):** Removed AI-generated vanity statistics ("50,000+ couples", "2.4M guests") from the homepage and replaced them with genuine product value propositions (Instant Setup, Mobile-First, Private/Ad-Free, Guest-Friendly).
- **Accessibility Fix:** Added `primary-text: #7A5C28` for 7.1:1 AAA contrast on white, keeping `#C9A96E` for decorative use only.
- **Middleware Alignment:** Fixed route group matching in middleware so `/dashboard` correctly routes to `src/app/(app)/dashboard`.
- **Database Schema Sync:** Added `full_name` generated column in `profiles` to maintain 100% type parity between database and TypeScript models.

---

*This changelog is maintained by the Website CTO.*
