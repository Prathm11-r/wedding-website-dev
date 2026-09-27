# EverAfter — SEO Strategy

> **Document version:** 1.0  
> **Last updated:** 2026-09-27  
> **Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · Supabase  
> **Primary domain:** `everafter.com`  
> **Couple subdomains:** `[slug].everafter.com` / custom domain (paid tier)

---

## Table of Contents

1. [SEO Goals & KPIs](#1-seo-goals--kpis)
2. [Keyword Strategy](#2-keyword-strategy)
3. [Technical SEO — Next.js 14 Implementation](#3-technical-seo--nextjs-14-implementation)
4. [On-Page SEO Requirements Per Page Type](#4-on-page-seo-requirements-per-page-type)
5. [Structured Data / JSON-LD Schemas](#5-structured-data--json-ld-schemas)
6. [Open Graph & Twitter Card Strategy](#6-open-graph--twitter-card-strategy)
7. [Image SEO](#7-image-seo)
8. [Internal Linking Strategy](#8-internal-linking-strategy)
9. [Blog Content Strategy — V1 Article Pipeline](#9-blog-content-strategy--v1-article-pipeline)
10. [Performance as an SEO Factor](#10-performance-as-an-seo-factor)
11. [Multi-Tenant SEO — Couple Subdomains](#11-multi-tenant-seo--couple-subdomains)
12. [International SEO](#12-international-seo)

---

## 1. SEO Goals & KPIs

### Primary Goals

| Priority | Goal | Rationale |
|----------|------|-----------|
| P0 | Rank top-5 for `wedding website builder` (US, UK, AU) | Highest-intent category keyword; direct pipeline to free signups |
| P0 | Rank top-3 for `free wedding website` | Free tier acquisition; enormous search volume globally |
| P1 | Rank top-5 for `online wedding RSVP` and variants | Feature-specific keyword; attracts couples mid-planning |
| P1 | Own branded SERPs for `EverAfter wedding` | Brand trust, prevent competitor bidding on brand |
| P2 | Drive 20 % of total signups from organic within 12 months | SEO as a sustainable, cost-efficient acquisition channel |
| P2 | Establish topical authority in the "wedding planning tools" niche | Blog + supporting pages build E-E-A-T signals over time |

### Measurable KPIs

| KPI | Baseline (month 0) | Target (month 6) | Target (month 12) |
|-----|-------------------|-----------------|------------------|
| Organic sessions / month | — | 15,000 | 60,000 |
| Keyword rankings in top-10 (tracked set) | — | 25 | 80 |
| Organic-attributed free signups | — | 300 / mo | 1,200 / mo |
| Domain Rating (Ahrefs) | — | 25 | 45 |
| Core Web Vitals pass rate (GSC) | — | 90 % | 98 % |
| Indexed pages (marketing site) | — | 50 | 200+ (blog) |
| Click-through rate (avg. GSC) | — | 3.5 % | 5 % |

### Tracking Infrastructure

- **Google Search Console** — primary source of truth for indexing and ranking data
- **Google Analytics 4** — organic session attribution, signup conversion funnels
- **Ahrefs / Semrush** — keyword tracking, backlink monitoring, competitor gap analysis
- **Vercel Analytics + Speed Insights** — Core Web Vitals per route
- Weekly automated rank-tracking report for 50-keyword seed set

---

## 2. Keyword Strategy

### 2.1 Primary Keywords (Transactional / High Intent)

These keywords should be the focus of the homepage, pricing page, and core feature pages. They drive direct conversion.

| Keyword | Monthly Volume (US) | Difficulty | Intent | Target Page |
|---------|-------------------|------------|--------|-------------|
| `wedding website builder` | 33,100 | 72 | Commercial | Homepage |
| `free wedding website` | 27,200 | 68 | Commercial | Homepage |
| `create wedding website` | 8,100 | 65 | Transactional | Homepage |
| `best wedding website builder` | 5,400 | 60 | Commercial investigation | Comparison/Feature page |
| `wedding website templates` | 6,600 | 58 | Commercial | Theme gallery |
| `custom wedding website` | 2,900 | 55 | Commercial | Pricing / Custom domain page |
| `wedding RSVP online` | 4,400 | 45 | Transactional | RSVP feature page |

> [!IMPORTANT]
> Volumes are US estimates. Replicate keyword research for UK (`en-GB`), AU (`en-AU`), CA (`en-CA`), IN (`en-IN`) before finalizing hreflang targets. See §12.

### 2.2 Secondary Keywords (Feature / Informational)

These map to individual feature and landing pages. Easier to rank; builds topical depth.

| Keyword | Volume | Target Page |
|---------|--------|-------------|
| `wedding planner tool` | 3,600 | Planner feature page |
| `wedding RSVP tracker` | 1,900 | RSVP feature page |
| `wedding website with RSVP` | 2,200 | RSVP feature page |
| `wedding countdown website` | 1,300 | Features overview |
| `password protected wedding website` | 1,000 | Privacy feature page |
| `wedding gift registry website` | 2,400 | Registry integration page |
| `wedding website examples` | 4,800 | Theme gallery / showcase |
| `wedding day timeline planner` | 1,600 | Planner feature page |
| `how to make a wedding website` | 5,400 | Blog / how-to guide |
| `wedding website cost` | 2,200 | Pricing page |

### 2.3 Long-Tail Opportunities

Long-tail keywords have lower volume but significantly higher conversion rates. These are ideal for blog posts and FAQ content.

| Keyword | Volume | Content Type |
|---------|--------|--------------|
| `how to create a free wedding website` | 880 | Blog how-to |
| `wedding website builder no coding required` | 390 | Blog / feature page |
| `can guests RSVP on a wedding website` | 590 | FAQ / Blog |
| `best free wedding website builder 2026` | 1,200 | Blog comparison |
| `how to share wedding website with guests` | 720 | Blog how-to |
| `wedding website with photo gallery` | 480 | Features page |
| `wedding website with custom domain` | 430 | Pricing / Blog |
| `how to password protect wedding website` | 390 | Blog how-to |
| `wedding website QR code` | 1,100 | Blog how-to |
| `how early to send wedding website link` | 590 | Blog advice |
| `wedding website wording examples` | 1,900 | Blog templates |
| `multilingual wedding website` | 210 | Blog / Feature page |

### 2.4 Competitor Landscape

Key direct competitors and their dominant keywords:

| Competitor | Core Strength | Keywords They Own | Gap Opportunity for EverAfter |
|---|---|---|---|
| **Zola** | Brand awareness, registry | `wedding website`, `zola wedding` | Better free tier, superior builder UX |
| **The Knot** | Domain authority, content | `wedding planning`, `wedding websites` | Modern stack (faster CWV), cleaner UX |
| **Squarespace** | Design quality | `beautiful wedding website` | Wedding-specific templates; RSVP built-in |
| **Minted** | Premium design | `wedding website design` | Cost-effective; freemium entry |
| **Joy** | Guest experience | `guest app wedding` | Broader planner tools |
| **Withjoy** | Modern UI | `wedding website free` | International reach, multilingual |

**Differentiation angles to exploit in content:**
- `free forever` tier (not trial-gated)
- No-code builder with genuinely modern templates
- RSVP + meal selection built-in
- Custom domain on paid plan (unlike most free tiers)
- Privacy controls (password protection)

---

## 3. Technical SEO — Next.js 14 Implementation

### 3.1 Metadata API (`generateMetadata`)

Use Next.js 14's `generateMetadata` export on every `page.tsx`. Never use legacy `<Head>` from `next/head` in the App Router.

#### Static page example (`app/(marketing)/page.tsx`)

```typescript
// app/(marketing)/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EverAfter — Free Wedding Website Builder",
  description:
    "Create a beautiful, free wedding website in minutes. Built-in RSVP, photo gallery, countdown, and gift registry. No coding required.",
  alternates: {
    canonical: "https://everafter.com",
    languages: {
      "en-US": "https://everafter.com",
      "en-GB": "https://everafter.com/uk",
      "en-AU": "https://everafter.com/au",
    },
  },
  openGraph: {
    title: "EverAfter — Free Wedding Website Builder",
    description:
      "Create a beautiful, free wedding website in minutes. RSVP, photo gallery, countdown & more.",
    url: "https://everafter.com",
    siteName: "EverAfter",
    images: [
      {
        url: "https://everafter.com/og/home.jpg",
        width: 1200,
        height: 630,
        alt: "EverAfter wedding website builder — screenshot of a beautiful couple's site",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EverAfter — Free Wedding Website Builder",
    description:
      "Create a free wedding website with RSVP, gallery, and more.",
    images: ["https://everafter.com/og/home.jpg"],
    creator: "@everafterhq",
  },
};
```

#### Dynamic page example (blog post)

```typescript
// app/(marketing)/blog/[slug]/page.tsx
import type { Metadata } from "next";
import { getPostBySlug } from "@/lib/blog";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) return { title: "Not Found" };

  return {
    title: `${post.title} | EverAfter Blog`,
    description: post.excerpt,
    alternates: {
      canonical: `https://everafter.com/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [`https://everafter.com/authors/${post.author.slug}`],
      images: [
        {
          url: post.ogImage ?? "https://everafter.com/og/blog-default.jpg",
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
  };
}
```

> [!NOTE]
> `generateMetadata` runs server-side on every request unless the route is statically generated. For blog posts, use `generateStaticParams` + `revalidate` (ISR) so metadata is pre-rendered and cached at the CDN edge.

### 3.2 `robots.txt`

Serve from `app/robots.ts` (Next.js 14 native):

```typescript
// app/robots.ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Allow all bots on the marketing site
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",        // API routes — no value to crawlers
          "/dashboard/",  // Authenticated app — keep out of index
          "/auth/",       // Auth flows
          "/_next/",      // Next.js internals
          "/admin/",      // Internal tooling
        ],
      },
      {
        // Block GPTBot and similar AI scrapers (optional, review policy)
        userAgent: ["GPTBot", "ChatGPT-User", "CCBot"],
        disallow: "/",
      },
    ],
    sitemap: "https://everafter.com/sitemap.xml",
    host: "https://everafter.com",
  };
}
```

> [!IMPORTANT]
> Couple subdomains (`[name].everafter.com`) require their **own** `robots.txt` served from each subdomain origin. See §11 for subdomain indexing policy.

### 3.3 `sitemap.xml` — Static + Dynamic (Blog)

Split sitemaps for maintainability. Reference all from a sitemap index.

#### Sitemap index (`app/sitemap.ts`)

```typescript
// app/sitemap.ts
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://everafter.com";
  const now = new Date();

  // Static marketing pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${base}/features`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/features/rsvp`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/features/planner`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/features/gallery`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/features/custom-domain`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/themes`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
  ];

  return staticPages;
}
```

#### Dynamic blog sitemap (`app/blog-sitemap.ts`)

```typescript
// app/blog-sitemap.ts — registered in next.config.ts under generateSitemaps
import type { MetadataRoute } from "next";
import { getAllPublishedPosts } from "@/lib/blog";

export default async function blogSitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPublishedPosts();

  return posts.map((post) => ({
    url: `https://everafter.com/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));
}
```

> [!TIP]
> For sites with > 50,000 URLs, use Next.js `generateSitemaps()` to split into paginated sitemaps. The blog is unlikely to hit this limit in v1, but plan for it.

### 3.4 Canonical URL Strategy

| Scenario | Canonical Behaviour |
|----------|-------------------|
| Homepage | `https://everafter.com` (no trailing slash) |
| Marketing pages | Self-referencing canonical on every page |
| Blog post | `https://everafter.com/blog/[slug]` |
| Theme preview page | Canonical to the main themes gallery (avoid duplicate theme variant pages being indexed) |
| Paginated blog (`/blog?page=2`) | Canonical → `/blog` (page 1); use `rel=prev/next` in link headers |
| Couple subdomain pages | `noindex` + canonical pointing to subdomain itself (see §11) |
| `www` redirect | 301 `www.everafter.com` → `everafter.com` (handled at DNS/CDN level) |
| HTTP → HTTPS | 301 enforced at Vercel edge |

**Never allow:**
- Parameter-based duplicate pages (`/themes?color=blush` vs `/themes`) to be indexed without canonical
- Both `everafter.com/` and `everafter.com` to resolve as separate pages (enforce no trailing slash in `next.config.ts`)

```typescript
// next.config.ts
const nextConfig = {
  trailingSlash: false,
  async redirects() {
    return [
      {
        source: "/:path+/",
        destination: "/:path+",
        permanent: true,
      },
    ];
  },
};
```

### 3.5 URL Structure

All URLs should be lowercase, hyphen-separated, and semantically meaningful.

```
everafter.com/                        ← Homepage
everafter.com/features/               ← Features hub
everafter.com/features/rsvp           ← RSVP feature
everafter.com/features/planner        ← Planner feature
everafter.com/features/gallery        ← Photo gallery feature
everafter.com/features/custom-domain  ← Custom domain feature
everafter.com/features/privacy        ← Password protection feature
everafter.com/themes/                 ← Theme gallery hub
everafter.com/themes/[theme-slug]     ← Individual theme preview
everafter.com/pricing/                ← Pricing page
everafter.com/blog/                   ← Blog index
everafter.com/blog/[slug]             ← Blog post
everafter.com/authors/[slug]          ← Author profile (E-E-A-T)
everafter.com/compare/[competitor]    ← Competitor comparison pages
everafter.com/wedding-website-examples ← Showcase / social proof
everafter.com/about
everafter.com/contact
everafter.com/privacy
everafter.com/terms
```

**App routes (not indexed):**
```
everafter.com/dashboard/*
everafter.com/auth/*
everafter.com/onboarding/*
```

---

## 4. On-Page SEO Requirements Per Page Type

### 4.1 Homepage (`/`)

| Element | Requirement |
|---------|-------------|
| `<title>` | `EverAfter — Free Wedding Website Builder` (≤ 60 chars) |
| Meta description | Lead with primary keyword; highlight free tier + key features (≤ 155 chars) |
| H1 | One `<h1>` containing `wedding website builder`; should be the hero headline |
| H2s | Feature sections: "Free RSVP Management", "Beautiful Templates", "Custom Domain", "Wedding Planner" |
| Above-the-fold CTA | "Create Your Free Wedding Website" — no login wall before seeing value |
| Social proof | Review count + star rating (feeds into `AggregateRating` schema) |
| Hero image | Real screenshot of a couple's site; alt text: `"EverAfter wedding website builder – [Theme Name] theme example"` |
| Internal links | Link to `/features`, `/themes`, `/pricing`, `/blog` from homepage |
| Word count | Minimum 400 words of meaningful on-page copy (not just UI labels) |
| FAQ section | 4–6 common questions (feeds into `FAQPage` JSON-LD) |

### 4.2 Feature Pages (`/features/[feature]`)

Each feature gets its own dedicated landing page — not a single long page. This allows individual ranking per feature keyword.

| Element | Requirement |
|---------|-------------|
| `<title>` | `[Feature Name] for Your Wedding Website | EverAfter` |
| H1 | Feature-specific: `"Online Wedding RSVP — Collect RSVPs Instantly"` |
| H2 structure | How it works → Key capabilities → Why couples love it → FAQ |
| Screenshots | Annotated screenshots of the feature in use; descriptive alt text |
| CTA | Primary: "Try it free" → `/auth/signup`; Secondary: link to Pricing page |
| Feature comparison table | EverAfter vs. competitors on that specific feature |
| FAQ | 3–5 questions specific to the feature (FAQPage schema) |

### 4.3 Pricing Page (`/pricing`)

| Element | Requirement |
|---------|-------------|
| `<title>` | `Wedding Website Pricing — Free & Premium Plans | EverAfter` |
| H1 | `"Simple, Transparent Wedding Website Pricing"` |
| Tier names | Free / Premium / Unlimited (or equivalent) — named consistently |
| Feature comparison table | Full feature matrix across tiers |
| FAQ section | Address: "Is it really free?", "Can I upgrade later?", "What's included in free?" |
| Schema | `FAQPage` JSON-LD for pricing FAQs |
| No `noindex` | Pricing page must be indexed; it targets `wedding website cost` keywords |
| Money-back guarantee | If applicable, clearly stated (trust signal + conversion) |

### 4.4 Theme Gallery (`/themes`)

| Element | Requirement |
|---------|-------------|
| `<title>` | `Wedding Website Templates & Themes | EverAfter` |
| H1 | `"Beautiful Wedding Website Templates"` |
| Filter UX | Category filters (Romantic, Modern, Rustic, Minimalist, etc.) — use URL params with canonical to hub |
| Individual theme pages | `/themes/[slug]` — each indexable with unique title/description/screenshot |
| Theme alt text | `"[Theme Name] wedding website template — [Style] design"` |
| Schema | `ItemList` schema listing top 6 featured themes on the hub page |
| Copy depth | Brief description of each theme's design language and who it suits |

### 4.5 Blog Posts (`/blog/[slug]`)

| Element | Requirement |
|---------|-------------|
| `<title>` | Primary keyword-rich title (≤ 60 chars) |
| Meta description | Hand-written; includes primary keyword; entices click (≤ 155 chars) |
| H1 | Matches or closely follows `<title>` |
| H2 / H3 | Logical hierarchy; H2s should address sub-questions users have |
| Author block | Name, role, avatar — links to `/authors/[slug]` (E-E-A-T) |
| Published + updated dates | Displayed; reflected in `<meta>` and JSON-LD |
| Word count | Minimum 1,200 words for pillar posts; 600–800 for short how-tos |
| Internal links | At least 3 contextual links to other blog posts or feature pages |
| CTA | Inline CTA mid-post and sticky bottom CTA: "Create your free wedding website →" |
| Schema | `Article` JSON-LD (see §5) |
| Table of contents | For posts > 1,000 words; boosts `sitelinks` and reduces bounce |
| Estimated read time | Displayed in header (trust + engagement) |
| OG image | Custom per-post OG image (not generic fallback) |

### 4.6 Planner Landing Page (`/features/planner`)

| Element | Requirement |
|---------|-------------|
| `<title>` | `Wedding Planner Tool — Stay Organised Online | EverAfter` |
| H1 | `"Your All-in-One Wedding Planner"` |
| H2s | Timeline builder, Task checklist, Vendor tracking, Budget overview |
| Comparison | Planner vs. spreadsheets / generic tools |
| FAQ | "Is the planner free?", "Can my partner access it?", "Does it integrate with my website?" |
| Video or animated demo | High engagement; reduces bounce rate |

---

## 5. Structured Data / JSON-LD Schemas

All JSON-LD should be injected server-side as `<script type="application/ld+json">` within the `<head>` using a shared `JsonLd` React server component.

```typescript
// components/JsonLd.tsx
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
```

### 5.1 `SoftwareApplication` Schema — Homepage

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "EverAfter",
  "url": "https://everafter.com",
  "description": "Free wedding website builder with RSVP, photo gallery, planner, and custom domain support.",
  "applicationCategory": "LifestyleApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "description": "Free plan — create your wedding website at no cost."
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "1240",
    "bestRating": "5",
    "worstRating": "1"
  },
  "featureList": [
    "Free wedding website creation",
    "Online RSVP management",
    "Photo gallery",
    "Wedding countdown timer",
    "Gift registry integration",
    "Custom domain support",
    "Password protection",
    "Wedding planner & timeline"
  ]
}
```

> [!CAUTION]
> Only use real `reviewCount` and `ratingValue` pulled from your database. Fabricating review data violates Google's structured data guidelines and can result in a manual penalty.

### 5.2 `Article` Schema — Blog Posts

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "How to Create a Free Wedding Website in 10 Minutes",
  "description": "Step-by-step guide to building a beautiful wedding website for free using EverAfter.",
  "image": "https://everafter.com/blog/images/create-free-wedding-website.jpg",
  "datePublished": "2026-09-01T08:00:00+00:00",
  "dateModified": "2026-09-27T12:00:00+00:00",
  "author": {
    "@type": "Person",
    "name": "Sarah Mitchell",
    "url": "https://everafter.com/authors/sarah-mitchell",
    "sameAs": ["https://linkedin.com/in/sarahmitchell"]
  },
  "publisher": {
    "@type": "Organization",
    "name": "EverAfter",
    "logo": {
      "@type": "ImageObject",
      "url": "https://everafter.com/logo.png",
      "width": 200,
      "height": 60
    }
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://everafter.com/blog/create-free-wedding-website"
  }
}
```

### 5.3 `FAQPage` Schema

Apply to: Homepage FAQ, Pricing FAQ, Feature page FAQs.

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Is EverAfter really free?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. EverAfter's Free plan lets you create a fully functional wedding website at no cost, with no trial period. You only pay if you want premium features like a custom domain or priority support."
      }
    },
    {
      "@type": "Question",
      "name": "Can guests RSVP directly on my wedding website?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Absolutely. EverAfter includes a built-in RSVP system on all plans — free and paid. Guests can confirm attendance, choose meal preferences, and leave a note, all in one place."
      }
    },
    {
      "@type": "Question",
      "name": "Can I use my own domain name?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Custom domains (e.g., sarah-and-james.com) are available on our paid plans. On the free plan, your site is accessible at [yournames].everafter.com."
      }
    },
    {
      "@type": "Question",
      "name": "How long does it take to create a wedding website?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Most couples have a beautiful, live wedding website within 10 minutes. Simply choose a template, add your details, and share the link — no coding required."
      }
    }
  ]
}
```

### 5.4 `BreadcrumbList` Schema

Apply to all pages below the homepage level. Generate dynamically from the URL path.

```typescript
// lib/seo/breadcrumbs.ts
export function buildBreadcrumbSchema(
  crumbs: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

// Example usage for /blog/create-free-wedding-website:
// buildBreadcrumbSchema([
//   { name: "Home", url: "https://everafter.com" },
//   { name: "Blog", url: "https://everafter.com/blog" },
//   { name: "How to Create a Free Wedding Website", url: "https://everafter.com/blog/create-free-wedding-website" },
// ])
```

### 5.5 Additional Schemas to Consider (Phase 2)

| Schema | Apply To | Benefit |
|--------|----------|---------|
| `Organization` | Homepage | Brand knowledge panel in Google |
| `WebSite` with `SearchAction` | Homepage | Sitelinks searchbox in SERPs |
| `HowTo` | Tutorial blog posts | Rich result with step-by-step display |
| `VideoObject` | Feature pages with video demos | Video carousel in SERPs |
| `ItemList` | Theme gallery hub, blog index | Carousel-style rich results |
| `Review` | Testimonials section | Star snippet visibility |

---

## 6. Open Graph & Twitter Card Strategy

### Core Principles

1. **Every page gets a unique OG image** — never rely on the generic fallback for key pages.
2. OG images: **1200 × 630 px** (Facebook/LinkedIn optimal); Twitter large cards: **1200 × 628 px**.
3. Generate OG images server-side using `@vercel/og` (Edge Runtime) for dynamic blog posts.
4. Static marketing page OG images: pre-designed in Figma, exported as optimised JPGs.

### Dynamic OG Image Generation

```typescript
// app/blog/[slug]/opengraph-image.tsx
import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/lib/blog";

export const runtime = "edge";
export const alt = "EverAfter Blog";
export const size = { width: 1200, height: 630 };
export const contentType = "image/jpeg";

export default async function OGImage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPostBySlug(params.slug);

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #fff5f7 0%, #fce7f3 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "60px",
        }}
      >
        <p style={{ fontSize: 28, color: "#9d174d", marginBottom: 16 }}>
          EverAfter Blog
        </p>
        <h1 style={{ fontSize: 56, fontWeight: 700, color: "#1f2937", lineHeight: 1.2 }}>
          {post?.title ?? "EverAfter"}
        </h1>
      </div>
    ),
    { ...size }
  );
}
```

### OG Tag Checklist Per Page Type

| Tag | Homepage | Blog Post | Theme Page | Pricing |
|-----|----------|-----------|------------|---------|
| `og:title` | ✅ Unique | ✅ Unique | ✅ Unique | ✅ Unique |
| `og:description` | ✅ | ✅ | ✅ | ✅ |
| `og:image` | ✅ Pre-designed | ✅ Generated | ✅ Theme screenshot | ✅ Pre-designed |
| `og:url` | ✅ Canonical | ✅ Canonical | ✅ Canonical | ✅ Canonical |
| `og:type` | `website` | `article` | `website` | `website` |
| `article:published_time` | ❌ | ✅ | ❌ | ❌ |
| `twitter:card` | `summary_large_image` | `summary_large_image` | `summary_large_image` | `summary_large_image` |
| `twitter:creator` | `@everafterhq` | Author handle (if set) | `@everafterhq` | `@everafterhq` |

---

## 7. Image SEO

### Core Rules

1. **Always use `next/image`** for all images in the marketing site. The `<img>` tag is forbidden except in third-party embeds.
2. **`alt` text is mandatory** — the `alt=""` empty string is only valid for decorative images with no informational value.
3. **Filename conventions** — use descriptive, hyphenated filenames before upload: `romantic-boho-wedding-website-template.jpg`, not `IMG_4029.jpg`.
4. **WebP by default** — `next/image` converts to WebP/AVIF automatically. Upload source images as high-quality JPG or PNG.
5. **`priority` prop** — set on every above-the-fold image (hero, LCP candidate). Do not set it on below-the-fold images.

### `alt` Text Guidelines

| Image Type | Alt Text Pattern | Example |
|------------|-----------------|---------|
| Hero screenshot | `"[Product name] — [feature] example"` | `"EverAfter wedding website builder — romantic template example"` |
| Theme preview | `"[Theme name] wedding website template — [style] design"` | `"Dusk Theme wedding website template — minimalist blush design"` |
| Feature screenshot | `"[Feature name] in [product name] — screenshot"` | `"RSVP management dashboard in EverAfter — screenshot"` |
| Blog featured image | Describe the image content literally | `"Couple reviewing their wedding website on a laptop together"` |
| Author avatar | `"[Author name], [role] at EverAfter"` | `"Sarah Mitchell, Content Editor at EverAfter"` |
| Decorative divider / icon | `alt=""` | — |
| Logo | `"EverAfter logo"` | — |

### Component Example

```tsx
// Correct usage — hero image above the fold
<Image
  src="/images/hero-wedding-website-example.jpg"
  alt="EverAfter wedding website builder — beautiful romantic template with RSVP and countdown"
  width={1200}
  height={800}
  priority          // LCP image — must use priority
  quality={85}
  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 80vw, 1200px"
/>

// Correct usage — theme card (below fold, lazy load)
<Image
  src={`/images/themes/${theme.slug}-preview.jpg`}
  alt={`${theme.name} wedding website template — ${theme.style} design`}
  width={600}
  height={400}
  // No priority — lazy loaded by default
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
/>
```

### Image Sitemap

For the blog and theme gallery, add `<image:image>` extensions to the sitemap entries to help Google discover and index images:

```xml
<url>
  <loc>https://everafter.com/themes/dusk</loc>
  <image:image>
    <image:loc>https://everafter.com/images/themes/dusk-preview.jpg</image:loc>
    <image:title>Dusk — Minimalist Wedding Website Template</image:title>
    <image:caption>A soft, blush-toned minimalist wedding website template.</image:caption>
  </image:image>
</url>
```

> [!TIP]
> Image sitemaps are especially valuable for the theme gallery — Google Images can be a meaningful discovery channel for couples searching `wedding website templates`.

---

## 8. Internal Linking Strategy

### Principles

- **Every page must be reachable within 3 clicks** from the homepage.
- **Topic clusters:** Blog posts within the same cluster link to each other and to the relevant feature/landing page (the "pillar"). The pillar page links back to supporting blog posts.
- **Anchor text:** Descriptive and keyword-rich — never use `"click here"` or `"read more"` as the only anchor. Use `"learn how to set up online RSVP"`, `"explore wedding website templates"`, etc.
- **Follow all links** by default. Only `rel="nofollow"` on user-generated external links, sponsored content, or untrusted third-party domains.

### Topic Cluster Map

```
PILLAR: /features/rsvp  ("Online Wedding RSVP")
  └── BLOG: /blog/how-to-set-up-rsvp-wedding-website
  └── BLOG: /blog/rsvp-wording-examples-wedding-website
  └── BLOG: /blog/managing-dietary-requirements-wedding-rsvp
  └── BLOG: /blog/how-many-guests-rsvp-yes-statistics

PILLAR: /features/planner  ("Wedding Planner Tool")
  └── BLOG: /blog/wedding-planning-checklist-18-months
  └── BLOG: /blog/how-to-build-a-wedding-day-timeline
  └── BLOG: /blog/wedding-budget-planning-online

PILLAR: /themes  ("Wedding Website Templates")
  └── BLOG: /blog/how-to-choose-a-wedding-website-template
  └── BLOG: /blog/wedding-website-color-palette-ideas
  └── /themes/[slug] — each links back to /themes hub

PILLAR: / (Homepage)
  └── /features
  └── /pricing
  └── /themes
  └── /blog (→ latest 3 posts)
  └── /wedding-website-examples
```

### Global Navigation Links (in every page via header/footer)

**Header:** Home · Features · Themes · Pricing · Blog · Sign Up (CTA)  
**Footer:** Features · Pricing · Blog · Compare · About · Privacy · Terms · Twitter · Instagram · Pinterest

### Contextual CTA Links (Within Body Copy)

Every blog post and feature page must include:
- **1 × in-line CTA** linked to `/auth/signup` with tracked UTM: `?utm_source=blog&utm_medium=inline-cta&utm_campaign=[post-slug]`
- **1 × related feature page link** contextually within the post body
- **2–4 × internal blog links** to related articles (no orphan posts)

---

## 9. Blog Content Strategy — V1 Article Pipeline

### Topical Pillars

1. **How-to Guides** — practical, search-driven
2. **Wedding Planning Advice** — broader lifestyle/informational intent
3. **Product / Feature Spotlights** — feature-education dressed as helpful content
4. **Comparison & Alternatives** — high-commercial-intent, competitor displacement

### V1 Article List (10 Planned Posts)

| # | Working Title | Target Keyword | Type | Priority |
|---|---------------|----------------|------|----------|
| 1 | **How to Create a Free Wedding Website in 10 Minutes** | `how to create a free wedding website` | How-to | P0 |
| 2 | **The Complete Wedding Planning Checklist (18 Months Before the Big Day)** | `wedding planning checklist` | Guide | P0 |
| 3 | **Best Free Wedding Website Builders in 2026 — Compared** | `best free wedding website builder 2026` | Comparison | P0 |
| 4 | **How to Set Up Online RSVP on Your Wedding Website** | `online wedding RSVP` | How-to | P1 |
| 5 | **30 Wedding Website Wording Examples (Copy & Paste)** | `wedding website wording examples` | Resource | P1 |
| 6 | **How to Share Your Wedding Website With Guests** | `how to share wedding website with guests` | How-to | P1 |
| 7 | **How to Build a Wedding Day Timeline (Free Template)** | `wedding day timeline` | Guide | P1 |
| 8 | **Wedding Website QR Code: How to Create One & Add It to Your Invites** | `wedding website QR code` | How-to | P2 |
| 9 | **Should Your Wedding Website Be Password Protected?** | `password protect wedding website` | Advice | P2 |
| 10 | **EverAfter vs. Zola vs. The Knot — Which Wedding Website Builder Wins in 2026?** | `zola vs the knot wedding website` | Comparison | P2 |

### Content Production Standards

- **Minimum 1,200 words** for pillar / guide posts; 700 words for focused how-tos
- **Original images or screenshots** — no stock photo that appears on competitor sites
- **Factual claims must be sourced** — link to primary sources (studies, statistics)
- **Author bio with photo** — E-E-A-T signal; link to author page
- **Review before publish:** SEO editor checks title tag, meta description, H1, internal links, and schema
- **Update cadence:** Review and refresh all posts older than 12 months; update `dateModified`
- **Publish cadence (v1):** 2 posts/month minimum; scale to 4/month once editorial process is stable

### Content Calendar Guidance

- Prioritise P0 posts immediately — they target the highest-volume keywords and directly support signup conversion.
- Post #3 (comparison) and #10 (competitor comparison) are high-value for capturing bottom-of-funnel searches; do not deprioritise.
- Add a `<!-- TODO: update annually -->` comment in CMS for comparison posts — they go stale quickly.

---

## 10. Performance as an SEO Factor

Google uses Core Web Vitals as a ranking signal. EverAfter's Next.js 14 stack is well-positioned — these are the non-negotiable targets.

### Core Web Vitals Targets

| Metric | Good Threshold | EverAfter Target | Key Risk Areas |
|--------|---------------|-----------------|----------------|
| **LCP** (Largest Contentful Paint) | < 2.5 s | < 1.8 s | Hero image, web fonts |
| **INP** (Interaction to Next Paint) | < 200 ms | < 100 ms | Heavy client-side JS, modals |
| **CLS** (Cumulative Layout Shift) | < 0.1 | < 0.05 | Web fonts, images without dimensions, embeds |

### Implementation Checklist

#### Fonts
```typescript
// app/layout.tsx — use next/font, NEVER self-host manually or use Google Fonts CSS
import { Playfair_Display, Inter } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",  // Prevents FOIT; reduces CLS
  variable: "--font-playfair",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});
```

#### Scripts
- **Google Analytics 4** — load via `next/script` with `strategy="afterInteractive"`. Never in `<head>` directly.
- **Third-party widgets** (chat, review badges) — load with `strategy="lazyOnload"`.
- **No render-blocking scripts** in `<head>` except those required for above-the-fold rendering.

#### Images (Performance)
- `priority` prop on LCP images (hero image, theme hero)
- `placeholder="blur"` on above-the-fold images with `blurDataURL` for perceived performance
- `sizes` prop on all responsive images to prevent oversized downloads on mobile
- Compress all static images via `squoosh` or Figma export before committing

#### Caching & CDN
- Vercel Edge Network is the default CDN — ensure `Cache-Control: public, max-age=31536000, immutable` for static assets
- ISR (`revalidate`) for blog posts: set to `3600` (1 hour) for content freshness without full SSR overhead
- `stale-while-revalidate` pattern for theme gallery pages

#### Monitoring
- Integrate **Vercel Speed Insights** (real-user monitoring) in `app/layout.tsx`
- Set up **GSC Core Web Vitals report** alert thresholds
- Run **Lighthouse CI** in the GitHub Actions pipeline on every PR targeting `main`

```yaml
# .github/workflows/lighthouse.yml (excerpt)
- name: Run Lighthouse CI
  uses: treosh/lighthouse-ci-action@v11
  with:
    urls: |
      https://everafter.com
      https://everafter.com/pricing
      https://everafter.com/themes
    budgetPath: .lighthouserc.json
    uploadArtifacts: true
```

---

## 11. Multi-Tenant SEO — Couple Subdomains

### Architecture Recap

| Plan | URL Pattern | Example |
|------|-------------|---------|
| Free | `[slug].everafter.com` | `sarah-and-james.everafter.com` |
| Paid (Premium+) | Custom domain | `sarah-and-james.com` |

### Indexing Decision: **`noindex` all couple subdomains by default**

#### Rationale

1. **Low SEO value to EverAfter:** A couple's personal wedding site is not a marketing asset for EverAfter. It has no keyword alignment with acquisition goals.
2. **Privacy concerns:** Couples share personal information (venue addresses, family photos, registry links, guest lists) on their wedding site. Indexing this exposes them to unwanted crawling, spam, and privacy risks. This is a **significant trust and legal liability issue** — especially under GDPR and similar regulations.
3. **Duplicate content risk:** Couple sites may contain similar structural content (boilerplate template text, shared headings), which could generate thin/duplicate content signals across hundreds of subdomains.
4. **Canonicalisation complexity:** Managing canonical tags across unbounded user-generated subdomains is operationally expensive and error-prone.
5. **Google's treatment of subdomains:** Google treats subdomains as separate sites. Mass-indexing thin couple subdomains could dilute `everafter.com`'s domain authority signals.

#### Implementation

**Option A — `noindex` via `robots.txt` on each subdomain:**

```
# Served from each [slug].everafter.com
User-agent: *
Disallow: /
```

> This is the simplest and most robust approach. Implement via middleware that serves a dynamic `robots.txt` for any request to `*.everafter.com` that is not the apex domain.

**Option B — `X-Robots-Tag` HTTP header (belt-and-suspenders):**

```typescript
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") ?? "";
  const isCoupleSite =
    hostname.endsWith(".everafter.com") &&
    hostname !== "everafter.com" &&
    hostname !== "www.everafter.com";

  if (isCoupleSite) {
    const response = NextResponse.next();
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    return response;
  }
}
```

> Use **both** Option A and Option B for belt-and-suspenders protection.

#### What About Custom Domains?

For couples on paid plans using their own domain (e.g., `sarah-and-james.com`):

- The couple **owns** that domain and its SEO destiny.
- EverAfter has no obligation to index or manage SEO for it.
- Default: serve `noindex` on custom domains **unless** the couple explicitly opts in (future feature: "Make my site findable on Google" toggle in dashboard).
- Include a `<link rel="me" href="https://everafter.com">` attribution tag if the couple opts in — this attributes the site to EverAfter as builder (brand signal, not SEO-critical).

#### Footer Attribution Link

All couple sites (subdomain and custom domain) should render a small footer link:

```html
<a href="https://everafter.com/?ref=couple-site" rel="nofollow">
  Made with EverAfter
</a>
```

`rel="nofollow"` is correct here — you don't want Google to credit `noindex` pages as link sources. However, this link still drives **referral traffic** to the marketing site, which is the real value.

> [!WARNING]
> Do **not** use `rel="dofollow"` or omit `rel` on couple site footer links. Since couple pages are `noindex`, passing PageRank from them is worthless and could look manipulative if patterns are detected at scale.

---

## 12. International SEO

### Target Markets — Phase 1

| Market | Language | Locale | URL Strategy |
|--------|----------|--------|--------------|
| United States | English | `en-US` | `everafter.com` (default) |
| United Kingdom | English (British) | `en-GB` | `everafter.com/uk` |
| Australia | English (Australian) | `en-AU` | `everafter.com/au` |
| Canada | English | `en-CA` | `everafter.com/ca` |
| India | English | `en-IN` | `everafter.com/in` |

### URL Structure Decision: Subdirectories over Subdomains

Use **country subdirectories** (`everafter.com/uk`) rather than ccTLDs (`everafter.co.uk`) or subdomains (`uk.everafter.com`).

**Rationale:**
- All link equity (backlinks) accrues to the single `everafter.com` domain — critical for a new domain.
- Subdirectories are easier to manage with a single Next.js deployment on Vercel.
- Google treats subdirectories as part of the root domain for ranking purposes.
- ccTLDs require separate domain registrations, separate GSC properties, and separate backlink building. Not worth the overhead for v1.

> [!NOTE]
> English-language variants across US/UK/AU/CA/IN differ primarily in vocabulary and pricing display, not full localisation. The same core content with light copy tweaks (e.g., "colour" vs "color", GBP pricing) is sufficient for v1. Do not build full translation pipelines until non-English markets are targeted.

### `hreflang` Implementation

```typescript
// In generateMetadata for each locale variant
export const metadata: Metadata = {
  alternates: {
    canonical: "https://everafter.com",
    languages: {
      "en-US": "https://everafter.com",
      "en-GB": "https://everafter.com/uk",
      "en-AU": "https://everafter.com/au",
      "en-CA": "https://everafter.com/ca",
      "en-IN": "https://everafter.com/in",
      "x-default": "https://everafter.com",
    },
  },
};
```

This generates the correct `<link rel="alternate" hreflang="...">` tags in the `<head>`.

> [!IMPORTANT]
> `hreflang` must be **reciprocal** — every locale variant must reference all other variants, including itself. Next.js `alternates.languages` handles this automatically when all pages use the same metadata structure.

### `x-default` Strategy

- `x-default` → `https://everafter.com` (US English)
- Presented to users in unsupported locales (e.g., a French user) — they get the US English site
- Do not geo-redirect automatically (violates Google's crawlability guidelines — Googlebot crawls from US IPs and will only ever see the US version if you auto-redirect). Use a **banner** instead: "You're viewing our US site. [Switch to UK →]"

### Phase 2 — Non-English Markets

When expanding to non-English markets (France, Germany, Spain, Brazil, etc.):

| Consideration | Recommendation |
|---------------|---------------|
| Translation | Professional human translation; no machine-only translation for core pages |
| URL structure | Add language subdirectories: `/fr`, `/de`, `/es`, `/pt-BR` |
| `hreflang` | Add locale-specific `hreflang` tags |
| Currency | Display local currency on pricing page; Stripe supports multi-currency |
| Keyword research | Redo full keyword research in target language — do not translate English keywords directly |
| Local backlinks | Prioritise local media, wedding blogs, and directories in each market |
| GSC | Add each locale directory as a separate GSC property with geotargeting set |

### Google Search Console Setup

```
Property: https://everafter.com          ← Root (all locales)
  └── /uk  → Geotarget: United Kingdom
  └── /au  → Geotarget: Australia
  └── /ca  → Geotarget: Canada
  └── /in  → Geotarget: India
```

Set geotargeting per subdirectory using GSC's **International Targeting** tool (`Search Traffic → International Targeting → Country`).

---

## Appendix A — SEO Tooling Recommendations

| Tool | Purpose | Priority |
|------|---------|----------|
| **Google Search Console** | Indexing, ranking, CWV, sitemap submission | Required |
| **Google Analytics 4** | Organic traffic, conversion tracking | Required |
| **Ahrefs** | Keyword research, backlink monitoring, rank tracking | Recommended |
| **Semrush** | Competitor analysis, site audit, content gaps | Optional (or Ahrefs) |
| **Vercel Speed Insights** | Real-user CWV monitoring | Required |
| **Lighthouse CI** | Automated CWV regression in CI/CD | Required |
| **Screaming Frog** | Full site crawl, canonical audit, redirect audit | Recommended |
| **Schema Markup Validator** | Validate JSON-LD before deploy | Required |
| **Rich Results Test** | Verify structured data eligibility | Required |

---

## Appendix B — SEO Launch Checklist

Before going live:

- [ ] `robots.txt` verified — marketing pages allowed, `/dashboard/` and `/api/` disallowed
- [ ] `sitemap.xml` submitted to Google Search Console
- [ ] All marketing pages have unique `<title>` and meta description
- [ ] `<h1>` present and unique on every page
- [ ] No orphan pages (every page reachable via navigation or internal links)
- [ ] Canonical tags on all pages (self-referencing or cross-referencing)
- [ ] JSON-LD schema validated via Rich Results Test
- [ ] OG image renders correctly (test with [opengraph.xyz](https://www.opengraph.xyz))
- [ ] `next/image` used for all images; `alt` text on all non-decorative images
- [ ] `priority` prop on LCP images only
- [ ] Lighthouse score ≥ 90 on Performance, SEO, Accessibility for homepage and pricing page
- [ ] HTTPS enforced; no mixed content
- [ ] Trailing slash redirects configured (no duplicate `page/` vs `page`)
- [ ] `www` → non-www 301 redirect active
- [ ] Couple subdomain `robots.txt` returns `Disallow: /` + `X-Robots-Tag: noindex, nofollow`
- [ ] `hreflang` tags verified via hreflang checker tool
- [ ] GA4 conversion events firing for `signup_complete`, `plan_upgraded`

---

*Owned by: Website CTO / SEO Lead*  
*Review cadence: Quarterly, or after any significant architecture change*
