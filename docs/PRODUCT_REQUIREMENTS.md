# EverAfter — Product Requirements Document

> **Status:** Draft v1.0  
> **Date:** 2026-09-27  
> **Owner:** Product · EverAfter CTO Office  
> **Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · Supabase · Stripe  
> **Audience:** Engineering, Design, QA, Marketing, Stakeholders

---

## Table of Contents

1. [Vision & Mission](#1-vision--mission)
2. [Product Overview](#2-product-overview)
3. [Target Personas](#3-target-personas)
4. [User Stories](#4-user-stories)
5. [Functional Requirements](#5-functional-requirements)
6. [Non-Functional Requirements](#6-non-functional-requirements)
7. [Freemium Tier Breakdown](#7-freemium-tier-breakdown)
8. [Business Rules](#8-business-rules)
9. [Architecture & Technical Constraints](#9-architecture--technical-constraints)
10. [Out of Scope — v1](#10-out-of-scope--v1)
11. [Future Roadmap](#11-future-roadmap)
12. [Glossary](#12-glossary)

---

## 1. Vision & Mission

### Vision
To become the world's most-loved platform for couples and wedding professionals to create, manage, and celebrate every aspect of a wedding — beautifully, simply, and together.

### Mission
EverAfter empowers couples to build stunning, personalised wedding websites and manage every guest touchpoint — from RSVP to seating — while giving professional wedding planners a unified, white-label-ready dashboard to coordinate multiple events at scale.

### Strategic Goals (Year 1)
| Goal | Target Metric |
|---|---|
| Paying couple subscribers | 10,000 |
| Professional planner accounts | 500 |
| Monthly Active Users (guests + couples) | 250,000 |
| Average wedding website uptime | 99.9% |
| NPS Score | ≥ 65 |
| Markets at launch | English-speaking global (US, UK, AU, CA, IN, SG) |

---

## 2. Product Overview

EverAfter is a **multi-tenant SaaS** platform with two distinct product surfaces:

| Surface | Primary Users | Description |
|---|---|---|
| **Couple Dashboard** | Couples | A private admin panel where a couple manages their wedding site, guests, RSVPs, seating, registry, and timeline. |
| **Public Wedding Website** | Guests | A beautiful, themeable, couple-branded public site guests visit to RSVP, view details, and share photos. |
| **Planner Dashboard** | Professional Planners | A multi-couple command centre for planners managing several events simultaneously. |

### Multi-Tenancy Model
- Each **wedding event** is a tenant with its own subdomain (e.g., `sarah-and-james.everafter.app`) or custom domain.
- Couple accounts own one wedding event (Free/Premium tiers).
- Planner accounts own a planner workspace and can create/manage N wedding events on behalf of couples.
- All data is isolated per tenant at the Supabase Row-Level Security (RLS) policy layer.

---

## 3. Target Personas

### 3.1 Persona: The Couple (Primary)

> **"Alex & Jordan"** — engaged for 3 months, planning a wedding in 9 months.

| Attribute | Detail |
|---|---|
| **Age range** | 25–40 |
| **Tech literacy** | Moderate — comfortable with social media, Google Docs, Canva; not developers |
| **Goals** | Create a gorgeous wedding website fast; manage guest RSVPs without spreadsheets; keep family informed |
| **Pain points** | Expensive designers; scattered guest data across WhatsApp groups, spreadsheets, email threads; time pressure |
| **Motivators** | Beautiful design, ease of use, feeling of control and organisation |
| **Device usage** | 60% mobile, 40% desktop (admin tasks skew desktop) |
| **Budget sensitivity** | Moderate — will pay for convenience but price-conscious |
| **Success looks like** | A live wedding website they're proud to share within 30 minutes of signing up |

---

### 3.2 Persona: The Guest (Secondary)

> **"Priya"** — invited to a cousin's wedding, receives a link via WhatsApp.

| Attribute | Detail |
|---|---|
| **Age range** | 18–70 (wide range) |
| **Tech literacy** | Low to moderate — must be zero-friction |
| **Goals** | Quickly RSVP; find out venue, date, dress code; upload photos from the event |
| **Pain points** | Confusing forms; needing to create an account just to RSVP; slow-loading pages on mobile |
| **Motivators** | Feeling celebrated and included; easy access to information |
| **Device usage** | 80% mobile |
| **Account required?** | No — guests must be able to RSVP without creating an EverAfter account |
| **Success looks like** | RSVP completed in under 60 seconds on a mobile phone |

---

### 3.3 Persona: The Professional Wedding Planner (Tertiary)

> **"Camille"** — runs a boutique wedding planning agency, manages 15–30 weddings per year.

| Attribute | Detail |
|---|---|
| **Age range** | 28–55 |
| **Tech literacy** | Moderate to high — uses project management tools, CRMs, vendor software |
| **Goals** | Manage all client weddings from a single dashboard; reduce per-client setup time; look professional to clients |
| **Pain points** | Switching between multiple logins; duplicating setup work; clients who can't operate tech tools independently |
| **Motivators** | Efficiency, professional image, recurring revenue from clients |
| **Device usage** | 70% desktop |
| **Budget sensitivity** | Low — willing to pay for professional tooling that saves time |
| **Success looks like** | Onboard a new couple in under 10 minutes; see all weddings' RSVP statuses at a glance |

---

### 3.4 Persona: The Couple's Family Member / Co-Admin (Quaternary)

> **"Margaret"** — mother of the bride, co-managing the guest list.

| Attribute | Detail |
|---|---|
| **Goals** | Help manage RSVPs and guest categories without full admin access |
| **Tech literacy** | Low |
| **Needs** | Limited-access co-admin role; simple UI; no ability to accidentally delete critical data |

---

## 4. User Stories

Stories follow the format: **As a [persona], I want to [action] so that [outcome].**  
Priority: 🔴 Must Have (v1) · 🟡 Should Have (v1) · 🟢 Nice to Have (v1+)

---

### 4.1 Onboarding & Account Management

| ID | Persona | Story | Priority |
|---|---|---|---|
| US-001 | Couple | I want to sign up with Google or email in under 2 minutes so that I can start building my wedding site immediately. | 🔴 |
| US-002 | Couple | I want to enter our names, wedding date, and venue so that EverAfter can pre-fill my site and personalise the experience. | 🔴 |
| US-003 | Planner | I want to create a Planner Pro workspace and invite team members so that my agency can collaborate on client weddings. | 🔴 |
| US-004 | Planner | I want to create a new wedding event on behalf of a couple and invite them as co-owners so that they can participate without needing a paid plan. | 🔴 |
| US-005 | Couple | I want to invite my partner as a co-admin on our wedding so that we can both manage it from our own accounts. | 🔴 |
| US-006 | Family Co-Admin | I want to be invited as a limited editor so that I can manage the guest list without accessing billing or site settings. | 🟡 |

---

### 4.2 Wedding Website Builder

| ID | Persona | Story | Priority |
|---|---|---|---|
| US-010 | Couple | I want to choose from beautiful pre-built themes so that my site looks professional without hiring a designer. | 🔴 |
| US-011 | Couple | I want to customise colours, fonts, and hero images to match our wedding aesthetic. | 🔴 |
| US-012 | Couple | I want to add and reorder pages (Our Story, FAQ, Travel & Stay, Registry) so that guests get all the info they need. | 🔴 |
| US-013 | Couple | I want to embed a countdown timer on the homepage so that guests feel the excitement building. | 🔴 |
| US-014 | Couple | I want to add our wedding day timeline (ceremony, cocktail hour, reception) so that guests know what to expect. | 🔴 |
| US-015 | Couple | I want to password-protect my wedding site so that only invited guests can view it. | 🟡 |
| US-016 | Couple | I want to publish and unpublish my site so that I control when it goes live. | 🔴 |
| US-017 | Guest | I want to view the wedding site beautifully on my phone without pinching or zooming. | 🔴 |
| US-018 | Couple | I want to preview my site on mobile and desktop before publishing. | 🟡 |

---

### 4.3 Custom Domain

| ID | Persona | Story | Priority |
|---|---|---|---|
| US-020 | Couple | I want a free subdomain (e.g., `alex-and-jordan.everafter.app`) so that I have a shareable link immediately. | 🔴 |
| US-021 | Couple | I want to connect my own domain (e.g., `alexandjordan.com`) so that the site feels fully ours. | 🟡 |
| US-022 | Couple | I want EverAfter to handle SSL certificate provisioning for my custom domain automatically. | 🟡 |

---

### 4.4 RSVP Management

| ID | Persona | Story | Priority |
|---|---|---|---|
| US-030 | Guest | I want to RSVP by entering my name and confirming attendance without creating an account. | 🔴 |
| US-031 | Guest | I want to specify meal preferences and dietary restrictions in my RSVP so the couple can plan catering. | 🔴 |
| US-032 | Guest | I want to add a plus-one in my RSVP so my partner is also accounted for. | 🔴 |
| US-033 | Guest | I want to receive an email confirmation of my RSVP so I have a record. | 🔴 |
| US-034 | Guest | I want to update or cancel my RSVP up until the RSVP deadline so I can change plans. | 🟡 |
| US-035 | Couple | I want to view RSVP responses in real-time with counts of attending, declined, and pending so I can plan catering and seating. | 🔴 |
| US-036 | Couple | I want to set an RSVP deadline and have the form automatically close after that date. | 🔴 |
| US-037 | Couple | I want to manually record RSVPs on behalf of guests who call or message us. | 🟡 |
| US-038 | Couple | I want to export RSVP data as a CSV so I can share it with caterers and venue coordinators. | 🔴 |
| US-039 | Couple | I want to send reminder notifications to guests who haven't RSVPed close to the deadline. | 🟡 |
| US-040 | Planner | I want to see RSVP response rates across all my managed weddings on a single screen. | 🟡 |

---

### 4.5 Guest List Management

| ID | Persona | Story | Priority |
|---|---|---|---|
| US-050 | Couple | I want to import guests from a CSV or Google Contacts so that I don't have to type every name manually. | 🔴 |
| US-051 | Couple | I want to manually add guests individually so I can build the list incrementally. | 🔴 |
| US-052 | Couple | I want to create groups/categories (Bride's Family, Groom's Friends, Work Colleagues) so I can filter and communicate by segment. | 🔴 |
| US-053 | Couple | I want to see each guest's RSVP status, meal choice, and plus-one status in a single table. | 🔴 |
| US-054 | Couple | I want to search and filter the guest list so I can quickly find specific guests. | 🔴 |
| US-055 | Couple | I want to send email invitations to guests directly from EverAfter so they receive their personalised link. | 🟡 |
| US-056 | Couple | I want to track which guests have been sent invitations vs. not. | 🟡 |
| US-057 | Couple | I want to add notes to individual guests (e.g., "Vegetarian, wheelchair user"). | 🟡 |

---

### 4.6 Registry / Gift List

| ID | Persona | Story | Priority |
|---|---|---|---|
| US-060 | Couple | I want to link external registry pages (Amazon, Zola, John Lewis, etc.) so that guests are directed there from our website. | 🔴 |
| US-061 | Couple | I want to add custom gift items with a title, description, image, and target amount for a cash fund (e.g., "Honeymoon Fund"). | 🔴 |
| US-062 | Couple | I want to mark gifts as "claimed" so that duplicate gifting is avoided. | 🟡 |
| US-063 | Guest | I want to see the registry page on the wedding site and navigate to external registries easily. | 🔴 |
| US-064 | Guest | I want to indicate I'm purchasing a gift item so other guests know it's taken. | 🟡 |
| US-065 | Couple | I want to add multiple registries (from different retailers) so guests can choose where to shop. | 🔴 |

---

### 4.7 Photo Sharing & Gallery

| ID | Persona | Story | Priority |
|---|---|---|---|
| US-070 | Guest | I want to upload photos from the wedding without creating an account so I can share memories instantly. | 🔴 |
| US-071 | Guest | I want to see a gallery of all photos uploaded by other guests. | 🔴 |
| US-072 | Couple | I want to approve photos before they appear in the gallery so I can moderate inappropriate content. | 🟡 |
| US-073 | Couple | I want to download all uploaded photos as a ZIP so I have a full collection of guest photos. | 🔴 |
| US-074 | Couple | I want to pin featured photos at the top of the gallery. | 🟢 |
| US-075 | Couple | I want to set the gallery as open (any guest uploads) or closed (invite-only) to control content. | 🟡 |
| US-076 | Couple | I want to receive a notification when a new photo is uploaded. | 🟢 |

---

### 4.8 Seating Chart / Table Planner

| ID | Persona | Story | Priority |
|---|---|---|---|
| US-080 | Couple | I want to create named tables with configurable seat counts so I can model our venue layout. | 🔴 |
| US-081 | Couple | I want to drag-and-drop confirmed guests onto seats so I can build the seating plan visually. | 🟡 |
| US-082 | Couple | I want to assign guests to tables from the guest list without a drag interface (for accessibility). | 🔴 |
| US-083 | Couple | I want to see which confirmed guests haven't been assigned a seat so I don't miss anyone. | 🔴 |
| US-084 | Couple | I want to print or export the seating chart as a PDF for the venue. | 🟡 |
| US-085 | Couple | I want the seating planner to warn me if I try to over-fill a table. | 🔴 |
| US-086 | Planner | I want to manage the seating chart for client weddings from the Planner Dashboard. | 🟡 |

---

### 4.9 Planner Dashboard

| ID | Persona | Story | Priority |
|---|---|---|---|
| US-090 | Planner | I want a master overview of all weddings I manage, showing key stats (RSVP rate, wedding date, pending tasks). | 🔴 |
| US-091 | Planner | I want to switch between client wedding dashboards without logging out. | 🔴 |
| US-092 | Planner | I want to track tasks per wedding (e.g., "Chase RSVP from Smith family") with due dates. | 🟡 |
| US-093 | Planner | I want to white-label the couple's wedding site so my agency brand is reflected. | 🟢 |
| US-094 | Planner | I want to generate a guest summary report for each wedding to share with caterers. | 🟡 |
| US-095 | Planner | I want to add team members (junior planners) to my workspace with role-based access. | 🟡 |

---

## 5. Functional Requirements

Requirement IDs are prefixed by feature area. Each requirement is **numbered**, **testable**, and **atomic**.

---

### 5.1 Authentication & Identity (AUTH)

| ID | Requirement |
|---|---|
| AUTH-01 | The system SHALL support email/password registration with email verification. |
| AUTH-02 | The system SHALL support OAuth sign-in via Google. |
| AUTH-03 | The system SHALL enforce a minimum password length of 8 characters with complexity validation. |
| AUTH-04 | The system SHALL issue JWTs with a 1-hour expiry and refresh tokens with a 30-day expiry via Supabase Auth. |
| AUTH-05 | The system SHALL support "forgot password" via emailed reset link that expires in 15 minutes. |
| AUTH-06 | The system SHALL assign a user to the `couple` role or `planner` role at sign-up. |
| AUTH-07 | The system SHALL enforce Row-Level Security (RLS) policies in Supabase so that users can only access data belonging to their wedding or planner workspace. |
| AUTH-08 | The system SHALL support multi-party co-ownership: a wedding event may have exactly 2 co-owner accounts. |
| AUTH-09 | The system SHALL support an `editor` role scoped to a single wedding event for family co-admins, with access only to guest list management. |
| AUTH-10 | The system SHALL log all authentication events (sign-in, sign-out, failed attempts) with IP, user-agent, and timestamp. |
| AUTH-11 | Guest RSVP submission SHALL NOT require account creation. |

---

### 5.2 Wedding Website Builder (WEB)

| ID | Requirement |
|---|---|
| WEB-01 | The system SHALL provide a minimum of 6 distinct website themes at launch. |
| WEB-02 | Each theme SHALL be fully responsive and tested at breakpoints: 375px, 768px, 1280px, 1440px. |
| WEB-03 | The couple dashboard SHALL provide a block-based page editor supporting: Hero, Our Story, Event Details, RSVP, Registry, Gallery, Timeline, FAQ, and Accommodation blocks. |
| WEB-04 | The editor SHALL allow reordering of page blocks via drag-and-drop. |
| WEB-05 | The system SHALL allow customisation of: primary colour, accent colour, font family (from a curated list of ≥ 8 pairings), hero image (upload or stock). |
| WEB-06 | All hero images uploaded by users SHALL be stored in Supabase Storage and served via CDN. |
| WEB-07 | A countdown timer block SHALL automatically calculate days, hours, minutes, and seconds to the wedding date. |
| WEB-08 | The wedding day timeline block SHALL support unlimited entries each with: time, event name, optional icon, and optional description. |
| WEB-09 | The website builder SHALL auto-save draft changes every 30 seconds and on every user action. |
| WEB-10 | A couple SHALL be able to preview their site in a mobile or desktop viewport within the dashboard without publishing. |
| WEB-11 | A couple SHALL be able to toggle site visibility between `draft` (not publicly accessible) and `published` (publicly accessible). |
| WEB-12 | When a site is in draft mode, visiting the public URL SHALL return a 404 or a coming-soon page, NOT the draft content. |
| WEB-13 | A couple SHALL be able to optionally set a site-wide password; if set, all public visitors MUST enter the password before viewing any page. |
| WEB-14 | The public website SHALL achieve a Lighthouse performance score ≥ 90 on mobile for a default-content site. |
| WEB-15 | Every page on the public website SHALL include appropriate Open Graph meta tags for social sharing. |
| WEB-16 | The system SHALL generate a `sitemap.xml` and `robots.txt` per wedding subdomain. |

---

### 5.3 Custom Domain (DOMAIN)

| ID | Requirement |
|---|---|
| DOMAIN-01 | Every wedding event SHALL be automatically assigned a subdomain in the format `{slug}.everafter.app` on creation. |
| DOMAIN-02 | The slug SHALL be auto-generated from the couple's names (e.g., `alex-and-jordan`) and guaranteed to be unique. |
| DOMAIN-03 | The couple SHALL be able to change their subdomain slug once without restriction, and subsequently once per 30 days. |
| DOMAIN-04 | The system SHALL support mapping a user-owned custom apex domain or subdomain to their wedding site (Premium tier and above). |
| DOMAIN-05 | Custom domain verification SHALL use a DNS CNAME record pointing to EverAfter infrastructure. |
| DOMAIN-06 | SSL certificates for custom domains SHALL be provisioned automatically via Let's Encrypt or equivalent and renewed before expiry. |
| DOMAIN-07 | The system SHALL display the DNS propagation status (Pending / Verified / Error) in the dashboard. |
| DOMAIN-08 | If a custom domain is removed, the system SHALL immediately revert traffic to the assigned subdomain. |

---

### 5.4 RSVP Management (RSVP)

| ID | Requirement |
|---|---|
| RSVP-01 | The RSVP form SHALL be accessible at a dedicated URL path on the public wedding site. |
| RSVP-02 | The RSVP form SHALL require: guest full name, attendance confirmation (Attending / Not Attending). |
| RSVP-03 | The RSVP form SHALL optionally collect: meal preference (from couple-configured options), dietary notes (free text, max 500 chars), plus-one full name, and a message for the couple. |
| RSVP-04 | The couple SHALL be able to configure meal preference options (add/edit/delete) from their dashboard. |
| RSVP-05 | The couple SHALL be able to toggle plus-one allowance globally or per-guest. |
| RSVP-06 | The couple SHALL be able to set an RSVP deadline date; after this date the public RSVP form SHALL display a closed message and reject submissions. |
| RSVP-07 | Each RSVP submission SHALL trigger an email confirmation to the guest (if they provide an email; email input is optional on form). |
| RSVP-08 | Each RSVP submission SHALL trigger an in-app notification to the couple's dashboard. |
| RSVP-09 | The couple SHALL be able to view all RSVP responses in a sortable, filterable table showing: name, status, meal choice, plus-one, message, and submission timestamp. |
| RSVP-10 | The dashboard RSVP view SHALL display summary counters: Total Invited, Attending, Not Attending, Awaiting Response. |
| RSVP-11 | The couple SHALL be able to export all RSVP data to CSV with all collected fields. |
| RSVP-12 | The couple SHALL be able to manually create or edit an RSVP response from the dashboard on behalf of a guest. |
| RSVP-13 | The system SHALL prevent duplicate RSVP submissions for the same guest name within the same wedding by performing fuzzy name matching and prompting the guest to update their existing response. |
| RSVP-14 | The system SHALL support sending bulk email reminders to guests with `Awaiting Response` status. |

---

### 5.5 Guest List Management (GUEST)

| ID | Requirement |
|---|---|
| GUEST-01 | The couple SHALL be able to add individual guests with: first name, last name, email (optional), phone (optional), group assignment, and dietary notes. |
| GUEST-02 | The couple SHALL be able to import guests from a CSV file; the system SHALL provide a downloadable CSV template. |
| GUEST-03 | CSV import SHALL support field mapping: the user maps CSV columns to system fields before import. |
| GUEST-04 | CSV import errors (malformed rows, missing required fields) SHALL be surfaced per-row with corrective guidance; valid rows SHALL be imported even if some rows fail. |
| GUEST-05 | The couple SHALL be able to create named guest groups and assign guests to one or more groups. |
| GUEST-06 | The guest list SHALL display all guests in a sortable, filterable table; filters SHALL include: group, RSVP status, meal preference, and has-email. |
| GUEST-07 | The couple SHALL be able to search the guest list by name, email, or phone. |
| GUEST-08 | The system SHALL support adding free-text notes to individual guest records. |
| GUEST-09 | The couple SHALL be able to delete a guest record; deleting a guest SHALL also remove their RSVP response after a confirmation prompt. |
| GUEST-10 | The system SHALL track per-guest: invitation sent status, RSVP status, seat assignment, and plus-one info. |
| GUEST-11 | The guest list summary SHALL show the total count and a breakdown by RSVP status. |
| GUEST-12 | Free tier guest list SHALL be capped at 75 guests. Premium SHALL be capped at 500. Planner Pro SHALL be unlimited per wedding. |

---

### 5.6 Registry & Gift List (REGISTRY)

| ID | Requirement |
|---|---|
| REGISTRY-01 | The couple SHALL be able to add external registry links with: retailer name, URL, and optional logo/icon. |
| REGISTRY-02 | The system SHALL validate that registry URLs are well-formed and reachable (HTTP 2xx) before saving. |
| REGISTRY-03 | The couple SHALL be able to add custom gift items with: title, description, image (upload), price/target amount (optional), currency (ISO 4217), and a link (optional). |
| REGISTRY-04 | Each custom gift item SHALL support a `status` field: Available, Reserved, or Purchased. |
| REGISTRY-05 | Guests SHALL be able to mark a custom gift item as Reserved from the public site, providing their name; this does NOT require an account. |
| REGISTRY-06 | Once a guest marks a gift Reserved, it SHALL display as Reserved to all other visitors, preventing double-gifting. |
| REGISTRY-07 | The couple SHALL be able to override the status of any custom gift item from the dashboard. |
| REGISTRY-08 | The Registry page on the public site SHALL display external registry links and custom gift items in a visually appealing grid. |
| REGISTRY-09 | The couple SHALL be able to reorder registry items via drag-and-drop in the dashboard. |
| REGISTRY-10 | Free tier SHALL be limited to 2 external registry links and 5 custom gift items. Premium and Planner Pro SHALL be unlimited. |

---

### 5.7 Photo Sharing & Gallery (PHOTO)

| ID | Requirement |
|---|---|
| PHOTO-01 | A dedicated gallery page SHALL be available on the public wedding site. |
| PHOTO-02 | Guests SHALL be able to upload photos without requiring an account; they SHALL provide their name, and optionally a caption. |
| PHOTO-03 | Accepted image formats SHALL include JPEG, PNG, WEBP, and HEIC; maximum file size per upload SHALL be 20 MB. |
| PHOTO-04 | HEIC files SHALL be automatically converted to JPEG on the server before storage. |
| PHOTO-05 | The system SHALL resize and generate optimised web versions (max 2048px on longest side, ≤ 80% quality WebP) of each uploaded photo for gallery display. |
| PHOTO-06 | Original full-resolution files SHALL be retained in Supabase Storage and available for couple download. |
| PHOTO-07 | The gallery page SHALL display photos in a responsive masonry or grid layout. |
| PHOTO-08 | The gallery SHALL support infinite scroll or paginated loading (≤ 24 photos per page). |
| PHOTO-09 | The couple SHALL be able to configure the gallery in one of three modes: Open (anyone on the internet can upload), Guest-Gated (only guests who know the wedding site password can upload), or Closed (no new uploads). |
| PHOTO-10 | The couple SHALL be able to enable photo moderation; if enabled, uploaded photos SHALL be held in a pending queue and only displayed after the couple approves them. |
| PHOTO-11 | The couple SHALL be able to delete any photo from the gallery. |
| PHOTO-12 | The couple SHALL be able to download all gallery photos as a single ZIP archive. |
| PHOTO-13 | Free tier SHALL be limited to 100 photo uploads total. Premium SHALL be limited to 1,000. Planner Pro SHALL be unlimited per wedding. |
| PHOTO-14 | The system SHALL run automated content moderation (via a third-party AI vision API) to flag and quarantine potentially explicit or offensive photos before they appear in guest-facing mode. |
| PHOTO-15 | The couple SHALL receive an in-app and email notification when a new photo is uploaded (digest mode: max 1 email per hour). |

---

### 5.8 Seating Chart & Table Planner (SEAT)

| ID | Requirement |
|---|---|
| SEAT-01 | The couple SHALL be able to create named tables with configurable seat counts (min 1, max 50 per table). |
| SEAT-02 | The system SHALL allow assigning confirmed attending guests to tables from a list view. |
| SEAT-03 | The system SHALL prevent assigning more guests to a table than its configured seat count. |
| SEAT-04 | The system SHALL surface a list of confirmed attending guests who have not yet been assigned to any table. |
| SEAT-05 | The couple SHALL be able to unassign a guest from a table. |
| SEAT-06 | The system SHALL support optional drag-and-drop canvas layout for visual table positioning (Premium and above). |
| SEAT-07 | The couple SHALL be able to export the seating plan as a printable PDF, one table per section. |
| SEAT-08 | Tables SHALL be deletable; deleting a table with assigned guests SHALL prompt for reassignment or unassignment before deletion. |
| SEAT-09 | The dashboard SHALL show a completion percentage: `(assigned guests / total attending) × 100`. |
| SEAT-10 | Table names, seat assignments, and layout SHALL be auto-saved on every change. |

---

### 5.9 Planner Dashboard (PLANNER)

| ID | Requirement |
|---|---|
| PLANNER-01 | A Planner Pro workspace SHALL support creating and managing multiple wedding events. |
| PLANNER-02 | The planner overview screen SHALL display all managed weddings in a card or table layout, each showing: couple names, wedding date, days until wedding, RSVP rate, and photo count. |
| PLANNER-03 | The planner SHALL be able to switch into any managed wedding's dashboard context in a single click. |
| PLANNER-04 | The system SHALL prevent a planner from accessing wedding events outside their workspace. |
| PLANNER-05 | A planner workspace owner SHALL be able to invite team members by email and assign them one of: `Admin` (full access) or `Viewer` (read-only) roles. |
| PLANNER-06 | Each wedding event within a Planner Pro workspace SHALL inherit the Planner Pro feature set regardless of whether the couple has a paid plan. |
| PLANNER-07 | The planner SHALL be able to create wedding events and invite the couple pair as co-owners who can also log in and manage the site. |
| PLANNER-08 | The system SHALL support a task list per wedding: tasks have title, due date, assignee (planner team member), and status (To Do / In Progress / Done). |
| PLANNER-09 | The planner overview SHALL show count of overdue tasks across all weddings. |
| PLANNER-10 | Planner Pro tier SHALL enforce a limit of managed weddings per workspace (see tier breakdown). |

---

### 5.10 Notifications & Email (NOTIFY)

| ID | Requirement |
|---|---|
| NOTIFY-01 | The system SHALL send transactional emails via a dedicated email delivery service (e.g., Resend or SendGrid). |
| NOTIFY-02 | All outbound emails SHALL come from a configured sending domain (e.g., `notifications@everafter.app`) with valid SPF and DKIM records. |
| NOTIFY-03 | The system SHALL send the following automatic emails: (a) email verification on signup, (b) password reset, (c) RSVP confirmation to guest, (d) RSVP received notification to couple, (e) photo upload notification to couple (hourly digest), (f) RSVP reminder to guests, (g) invitation to co-owner/editor. |
| NOTIFY-04 | All transactional emails SHALL be mobile-responsive HTML with a plain-text fallback. |
| NOTIFY-05 | Couples SHALL be able to opt out of product marketing emails independently from transactional emails. |
| NOTIFY-06 | Transactional emails SHALL include an unsubscribe mechanism for non-critical notifications (photo digests, RSVP summaries). |
| NOTIFY-07 | In-app notifications SHALL appear in a notification bell in the dashboard header and SHALL be marked as read on click. |

---

### 5.11 Billing & Subscription (BILLING)

| ID | Requirement |
|---|---|
| BILLING-01 | Billing SHALL be handled entirely via Stripe; EverAfter SHALL NOT store raw card data. |
| BILLING-02 | Stripe Customer Portal SHALL be surfaced in the couple dashboard for self-service plan management (upgrade, downgrade, cancel). |
| BILLING-03 | Subscriptions SHALL be monthly or annual; annual plans SHALL be offered at a discount (recommended: ~20% off). |
| BILLING-04 | Upgrading SHALL take effect immediately with prorated billing; downgrading SHALL take effect at end of current billing period. |
| BILLING-05 | When a paid plan is cancelled or expires, the account SHALL revert to Free tier limits; features exceeding limits SHALL be placed in read-only state (not deleted) for 30 days. |
| BILLING-06 | The system SHALL handle Stripe webhook events: `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_succeeded`, `invoice.payment_failed`. |
| BILLING-07 | Failed payment SHALL trigger: (a) email notification to account owner, (b) dashboard banner, (c) Stripe's built-in dunning sequence. |
| BILLING-08 | Receipts SHALL be sent automatically by Stripe to the billing email on every successful charge. |
| BILLING-09 | The system SHALL support multiple currencies via Stripe (at minimum: USD, GBP, EUR, AUD, CAD, INR, SGD). |
| BILLING-10 | Planner Pro billing is per workspace (one subscription covers all weddings in the workspace up to the plan limit). |

---

## 6. Non-Functional Requirements

### 6.1 Performance

| ID | Requirement |
|---|---|
| PERF-01 | Public wedding website pages SHALL achieve a Largest Contentful Paint (LCP) ≤ 2.5 seconds on a 4G mobile connection. |
| PERF-02 | Public wedding website pages SHALL achieve a Cumulative Layout Shift (CLS) score ≤ 0.1. |
| PERF-03 | API responses for dashboard data operations (RSVP list, guest list) SHALL return within 500ms at the 95th percentile under normal load. |
| PERF-04 | Photo uploads SHALL be processed (resized, optimised) within 10 seconds for files up to 20 MB. |
| PERF-05 | The platform SHALL serve all static assets via CDN (Vercel Edge Network or equivalent). |
| PERF-06 | Images SHALL be served in next-generation formats (WebP/AVIF) with appropriate cache headers (`Cache-Control: max-age=31536000, immutable`). |
| PERF-07 | The dashboard application SHALL achieve a Time to Interactive (TTI) ≤ 3.5 seconds on first load on a mid-range device. |

---

### 6.2 Security

| ID | Requirement |
|---|---|
| SEC-01 | All data in transit SHALL be encrypted via TLS 1.2 or higher; TLS 1.0 and 1.1 SHALL be disabled. |
| SEC-02 | All data at rest in Supabase SHALL be encrypted using AES-256. |
| SEC-03 | The system SHALL implement OWASP Top 10 countermeasures including input validation, output encoding, and parameterised queries. |
| SEC-04 | The system SHALL enforce rate limiting on: RSVP submissions (10 per IP per hour), authentication attempts (5 per IP per 15 minutes), file uploads (20 per IP per hour). |
| SEC-05 | All file uploads SHALL be scanned for malware using a virus-scanning API before being committed to storage. |
| SEC-06 | The application SHALL set appropriate security headers: `Content-Security-Policy`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`. |
| SEC-07 | API routes SHALL validate all request payloads against Zod schemas before processing. |
| SEC-08 | Supabase RLS policies SHALL be the definitive access control layer; server-side checks SHALL be treated as defence-in-depth. |
| SEC-09 | The system SHALL maintain an audit log of all privileged actions (data export, guest deletion, billing changes) for 90 days. |
| SEC-10 | Third-party OAuth tokens SHALL NOT be stored; only Supabase-issued session tokens are persisted. |
| SEC-11 | GDPR/PDPA compliance: users SHALL be able to download their data and request account deletion (right to erasure), with deletion completing within 30 days. |
| SEC-12 | Cookie consent management SHALL be implemented for users in applicable jurisdictions (EU, UK, CA). |

---

### 6.3 Accessibility

| ID | Requirement |
|---|---|
| ACC-01 | All public wedding website pages SHALL conform to WCAG 2.1 Level AA. |
| ACC-02 | The couple dashboard SHALL conform to WCAG 2.1 Level AA. |
| ACC-03 | All interactive elements SHALL be keyboard navigable with visible focus indicators. |
| ACC-04 | All images SHALL have descriptive `alt` text; decorative images SHALL use `alt=""`. |
| ACC-05 | Colour contrast ratios SHALL meet WCAG AA minimums: ≥ 4.5:1 for normal text, ≥ 3:1 for large text. |
| ACC-06 | RSVP forms SHALL be fully operable without a mouse. |
| ACC-07 | All form fields SHALL be associated with visible, correctly linked labels. |
| ACC-08 | Error messages SHALL be announced to screen readers via ARIA live regions. |
| ACC-09 | The system SHALL support right-to-left (RTL) text rendering for Arabic, Hebrew, and Farsi as a v1+ consideration. |

---

### 6.4 SEO & Discoverability

| ID | Requirement |
|---|---|
| SEO-01 | Every public wedding website page SHALL have unique, couple-customisable `<title>` and `<meta name="description">` tags. |
| SEO-02 | Open Graph tags SHALL be present on all public pages for rich link previews on social media and messaging apps. |
| SEO-03 | Public wedding sites SHALL be server-side rendered (Next.js App Router) so that content is crawlable. |
| SEO-04 | The system SHALL generate a `sitemap.xml` per wedding site and submit it on publish. |
| SEO-05 | The EverAfter marketing site (separate from wedding sites) SHALL follow a structured content strategy for organic acquisition. |
| SEO-06 | Password-protected wedding sites SHALL return `noindex` headers so they do not appear in search results. |

---

### 6.5 Scalability & Reliability

| ID | Requirement |
|---|---|
| SCALE-01 | The platform SHALL target 99.9% monthly uptime for public wedding websites (≤ 43.8 minutes downtime/month). |
| SCALE-02 | The platform SHALL target 99.5% monthly uptime for couple/planner dashboards. |
| SCALE-03 | The system architecture SHALL support horizontal scaling of Next.js serverless functions via the deployment platform (Vercel). |
| SCALE-04 | Supabase connection pooling (PgBouncer) SHALL be configured to prevent database connection exhaustion. |
| SCALE-05 | The system SHALL use background job queues (e.g., Supabase Edge Functions + pg_cron, or a dedicated queue service) for non-blocking operations: email sending, photo processing, ZIP generation, CSV export. |
| SCALE-06 | The system SHALL implement caching for public wedding site pages using Next.js `revalidate` (ISR) with a 60-second TTL; invalidated on publish. |
| SCALE-07 | Supabase Storage SHALL be configured with appropriate bucket policies per data type: public (gallery, hero images) and private (original uploads, exports). |
| SCALE-08 | The database schema SHALL be designed to support 100,000+ weddings without query degradation, using appropriate indexes on foreign keys and frequently queried columns. |

---

### 6.6 Internationalisation (i18n)

| ID | Requirement |
|---|---|
| I18N-01 | The dashboard UI SHALL launch in English only (v1); the architecture SHALL use `next-intl` or equivalent to support additional languages in future releases. |
| I18N-02 | Date, time, and currency formatting SHALL respect the user's locale settings. |
| I18N-03 | The public wedding site SHALL render in English by default; couples SHALL be able to set a preferred language for their site (v1+). |
| I18N-04 | All user-facing strings SHALL be externalised to translation files from day one to avoid migration cost. |

---

## 7. Freemium Tier Breakdown

### 7.1 Tier Overview

| Feature | 🆓 Free | 💎 Premium | 🏢 Planner Pro |
|---|---|---|---|
| **Price (monthly)** | $0 | $14.99/mo | $49.99/mo |
| **Price (annual, ~20% off)** | $0 | $9.99/mo ($119.88/yr) | $39.99/mo ($479.88/yr) |
| **Intended user** | Couple trialling the product | Couple with full feature needs | Professional agency |
| **Weddings per account** | 1 | 1 | Up to 30 |
| **Website themes** | 2 | All (6+) | All (6+) |
| **Custom domain** | ❌ | ✅ | ✅ |
| **Site password protection** | ❌ | ✅ | ✅ |
| **Guest list limit** | 75 guests | 500 guests | Unlimited |
| **RSVP management** | ✅ (basic) | ✅ (full + reminders) | ✅ (full + bulk) |
| **RSVP export (CSV)** | ❌ | ✅ | ✅ |
| **External registry links** | 2 | Unlimited | Unlimited |
| **Custom gift items** | 5 | Unlimited | Unlimited |
| **Photo uploads** | 100 photos | 1,000 photos | Unlimited |
| **Photo moderation** | ❌ | ✅ | ✅ |
| **Photo bulk download (ZIP)** | ❌ | ✅ | ✅ |
| **Seating chart** | List assign only | List + visual canvas | List + visual canvas |
| **PDF export (seating)** | ❌ | ✅ | ✅ |
| **Timeline & countdown** | ✅ | ✅ | ✅ |
| **Co-owner (partner)** | ✅ | ✅ | ✅ |
| **Editor role (family)** | ❌ | ✅ (1 editor) | ✅ (3 editors/wedding) |
| **EverAfter branding on site** | ✅ (shown) | ❌ (removed) | ❌ (removed) |
| **Email support** | Community forum | Priority email | Dedicated account support |
| **Analytics (page views, RSVP funnel)** | ❌ | ✅ | ✅ |
| **Planner dashboard** | ❌ | ❌ | ✅ |
| **Task management** | ❌ | ❌ | ✅ |
| **Team members (planner workspace)** | N/A | N/A | Up to 5 |
| **White-label (remove EverAfter footer)** | ❌ | ❌ | ✅ |

### 7.2 Free Tier Guardrails

- Free tier does **not** require a credit card.
- Free tier sites display a small, tasteful "Made with EverAfter" badge in the footer.
- Approaching limits (e.g., 70/75 guests) triggers in-app upgrade nudges; reaching limits blocks the action with an upgrade prompt.
- Free tier accounts that have been inactive for 24 months (no logins, no guest activity) may be archived with 60 days' notice.

### 7.3 Upgrade Triggers (Contextual)

The system SHALL display contextual upgrade prompts at the point of hitting a limit, with the specific benefit highlighted. Prompts SHALL NOT be shown more than once per session for the same trigger.

---

## 8. Business Rules

| ID | Rule |
|---|---|
| BR-01 | A wedding event belongs to exactly one primary owner account. |
| BR-02 | A couple account (Free or Premium) may own exactly one active wedding event at a time. |
| BR-03 | A wedding event may have exactly two co-owner accounts (the two partners). |
| BR-04 | A Planner Pro workspace may own up to 30 wedding events concurrently. Archived or past-date weddings do not count toward the limit. |
| BR-05 | An RSVP response is associated with a wedding event. If the guest exists in the guest list, the RSVP is linked; if not, a new guest record is created with a `walk-in` flag. |
| BR-06 | A guest may have a maximum of 1 plus-one (cannot bring multiple additional people via a single RSVP submission). |
| BR-07 | RSVP deadline enforcement is based on midnight (23:59:59) in the couple's configured wedding timezone. |
| BR-08 | Photo storage consumed counts toward the per-tier photo limit by number of files, not by storage size. |
| BR-09 | Downgrading from Premium to Free does NOT delete photos, guests, or registry items; excess data is frozen in read-only state for 30 days. If the account does not upgrade within 30 days, excess data beyond Free tier limits is permanently deleted after a final warning email. |
| BR-10 | Gift reservation by guests is advisory only; no payment is processed through EverAfter. |
| BR-11 | Custom domain ownership verification is the user's sole responsibility; EverAfter is not liable for DNS configuration errors. |
| BR-12 | Planner Pro subscribers who invite couples as co-owners grant those couples Premium-equivalent feature access for that specific wedding, at no additional charge to the couple. |
| BR-13 | Past weddings (wedding date more than 6 months ago) may be archived to cold storage; the public site URL returns a 410 Gone; couples retain dashboard access to data for 12 months post-wedding. |
| BR-14 | Slug changes on subdomain are rate-limited to once per 30 days after the first change, to prevent misuse of the free subdomain namespace. |
| BR-15 | All prices are listed exclusive of applicable taxes (VAT, GST); taxes are calculated by Stripe at checkout based on the user's billing address. |

---

## 9. Architecture & Technical Constraints

### 9.1 Stack Decisions

| Layer | Technology | Rationale |
|---|---|---|
| **Frontend** | Next.js 14 (App Router) | SSR/ISR for public site SEO; React Server Components for performance |
| **Language** | TypeScript (strict mode) | Type safety across codebase |
| **Styling** | Tailwind CSS + shadcn/ui | Rapid UI development, consistent design system |
| **Database** | Supabase (PostgreSQL) | Managed Postgres, built-in auth, RLS, Storage, real-time |
| **Authentication** | Supabase Auth | JWT, OAuth, email/password, RLS integration |
| **Storage** | Supabase Storage | Blob storage for images, files, exports |
| **Payments** | Stripe | PCI-compliant billing, subscriptions, webhooks, Customer Portal |
| **Deployment** | Vercel | Edge Functions, ISR, global CDN, preview deployments |
| **Email** | Resend (or SendGrid) | Transactional email with high deliverability |
| **Background Jobs** | Supabase Edge Functions + pg_cron | Photo processing queue, email digests |
| **Monitoring** | Vercel Analytics + Sentry | Performance monitoring and error tracking |

### 9.2 Key Architectural Constraints

- All database access from Next.js server components and API routes SHALL use the Supabase server client with the user's JWT — never the service-role key in client-facing code.
- The service-role key SHALL only be used in Supabase Edge Functions and trusted server-only contexts.
- The application SHALL follow the Next.js App Router file convention: `app/(dashboard)/`, `app/(public)/[slug]/`, `app/api/`.
- Multi-tenant routing SHALL be handled via subdomain middleware in `middleware.ts`, rewriting requests to the appropriate tenant context.
- Stripe webhook handlers SHALL be implemented as Next.js Route Handlers and validate the `stripe-signature` header on every request.
- Environment secrets SHALL be managed via Vercel environment variables; `.env.local` is used for local development only and SHALL NOT be committed.

### 9.3 Database Design Principles

- Every table SHALL have a `created_at` and `updated_at` column (auto-managed via triggers).
- UUIDs SHALL be used as primary keys (Supabase default: `gen_random_uuid()`).
- Soft deletes SHALL be used for guest records and RSVP records (a `deleted_at` column) to support undo and audit.
- Wedding events SHALL be identifiable by both their UUID and URL slug; a unique index on slug is required.
- RLS policies SHALL be defined for every table; no table SHALL have RLS disabled in production.

---

## 10. Out of Scope — v1

The following features have been explicitly deferred to v1+ or future major releases to maintain focus and delivery speed:

| Feature | Reason Deferred |
|---|---|
| Native mobile app (iOS/Android) | Web-first strategy; responsive web sufficient for v1 |
| In-app payment processing for gifts (cash funds) | Regulatory complexity; v1 uses external links only |
| Video uploads to gallery | Storage cost and encoding complexity; images only in v1 |
| Live streaming integration | High complexity; v2 feature |
| Vendor marketplace (florists, photographers, caterers) | Separate product surface; requires vendor onboarding |
| Automated seating algorithm (AI-suggested seating) | v2; requires additional data modelling |
| Multi-language public wedding sites (non-English) | v1 architecture supports it; content/UI not translated |
| Native WhatsApp / SMS invitation sending | Carrier relationships required; v2 |
| Budgeting & expense tracking module | Out of core MVP scope |
| Wedding website analytics dashboard (deep dive) | Basic analytics in Premium v1; advanced reporting v2 |
| API / webhooks for couple data (developer access) | v2 |
| Offline/PWA mode | v2 |
| RTL language support | v1+ consideration |
| GDPR Data Processing Agreements (DPA) for planners | Legal review needed; post-launch priority |
| Custom email templates (couple-branded emails to guests) | v2; v1 uses EverAfter-branded templates |

---

## 11. Future Roadmap

These are ideas confirmed as strategically relevant but not scheduled. They feed into the long-term product backlog.

### v1.1 — Quick Wins (0–3 months post-launch)
- [ ] WhatsApp/SMS guest communication
- [ ] Custom couple email domain for outbound guest emails
- [ ] Basic analytics dashboard (page views, RSVP funnel, top referrers)
- [ ] Additional themes (launch with 6; target 12 by v1.1)
- [ ] RTL language rendering support

### v1.5 — Growth Features (3–9 months post-launch)
- [ ] In-app cash fund contributions via Stripe (honeymoon fund, direct bank transfer)
- [ ] AI-powered seating suggestion engine
- [ ] Video uploads (up to 2 minutes; auto-transcoded)
- [ ] Guest-facing mobile app (read-only: see schedule, upload photos, RSVP)
- [ ] Multi-language support for public site (French, Spanish, Portuguese, Arabic)
- [ ] White-label domain for Planner Pro (e.g., `portal.cameronsevents.com`)

### v2.0 — Platform Expansion (9–18 months post-launch)
- [ ] Developer API & webhooks for third-party integrations
- [ ] Vendor directory and booking integration
- [ ] AI-generated wedding website copy and photo selection
- [ ] Wedding budget tracker module
- [ ] Live ceremony streaming widget (Zoom/YouTube embed + countdown)
- [ ] Post-wedding: Thank you card generator
- [ ] Aggregated planner analytics across all weddings
- [ ] Enterprise tier (hotel groups, large agencies)

---

## 12. Glossary

| Term | Definition |
|---|---|
| **Couple** | The pair of people getting married; the primary account owners of a wedding event. |
| **Wedding Event** | The central data entity representing a single wedding; has one subdomain/domain, one guest list, one RSVP form, one seating plan. |
| **Public Wedding Site** | The guest-facing website generated from the couple's configuration; accessed via subdomain or custom domain. |
| **Planner Workspace** | The organisational container for a professional planner's account; holds multiple wedding events. |
| **Tenant** | Synonymous with a wedding event in the multi-tenancy model. |
| **Slug** | The URL-safe identifier for a wedding event, used in subdomain and routing (e.g., `alex-and-jordan`). |
| **RSVP** | Répondez s'il vous plaît — the guest's attendance confirmation response. |
| **Co-owner** | Either partner in the couple; both have full administrative access to the wedding event. |
| **Editor** | A limited-access collaborator (e.g., family member) who can only manage the guest list. |
| **Walk-in Guest** | A guest who RSVPs without being pre-added to the guest list by the couple. |
| **ISR** | Incremental Static Regeneration — Next.js feature for cached, SEO-friendly page rendering with time-based revalidation. |
| **RLS** | Row-Level Security — PostgreSQL feature used in Supabase to enforce per-row access control. |
| **Planner Pro** | The professional tier subscription; grants multi-wedding management capabilities. |
| **Tier Limit (Frozen)** | A state where data exceeding a downgraded plan's limit is preserved read-only for 30 days before permanent deletion. |
| **Slug Cooldown** | The 30-day waiting period before a couple can change their subdomain slug a second time. |

---

*This document is the authoritative source of record for EverAfter v1 product requirements. All changes must be reviewed by the Product Owner and updated with a version increment and changelog entry.*

---

**Document History**

| Version | Date | Author | Summary |
|---|---|---|---|
| 1.0 | 2026-09-27 | EverAfter CTO Office | Initial comprehensive PRD — all v1 features |
