# ADR-003: Custom Domain Strategy for Premium Couples

- **Status:** Accepted
- **Date:** 2026-09-27
- **Author:** Website CTO & System Architecture Team
- **Decision Makers:** Website CTO

---

## 1. Context

EverAfter offers premium couples the ability to connect their own custom apex domain or subdomain (e.g. `alexandtaylor.com`, `ourwedding.us`) to their wedding website.

Requirements:
1. Zero manual intervention: DNS configuration must be automated or verified programmatically.
2. Automatic SSL/TLS certificate provisioning (HTTPS is non-negotiable).
3. Fast global edge routing with low latency.
4. Minimal operational complexity for a small engineering team.
5. Predictable, affordable pricing at thousands of domains.

---

## 2. Options Considered

### Option A: Vercel Domains API (Selected)
Use Vercel's REST API (`/v1/projects/[projectId]/domains`) to register, verify, and automatically provision SSL certs for couple domains.

- **Pros:**
  - Native integration with our Next.js hosting provider.
  - Zero custom reverse-proxy infrastructure to maintain.
  - Automatic Let's Encrypt SSL provisioning and renewal.
  - Verification endpoints for CNAME / A records provided out of the box.
- **Cons:**
  - Included domains quota on Pro tier; additional domains cost \$20/month per 100 domains or enterprise pricing.

### Option B: Cloudflare for SaaS (SSL for SaaS)
Route all traffic through Cloudflare Custom Hostnames with Cloudflare Workers.

- **Pros:**
  - Extremely cheap at scale (\$0.10/hostname after first 100 free).
  - Robust DDoS protection.
- **Cons:**
  - Requires maintaining a separate Cloudflare zone and proxy configuration in front of Vercel.
  - Added architectural hop and potential cache invalidation complications.

### Option C: Custom Caddy / Nginx Reverse Proxy
Deploy an autonomous Caddy server on Hetzner / AWS that terminates TLS using On-Demand TLS and proxies back to the app.

- **Pros:**
  - Maximum cost efficiency at ultra-high volumes.
- **Cons:**
  - High operational overhead, single point of failure, manual failover setup, maintenance burden completely misaligned with early-stage startup goals.

---

## 3. Decision

We accept **Option A (Vercel Domains API)** for v1 launch and initial scale.

If domain volume reaches tier levels where Vercel domain addon costs exceed \$500/month, we will evaluate migrating the edge ingress to Cloudflare for SaaS (Option B) with an isolated proxy abstraction.

---

## 4. Consequences

- `custom_domains` table stores verification status, DNS records, and Vercel domain IDs.
- API route `/api/domains` handles `POST` (create), `GET` (verify DNS), and `DELETE` (remove).
- `src/middleware.ts` resolves incoming `host` headers by querying cached domain mappings.
