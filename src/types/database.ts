// ─────────────────────────────────────────────────────────────────────────────
// Database schema types for EverAfter.
// Generated shape mirrors the Supabase Postgres schema. Update this file
// whenever you run a new migration.
//
// Usage:
//   import type { Database } from "@/types/database";
//   const supabase = createClient<Database>(...);
//   const { data } = await supabase.from("weddings").select("*");
//   // data is typed as Database["public"]["Tables"]["weddings"]["Row"][]
// ─────────────────────────────────────────────────────────────────────────────

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// ─── Top-level Database type (mirrors Supabase generated output shape) ────────

export interface Database {
  public: {
    Tables: {
      profiles:          ProfilesTable;
      weddings:          WeddingsTable;
      wedding_members:   WeddingMembersTable;
      guests:            GuestsTable;
      rsvps:             RsvpsTable;
      guest_groups:      GuestGroupsTable;
      wedding_pages:     WeddingPagesTable;
      page_sections:     PageSectionsTable;
      registry_items:    RegistryItemsTable;
      subscriptions:     SubscriptionsTable;
      custom_domains:    CustomDomainsTable;
      email_invitations: EmailInvitationsTable;
      media_assets:      MediaAssetsTable;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      subscription_tier:  "free" | "essential" | "beloved" | "forever";
      subscription_status: "active" | "trialing" | "past_due" | "canceled" | "unpaid" | "incomplete" | "incomplete_expired" | "paused";
      wedding_status:     "draft" | "published" | "archived";
      rsvp_status:        "pending" | "attending" | "declined" | "maybe";
      user_role:          "owner" | "editor" | "viewer";
      meal_preference:    "standard" | "vegetarian" | "vegan" | "gluten_free" | "other";
      guest_relationship: "bride_family" | "groom_family" | "bride_friend" | "groom_friend" | "mutual_friend" | "colleague" | "other";
      domain_status:      "pending" | "verifying" | "active" | "failed";
      invitation_status:  "queued" | "sent" | "opened" | "bounced";
    };
  };
}

// ─── Table Helpers ────────────────────────────────────────────────────────────

type Tables = Database["public"]["Tables"];
type Enums  = Database["public"]["Enums"];

/** Convenience: the row type returned by SELECT */
export type TableRow<T extends keyof Tables> = Tables[T]["Row"];

/** Convenience: the shape required for INSERT */
export type TableInsert<T extends keyof Tables> = Tables[T]["Insert"];

/** Convenience: the shape accepted by UPDATE */
export type TableUpdate<T extends keyof Tables> = Tables[T]["Update"];

// ─── profiles ─────────────────────────────────────────────────────────────────

interface ProfilesTable {
  Row: {
    id:                 string;           // UUID — matches auth.users.id
    email:             string;
    full_name:         string | null;
    avatar_url:        string | null;
    stripe_customer_id: string | null;
    created_at:        string;            // ISO 8601
    updated_at:        string;
  };
  Insert: {
    id:                 string;
    email:             string;
    full_name?:        string | null;
    avatar_url?:       string | null;
    stripe_customer_id?: string | null;
    created_at?:       string;
    updated_at?:       string;
  };
  Update: Partial<Omit<ProfilesTable["Insert"], "id">>;
}

// ─── weddings ─────────────────────────────────────────────────────────────────

interface WeddingsTable {
  Row: {
    id:                    string;        // UUID
    slug:                  string;        // URL-safe, unique across platform
    partner_one_name:      string;
    partner_two_name:      string;
    wedding_date:          string | null; // ISO 8601 date
    location:              string | null;
    short_description:     string | null;
    cover_image_url:       string | null;
    theme:                 Enums["wedding_status"] | null;  // kept loose for now
    status:                Enums["wedding_status"];
    password_hash:         string | null; // bcrypt hash if site is password-protected
    rsvp_deadline:         string | null;
    timezone:              string;        // IANA timezone, e.g. "America/New_York"
    locale:                string;        // BCP 47, e.g. "en-US"
    guest_limit:           number | null; // null = unlimited (paid tiers)
    custom_domain_id:      string | null;
    metadata:              Json;          // theme-specific custom settings
    created_by:            string;        // profile.id of the owner
    created_at:            string;
    updated_at:            string;
  };
  Insert: {
    id?:                   string;
    slug:                  string;
    partner_one_name:      string;
    partner_two_name:      string;
    wedding_date?:         string | null;
    location?:             string | null;
    short_description?:    string | null;
    cover_image_url?:      string | null;
    theme?:                string | null;
    status?:               Enums["wedding_status"];
    password_hash?:        string | null;
    rsvp_deadline?:        string | null;
    timezone?:             string;
    locale?:               string;
    guest_limit?:          number | null;
    custom_domain_id?:     string | null;
    metadata?:             Json;
    created_by:            string;
    created_at?:           string;
    updated_at?:           string;
  };
  Update: Partial<Omit<WeddingsTable["Insert"], "id" | "created_by">>;
}

// ─── wedding_members ──────────────────────────────────────────────────────────

interface WeddingMembersTable {
  Row: {
    id:          string;
    wedding_id:  string;
    profile_id:  string;
    role:        Enums["user_role"];
    created_at:  string;
  };
  Insert: {
    id?:         string;
    wedding_id:  string;
    profile_id:  string;
    role?:       Enums["user_role"];
    created_at?: string;
  };
  Update: Partial<Pick<WeddingMembersTable["Insert"], "role">>;
}

// ─── guests ───────────────────────────────────────────────────────────────────

interface GuestsTable {
  Row: {
    id:               string;
    wedding_id:       string;
    guest_group_id:   string | null;
    first_name:       string;
    last_name:        string | null;
    email:            string | null;
    phone:            string | null;
    relationship:     Enums["guest_relationship"] | null;
    is_plus_one:      boolean;
    plus_one_of:      string | null;     // guest.id they are a +1 for
    table_number:     number | null;
    dietary_notes:    string | null;
    internal_notes:   string | null;
    created_at:       string;
    updated_at:       string;
  };
  Insert: {
    id?:              string;
    wedding_id:       string;
    guest_group_id?:  string | null;
    first_name:       string;
    last_name?:       string | null;
    email?:           string | null;
    phone?:           string | null;
    relationship?:    Enums["guest_relationship"] | null;
    is_plus_one?:     boolean;
    plus_one_of?:     string | null;
    table_number?:    number | null;
    dietary_notes?:   string | null;
    internal_notes?:  string | null;
    created_at?:      string;
    updated_at?:      string;
  };
  Update: Partial<Omit<GuestsTable["Insert"], "id" | "wedding_id">>;
}

// ─── rsvps ────────────────────────────────────────────────────────────────────

interface RsvpsTable {
  Row: {
    id:               string;
    wedding_id:       string;
    guest_id:         string;
    status:           Enums["rsvp_status"];
    meal_preference:  Enums["meal_preference"] | null;
    dietary_notes:    string | null;     // override of guest.dietary_notes
    message:          string | null;     // personal note to the couple
    responded_at:     string | null;
    created_at:       string;
    updated_at:       string;
  };
  Insert: {
    id?:              string;
    wedding_id:       string;
    guest_id:         string;
    status?:          Enums["rsvp_status"];
    meal_preference?: Enums["meal_preference"] | null;
    dietary_notes?:   string | null;
    message?:         string | null;
    responded_at?:    string | null;
    created_at?:      string;
    updated_at?:      string;
  };
  Update: Partial<Omit<RsvpsTable["Insert"], "id" | "wedding_id" | "guest_id">>;
}

// ─── guest_groups ─────────────────────────────────────────────────────────────

interface GuestGroupsTable {
  Row: {
    id:          string;
    wedding_id:  string;
    name:        string;   // e.g. "Smith Family", "College Friends"
    created_at:  string;
  };
  Insert: {
    id?:         string;
    wedding_id:  string;
    name:        string;
    created_at?: string;
  };
  Update: Partial<Pick<GuestGroupsTable["Insert"], "name">>;
}

// ─── wedding_pages ────────────────────────────────────────────────────────────

interface WeddingPagesTable {
  Row: {
    id:          string;
    wedding_id:  string;
    title:       string;  // e.g. "Home", "Our Story"
    slug:        string;  // e.g. "home", "our-story"
    is_home:     boolean;
    is_hidden:   boolean;
    sort_order:  number;
    created_at:  string;
    updated_at:  string;
  };
  Insert: {
    id?:         string;
    wedding_id:  string;
    title:       string;
    slug:        string;
    is_home?:    boolean;
    is_hidden?:  boolean;
    sort_order?: number;
    created_at?: string;
    updated_at?: string;
  };
  Update: Partial<Omit<WeddingPagesTable["Insert"], "id" | "wedding_id">>;
}

// ─── page_sections ────────────────────────────────────────────────────────────

interface PageSectionsTable {
  Row: {
    id:          string;
    page_id:     string;
    wedding_id:  string;
    type:        string;   // PageSectionType enum value
    content:     Json;     // Section-specific content blob
    settings:    Json;     // Section-specific settings (colours, fonts, etc.)
    sort_order:  number;
    is_hidden:   boolean;
    created_at:  string;
    updated_at:  string;
  };
  Insert: {
    id?:         string;
    page_id:     string;
    wedding_id:  string;
    type:        string;
    content?:    Json;
    settings?:   Json;
    sort_order?: number;
    is_hidden?:  boolean;
    created_at?: string;
    updated_at?: string;
  };
  Update: Partial<Omit<PageSectionsTable["Insert"], "id" | "page_id" | "wedding_id">>;
}

// ─── registry_items ───────────────────────────────────────────────────────────

interface RegistryItemsTable {
  Row: {
    id:            string;
    wedding_id:    string;
    name:          string;
    description:   string | null;
    price:         number | null;  // in cents
    currency:      string;         // ISO 4217
    quantity:      number;
    quantity_purchased: number;
    url:           string | null;
    image_url:     string | null;
    store_name:    string | null;
    is_hidden:     boolean;
    created_at:    string;
    updated_at:    string;
  };
  Insert: {
    id?:                string;
    wedding_id:         string;
    name:               string;
    description?:       string | null;
    price?:             number | null;
    currency?:          string;
    quantity?:          number;
    quantity_purchased?: number;
    url?:               string | null;
    image_url?:         string | null;
    store_name?:        string | null;
    is_hidden?:         boolean;
    created_at?:        string;
    updated_at?:        string;
  };
  Update: Partial<Omit<RegistryItemsTable["Insert"], "id" | "wedding_id">>;
}

// ─── subscriptions ────────────────────────────────────────────────────────────

interface SubscriptionsTable {
  Row: {
    id:                    string;   // Stripe subscription ID
    profile_id:            string;
    wedding_id:            string | null;
    stripe_price_id:       string;
    tier:                  Enums["subscription_tier"];
    status:                Enums["subscription_status"];
    current_period_start:  string;
    current_period_end:    string;
    cancel_at_period_end:  boolean;
    canceled_at:           string | null;
    trial_start:           string | null;
    trial_end:             string | null;
    created_at:            string;
    updated_at:            string;
  };
  Insert: {
    id:                    string;
    profile_id:            string;
    wedding_id?:           string | null;
    stripe_price_id:       string;
    tier:                  Enums["subscription_tier"];
    status:                Enums["subscription_status"];
    current_period_start:  string;
    current_period_end:    string;
    cancel_at_period_end?: boolean;
    canceled_at?:          string | null;
    trial_start?:          string | null;
    trial_end?:            string | null;
    created_at?:           string;
    updated_at?:           string;
  };
  Update: Partial<Omit<SubscriptionsTable["Insert"], "id" | "profile_id">>;
}

// ─── custom_domains ───────────────────────────────────────────────────────────

interface CustomDomainsTable {
  Row: {
    id:           string;
    wedding_id:   string;
    domain:       string;   // e.g. "sarah-and-james.com"
    status:       Enums["domain_status"];
    verified_at:  string | null;
    txt_record:   string | null;   // verification TXT record value
    created_at:   string;
    updated_at:   string;
  };
  Insert: {
    id?:          string;
    wedding_id:   string;
    domain:       string;
    status?:      Enums["domain_status"];
    verified_at?: string | null;
    txt_record?:  string | null;
    created_at?:  string;
    updated_at?:  string;
  };
  Update: Partial<Omit<CustomDomainsTable["Insert"], "id" | "wedding_id">>;
}

// ─── email_invitations ────────────────────────────────────────────────────────

interface EmailInvitationsTable {
  Row: {
    id:          string;
    wedding_id:  string;
    guest_id:    string;
    resend_id:   string | null;  // Resend email ID for tracking
    status:      Enums["invitation_status"];
    sent_at:     string | null;
    opened_at:   string | null;
    created_at:  string;
  };
  Insert: {
    id?:         string;
    wedding_id:  string;
    guest_id:    string;
    resend_id?:  string | null;
    status?:     Enums["invitation_status"];
    sent_at?:    string | null;
    opened_at?:  string | null;
    created_at?: string;
  };
  Update: Partial<Omit<EmailInvitationsTable["Insert"], "id" | "wedding_id" | "guest_id">>;
}

// ─── media_assets ─────────────────────────────────────────────────────────────

interface MediaAssetsTable {
  Row: {
    id:           string;
    wedding_id:   string;
    uploaded_by:  string;        // profile.id
    storage_path: string;        // Supabase Storage path
    public_url:   string;
    file_name:    string;
    file_size:    number;         // bytes
    mime_type:    string;
    width:        number | null;  // pixels
    height:       number | null;
    alt_text:     string | null;
    created_at:   string;
  };
  Insert: {
    id?:           string;
    wedding_id:    string;
    uploaded_by:   string;
    storage_path:  string;
    public_url:    string;
    file_name:     string;
    file_size:     number;
    mime_type:     string;
    width?:        number | null;
    height?:       number | null;
    alt_text?:     string | null;
    created_at?:   string;
  };
  Update: Partial<Pick<MediaAssetsTable["Insert"], "alt_text">>;
}

// ─── Convenience re-exports ───────────────────────────────────────────────────

export type Profile             = TableRow<"profiles">;
export type Wedding             = TableRow<"weddings">;
export type WeddingMember       = TableRow<"wedding_members">;
export type Guest               = TableRow<"guests">;
export type RSVP                = TableRow<"rsvps">;
export type GuestGroup          = TableRow<"guest_groups">;
export type WeddingPage         = TableRow<"wedding_pages">;
export type PageSection         = TableRow<"page_sections">;
export type RegistryItem        = TableRow<"registry_items">;
export type Subscription        = TableRow<"subscriptions">;
export type CustomDomain        = TableRow<"custom_domains">;
export type EmailInvitation     = TableRow<"email_invitations">;
export type MediaAsset          = TableRow<"media_assets">;

// Joined / enriched types used in the application layer
export type GuestWithRSVP = Guest & {
  rsvp: RSVP | null;
  group: GuestGroup | null;
};

export type WeddingWithDetails = Wedding & {
  members: WeddingMember[];
  subscription: Subscription | null;
  custom_domain: CustomDomain | null;
  _count: {
    guests: number;
    rsvps_attending: number;
    rsvps_declined: number;
    rsvps_pending: number;
  };
};
