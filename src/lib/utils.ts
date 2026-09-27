import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, isValid, parseISO } from "date-fns";

// ─── Class Name Utility ───────────────────────────────────────────────────────

/**
 * Merges Tailwind CSS class names intelligently, resolving conflicts.
 * Combines clsx (conditional classes) with tailwind-merge (de-duplication).
 *
 * @example
 * cn("px-4 py-2", condition && "bg-primary", "px-6")
 * // → "py-2 bg-primary px-6"  (px-4 is overridden by px-6)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// ─── Date Utilities ───────────────────────────────────────────────────────────

/**
 * Formats a date value into a human-readable string.
 *
 * @param date   - Date object, ISO string, or timestamp number
 * @param fmt    - date-fns format string (default: "MMMM d, yyyy")
 * @returns      Formatted date string, or empty string if date is invalid
 *
 * @example
 * formatDate("2025-06-21")          // → "June 21, 2025"
 * formatDate("2025-06-21", "PPP")   // → "June 21st, 2025"
 * formatDate("2025-06-21", "d MMM") // → "21 Jun"
 */
export function formatDate(
  date: Date | string | number | null | undefined,
  fmt = "MMMM d, yyyy"
): string {
  if (!date) return "";

  const parsed =
    typeof date === "string"
      ? parseISO(date)
      : typeof date === "number"
      ? new Date(date)
      : date;

  if (!isValid(parsed)) return "";

  return format(parsed, fmt);
}

/**
 * Returns a relative time string (e.g. "3 days ago", "in 2 months").
 *
 * @example
 * formatRelativeDate("2025-01-01") // → "about 5 months ago"
 */
export function formatRelativeDate(
  date: Date | string | number | null | undefined
): string {
  if (!date) return "";

  const parsed =
    typeof date === "string"
      ? parseISO(date)
      : typeof date === "number"
      ? new Date(date)
      : date;

  if (!isValid(parsed)) return "";

  return formatDistanceToNow(parsed, { addSuffix: true });
}

// ─── Slug Utilities ───────────────────────────────────────────────────────────

/**
 * Converts a string into a URL-safe slug suitable for wedding site paths
 * and subdomains.
 *
 * Rules:
 * - Lowercase everything
 * - Replace spaces and underscores with hyphens
 * - Strip characters that are not alphanumeric or hyphens
 * - Collapse consecutive hyphens
 * - Trim leading/trailing hyphens
 * - Maximum 63 characters (DNS label limit for subdomain use)
 *
 * @example
 * slugify("Sarah & James")          // → "sarah-james"
 * slugify("The Müller Wedding 2025") // → "the-muller-wedding-2025"
 * slugify("  --hello world--  ")    // → "hello-world"
 */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip diacritics
    .replace(/[&+]/g, "-")           // ampersand / plus → hyphen
    .replace(/[\s_]+/g, "-")         // whitespace / underscore → hyphen
    .replace(/[^a-z0-9-]/g, "")      // remove non-alphanumeric (except hyphen)
    .replace(/-+/g, "-")             // collapse consecutive hyphens
    .replace(/^-+|-+$/g, "")         // trim leading/trailing hyphens
    .slice(0, 63);                   // DNS label max length
}

/**
 * Validates that a slug conforms to subdomain naming rules.
 * Returns `true` if the slug is safe for use as a subdomain or URL segment.
 */
export function isValidSlug(slug: string): boolean {
  if (!slug || slug.length < 3 || slug.length > 63) return false;
  // Must start and end with alphanumeric; only alphanumeric + hyphens in between
  return /^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$/.test(slug);
}

// ─── String Utilities ─────────────────────────────────────────────────────────

/**
 * Truncates a string to `maxLength` characters, appending an ellipsis if
 * truncated. Respects word boundaries to avoid cutting mid-word.
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength).replace(/\s+\S*$/, "") + "…";
}

/**
 * Capitalises the first letter of each word in a string.
 *
 * @example
 * titleCase("sarah and james") // → "Sarah And James"
 */
export function titleCase(str: string): string {
  return str.replace(
    /\w\S*/g,
    (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  );
}

// ─── Number / Currency Utilities ──────────────────────────────────────────────

/**
 * Formats a Stripe amount (stored in cents) to a display currency string.
 *
 * @example
 * formatCurrency(2999)          // → "$29.99"
 * formatCurrency(9900, "GBP")   // → "£99.00"
 */
export function formatCurrency(
  amountInCents: number,
  currency = "USD",
  locale = "en-US"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amountInCents / 100);
}

// ─── URL Utilities ────────────────────────────────────────────────────────────

/**
 * Returns the public URL of a wedding site given its slug.
 * In production: https://{slug}.everafter.com
 * In development: http://localhost:3000/wedding/{slug}
 */
export function getWeddingUrl(slug: string): string {
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "everafter.com";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  if (appUrl.startsWith("http://localhost")) {
    return `${appUrl}/wedding/${slug}`;
  }

  return `https://${slug}.${rootDomain}`;
}

/**
 * Returns the absolute URL for the authenticated app dashboard.
 */
export function getAppUrl(path = ""): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const appSubdomain = process.env.NEXT_PUBLIC_APP_SUBDOMAIN ?? "app";
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "everafter.com";

  if (appUrl.startsWith("http://localhost")) {
    return `${appUrl}${path}`;
  }

  return `https://${appSubdomain}.${rootDomain}${path}`;
}
