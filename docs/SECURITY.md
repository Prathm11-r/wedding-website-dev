# SECURITY.md — EverAfter Platform

> **Version:** 1.0.0 — September 2026  
> **Owner:** Website CTO  
> **Review Cadence:** Quarterly, or after any significant architectural change  
> **Classification:** Internal — Engineering & Security Team

---

## Table of Contents

1. [Security Principles](#1-security-principles)
2. [Threat Model](#2-threat-model)
3. [Authentication Security](#3-authentication-security)
4. [Authorization Model](#4-authorization-model)
5. [Multi-Tenancy Isolation](#5-multi-tenancy-isolation)
6. [Input Validation](#6-input-validation)
7. [File Upload Security](#7-file-upload-security)
8. [API Security](#8-api-security)
9. [Security Headers](#9-security-headers)
10. [Secrets Management](#10-secrets-management)
11. [OWASP Top 10 Review](#11-owasp-top-10-review)
12. [Stripe Payment Security](#12-stripe-payment-security)
13. [Email Security](#13-email-security)
14. [Logging and Monitoring Security](#14-logging-and-monitoring-security)
15. [Dependency Security](#15-dependency-security)
16. [Incident Response Plan](#16-incident-response-plan)
17. [Known Security Limitations at v1](#17-known-security-limitations-at-v1)
18. [Pre-Launch Security Checklist](#18-pre-launch-security-checklist)

---

## 1. Security Principles

EverAfter is built on six foundational security principles. Every engineering decision — architecture, feature design, and deployment — must be evaluated against these.

### 1.1 Least Privilege

Every actor (user, service, database role, API key) is granted the minimum permissions required to perform its function and no more.

- Supabase RLS enforces per-row access at the database layer.
- Supabase service-role keys are **never** exposed to client-side code.
- Stripe API keys are scoped to the minimum required Stripe capabilities (restricted keys where possible).
- Vercel environment variables are scoped per environment (preview vs. production).

### 1.2 Defense in Depth

No single security control is relied upon exclusively. Multiple independent layers are applied at each tier:

```
Browser → Security Headers → Middleware Auth Check → API Route Validation → RLS Policy → Encrypted Storage
```

Even if one layer is bypassed, others remain to contain the damage.

### 1.3 Secure by Default

Features are designed to be secure in their default state. Sharing a wedding site is **opt-in**, not opt-out. Photo galleries default to private. RSVP forms require explicit activation by the couple.

### 1.4 Explicit Trust Boundaries

The platform never trusts client-supplied data implicitly. All authorization decisions are re-validated server-side, even when the client claims the user has a certain role.

### 1.5 Minimize Attack Surface

The public-facing attack surface is intentionally small:

- Public routes: the couple's wedding site (static/ISR), the RSVP form submission endpoint, and the Stripe webhook receiver.
- All dashboard and management routes require authentication.
- Admin tooling is never exposed via public URLs.

### 1.6 Privacy by Design

EverAfter handles sensitive personal data: couple identities, guest lists, dietary requirements, addresses, and in some cases, relationship details. This data:

- Is never sold or used for advertising.
- Is scoped strictly to the owning wedding record.
- Is purged on account deletion within 30 days per our data retention policy.
- Is never logged in plaintext in application logs.

---

## 2. Threat Model

### 2.1 Assets

| Asset | Sensitivity | Impact if Compromised |
|---|---|---|
| Couple PII (name, email, wedding date, location) | High | Privacy violation, reputational damage |
| Guest list (names, emails, dietary needs, addresses) | High | Privacy violation, potential harassment |
| Stripe payment records | High | Financial fraud, regulatory fines |
| Auth tokens / sessions | Critical | Full account takeover |
| Supabase service role key | Critical | Full database access across all tenants |
| Stripe secret key | Critical | Financial fraud at platform scale |
| Photo galleries | Medium | Unwanted exposure of private wedding photos |
| RSVP responses | Medium | Guest data leakage, spamming |
| Wedding site content (public) | Low | Defacement |
| Platform source code | Medium | Disclosure of security controls |

### 2.2 Threat Actors

| Actor | Motivation | Capability |
|---|---|---|
| **Script kiddie** | Curiosity, vandalism | Low — uses automated tools (SQLi scanners, brute-force) |
| **Jealous ex / uninvited person** | Targeted harassment against a specific couple | Medium — motivated, may know the couple |
| **Competitor** | Business intelligence, disruption | Medium — technical, motivated |
| **Mass-scraper bot** | Guest data harvesting, spam lists | Medium — automated, high volume |
| **Fraudster** | Free subscription abuse, payment fraud | Medium — financially motivated |
| **Nation-state / APT** | Unlikely at v1 scale; not a primary concern | High |
| **Insider threat** | Rogue employee or contractor | High — has privileged access |
| **Opportunistic attacker** | Finds a public vuln; targets EverAfter of opportunity | Low-Medium |

### 2.3 Threat Scenarios

#### TS-01: Horizontal Privilege Escalation (Tenant A reads Tenant B's data)
- **Attack vector:** Attacker authenticates as a valid user of Wedding A and crafts API requests to read Wedding B's guests.
- **Mitigation:** RLS policies on every table; all queries include implicit `wedding_id` scoping enforced by Supabase.
- **Residual risk:** Low — RLS is the canonical control; any query missing a policy defaults to deny.

#### TS-02: RSVP Form Spam / DoS
- **Attack vector:** Automated bot submits thousands of fake RSVPs to flood a couple's guest list.
- **Mitigation:** Rate limiting per IP at edge (Vercel middleware), CAPTCHA option, honeypot field, server-side validation.
- **Residual risk:** Medium at v1 — CAPTCHA is not implemented in v1 (see §17).

#### TS-03: Account Takeover via Magic Link Interception
- **Attack vector:** Attacker intercepts a magic link email (e.g., via compromised email account) and uses it to sign in.
- **Mitigation:** Magic links are single-use, short-lived (1 hour). Post-sign-in, session is bound to Supabase JWT. We cannot prevent compromise of the user's email account (out of scope).
- **Residual risk:** Medium — dependent on user's email provider security.

#### TS-04: Mass File Upload Abuse
- **Attack vector:** Attacker uploads malicious files (malware, extremely large files, content designed to exploit image parsers) disguised as photos.
- **Mitigation:** MIME type validation, file size limits, extension allow-list, Supabase Storage policies restrict access to uploader's bucket.
- **Residual risk:** Medium — no automated malware scanning at v1 (see §17).

#### TS-05: Stripe Webhook Replay / Forgery
- **Attack vector:** Attacker crafts or replays Stripe webhook events to upgrade accounts without payment.
- **Mitigation:** Stripe webhook signature verification on every inbound event; event ID deduplication.
- **Residual risk:** Low — Stripe's signature scheme is cryptographically sound.

#### TS-06: Exposed Supabase Service Role Key
- **Attack vector:** Service role key committed to git or exposed in client bundle, allowing attacker to bypass all RLS.
- **Mitigation:** Key stored only in Vercel environment variables as server-only; never imported in client-side modules.
- **Residual risk:** Low — enforced by code review gate and environment variable scoping.

#### TS-07: Subdomain Takeover
- **Attack vector:** A couple deletes their account; their subdomain DNS record remains pointing to Vercel. Attacker registers that subdomain.
- **Mitigation:** On account deletion, the custom subdomain/domain mapping must be removed from Vercel immediately via automation. See §5.2.
- **Residual risk:** Medium — requires account deletion flow automation (see §17).

#### TS-08: Planner Over-reach
- **Attack vector:** A wedding planner with legitimate access to one wedding attempts to access a second couple's data via API manipulation.
- **Mitigation:** Planner role is scoped to specific `wedding_id` entries in `wedding_planners` join table; RLS verifies this membership on every request.
- **Residual risk:** Low.

#### TS-09: SQL Injection via User Input
- **Attack vector:** Malicious input in RSVP form, guest names, or website content injected into raw SQL.
- **Mitigation:** Supabase client uses parameterized queries exclusively; no raw SQL string construction from user input.
- **Residual risk:** Very Low.

#### TS-10: Cross-Tenant XSS via Wedding Site Content
- **Attack vector:** Couple embeds malicious JavaScript in their custom wedding site content, which executes in another user's browser.
- **Mitigation:** Content Security Policy prevents inline script execution; all user-generated HTML content is sanitized server-side before render.
- **Residual risk:** Low — CSP + sanitization is defense in depth.

---

## 2.4 Trust Zones Diagram

```
┌─────────────────────────────────────────────────────────┐
│  UNTRUSTED ZONE (Public Internet)                       │
│  - Wedding site visitors                                │
│  - RSVP submitters                                      │
│  - Bots, scrapers                                       │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTPS only
┌──────────────────────▼──────────────────────────────────┐
│  EDGE ZONE (Vercel Edge / Middleware)                   │
│  - Rate limiting                                        │
│  - Security headers injection                           │
│  - Auth token validation (JWT)                          │
│  - Bot mitigation                                       │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│  APPLICATION ZONE (Next.js API Routes / Server Actions) │
│  - Server-side input validation (Zod)                   │
│  - Business logic authorization                         │
│  - Stripe webhook processing                            │
│  - Resend email dispatch                                │
└──────────────────────┬──────────────────────────────────┘
                       │ Service Role (server only)
┌──────────────────────▼──────────────────────────────────┐
│  DATA ZONE (Supabase)                                   │
│  - PostgreSQL + RLS                                     │
│  - Auth service                                         │
│  - Storage (S3-compatible, per-wedding buckets)         │
└─────────────────────────────────────────────────────────┘
```

---

## 3. Authentication Security

EverAfter uses Supabase Auth exclusively. We do **not** store passwords. Authentication is via magic link (email OTP) or Google OAuth.

### 3.1 Magic Link Security

**How it works:**
1. User submits their email address.
2. Supabase generates a single-use, time-limited token and sends an email via our Resend integration.
3. User clicks the link; Supabase validates the token and issues a JWT session.

**Security considerations:**

| Consideration | Our Control |
|---|---|
| Token lifetime | Maximum **1 hour** — configured in Supabase Auth settings. |
| Single-use enforcement | Enforced by Supabase — token is invalidated immediately on use. |
| Token entropy | Managed by Supabase (cryptographically random). Do not override. |
| Email enumeration | Magic link endpoint always returns 200 regardless of whether the email exists. The response body must not reveal existence. |
| Link displayed in logs | Ensure Resend webhook logs and any email provider logs do not store magic link URLs in plaintext. Configure Resend to use minimal logging. |
| Phishing risk | Email template clearly identifies EverAfter as the sender; includes warning "If you did not request this link, ignore it." |
| Rate limiting on request | The `/api/auth/magic-link` route is rate-limited to **5 requests per email address per 15 minutes** to prevent email flooding. |

**Implementation note — never redirect the raw token:**
```typescript
// ✅ Correct: Let Supabase handle the callback URL
// app/auth/callback/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    await supabase.auth.exchangeCodeForSession(code)
  }
  return NextResponse.redirect(new URL('/dashboard', request.url))
}
```

### 3.2 Google OAuth Flow

**Flow:**
1. User clicks "Sign in with Google."
2. Next.js redirects to Supabase OAuth endpoint → Google.
3. Google returns authorization code to Supabase callback.
4. Supabase exchanges for tokens, creates/updates the user record, and issues a session JWT.
5. User is redirected to the dashboard.

**Security considerations:**

| Consideration | Our Control |
|---|---|
| Callback URL allow-list | Only `https://[project].supabase.co/auth/v1/callback` is registered as an authorized redirect URI in Google Cloud Console. |
| State parameter | Supabase generates and validates the `state` parameter to prevent CSRF in the OAuth flow. |
| Email verification | Google OAuth users have email verified by Google. Trust `email_confirmed_at` from Supabase. |
| Account linking | If a user signs up with magic link and later uses Google with the same email, Supabase links the accounts — verify this behaviour is intentional and test it explicitly. |
| Scope minimization | Only request `openid`, `email`, `profile` scopes. Do **not** request Google Calendar, Drive, or Contacts scopes. |
| Token storage | Supabase stores the OAuth refresh token server-side. Never store raw Google access tokens in the application database or client storage. |

### 3.3 Session Management

EverAfter uses Supabase's JWT-based sessions. Sessions are managed via `@supabase/ssr` with secure `HttpOnly` cookies.

**Cookie configuration:**

```typescript
// Enforced via @supabase/ssr createServerClient
// Cookies are:
// - HttpOnly: true        → JS cannot read the session token
// - Secure: true          → HTTPS only
// - SameSite: 'lax'       → CSRF protection for top-level navigations
// - Path: '/'
```

**Session validation on every server request:**

```typescript
// middleware.ts — runs on every route
import { createMiddlewareClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const supabase = createMiddlewareClient({ request, response })
  // This call validates the JWT and refreshes it if near expiry
  const { data: { session } } = await supabase.auth.getSession()
  
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard')
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  return response
}
```

**Never rely on client-declared role claims.** Always fetch the user's role from the database server-side:

```typescript
// ✅ Correct
const { data: membership } = await supabase
  .from('wedding_members')
  .select('role')
  .eq('user_id', session.user.id)
  .eq('wedding_id', weddingId)
  .single()

// ❌ Wrong — trusting a client-supplied role
const role = request.headers.get('x-user-role')
```

### 3.4 Session Expiry

| Setting | Value | Rationale |
|---|---|---|
| JWT expiry | **1 hour** | Short-lived access tokens limit exposure window |
| Refresh token lifetime | **7 days** | Balance between security and UX |
| Refresh token rotation | **Enabled** | Each refresh issues a new refresh token and invalidates the old |
| Inactivity timeout | **Not enforced at v1** — see §17 | Would require custom middleware |
| Sign-out | Invalidates refresh token server-side via `supabase.auth.signOut()` |

**Session revocation on suspicious activity:**
If a security incident is detected, the Supabase dashboard allows bulk session revocation by user ID. Document the procedure in your incident response runbook.

---

## 4. Authorization Model

### 4.1 Roles

| Role | Description | How Assigned |
|---|---|---|
| `couple_owner` | Full control over a wedding record. Billing seat. | Assigned on wedding creation; only one per wedding. |
| `couple_member` | Collaborative access (e.g., both partners). Can edit content, manage guests. Cannot delete the wedding or transfer billing. | Invited by `couple_owner`. |
| `planner` | Professional wedding planner with read/write access scoped to assigned weddings only. Cannot access billing. | Invited by `couple_owner`; recorded in `wedding_planners` table. |
| `guest` (unauthenticated) | Can view the public wedding site and submit RSVPs. Cannot access the dashboard. | No authentication required. |

> [!IMPORTANT]
> The `guest` role is **not** a Supabase Auth role — it represents an unauthenticated public user. Do not create a Supabase user record for RSVPs. Guest RSVP data is stored in the `rsvp_responses` table and is owned by the wedding, not by a Supabase Auth user.

### 4.2 Database Schema (Role Tables)

```sql
-- Core wedding record
CREATE TABLE weddings (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  slug        TEXT UNIQUE NOT NULL,   -- e.g., "alice-and-bob"
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- All members of a wedding (owner + collaborators)
CREATE TABLE wedding_members (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id  UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role        TEXT NOT NULL CHECK (role IN ('couple_owner', 'couple_member')),
  invited_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(wedding_id, user_id)
);

-- Planner access assignments (separate table for explicit scoping)
CREATE TABLE wedding_planners (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id  UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
  planner_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  granted_at  TIMESTAMPTZ DEFAULT NOW(),
  granted_by  UUID NOT NULL REFERENCES auth.users(id),
  UNIQUE(wedding_id, planner_user_id)
);

-- Guest list entries
CREATE TABLE guests (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id  UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  email       TEXT,
  rsvp_status TEXT CHECK (rsvp_status IN ('pending', 'attending', 'declined')),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Unauthenticated RSVP responses
CREATE TABLE rsvp_responses (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id  UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
  guest_name  TEXT NOT NULL,
  email       TEXT,
  attending   BOOLEAN NOT NULL,
  dietary_req TEXT,
  message     TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  submitter_ip INET   -- stored for abuse investigation only
);
```

### 4.3 Row-Level Security Policy Design

RLS is **enabled on all tables** with `ALTER TABLE [table] ENABLE ROW LEVEL SECURITY`. The default policy is **deny all**; access is granted explicitly.

#### Helper Functions

```sql
-- Returns TRUE if the current user is a member (owner or collaborator) of the wedding
CREATE OR REPLACE FUNCTION is_wedding_member(wid UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM wedding_members
    WHERE wedding_id = wid AND user_id = auth.uid()
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Returns TRUE if the current user is the owner of the wedding
CREATE OR REPLACE FUNCTION is_wedding_owner(wid UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM wedding_members
    WHERE wedding_id = wid AND user_id = auth.uid() AND role = 'couple_owner'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Returns TRUE if the current user is an assigned planner for the wedding
CREATE OR REPLACE FUNCTION is_assigned_planner(wid UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM wedding_planners
    WHERE wedding_id = wid AND planner_user_id = auth.uid()
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;
```

#### `weddings` Table Policies

```sql
-- Owners and members can read their own wedding
CREATE POLICY "weddings_select" ON weddings FOR SELECT
  USING (is_wedding_member(id) OR is_assigned_planner(id));

-- Only the owner can update wedding settings
CREATE POLICY "weddings_update" ON weddings FOR UPDATE
  USING (is_wedding_owner(id));

-- Authenticated users can insert (creates their wedding)
-- owner_id must equal their own auth.uid()
CREATE POLICY "weddings_insert" ON weddings FOR INSERT
  WITH CHECK (owner_id = auth.uid());

-- Only the owner can delete the wedding
CREATE POLICY "weddings_delete" ON weddings FOR DELETE
  USING (is_wedding_owner(id));
```

#### `guests` Table Policies

```sql
-- Members and planners can read the guest list
CREATE POLICY "guests_select" ON guests FOR SELECT
  USING (is_wedding_member(wedding_id) OR is_assigned_planner(wedding_id));

-- Members and planners can add guests
CREATE POLICY "guests_insert" ON guests FOR INSERT
  WITH CHECK (is_wedding_member(wedding_id) OR is_assigned_planner(wedding_id));

-- Members and planners can update guest info
CREATE POLICY "guests_update" ON guests FOR UPDATE
  USING (is_wedding_member(wedding_id) OR is_assigned_planner(wedding_id));

-- Only members (not planners) can delete guests
CREATE POLICY "guests_delete" ON guests FOR DELETE
  USING (is_wedding_member(wedding_id));
```

#### `rsvp_responses` Table Policies

```sql
-- Members and planners can read responses
CREATE POLICY "rsvp_select" ON rsvp_responses FOR SELECT
  USING (is_wedding_member(wedding_id) OR is_assigned_planner(wedding_id));

-- Public insert: anyone can submit an RSVP (anon key permitted)
-- Validate wedding_id exists server-side in the API route before insert
CREATE POLICY "rsvp_insert_public" ON rsvp_responses FOR INSERT
  WITH CHECK (true);  -- Additional validation handled in API route

-- Only members can update/delete RSVP responses
CREATE POLICY "rsvp_update" ON rsvp_responses FOR UPDATE
  USING (is_wedding_member(wedding_id));

CREATE POLICY "rsvp_delete" ON rsvp_responses FOR DELETE
  USING (is_wedding_member(wedding_id));
```

> [!CAUTION]
> The `rsvp_insert_public` policy uses `WITH CHECK (true)` because the submitter is unauthenticated. This makes it **critical** that the API route (`/api/weddings/[slug]/rsvp`) validates that the target wedding exists, RSVPs are enabled for that wedding, and rate limiting is applied **before** writing to the database. Never pass the `wedding_id` directly from the request body for RSVP inserts — resolve it from the `slug` parameter server-side.

#### `wedding_planners` Table Policies

```sql
-- Planners can see their own assignments; owners can see all planners for their wedding
CREATE POLICY "planners_select" ON wedding_planners FOR SELECT
  USING (planner_user_id = auth.uid() OR is_wedding_owner(wedding_id));

-- Only the wedding owner can add planners
CREATE POLICY "planners_insert" ON wedding_planners FOR INSERT
  WITH CHECK (is_wedding_owner(wedding_id));

-- Only the wedding owner can remove planners
CREATE POLICY "planners_delete" ON wedding_planners FOR DELETE
  USING (is_wedding_owner(wedding_id));
```

### 4.4 Planner Access Scoping

A planner's access is **explicitly listed** in the `wedding_planners` table. There is no "planner of all weddings" role. The RLS `is_assigned_planner()` function gates access on a per-wedding basis.

**Planner cannot:**
- Access any wedding not in their `wedding_planners` entries.
- View or manage billing information.
- Delete the wedding or remove the couple's ownership.
- Add or remove other planners (only the owner can).
- Access other planners' personal information.

**Planner invitation flow:**
1. Owner submits planner's email via dashboard.
2. System looks up planner's `auth.uid()` by email (or sends invite link).
3. A row is inserted into `wedding_planners` (owner performs this via a server action that validates `is_wedding_owner` before insert).
4. Planner now has scoped access.

---

## 5. Multi-Tenancy Isolation

### 5.1 Data Isolation

Every piece of user data in EverAfter is scoped to a `wedding_id`. Isolation is enforced at three layers:

| Layer | Mechanism | Failure Mode if Missing |
|---|---|---|
| **API Route** | Server-side check: fetch `wedding_id` from DB by slug; verify caller is a member | Logical bypass — attacker sends crafted payload |
| **RLS Policy** | PostgreSQL denies rows where `wedding_id` doesn't match the caller's membership | Impossible to read cross-tenant data via Supabase client |
| **Application logic** | Dashboard fetches only the weddings where `auth.uid()` is a member | Incorrect UI rendering only; RLS is the authoritative guard |

**The RLS layer is the canonical trust boundary.** The API route check is defense-in-depth and provides better error messages; RLS ensures correctness even if the API layer is flawed.

**Testing isolation:**
For each new table, write a test that:
1. Creates two weddings, each with their own authenticated user.
2. Verifies that User A cannot `SELECT`, `INSERT`, `UPDATE`, or `DELETE` rows belonging to Wedding B.

```typescript
// Example isolation test (using Supabase test helpers or a test DB)
it('prevents cross-tenant guest list read', async () => {
  const { data, error } = await supabaseUserA
    .from('guests')
    .select('*')
    .eq('wedding_id', weddingB.id)
  
  expect(data).toHaveLength(0)  // RLS returns empty, not an error
  expect(error).toBeNull()
})
```

### 5.2 Subdomain Isolation

EverAfter serves couples' public wedding sites at `[slug].everafter.wedding` (or custom domains).

**Isolation requirements:**

| Concern | Control |
|---|---|
| **Slug uniqueness** | Enforced by `UNIQUE` constraint on `weddings.slug`; validated at creation time. |
| **Content isolation** | The `[slug]` param is resolved to a `wedding_id` via a public lookup; wedding site content is fetched by that `wedding_id` only. |
| **Cookie scope** | Session cookies are scoped to the dashboard domain (`app.everafter.wedding`), not the public site subdomains. Guests browsing `alice-bob.everafter.wedding` have no session cookies. |
| **CORS** | API routes only accept requests from `*.everafter.wedding` and explicitly allowlisted custom domains. |
| **Subdomain takeover** | On account deletion, the Vercel project's domain mapping must be removed within 24 hours via the account deletion automation job. Track the status of this cleanup in the incident log. |
| **Custom domains** | Custom domains (e.g., `alice-and-bob.com`) are added to Vercel via API on couple request. The couple must prove domain ownership (DNS TXT record) before the domain is activated. |

**Slug validation rules (server-side, enforced on creation):**

```typescript
// lib/validators/wedding.ts
const SLUG_REGEX = /^[a-z0-9][a-z0-9-]{2,48}[a-z0-9]$/

const RESERVED_SLUGS = new Set([
  'www', 'app', 'api', 'admin', 'dashboard', 'blog', 'support',
  'help', 'status', 'mail', 'smtp', 'login', 'signup', 'auth',
  'static', 'assets', 'cdn', 'dev', 'staging', 'test',
])

export function validateSlug(slug: string): { valid: boolean; reason?: string } {
  if (!SLUG_REGEX.test(slug)) return { valid: false, reason: 'Invalid format' }
  if (RESERVED_SLUGS.has(slug)) return { valid: false, reason: 'Slug is reserved' }
  return { valid: true }
}
```

---

## 6. Input Validation

### 6.1 Principles

- **All validation is server-side.** Client-side validation is UX only; it is never a security control.
- **Use Zod** for all schema validation. Define schemas in `lib/validators/` and import them in both API routes and Server Actions.
- **Validate shape, type, length, format, and range** for every field.
- **Reject unknown fields** — use `z.object(...).strict()` to discard or error on extra keys.

### 6.2 Validation Schema Examples

```typescript
// lib/validators/rsvp.ts
import { z } from 'zod'

export const RSVPSchema = z.object({
  guestName: z.string().min(1).max(120).trim(),
  email: z.string().email().max(255).optional(),
  attending: z.boolean(),
  dietaryRequirements: z.string().max(500).trim().optional(),
  message: z.string().max(1000).trim().optional(),
}).strict()

// lib/validators/guest.ts
export const CreateGuestSchema = z.object({
  name: z.string().min(1).max(120).trim(),
  email: z.string().email().max(255).optional().nullable(),
  plusOneAllowed: z.boolean().default(false),
  tableNumber: z.number().int().min(1).max(999).optional().nullable(),
}).strict()

// lib/validators/wedding.ts
export const UpdateWeddingSettingsSchema = z.object({
  displayName: z.string().min(2).max(200).trim(),
  weddingDate: z.string().date().optional(),
  venue: z.string().max(300).trim().optional(),
  rsvpEnabled: z.boolean(),
  rsvpDeadline: z.string().date().optional().nullable(),
  customMessage: z.string().max(5000).trim().optional(),
}).strict()
```

### 6.3 RSVP Form Abuse Prevention

The RSVP endpoint (`POST /api/weddings/[slug]/rsvp`) is unauthenticated and is the highest-risk input endpoint.

**Controls applied in order:**

1. **Edge rate limiting** — 10 RSVP submissions per IP per hour (Vercel middleware).
2. **Per-wedding rate limiting** — 200 total RSVP submissions per 24 hours per wedding (prevents a specific wedding from being flooded).
3. **Honeypot field** — A hidden form field (`website`) that legitimate browsers leave empty. Bot submissions filling it are silently discarded (no 4xx to avoid bot adaptation).
4. **RSVP enabled check** — Verify the wedding has `rsvp_enabled = true` before processing.
5. **RSVP deadline check** — Reject submissions after the configured deadline.
6. **Schema validation** — Zod validates all fields; reject with 400 on failure.
7. **IP logging** — Store `submitter_ip` for abuse investigation (not displayed to the couple; purged after 90 days).
8. **No duplicate prevention at v1** — See §17.

```typescript
// app/api/weddings/[slug]/rsvp/route.ts
export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
  // 1. Rate limit check (handled by middleware, but double-check here)
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'
  
  // 2. Parse and validate body
  const body = await request.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  
  // 3. Check honeypot
  if (body.website) {
    // Silently drop — do not reveal this to the bot
    return NextResponse.json({ success: true }, { status: 200 })
  }
  
  // 4. Schema validation (strips honeypot field before this point)
  const result = RSVPSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }
  
  // 5. Resolve wedding from slug (never trust wedding_id from client)
  const supabase = createRouteHandlerClient({ cookies })
  const { data: wedding } = await supabase
    .from('weddings')
    .select('id, rsvp_enabled, rsvp_deadline')
    .eq('slug', params.slug)
    .single()
  
  if (!wedding || !wedding.rsvp_enabled) {
    return NextResponse.json({ error: 'RSVPs are not open' }, { status: 404 })
  }
  
  if (wedding.rsvp_deadline && new Date() > new Date(wedding.rsvp_deadline)) {
    return NextResponse.json({ error: 'RSVP deadline has passed' }, { status: 410 })
  }
  
  // 6. Insert (using anon key; RLS permits public insert)
  await supabase.from('rsvp_responses').insert({
    wedding_id: wedding.id,  // Resolved from slug, not from client
    guest_name: result.data.guestName,
    email: result.data.email,
    attending: result.data.attending,
    dietary_req: result.data.dietaryRequirements,
    message: result.data.message,
    submitter_ip: ip,
  })
  
  return NextResponse.json({ success: true })
}
```

### 6.4 Rate Limiting Strategy

Rate limiting is applied at the Vercel Edge (middleware) and, where necessary, reinforced in API route logic.

| Endpoint | Limit | Window | Key |
|---|---|---|---|
| `POST /api/auth/magic-link` | 5 requests | 15 minutes | Email address |
| `POST /api/weddings/[slug]/rsvp` | 10 requests | 1 hour | IP address |
| `POST /api/weddings` (create wedding) | 3 requests | 1 hour | User ID |
| `POST /api/guests/import` (bulk import) | 2 requests | 1 hour | User ID |
| `POST /api/uploads` | 20 requests | 1 hour | User ID |
| All other authenticated routes | 300 requests | 1 minute | User ID |
| All other public routes | 60 requests | 1 minute | IP address |

**Implementation:** Use `@upstash/ratelimit` with Upstash Redis as the backing store for distributed rate limit counters across Vercel edge nodes.

```typescript
// lib/rateLimit.ts
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

export const rsvpRateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 h'),
  analytics: true,
  prefix: 'rl:rsvp',
})

export const magicLinkRateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '15 m'),
  analytics: true,
  prefix: 'rl:magic-link',
})
```

---

## 7. File Upload Security

### 7.1 Photo Upload Controls

EverAfter allows couples to upload photos to their gallery. This is an inherently risky feature.

**Allowed MIME types (explicit allow-list only):**

```typescript
// lib/uploads/validators.ts
export const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',   // Animated GIFs for fun moments — max 10MB
  'image/heic',  // iPhone photos
  'image/heif',
])

export const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024  // 25 MB
export const MAX_FILES_PER_UPLOAD = 20
export const MAX_TOTAL_STORAGE_FREE_BYTES = 500 * 1024 * 1024   // 500 MB
export const MAX_TOTAL_STORAGE_PRO_BYTES = 10 * 1024 * 1024 * 1024  // 10 GB
```

**Validation pipeline:**

| Step | What it checks | Where |
|---|---|---|
| 1. Client-side type check | Basic UX gating — not a security control | Browser |
| 2. Content-Type header | Must match allow-list | API route (before any processing) |
| 3. File size | Must not exceed per-file limit | API route |
| 4. File count per request | Max 20 files per batch | API route |
| 5. **Magic bytes** | First N bytes of the file must match the declared MIME type | API route (server-side) |
| 6. Storage quota | Total storage used by wedding must not exceed plan limit | API route |
| 7. Supabase Storage policy | Enforces bucket ownership | Supabase |

**Magic bytes validation** is critical — never trust only the `Content-Type` header or file extension:

```typescript
// lib/uploads/magicBytes.ts
const MAGIC_BYTES: Record<string, number[][]> = {
  'image/jpeg': [[0xFF, 0xD8, 0xFF]],
  'image/png':  [[0x89, 0x50, 0x4E, 0x47]],
  'image/webp': [[0x52, 0x49, 0x46, 0x46]], // RIFF header; also check bytes 8-11 for "WEBP"
  'image/gif':  [[0x47, 0x49, 0x46, 0x38]],
}

export async function validateMagicBytes(
  file: ArrayBuffer,
  claimedType: string
): Promise<boolean> {
  const bytes = new Uint8Array(file.slice(0, 16))
  const signatures = MAGIC_BYTES[claimedType]
  if (!signatures) return false
  return signatures.some(sig =>
    sig.every((byte, i) => bytes[i] === byte)
  )
}
```

### 7.2 Malware Considerations

> [!WARNING]
> EverAfter does **not** perform automated malware scanning at v1 launch. This is a known limitation (see §17). Images uploaded to Supabase Storage are:
> - Never executed server-side.
> - Served with restrictive `Content-Disposition: attachment` headers for non-image MIME types.
> - Never served from the same origin as the application (Supabase Storage uses a separate domain).

**Post-v1 mitigation roadmap:**
- Integrate VirusTotal API or ClamAV for async scanning after upload.
- Move flagged files to a quarantine bucket pending review.
- Notify the user if their upload fails the scan.

### 7.3 Supabase Storage Security Policies

Storage is organized with per-wedding buckets (or a single bucket with per-wedding prefixes):

```
Bucket: wedding-assets
  └── {wedding_id}/
        ├── gallery/
        ├── hero-image/
        └── documents/
```

**Supabase Storage RLS policies:**

```sql
-- Allow authenticated members to upload to their own wedding's folder
CREATE POLICY "upload_own_wedding_assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'wedding-assets' AND
  (storage.foldername(name))[1] = (
    SELECT id::text FROM weddings
    WHERE is_wedding_member(id) OR is_assigned_planner(id)
    LIMIT 1
  )
);

-- Allow authenticated members to read their own wedding's assets
CREATE POLICY "read_own_wedding_assets"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'wedding-assets' AND
  is_wedding_member((storage.foldername(name))[1]::uuid)
);

-- Public gallery access (only if wedding has public_gallery = true)
CREATE POLICY "read_public_gallery"
ON storage.objects FOR SELECT
TO anon
USING (
  bucket_id = 'wedding-assets' AND
  (storage.foldername(name))[2] = 'gallery' AND
  EXISTS (
    SELECT 1 FROM weddings
    WHERE id = (storage.foldername(name))[1]::uuid
    AND public_gallery = true
  )
);
```

**Storage bucket settings:**
- `public = false` on the `wedding-assets` bucket (all access via signed URLs or RLS).
- Serve images via Supabase's image transformation API for resizing — prevents raw file access.
- Set a storage `file_size_limit` at the bucket level as an additional backstop.

---

## 8. API Security

### 8.1 CORS Policy

EverAfter's API routes only accept browser requests from trusted origins.

```typescript
// middleware.ts — CORS origin validation
const ALLOWED_ORIGINS = new Set([
  'https://everafter.wedding',
  'https://app.everafter.wedding',
  // Dynamic: add couple subdomains for their public site only (read-only API calls)
])

export function corsHeaders(origin: string | null): HeadersInit {
  const isAllowed = origin && (
    ALLOWED_ORIGINS.has(origin) ||
    /^https:\/\/[a-z0-9-]+\.everafter\.wedding$/.test(origin)
  )
  return {
    'Access-Control-Allow-Origin': isAllowed ? origin! : 'null',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  }
}
```

> [!IMPORTANT]
> Never set `Access-Control-Allow-Origin: *` on any route that handles authenticated data. Wildcard CORS on credentialed routes allows cross-site request forgery from any domain.

### 8.2 API Key Management

| Key | Storage | Accessible From |
|---|---|---|
| `SUPABASE_URL` | Vercel env var | Client + Server (public) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Vercel env var (public) | Client + Server (safe — RLS enforced) |
| `SUPABASE_SERVICE_ROLE_KEY` | Vercel env var (**no** `NEXT_PUBLIC_` prefix) | **Server only** |
| `STRIPE_SECRET_KEY` | Vercel env var (no `NEXT_PUBLIC_` prefix) | **Server only** |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Vercel env var (public) | Client + Server |
| `STRIPE_WEBHOOK_SECRET` | Vercel env var (no `NEXT_PUBLIC_` prefix) | **Server only** |
| `RESEND_API_KEY` | Vercel env var (no `NEXT_PUBLIC_` prefix) | **Server only** |
| `UPSTASH_REDIS_REST_URL` | Vercel env var (no `NEXT_PUBLIC_` prefix) | **Server only** |
| `UPSTASH_REDIS_REST_TOKEN` | Vercel env var (no `NEXT_PUBLIC_` prefix) | **Server only** |

**Rules:**
1. **Never prefix a secret with `NEXT_PUBLIC_`.** Next.js inlines `NEXT_PUBLIC_` variables into the client bundle at build time.
2. Any file that imports a server-only secret must either be a Server Component, a Route Handler, or a Server Action. Add `import 'server-only'` at the top of utility files containing secrets to cause a build-time error if they're accidentally imported client-side.
3. Run `git secrets` or a similar pre-commit hook to prevent key material from being committed.

```typescript
// lib/stripe.ts
import 'server-only'  // Causes build error if imported client-side
import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})
```

### 8.3 Stripe Webhook Signature Verification

Every incoming Stripe webhook must be verified before any action is taken.

```typescript
// app/api/webhooks/stripe/route.ts
import 'server-only'
import { stripe } from '@/lib/stripe'
import { headers } from 'next/headers'

export async function POST(request: Request) {
  const body = await request.text()  // Raw text — must not be parsed before verification
  const signature = headers().get('stripe-signature')

  if (!signature) {
    return new Response('Missing stripe-signature header', { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Stripe webhook signature verification failed:', err)
    return new Response('Invalid signature', { status: 400 })
  }

  // Idempotency: check event ID hasn't been processed already
  const processed = await checkEventProcessed(event.id)
  if (processed) return new Response('Already processed', { status: 200 })

  // Handle the event
  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      await handleSubscriptionChange(event.data.object as Stripe.Subscription)
      break
    case 'invoice.payment_failed':
      await handlePaymentFailed(event.data.object as Stripe.Invoice)
      break
    // ... other event types
  }

  await markEventProcessed(event.id)
  return new Response('OK', { status: 200 })
}
```

> [!CAUTION]
> Never read `request.json()` before calling `stripe.webhooks.constructEvent()`. The raw body must be used for signature verification. Parsing JSON first changes the body encoding and will cause verification to fail, tempting developers to skip verification.

---

## 9. Security Headers

All security headers are injected via `next.config.js`. They apply to every response.

```javascript
// next.config.js
const securityHeaders = [
  {
    key: 'Strict-Transport-Security',
    // max-age=63072000 = 2 years; includeSubDomains + preload for HSTS preload list
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-Frame-Options',
    // Blocks the page from being embedded in an iframe (clickjacking)
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    // Prevents MIME-type sniffing
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    // Sends origin only when navigating to same origin; nothing to third parties
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    // Disable features the app doesn't use
    value: 'camera=(), microphone=(), geolocation=(), payment=(self)',
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      // Next.js requires unsafe-inline for inline scripts in development;
      // Use nonces in production for stricter CSP
      "script-src 'self' 'unsafe-eval' https://js.stripe.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://*.supabase.co https://*.stripe.com",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.stripe.com https://api.resend.com",
      "frame-src https://js.stripe.com https://hooks.stripe.com",
      "frame-ancestors 'none'",  // Redundant with X-Frame-Options but belt-and-suspenders
      "form-action 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "upgrade-insecure-requests",
    ].join('; '),
  },
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}

module.exports = nextConfig
```

> [!TIP]
> Move to **nonce-based CSP** as soon as possible to eliminate `unsafe-inline`. Next.js 14 supports nonces in Server Components via `headers()`. This is listed as a v2 improvement.

**Header testing:**
Use [https://securityheaders.com](https://securityheaders.com) and [https://observatory.mozilla.org](https://observatory.mozilla.org) to validate headers before each major release. Target grade **A+**.

---

## 10. Secrets Management

### 10.1 Environment Variable Classification

| Variable | Environment | Classification |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | All | Public — safe in client |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | All | Public — RLS enforced |
| `SUPABASE_SERVICE_ROLE_KEY` | Production, Preview (limited) | **SECRET — server only** |
| `STRIPE_SECRET_KEY` | Production | **SECRET — server only** |
| `STRIPE_PUBLISHABLE_KEY` | All | Public |
| `STRIPE_WEBHOOK_SECRET` | Production | **SECRET — server only** |
| `RESEND_API_KEY` | Production | **SECRET — server only** |
| `UPSTASH_REDIS_REST_URL` | All | **SECRET — server only** |
| `UPSTASH_REDIS_REST_TOKEN` | All | **SECRET — server only** |
| `NEXTAUTH_SECRET` | All | **SECRET — server only** |

### 10.2 Rules for Secrets

1. **Never commit secrets to git.** Use `.env.local` for local development; `.env.local` must be in `.gitignore`.
2. **Never log secrets**, even in debug output.
3. **Rotate immediately** if a secret is accidentally exposed (committed, logged, or included in an error response).
4. **Use separate keys per environment.** The production Stripe key must never be used in development or staging.
5. **Limit Vercel preview environment access** — the `SUPABASE_SERVICE_ROLE_KEY` should use a separate, scoped Supabase project for preview deployments to prevent preview branches from accessing production data.
6. **Audit access logs** — Supabase and Stripe both provide API key usage logs. Review these monthly.

### 10.3 `.env.example` Template

Maintain a committed `.env.example` with all required keys listed but no values:

```bash
# .env.example — committed to git; contains NO values
# Copy to .env.local and fill in for local development

# Supabase (public)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Supabase (server only — never prefix with NEXT_PUBLIC_)
SUPABASE_SERVICE_ROLE_KEY=

# Stripe (public)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Stripe (server only)
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Resend (server only)
RESEND_API_KEY=

# Upstash Redis (server only)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 10.4 Secret Scanning

Configure GitHub's secret scanning and push protection on the repository. Add a pre-commit hook using `detect-secrets` or `gitleaks`:

```bash
# .husky/pre-commit
npx detect-secrets-hook --baseline .secrets.baseline
```

---

## 11. OWASP Top 10 Review

| OWASP Risk | Relevant to EverAfter? | Our Control |
|---|---|---|
| **A01 Broken Access Control** | **Critical** — multi-tenant SaaS | RLS policies on all tables; server-side role validation; planner scoping via `wedding_planners` table. |
| **A02 Cryptographic Failures** | Medium | No passwords stored. JWTs use RS256 (Supabase managed). TLS enforced via HSTS. Stripe handles card data (PCI DSS). Data at rest encrypted by Supabase (AES-256). |
| **A03 Injection** | Medium | Supabase client uses parameterized queries. Zod validates all inputs. User-generated HTML is sanitized before render. No raw SQL string construction. |
| **A04 Insecure Design** | Medium | Threat model documented here. RSVP endpoint is public by design with mitigating controls. Regular security design reviews before new feature launches. |
| **A05 Security Misconfiguration** | Medium | Security headers enforced via `next.config.js`. Supabase bucket is private by default. Service role key is server-only. `npm audit` in CI. |
| **A06 Vulnerable Components** | Medium | `npm audit` runs in CI/CD. Dependabot alerts enabled. Dependencies reviewed quarterly. |
| **A07 Auth and Session Failures** | Medium | Magic link single-use and time-limited. Sessions via HttpOnly cookies. JWT expiry 1 hour. No passwords managed by EverAfter. |
| **A08 Software & Data Integrity** | Low-Medium | Stripe webhooks verified by signature. Subresource Integrity (SRI) not needed (no CDN-hosted scripts). `npm ci` in CI (lock file). |
| **A09 Logging & Monitoring Failures** | Medium | See §14. Key security events logged. PII not logged. Vercel log drain to centralised monitoring. Alerts on error rate spikes. |
| **A10 SSRF** | Low | EverAfter does not make server-side HTTP requests to user-supplied URLs at v1. If URL fetching is added (e.g., custom theme import), block RFC1918 ranges. |

---

## 12. Stripe Payment Security

### 12.1 What EverAfter Does Not Do

- **We never handle raw card data.** All card input is through Stripe Elements (hosted iframe), which means card data goes directly from the browser to Stripe's servers.
- **We never store card numbers, CVVs, or expiry dates** in our database.
- **We are not PCI DSS merchants** in the traditional sense — by using Stripe's hosted fields, we qualify for the simplest SAQ-A compliance path.

### 12.2 What We Do

- Store Stripe `customer_id` and `subscription_id` in our database (these are references, not card data).
- Store subscription `status` and `current_period_end` to gate feature access.
- Receive webhooks from Stripe to update subscription state.

### 12.3 Controls

```typescript
// Never store this — only reference it
interface WeddingSubscription {
  stripe_customer_id: string      // e.g., "cus_xxx"
  stripe_subscription_id: string  // e.g., "sub_xxx"
  plan: 'free' | 'pro' | 'premium'
  status: 'active' | 'trialing' | 'past_due' | 'canceled'
  current_period_end: Date
}
```

**Billing security practices:**

| Practice | Implementation |
|---|---|
| Webhook verification | `stripe.webhooks.constructEvent()` with `STRIPE_WEBHOOK_SECRET` (see §8.3) |
| Idempotency | Check `stripe_event_id` in DB before processing; mark as processed after |
| Subscription gating | Check `status === 'active'` server-side on every privileged action; never trust client-side plan claims |
| Customer ID scoping | Verify `stripe_customer_id` belongs to the requesting user before any Stripe API call that modifies it |
| Portal access | Stripe Customer Portal is the only way users manage billing — no custom billing forms |
| Test vs. live keys | Separate Stripe accounts for dev/staging and production; webhook secrets differ |

### 12.4 Fraud Controls

- Enable Stripe Radar rules (default rules cover most common fraud patterns).
- Flag accounts with more than 3 failed payment attempts in 24 hours for manual review.
- Restrict subscription creation to verified email addresses (Supabase `email_confirmed_at` not null).

---

## 13. Email Security

EverAfter sends transactional email via **Resend**. Our sending domain must be configured with proper authentication records to prevent spoofing and improve deliverability.

### 13.1 SPF (Sender Policy Framework)

Add a TXT record to your DNS:

```
Name:  everafter.wedding
Type:  TXT
Value: "v=spf1 include:_spf.resend.com ~all"
```

This authorizes Resend's mail servers to send on behalf of `everafter.wedding`. The `~all` (softfail) is appropriate during testing; move to `-all` (hardfail) once SPF is confirmed working.

### 13.2 DKIM (DomainKeys Identified Mail)

Resend generates a DKIM key pair. Add the public key as a TXT record:

```
Name:  resend._domainkey.everafter.wedding
Type:  TXT
Value: "v=DKIM1; k=rsa; p=[public-key-provided-by-resend]"
```

### 13.3 DMARC (Domain-based Message Authentication, Reporting & Conformance)

```
Name:  _dmarc.everafter.wedding
Type:  TXT
Value: "v=DMARC1; p=reject; rua=mailto:dmarc-reports@everafter.wedding; ruf=mailto:dmarc-forensics@everafter.wedding; fo=1; adkim=s; aspf=s; pct=100"
```

| Parameter | Value | Meaning |
|---|---|---|
| `p=reject` | Reject | Emails failing DMARC are rejected by recipient servers |
| `rua` | Aggregate report address | Receive daily reports on email authentication results |
| `ruf` | Forensic report address | Receive samples of failing messages |
| `adkim=s` | Strict DKIM alignment | DKIM domain must exactly match From domain |
| `aspf=s` | Strict SPF alignment | SPF domain must exactly match From domain |
| `pct=100` | 100% | Apply policy to all messages |

> [!TIP]
> Start with `p=none` (monitor only) for 2 weeks to review DMARC reports before moving to `p=quarantine` and then `p=reject`. This prevents legitimate email from being accidentally blocked.

### 13.4 Email Content Security

- Magic link emails must **not** include the full token in the subject line (some clients log subjects).
- Transactional emails must not include sensitive user data (guest lists, payment details) in the body.
- Emails must include an unsubscribe mechanism for non-transactional communications (GDPR/CAN-SPAM).
- Never log Resend API responses that may contain email content.

---

## 14. Logging and Monitoring Security

### 14.1 What to Log

The following events should be logged with sufficient context for investigation:

| Event | Log Level | Context to Include |
|---|---|---|
| User sign-in (magic link, OAuth) | INFO | `user_id`, `auth_method`, timestamp, country |
| Sign-out | INFO | `user_id`, timestamp |
| Failed auth attempt | WARN | Email (hashed), timestamp, IP, reason |
| Wedding created/deleted | INFO | `user_id`, `wedding_id`, timestamp |
| Planner added/removed | INFO | `actor_user_id`, `planner_user_id`, `wedding_id` |
| RSVP submitted | INFO | `wedding_id`, `attending`, timestamp (no guest PII) |
| File upload (success/failure) | INFO | `user_id`, `wedding_id`, file size, MIME type |
| Rate limit exceeded | WARN | Endpoint, IP (hashed), timestamp |
| Stripe webhook received | INFO | `event_type`, `event_id`, `customer_id` |
| Stripe webhook signature failure | ERROR | timestamp, IP, payload hash |
| API 4xx errors (spike) | WARN | Endpoint, count, time window |
| API 5xx errors | ERROR | Full error details (no PII) |
| RLS policy violation (if detectable) | ERROR | `user_id`, attempted `wedding_id` |

### 14.2 What NOT to Log

The following must **never** appear in logs:

- Plaintext passwords (not applicable — no passwords)
- Magic link tokens or full magic link URLs
- Session tokens or JWTs
- Stripe API keys or webhook secrets
- Full credit card numbers, CVVs, expiry dates
- Guest dietary requirements or medical information
- RSVP message content
- Full email addresses of guests (use hashed form for correlation if needed)
- Raw RSVP form submissions
- User-uploaded file contents
- Full IP addresses of guests in public-facing logs (store separately in `rsvp_responses.submitter_ip` for abuse investigation only)

### 14.3 Log Infrastructure

- **Vercel Log Drain** → forward to a centralised SIEM (e.g., Datadog, Logtail, or Axiom).
- **Supabase logs** → available in Supabase dashboard; enable log alerts for unusual query patterns.
- **Log retention:** Application logs retained 90 days. Security audit logs retained 1 year.
- **Access control:** Logs containing any PII must be accessible only to authorized engineering staff, not to all team members.

### 14.4 Monitoring Alerts

Configure alerts for:

- More than 10 Stripe webhook signature failures in 5 minutes → immediate Slack/PagerDuty alert
- More than 100 RSVP submissions to a single wedding in 1 hour → WARN alert
- More than 50 auth failures per 15 minutes → WARN alert
- Any 5xx error rate > 1% over 5 minutes → ERROR alert
- Supabase database CPU > 80% for 5 minutes → WARN alert
- Any query taking > 5 seconds → WARN alert (potential RLS policy bypass via timeout)

---

## 15. Dependency Security

### 15.1 Audit Strategy

| Action | When | Tool |
|---|---|---|
| `npm audit` | Every CI build | npm built-in |
| Full dependency review | Weekly automated PR | Dependabot or Renovate |
| Manual review of critical deps | Before each release | Manual + `npm audit --audit-level=high` |
| License compliance check | Quarterly | `license-checker` or `fossa` |
| SCA (Software Composition Analysis) | Quarterly | Snyk or Socket.dev |

### 15.2 CI Enforcement

```yaml
# .github/workflows/security.yml
- name: Audit dependencies
  run: npm audit --audit-level=high
  # Fails the build if any HIGH or CRITICAL vulnerabilities are found
```

**Policy:**
- `CRITICAL` vulnerabilities block deployment immediately.
- `HIGH` vulnerabilities must be resolved within 7 days.
- `MODERATE` vulnerabilities must be resolved within 30 days.
- `LOW` vulnerabilities are tracked and resolved at the next scheduled dependency update.

### 15.3 Critical Dependencies to Monitor

| Package | Risk | Why Critical |
|---|---|---|
| `@supabase/ssr` | High | All auth and database access |
| `@supabase/supabase-js` | High | All auth and database access |
| `stripe` | High | Payment processing |
| `next` | High | Framework — XSS, RCE if compromised |
| `zod` | Medium | Input validation |
| `@upstash/ratelimit` | Medium | Rate limiting |
| `resend` | Low-Medium | Email delivery |

### 15.4 Supply Chain Security

- Lock file (`package-lock.json`) must be committed and reviewed in PRs.
- Use `npm ci` in CI/CD (not `npm install`) to enforce lock file.
- Avoid `*` version ranges in `package.json`.
- Review new dependencies before adding: check the package's maintenance status, download count, and recent publish history. Be suspicious of packages published recently or by unknown authors.

---

## 16. Incident Response Plan

### 16.1 Severity Classification

| Severity | Definition | Initial Response Time |
|---|---|---|
| **P0 — Critical** | Active data breach, credentials exposed, payment fraud in progress | Immediate (< 15 minutes) |
| **P1 — High** | Suspected breach, privilege escalation confirmed, service down | < 1 hour |
| **P2 — Medium** | Security control bypass (rate limit, honeypot), suspicious activity | < 4 hours |
| **P3 — Low** | Vulnerability discovered (not exploited), dependency CVE | Next business day |

### 16.2 Response Procedures

#### Phase 1: Detect & Triage (0–15 minutes for P0)

1. Confirm the incident is real (not a false positive from monitoring).
2. Classify severity.
3. Page the on-call engineer and CTO via PagerDuty.
4. Open a private incident channel (#incident-YYYY-MM-DD) in Slack.
5. Designate an Incident Commander (IC) and a Communications Lead.

#### Phase 2: Contain (15 minutes – 2 hours for P0)

**If credentials are compromised:**
- Rotate affected keys immediately in Vercel, Supabase, and Stripe dashboards.
- Revoke all active user sessions via Supabase Admin API.
- If `SUPABASE_SERVICE_ROLE_KEY` is exposed: rotate key, audit all recent queries in Supabase logs.

**If tenant data is being accessed cross-tenant:**
- Put the affected endpoint into maintenance mode immediately.
- Review and patch the RLS policy.
- Audit access logs for the time window of the breach.

**If payment data is involved:**
- Contact Stripe immediately via their security channel.
- Stripe is responsible for card data; our responsibility is subscription metadata.

**If a malicious file was uploaded:**
- Move to quarantine bucket.
- Delete from public access.
- Notify the affected couple.

#### Phase 3: Investigate (Hours 2–24)

- Preserve logs before they rotate.
- Determine: what data was accessed, by whom, how, and for how long.
- Identify the root cause (which control failed).
- Determine scope of impact (how many users/weddings affected).

#### Phase 4: Notify

**Internal notification:**
- Engineering team notified as soon as the incident is confirmed.
- Leadership notified at P1 or higher within 30 minutes.

**User notification (if PII was breached):**
- GDPR requires notification to supervisory authority within **72 hours** of becoming aware of a breach.
- Affected users must be notified "without undue delay."
- Notification must include: what happened, what data was affected, what we've done, what users should do.
- Draft notification template must be approved by legal before sending.

#### Phase 5: Recover & Post-Mortem

- Deploy the fix with an expedited review process.
- Monitor closely for 48 hours post-fix.
- Conduct a blameless post-mortem within 5 business days.
- Post-mortem outputs: root cause, timeline, corrective actions with owners and due dates.
- Update this SECURITY.md and relevant runbooks.

### 16.3 Contact Directory

| Role | Name | Contact | Availability |
|---|---|---|---|
| Incident Commander | [CTO name] | [contact] | 24/7 for P0/P1 |
| Supabase Support | — | support@supabase.io / Supabase dashboard | Business hours |
| Stripe Security | — | security@stripe.com / Stripe dashboard | 24/7 |
| Vercel Support | — | Vercel dashboard (Enterprise support) | Business hours |
| Legal / DPO | [name] | [contact] | Business hours |
| Data Protection Authority | [country DPA] | [website] | GDPR notification |

---

## 17. Known Security Limitations at v1 Launch

The following security controls are **not** implemented at v1. Each is tracked as a backlog item with a severity rating.

| ID | Limitation | Severity | Mitigation in v1 | Target Version |
|---|---|---|---|---|
| L-01 | **No automated malware scanning** on file uploads | Medium | Files not executed server-side; magic bytes validation; Supabase Storage separate origin | v2 |
| L-02 | **No CAPTCHA** on RSVP form | Medium | Honeypot field + IP rate limiting | v1.5 |
| L-03 | **No inactivity session timeout** | Low | 1-hour JWT expiry; 7-day refresh token | v2 |
| L-04 | **No automated subdomain cleanup** on account deletion | Medium | Manual process documented in offboarding runbook | v1.5 |
| L-05 | **No RSVP duplicate detection** | Low | Manual review by couple | v2 |
| L-06 | **No WAF (Web Application Firewall)** | Low-Medium | Vercel edge rate limiting + input validation | v2 |
| L-07 | **No formal penetration test** has been conducted | Medium | Internal threat model + code review | Pre-v2 (3 months post-launch) |
| L-08 | **CSP uses `unsafe-inline`** for scripts | Medium | X-Frame-Options + CSP other directives limit impact | v1.5 (nonce-based CSP) |
| L-09 | **No SOC 2 compliance** | Low (for v1 B2C) | Supabase and Stripe are SOC 2 compliant; our controls documented here | v3 (enterprise tier) |
| L-10 | **Preview deployments share the production service role key** | High | Migrate preview to separate Supabase project | v1.5 |

> [!WARNING]
> L-10 (preview deployments using production service role key) is the highest priority v1 limitation. Until resolved, restrict preview deployments to trusted team members only and ensure no production data is used in test/preview branches.

---

## 18. Pre-Launch Security Checklist

Complete all items before the first production launch. Each item requires sign-off from a senior engineer.

### Authentication & Authorization
- [ ] Supabase magic link token expiry set to ≤ 1 hour
- [ ] Supabase refresh token rotation enabled
- [ ] Session cookies configured: `HttpOnly`, `Secure`, `SameSite=Lax`
- [ ] All dashboard routes protected by middleware auth check
- [ ] `couple_owner`, `couple_member`, `planner` roles implemented and tested
- [ ] RLS enabled on **every** table (run `SELECT tablename FROM pg_tables WHERE schemaname = 'public'` and verify each has `rowsecurity = true`)
- [ ] Cross-tenant isolation test passing for each table (see §5.1)
- [ ] Planner access scoped correctly to assigned weddings only
- [ ] No client-side role claims trusted by server

### Secrets & Configuration
- [ ] All secrets stored in Vercel environment variables with correct scoping
- [ ] No secrets committed to git (run `git log --all -p | grep -E "(key|secret|token)" | grep -v ".env.example"`)
- [ ] `.env.local` is in `.gitignore`
- [ ] `.env.example` contains all required keys with no values
- [ ] `SUPABASE_SERVICE_ROLE_KEY` has no `NEXT_PUBLIC_` prefix
- [ ] `import 'server-only'` added to all files importing server secrets
- [ ] Preview deployments isolated from production Supabase project (or L-10 documented as accepted risk)

### API & Input Validation
- [ ] Zod schemas applied to all API route inputs and Server Actions
- [ ] RSVP `wedding_id` resolved from slug server-side (not from client body)
- [ ] Honeypot field implemented on RSVP form
- [ ] Rate limiting active on RSVP endpoint (10/hour/IP)
- [ ] Rate limiting active on magic link endpoint (5/15min/email)
- [ ] Stripe webhook signature verification implemented and tested
- [ ] Stripe webhook idempotency implemented

### File Uploads
- [ ] MIME type allow-list enforced server-side
- [ ] Magic bytes validation implemented
- [ ] Per-file size limit: 25 MB
- [ ] Storage quota enforcement per plan
- [ ] Supabase Storage bucket set to `public = false`
- [ ] Storage RLS policies applied (own-wedding-only access)

### Security Headers
- [ ] `Strict-Transport-Security` header present
- [ ] `X-Frame-Options: DENY` present
- [ ] `X-Content-Type-Options: nosniff` present
- [ ] `Content-Security-Policy` configured and tested (no CSP errors in browser console on all pages)
- [ ] `Referrer-Policy` configured
- [ ] `Permissions-Policy` configured
- [ ] Headers verified at [securityheaders.com](https://securityheaders.com) — minimum grade A

### Email
- [ ] SPF record published for `everafter.wedding`
- [ ] DKIM record published and verified via Resend
- [ ] DMARC record published (start with `p=none`, escalate to `p=reject` after 2 weeks)
- [ ] Magic link email does not include token in subject line
- [ ] Unsubscribe link present in all non-transactional emails

### Payments
- [ ] Stripe Elements (not custom card form) used for card input
- [ ] No card data stored in EverAfter database
- [ ] Stripe restricted API keys used where possible
- [ ] Separate Stripe accounts for dev and production
- [ ] Stripe Radar rules enabled

### Monitoring
- [ ] Vercel log drain configured to SIEM
- [ ] Alerts configured for Stripe webhook signature failures
- [ ] Alerts configured for error rate spikes
- [ ] Auth failure monitoring enabled
- [ ] RSVP flood monitoring configured

### Dependency & Code
- [ ] `npm audit --audit-level=high` passing (zero HIGH/CRITICAL)
- [ ] Dependabot alerts enabled on GitHub repository
- [ ] `npm ci` used in CI/CD (not `npm install`)
- [ ] GitHub secret scanning enabled with push protection
- [ ] Code review required for all PRs to main branch (no self-merge)

### Supabase Hardening
- [ ] Database password is strong and stored only in Supabase dashboard
- [ ] Direct database access (port 5432) restricted to Supabase internal only
- [ ] Supabase API keys rotated from defaults
- [ ] `public` schema permissions reviewed (revoke public access where not needed)
- [ ] Database backups enabled (Point-in-Time Recovery)

### Known Limitations
- [ ] All v1 known limitations documented in §17
- [ ] L-10 (preview key isolation) accepted and documented or resolved
- [ ] Penetration test scheduled within 90 days of launch

---

*Last reviewed: September 2026 | Next review: December 2026*  
*Document owner: Website CTO*  
*All security concerns should be reported to: security@everafter.wedding*
