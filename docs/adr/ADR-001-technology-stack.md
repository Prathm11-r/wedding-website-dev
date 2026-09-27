# ADR-001: Technology Stack Selection

| Field       | Value                        |
|-------------|------------------------------|
| **Status**  | Accepted                     |
| **Date**    | 2026-09-27                   |
| **Deciders**| CTO, Lead Engineer           |
| **Supersedes** | —                         |
| **Superseded by** | —                    |

---

## Context & Problem Statement

EverAfter is a **multi-tenant wedding website builder SaaS** targeting couples globally. The founding team needs to select a cohesive technology stack that:

1. Enables rapid iteration during the zero-to-one phase with a small engineering team
2. Scales to tens of thousands of wedding tenants without major re-architecture
3. Supports multi-tenancy natively (subdomain routing, per-tenant data isolation)
4. Handles payments, file storage, authentication, and email without cobbling together too many independent services
5. Allows a single full-stack TypeScript codebase to minimise context-switching
6. Has strong community support, good documentation, and hiring viability

The product requires:
- **Public-facing wedding websites** (SEO-important, fast load times, ISR/SSG)
- **Authenticated couple dashboard** (RSVP management, seating planner, gallery)
- **Planner portal** (managing multiple couple accounts)
- **Custom domain support** for paid tiers
- **Subscription billing**
- **Photo uploads** with per-tier storage limits

---

## Options Considered

### Option A: Next.js 14 (App Router) + Supabase + Stripe + Resend + Vercel ✅ *Selected*

A tightly integrated TypeScript-first stack using managed services for infrastructure concerns.

| Component       | Technology              |
|-----------------|-------------------------|
| Framework       | Next.js 14 (App Router) |
| Language        | TypeScript              |
| Styling         | Tailwind CSS            |
| Auth            | Supabase Auth           |
| Database        | Supabase (PostgreSQL)   |
| Storage         | Supabase Storage        |
| Payments        | Stripe                  |
| Email           | Resend + React Email    |
| Hosting         | Vercel                  |
| Custom Domains  | Vercel Domains API      |

---

### Option B: Next.js + PlanetScale + Prisma + Clerk + AWS S3 + Stripe

A more traditional backend approach using Prisma as an ORM over PlanetScale (MySQL) with Clerk for auth.

| Component       | Technology        |
|-----------------|-------------------|
| Framework       | Next.js 14        |
| Database        | PlanetScale (MySQL) |
| ORM             | Prisma            |
| Auth            | Clerk             |
| Storage         | AWS S3            |
| Payments        | Stripe            |
| Email           | SendGrid          |
| Hosting         | Vercel            |

**Concerns:**
- PlanetScale's branching model is powerful but adds complexity for a small team
- Clerk adds cost and is a separate auth provider with less tight DB integration
- AWS S3 requires IAM policy management, significantly more DevOps overhead
- Prisma does not support Row-Level Security — multi-tenant isolation must be handled at the application layer (bug-prone)
- More services = more billing accounts, more API keys, more failure points

---

### Option C: Remix + Fly.io + PostgreSQL (self-managed) + Lucia Auth

A more hands-on, self-hosted alternative with Remix as the framework.

| Component       | Technology              |
|-----------------|-------------------------|
| Framework       | Remix                   |
| Database        | PostgreSQL (self-hosted on Fly.io) |
| Auth            | Lucia Auth              |
| Storage         | Fly.io Volumes / Backblaze B2 |
| Payments        | Stripe                  |
| Email           | Postmark                |
| Hosting         | Fly.io                  |

**Concerns:**
- Self-managed PostgreSQL requires database backups, replication, and upgrade management — significant ongoing DevOps burden for a small founding team
- Remix has a smaller ecosystem, fewer community resources, and a smaller hiring pool compared to Next.js
- No native file storage service; requires integrating Backblaze or similar
- Fly.io lacks the Domains API integration needed for custom domain provisioning at scale
- Lucia Auth is less mature and has a smaller community

---

### Option D: T3 Stack (Next.js + tRPC + Prisma + NextAuth + PlanetScale)

The "T3 Stack" is a popular opinionated full-stack TypeScript setup.

| Component       | Technology              |
|-----------------|-------------------------|
| Framework       | Next.js 14              |
| API Layer       | tRPC                    |
| ORM             | Prisma                  |
| Auth            | NextAuth.js             |
| Database        | PlanetScale / Turso     |
| Hosting         | Vercel / Railway        |

**Concerns:**
- tRPC adds a code generation layer that is powerful but has friction for Server Components and Server Actions (tRPC v11 mitigates this but is young)
- Same Prisma/RLS concern as Option B — multi-tenant isolation at app layer only
- Supabase Storage and Auth are not part of this stack, requiring separate integrations
- PlanetScale removed their free tier, increasing baseline cost
- The T3 Stack was designed before the Next.js App Router era; some patterns are carried over from Pages Router and create friction

---

## Decision

**Option A — Next.js 14 (App Router) + Supabase + Stripe + Resend + Vercel** is selected.

---

## Rationale

### 1. Supabase provides the highest integration density

Supabase combines **auth, database, storage, and Row-Level Security** in a single platform. This eliminates four separate third-party service integrations (Clerk, PlanetScale, AWS S3, custom RLS middleware). For EverAfter's multi-tenant model, Supabase's native PostgreSQL RLS is the most reliable isolation mechanism available — the database itself enforces tenant boundaries, not application code.

### 2. Next.js 14 App Router aligns with the product's rendering requirements

EverAfter has two distinct rendering needs:
- **Public wedding sites** — should be fast, SEO-optimised, and edge-cached (ISR)
- **Dashboard** — should be dynamic, auth-gated, and data-fresh (SSR)

App Router natively supports both patterns within the same project. React Server Components reduce client bundle size and eliminate waterfall data fetching. Server Actions simplify the mutation layer, removing the need for a separate API layer for most write operations.

### 3. Vercel is required for custom domain provisioning

The **Vercel Domains API** allows programmatic assignment of custom domains (e.g., `mywedding.com`) to a Vercel project. Combined with **Edge Middleware** for tenant resolution by hostname, Vercel is uniquely positioned for EverAfter's multi-tenant domain architecture. Achieving the same on Fly.io or Railway would require significant custom infrastructure.

### 4. Resend + React Email reduces template complexity

React Email templates are authored as TypeScript React components, tested with Storybook, and rendered server-side by Resend. This eliminates a separate HTML templating system (Handlebars, Liquid) and ensures email rendering is type-safe and co-located with the application code.

### 5. TypeScript throughout

With Next.js, Supabase (typed client via `supabase gen types`), Stripe SDK, and Resend all offering first-class TypeScript support, the entire stack — from database schema to email template — is type-safe. This is a significant correctness and velocity advantage for a small team.

### 6. Hiring and ecosystem viability

Next.js is the most widely adopted React framework. The combination of Next.js + Tailwind + Supabase is increasingly a de-facto standard for SaaS products, making hiring straightforward. The ecosystem has extensive third-party tutorials, UI libraries (shadcn/ui, Radix UI), and community support.

---

## Trade-offs & Risks

### Trade-offs Accepted

| Trade-off | Accepted Because |
|-----------|-----------------|
| **Supabase vendor lock-in** (auth, DB, storage all from one vendor) | Supabase is open-source (SupaBase is self-hostable if needed); the productivity benefit outweighs lock-in risk at this stage |
| **Vercel lock-in** (Domains API, Edge Middleware, ISR) | Vercel's native Next.js support and Domains API are required features; migrating away later is possible but costly |
| **Shared database multi-tenancy** (RLS vs. isolated schemas) | RLS is proven at scale; schema-per-tenant adds migration complexity with no benefit below 100k tenants |
| **Server Actions are relatively new** (Next.js 14) | Server Actions are now stable and GA; the pattern is well-documented; risk is low |
| **No dedicated job queue** (cron jobs via Vercel Cron for now) | For MVP, Vercel Cron for scheduled tasks (RSVP reminders, stats roll-ups) is sufficient; a proper queue (BullMQ, Inngest) can be introduced in Phase 2 |

### Risks & Mitigations

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| Supabase service outage affects all tenants | Low | Supabase SLA + read replicas; implement circuit breakers; monitor uptime |
| Vercel pricing increases significantly | Medium | Abstract domain provisioning behind an interface; Cloudflare Workers alternative is documented |
| RLS policy bug leaks cross-tenant data | Low but severe | Comprehensive RLS policy test suite; security review before launch; Supabase Realtime disabled for multi-tenant tables |
| Stripe webhook delivery failure causes subscription state mismatch | Medium | Idempotent webhook handlers; event replay via Stripe dashboard; periodic subscription sync job |
| Next.js App Router instability / breaking changes | Low | Pin Next.js minor version; upgrade on defined schedule; comprehensive test suite |

---

## Consequences

- **Positive:** Fastest path to a working MVP; single TypeScript codebase; database-level multi-tenant isolation; minimal DevOps burden
- **Positive:** The Vercel Domains API solves the hardest infrastructure problem (custom domain provisioning) with minimal code
- **Positive:** Supabase's type generation (`supabase gen types typescript`) keeps the client and schema in sync automatically
- **Negative:** The team must become proficient in Supabase RLS policy syntax, which has a learning curve
- **Negative:** Next.js App Router caching behaviour (ISR, full-route cache, request memoization) requires careful understanding to avoid stale data bugs
- **Neutral:** Supabase free tier is sufficient for development and early beta; production costs are predictable and well-documented

---

## Related ADRs

- **ADR-002** (Pending): Multi-Tenancy Model — Shared DB vs. Isolated Schemas
- **ADR-003** (Pending): Custom Domain Strategy — Vercel Domains API vs. Cloudflare
- **ADR-004** (Pending): File Upload Architecture
- **ADR-005** (Pending): Email Provider Selection
