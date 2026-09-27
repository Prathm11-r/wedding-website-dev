# ADR-004: File Upload & Photo Gallery Architecture

- **Status:** Accepted
- **Date:** 2026-09-27
- **Author:** Website CTO & System Architecture Team
- **Decision Makers:** Website CTO

---

## 1. Context

EverAfter enables couples and their wedding guests to upload photos to a collaborative gallery.
Requirements:
1. Handle concurrent uploads during the wedding reception without overloading the Next.js application server.
2. Enforce storage quotas per subscription tier (Free: 25 photos, Premium: 500 photos, Planner: unlimited).
3. Validate MIME types and prevent malicious payload uploads.
4. Support fast global CDN delivery and responsive image resizing.

---

## 2. Options Considered

### Option A: Direct Client-to-Supabase Storage via Presigned URLs (Selected)
The client requests an upload authorization ticket/presigned URL from a Next.js Server Action (which enforces plan limits and auth), then uploads the binary directly to Supabase Storage (S3-compatible).

- **Pros:**
  - Zero bandwidth load on Vercel function instances.
  - No 4.5MB Vercel serverless request body size limit issues.
  - Native integration with Supabase Row-Level Security and storage policies.
  - Built-in image transformation CDN (`/storage/v1/render/image/...`).
- **Cons:**
  - Requires two-step flow (sign URL -> upload binary -> register photo row in database).

### Option B: Multipart Uploads through Next.js API Routes
Files are sent directly to `/api/upload` route handler which streams to storage.

- **Pros:**
  - Single client request.
- **Cons:**
  - Hits Vercel payload limit (4.5MB).
  - High serverless execution duration and CPU/memory cost.

### Option C: Cloudinary / Uploadthing
Third-party dedicated media service.

- **Pros:**
  - Pre-built React widgets.
- **Cons:**
  - Additional vendor, additional recurring bill, fragmented user data.

---

## 3. Decision

We choose **Option A: Direct Client-to-Supabase Storage via Presigned Signed URLs**.

1. Client triggers `getPhotoUploadUrl(weddingId, filename, mimeType)` Server Action.
2. Server Action validates user quota and permissions, returns a signed upload token.
3. Client uploads directly to the Supabase Storage bucket `wedding-photos`.
4. Client calls `registerUploadedPhoto(metadata)` to record the database entry with `is_approved = true` (or pending moderation if guest upload).

---

## 4. Consequences

- Storage bucket `wedding-photos` configured with RLS and MIME restrictions (`image/jpeg`, `image/png`, `image/webp`, `image/heic`).
- Next.js functions remain lightweight and performant.
