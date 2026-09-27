// ─────────────────────────────────────────────────────────────────────────────
// Common domain types for the EverAfter application.
// These are shared across client and server code.
// ─────────────────────────────────────────────────────────────────────────────

// ─── Subscription & Billing ───────────────────────────────────────────────────

/**
 * The three subscription tiers available in EverAfter.
 *
 * - free:      Limited features, single wedding site, no custom domain
 * - essential: Core builder features, custom domain, email invitations
 * - beloved:   Unlimited guests, advanced templates, priority support
 * - forever:   White-label, multiple sites, dedicated account manager
 */
export type SubscriptionTier = "free" | "essential" | "beloved" | "forever";

export const SUBSCRIPTION_TIERS: Record<
  SubscriptionTier,
  { label: string; order: number }
> = {
  free:      { label: "Free",      order: 0 },
  essential: { label: "Essential", order: 1 },
  beloved:   { label: "Beloved",   order: 2 },
  forever:   { label: "Forever",   order: 3 },
};

/** Returns true if `tier` is at or above `minimumTier` in the upgrade ladder. */
export function hasMinimumTier(
  tier: SubscriptionTier,
  minimumTier: SubscriptionTier
): boolean {
  return SUBSCRIPTION_TIERS[tier].order >= SUBSCRIPTION_TIERS[minimumTier].order;
}

export type SubscriptionStatus =
  | "active"
  | "trialing"
  | "past_due"
  | "canceled"
  | "unpaid"
  | "incomplete"
  | "incomplete_expired"
  | "paused";

// ─── User & Auth ──────────────────────────────────────────────────────────────

/**
 * Role a user holds within the context of a specific wedding.
 *
 * - owner:  The couple (or one partner) who created the wedding site
 * - editor: A trusted planner / collaborator with full edit access
 * - viewer: Read-only access (e.g. a coordinator reviewing the site)
 */
export type UserRole = "owner" | "editor" | "viewer";

// ─── Wedding ──────────────────────────────────────────────────────────────────

export type WeddingStatus = "draft" | "published" | "archived";

export type WeddingTheme =
  | "classic"
  | "botanical"
  | "modern"
  | "rustic"
  | "coastal"
  | "minimalist";

// ─── RSVP & Guests ────────────────────────────────────────────────────────────

export type RSVPStatus = "pending" | "attending" | "declined" | "maybe";

export type MealPreference = "standard" | "vegetarian" | "vegan" | "gluten_free" | "other";

export type GuestRelationship =
  | "bride_family"
  | "groom_family"
  | "bride_friend"
  | "groom_friend"
  | "mutual_friend"
  | "colleague"
  | "other";

// ─── Website Builder ──────────────────────────────────────────────────────────

export type PageSectionType =
  | "hero"
  | "our_story"
  | "wedding_party"
  | "schedule"
  | "venue"
  | "gallery"
  | "registry"
  | "travel_accommodation"
  | "faq"
  | "rsvp"
  | "custom";

// ─── API Responses ────────────────────────────────────────────────────────────

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface PaginationParams {
  page: number;
  perPage: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// ─── Navigation ───────────────────────────────────────────────────────────────

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  badge?: string | number;
  children?: NavItem[];
}

// ─── Feature Flags ────────────────────────────────────────────────────────────

export interface FeatureFlags {
  customDomain: boolean;
  passwordProtectedSite: boolean;
  guestMessaging: boolean;
  unlimitedGuests: boolean;
  advancedAnalytics: boolean;
  whiteLabelEmails: boolean;
  multipleSites: boolean;
}

/** Returns the feature flags available for a given subscription tier. */
export function getFeatureFlags(tier: SubscriptionTier): FeatureFlags {
  return {
    customDomain:         hasMinimumTier(tier, "essential"),
    passwordProtectedSite: hasMinimumTier(tier, "essential"),
    guestMessaging:       hasMinimumTier(tier, "essential"),
    unlimitedGuests:      hasMinimumTier(tier, "beloved"),
    advancedAnalytics:    hasMinimumTier(tier, "beloved"),
    whiteLabelEmails:     hasMinimumTier(tier, "forever"),
    multipleSites:        hasMinimumTier(tier, "forever"),
  };
}
