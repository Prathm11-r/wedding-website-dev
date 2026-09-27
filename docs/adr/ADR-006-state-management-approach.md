# ADR-006: State Management & Data Fetching Architecture

- **Status:** Accepted
- **Date:** 2026-09-27
- **Author:** Website CTO & System Architecture Team
- **Decision Makers:** Website CTO

---

## 1. Context

EverAfter has two distinct state management domains:
1. **Server-driven state**: Database records (weddings, guests, RSVP responses, seating arrangements, billing).
2. **Interactive client state**: Seating chart drag-and-drop canvas, live website builder split-screen preview, multi-step onboarding wizard forms.

Requirements:
1. Minimize JavaScript bundle size sent to clients.
2. Fast initial page loads using Server-Side Rendering (SSR) and Server Components (RSC).
3. Zero stale data issues on dashboard mutations.
4. Smooth optimistic updates for high-interaction features (e.g. dragging a guest to a table).

---

## 2. Options Considered

### Option A: React Server Components (RSC) + Server Actions + Zustand for Complex Canvas (Selected)
- Default to React Server Components for all data fetching.
- Use Next.js Server Actions for mutations (`revalidatePath` / `revalidateTag`).
- Use React 19 / 18 `useOptimistic` hook for immediate UI feedback.
- Use lightweight **Zustand** stores *only* for complex, multi-element local client interactions (specifically the Interactive Seating Chart canvas and Website Builder live preview).

- **Pros:**
  - Near-zero client bundle overhead for marketing, auth, and read-heavy views.
  - No redundant Redux / MobX boilerplate.
  - Native integration with Next.js App Router cache.
  - Localized client state where truly needed.

### Option B: Full Client-Side SPA with React Query / TanStack Query
- Fetch all data via client-side REST/GraphQL endpoints with React Query cache.

- **Pros:**
  - Familiar single-page app paradigm.
- **Cons:**
  - Degrades SEO on public wedding websites.
  - Higher JavaScript bundle size.
  - Waterfall fetches causing loading spinners on dashboard initial render.

### Option C: Redux Toolkit (RTK)
- Heavy global state store.

- **Pros:**
  - Time-travel debugging.
- **Cons:**
  - Massive overhead, unnecessary complexity for SaaS CRUD operations.

---

## 3. Decision

We choose **Option A: React Server Components + Server Actions as the default, supplemented by Zustand for isolated complex canvas interactions.**

- **Public wedding websites & Marketing pages:** 100% Server Components + Static / ISR rendering.
- **Dashboard CRUD operations:** Server Actions with `revalidatePath`.
- **Interactive Seating Planner & Live Builder:** Client Components backed by targeted Zustand stores for local drag-and-drop coordinates.

---

## 4. Consequences

- No global Redux store.
- Fast, SEO-optimized public rendering.
- Developers follow standard Next.js 14 patterns without learning proprietary state frameworks.
