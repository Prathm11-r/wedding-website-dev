# EverAfter — System Architecture

> **Version:** 1.0.0  
> **Last Updated:** 2026-09-27  
> **Author:** CTO / Architecture Team  
> **Status:** Living Document

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Multi-Tenancy Strategy](#2-multi-tenancy-strategy)
3. [Frontend Architecture](#3-frontend-architecture)
4. [Backend Architecture](#4-backend-architecture)
5. [Database Architecture](#5-database-architecture)
6. [Authentication & Authorization](#6-authentication--authorization)
7. [Storage Architecture](#7-storage-architecture)
8. [Payment & Subscription Architecture](#8-payment--subscription-architecture)
9. [Custom Domain Architecture](#9-custom-domain-architecture)
10. [Email Architecture](#10-email-architecture)
11. [Environment Configuration](#11-environment-configuration)
12. [Key Architectural Decisions & Rationale](#12-key-architectural-decisions--rationale)
13. [Architecture Decision Records (ADR) Index](#13-architecture-decision-records-adr-index)

---

## 1. System Overview

EverAfter is a **multi-tenant SaaS** platform that allows couples to build, customize, and share their wedding website. Professional planners can manage multiple couple accounts from a single dashboard. Each couple gets an isolated subdomain; paid tiers unlock custom domains.

### 1.1 High-Level System Diagram

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              PUBLIC INTERNET                                 │
└────────────┬─────────────────────────┬────────────────────────┬─────────────┘
             │                         │                        │
    jane-and-john.                app.everafter.com      mywedding.com
    everafter.com                 (Couple Dashboard /    (Custom Domain –
    (Public Wedding Site)          Planner Portal)       Paid Tier)
             │                         │                        │
             └─────────────┬───────────┘────────────────────────┘
                           │
             ┌─────────────▼──────────────────────────────────┐
             │              Vercel Edge Network                │
             │   (SSL Termination, CDN, Edge Middleware)       │
             └─────────────┬──────────────────────────────────┘
                           │
             ┌─────────────▼──────────────────────────────────┐
             │         Next.js 14 Application (App Router)     │
             │                                                  │
             │  ┌────────────────┐  ┌─────────────────────┐   │
             │  │  Middleware     │  │   Server Components  │   │
             │  │  (Tenant       │  │   (RSC / Streaming)  │   │
             │  │   Resolution)  │  └─────────────────────┘   │
             │  └────────────────┘  ┌─────────────────────┐   │
             │                      │   Server Actions     │   │
             │                      └─────────────────────┘   │
             │                      ┌─────────────────────┐   │
             │                      │   API Routes         │   │
             │                      │   (/api/*)           │   │
             │                      └─────────────────────┘   │
             └─────────┬───────────────────┬──────────────────┘
                       │                   │
          ┌────────────▼──────┐   ┌────────▼──────────────────┐
          │  Supabase          │   │  Third-Party Services      │
          │                    │   │                            │
          │  ┌──────────────┐  │   │  ┌──────────────────────┐ │
          │  │  PostgreSQL   │  │   │  │  Stripe              │ │
          │  │  (RLS)       │  │   │  │  (Subscriptions)     │ │
          │  └──────────────┘  │   │  └──────────────────────┘ │
          │  ┌──────────────┐  │   │  ┌──────────────────────┐ │
          │  │  Auth         │  │   │  │  Resend              │ │
          │  │  (Magic Link  │  │   │  │  (Transactional      │ │
          │  │   + Google)  │  │   │  │   Email)             │ │
          │  └──────────────┘  │   │  └──────────────────────┘ │
          │  ┌──────────────┐  │   │  ┌──────────────────────┐ │
          │  │  Storage      │  │   │  │  Cloudflare /        │ │
          │  │  (Photos,     │  │   │  │  Vercel Domains API  │ │
          │  │   Assets)    │  │   │  │  (Custom Domains)    │ │
          │  └──────────────┘  │   │  └──────────────────────┘ │
          └────────────────────┘   └────────────────────────────┘
```

### 1.2 Technology Stack Summary

| Layer            | Technology                              | Purpose                              |
|------------------|-----------------------------------------|--------------------------------------|
| Frontend         | Next.js 14 (App Router), TypeScript     | SSR/SSG pages, React Server Components |
| Styling          | Tailwind CSS                            | Utility-first responsive design      |
| Backend          | Next.js API Routes + Server Actions     | Business logic, webhooks             |
| Database         | Supabase (PostgreSQL) + Row-Level Security | Multi-tenant data isolation        |
| Auth             | Supabase Auth (Magic Link + Google OAuth) | Passwordless + social login        |
| File Storage     | Supabase Storage                        | Photo uploads, gallery assets        |
| Payments         | Stripe                                  | Subscriptions, billing portal        |
| Email            | Resend                                  | RSVP confirmations, invites, receipts |
| Hosting          | Vercel                                  | Edge deployment, automatic previews  |
| Custom Domains   | Vercel Domains API / Cloudflare         | Vanity domain mapping per couple     |

---

## 2. Multi-Tenancy Strategy

EverAfter uses a **shared database with Row-Level Security (RLS)** model. Tenant isolation happens at three layers: routing (middleware), API (server-side session validation), and database (RLS policies).

### 2.1 Tenant Resolution Flow

Every request passes through Next.js Middleware, which reads the hostname to determine which tenant (wedding) is being requested:

```
Incoming Request
      │
      ▼
┌─────────────────────────────────────────────────────────┐
│  middleware.ts  (runs at Vercel Edge)                   │
│                                                          │
│  1. Parse hostname from request headers                  │
│  2. Detect pattern:                                      │
│     a) *.everafter.com  → extract subdomain slug        │
│     b) app.everafter.com → route to dashboard           │
│     c) custom domain    → look up in DB / cache         │
│  3. Inject x-tenant-slug header into request            │
│  4. Rewrite URL to /[tenant]/... internally             │
└─────────────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────────────┐
│  Server Component / Layout                              │
│                                                          │
│  • Reads x-tenant-slug header                           │
│  • Fetches wedding data from Supabase by slug           │
│  • Renders tenant-specific theme and content            │
└─────────────────────────────────────────────────────────┘
```

### 2.2 Middleware Implementation

```typescript
// middleware.ts (project root)
import { NextRequest, NextResponse } from 'next/server';

const APP_HOSTNAME = 'app.everafter.com';
const ROOT_HOSTNAME = 'everafter.com';
const SUBDOMAIN_SUFFIX = '.everafter.com';

export async function middleware(req: NextRequest) {
  const hostname = req.headers.get('host') ?? '';
  const pathname = req.nextUrl.pathname;

  // Skip static assets and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/api')
  ) {
    return NextResponse.next();
  }

  // Couple dashboard / planner portal
  if (hostname === APP_HOSTNAME) {
    return NextResponse.rewrite(new URL(`/app${pathname}`, req.url));
  }

  // Root marketing site
  if (hostname === ROOT_HOSTNAME || hostname === `www.${ROOT_HOSTNAME}`) {
    return NextResponse.rewrite(new URL(`/marketing${pathname}`, req.url));
  }

  // EverAfter subdomain: jane-and-john.everafter.com
  if (hostname.endsWith(SUBDOMAIN_SUFFIX)) {
    const slug = hostname.replace(SUBDOMAIN_SUFFIX, '');
    const res = NextResponse.rewrite(new URL(`/wedding/${slug}${pathname}`, req.url));
    res.headers.set('x-tenant-slug', slug);
    return res;
  }

  // Custom domain: mywedding.com → look up in Supabase KV / edge cache
  const tenantSlug = await resolveTenantByCustomDomain(hostname);
  if (tenantSlug) {
    const res = NextResponse.rewrite(new URL(`/wedding/${tenantSlug}${pathname}`, req.url));
    res.headers.set('x-tenant-slug', tenantSlug);
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
```

### 2.3 Multi-Tenancy Model: Shared DB with RLS

**Decision:** Single PostgreSQL database, all tenants share the same schema. Isolation is enforced via Supabase Row-Level Security policies tied to the `wedding_id` foreign key.

**Why not separate schemas or databases per tenant?**

| Model                   | Pros                         | Cons for EverAfter                          |
|-------------------------|------------------------------|---------------------------------------------|
| Separate DB per tenant  | Maximum isolation            | Extremely expensive at scale; complex ops   |
| Schema per tenant       | Good isolation               | Complex migrations; schema sprawl           |
| **Shared DB + RLS** ✅  | Simple ops, low cost, scales | Requires careful RLS policies; noisy neighbor risk |

RLS policies ensure a couple can only ever read/write their own `wedding_id`. Planners have elevated policies scoped to the `wedding_ids` they manage.

---

## 3. Frontend Architecture

### 3.1 App Router Directory Structure

```
app/
├── (marketing)/                      # Root domain — public marketing site
│   ├── layout.tsx                    # Marketing shell (nav, footer)
│   ├── page.tsx                      # Landing page
│   ├── pricing/page.tsx
│   └── about/page.tsx
│
├── (app)/                            # app.everafter.com — authenticated portal
│   ├── layout.tsx                    # App shell (sidebar, user nav)
│   ├── dashboard/
│   │   └── page.tsx                  # Couple / planner overview
│   ├── weddings/
│   │   ├── [weddingId]/
│   │   │   ├── layout.tsx            # Per-wedding context provider
│   │   │   ├── page.tsx              # Wedding overview
│   │   │   ├── guests/page.tsx       # Guest list management
│   │   │   ├── rsvp/page.tsx         # RSVP management
│   │   │   ├── seating/page.tsx      # Table & seat planning
│   │   │   ├── registry/page.tsx     # Registry management
│   │   │   ├── gallery/page.tsx      # Photo gallery management
│   │   │   ├── website/page.tsx      # Website builder / theme picker
│   │   │   └── settings/page.tsx     # Domain, privacy settings
│   │   └── new/page.tsx              # Create new wedding
│   ├── account/page.tsx              # User profile & billing
│   └── planners/                     # Planner-only section
│       ├── page.tsx                  # All managed couples
│       └── [coupleId]/page.tsx
│
├── wedding/                          # Tenant-scoped public wedding sites
│   └── [slug]/                       # Resolved by middleware rewrite
│       ├── layout.tsx                # Public wedding layout (themed)
│       ├── page.tsx                  # Home / countdown
│       ├── story/page.tsx            # Our story
│       ├── details/page.tsx          # Event details & venue
│       ├── rsvp/page.tsx             # RSVP form (public)
│       ├── gallery/page.tsx          # Photo gallery (public)
│       └── registry/page.tsx        # Registry links (public)
│
├── api/                              # API Routes
│   ├── webhooks/
│   │   ├── stripe/route.ts
│   │   └── resend/route.ts
│   ├── domains/
│   │   └── verify/route.ts
│   └── upload/
│       └── route.ts
│
└── layout.tsx                        # Root layout (fonts, providers, analytics)
```

### 3.2 Layout Hierarchy

```
RootLayout (layout.tsx)
  ├── MarketingLayout  (marketing/)
  │     └── Page components (static, SEO-optimised)
  │
  ├── AppLayout  (app/)  ← requires Supabase Auth session
  │     ├── Sidebar + TopNav
  │     └── WeddingLayout  (app/weddings/[weddingId]/)
  │           └── Page components (fully dynamic, server-fetched)
  │
  └── PublicWeddingLayout  (wedding/[slug]/)
        ├── Themed header / footer (couple brand colours)
        └── Page components (ISR cached, publicly accessible)
```

### 3.3 Rendering Strategy

| Route Group          | Strategy                        | Reasoning                                              |
|----------------------|---------------------------------|--------------------------------------------------------|
| Marketing pages      | Static (SSG)                    | Zero server cost, fast CDN delivery                    |
| Public wedding site  | ISR (revalidate: 60s)           | Dynamic content, edge-cached for performance           |
| RSVP form submit     | Server Action + revalidatePath  | Ensures data freshness without full page reload        |
| Dashboard / portal   | Dynamic (SSR per request)       | Auth-gated, personalised data                          |
| Photo gallery        | ISR with on-demand revalidation | Revalidate when new photos uploaded                    |

### 3.4 State Management

- **Server state:** Supabase queries in Server Components (no client-side fetching for initial loads)
- **Client interactivity:** React `useState` / `useReducer` for UI-only state (modals, drag-and-drop seating)
- **Form submissions:** Next.js Server Actions with progressive enhancement
- **Optimistic UI:** `useOptimistic` hook for RSVP toggles and guest list updates
- **No global state library** (Redux / Zustand avoided; Server Components eliminate the need for most shared state)

---

## 4. Backend Architecture

### 4.1 Server Actions

Server Actions are the primary mutation mechanism. They run on the server, validate input with **Zod**, enforce authorization, then write to Supabase.

```
Client Component
      │  calls action
      ▼
Server Action (app/actions/*.ts)
      │
      ├── 1. getServerSession() — validate Supabase auth cookie
      ├── 2. authorizeWeddingAccess(userId, weddingId) — check ownership/planner role
      ├── 3. Zod schema validation of input
      ├── 4. Supabase mutation (insert / update / delete)
      ├── 5. revalidatePath() / revalidateTag() — bust ISR cache
      └── 6. Return { success, data, error }
```

**Key Server Action Files:**

| File                               | Responsibility                         |
|------------------------------------|----------------------------------------|
| `app/actions/wedding.ts`           | Create, update, delete weddings        |
| `app/actions/guests.ts`            | Import, add, update guests             |
| `app/actions/rsvp.ts`              | Public RSVP submission (no auth)       |
| `app/actions/seating.ts`           | Table assignments                      |
| `app/actions/gallery.ts`           | Photo metadata, ordering               |
| `app/actions/registry.ts`          | Registry item CRUD                     |
| `app/actions/domains.ts`           | Custom domain add / verify / remove    |
| `app/actions/subscriptions.ts`     | Stripe portal redirect, plan upgrade   |

### 4.2 API Routes

API Routes handle cases where Server Actions are insufficient: **Stripe webhooks**, **file uploads** (streaming), and **domain verification callbacks**.

| Route                             | Method   | Auth Required | Purpose                                         |
|-----------------------------------|----------|---------------|-------------------------------------------------|
| `/api/webhooks/stripe`            | POST     | Stripe sig    | Handle subscription lifecycle events            |
| `/api/webhooks/resend`            | POST     | Resend sig    | Handle delivery status callbacks                |
| `/api/upload`                     | POST     | Session       | Pre-sign Supabase Storage URL for file upload   |
| `/api/domains/verify`             | POST     | Session       | Trigger domain DNS verification check           |
| `/api/domains/status`             | GET      | Session       | Poll domain verification status                 |
| `/api/rsvp/[weddingId]`           | GET      | None          | Public RSVP data (headcount, meal options)      |

### 4.3 Data Flow: Public RSVP Submission

```
Guest fills RSVP form (public page)
          │
          ▼
Server Action: submitRsvp(weddingId, guestData)
          │
          ├── Validate: weddingId exists and is active
          ├── Validate: guest email / invite code
          ├── Insert into rsvps table
          ├── Update guests.rsvp_status
          └── Trigger: Resend email confirmation to guest
                    + Notification email to couple
```

---

## 5. Database Architecture

### 5.1 Schema Overview

All tables are in the `public` schema within Supabase. Multi-tenancy isolation is enforced by `wedding_id` FKs and RLS policies.

```
┌──────────────────┐       ┌──────────────────────┐
│     profiles     │       │      weddings         │
│──────────────────│       │──────────────────────│
│ id (FK auth.users│◄──┐   │ id                   │
│ full_name        │   │   │ slug (unique)         │
│ avatar_url       │   │   │ owner_id (FK profiles)│
│ role             │   │   │ title                 │
│ stripe_customer_id│  │   │ event_date            │
│ created_at       │   └───│ timezone              │
└──────────────────┘       │ venue_name            │
                           │ venue_address          │
┌──────────────────┐       │ theme_config (jsonb)  │
│planner_couples   │       │ custom_domain         │
│──────────────────│       │ domain_verified        │
│ planner_id (FK)  │       │ is_published          │
│ wedding_id (FK)  │       │ subscription_tier     │
│ permissions      │       │ created_at            │
│ created_at       │       └──────────────────────┘
└──────────────────┘                │
                                    │ wedding_id FK on all child tables
          ┌─────────────────────────┼─────────────────────────────┐
          │                         │                             │
          ▼                         ▼                             ▼
┌──────────────────┐   ┌───────────────────────┐   ┌────────────────────┐
│     guests       │   │       rsvps           │   │  wedding_tables    │
│──────────────────│   │───────────────────────│   │────────────────────│
│ id               │   │ id                    │   │ id                 │
│ wedding_id (FK)  │   │ wedding_id (FK)       │   │ wedding_id (FK)    │
│ full_name        │   │ guest_id (FK)         │   │ name               │
│ email            │   │ status (enum)         │   │ capacity           │
│ phone            │   │ meal_choice           │   │ shape              │
│ group_name       │   │ dietary_notes         │   │ position_x         │
│ invite_code      │   │ plus_one_name         │   │ position_y         │
│ rsvp_status      │   │ submitted_at          │   │ created_at         │
│ seat_id (FK)     │   │ ip_address            │   └────────────────────┘
│ tags (text[])    │   └───────────────────────┘             │
│ notes            │                                         ▼
│ created_at       │                             ┌────────────────────┐
└──────────────────┘                             │      seats         │
          │                                      │────────────────────│
          │                                      │ id                 │
          └─────────────────────────────────────►│ table_id (FK)      │
                                                 │ seat_number        │
┌──────────────────┐   ┌───────────────────────┐ │ guest_id (FK, null)│
│  registry_items  │   │       photos          │ └────────────────────┘
│──────────────────│   │───────────────────────│
│ id               │   │ id                    │
│ wedding_id (FK)  │   │ wedding_id (FK)       │
│ title            │   │ uploader_id (FK)      │
│ description      │   │ storage_path          │
│ price            │   │ storage_bucket        │
│ external_url     │   │ width                 │
│ is_purchased     │   │ height                │
│ purchased_by     │   │ size_bytes            │
│ store_name       │   │ mime_type             │
│ display_order    │   │ caption               │
│ created_at       │   │ is_featured           │
└──────────────────┘   │ display_order         │
                       │ uploaded_at           │
                       └───────────────────────┘
```

### 5.2 Key Table Details

#### `profiles`
- Extends `auth.users` (Supabase Auth) with application data
- `role` enum: `'couple' | 'planner' | 'admin'`
- Created automatically via database trigger on `auth.users` insert

#### `weddings`
- `slug` is the subdomain identifier; enforced unique with a regex constraint (`^[a-z0-9-]+$`)
- `theme_config` (JSONB) stores the couple's visual customisation (colours, fonts, section order, background images)
- `subscription_tier` enum: `'free' | 'essentials' | 'premium'`

#### `guests`
- `invite_code` is a unique random 8-character token used for magic-link RSVP access
- `tags` array allows flexible segmentation (e.g., `['bride-side', 'vip']`)
- `seat_id` nullable FK to `seats` table (null = not yet assigned)

#### `rsvps`
- One row per RSVP submission; `guest_id` links back to the invited guest
- Captures `ip_address` for spam/duplicate detection
- `status` enum: `'attending' | 'declined' | 'maybe' | 'pending'`

### 5.3 Row-Level Security Policy Summary

```sql
-- Couples can only access their own wedding rows
CREATE POLICY "couple_owns_wedding" ON weddings
  FOR ALL USING (owner_id = auth.uid());

-- Planners can access weddings they manage
CREATE POLICY "planner_accesses_managed_weddings" ON weddings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM planner_couples
      WHERE planner_id = auth.uid()
        AND wedding_id = weddings.id
    )
  );

-- All child tables inherit wedding-level access via a helper function
CREATE POLICY "wedding_member_access" ON guests
  FOR ALL USING (
    is_wedding_member(auth.uid(), wedding_id)
  );

-- Public read for published wedding data (no auth required)
CREATE POLICY "public_read_published" ON weddings
  FOR SELECT USING (is_published = true);
```

### 5.4 Migrations Strategy

- Migrations managed with **Supabase CLI** (`supabase migration new <name>`)
- Migration files stored in `supabase/migrations/`
- Run in CI/CD via `supabase db push` during Vercel deployment pipeline
- Destructive changes (DROP, column renames) require explicit down-migration and approval

---

## 6. Authentication & Authorization

### 6.1 Auth Flow

```
User visits app.everafter.com
        │
        ├─ Clicks "Sign in with Google"
        │         │
        │         ▼
        │   Supabase OAuth → Google → callback → Supabase session cookie
        │
        └─ Enters email for Magic Link
                  │
                  ▼
            Supabase sends link via internal SMTP (or Resend SMTP relay)
                  │
            User clicks link → Supabase session cookie set
                  │
                  ▼
            middleware.ts checks session → routes to /dashboard
```

### 6.2 Role & Permission Model

EverAfter has three primary roles:

| Role      | Description                                             | Access Scope                           |
|-----------|---------------------------------------------------------|----------------------------------------|
| `couple`  | The wedding owners. Created on sign-up.                 | Their own wedding(s) only              |
| `planner` | Professional planner managing multiple couple accounts  | All weddings in `planner_couples`      |
| `admin`   | EverAfter internal staff                                | All data (via Supabase service role)   |

**Guest (unauthenticated):** Can view public wedding pages and submit RSVPs. No Supabase session required for public pages.

### 6.3 Authorization Middleware for App Routes

```typescript
// lib/auth/withWeddingAccess.ts
export async function authorizeWeddingAccess(
  userId: string,
  weddingId: string
): Promise<{ authorized: boolean; role: 'owner' | 'planner' | null }> {
  const supabase = createServiceClient(); // bypasses RLS for auth check

  const { data: wedding } = await supabase
    .from('weddings')
    .select('owner_id')
    .eq('id', weddingId)
    .single();

  if (wedding?.owner_id === userId) return { authorized: true, role: 'owner' };

  const { data: plannerLink } = await supabase
    .from('planner_couples')
    .select('id')
    .eq('planner_id', userId)
    .eq('wedding_id', weddingId)
    .single();

  if (plannerLink) return { authorized: true, role: 'planner' };

  return { authorized: false, role: null };
}
```

### 6.4 Session Handling in Server Components

```typescript
// lib/auth/getSession.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function getSessionOrRedirect() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name) => cookieStore.get(name)?.value } }
  );

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect('/login');
  return session;
}
```

---

## 7. Storage Architecture

### 7.1 Supabase Storage Bucket Structure

```
supabase-storage/
├── wedding-photos/          # Public bucket — gallery images
│   └── {weddingId}/
│       ├── gallery/
│       │   └── {photoId}.{ext}
│       └── featured/
│           └── {photoId}.{ext}
│
├── wedding-assets/          # Public bucket — website assets
│   └── {weddingId}/
│       ├── hero/
│       └── couple/
│
└── uploads-temp/            # Private bucket — pre-upload staging
    └── {userId}/
        └── {filename}
```

### 7.2 Upload Flow

```
Client selects photo
        │
        ▼
POST /api/upload  (authenticated)
        │
        ├── Validate session + wedding ownership
        ├── Validate file type (image/jpeg, image/png, image/webp)
        ├── Validate file size (see tier limits below)
        ├── Generate unique storage path: {weddingId}/gallery/{uuid}.{ext}
        └── Return pre-signed Supabase upload URL (60s expiry)
                  │
                  ▼
Client uploads directly to Supabase Storage (bypasses Next.js server)
                  │
                  ▼
Client calls Server Action: createPhotoRecord(weddingId, storagePath, metadata)
                  │
        Insert into photos table + revalidate gallery cache
```

### 7.3 Storage Limits by Subscription Tier

| Tier          | Max File Size | Total Storage | Max Photos |
|---------------|--------------|----------------|------------|
| Free          | 5 MB          | 100 MB         | 30         |
| Essentials    | 15 MB         | 1 GB           | 300        |
| Premium       | 25 MB         | 10 GB          | Unlimited  |

### 7.4 Image Optimisation

- All public gallery images are served via **Supabase Storage CDN** with automatic caching
- Next.js `<Image>` component used for dashboard thumbnails with `remotePatterns` configured for Supabase storage hostname
- Original files preserved; thumbnails generated via Supabase Storage transforms (`?width=400&quality=75`)

---

## 8. Payment & Subscription Architecture

### 8.1 Subscription Tiers

| Tier          | Price (USD/mo) | Key Features                                              |
|---------------|----------------|-----------------------------------------------------------|
| **Free**      | $0             | 1 wedding, subdomain only, 30 photos, basic themes        |
| **Essentials**| $12            | Custom domain, 300 photos, RSVP management, email notifs  |
| **Premium**   | $29            | Unlimited photos, seating planner, planner portal, analytics |

### 8.2 Stripe Integration Architecture

```
Couple clicks "Upgrade"
        │
        ▼
Server Action: createCheckoutSession(weddingId, priceId)
        │
        ├── Ensure stripe_customer_id exists in profiles (create if not)
        ├── Create Stripe Checkout Session with:
        │     • customer: stripe_customer_id
        │     • metadata: { wedding_id, user_id }
        │     • success_url, cancel_url
        └── Redirect to Stripe Checkout
                  │
        [Stripe handles payment]
                  │
                  ▼
        POST /api/webhooks/stripe
                  │
        ├── Verify Stripe webhook signature
        └── Handle events:
              checkout.session.completed     → set subscription_tier, save subscription_id
              customer.subscription.updated  → update subscription_tier
              customer.subscription.deleted  → downgrade to 'free', notify via Resend
              invoice.payment_failed         → send payment failure email
```

### 8.3 Stripe Webhook Handler

```typescript
// app/api/webhooks/stripe/route.ts
import Stripe from 'stripe';

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return new Response('Webhook signature invalid', { status: 400 });
  }

  const supabase = createServiceClient(); // service role key

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const { wedding_id } = session.metadata!;
      await supabase.from('weddings')
        .update({ subscription_tier: resolvetier(session), stripe_subscription_id: session.subscription as string })
        .eq('id', wedding_id);
      break;
    }
    case 'customer.subscription.deleted': {
      // Downgrade logic ...
      break;
    }
    // ... other cases
  }

  return new Response('OK', { status: 200 });
}
```

### 8.4 Billing Portal

Couples can manage their subscription (upgrade, downgrade, cancel, update payment method) via the Stripe Customer Portal:

```typescript
// Server Action
export async function openBillingPortal(weddingId: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/weddings/${weddingId}/settings`,
  });
  redirect(session.url);
}
```

---

## 9. Custom Domain Architecture

### 9.1 Domain Assignment Flow

```
1. Couple enters "mywedding.com" in Settings → Domains
         │
         ▼
2. Server Action: addCustomDomain(weddingId, domain)
         │
         ├── Validate: no other wedding using this domain
         ├── Call Vercel Domains API: POST /v10/projects/{projectId}/domains
         │   Body: { name: "mywedding.com" }
         ├── Save domain to weddings.custom_domain (domain_verified = false)
         └── Return DNS instructions to user

3. Couple configures DNS:
         ├── CNAME  www   → cname.vercel-dns.com
         └── A      @     → 76.76.21.21  (Vercel IP)

4. Couple clicks "Verify" → POST /api/domains/verify
         │
         └── Call Vercel Domains API: GET /v9/projects/{projectId}/domains/{domain}
             └── If verified → SET domain_verified = true, domain_verified_at = now()

5. Middleware (custom domain path):
         └── SELECT slug FROM weddings WHERE custom_domain = hostname
             └── Rewrite to /wedding/{slug}/...
```

### 9.2 Custom Domain Middleware Detail

Custom domain lookups in the middleware must be fast (edge latency). Strategy:

- **Primary:** Supabase edge function or Vercel KV store caches `{domain → slug}` mappings
- **TTL:** 5 minutes for the KV cache; invalidated on domain add/remove
- **Fallback:** Direct Supabase query if cache miss (acceptable for cold paths)

```typescript
async function resolveTenantByCustomDomain(hostname: string): Promise<string | null> {
  // 1. Check Vercel KV cache
  const cached = await kv.get<string>(`domain:${hostname}`);
  if (cached) return cached;

  // 2. Fallback to Supabase (service role, bypasses RLS)
  const { data } = await supabase
    .from('weddings')
    .select('slug')
    .eq('custom_domain', hostname)
    .eq('domain_verified', true)
    .single();

  if (data?.slug) {
    await kv.set(`domain:${hostname}`, data.slug, { ex: 300 }); // 5-min TTL
    return data.slug;
  }

  return null;
}
```

### 9.3 SSL / TLS

- Vercel automatically provisions **Let's Encrypt** SSL certificates for all added domains (including custom ones)
- No manual cert management required
- SSL is enforced; HTTP requests are auto-redirected to HTTPS by Vercel

---

## 10. Email Architecture

### 10.1 Email Provider: Resend

All transactional email is sent via **Resend** using **React Email** templates.

### 10.2 Email Types & Triggers

| Email Type               | Trigger                                 | Recipient       | Template                      |
|--------------------------|-----------------------------------------|-----------------|-------------------------------|
| Magic Link               | User requests sign-in                   | User            | Supabase built-in             |
| Welcome Email            | New user profile created (DB trigger)   | Couple          | `welcome.tsx`                 |
| RSVP Confirmation        | Guest submits RSVP                      | Guest           | `rsvp-confirmation.tsx`       |
| RSVP Notification        | Guest submits RSVP                      | Couple          | `rsvp-alert.tsx`              |
| Guest Invitation         | Couple sends invite from dashboard      | Guest           | `guest-invite.tsx`            |
| Subscription Confirmed   | `checkout.session.completed` webhook    | Couple          | `subscription-welcome.tsx`    |
| Payment Failed           | `invoice.payment_failed` webhook        | Couple          | `payment-failed.tsx`          |
| Subscription Cancelled   | `customer.subscription.deleted` webhook | Couple          | `subscription-cancelled.tsx`  |
| Domain Verified          | Domain verification completes           | Couple          | `domain-verified.tsx`         |

### 10.3 Email Sending Utility

```typescript
// lib/email/send.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
  to,
  subject,
  react,
}: {
  to: string;
  subject: string;
  react: React.ReactElement;
}) {
  return resend.emails.send({
    from: 'EverAfter <hello@everafter.com>',
    to,
    subject,
    react,
  });
}
```

### 10.4 From Domain Configuration

- Resend domain: `everafter.com` (DNS verified via Resend dashboard)
- From address: `hello@everafter.com` for notifications, `noreply@everafter.com` for system emails
- Couple-facing emails use the couple's wedding title in the subject line for personalisation

---

## 11. Environment Configuration

### 11.1 Environment Variables

All secrets are managed in Vercel's Environment Variables dashboard, scoped to Production / Preview / Development.

```bash
# ─── Supabase ───────────────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>       # SERVER ONLY — never expose to client

# ─── Application ────────────────────────────────────────────
NEXT_PUBLIC_APP_URL=https://app.everafter.com
NEXT_PUBLIC_ROOT_DOMAIN=everafter.com

# ─── Stripe ─────────────────────────────────────────────────
STRIPE_SECRET_KEY=sk_live_...                      # SERVER ONLY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...                    # SERVER ONLY
STRIPE_PRICE_ID_ESSENTIALS=price_...
STRIPE_PRICE_ID_PREMIUM=price_...

# ─── Resend ─────────────────────────────────────────────────
RESEND_API_KEY=re_...                              # SERVER ONLY

# ─── Vercel Domains API ─────────────────────────────────────
VERCEL_API_TOKEN=<token>                           # SERVER ONLY
VERCEL_PROJECT_ID=<project-id>
VERCEL_TEAM_ID=<team-id>

# ─── Optional: Vercel KV (custom domain cache) ──────────────
KV_URL=...
KV_REST_API_URL=...
KV_REST_API_TOKEN=...
KV_REST_API_READ_ONLY_TOKEN=...
```

> **Security Rule:** Any variable prefixed `NEXT_PUBLIC_` is bundled into the client build and visible in the browser. All secret keys (Supabase service role, Stripe secret, Resend API key) must **never** carry the `NEXT_PUBLIC_` prefix.

### 11.2 Local Development Setup

```bash
# Copy example env file
cp .env.example .env.local

# Start Supabase locally
supabase start

# Run Next.js dev server
pnpm dev
```

For local Stripe webhook testing:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

---

## 12. Key Architectural Decisions & Rationale

### 12.1 App Router over Pages Router

Next.js 14 App Router was selected for **React Server Components (RSC)** which allow data-fetching at the component level without waterfalls, reducing client bundle size significantly. Layouts enable persistent UI across navigation. Server Actions eliminate the need for dedicated API endpoints for most mutations.

### 12.2 Supabase over Custom Backend / Prisma + PlanetScale

Supabase provides a unified platform for auth, database, storage, and realtime — reducing operational overhead dramatically. Supabase's native RLS enables multi-tenant isolation at the database layer, avoiding the need for application-level tenant filtering on every query.

### 12.3 Shared Database Model (Single Schema, RLS)

Operating a single PostgreSQL database with RLS is the right model for EverAfter's scale. The alternatives (schema-per-tenant, DB-per-tenant) are operationally expensive, slow to migrate, and unnecessary below 100,000 tenants. RLS policies provide provably correct isolation at the query planner level.

### 12.4 Server Actions as Primary Mutation Layer

Server Actions reduce round-trips (no separate client → API → DB hops), improve security (form data processed server-side), and support progressive enhancement (forms work without JavaScript). For EverAfter, nearly all mutations (RSVP, guest management, photo ordering) are low-frequency writes, making Server Actions ideal.

### 12.5 Vercel for Hosting

Vercel's native Next.js optimizations (Edge Middleware, ISR, Streaming SSR), automatic preview deployments, and the **Vercel Domains API** (required for custom domain provisioning) make it the definitive hosting choice for this stack.

### 12.6 ISR for Public Wedding Pages

Public wedding pages are read-heavy and change infrequently. ISR with a 60-second revalidation window delivers near-static performance (CDN-served pages) while ensuring updates (new photos, updated RSVP status) propagate within a minute. On-demand revalidation via `revalidatePath` is called immediately after any content mutation.

### 12.7 Resend over SendGrid / AWS SES

Resend's first-class **React Email** integration allows email templates to be authored in TypeScript with the same component model as the rest of the application. This eliminates a separate templating system and enables type-safe, co-located email components.

---

## 13. Architecture Decision Records (ADR) Index

ADRs are stored in [`docs/adr/`](./adr/). Each ADR follows the standard template: **Context → Options → Decision → Rationale → Trade-offs**.

| ADR #  | Title                                     | Status    | Date       |
|--------|-------------------------------------------|-----------|------------|
| [ADR-001](./adr/ADR-001-technology-stack.md) | Technology Stack Selection           | Accepted  | 2026-09-27 |
| ADR-002 | Multi-Tenancy Model (Shared DB vs. Isolated) | Pending   | TBD        |
| ADR-003 | Custom Domain Strategy (Vercel vs. Cloudflare) | Pending | TBD        |
| ADR-004 | File Upload Architecture (Presigned URL vs. Server Proxy) | Pending | TBD |
| ADR-005 | Email Provider Selection (Resend vs. SendGrid vs. AWS SES) | Pending | TBD |
| ADR-006 | State Management Approach (Server-first vs. Client store) | Pending | TBD |

---

*This document is maintained by the EverAfter engineering team. For proposed changes, open a pull request and tag `@cto` for review.*
