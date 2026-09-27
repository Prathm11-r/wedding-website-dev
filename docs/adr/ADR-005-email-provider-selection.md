# ADR-005: Transactional Email Provider Selection

- **Status:** Accepted
- **Date:** 2026-09-27
- **Author:** Website CTO & System Architecture Team
- **Decision Makers:** Website CTO

---

## 1. Context

EverAfter must reliably deliver critical transactional emails:
- Magic link authentication tokens.
- Couple registration confirmations.
- RSVP confirmations to guests and notifications to couples.
- Stripe billing receipts and payment failure alerts.
- Planner invitation and client handover emails.

Requirements:
1. Exceptional inbox deliverability (avoiding spam/promotions tabs).
2. Clean modern developer experience with React-based email authoring (`@react-email/components`).
3. High throughput with webhook event tracking (delivered, bounced, clicked).
4. Generous free tier and predictable scale pricing.

---

## 2. Options Considered

### Option A: Resend (Selected)
Modern transactional email service built for developers, with native React Email integration.

- **Pros:**
  - Designed specifically for Next.js and Vercel environments.
  - Native `@react-email` templates rendered directly as JSX.
  - Fast API response times (< 100ms) from edge runtimes.
  - Simple, modern dashboard with clean domain verification (SPF, DKIM, DMARC).
- **Cons:**
  - Younger company than legacy players like SendGrid or SES.

### Option B: AWS SES (Simple Email Service)
Raw infrastructure email from Amazon Web Services.

- **Pros:**
  - Extremely cheap (\$0.10 per 1,000 emails).
- **Cons:**
  - High operational setup, sandbox approvals, complex IAM setup, clunky template management.

### Option C: Twilio SendGrid
Traditional enterprise email provider.

- **Pros:**
  - High brand recognition.
- **Cons:**
  - Complex UI, slow support for small accounts, dated SDKs, legacy deliverability issues on shared IPs.

---

## 3. Decision

We choose **Option A: Resend** paired with **React Email**.

All transactional templates will be authored as React components in `src/emails/`, ensuring consistent EverAfter design language across web and email channels.

---

## 4. Consequences

- `RESEND_API_KEY`, `RESEND_FROM_EMAIL` configured in environment variables.
- Domain `everafter.com` DNS configured with SPF, DKIM, and strict DMARC policy.
