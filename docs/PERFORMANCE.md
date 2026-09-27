# EverAfter — Performance Guide

> Multi-tenant wedding website builder · Next.js 14 · Supabase · Stripe · Vercel · Resend

---

## Table of Contents

1. [Performance Targets](#1-performance-targets)
2. [Next.js Performance Features](#2-nextjs-performance-features)
3. [Image Optimization Strategy](#3-image-optimization-strategy)
4. [Font Loading Strategy](#4-font-loading-strategy)
5. [JavaScript Bundle Strategy](#5-javascript-bundle-strategy)
6. [Caching Strategy](#6-caching-strategy)
7. [Database Query Performance](#7-database-query-performance)
8. [Supabase Storage CDN](#8-supabase-storage-cdn)
9. [Third-Party Script Loading](#9-third-party-script-loading)
10. [Core Web Vitals Monitoring](#10-core-web-vitals-monitoring)
11. [Known Performance Risks and Mitigations](#11-known-performance-risks-and-mitigations)

---

## 1. Performance Targets

Performance is a first-class product requirement for EverAfter — not an afterthought. Couples share their wedding site URLs with family and friends on slow mobile connections. Every second of load time costs real engagement.

### 1.1 Core Web Vitals Targets

| Metric | Full Name | Target | "Needs Improvement" | "Poor" |
|---|---|---|---|---|
| **LCP** | Largest Contentful Paint | **< 2.5 s** | 2.5–4.0 s | > 4.0 s |
| **INP** | Interaction to Next Paint | **< 200 ms** | 200–500 ms | > 500 ms |
| **CLS** | Cumulative Layout Shift | **< 0.1** | 0.1–0.25 | > 0.25 |
| **TTFB** | Time to First Byte | **< 800 ms** | 800–1800 ms | > 1800 ms |
| **FCP** | First Contentful Paint | **< 1.8 s** | 1.8–3.0 s | > 3.0 s |

> [!IMPORTANT]
> These targets apply to **both** surfaces: the couple's dashboard (`app.everafter.app`) **and** the public wedding site (`<slug>.everafter.app`). Public sites have stricter real-world priority because they receive higher traffic volume from guests who are not regular app users.

### 1.2 Lighthouse Score Targets

| Category | Target |
|---|---|
| Performance | **≥ 90** |
| Accessibility | **≥ 90** |
| Best Practices | **≥ 90** |
| SEO | **≥ 85** |

Lighthouse audits run automatically in CI via `pnpm lighthouse` (configured with `lighthouserc.js`) against the Vercel Preview URL on every PR. Scores below threshold fail the check.

### 1.3 Measurement Conditions

Lighthouse CI runs with:
- **Device**: Mobile emulation (Moto G Power)
- **Network throttling**: Slow 4G (40 ms RTT, 10 Mbps down, 1 Mbps up)
- **CPU throttling**: 4× slowdown

Lab scores must be ≥ 90. Field data (real users via Vercel Speed Insights and `web-vitals`) must show p75 values within the "Good" threshold for all core metrics.

---

## 2. Next.js Performance Features

EverAfter is built on Next.js 14 App Router and leverages its full performance feature set by default.

### 2.1 React Server Components (RSC)

Server Components are the default in the App Router. They execute on the server and send only HTML (no JS runtime) to the client. This is the single largest lever for bundle size reduction.

**Policy:**
- All data-fetching components are Server Components unless they require browser APIs or React state.
- Use `'use client'` **only** at the leaf level — small, interactive UI components (buttons, modals, form fields).
- Never mark a layout or page-level component as `'use client'` unless there is no alternative.

**Example — correct boundary placement:**

```tsx
// app/[slug]/page.tsx — Server Component (no 'use client')
// Fetches wedding site data on the server. Zero client JS emitted for this tree.
export default async function WeddingPage({ params }: { params: { slug: string } }) {
  const site = await getWeddingSite(params.slug); // direct Supabase call, no fetch waterfall
  return (
    <main>
      <HeroSection site={site} />       {/* Server Component */}
      <RSVPButton siteId={site.id} />   {/* 'use client' — isolated interactive island */}
    </main>
  );
}
```

### 2.2 Partial Prerendering (PPR) — Planned

Next.js 14 introduces Partial Prerendering (experimental). EverAfter's public wedding sites are ideal candidates: the hero section, couple story, and event details are static; only the RSVP form and live guest count need dynamic rendering. PPR will allow serving a static shell instantly while streaming dynamic shells.

**Status**: Targeting enablement when PPR exits experimental in Next.js 15.

### 2.3 Streaming with Suspense

Heavy data-fetching sections (photo gallery, guest list counts) use `<Suspense>` boundaries with skeleton fallbacks, enabling the page shell to render and stream immediately while data loads in parallel.

```tsx
<Suspense fallback={<GallerySkeleton />}>
  <PhotoGallery siteId={site.id} />
</Suspense>
```

### 2.4 `next/image`

All images go through `next/image`. See §3 for the full strategy.

### 2.5 `next/font`

All fonts are loaded via `next/font`. See §4 for the full strategy.

### 2.6 Route Segment Config

Wedding site pages use `export const dynamic = 'force-static'` with on-demand revalidation (ISR). Dashboard pages use `export const dynamic = 'force-dynamic'` because they require per-user authentication context.

---

## 3. Image Optimization Strategy

Images are the dominant factor in LCP on wedding sites, which are inherently photo-heavy.

### 3.1 `next/image` is Mandatory

`<img>` tags are **prohibited** in the codebase. The ESLint rule `@next/next/no-img-element` is enabled and configured as an error. All images must use `next/image`.

Benefits provided automatically:
- Format conversion to WebP/AVIF based on browser support
- Responsive `srcset` generation
- Lazy loading by default (`loading="lazy"`)
- Prevents layout shift via reserved space (requires `width`/`height` or `fill` prop)

### 3.2 Hero Image (LCP Element)

The hero image on a wedding site is virtually always the LCP element. It must be treated with priority.

```tsx
<Image
  src={site.heroImageUrl}
  alt={`${site.coupleName} wedding`}
  fill
  priority                        // Disables lazy loading, adds <link rel="preload">
  sizes="100vw"
  className="object-cover"
  quality={85}
/>
```

**Rules for the hero image:**
- Always set `priority` — this generates a `<link rel="preload">` in `<head>` to eliminate the discovery delay.
- Use `fill` + CSS `object-cover` for full-bleed layouts.
- Set `quality={85}` — the default of 75 is acceptable but 85 provides better fidelity for hero photography.
- Serve from Supabase Storage CDN (§8) — not from raw Supabase storage URLs.

### 3.3 Photo Gallery

Gallery thumbnails are not LCP elements and should be lazy-loaded (default behavior).

```tsx
<Image
  src={photo.thumbnailUrl}
  alt={photo.altText || 'Wedding photo'}
  width={400}
  height={300}
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
/>
```

**Rules for gallery images:**
- Always specify `sizes` accurately to prevent the browser downloading oversized images on mobile.
- Store and serve thumbnail variants (400×300) separately from originals to avoid transforming 8 MP photos on the fly.
- Implement **virtual scrolling** for galleries > 50 photos to avoid DOM bloat.

### 3.4 Image Upload Processing

When a couple uploads a photo via the dashboard:

1. **Client** uploads the original file directly to Supabase Storage (multipart upload).
2. A **Supabase Edge Function** (`process-image`) is triggered by the `storage.objects` insert event.
3. The Edge Function uses the **Sharp** library (or Supabase Image Transformation) to generate:
   - `original` — kept as-is, stored in `wedding-photos/originals/`
   - `large` — 1920px wide, WebP, quality 80 — used for lightbox view
   - `thumbnail` — 400×300px, WebP, quality 75 — used in gallery grid
4. Thumbnail and large variant URLs are written back to the `photos` table.

This prevents `next/image` from having to transform high-resolution originals at request time.

### 3.5 `next.config.ts` Image Configuration

```typescript
// next.config.ts
const config: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    formats: ['image/avif', 'image/webp'], // AVIF first (better compression), WebP fallback
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};
```

---

## 4. Font Loading Strategy

EverAfter uses two typefaces:

| Font | Usage | Personality |
|---|---|---|
| **Playfair Display** | Headings, couple names, decorative text | Elegant, editorial, serif |
| **Inter** | Body copy, UI labels, buttons, form fields | Clean, readable, system-like |

### 4.1 `next/font` (Required)

Both fonts are loaded exclusively via `next/font/google`. This ensures:
- Font files are **self-hosted** on Vercel's CDN — no third-party DNS lookup to `fonts.googleapis.com`
- `font-display: swap` is configured automatically
- Correct `preload` hints are injected into `<head>`
- Zero Cumulative Layout Shift from font swapping (via CSS `size-adjust`)

```typescript
// app/fonts.ts
import { Playfair_Display, Inter } from 'next/font/google';

export const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
});

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500', '600'],
});
```

```typescript
// app/layout.tsx
import { playfair, inter } from '@/app/fonts';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-inter">{children}</body>
    </html>
  );
}
```

### 4.2 CSS Variable Pattern

Using CSS variables (`--font-playfair`, `--font-inter`) allows Tailwind to reference fonts while keeping the source-of-truth in one place:

```javascript
// tailwind.config.ts
fontFamily: {
  playfair: ['var(--font-playfair)', 'Georgia', 'serif'],
  inter: ['var(--font-inter)', 'system-ui', 'sans-serif'],
},
```

### 4.3 Font Subsetting

`next/font` downloads only the `latin` subset by default. If EverAfter expands to markets requiring additional scripts (Cyrillic, Devanagari, etc.), add the corresponding subset strings to each font config and verify that file size remains acceptable.

### 4.4 Variable Font Considerations

Playfair Display is available as a variable font (`Playfair_Display` via Google Fonts), which covers all weight and style combinations in a single file, reducing the number of font requests.

> [!TIP]
> Avoid loading font weights that are not actually used in the UI. Each weight/style combination is a separate network request in non-variable font mode. Audit font usage periodically with `pnpm build` output or Lighthouse's "Reduce unused CSS" and font audits.

---

## 5. JavaScript Bundle Strategy

The goal is to ship as little JavaScript as possible to the browser.

### 5.1 Server Components as the Default

As described in §2.1, Server Components produce zero client JavaScript. This is the primary strategy for keeping the bundle small.

### 5.2 Dynamic Imports for Heavy Client Components

Components that are large, interactive, or only needed on interaction should be dynamically imported with `next/dynamic`:

```typescript
import dynamic from 'next/dynamic';

// Photo editor — large library (e.g., Cropper.js), only needed in dashboard
const PhotoEditor = dynamic(() => import('@/components/PhotoEditor'), {
  loading: () => <p>Loading editor…</p>,
  ssr: false, // Not needed server-side
});

// Theme preview panel — loaded on interaction, not on initial render
const ThemePreviewPanel = dynamic(() => import('@/components/ThemePreviewPanel'));
```

### 5.3 Avoid Importing Large Libraries for Small Tasks

| Bad Pattern | Better Pattern |
|---|---|
| `import _ from 'lodash'` for one utility | Import directly: `import debounce from 'lodash/debounce'` |
| `import * as dateFns from 'date-fns'` | Import named: `import { format } from 'date-fns'` |
| `import { Icon } from 'react-icons/all'` | Import per-pack: `import { FaHeart } from 'react-icons/fa'` |

### 5.4 Bundle Analysis

Run bundle analysis before any significant dependency addition:

```bash
ANALYZE=true pnpm build
```

Configure `@next/bundle-analyzer` in `next.config.ts`:

```typescript
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzer(config);
```

Review the output for:
- Unexpectedly large chunks (> 100 KB parsed)
- Duplicate packages (two versions of the same library)
- Server-only packages being pulled into the client bundle

### 5.5 Tree Shaking

Ensure all imported libraries are ESM-compatible and tree-shakeable. Check `package.json` of dependencies for `"sideEffects": false` or `"module"` field.

---

## 6. Caching Strategy

### 6.1 Static Pages (Marketing Site)

Marketing pages (`/`, `/pricing`, `/features`, `/blog/*`) are fully statically generated at build time.

```typescript
// app/page.tsx (marketing homepage)
export const dynamic = 'force-static';
// or simply: no dynamic function calls → Next.js auto-detects as static
```

These pages are served from Vercel's Edge Network with zero server computation per request. Cache-Control: `public, max-age=31536000, immutable` (set by Vercel automatically for static assets).

### 6.2 ISR for Wedding Sites (Public Facing)

Public wedding sites change infrequently (couples edit their sites occasionally, not continuously). ISR is ideal: serve a cached static page, regenerate in the background when content changes.

```typescript
// app/[slug]/page.tsx
export const revalidate = 3600; // Revalidate at most once per hour (background)

// On-demand revalidation when couple saves changes:
// Server Action → revalidatePath(`/${slug}`) → immediate cache bust
```

**On-demand revalidation flow:**

```typescript
// app/actions/site.ts
'use server';
import { revalidatePath } from 'next/cache';

export async function saveSiteContent(slug: string, content: SiteContent) {
  await updateSiteInDatabase(slug, content);
  revalidatePath(`/${slug}`);           // Bust the public wedding site cache
  revalidatePath(`/${slug}`, 'layout'); // Also bust shared layout if needed
}
```

This means guests always see an up-to-date site within seconds of a couple saving changes, while still enjoying static-speed delivery.

### 6.3 Dashboard Pages (Authenticated, Dynamic)

Dashboard pages require real-time, per-user data and must not be cached at the CDN layer.

```typescript
// app/dashboard/page.tsx
export const dynamic = 'force-dynamic';
```

Cache-Control response header: `private, no-store` — Vercel will not cache these at the edge.

### 6.4 API Response Caching

Route Handlers that return public, non-user-specific data (e.g., `/api/themes`, `/api/countries`) should use Next.js's `fetch` caching:

```typescript
// In a Server Component or Route Handler
const themes = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/themes`, {
  next: { revalidate: 86400 }, // Cache for 24 hours
});
```

Route Handlers that return user-specific data must explicitly opt out:

```typescript
export const dynamic = 'force-dynamic'; // or use cookies()/headers() which auto-opts out
```

### 6.5 Supabase Query Caching

Direct Supabase calls within Server Components are **not** automatically cached by Next.js (unlike `fetch()`). Use the Next.js `unstable_cache` wrapper for expensive queries that can tolerate staleness:

```typescript
import { unstable_cache } from 'next/cache';

const getCachedWeddingSite = unstable_cache(
  async (slug: string) => {
    const { data } = await supabase
      .from('wedding_sites')
      .select('*')
      .eq('slug', slug)
      .single();
    return data;
  },
  ['wedding-site'],
  { revalidate: 3600, tags: ['wedding-site'] }
);
```

Call `revalidateTag('wedding-site')` in Server Actions when site content changes.

### 6.6 Cache Hierarchy Summary

```
Browser Cache (private)
        │
        ▼
Vercel Edge Network (CDN) — static/ISR pages
        │
        ▼
Next.js Data Cache — fetch() and unstable_cache results
        │
        ▼
Supabase Connection Pool → PostgreSQL
```

---

## 7. Database Query Performance

### 7.1 Key Query Patterns and Index Strategy

| Table | Query Pattern | Index Required |
|---|---|---|
| `wedding_sites` | `WHERE slug = ?` | `UNIQUE INDEX ON slug` |
| `wedding_sites` | `WHERE custom_domain = ?` | `UNIQUE INDEX ON custom_domain` |
| `wedding_sites` | `WHERE user_id = ?` (dashboard) | `INDEX ON user_id` |
| `rsvp_responses` | `WHERE site_id = ?` | `INDEX ON site_id` |
| `rsvp_responses` | `WHERE site_id = ? AND email = ?` | `INDEX ON (site_id, email)` |
| `photos` | `WHERE site_id = ? ORDER BY position` | `INDEX ON (site_id, position)` |
| `subscriptions` | `WHERE user_id = ?` | `INDEX ON user_id` |
| `subscriptions` | `WHERE stripe_subscription_id = ?` | `INDEX ON stripe_subscription_id` |

### 7.2 Avoid N+1 Queries

Use Supabase's relational query syntax to fetch related data in a single round trip:

```typescript
// ❌ N+1 — fetches site, then makes a separate query per photo
const site = await supabase.from('wedding_sites').select('*').eq('slug', slug).single();
const photos = await supabase.from('photos').select('*').eq('site_id', site.data.id);

// ✅ Single query — joins photos in one round trip
const { data: site } = await supabase
  .from('wedding_sites')
  .select(`
    *,
    photos (id, thumbnail_url, alt_text, position),
    rsvp_responses (count)
  `)
  .eq('slug', slug)
  .single();
```

### 7.3 Select Only Required Columns

Avoid `SELECT *` on large tables. Specify required columns to reduce payload size and improve query planning:

```typescript
// ❌ Fetches all columns including large JSON content columns
const { data } = await supabase.from('wedding_sites').select('*');

// ✅ Select only what's needed for the listing view
const { data } = await supabase
  .from('wedding_sites')
  .select('id, slug, couple_name, published, updated_at')
  .eq('user_id', userId);
```

### 7.4 Pagination

Never fetch unbounded result sets. Always paginate:

```typescript
const PAGE_SIZE = 20;

const { data, count } = await supabase
  .from('rsvp_responses')
  .select('*', { count: 'exact' })
  .eq('site_id', siteId)
  .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)
  .order('created_at', { ascending: false });
```

### 7.5 Query Performance Monitoring

Use Supabase Dashboard → **Database → Query Performance** to identify:
- Queries with high mean execution time (> 100ms)
- Sequential scans on large tables (missing index indicator)
- High call frequency queries that could benefit from caching

Run `EXPLAIN ANALYZE` on any query that appears in the slow query log before adding indexes.

### 7.6 Connection Pool Limits

| Environment | Pool Mode | Pool Size | Max Connections |
|---|---|---|---|
| Local | Direct | — | 100 (default) |
| Staging | Transaction | 10 | Per Supabase plan |
| Production | Transaction | 15–25 | Per Supabase plan |

Monitor active connections in Supabase Dashboard → **Reports → Database**. If connection count consistently approaches the limit, reduce pool size or upgrade the Supabase plan.

---

## 8. Supabase Storage CDN

### 8.1 CDN Architecture

Supabase Storage uses a global CDN (backed by Cloudflare) for public buckets. Files in public buckets are served from edge nodes closest to the user with aggressive caching.

**Public bucket URL format:**

```
https://<project-ref>.supabase.co/storage/v1/object/public/<bucket>/<path>
```

This URL is what `next/image` receives as `src`. Next.js fetches the image from the CDN, transforms it (WebP/AVIF, resize), caches the transformed version in its own cache, and serves it.

### 8.2 Image Transformation via Supabase

For thumbnails generated server-side (see §3.4), use Supabase's built-in image transformation API to avoid running Sharp in an Edge Function:

```typescript
const thumbnailUrl = supabase.storage
  .from('wedding-photos')
  .getPublicUrl(`originals/${photoId}.jpg`, {
    transform: {
      width: 400,
      height: 300,
      resize: 'cover',
      format: 'webp',
      quality: 75,
    },
  }).data.publicUrl;
```

> [!NOTE]
> Supabase image transformations require the **Pro plan**. On the free plan, serve pre-generated thumbnail files instead.

### 8.3 Cache-Control for Storage Assets

Public storage assets are served with `Cache-Control: public, max-age=3600` by default. For stable assets (originals that never change once uploaded), consider setting a longer TTL using a custom cache header via Supabase Storage policies.

### 8.4 Upload Size Limits

Enforce upload size limits on the client before uploading to avoid wasting bandwidth:

```typescript
const MAX_FILE_SIZE_MB = 20;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

if (file.size > MAX_FILE_SIZE_BYTES) {
  throw new Error(`File size must be under ${MAX_FILE_SIZE_MB}MB`);
}
```

Also configure Supabase Storage bucket limits in the Dashboard to enforce server-side.

---

## 9. Third-Party Script Loading Strategy

### 9.1 Stripe.js

Stripe requires its JS to be loaded from `js.stripe.com`. Load it **only on pages that display payment UI** (pricing page, checkout, billing dashboard), not on every page.

```typescript
// Use next/script with strategy="lazyOnload" where payment UI is optional
// Use strategy="afterInteractive" on pages where Stripe is needed promptly

import Script from 'next/script';

// In the billing layout or checkout page only:
<Script
  src="https://js.stripe.com/v3/"
  strategy="afterInteractive"
/>
```

Do **not** add Stripe.js to the root layout — this would load it on the public wedding site pages where it is not needed, adding ~37 KB to every guest's visit.

### 9.2 Analytics

If using Vercel Analytics (recommended — zero external request, built into Vercel infra):

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />      {/* Lightweight, ~1 KB, deferred */}
        <SpeedInsights />  {/* Core Web Vitals collection */}
      </body>
    </html>
  );
}
```

If using a third-party analytics provider (e.g., Plausible, PostHog), use `<Script strategy="lazyOnload">` to ensure the script does not block rendering.

### 9.3 No Intercom / Chat Widgets on Public Sites

Live chat widgets (Intercom, Crisp, etc.) add 100–400 KB to the page and are notorious LCP killers. These widgets **must not** be added to the public wedding site layout. They are acceptable only within the couple's authenticated dashboard.

### 9.4 Google Maps / Embeds

Venue location maps are a common wedding site feature. Google Maps iframe embeds block the main thread and trigger layout shifts.

**Preferred approach — Façade pattern:**

```tsx
// Show a static map image until the user clicks (loads the real embed lazily)
const MapFacade = dynamic(() => import('@/components/MapEmbed'), {
  ssr: false,
  loading: () => <StaticMapPreview venue={venue} />,
});
```

This avoids loading the Google Maps SDK until the guest explicitly interacts with the map.

---

## 10. Core Web Vitals Monitoring

### 10.1 Real User Monitoring (RUM)

**Vercel Speed Insights** collects Core Web Vitals from real visitors using the `web-vitals` library under the hood.

- Reports are available in Vercel Dashboard → **Project → Speed Insights**.
- Segmented by page route, country, device type, and connection speed.
- Shows p75 (75th percentile) values, which is what Google uses for the "Good" classification.

Alert thresholds are configured in Vercel to notify the engineering team when p75 values for any route cross from "Good" into "Needs Improvement."

### 10.2 Lighthouse CI (Lab Data)

Automated Lighthouse runs on every PR via `@lhci/cli`:

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI

on: [pull_request]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - run: pnpm install
      - run: pnpm build
      - run: pnpm start &
      - name: Run Lighthouse CI
        run: |
          pnpm dlx @lhci/cli autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
```

`lighthouserc.js` configuration:

```javascript
module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000/',               // Marketing homepage
        'http://localhost:3000/demo',           // Demo wedding site
        'http://localhost:3000/pricing',        // Pricing page
      ],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'first-contentful-paint': ['error', { maxNumericValue: 1800 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'interactive': ['warn', { maxNumericValue: 3500 }],
      },
    },
    upload: {
      target: 'lhci',
      serverBaseUrl: process.env.LHCI_SERVER_URL,
      token: process.env.LHCI_BUILD_TOKEN,
    },
  },
};
```

### 10.3 Performance Budgets

| Asset Type | Budget |
|---|---|
| Total JavaScript (parsed) | < 200 KB (first load) |
| Total CSS | < 50 KB |
| Hero image (transferred) | < 200 KB |
| Total page weight (initial load) | < 500 KB |
| Number of render-blocking resources | 0 |

These budgets are enforced in `lighthouserc.js` assertions.

---

## 11. Known Performance Risks and Mitigations

### Risk 1 — High-Resolution Photo Uploads Without Pre-processing

**Risk**: Couples upload 10–25 MB JPEG originals. If served directly, these destroy LCP scores for guests.

**Mitigation**: Mandatory server-side thumbnail generation on upload (§3.4). Gallery never renders original URLs directly — always thumbnail or large variant URLs. Original URL is only used in the download flow.

---

### Risk 2 — Unbounded RSVP List on Wedding Site

**Risk**: Popular wedding sites can receive 300+ RSVPs. Rendering all of them in a Server Component in one query blocks the response and produces a massive HTML payload.

**Mitigation**: RSVP counts are shown (e.g., "127 guests attending"), not the full list. The couple's guest management view paginates at 50 per page. No guest list is ever rendered publicly.

---

### Risk 3 — Custom Theme CSS Complexity

**Risk**: If couples can customize colors and fonts extensively, the generated CSS could become large, complex, and render-blocking.

**Mitigation**: Theming is implemented via CSS custom properties (`--color-primary`, `--font-heading`), not dynamically generated CSS files. A single small `<style>` tag with `--color-primary: #C9A96E` inlined in the `<head>` replaces all theming CSS at virtually zero cost.

---

### Risk 4 — Supabase Cold Connections (Serverless)

**Risk**: Next.js Route Handlers are serverless functions. Each invocation may need to establish a new database connection, adding 100–300 ms latency (cold connection overhead).

**Mitigation**: Use Supabase's Transaction Mode connection pooler (port 6543, §5.6 in DEPLOYMENT.md). Transaction mode maintains a warm connection pool and multiplexes serverless invocations over fewer actual DB connections.

---

### Risk 5 — Large Photo Gallery Causing DOM Bloat

**Risk**: A wedding site with 100+ photos renders 100+ `<img>` elements in the DOM, causing memory pressure and scroll jank (high INP).

**Mitigation**: Implement virtual scrolling (e.g., `react-virtual` or `@tanstack/virtual`) for galleries exceeding 24 photos. Render only the visible viewport's worth of images plus a small buffer.

---

### Risk 6 — ISR Stale Content Window

**Risk**: With ISR and `revalidate: 3600`, a guest could see up to 1-hour-old content after a couple saves changes.

**Mitigation**: On-demand revalidation via `revalidatePath()` in the save Server Action reduces this to near-zero in practice. The 1-hour background revalidation is a fallback safety net, not the primary invalidation mechanism.

---

### Risk 7 — Third-Party Fonts Not Loaded via `next/font`

**Risk**: If a designer adds a CSS `@import url('https://fonts.googleapis.com/')`, it triggers a third-party DNS lookup + download that blocks rendering.

**Mitigation**: ESLint rule and code review checklist explicitly prohibit `@import` for Google Fonts. All fonts must go through `next/font/google`. Periodically audit the CSS output for any `@import` statements.

---

*Last updated: September 2026 · EverAfter Engineering*
