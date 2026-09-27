-- =============================================================================
-- EverAfter — Initial Database Schema
-- Migration: 001_initial_schema.sql
-- Created:   2026-09-27
-- Description: Creates all tables, enables RLS, creates policies, indexes,
--              and helper functions for the EverAfter wedding SaaS platform.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- EXTENSIONS
-- -----------------------------------------------------------------------------

CREATE EXTENSION IF NOT EXISTS "pgcrypto";   -- gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "citext";     -- Case-insensitive text
CREATE EXTENSION IF NOT EXISTS "pg_trgm";    -- Trigram similarity for guest search


-- =============================================================================
-- SECTION 1: HELPER FUNCTION — updated_at TRIGGER
-- Applied to every table that needs automatic timestamp maintenance.
-- =============================================================================

CREATE OR REPLACE FUNCTION touch_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


-- =============================================================================
-- SECTION 2: PROFILES
-- Extends auth.users with application-level user data.
-- One row per authenticated Supabase user.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id               UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name     TEXT        NOT NULL,
  full_name        TEXT        GENERATED ALWAYS AS (display_name) STORED,
  avatar_url       TEXT,
  locale           VARCHAR(10) NOT NULL DEFAULT 'en',
  timezone         TEXT        NOT NULL DEFAULT 'UTC',
  marketing_opt_in BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  public.profiles IS 'Application-level user profile, extending auth.users.';
COMMENT ON COLUMN public.profiles.id IS 'Matches the Supabase auth.users UUID.';
COMMENT ON COLUMN public.profiles.locale IS 'BCP-47 locale tag, e.g. en, fr, pt-BR.';
COMMENT ON COLUMN public.profiles.timezone IS 'IANA timezone string, e.g. America/New_York.';

-- Trigger: keep updated_at current
CREATE TRIGGER touch_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

-- Trigger: auto-create profile when a new Supabase user is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- NOTE: This trigger fires on auth.users which is in a separate schema.
-- Supabase allows this via SECURITY DEFINER functions.
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY profiles_select_own ON public.profiles
  FOR SELECT USING (id = auth.uid());

CREATE POLICY profiles_update_own ON public.profiles
  FOR UPDATE USING (id = auth.uid()) WITH CHECK (id = auth.uid());


-- =============================================================================
-- SECTION 3: PLANS
-- Subscription tier definitions. Seeded at deploy; rarely mutated at runtime.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.plans (
  id                 UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  name               TEXT           NOT NULL UNIQUE,
  stripe_price_id    TEXT           UNIQUE,
  price_monthly_usd  NUMERIC(10,2)  NOT NULL DEFAULT 0.00,
  max_guests         INTEGER,                             -- NULL = unlimited
  max_photos         INTEGER,                             -- NULL = unlimited
  custom_domain      BOOLEAN        NOT NULL DEFAULT FALSE,
  remove_branding    BOOLEAN        NOT NULL DEFAULT FALSE,
  features           JSONB          NOT NULL DEFAULT '{}',
  is_active          BOOLEAN        NOT NULL DEFAULT TRUE,
  created_at         TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  public.plans IS 'Subscription tier definitions for EverAfter pricing.';
COMMENT ON COLUMN public.plans.max_guests IS 'NULL means unlimited.';
COMMENT ON COLUMN public.plans.max_photos IS 'NULL means unlimited.';
COMMENT ON COLUMN public.plans.features   IS 'JSON feature flag map for plan-specific capabilities.';

CREATE TRIGGER touch_plans_updated_at
  BEFORE UPDATE ON public.plans
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

-- RLS
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;

-- Plans are publicly readable (needed for pricing page without login)
CREATE POLICY plans_select_public ON public.plans
  FOR SELECT USING (is_active = TRUE);

-- No write policies for authenticated users; only service_role key may write.


-- =============================================================================
-- SECTION 4: WEDDINGS
-- Core tenant record. One per couple/event.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.weddings (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug              CITEXT      NOT NULL UNIQUE,
  title             TEXT        NOT NULL,
  partner_one_name  TEXT        NOT NULL,
  partner_two_name  TEXT        NOT NULL,
  wedding_date      DATE,
  ceremony_time     TIME,
  timezone          TEXT        NOT NULL DEFAULT 'UTC',
  venue_name        TEXT,
  venue_address     TEXT,
  venue_lat         NUMERIC(9,6),
  venue_lng         NUMERIC(9,6),
  cover_photo_url   TEXT,
  theme             JSONB       NOT NULL DEFAULT '{}',
  website_published BOOLEAN     NOT NULL DEFAULT FALSE,
  rsvp_enabled      BOOLEAN     NOT NULL DEFAULT TRUE,
  rsvp_deadline     DATE,
  welcome_message   TEXT,
  dress_code        TEXT,
  hashtag           TEXT,
  language          VARCHAR(10) NOT NULL DEFAULT 'en',
  deleted_at        TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT weddings_slug_format CHECK (slug ~ '^[a-z0-9][a-z0-9\-]{2,62}[a-z0-9]$')
);

COMMENT ON TABLE  public.weddings IS 'Core tenant record — one row per wedding/couple.';
COMMENT ON COLUMN public.weddings.slug IS 'URL-safe subdomain identifier: slug.everafter.app';
COMMENT ON COLUMN public.weddings.theme IS 'Zod-validated design theme config (colors, fonts, layout).';
COMMENT ON COLUMN public.weddings.deleted_at IS 'Soft-delete timestamp. Hard delete scheduled 30 days after.';

CREATE INDEX idx_weddings_active      ON public.weddings (id)           WHERE deleted_at IS NULL;
CREATE INDEX idx_weddings_wedding_date ON public.weddings (wedding_date) WHERE deleted_at IS NULL;

CREATE TRIGGER touch_weddings_updated_at
  BEFORE UPDATE ON public.weddings
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

-- RLS
ALTER TABLE public.weddings ENABLE ROW LEVEL SECURITY;


-- =============================================================================
-- SECTION 5: WEDDING_MEMBERS
-- Links users to weddings with a role (partner, planner).
-- Must be created before RLS helper functions reference it.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.wedding_members (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id  UUID        NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
  user_id     UUID        NOT NULL REFERENCES auth.users(id)      ON DELETE CASCADE,
  role        TEXT        NOT NULL DEFAULT 'partner'
                          CHECK (role IN ('partner', 'planner', 'admin')),
  invited_by  UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  accepted_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT wedding_members_unique_user_wedding UNIQUE (wedding_id, user_id)
);

COMMENT ON TABLE  public.wedding_members IS 'M:N junction linking users to weddings with roles.';
COMMENT ON COLUMN public.wedding_members.role IS 'partner: couple member. planner: assigned vendor. admin: internal staff.';

CREATE INDEX idx_wedding_members_user    ON public.wedding_members (user_id);
CREATE INDEX idx_wedding_members_wedding ON public.wedding_members (wedding_id);
CREATE INDEX idx_wedding_members_role    ON public.wedding_members (role);

CREATE TRIGGER touch_wedding_members_updated_at
  BEFORE UPDATE ON public.wedding_members
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

-- Trigger: auto-enrol the creating user as a 'partner' when a wedding is inserted
CREATE OR REPLACE FUNCTION public.handle_new_wedding()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER AS $$
BEGIN
  IF auth.uid() IS NOT NULL THEN
    INSERT INTO public.wedding_members (wedding_id, user_id, role, accepted_at)
    VALUES (NEW.id, auth.uid(), 'partner', NOW())
    ON CONFLICT (wedding_id, user_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_wedding_created
  AFTER INSERT ON public.weddings
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_wedding();

-- RLS
ALTER TABLE public.wedding_members ENABLE ROW LEVEL SECURITY;


-- =============================================================================
-- SECTION 6: RLS HELPER FUNCTIONS
-- Defined after wedding_members exists. Used across all policy definitions.
-- =============================================================================

-- Returns all wedding_ids the current user is a member of.
-- SECURITY DEFINER: runs as function owner, bypassing RLS on wedding_members itself.
CREATE OR REPLACE FUNCTION public.my_wedding_ids()
RETURNS SETOF UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public AS $$
  SELECT wedding_id
  FROM public.wedding_members
  WHERE user_id = auth.uid();
$$;

-- Returns TRUE if the current user has any of the given roles in a wedding.
CREATE OR REPLACE FUNCTION public.has_wedding_role(p_wedding_id UUID, p_roles TEXT[])
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.wedding_members
    WHERE wedding_id = p_wedding_id
      AND user_id    = auth.uid()
      AND role       = ANY(p_roles)
  );
$$;


-- =============================================================================
-- SECTION 7: WEDDINGS & WEDDING_MEMBERS RLS POLICIES
-- Defined after helper functions are available.
-- =============================================================================

-- weddings
CREATE POLICY weddings_select_member ON public.weddings
  FOR SELECT USING (id IN (SELECT public.my_wedding_ids()) AND deleted_at IS NULL);

CREATE POLICY weddings_insert_authenticated ON public.weddings
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY weddings_update_partner ON public.weddings
  FOR UPDATE
  USING (public.has_wedding_role(id, ARRAY['partner']))
  WITH CHECK (public.has_wedding_role(id, ARRAY['partner']));

-- wedding_members
CREATE POLICY wedding_members_select_member ON public.wedding_members
  FOR SELECT USING (wedding_id IN (SELECT public.my_wedding_ids()));

CREATE POLICY wedding_members_insert_partner ON public.wedding_members
  FOR INSERT WITH CHECK (public.has_wedding_role(wedding_id, ARRAY['partner']));

CREATE POLICY wedding_members_delete_partner ON public.wedding_members
  FOR DELETE USING (public.has_wedding_role(wedding_id, ARRAY['partner']));


-- =============================================================================
-- SECTION 8: SUBSCRIPTIONS
-- Billing state per wedding. Managed exclusively by service_role (Stripe webhooks).
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id                     UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id             UUID        NOT NULL REFERENCES public.weddings(id)  ON DELETE CASCADE,
  plan_id                UUID        NOT NULL REFERENCES public.plans(id),
  stripe_customer_id     TEXT,
  stripe_subscription_id TEXT        UNIQUE,
  status                 TEXT        NOT NULL DEFAULT 'active'
                                     CHECK (status IN ('active','trialing','past_due','canceled','unpaid')),
  current_period_start   TIMESTAMPTZ,
  current_period_end     TIMESTAMPTZ,
  cancel_at_period_end   BOOLEAN     NOT NULL DEFAULT FALSE,
  canceled_at            TIMESTAMPTZ,
  trial_end              TIMESTAMPTZ,
  metadata               JSONB       NOT NULL DEFAULT '{}',
  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  public.subscriptions IS 'Billing subscription records, synced from Stripe webhooks.';
COMMENT ON COLUMN public.subscriptions.status IS 'Mirrors Stripe subscription status values.';

CREATE INDEX idx_subscriptions_wedding ON public.subscriptions (wedding_id);
CREATE INDEX idx_subscriptions_status  ON public.subscriptions (status);
CREATE INDEX idx_subscriptions_stripe  ON public.subscriptions (stripe_subscription_id)
  WHERE stripe_subscription_id IS NOT NULL;

CREATE TRIGGER touch_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

-- RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Only partners can view their subscription; no user-level writes (service_role only)
CREATE POLICY subscriptions_select_partner ON public.subscriptions
  FOR SELECT USING (public.has_wedding_role(wedding_id, ARRAY['partner']));


-- =============================================================================
-- SECTION 9: GUESTS
-- Wedding guest list. Scoped to a wedding (tenant).
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.guests (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id          UUID        NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
  first_name          TEXT        NOT NULL,
  last_name           TEXT,
  email               CITEXT,
  phone               TEXT,
  group_label         TEXT,
  plus_one_allowed    BOOLEAN     NOT NULL DEFAULT FALSE,
  dietary_notes       TEXT,
  notes               TEXT,
  invitation_sent_at  TIMESTAMPTZ,
  deleted_at          TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  public.guests IS 'Wedding guest list entries, scoped by wedding_id.';
COMMENT ON COLUMN public.guests.email IS 'Case-insensitive for de-duplication. Used for RSVP invitation emails.';
COMMENT ON COLUMN public.guests.phone IS 'E.164 format preferred, e.g. +14155552671.';
COMMENT ON COLUMN public.guests.deleted_at IS 'Soft-delete — use WHERE deleted_at IS NULL in queries.';

CREATE INDEX idx_guests_wedding        ON public.guests (wedding_id);
CREATE INDEX idx_guests_wedding_email  ON public.guests (wedding_id, email) WHERE email IS NOT NULL;
CREATE INDEX idx_guests_active         ON public.guests (wedding_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_guests_name_fts       ON public.guests
  USING GIN (to_tsvector('simple', first_name || ' ' || COALESCE(last_name, '')));

CREATE TRIGGER touch_guests_updated_at
  BEFORE UPDATE ON public.guests
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

-- RLS
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;

CREATE POLICY guests_select_member ON public.guests
  FOR SELECT USING (
    wedding_id IN (SELECT public.my_wedding_ids()) AND deleted_at IS NULL
  );

CREATE POLICY guests_insert_member ON public.guests
  FOR INSERT WITH CHECK (
    public.has_wedding_role(wedding_id, ARRAY['partner', 'planner'])
  );

CREATE POLICY guests_update_member ON public.guests
  FOR UPDATE
  USING (public.has_wedding_role(wedding_id, ARRAY['partner', 'planner']))
  WITH CHECK (public.has_wedding_role(wedding_id, ARRAY['partner', 'planner']));

CREATE POLICY guests_delete_partner ON public.guests
  FOR DELETE USING (public.has_wedding_role(wedding_id, ARRAY['partner']));


-- =============================================================================
-- SECTION 10: RSVPS
-- Guest RSVP responses. Unique per guest (upsert pattern).
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.rsvps (
  id                   UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id           UUID        NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
  guest_id             UUID        NOT NULL REFERENCES public.guests(id)   ON DELETE CASCADE,
  response             TEXT        NOT NULL
                                   CHECK (response IN ('attending', 'declined', 'maybe')),
  plus_one_attending   BOOLEAN,
  plus_one_name        TEXT,
  dietary_restrictions TEXT,
  meal_choice          TEXT,
  message              TEXT,
  submitted_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ip_address           INET,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- One active RSVP per guest; use INSERT … ON CONFLICT (guest_id) DO UPDATE
  CONSTRAINT rsvps_unique_guest UNIQUE (guest_id)
);

COMMENT ON TABLE  public.rsvps IS 'Guest RSVP responses. One row per guest; use upsert on guest_id.';
COMMENT ON COLUMN public.rsvps.ip_address IS 'Anonymised (set to NULL) 30 days after submission by cron job.';
COMMENT ON COLUMN public.rsvps.response   IS 'attending | declined | maybe';

CREATE INDEX idx_rsvps_wedding          ON public.rsvps (wedding_id);
CREATE INDEX idx_rsvps_guest            ON public.rsvps (guest_id);
CREATE INDEX idx_rsvps_wedding_response ON public.rsvps (wedding_id, response);

CREATE TRIGGER touch_rsvps_updated_at
  BEFORE UPDATE ON public.rsvps
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

-- RLS
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;

-- Wedding members can read all RSVPs for their wedding
CREATE POLICY rsvps_select_member ON public.rsvps
  FOR SELECT USING (wedding_id IN (SELECT public.my_wedding_ids()));

-- Public insert: anyone can submit an RSVP if the wedding accepts them
-- Application layer validates guest_id ownership and deadline
CREATE POLICY rsvps_insert_public ON public.rsvps
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.weddings w
      WHERE w.id           = wedding_id
        AND w.rsvp_enabled = TRUE
        AND (w.rsvp_deadline IS NULL OR w.rsvp_deadline >= CURRENT_DATE)
        AND w.deleted_at   IS NULL
    )
  );

-- Members can update RSVPs (e.g., couple overrides a guest's response)
CREATE POLICY rsvps_update_member ON public.rsvps
  FOR UPDATE USING (wedding_id IN (SELECT public.my_wedding_ids()));


-- =============================================================================
-- SECTION 11: TABLES (SEATING)
-- Represents physical reception tables.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.tables (
  id          UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id  UUID           NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
  name        TEXT           NOT NULL,
  capacity    INTEGER        NOT NULL DEFAULT 8,
  shape       TEXT           NOT NULL DEFAULT 'round'
                             CHECK (shape IN ('round', 'rectangular', 'oval')),
  position_x  NUMERIC(8,2)   NOT NULL DEFAULT 0,
  position_y  NUMERIC(8,2)   NOT NULL DEFAULT 0,
  notes       TEXT,
  created_at  TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ    NOT NULL DEFAULT NOW(),

  CONSTRAINT tables_capacity_positive CHECK (capacity > 0)
);

COMMENT ON TABLE  public.tables IS 'Reception seating tables for the seating chart feature.';
COMMENT ON COLUMN public.tables.position_x IS 'X coordinate on the drag-drop seating canvas.';
COMMENT ON COLUMN public.tables.position_y IS 'Y coordinate on the drag-drop seating canvas.';

CREATE INDEX idx_tables_wedding ON public.tables (wedding_id);

CREATE TRIGGER touch_tables_updated_at
  BEFORE UPDATE ON public.tables
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

-- RLS
ALTER TABLE public.tables ENABLE ROW LEVEL SECURITY;

CREATE POLICY tables_all_member ON public.tables
  FOR ALL
  USING (public.has_wedding_role(wedding_id, ARRAY['partner', 'planner']))
  WITH CHECK (public.has_wedding_role(wedding_id, ARRAY['partner', 'planner']));


-- =============================================================================
-- SECTION 12: SEATS
-- Guest-to-table assignments. One guest per row.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.seats (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id   UUID        NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
  table_id     UUID        NOT NULL REFERENCES public.tables(id)   ON DELETE CASCADE,
  guest_id     UUID        NOT NULL REFERENCES public.guests(id)   ON DELETE CASCADE,
  seat_number  INTEGER,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- A guest can only be assigned to one seat
  CONSTRAINT seats_unique_guest UNIQUE (guest_id),
  -- A specific seat number at a table can only be assigned once
  CONSTRAINT seats_unique_table_seat UNIQUE (table_id, seat_number) DEFERRABLE INITIALLY DEFERRED
);

COMMENT ON TABLE  public.seats IS 'Guest-to-table seat assignments for the seating chart.';
COMMENT ON COLUMN public.seats.wedding_id IS 'Denormalised from table for direct RLS enforcement.';

CREATE INDEX idx_seats_wedding  ON public.seats (wedding_id);
CREATE INDEX idx_seats_table    ON public.seats (table_id);
CREATE INDEX idx_seats_guest    ON public.seats (guest_id);

CREATE TRIGGER touch_seats_updated_at
  BEFORE UPDATE ON public.seats
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

-- RLS
ALTER TABLE public.seats ENABLE ROW LEVEL SECURITY;

CREATE POLICY seats_all_member ON public.seats
  FOR ALL
  USING (public.has_wedding_role(wedding_id, ARRAY['partner', 'planner']))
  WITH CHECK (public.has_wedding_role(wedding_id, ARRAY['partner', 'planner']));


-- =============================================================================
-- SECTION 13: REGISTRY ITEMS
-- Wedding gift registry links and custom items.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.registry_items (
  id                 UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id         UUID           NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
  title              TEXT           NOT NULL,
  description        TEXT,
  url                TEXT,
  retailer           TEXT,
  price              NUMERIC(10,2),
  currency           VARCHAR(3)     NOT NULL DEFAULT 'USD',
  image_url          TEXT,
  quantity_desired   INTEGER,
  quantity_purchased INTEGER        NOT NULL DEFAULT 0,
  is_purchased       BOOLEAN        NOT NULL DEFAULT FALSE,
  sort_order         INTEGER        NOT NULL DEFAULT 0,
  created_at         TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ    NOT NULL DEFAULT NOW(),

  CONSTRAINT registry_price_positive         CHECK (price IS NULL OR price >= 0),
  CONSTRAINT registry_quantity_desired_pos   CHECK (quantity_desired IS NULL OR quantity_desired > 0),
  CONSTRAINT registry_quantity_purchased_pos CHECK (quantity_purchased >= 0)
);

COMMENT ON TABLE  public.registry_items IS 'Wedding gift registry — external links and custom items.';
COMMENT ON COLUMN public.registry_items.currency IS 'ISO 4217 currency code, e.g. USD, GBP, EUR.';

CREATE INDEX idx_registry_wedding      ON public.registry_items (wedding_id);
CREATE INDEX idx_registry_wedding_sort ON public.registry_items (wedding_id, sort_order);

CREATE TRIGGER touch_registry_items_updated_at
  BEFORE UPDATE ON public.registry_items
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

-- RLS
ALTER TABLE public.registry_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY registry_select_member ON public.registry_items
  FOR SELECT USING (wedding_id IN (SELECT public.my_wedding_ids()));

CREATE POLICY registry_insert_partner ON public.registry_items
  FOR INSERT WITH CHECK (public.has_wedding_role(wedding_id, ARRAY['partner']));

CREATE POLICY registry_update_partner ON public.registry_items
  FOR UPDATE
  USING (public.has_wedding_role(wedding_id, ARRAY['partner']))
  WITH CHECK (public.has_wedding_role(wedding_id, ARRAY['partner']));

CREATE POLICY registry_delete_partner ON public.registry_items
  FOR DELETE USING (public.has_wedding_role(wedding_id, ARRAY['partner']));


-- =============================================================================
-- SECTION 14: PHOTOS
-- Photo gallery metadata. Actual files live in Supabase Storage.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.photos (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id     UUID        NOT NULL REFERENCES public.weddings(id)  ON DELETE CASCADE,
  uploaded_by    UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  storage_path   TEXT        NOT NULL,
  storage_bucket TEXT        NOT NULL DEFAULT 'wedding-photos',
  filename       TEXT        NOT NULL,
  mime_type      TEXT        NOT NULL DEFAULT 'image/jpeg',
  size_bytes     BIGINT      NOT NULL DEFAULT 0,
  width          INTEGER,
  height         INTEGER,
  caption        TEXT,
  alt_text       TEXT,
  is_cover       BOOLEAN     NOT NULL DEFAULT FALSE,
  is_approved    BOOLEAN     NOT NULL DEFAULT TRUE,
  sort_order     INTEGER     NOT NULL DEFAULT 0,
  taken_at       TIMESTAMPTZ,
  deleted_at     TIMESTAMPTZ,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT photos_size_positive  CHECK (size_bytes >= 0),
  CONSTRAINT photos_width_positive CHECK (width IS NULL OR width > 0),
  CONSTRAINT photos_height_positive CHECK (height IS NULL OR height > 0)
);

COMMENT ON TABLE  public.photos IS 'Photo gallery metadata. Binary files stored in Supabase Storage bucket wedding-photos.';
COMMENT ON COLUMN public.photos.storage_path IS 'Storage object path: photos/{wedding_id}/{filename}';
COMMENT ON COLUMN public.photos.is_approved  IS 'FALSE for guest-uploaded photos pending moderation.';
COMMENT ON COLUMN public.photos.deleted_at   IS 'Soft-delete. Storage cleanup triggered via Edge Function.';

CREATE INDEX idx_photos_wedding      ON public.photos (wedding_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_photos_approved     ON public.photos (wedding_id, is_approved) WHERE deleted_at IS NULL;
CREATE INDEX idx_photos_wedding_sort ON public.photos (wedding_id, sort_order)  WHERE deleted_at IS NULL;

CREATE TRIGGER touch_photos_updated_at
  BEFORE UPDATE ON public.photos
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

-- RLS
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY photos_select_member ON public.photos
  FOR SELECT USING (
    wedding_id IN (SELECT public.my_wedding_ids()) AND deleted_at IS NULL
  );

CREATE POLICY photos_insert_member ON public.photos
  FOR INSERT WITH CHECK (
    public.has_wedding_role(wedding_id, ARRAY['partner', 'planner'])
  );

CREATE POLICY photos_update_partner ON public.photos
  FOR UPDATE
  USING (public.has_wedding_role(wedding_id, ARRAY['partner']))
  WITH CHECK (public.has_wedding_role(wedding_id, ARRAY['partner']));

CREATE POLICY photos_delete_partner ON public.photos
  FOR DELETE USING (public.has_wedding_role(wedding_id, ARRAY['partner']));


-- =============================================================================
-- SECTION 15: TIMELINE EVENTS
-- Wedding day schedule / itinerary items.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.timeline_events (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id  UUID        NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
  title       TEXT        NOT NULL,
  description TEXT,
  start_time  TIME        NOT NULL,
  end_time    TIME,
  location    TEXT,
  icon        TEXT,
  is_public   BOOLEAN     NOT NULL DEFAULT TRUE,
  sort_order  INTEGER     NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT timeline_time_order CHECK (end_time IS NULL OR end_time > start_time)
);

COMMENT ON TABLE  public.timeline_events IS 'Wedding day itinerary items, ordered by sort_order.';
COMMENT ON COLUMN public.timeline_events.start_time IS 'Local time — interpret using weddings.timezone.';
COMMENT ON COLUMN public.timeline_events.is_public  IS 'FALSE hides the event from the public guest-facing site.';

CREATE INDEX idx_timeline_wedding      ON public.timeline_events (wedding_id);
CREATE INDEX idx_timeline_wedding_sort ON public.timeline_events (wedding_id, sort_order);

CREATE TRIGGER touch_timeline_events_updated_at
  BEFORE UPDATE ON public.timeline_events
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

-- RLS
ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY timeline_select_member ON public.timeline_events
  FOR SELECT USING (wedding_id IN (SELECT public.my_wedding_ids()));

CREATE POLICY timeline_all_member ON public.timeline_events
  FOR ALL
  USING (public.has_wedding_role(wedding_id, ARRAY['partner', 'planner']))
  WITH CHECK (public.has_wedding_role(wedding_id, ARRAY['partner', 'planner']));


-- =============================================================================
-- SECTION 16: CUSTOM DOMAINS
-- Maps a custom hostname to a wedding. One domain per wedding.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.custom_domains (
  id                   UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id           UUID        NOT NULL UNIQUE REFERENCES public.weddings(id) ON DELETE CASCADE,
  domain               CITEXT      NOT NULL UNIQUE,
  status               TEXT        NOT NULL DEFAULT 'pending'
                                   CHECK (status IN ('pending', 'verifying', 'active', 'failed')),
  verification_token   TEXT,
  verified_at          TIMESTAMPTZ,
  ssl_provisioned_at   TIMESTAMPTZ,
  last_checked_at      TIMESTAMPTZ,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  public.custom_domains IS 'Custom domain mappings for wedding sites. One per wedding.';
COMMENT ON COLUMN public.custom_domains.domain IS 'Fully-qualified domain name, e.g. emma-and-james.com. Case-insensitive.';
COMMENT ON COLUMN public.custom_domains.verification_token IS 'Value to add as a DNS TXT record for ownership verification.';

CREATE INDEX idx_custom_domains_status ON public.custom_domains (status)
  WHERE status = 'active';

CREATE TRIGGER touch_custom_domains_updated_at
  BEFORE UPDATE ON public.custom_domains
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

-- RLS
ALTER TABLE public.custom_domains ENABLE ROW LEVEL SECURITY;

CREATE POLICY domains_select_partner ON public.custom_domains
  FOR SELECT USING (public.has_wedding_role(wedding_id, ARRAY['partner']));

CREATE POLICY domains_insert_partner ON public.custom_domains
  FOR INSERT WITH CHECK (public.has_wedding_role(wedding_id, ARRAY['partner']));

CREATE POLICY domains_update_partner ON public.custom_domains
  FOR UPDATE
  USING (public.has_wedding_role(wedding_id, ARRAY['partner']))
  WITH CHECK (public.has_wedding_role(wedding_id, ARRAY['partner']));

CREATE POLICY domains_delete_partner ON public.custom_domains
  FOR DELETE USING (public.has_wedding_role(wedding_id, ARRAY['partner']));


-- =============================================================================
-- SECTION 17: STORAGE BUCKET POLICIES
-- Applied to Supabase Storage (storage.objects table).
-- =============================================================================

-- Policy: wedding members can read their wedding's photos
-- NOTE: Storage bucket 'wedding-photos' must be created in Supabase Dashboard
--       or via supabase/config.toml before these policies are meaningful.

-- Members can read photos from their wedding's folder
CREATE POLICY "Members can read wedding photos"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'wedding-photos'
  AND (storage.foldername(name))[1] IN (
    SELECT wedding_id::TEXT
    FROM public.wedding_members
    WHERE user_id = auth.uid()
  )
);

-- Partners and planners can upload photos to their wedding's folder
CREATE POLICY "Members can upload wedding photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'wedding-photos'
  AND public.has_wedding_role(
    ((storage.foldername(name))[1])::UUID,
    ARRAY['partner', 'planner']
  )
);

-- Partners can delete photos from their wedding's folder
CREATE POLICY "Partners can delete wedding photos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'wedding-photos'
  AND public.has_wedding_role(
    ((storage.foldername(name))[1])::UUID,
    ARRAY['partner']
  )
);

-- Avatars bucket: users can manage only their own avatar
CREATE POLICY "Users can manage own avatar"
ON storage.objects FOR ALL
USING (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::TEXT
)
WITH CHECK (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::TEXT
);


-- =============================================================================
-- SECTION 18: UTILITY VIEWS
-- =============================================================================

-- View: wedding RSVP summary — convenient for dashboard widgets
CREATE OR REPLACE VIEW public.rsvp_summary AS
SELECT
  w.id           AS wedding_id,
  w.slug,
  COUNT(g.id)                                          AS total_guests,
  COUNT(r.id) FILTER (WHERE r.response = 'attending') AS attending,
  COUNT(r.id) FILTER (WHERE r.response = 'declined')  AS declined,
  COUNT(r.id) FILTER (WHERE r.response = 'maybe')     AS maybe,
  COUNT(g.id) - COUNT(r.id)                           AS awaiting_response
FROM public.weddings w
LEFT JOIN public.guests g  ON g.wedding_id = w.id AND g.deleted_at IS NULL
LEFT JOIN public.rsvps  r  ON r.guest_id   = g.id
WHERE w.deleted_at IS NULL
GROUP BY w.id, w.slug;

COMMENT ON VIEW public.rsvp_summary IS 'Aggregated RSVP counts per wedding. Protected by RLS on underlying tables.';


-- =============================================================================
-- SECTION 19: SOFT-DELETE CLEANUP FUNCTION
-- Called by a scheduled Supabase Edge Function or pg_cron job.
-- Hard-deletes weddings that have been soft-deleted for > 30 days.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.purge_deleted_weddings()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.weddings
  WHERE deleted_at IS NOT NULL
    AND deleted_at < NOW() - INTERVAL '30 days';

  GET DIAGNOSTICS deleted_count = ROW_COUNT;

  RAISE LOG 'purge_deleted_weddings: removed % wedding(s)', deleted_count;

  RETURN deleted_count;
END;
$$;

COMMENT ON FUNCTION public.purge_deleted_weddings() IS
  'Hard-deletes soft-deleted weddings after 30 days. All child rows cascade automatically.
   Call via pg_cron: SELECT cron.schedule(''purge-weddings'', ''0 2 * * *'', ''SELECT public.purge_deleted_weddings()'');';


-- =============================================================================
-- SECTION 20: IP ANONYMISATION FUNCTION
-- Nullifies RSVP IP addresses older than 30 days (GDPR compliance).
-- =============================================================================

CREATE OR REPLACE FUNCTION public.anonymise_rsvp_ips()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  UPDATE public.rsvps
  SET ip_address = NULL,
      updated_at = NOW()
  WHERE ip_address IS NOT NULL
    AND submitted_at < NOW() - INTERVAL '30 days';

  GET DIAGNOSTICS updated_count = ROW_COUNT;

  RAISE LOG 'anonymise_rsvp_ips: anonymised % RSVP IP(s)', updated_count;

  RETURN updated_count;
END;
$$;

COMMENT ON FUNCTION public.anonymise_rsvp_ips() IS
  'Sets rsvps.ip_address to NULL for submissions older than 30 days (GDPR data minimisation).
   Call via pg_cron: SELECT cron.schedule(''anonymise-ips'', ''0 3 * * *'', ''SELECT public.anonymise_rsvp_ips()'');';


-- =============================================================================
-- END OF MIGRATION 001_initial_schema.sql
-- =============================================================================
--
-- Next steps after applying this migration:
--   1. Run: supabase db push (or apply via Supabase Dashboard SQL editor)
--   2. Create Storage buckets in Supabase Dashboard: wedding-photos, avatars, wedding-assets
--   3. Apply 002_seed_plans.sql to insert initial plan data
--   4. Configure pg_cron for purge_deleted_weddings() and anonymise_rsvp_ips()
--   5. Register the on_auth_user_created trigger in Supabase Auth webhooks
--      (or verify it fires correctly via Auth > Hooks in the Dashboard)
--
-- =============================================================================
