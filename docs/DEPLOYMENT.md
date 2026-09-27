# EverAfter — Deployment Guide

> Multi-tenant wedding website builder · Next.js 14 · Supabase · Stripe · Vercel · Resend

---

## Table of Contents

1. [Environment Overview](#1-environment-overview)
2. [Required Environment Variables](#2-required-environment-variables)
3. [Local Development Setup](#3-local-development-setup)
4. [Vercel Deployment Setup](#4-vercel-deployment-setup)
5. [Supabase Project Setup](#5-supabase-project-setup)
6. [Stripe Setup](#6-stripe-setup)
7. [Custom Domain Configuration](#7-custom-domain-configuration)
8. [CI/CD Pipeline](#8-cicd-pipeline)
9. [Environment Promotion Workflow](#9-environment-promotion-workflow)
10. [Rollback Procedure](#10-rollback-procedure)
11. [Monitoring and Logging](#11-monitoring-and-logging)
12. [Pre-Deployment Checklist](#12-pre-deployment-checklist)

---

## 1. Environment Overview

EverAfter uses three distinct environments, each with its own Supabase project and Stripe account (or mode) to ensure complete data isolation.

| Environment | Purpose | URL Pattern | Branch | Supabase Project | Stripe Mode |
|---|---|---|---|---|---|
| **Local Dev** | Day-to-day development | `http://localhost:3000` | any feature branch | `everafter-dev` | Test |
| **Preview** | PR review, QA, stakeholder demos | `https://<branch>.everafter.vercel.app` | pull requests | `everafter-staging` | Test |
| **Production** | Live customer traffic | `https://everafter.app` | `main` | `everafter-prod` | Live |

> [!IMPORTANT]
> Never point local development or preview environments at the **production** Supabase project or Stripe **Live** keys. A mistake here can corrupt real customer data or trigger real billing charges.

### Tenant Routing

EverAfter serves two distinct URL surfaces:

- **App dashboard** — `app.everafter.app` — couple-facing management UI
- **Public wedding sites** — `<slug>.everafter.app` (subdomain) or custom domain (e.g., `sarah-and-tom.com`) — guest-facing pages

Both surfaces are served from the same Next.js deployment. Middleware (`middleware.ts`) inspects the hostname on every request to determine routing context.

---

## 2. Required Environment Variables

### 2.1 Variable Reference

All variables must be set in `.env.local` for local development. In Vercel, set them per environment (Development / Preview / Production) in **Project Settings → Environment Variables**.

---

#### `NEXT_PUBLIC_SUPABASE_URL`

| Field | Value |
|---|---|
| **Type** | Public (exposed to browser) |
| **Example** | `https://abcdefghijkl.supabase.co` |
| **Description** | The base URL of your Supabase project. Used by both the Next.js server and the browser client to make API calls. |
| **Where to find** | Supabase Dashboard → Project → Settings → API → **Project URL** |
| **Per-environment** | Yes — each environment uses a different Supabase project |

---

#### `NEXT_PUBLIC_SUPABASE_ANON_KEY`

| Field | Value |
|---|---|
| **Type** | Public (exposed to browser) |
| **Example** | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| **Description** | The anon/public JWT key. Safe to expose to the browser; Row Level Security (RLS) policies enforce data access rules server-side. |
| **Where to find** | Supabase Dashboard → Project → Settings → API → **Project API Keys → anon public** |
| **Per-environment** | Yes |

---

#### `SUPABASE_SERVICE_ROLE_KEY`

| Field | Value |
|---|---|
| **Type** | **Secret — server-only. Never expose to the browser or commit to Git.** |
| **Example** | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| **Description** | Bypasses RLS entirely. Used only in Route Handlers, Server Actions, and admin scripts that need unrestricted database access (e.g., Stripe webhook processing, admin tooling). |
| **Where to find** | Supabase Dashboard → Project → Settings → API → **Project API Keys → service_role secret** |
| **Per-environment** | Yes |

> [!CAUTION]
> Rotate this key immediately if it is ever exposed in client-side code, browser DevTools network logs, or a public Git commit.

---

#### `STRIPE_SECRET_KEY`

| Field | Value |
|---|---|
| **Type** | **Secret — server-only.** |
| **Example** | `sk_test_...` (test) / `sk_live_...` (production) |
| **Description** | Used server-side to create Checkout sessions, manage subscriptions, issue refunds, and call the Stripe API directly. |
| **Where to find** | Stripe Dashboard → Developers → **API Keys → Secret key** |
| **Per-environment** | Use `sk_test_...` for local/preview, `sk_live_...` for production only |

---

#### `STRIPE_PUBLISHABLE_KEY`

| Field | Value |
|---|---|
| **Type** | Public (exposed to browser) |
| **Example** | `pk_test_...` (test) / `pk_live_...` (production) |
| **Description** | Used in the browser to initialize Stripe.js for payment UI elements. |
| **Where to find** | Stripe Dashboard → Developers → **API Keys → Publishable key** |
| **Per-environment** | Use `pk_test_...` for local/preview, `pk_live_...` for production only |

---

#### `STRIPE_WEBHOOK_SECRET`

| Field | Value |
|---|---|
| **Type** | **Secret — server-only.** |
| **Example** | `whsec_...` |
| **Description** | Used to verify the HMAC signature on incoming Stripe webhook payloads, ensuring they originate from Stripe and have not been tampered with. |
| **Where to find** | Stripe Dashboard → Developers → **Webhooks → Signing secret** (generated per endpoint) |
| **Per-environment** | Yes — each environment registers a separate webhook endpoint and receives a unique secret. For local dev, use the Stripe CLI listener secret (see §6). |

---

#### `RESEND_API_KEY`

| Field | Value |
|---|---|
| **Type** | **Secret — server-only.** |
| **Example** | `re_...` |
| **Description** | Authenticates requests to the Resend API for transactional emails (RSVP confirmations, invite links, billing receipts). |
| **Where to find** | Resend Dashboard → **API Keys → Create API Key** |
| **Per-environment** | A single key can cover all environments; scope test sends to a sandbox domain in local/preview to avoid sending real emails. Alternatively, create separate keys per environment. |

---

#### `NEXT_PUBLIC_APP_URL`

| Field | Value |
|---|---|
| **Type** | Public |
| **Example** | `http://localhost:3000` / `https://everafter.app` |
| **Description** | The canonical base URL for the current environment. Used to construct absolute URLs for OAuth redirects, email links, and Stripe `success_url` / `cancel_url`. |
| **Per-environment** | Yes — must match the actual URL of the deployed environment |

---

#### `NEXT_PUBLIC_APP_DOMAIN`

| Field | Value |
|---|---|
| **Type** | Public |
| **Example** | `localhost:3000` / `everafter.app` |
| **Description** | The root domain used by middleware to differentiate between the app subdomain and couple wedding-site subdomains (e.g., `app.everafter.app` vs `sarah.everafter.app`). |
| **Per-environment** | Yes |

---

### 2.2 `.env.local` Template

Copy this file to `.env.local` and fill in your values. **Do not commit `.env.local` to Git.**

```bash
# ─── Supabase ────────────────────────────────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# ─── Stripe ──────────────────────────────────────────────────────────────────
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# ─── Resend ──────────────────────────────────────────────────────────────────
RESEND_API_KEY=re_...

# ─── App ─────────────────────────────────────────────────────────────────────
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_DOMAIN=localhost:3000
```

> [!NOTE]
> `.env.local` is already listed in `.gitignore` by `create-next-app`. Verify this before your first commit with `git check-ignore -v .env.local`.

---

## 3. Local Development Setup

### Prerequisites

| Tool | Minimum Version | Install |
|---|---|---|
| Node.js | 20 LTS | [nodejs.org](https://nodejs.org) |
| pnpm | 9.x | `npm install -g pnpm` |
| Supabase CLI | Latest | `npm install -g supabase` |
| Stripe CLI | Latest | [stripe.com/docs/stripe-cli](https://stripe.com/docs/stripe-cli) |
| Git | 2.x+ | [git-scm.com](https://git-scm.com) |

### Step-by-Step

**Step 1 — Clone the repository**

```bash
git clone https://github.com/your-org/everafter.git
cd everafter
```

**Step 2 — Install dependencies**

```bash
pnpm install
```

**Step 3 — Configure environment variables**

```bash
cp .env.example .env.local
# Edit .env.local with your dev Supabase project credentials and Stripe test keys
```

**Step 4 — Start Supabase locally (optional but recommended)**

Running Supabase locally gives you a fully isolated database without touching the shared dev project.

```bash
supabase start
# The CLI will print your local SUPABASE_URL and ANON_KEY — paste these into .env.local
```

To apply the latest migrations against your local instance:

```bash
supabase db reset
```

**Step 5 — Start the Stripe CLI webhook listener**

This tunnels Stripe events to your local Route Handler, simulating a live webhook endpoint.

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
# Copy the printed "whsec_..." value into STRIPE_WEBHOOK_SECRET in .env.local
```

**Step 6 — Start the development server**

```bash
pnpm dev
```

The app is now running at `http://localhost:3000`.

**Step 7 — Verify the setup**

- Visit `http://localhost:3000` → you should see the marketing homepage.
- Visit `http://localhost:3000/dashboard` → you should be redirected to the login page.
- Trigger a test Stripe event: `stripe trigger checkout.session.completed` — the CLI listener should log receipt and your database should update accordingly.

---

## 4. Vercel Deployment Setup

### 4.1 Initial Project Creation

1. Go to [vercel.com/new](https://vercel.com/new) and import the GitHub repository.
2. Set **Framework Preset** to `Next.js`.
3. Set **Root Directory** to `.` (project root).
4. Do **not** add environment variables during this wizard — configure them separately per §4.2.

### 4.2 Environment Variables in Vercel

Navigate to **Project → Settings → Environment Variables**.

For each variable from §2.1:
- Set the correct value for each environment scope (**Development**, **Preview**, **Production**).
- Mark secret variables (service role key, Stripe secret, webhook secret, Resend key) as **Sensitive** (Vercel encrypts them and prevents them from being read back via the UI after saving).

> [!TIP]
> Use the Vercel CLI to bulk-import variables from your `.env.local`:
> ```bash
> vercel env pull   # pulls production vars to .env.local
> vercel env add    # add a new variable interactively
> ```

### 4.3 Build Configuration

Verify `vercel.json` (or `next.config.ts`) includes:

```json
{
  "buildCommand": "pnpm build",
  "installCommand": "pnpm install --frozen-lockfile",
  "outputDirectory": ".next"
}
```

### 4.4 Vercel Team & Project Settings

| Setting | Recommended Value |
|---|---|
| Node.js version | 20.x |
| Build cache | Enabled |
| Function region | `iad1` (US East) or nearest to your primary user base |
| Edge Middleware | Enabled (used for subdomain routing) |

---

## 5. Supabase Project Setup

### 5.1 Create Projects

Create **three separate Supabase projects** (one per environment):

| Project Name | Plan | Purpose |
|---|---|---|
| `everafter-dev` | Free | Local/shared development |
| `everafter-staging` | Pro | Preview deployments, QA |
| `everafter-prod` | Pro | Production traffic |

> [!IMPORTANT]
> Production must be on the **Pro plan** to access daily backups, point-in-time recovery, and the higher connection pool limits required for multi-tenant workloads.

### 5.2 Apply Database Migrations

```bash
# Authenticate with Supabase
supabase login

# Link to the target project (run once per environment)
supabase link --project-ref <project-ref>

# Push all pending migrations
supabase db push
```

### 5.3 Configure Auth

In Supabase Dashboard → **Authentication → URL Configuration**:

- **Site URL**: set to `NEXT_PUBLIC_APP_URL` for that environment (e.g., `https://everafter.app`)
- **Redirect URLs**: add:
  - `https://everafter.app/auth/callback`
  - `https://*.everafter.vercel.app/auth/callback` (for preview deployments)
  - `http://localhost:3000/auth/callback` (for local dev — dev project only)

Enable auth providers as required (Email, Google OAuth, etc.) under **Authentication → Providers**.

### 5.4 Configure Storage

Create the following storage buckets:

| Bucket Name | Public | Purpose |
|---|---|---|
| `wedding-photos` | Yes | Couple and guest photo uploads served via CDN |
| `wedding-assets` | Yes | Background images, hero images for website themes |
| `private-docs` | No | Internal documents, receipts (not customer-facing) |

Set appropriate RLS policies on each bucket to restrict uploads to authenticated users and reads to the correct tenant context.

### 5.5 Enable Row Level Security

**All tables must have RLS enabled.** Verify with:

```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public' AND rowsecurity = false;
```

This query should return **zero rows** before any deployment to production.

### 5.6 Connection Pooling (Production)

In Supabase Dashboard → **Settings → Database → Connection Pooling**:

- **Mode**: `Transaction` (recommended for serverless Next.js Route Handlers)
- **Pool size**: Start at `10`, increase based on Vercel function concurrency observed in monitoring.

Use the pooler connection string (port `6543`) in any direct DB clients, not the standard port `5432`.

---

## 6. Stripe Setup

### 6.1 Create Products and Prices

Create the following products in the Stripe Dashboard under **Products → Add Product**. Mirror this configuration in both Test and Live modes.

| Product | Price ID env var | Billing | Amount |
|---|---|---|---|
| **Free** | *(no charge)* | — | $0 |
| **Bloom** | `STRIPE_PRICE_BLOOM` | Monthly / Annual | $12 / $99 |
| **Eternal** | `STRIPE_PRICE_ETERNAL` | Monthly / Annual | $29 / $239 |

After creating products, copy the Price IDs (e.g., `price_...`) and add them as environment variables.

Store the Stripe Product and Price IDs in your database (a `plans` table) so plan metadata is not hardcoded across the application.

### 6.2 Configure the Customer Portal

In Stripe Dashboard → **Settings → Billing → Customer portal**:

- Enable self-service cancellation and plan switching.
- Set the **Return URL** to `https://everafter.app/dashboard/billing`.

### 6.3 Register Webhook Endpoints

#### Production

1. Stripe Dashboard → **Developers → Webhooks → Add endpoint**
2. Endpoint URL: `https://everafter.app/api/webhooks/stripe`
3. Select events to listen for:

```
checkout.session.completed
customer.subscription.created
customer.subscription.updated
customer.subscription.deleted
invoice.paid
invoice.payment_failed
customer.updated
```

4. Copy the **Signing secret** (`whsec_...`) → set as `STRIPE_WEBHOOK_SECRET` in Vercel Production.

#### Preview / Staging

Repeat the above with endpoint URL: `https://staging.everafter.app/api/webhooks/stripe` (or configure a separate staging domain).

#### Local Development

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

The CLI outputs a signing secret — set it as `STRIPE_WEBHOOK_SECRET` in `.env.local`.

To test specific events:

```bash
stripe trigger checkout.session.completed
stripe trigger customer.subscription.deleted
stripe trigger invoice.payment_failed
```

### 6.4 Stripe Tax (Optional)

If tax collection is required for your markets, enable **Stripe Tax** in the Dashboard and set `automatic_tax: { enabled: true }` on Checkout Sessions.

---

## 7. Custom Domain Configuration

EverAfter couples can connect custom domains (e.g., `sarah-and-tom.com`) to their wedding site. This requires DNS delegation and Vercel's programmatic domain API.

### 7.1 Subdomain Routing (Default)

Out of the box, each wedding site is accessible at `<slug>.everafter.app`.

In Vercel Dashboard → **Project → Settings → Domains**:
- Add `*.everafter.app` as a wildcard domain.
- Vercel will issue a wildcard TLS certificate automatically.

Point the DNS wildcard at Vercel's nameservers:

```
Type: A     Host: *.everafter.app    Value: 76.76.21.21
Type: CNAME Host: www               Value: cname.vercel-dns.com
```

### 7.2 Custom Domain Flow (Per Couple)

When a couple adds a custom domain via the dashboard:

1. **App writes** the domain to the `wedding_sites` table (`custom_domain` column).
2. A **Server Action** calls the Vercel API to register the domain programmatically:

```typescript
await fetch(`https://api.vercel.com/v10/projects/${PROJECT_ID}/domains`, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${VERCEL_API_TOKEN}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ name: customDomain }),
});
```

3. The app displays **DNS instructions** to the couple:

```
Type: CNAME   Host: www    Value: cname.vercel-dns.com
Type: A       Host: @      Value: 76.76.21.21
```

4. A **background job** (Supabase Edge Function or cron) polls the Vercel API to confirm domain verification and updates `custom_domain_verified = true` in the database.

5. Middleware reads `custom_domain` from the database to map incoming hostnames to the correct tenant.

> [!NOTE]
> TLS certificates for custom domains are provisioned automatically by Vercel via Let's Encrypt. No manual certificate management is required.

---

## 8. CI/CD Pipeline

EverAfter uses **Vercel's native GitHub integration** for zero-configuration CI/CD.

### 8.1 Pipeline Overview

```
Feature Branch Push
        │
        ▼
  Vercel Preview Build
  ─────────────────────
  • pnpm install --frozen-lockfile
  • pnpm build (next build)
  • Deploy to preview URL
  • Post URL to GitHub PR comment
        │
        ▼
  Pull Request Review & QA
        │
        ▼
  Merge to main
        │
        ▼
  Vercel Production Build
  ─────────────────────
  • pnpm install --frozen-lockfile
  • pnpm build (next build)
  • supabase db push (via GitHub Action)
  • Deploy to everafter.app
  • Instant rollback available
```

### 8.2 GitHub Actions — Database Migrations

Vercel handles the Next.js build, but database migrations must be run separately as part of the merge-to-main flow. Add `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  migrate:
    name: Apply DB Migrations
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Supabase CLI
        uses: supabase/setup-cli@v1
        with:
          version: latest

      - name: Apply migrations to production
        run: supabase db push --linked
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
          SUPABASE_DB_PASSWORD: ${{ secrets.SUPABASE_DB_PASSWORD }}
```

> [!IMPORTANT]
> Run database migrations **before** the new Next.js code goes live. Vercel deploys atomically, but DB schema changes are not — always write backward-compatible migrations (add columns, don't rename or drop until the old code path is gone).

### 8.3 Branch Protection

Configure the following GitHub branch protection rules on `main`:

- Require pull request reviews (minimum 1)
- Require status checks: `Vercel — Preview` must pass
- Require linear history (no merge commits)
- Restrict who can push to `main` (CI/CD bot + senior engineers only)

---

## 9. Environment Promotion Workflow

```
┌──────────────┐     PR opened      ┌───────────────────┐     Merged to main     ┌────────────┐
│ Feature      │ ─────────────────► │ Preview Deploy    │ ──────────────────────► │ Production │
│ Branch       │                    │ (*.vercel.app)    │                          │ Deploy     │
└──────────────┘                    └───────────────────┘                          └────────────┘
     │                                      │                                           │
     │ Local dev                            │ QA, stakeholder                           │ Live
     │ localhost:3000                       │ review, E2E tests                         │ customers
     │ Supabase: dev project                │ Supabase: staging project                 │ Supabase: prod project
     │ Stripe: test mode                    │ Stripe: test mode                         │ Stripe: live mode
```

### Promotion Rules

| Step | Who | Criteria |
|---|---|---|
| Feature → PR | Developer | Branch builds successfully, all lint/type checks pass |
| PR → Preview | CI (auto) | Vercel preview build succeeds |
| Preview → main | Reviewer | QA sign-off, no open blocking issues, migration is backward-compatible |
| main → Production | CI (auto) | GitHub Action runs migrations first; Vercel deploys atomically |

---

## 10. Rollback Procedure

### 10.1 Application Rollback (Instant)

Vercel retains all previous successful deployments and allows instant promotion.

```bash
# Via Vercel CLI
vercel rollback [deployment-url]

# Via Dashboard
# Project → Deployments → find the last known-good deployment → "..." → Promote to Production
```

This takes approximately **30 seconds** and requires no code changes.

### 10.2 Database Rollback

Database rollbacks are more complex because Supabase migrations are applied incrementally.

**Preferred approach — forward-fix:**
Write a new corrective migration rather than rolling back, unless the bad migration was applied in the last few minutes.

**Emergency rollback (within the same deployment window):**

```bash
# Connect directly to Supabase DB
supabase db remote set postgresql://...

# Run the down migration manually (if written)
psql $DATABASE_URL -f migrations/YYYYMMDDHHMMSS_migration_name.down.sql
```

> [!WARNING]
> Always write **down migrations** alongside up migrations during development. Never drop or rename a column in a single deployment — use a two-phase approach: (1) add new column + migrate data, (2) remove old column in a subsequent deployment.

### 10.3 Stripe Configuration Rollback

Stripe product/price changes cannot be rolled back programmatically. If a price was incorrectly created:

1. Archive the incorrect price in the Stripe Dashboard (do not delete — historical invoices reference it).
2. Create the corrected price.
3. Update the Price ID environment variables in Vercel and redeploy.

---

## 11. Monitoring and Logging

### 11.1 Vercel Observability

**Runtime Logs**
- Vercel Dashboard → **Project → Logs** — real-time function invocation logs, errors, and cold starts.
- Filter by deployment, function name, or log level.

**Analytics**
- Vercel Analytics (enable in Project Settings) — tracks Core Web Vitals per page and geography.

**Speed Insights**
- Vercel Speed Insights — field data for LCP, INP, CLS. Enable via `@vercel/speed-insights` package (already integrated in `app/layout.tsx`).

### 11.2 Supabase Observability

- **Dashboard → Reports → API** — request volume, slow queries, error rates.
- **Dashboard → Database → Query Performance** — identifies slow queries (>1s) and missing indexes.
- **Dashboard → Logs → Edge** — Auth, Storage, and Edge Function invocation logs.

Set up **Supabase Alerts** (Dashboard → Settings → Alerts) for:
- Database CPU > 80%
- Storage usage > 70%
- Auth errors spike

### 11.3 Stripe Monitoring

- **Stripe Dashboard → Developers → Events** — full event log with payload inspection.
- **Stripe Dashboard → Developers → Webhooks → [endpoint]** — delivery success/failure rate, retry history.
- Set up email alerts in Stripe for failed payments (`invoice.payment_failed`).

### 11.4 Application Error Tracking

Integrate **Sentry** for exception tracking and performance monitoring:

```bash
pnpm add @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

Add `SENTRY_DSN` as an environment variable. Sentry captures:
- Unhandled exceptions in Server Components and Route Handlers
- Client-side JavaScript errors
- Performance traces with route-level breakdowns

### 11.5 Uptime Monitoring

Use **Better Uptime** or **Checkly** to monitor:

| Check | URL | Interval |
|---|---|---|
| Marketing homepage | `https://everafter.app` | 1 min |
| App login | `https://app.everafter.app/login` | 1 min |
| Stripe webhook health | `https://everafter.app/api/health` | 5 min |
| Supabase health | `https://<ref>.supabase.co/rest/v1/` | 5 min |

Create a `/api/health` route that checks Supabase connectivity and returns `200 OK` or `503 Service Unavailable`.

---

## 12. Pre-Deployment Checklist

Complete this checklist before every production deployment.

### Code Quality

- [ ] `pnpm lint` — zero errors, zero warnings
- [ ] `pnpm type-check` — zero TypeScript errors
- [ ] `pnpm test` — all unit and integration tests pass
- [ ] PR has been reviewed and approved by at least one other engineer
- [ ] No `console.log` statements committed (only structured logger)
- [ ] No hardcoded secrets, API keys, or URLs

### Database

- [ ] New migration files are present in `supabase/migrations/`
- [ ] Migration is backward-compatible with the current production code
- [ ] All new tables have RLS enabled and policies defined
- [ ] All new columns that could be null have a sensible default
- [ ] Indexes added for any new foreign keys or frequently queried columns
- [ ] Down migration written (if applicable)

### Environment & Configuration

- [ ] All required environment variables are set in Vercel for the Production scope
- [ ] Stripe webhook endpoint is registered and active
- [ ] Supabase Auth redirect URLs are up to date
- [ ] `NEXT_PUBLIC_APP_URL` and `NEXT_PUBLIC_APP_DOMAIN` are correct for production

### Stripe

- [ ] All referenced Stripe Price IDs exist in Live mode
- [ ] Webhook events cover all events handled in `/api/webhooks/stripe`
- [ ] Customer portal return URL is set correctly

### Security

- [ ] `SUPABASE_SERVICE_ROLE_KEY` is never referenced in any client-side file (`use client`, `page.tsx` that renders client components, or any file under `public/`)
- [ ] All API routes that mutate data validate the authenticated user's session
- [ ] CSP headers are present and correct in `next.config.ts`
- [ ] No open CORS policies on Supabase storage buckets

### Post-Deployment Verification

- [ ] Smoke test: create a test account, create a wedding site, publish it
- [ ] Smoke test: complete a Stripe Checkout flow in live mode with a test card
- [ ] Smoke test: RSVP form on a published wedding site submits correctly
- [ ] Vercel Logs show no 5xx errors in the first 5 minutes
- [ ] Sentry shows no new unhandled exceptions
- [ ] Uptime monitors are green

---

*Last updated: September 2026 · EverAfter Engineering*
