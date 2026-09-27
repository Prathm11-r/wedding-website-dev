# EverAfter — Database Design Reference

> **Stack:** Supabase (PostgreSQL 15+) · Row-Level Security · Next.js 14 App Router  
> **Last Updated:** 2026-09-27  
> **Status:** v1.0 — Initial Schema

---

## Table of Contents

1. [Design Principles](#1-design-principles)
2. [Multi-Tenancy Model](#2-multi-tenancy-model)
3. [Complete Schema](#3-complete-schema)
   - [users](#31-users)
   - [profiles](#32-profiles)
   - [plans](#33-plans)
   - [subscriptions](#34-subscriptions)
   - [weddings](#35-weddings)
   - [wedding_members](#36-wedding_members)
   - [guests](#37-guests)
   - [rsvps](#38-rsvps)
   - [tables](#39-tables-seating)
   - [seats](#310-seats)
   - [registry_items](#311-registry_items)
   - [photos](#312-photos)
   - [timeline_events](#313-timeline_events)
   - [custom_domains](#314-custom_domains)
4. [Entity-Relationship Overview](#4-entity-relationship-overview)
5. [Row-Level Security Policies](#5-row-level-security-policies)
6. [Key Indexes](#6-key-indexes)
7. [Supabase-Specific Considerations](#7-supabase-specific-considerations)
8. [Migration Strategy](#8-migration-strategy)
9. [Seed Data Strategy](#9-seed-data-strategy)
10. [Data Retention & Deletion Policy](#10-data-retention--deletion-policy)
11. [Performance Considerations](#11-performance-considerations)

---

## 1. Design Principles

### 1.1 Core Tenets

| Principle | Applied As |
|-----------|-----------|
| **Tenant Isolation** | Every data table carries a `wedding_id` foreign key; RLS policies enforce per-tenant access at the DB layer. |
| **Supabase-first Auth** | We never store passwords. All identity lives in `auth.users`; our `profiles` table extends it. |
| **Soft-delete by default** | Sensitive records use `deleted_at TIMESTAMPTZ` instead of hard deletes, enabling audit trails and GDPR right-to-erasure workflows. |
| **UUID primary keys** | All PKs are `UUID DEFAULT gen_random_uuid()` to avoid enumeration attacks and support distributed generation. |
| **Immutable audit columns** | Every table has `created_at` and `updated_at`; `updated_at` is maintained by a shared trigger. |
| **Normalised first** | Denormalisation is applied only where measured query patterns justify it (e.g., `rsvps.guest_name` cached for read performance). |
| **Least-privilege RLS** | Tables default to `no access`; policies explicitly grant only the minimum required permissions per role. |

### 1.2 PostgreSQL Extensions Used

```sql
-- Enabled in Supabase dashboard or via migration
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";      -- UUID generation fallback
CREATE EXTENSION IF NOT EXISTS "pgcrypto";       -- gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "citext";         -- Case-insensitive text (emails, domains)
CREATE EXTENSION IF NOT EXISTS "pg_trgm";        -- Trigram indexes for guest name search
```

### 1.3 Schema Namespace

All application tables live in the `public` schema. Supabase's `auth` and `storage` schemas remain untouched (only referenced via FK to `auth.users.id`).

---

## 2. Multi-Tenancy Model

EverAfter uses **row-level multi-tenancy** (also called _shared schema, shared table_). All tenants share the same PostgreSQL tables; data is segregated by a `wedding_id` column backed by RLS policies.

```
auth.users  ──────────────► profiles
                                │
                                ▼
                            weddings  ◄──── subscriptions
                                │               │
                    ┌───────────┼───────────┐   │
                    │           │           │   │
              wedding_members  guests  timeline_events
                                │
                        ┌───────┴────────┐
                        │                │
                       rsvps          photos
                        
            tables ──► seats
            registry_items
            custom_domains
```

### Why Row-Level (Not Schema-Per-Tenant)?

| Factor | Row-Level | Schema-Per-Tenant |
|--------|-----------|-------------------|
| **Scalability** | ✅ Unlimited tenants, single connection pool | ⚠️ Schema explosion at scale |
| **Migration cost** | ✅ One migration for all | ❌ Must run per schema |
| **Cross-tenant queries** | ✅ Possible for admins | ❌ Requires UNION across schemas |
| **Data isolation risk** | ⚠️ Requires rigorous RLS | ✅ OS-level isolation |
| **Supabase native** | ✅ First-class support | ❌ Not supported by Supabase UI |

For a SaaS at EverAfter's scale, row-level is the correct choice. RLS mitigates the isolation risk.

### Tenant Identifier Flow

```
User logs in → auth.users.id → profiles.id → wedding_members.user_id
                                                       │
                                               wedding_members.wedding_id
                                                       │
                                               Used by all RLS policies
```

---

## 3. Complete Schema

### 3.1 `users`

> **Not a physical table.** This refers to `auth.users` — the Supabase-managed identity table. We never write to it directly. All application user data is stored in `profiles`.

Relevant columns from `auth.users` (read-only reference):

| Column | Type | Notes |
|--------|------|-------|
| `id` | `UUID` | Referenced as FK in `profiles.id` |
| `email` | `TEXT` | Managed by Supabase Auth |
| `created_at` | `TIMESTAMPTZ` | Account creation time |
| `last_sign_in_at` | `TIMESTAMPTZ` | Last login |

---

### 3.2 `profiles`

Extends `auth.users` with application-level user data. One row per authenticated user.

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| `id` | `UUID` | PK, FK → `auth.users(id)` ON DELETE CASCADE | — | Matches Supabase auth user ID |
| `display_name` | `TEXT` | NOT NULL | — | User's preferred display name |
| `avatar_url` | `TEXT` | — | `NULL` | URL to Supabase Storage avatar |
| `locale` | `VARCHAR(10)` | — | `'en'` | BCP-47 locale tag (e.g., `en`, `fr`, `pt-BR`) |
| `timezone` | `TEXT` | — | `'UTC'` | IANA timezone string |
| `marketing_opt_in` | `BOOLEAN` | NOT NULL | `FALSE` | Email marketing consent |
| `created_at` | `TIMESTAMPTZ` | NOT NULL | `NOW()` | Profile creation time |
| `updated_at` | `TIMESTAMPTZ` | NOT NULL | `NOW()` | Last update (trigger-maintained) |

**Primary Key:** `id`  
**Foreign Keys:** `id → auth.users(id) ON DELETE CASCADE`  
**Indexes:** PK index on `id` (implicit)

**Trigger:** `handle_new_user` — fires `AFTER INSERT ON auth.users` to auto-create a `profiles` row.

---

### 3.3 `plans`

Defines available subscription tiers. Seeded at deploy time; rarely mutated.

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| `id` | `UUID` | PK | `gen_random_uuid()` | Plan identifier |
| `name` | `TEXT` | NOT NULL, UNIQUE | — | e.g., `Free`, `Essential`, `Premium` |
| `stripe_price_id` | `TEXT` | UNIQUE | `NULL` | Stripe Price ID for recurring billing |
| `price_monthly_usd` | `NUMERIC(10,2)` | NOT NULL | `0.00` | Display price in USD |
| `max_guests` | `INTEGER` | NOT NULL | `50` | Guest list cap for this plan |
| `max_photos` | `INTEGER` | NOT NULL | `20` | Photo gallery cap |
| `custom_domain` | `BOOLEAN` | NOT NULL | `FALSE` | Whether plan allows custom domain |
| `remove_branding` | `BOOLEAN` | NOT NULL | `FALSE` | Removes EverAfter branding |
| `features` | `JSONB` | — | `'{}'` | Additional feature flags as JSON |
| `is_active` | `BOOLEAN` | NOT NULL | `TRUE` | Whether plan is currently on sale |
| `created_at` | `TIMESTAMPTZ` | NOT NULL | `NOW()` | — |
| `updated_at` | `TIMESTAMPTZ` | NOT NULL | `NOW()` | — |

**Primary Key:** `id`  
**Indexes:** `UNIQUE (name)`, `UNIQUE (stripe_price_id)`

---

### 3.4 `subscriptions`

Tracks billing state per wedding. One active subscription per wedding at any time.

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| `id` | `UUID` | PK | `gen_random_uuid()` | Subscription record ID |
| `wedding_id` | `UUID` | NOT NULL, FK → `weddings(id)` ON DELETE CASCADE | — | Tenant the subscription belongs to |
| `plan_id` | `UUID` | NOT NULL, FK → `plans(id)` | — | Current plan |
| `stripe_customer_id` | `TEXT` | — | `NULL` | Stripe Customer object ID |
| `stripe_subscription_id` | `TEXT` | UNIQUE | `NULL` | Stripe Subscription object ID |
| `status` | `TEXT` | NOT NULL | `'active'` | `active`, `trialing`, `past_due`, `canceled`, `unpaid` |
| `current_period_start` | `TIMESTAMPTZ` | — | `NULL` | Billing period start |
| `current_period_end` | `TIMESTAMPTZ` | — | `NULL` | Billing period end (renewal date) |
| `cancel_at_period_end` | `BOOLEAN` | NOT NULL | `FALSE` | Scheduled cancellation flag |
| `canceled_at` | `TIMESTAMPTZ` | — | `NULL` | When subscription was cancelled |
| `trial_end` | `TIMESTAMPTZ` | — | `NULL` | Trial expiry timestamp |
| `metadata` | `JSONB` | — | `'{}'` | Arbitrary Stripe metadata mirror |
| `created_at` | `TIMESTAMPTZ` | NOT NULL | `NOW()` | — |
| `updated_at` | `TIMESTAMPTZ` | NOT NULL | `NOW()` | — |

**Primary Key:** `id`  
**Foreign Keys:** `wedding_id → weddings(id)`, `plan_id → plans(id)`  
**Indexes:** `(wedding_id)`, `(stripe_subscription_id)`, `(status)`

> [!NOTE]
> Subscription state is the authoritative source of truth in PostgreSQL, synced via Stripe webhooks. Never derive access control from Stripe API calls at request time — always query this table.

---

### 3.5 `weddings`

The central tenant record. One row per couple/wedding.

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| `id` | `UUID` | PK | `gen_random_uuid()` | Tenant / wedding ID |
| `slug` | `CITEXT` | NOT NULL, UNIQUE | — | URL-safe identifier: `example.everafter.app/[slug]` |
| `title` | `TEXT` | NOT NULL | — | Wedding display title (e.g., "Emma & James") |
| `partner_one_name` | `TEXT` | NOT NULL | — | First partner's name |
| `partner_two_name` | `TEXT` | NOT NULL | — | Second partner's name |
| `wedding_date` | `DATE` | — | `NULL` | The wedding day |
| `ceremony_time` | `TIME` | — | `NULL` | Ceremony start time (local) |
| `timezone` | `TEXT` | NOT NULL | `'UTC'` | IANA timezone for the wedding location |
| `venue_name` | `TEXT` | — | `NULL` | Venue display name |
| `venue_address` | `TEXT` | — | `NULL` | Full venue address |
| `venue_lat` | `NUMERIC(9,6)` | — | `NULL` | Venue latitude (for map embed) |
| `venue_lng` | `NUMERIC(9,6)` | — | `NULL` | Venue longitude |
| `cover_photo_url` | `TEXT` | — | `NULL` | Hero image URL (Supabase Storage) |
| `theme` | `JSONB` | — | `'{}'` | Design theme config (colors, fonts, layout) |
| `website_published` | `BOOLEAN` | NOT NULL | `FALSE` | Whether public wedding site is live |
| `rsvp_enabled` | `BOOLEAN` | NOT NULL | `TRUE` | Whether RSVP form is accepting responses |
| `rsvp_deadline` | `DATE` | — | `NULL` | Last date guests can RSVP |
| `welcome_message` | `TEXT` | — | `NULL` | Hero welcome text |
| `dress_code` | `TEXT` | — | `NULL` | Dress code instructions |
| `hashtag` | `TEXT` | — | `NULL` | Social media hashtag |
| `language` | `VARCHAR(10)` | NOT NULL | `'en'` | Primary site language (BCP-47) |
| `deleted_at` | `TIMESTAMPTZ` | — | `NULL` | Soft-delete timestamp |
| `created_at` | `TIMESTAMPTZ` | NOT NULL | `NOW()` | — |
| `updated_at` | `TIMESTAMPTZ` | NOT NULL | `NOW()` | — |

**Primary Key:** `id`  
**Indexes:** `UNIQUE (slug)`, `(deleted_at)`, `(wedding_date)`

> [!TIP]
> `theme` as JSONB gives couples unlimited theming flexibility without schema changes. The application layer validates the shape against a Zod schema before writes.

---

### 3.6 `wedding_members`

Junction table linking users to weddings with a role. Handles both the couple themselves and assigned wedding planners.

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| `id` | `UUID` | PK | `gen_random_uuid()` | Member record ID |
| `wedding_id` | `UUID` | NOT NULL, FK → `weddings(id)` ON DELETE CASCADE | — | The wedding |
| `user_id` | `UUID` | NOT NULL, FK → `auth.users(id)` ON DELETE CASCADE | — | The user |
| `role` | `TEXT` | NOT NULL | `'partner'` | `partner` · `planner` · `admin` (internal) |
| `invited_by` | `UUID` | FK → `auth.users(id)` | `NULL` | Who sent the invitation |
| `accepted_at` | `TIMESTAMPTZ` | — | `NULL` | When invitation was accepted |
| `created_at` | `TIMESTAMPTZ` | NOT NULL | `NOW()` | — |
| `updated_at` | `TIMESTAMPTZ` | NOT NULL | `NOW()` | — |

**Primary Key:** `id`  
**Foreign Keys:** `wedding_id → weddings(id)`, `user_id → auth.users(id)`, `invited_by → auth.users(id)`  
**Unique Constraint:** `(wedding_id, user_id)` — one membership row per user per wedding  
**Indexes:** `(wedding_id)`, `(user_id)`, `(role)`

**Roles Defined:**

| Role | Description |
|------|-------------|
| `partner` | One of the two people getting married. Full read-write over their wedding. |
| `planner` | Assigned wedding planner. Read-write over operational data (guests, timeline). Cannot change billing or delete the wedding. |
| `admin` | Internal EverAfter staff. Used only via service-role key, never exposed to RLS policies directly. |

---

### 3.7 `guests`

The wedding guest list. Each row is one guest (or a guest group lead).

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| `id` | `UUID` | PK | `gen_random_uuid()` | Guest ID |
| `wedding_id` | `UUID` | NOT NULL, FK → `weddings(id)` ON DELETE CASCADE | — | Tenant |
| `first_name` | `TEXT` | NOT NULL | — | Guest first name |
| `last_name` | `TEXT` | — | `NULL` | Guest last name |
| `email` | `CITEXT` | — | `NULL` | Guest email (for RSVP invitations) |
| `phone` | `TEXT` | — | `NULL` | Guest phone (E.164 format) |
| `group_label` | `TEXT` | — | `NULL` | e.g., "Bride's Side", "Groom's Family" |
| `plus_one_allowed` | `BOOLEAN` | NOT NULL | `FALSE` | Whether guest can bring a +1 |
| `dietary_notes` | `TEXT` | — | `NULL` | Pre-entered dietary information |
| `notes` | `TEXT` | — | `NULL` | Internal couple notes about this guest |
| `invitation_sent_at` | `TIMESTAMPTZ` | — | `NULL` | When RSVP invitation email was sent |
| `deleted_at` | `TIMESTAMPTZ` | — | `NULL` | Soft-delete |
| `created_at` | `TIMESTAMPTZ` | NOT NULL | `NOW()` | — |
| `updated_at` | `TIMESTAMPTZ` | NOT NULL | `NOW()` | — |

**Primary Key:** `id`  
**Foreign Keys:** `wedding_id → weddings(id) ON DELETE CASCADE`  
**Indexes:** `(wedding_id)`, `(wedding_id, email)`, `GIN index on (first_name, last_name) via pg_trgm` for search, `(deleted_at)`

---

### 3.8 `rsvps`

RSVP responses submitted by guests. One row per guest per RSVP submission (allows re-submission; latest wins).

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| `id` | `UUID` | PK | `gen_random_uuid()` | RSVP record ID |
| `wedding_id` | `UUID` | NOT NULL, FK → `weddings(id)` ON DELETE CASCADE | — | Tenant |
| `guest_id` | `UUID` | NOT NULL, FK → `guests(id)` ON DELETE CASCADE | — | The responding guest |
| `response` | `TEXT` | NOT NULL | — | `attending` · `declined` · `maybe` |
| `plus_one_attending` | `BOOLEAN` | — | `NULL` | Whether the +1 is also coming |
| `plus_one_name` | `TEXT` | — | `NULL` | +1's name (if attending) |
| `dietary_restrictions` | `TEXT` | — | `NULL` | Dietary info from this RSVP |
| `meal_choice` | `TEXT` | — | `NULL` | Selected meal option (if applicable) |
| `message` | `TEXT` | — | `NULL` | Personal message from guest to couple |
| `submitted_at` | `TIMESTAMPTZ` | NOT NULL | `NOW()` | When RSVP was submitted |
| `ip_address` | `INET` | — | `NULL` | For spam/abuse tracking (anonymised after 30 days) |
| `created_at` | `TIMESTAMPTZ` | NOT NULL | `NOW()` | — |
| `updated_at` | `TIMESTAMPTZ` | NOT NULL | `NOW()` | — |

**Primary Key:** `id`  
**Foreign Keys:** `wedding_id → weddings(id)`, `guest_id → guests(id) ON DELETE CASCADE`  
**Unique Constraint:** `(guest_id)` — enforces one active RSVP per guest (use UPSERT on conflict)  
**Indexes:** `(wedding_id)`, `(guest_id)`, `(response)`, `(wedding_id, response)` for dashboard aggregates

---

### 3.9 `tables` (Seating)

Represents physical tables at the reception venue.

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| `id` | `UUID` | PK | `gen_random_uuid()` | Table ID |
| `wedding_id` | `UUID` | NOT NULL, FK → `weddings(id)` ON DELETE CASCADE | — | Tenant |
| `name` | `TEXT` | NOT NULL | — | Table name/number (e.g., "Table 1", "Head Table") |
| `capacity` | `INTEGER` | NOT NULL | `8` | Maximum number of seats |
| `shape` | `TEXT` | — | `'round'` | `round` · `rectangular` · `oval` |
| `position_x` | `NUMERIC(8,2)` | — | `0` | X position on drag-drop canvas |
| `position_y` | `NUMERIC(8,2)` | — | `0` | Y position on drag-drop canvas |
| `notes` | `TEXT` | — | `NULL` | e.g., "Near the dance floor" |
| `created_at` | `TIMESTAMPTZ` | NOT NULL | `NOW()` | — |
| `updated_at` | `TIMESTAMPTZ` | NOT NULL | `NOW()` | — |

**Primary Key:** `id`  
**Foreign Keys:** `wedding_id → weddings(id) ON DELETE CASCADE`  
**Indexes:** `(wedding_id)`

---

### 3.10 `seats`

Assigns a guest to a specific seat at a specific table.

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| `id` | `UUID` | PK | `gen_random_uuid()` | Seat assignment ID |
| `wedding_id` | `UUID` | NOT NULL, FK → `weddings(id)` ON DELETE CASCADE | — | Tenant (denormalised for RLS) |
| `table_id` | `UUID` | NOT NULL, FK → `tables(id)` ON DELETE CASCADE | — | The table |
| `guest_id` | `UUID` | NOT NULL, FK → `guests(id)` ON DELETE CASCADE | — | The assigned guest |
| `seat_number` | `INTEGER` | — | `NULL` | Optional seat number within the table |
| `created_at` | `TIMESTAMPTZ` | NOT NULL | `NOW()` | — |
| `updated_at` | `TIMESTAMPTZ` | NOT NULL | `NOW()` | — |

**Primary Key:** `id`  
**Foreign Keys:** `wedding_id → weddings(id)`, `table_id → tables(id)`, `guest_id → guests(id)`  
**Unique Constraints:** `(guest_id)` — one guest can only be assigned once; `(table_id, seat_number)` WHERE `seat_number IS NOT NULL`  
**Indexes:** `(wedding_id)`, `(table_id)`, `(guest_id)`

---

### 3.11 `registry_items`

Wedding registry entries: external links and/or custom items.

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| `id` | `UUID` | PK | `gen_random_uuid()` | Registry item ID |
| `wedding_id` | `UUID` | NOT NULL, FK → `weddings(id)` ON DELETE CASCADE | — | Tenant |
| `title` | `TEXT` | NOT NULL | — | Item name |
| `description` | `TEXT` | — | `NULL` | Item description |
| `url` | `TEXT` | — | `NULL` | External link (e.g., Amazon wishlist item) |
| `retailer` | `TEXT` | — | `NULL` | Retailer name (e.g., "John Lewis") |
| `price` | `NUMERIC(10,2)` | — | `NULL` | Item price |
| `currency` | `VARCHAR(3)` | — | `'USD'` | ISO 4217 currency code |
| `image_url` | `TEXT` | — | `NULL` | Product image URL |
| `quantity_desired` | `INTEGER` | — | `NULL` | How many are wanted |
| `quantity_purchased` | `INTEGER` | NOT NULL | `0` | How many have been bought (couple-tracked) |
| `is_purchased` | `BOOLEAN` | NOT NULL | `FALSE` | Manually marked as fulfilled |
| `sort_order` | `INTEGER` | NOT NULL | `0` | Display ordering |
| `created_at` | `TIMESTAMPTZ` | NOT NULL | `NOW()` | — |
| `updated_at` | `TIMESTAMPTZ` | NOT NULL | `NOW()` | — |

**Primary Key:** `id`  
**Foreign Keys:** `wedding_id → weddings(id) ON DELETE CASCADE`  
**Indexes:** `(wedding_id)`, `(wedding_id, sort_order)`

---

### 3.12 `photos`

Photo gallery entries. Actual image files live in Supabase Storage; this table holds metadata and references.

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| `id` | `UUID` | PK | `gen_random_uuid()` | Photo record ID |
| `wedding_id` | `UUID` | NOT NULL, FK → `weddings(id)` ON DELETE CASCADE | — | Tenant |
| `uploaded_by` | `UUID` | FK → `auth.users(id)` ON DELETE SET NULL | `NULL` | Who uploaded (couple, planner, or NULL if guest) |
| `storage_path` | `TEXT` | NOT NULL | — | Supabase Storage object path: `photos/{wedding_id}/{filename}` |
| `storage_bucket` | `TEXT` | NOT NULL | `'wedding-photos'` | Storage bucket name |
| `filename` | `TEXT` | NOT NULL | — | Original filename |
| `mime_type` | `TEXT` | NOT NULL | `'image/jpeg'` | e.g., `image/png`, `image/webp` |
| `size_bytes` | `BIGINT` | NOT NULL | `0` | File size |
| `width` | `INTEGER` | — | `NULL` | Image width in pixels |
| `height` | `INTEGER` | — | `NULL` | Image height in pixels |
| `caption` | `TEXT` | — | `NULL` | Guest/couple caption |
| `alt_text` | `TEXT` | — | `NULL` | Accessibility alt text |
| `is_cover` | `BOOLEAN` | NOT NULL | `FALSE` | Marks the wedding cover/hero photo |
| `is_approved` | `BOOLEAN` | NOT NULL | `TRUE` | Moderation flag (guest uploads default to FALSE) |
| `sort_order` | `INTEGER` | NOT NULL | `0` | Gallery display order |
| `taken_at` | `TIMESTAMPTZ` | — | `NULL` | EXIF capture timestamp |
| `deleted_at` | `TIMESTAMPTZ` | — | `NULL` | Soft-delete |
| `created_at` | `TIMESTAMPTZ` | NOT NULL | `NOW()` | — |
| `updated_at` | `TIMESTAMPTZ` | NOT NULL | `NOW()` | — |

**Primary Key:** `id`  
**Foreign Keys:** `wedding_id → weddings(id)`, `uploaded_by → auth.users(id)`  
**Indexes:** `(wedding_id)`, `(wedding_id, is_approved)`, `(wedding_id, sort_order)`, `(deleted_at)`

> [!IMPORTANT]
> When deleting a photo record, also delete the corresponding Supabase Storage object. This is handled via a database trigger that calls a Supabase Edge Function, or via application-layer cleanup in the same transaction.

---

### 3.13 `timeline_events`

Wedding day schedule / itinerary items.

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| `id` | `UUID` | PK | `gen_random_uuid()` | Event ID |
| `wedding_id` | `UUID` | NOT NULL, FK → `weddings(id)` ON DELETE CASCADE | — | Tenant |
| `title` | `TEXT` | NOT NULL | — | Event name (e.g., "Ceremony Begins") |
| `description` | `TEXT` | — | `NULL` | Event details |
| `start_time` | `TIME` | NOT NULL | — | Event start time (local to wedding timezone) |
| `end_time` | `TIME` | — | `NULL` | Event end time |
| `location` | `TEXT` | — | `NULL` | Specific location if different from main venue |
| `icon` | `TEXT` | — | `NULL` | Icon identifier for UI display |
| `is_public` | `BOOLEAN` | NOT NULL | `TRUE` | Whether visible to guests on public site |
| `sort_order` | `INTEGER` | NOT NULL | `0` | Display order |
| `created_at` | `TIMESTAMPTZ` | NOT NULL | `NOW()` | — |
| `updated_at` | `TIMESTAMPTZ` | NOT NULL | `NOW()` | — |

**Primary Key:** `id`  
**Foreign Keys:** `wedding_id → weddings(id) ON DELETE CASCADE`  
**Indexes:** `(wedding_id)`, `(wedding_id, sort_order)`

---

### 3.14 `custom_domains`

Maps a custom domain name to a wedding. Only available on paid plans.

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| `id` | `UUID` | PK | `gen_random_uuid()` | Domain record ID |
| `wedding_id` | `UUID` | NOT NULL, UNIQUE, FK → `weddings(id)` ON DELETE CASCADE | — | One domain per wedding |
| `domain` | `CITEXT` | NOT NULL, UNIQUE | — | Full domain name (e.g., `emma-and-james.com`) |
| `status` | `TEXT` | NOT NULL | `'pending'` | `pending` · `verifying` · `active` · `failed` |
| `verification_token` | `TEXT` | — | `NULL` | DNS TXT record value for domain verification |
| `verified_at` | `TIMESTAMPTZ` | — | `NULL` | When domain was successfully verified |
| `ssl_provisioned_at` | `TIMESTAMPTZ` | — | `NULL` | When SSL certificate was issued |
| `last_checked_at` | `TIMESTAMPTZ` | — | `NULL` | Last DNS verification check |
| `created_at` | `TIMESTAMPTZ` | NOT NULL | `NOW()` | — |
| `updated_at` | `TIMESTAMPTZ` | NOT NULL | `NOW()` | — |

**Primary Key:** `id`  
**Foreign Keys:** `wedding_id → weddings(id) ON DELETE CASCADE`  
**Indexes:** `UNIQUE (domain)`, `UNIQUE (wedding_id)`, `(status)`

---

## 4. Entity-Relationship Overview

```
auth.users (Supabase managed)
    │ id
    │
    ▼ 1
profiles (1:1)
    │ id
    │
    └──────────────────────────────────────┐
                                           │ user_id (via wedding_members)
                                           ▼ N
                              wedding_members ──────────► weddings (1:N for members)
                                                              │ id
                                                              │
                              ┌───────────────────────────────┼──────────────────────┐
                              │               │               │          │            │
                              ▼               ▼               ▼          ▼            ▼
                          guests      timeline_events     photos    registry_items  custom_domains
                              │
                    ┌─────────┴─────────┐
                    │                   │
                    ▼                   ▼
                  rsvps              seats ──────► tables
                                                    (wedding_id)

                              weddings ──────► subscriptions ──────► plans

Legend:
  1:1  = one-to-one
  1:N  = one-to-many  
  M:N  = many-to-many (via junction table)
  wedding_members = M:N junction between auth.users and weddings
```

### Cardinality Summary

| Relationship | Type | Notes |
|-------------|------|-------|
| `auth.users` → `profiles` | 1:1 | Enforced by PK equality |
| `auth.users` → `weddings` | M:N | Via `wedding_members` |
| `weddings` → `guests` | 1:N | — |
| `weddings` → `timeline_events` | 1:N | — |
| `weddings` → `photos` | 1:N | — |
| `weddings` → `registry_items` | 1:N | — |
| `weddings` → `subscriptions` | 1:N | Only 1 active at a time |
| `weddings` → `custom_domains` | 1:1 | UNIQUE constraint on `wedding_id` |
| `weddings` → `tables` | 1:N | — |
| `guests` → `rsvps` | 1:1 | UNIQUE on `guest_id`; upsert pattern |
| `guests` → `seats` | 1:1 | UNIQUE on `guest_id` |
| `tables` → `seats` | 1:N | Capped by `tables.capacity` |
| `plans` → `subscriptions` | 1:N | — |

---

## 5. Row-Level Security Policies

> [!IMPORTANT]
> All tables have RLS **enabled**. The default stance is **deny all**. Each policy below is explicitly permissive.

### Policy Naming Convention

```
<table>_<operation>_<actor>
-- Examples:
-- weddings_select_member
-- guests_insert_partner
-- photos_delete_owner
```

### Helper Functions

```sql
-- Returns the authenticated user's ID (shorthand for auth.uid())
CREATE OR REPLACE FUNCTION current_user_id()
RETURNS UUID LANGUAGE sql STABLE AS $$
  SELECT auth.uid();
$$;

-- Returns all wedding_ids the current user is a member of
CREATE OR REPLACE FUNCTION my_wedding_ids()
RETURNS SETOF UUID LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT wedding_id FROM wedding_members WHERE user_id = auth.uid();
$$;

-- Returns TRUE if the current user has a specific role in a wedding
CREATE OR REPLACE FUNCTION has_wedding_role(p_wedding_id UUID, p_roles TEXT[])
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM wedding_members
    WHERE wedding_id = p_wedding_id
      AND user_id = auth.uid()
      AND role = ANY(p_roles)
  );
$$;
```

### 5.1 `profiles` RLS

```sql
-- Users can read and update their own profile only
CREATE POLICY profiles_select_own ON profiles FOR SELECT
  USING (id = auth.uid());

CREATE POLICY profiles_update_own ON profiles FOR UPDATE
  USING (id = auth.uid()) WITH CHECK (id = auth.uid());
```

### 5.2 `weddings` RLS

```sql
-- Members can view their wedding(s); excludes soft-deleted records
CREATE POLICY weddings_select_member ON weddings FOR SELECT
  USING (id IN (SELECT my_wedding_ids()) AND deleted_at IS NULL);

-- Partners can update wedding settings
CREATE POLICY weddings_update_partner ON weddings FOR UPDATE
  USING (has_wedding_role(id, ARRAY['partner']))
  WITH CHECK (has_wedding_role(id, ARRAY['partner']));

-- Any authenticated user can create a wedding (becomes a partner via trigger)
CREATE POLICY weddings_insert_authenticated ON weddings FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Only partners can soft-delete (set deleted_at); enforced at app layer
CREATE POLICY weddings_delete_partner ON weddings FOR UPDATE
  USING (has_wedding_role(id, ARRAY['partner']));
```

### 5.3 `wedding_members` RLS

```sql
-- Members can see who else is in their wedding
CREATE POLICY wedding_members_select_member ON wedding_members FOR SELECT
  USING (wedding_id IN (SELECT my_wedding_ids()));

-- Partners can invite others (insert new members)
CREATE POLICY wedding_members_insert_partner ON wedding_members FOR INSERT
  WITH CHECK (has_wedding_role(wedding_id, ARRAY['partner']));

-- Partners can remove members (but not themselves — enforced at app layer)
CREATE POLICY wedding_members_delete_partner ON wedding_members FOR DELETE
  USING (has_wedding_role(wedding_id, ARRAY['partner']));
```

### 5.4 `guests` RLS

```sql
-- Partners and planners can view guests
CREATE POLICY guests_select_member ON guests FOR SELECT
  USING (wedding_id IN (SELECT my_wedding_ids()) AND deleted_at IS NULL);

-- Partners and planners can add guests
CREATE POLICY guests_insert_member ON guests FOR INSERT
  WITH CHECK (has_wedding_role(wedding_id, ARRAY['partner', 'planner']));

-- Partners and planners can update guests
CREATE POLICY guests_update_member ON guests FOR UPDATE
  USING (has_wedding_role(wedding_id, ARRAY['partner', 'planner']))
  WITH CHECK (has_wedding_role(wedding_id, ARRAY['partner', 'planner']));

-- Only partners can soft-delete guests
CREATE POLICY guests_delete_partner ON guests FOR UPDATE
  USING (has_wedding_role(wedding_id, ARRAY['partner']));
```

### 5.5 `rsvps` RLS

```sql
-- Members can view RSVPs for their wedding
CREATE POLICY rsvps_select_member ON rsvps FOR SELECT
  USING (wedding_id IN (SELECT my_wedding_ids()));

-- Anyone (including unauthenticated guests) can submit an RSVP
-- Security: application layer validates the guest_id belongs to this wedding
--           and that RSVP is still open (rsvp_enabled + rsvp_deadline)
CREATE POLICY rsvps_insert_public ON rsvps FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM weddings w
      WHERE w.id = wedding_id
        AND w.rsvp_enabled = TRUE
        AND (w.rsvp_deadline IS NULL OR w.rsvp_deadline >= CURRENT_DATE)
        AND w.deleted_at IS NULL
    )
  );

-- Guests can update their own RSVP (matched by guest record email at app layer)
-- Partners/planners can update any RSVP
CREATE POLICY rsvps_update_member ON rsvps FOR UPDATE
  USING (wedding_id IN (SELECT my_wedding_ids()));
```

### 5.6 `tables` & `seats` RLS

```sql
-- Partners and planners manage seating
CREATE POLICY tables_all_member ON tables FOR ALL
  USING (has_wedding_role(wedding_id, ARRAY['partner', 'planner']))
  WITH CHECK (has_wedding_role(wedding_id, ARRAY['partner', 'planner']));

CREATE POLICY seats_all_member ON seats FOR ALL
  USING (has_wedding_role(wedding_id, ARRAY['partner', 'planner']))
  WITH CHECK (has_wedding_role(wedding_id, ARRAY['partner', 'planner']));
```

### 5.7 `registry_items` RLS

```sql
-- Members read; public read if website is published (handled by app layer / view)
CREATE POLICY registry_select_member ON registry_items FOR SELECT
  USING (wedding_id IN (SELECT my_wedding_ids()));

CREATE POLICY registry_insert_partner ON registry_items FOR INSERT
  WITH CHECK (has_wedding_role(wedding_id, ARRAY['partner']));

CREATE POLICY registry_update_partner ON registry_items FOR UPDATE
  USING (has_wedding_role(wedding_id, ARRAY['partner']))
  WITH CHECK (has_wedding_role(wedding_id, ARRAY['partner']));

CREATE POLICY registry_delete_partner ON registry_items FOR DELETE
  USING (has_wedding_role(wedding_id, ARRAY['partner']));
```

### 5.8 `photos` RLS

```sql
-- Members see approved photos; non-approved only visible to members
CREATE POLICY photos_select_member ON photos FOR SELECT
  USING (wedding_id IN (SELECT my_wedding_ids()) AND deleted_at IS NULL);

-- Authenticated members can upload
CREATE POLICY photos_insert_member ON photos FOR INSERT
  WITH CHECK (has_wedding_role(wedding_id, ARRAY['partner', 'planner']));

-- Partners can update (approve, reorder, caption)
CREATE POLICY photos_update_partner ON photos FOR UPDATE
  USING (has_wedding_role(wedding_id, ARRAY['partner']))
  WITH CHECK (has_wedding_role(wedding_id, ARRAY['partner']));

-- Partners soft-delete (set deleted_at)
CREATE POLICY photos_soft_delete_partner ON photos FOR UPDATE
  USING (has_wedding_role(wedding_id, ARRAY['partner']));
```

### 5.9 `timeline_events` RLS

```sql
CREATE POLICY timeline_select_member ON timeline_events FOR SELECT
  USING (wedding_id IN (SELECT my_wedding_ids()));

CREATE POLICY timeline_all_member ON timeline_events FOR ALL
  USING (has_wedding_role(wedding_id, ARRAY['partner', 'planner']))
  WITH CHECK (has_wedding_role(wedding_id, ARRAY['partner', 'planner']));
```

### 5.10 `subscriptions` RLS

```sql
-- Partners can view their subscription; planners cannot
CREATE POLICY subscriptions_select_partner ON subscriptions FOR SELECT
  USING (has_wedding_role(wedding_id, ARRAY['partner']));

-- Only the service role (Stripe webhook handler) can insert/update subscriptions
-- No INSERT/UPDATE/DELETE policies for authenticated users
-- (Stripe webhook uses service_role key which bypasses RLS)
```

### 5.11 `plans` RLS

```sql
-- Plans are publicly readable (pricing page)
CREATE POLICY plans_select_public ON plans FOR SELECT
  USING (is_active = TRUE);
-- No write policies for authenticated users; service role only
```

### 5.12 `custom_domains` RLS

```sql
CREATE POLICY domains_select_partner ON custom_domains FOR SELECT
  USING (has_wedding_role(wedding_id, ARRAY['partner']));

CREATE POLICY domains_insert_partner ON custom_domains FOR INSERT
  WITH CHECK (has_wedding_role(wedding_id, ARRAY['partner']));

CREATE POLICY domains_update_partner ON custom_domains FOR UPDATE
  USING (has_wedding_role(wedding_id, ARRAY['partner']))
  WITH CHECK (has_wedding_role(wedding_id, ARRAY['partner']));

CREATE POLICY domains_delete_partner ON custom_domains FOR DELETE
  USING (has_wedding_role(wedding_id, ARRAY['partner']));
```

---

## 6. Key Indexes

Beyond primary key indexes, the following are critical for application query patterns:

```sql
-- Wedding lookup by slug (subdomain routing, O(log n))
CREATE UNIQUE INDEX idx_weddings_slug ON weddings (slug);

-- Soft-delete filtering (partial index — excludes deleted rows from active queries)
CREATE INDEX idx_weddings_active ON weddings (id) WHERE deleted_at IS NULL;
CREATE INDEX idx_guests_active ON guests (wedding_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_photos_active ON photos (wedding_id) WHERE deleted_at IS NULL;

-- User's wedding membership lookup (critical for RLS helper function)
CREATE INDEX idx_wedding_members_user ON wedding_members (user_id);
CREATE INDEX idx_wedding_members_wedding ON wedding_members (wedding_id);

-- RSVP dashboard aggregation
CREATE INDEX idx_rsvps_wedding_response ON rsvps (wedding_id, response);

-- Guest search by name (trigram for fuzzy search)
CREATE INDEX idx_guests_name_trgm ON guests
  USING GIN (to_tsvector('simple', first_name || ' ' || COALESCE(last_name, '')));

-- Registry ordered display
CREATE INDEX idx_registry_wedding_sort ON registry_items (wedding_id, sort_order);

-- Photo gallery ordered display
CREATE INDEX idx_photos_wedding_sort ON photos (wedding_id, sort_order)
  WHERE deleted_at IS NULL;

-- Timeline display order
CREATE INDEX idx_timeline_wedding_sort ON timeline_events (wedding_id, sort_order);

-- Subscription status lookup
CREATE INDEX idx_subscriptions_wedding ON subscriptions (wedding_id);
CREATE INDEX idx_subscriptions_stripe ON subscriptions (stripe_subscription_id)
  WHERE stripe_subscription_id IS NOT NULL;

-- Custom domain routing (hot path — every request resolves domain → wedding_id)
CREATE UNIQUE INDEX idx_custom_domains_domain ON custom_domains (domain);
CREATE INDEX idx_custom_domains_status ON custom_domains (status)
  WHERE status = 'active';
```

---

## 7. Supabase-Specific Considerations

### 7.1 Row-Level Security Architecture

```
                    ┌─────────────────────────────────┐
                    │        Next.js API Route          │
                    │  (service_role for Stripe webhooks│
                    │   anon_key for public RSVP reads) │
                    └──────────────┬──────────────────┘
                                   │
                    ┌──────────────▼──────────────────┐
                    │        Supabase Client           │
                    │   createServerClient(cookies)    │
                    │   → passes JWT automatically     │
                    └──────────────┬──────────────────┘
                                   │
                    ┌──────────────▼──────────────────┐
                    │       PostgreSQL RLS Engine      │
                    │  auth.uid() extracted from JWT   │
                    │  Policies evaluated per row      │
                    └─────────────────────────────────┘
```

**Key rules:**
- Use `createServerClient` (from `@supabase/ssr`) in Server Components and Route Handlers — never `createClient` from the browser SDK on the server.
- Use `service_role` key **only** in trusted server contexts (Stripe webhook handler, admin jobs). Never expose it to the client.
- The `anon` key is safe for the browser; RLS enforces all access control.

### 7.2 Storage Buckets

| Bucket Name | Access | Purpose |
|-------------|--------|---------|
| `wedding-photos` | Private (RLS via policies) | Guest and couple photos |
| `avatars` | Public | User profile avatars |
| `wedding-assets` | Private | Cover photos, theme assets |

**Storage RLS Policy Example:**
```sql
-- wedding-photos bucket: only wedding members can read photos from their wedding
CREATE POLICY "Members can view wedding photos"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'wedding-photos'
  AND (storage.foldername(name))[1] IN (
    SELECT wedding_id::TEXT FROM wedding_members WHERE user_id = auth.uid()
  )
);
```

### 7.3 Database Triggers

```sql
-- 1. Auto-create profile when new user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 2. Auto-create wedding_members entry when a wedding is created
CREATE OR REPLACE FUNCTION handle_new_wedding()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO wedding_members (wedding_id, user_id, role)
  VALUES (NEW.id, auth.uid(), 'partner');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_wedding_created
  AFTER INSERT ON weddings
  FOR EACH ROW EXECUTE FUNCTION handle_new_wedding();

-- 3. Auto-update updated_at on any table
CREATE OR REPLACE FUNCTION touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Applied to every table:
CREATE TRIGGER touch_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
-- (Repeat for all tables)
```

### 7.4 Realtime Subscriptions

Enable Realtime only on tables where live updates are needed:

```sql
-- Enable realtime for guest/RSVP live dashboard
ALTER PUBLICATION supabase_realtime ADD TABLE rsvps;
ALTER PUBLICATION supabase_realtime ADD TABLE guests;

-- Enable for seating chart live collaboration
ALTER PUBLICATION supabase_realtime ADD TABLE seats;
ALTER PUBLICATION supabase_realtime ADD TABLE tables;
```

> [!WARNING]
> Do **not** add `subscriptions` or `profiles` to Realtime — they contain sensitive billing and PII data that should never be broadcast.

### 7.5 Edge Functions Integration

| Edge Function | Trigger | Purpose |
|---------------|---------|---------|
| `stripe-webhook` | HTTP POST from Stripe | Updates `subscriptions` table on billing events |
| `send-rsvp-email` | DB trigger on `rsvps INSERT` | Sends confirmation email via Resend |
| `verify-domain` | Cron (every 15 min) | Checks DNS and updates `custom_domains.status` |
| `anonymise-ip` | Cron (daily) | Nullifies `rsvps.ip_address` older than 30 days |

---

## 8. Migration Strategy

### 8.1 File Naming Convention

```
supabase/migrations/
├── 001_initial_schema.sql          # All tables, RLS, indexes
├── 002_seed_plans.sql              # Plan data
├── 003_add_photo_blurhash.sql      # Example additive migration
├── 004_guests_add_table_column.sql # Additive column
└── rollbacks/
    └── 001_rollback.sql            # Manual rollback script
```

### 8.2 Migration Commands

```bash
# Apply all pending migrations to local Supabase instance
supabase db push

# Generate a new migration from schema diff
supabase db diff --file 003_add_photo_blurhash

# Apply to production (via CI/CD)
supabase db push --db-url "$SUPABASE_DB_URL"

# Reset local database to a clean state
supabase db reset
```

### 8.3 CI/CD Integration

```yaml
# .github/workflows/migrate.yml (example)
- name: Apply Supabase Migrations
  run: supabase db push --db-url ${{ secrets.SUPABASE_DB_URL }}
  env:
    SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
```

### 8.4 Migration Rules

- **Always additive in production.** Never `DROP COLUMN` or `ALTER TYPE` without a multi-step migration.
- **Backwards-compatible deploys.** New columns must have a `DEFAULT` so old app versions don't break.
- **Test locally first.** Run `supabase db reset && supabase db push` before committing.
- **Never edit existing migration files.** Always create a new numbered migration.

---

## 9. Seed Data Strategy

### 9.1 Plans Seed (`002_seed_plans.sql`)

```sql
INSERT INTO plans (name, price_monthly_usd, max_guests, max_photos, custom_domain, remove_branding, stripe_price_id) VALUES
  ('Free',      0.00,  50,   20,  FALSE, FALSE, NULL),
  ('Essential', 12.00, 200,  100, FALSE, FALSE, 'price_essential_monthly'),
  ('Premium',   29.00, NULL, NULL, TRUE,  TRUE,  'price_premium_monthly')
ON CONFLICT (name) DO UPDATE SET
  price_monthly_usd = EXCLUDED.price_monthly_usd,
  max_guests        = EXCLUDED.max_guests,
  max_photos        = EXCLUDED.max_photos,
  updated_at        = NOW();
-- NULL max_guests/max_photos = unlimited
```

### 9.2 Development Test Data

Use a dedicated seed script for local development:

```bash
# supabase/seed.sql — only run on local/staging, never production
```

```sql
-- Create test users (Supabase handles password hashing; use auth API in practice)
-- Create test wedding
INSERT INTO weddings (slug, title, partner_one_name, partner_two_name, wedding_date)
VALUES ('emma-and-james', 'Emma & James', 'Emma Collins', 'James Hart', '2027-06-15');

-- Seed guests
INSERT INTO guests (wedding_id, first_name, last_name, email, plus_one_allowed)
SELECT id, 'Sarah', 'Mitchell', 'sarah@example.com', TRUE
FROM weddings WHERE slug = 'emma-and-james';
-- ... etc
```

### 9.3 Data Factories (TypeScript / Testing)

```typescript
// lib/test/factories.ts
export const weddingFactory = (overrides = {}) => ({
  slug: `wedding-${Math.random().toString(36).slice(2, 8)}`,
  title: 'Test Wedding',
  partner_one_name: 'Alice',
  partner_two_name: 'Bob',
  wedding_date: '2027-01-01',
  ...overrides,
});
```

---

## 10. Data Retention & Deletion Policy

### 10.1 GDPR Compliance Overview

EverAfter processes personal data for EU residents. Key obligations:

| Right | Implementation |
|-------|---------------|
| **Right to Access** | Couples can export all their data via dashboard (JSON export) |
| **Right to Erasure** | "Delete Wedding" triggers cascade delete + Storage cleanup |
| **Right to Rectification** | All data editable via application |
| **Data Minimisation** | Only necessary guest fields collected |
| **IP Anonymisation** | `rsvps.ip_address` nullified after 30 days |

### 10.2 Wedding Deletion Flow

When a couple deletes their wedding, the following sequence is executed in order:

```
1. Set weddings.deleted_at = NOW()                  (soft delete, 30-day grace)
2. Schedule hard delete job for T+30 days
3. On hard delete:
   a. DELETE FROM weddings WHERE id = ? AND deleted_at < NOW() - INTERVAL '30 days'
      → CASCADE deletes: wedding_members, guests, rsvps, tables, seats,
                         registry_items, timeline_events, photos, custom_domains,
                         subscriptions
   b. Delete Supabase Storage folder: photos/{wedding_id}/
   c. Cancel Stripe subscription (via API)
   d. Log deletion event to audit log
4. User account (profiles) is NOT deleted — users may have other weddings
```

> [!CAUTION]
> The 30-day grace period is a business decision balancing GDPR erasure (must complete within 30 days of request) and accidental deletion recovery. Hard delete must run within the 30-day GDPR window.

### 10.3 Account Deletion Flow

```
1. User requests account deletion from profile settings
2. Check: user is NOT the sole partner of any active wedding
   → If sole partner: must delete or transfer wedding first
3. DELETE FROM auth.users WHERE id = ?
   → CASCADE: profiles, wedding_members (user removed from all weddings)
4. Stripe customer data deletion request sent (if stripe_customer_id exists)
```

### 10.4 Data Retention Schedule

| Data Type | Retention | Trigger |
|-----------|-----------|---------|
| Active wedding data | Until deletion request | Manual |
| Soft-deleted weddings | 30 days | Scheduled job |
| RSVP IP addresses | 30 days | Cron trigger |
| Stripe billing records | 7 years | Legal requirement |
| Auth logs (Supabase) | 90 days | Supabase default |
| Edge function logs | 30 days | Supabase default |

---

## 11. Performance Considerations

### 11.1 Expected Query Patterns

| Query | Frequency | Optimisation |
|-------|-----------|-------------|
| Resolve `slug` → `wedding_id` | Every public page load | Unique index on `slug`; CDN cache |
| Resolve `domain` → `wedding_id` | Every custom domain request | Unique index on `domain`; edge cache |
| Load wedding dashboard | On every couple login | `wedding_members` index on `user_id` |
| List guests with RSVP status | Couple dashboard, frequent | Join on indexed FK; partial index for active guests |
| RSVP count aggregation | Dashboard widget, frequent | Index on `(wedding_id, response)` |
| Guest name search | Couple guest management | pg_trgm GIN index |
| Photo gallery (paginated) | Public site, very frequent | Index on `(wedding_id, sort_order)`, CDN-cached signed URLs |
| Seating chart load | Planner tool | Single query joining `tables` → `seats` → `guests` |
| Stripe webhook subscription update | Per billing event | Index on `stripe_subscription_id` |
| Custom domain verification cron | Every 15 min | Index on `status = 'active'` |

### 11.2 Connection Pooling

Use **Supabase's built-in PgBouncer** in transaction mode for all server-side queries:

```
# .env.local
DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
DIRECT_URL=postgresql://postgres.[ref]:[password]@aws-0-[region].supabase.com:5432/postgres
```

- `DATABASE_URL` → pooled connection (use for all app queries)
- `DIRECT_URL` → direct connection (use only for migrations)

### 11.3 Query Optimisation Guidelines

1. **Always filter on `wedding_id` first** — the most selective column for tenant isolation.
2. **Use `LIMIT` on all list queries** — never fetch unbounded result sets.
3. **Avoid N+1 patterns** — use Supabase's `.select('*, guests(*)')` for nested fetches or write explicit JOINs.
4. **Cache the wedding record** — store it in React context after first fetch to avoid repeated DB calls within a session.
5. **Use `created_at DESC LIMIT 1` pattern** for "latest subscription" instead of complex logic.
6. **Paginate guest lists** — at 200+ guests, use cursor-based pagination (`WHERE id > $last_id ORDER BY id LIMIT 50`).

### 11.4 Estimated Table Sizes (at Scale)

| Table | Rows/Wedding | At 10k Weddings |
|-------|-------------|-----------------|
| `guests` | ~150 avg | ~1.5M rows |
| `rsvps` | ~150 avg | ~1.5M rows |
| `seats` | ~120 avg | ~1.2M rows |
| `photos` | ~30 avg | ~300k rows |
| `timeline_events` | ~10 avg | ~100k rows |
| `registry_items` | ~20 avg | ~200k rows |

These volumes are well within PostgreSQL's capabilities with proper indexing. Sharding or partitioning is not needed until ~10M weddings.

---

*Document maintained by the EverAfter Engineering Team. For schema changes, open a PR with a corresponding migration file and update this document.*
