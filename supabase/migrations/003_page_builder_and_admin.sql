-- =============================================================================
-- Migration: 003_page_builder_and_admin.sql
-- Description: Super Admin, Dynamic Page & Section Builder, Multi-Day Events,
--              and Tokenized Guest Access.
-- =============================================================================

-- ─── 1. Super Admins (Platform Owners) ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.super_admins (
  id          UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT        NOT NULL UNIQUE,
  name        TEXT        NOT NULL,
  role        TEXT        NOT NULL DEFAULT 'super_admin' CHECK (role IN ('super_admin', 'support')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.super_admins IS 'Platform owners with cross-tenant management privileges.';

ALTER TABLE public.super_admins ENABLE ROW LEVEL SECURITY;

CREATE POLICY super_admins_select ON public.super_admins
  FOR SELECT USING (id = auth.uid());

-- Helper function to check if current user is Super Admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.super_admins WHERE id = auth.uid()
  );
$$;

-- ─── 2. Multi-Day Events (Ceremony, Reception, Welcome Dinner, etc.) ─────────
CREATE TABLE IF NOT EXISTS public.events (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id  UUID        NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
  name        TEXT        NOT NULL,
  event_date  DATE        NOT NULL,
  start_time  TIME        NOT NULL,
  end_time    TIME,
  location_name TEXT      NOT NULL,
  address     TEXT,
  dress_code  TEXT,
  description TEXT,
  sort_order  INTEGER     NOT NULL DEFAULT 0,
  is_public   BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.events IS 'Detailed multi-day wedding events (Ceremony, Reception, Sangeet, etc.).';

CREATE INDEX idx_events_wedding ON public.events (wedding_id, sort_order);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY events_select_public ON public.events
  FOR SELECT USING (is_public = TRUE);

CREATE POLICY events_all_member ON public.events
  FOR ALL
  USING (public.has_wedding_role(wedding_id, ARRAY['partner', 'planner']) OR public.is_super_admin())
  WITH CHECK (public.has_wedding_role(wedding_id, ARRAY['partner', 'planner']) OR public.is_super_admin());

-- ─── 3. Dynamic Wedding Pages ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.wedding_pages (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id   UUID        NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
  slug         TEXT        NOT NULL,
  title        TEXT        NOT NULL,
  seo_description TEXT,
  is_home      BOOLEAN     NOT NULL DEFAULT FALSE,
  is_published BOOLEAN     NOT NULL DEFAULT TRUE,
  sort_order   INTEGER     NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT wedding_pages_unique_slug UNIQUE (wedding_id, slug)
);

COMMENT ON TABLE public.wedding_pages IS 'Pages belonging to a couple wedding website instance.';

CREATE INDEX idx_wedding_pages_wedding ON public.wedding_pages (wedding_id, sort_order);

ALTER TABLE public.wedding_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY wedding_pages_select_public ON public.wedding_pages
  FOR SELECT USING (is_published = TRUE);

CREATE POLICY wedding_pages_all_member ON public.wedding_pages
  FOR ALL
  USING (public.has_wedding_role(wedding_id, ARRAY['partner', 'planner']) OR public.is_super_admin())
  WITH CHECK (public.has_wedding_role(wedding_id, ARRAY['partner', 'planner']) OR public.is_super_admin());

-- ─── 4. Dynamic Page Sections (JSON Schema Engine) ───────────────────────────
CREATE TABLE IF NOT EXISTS public.page_sections (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id     UUID        NOT NULL REFERENCES public.wedding_pages(id) ON DELETE CASCADE,
  wedding_id  UUID        NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
  type        TEXT        NOT NULL CHECK (type IN (
                            'hero', 'text', 'our_story', 'schedule', 'gallery',
                            'registry', 'rsvp', 'countdown', 'map', 'contact', 'custom'
                          )),
  props       JSONB       NOT NULL DEFAULT '{}'::jsonb,
  sort_order  INTEGER     NOT NULL DEFAULT 0,
  is_visible  BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.page_sections IS 'Composable sections on a wedding page with flexible JSON props.';

CREATE INDEX idx_page_sections_page ON public.page_sections (page_id, sort_order);
CREATE INDEX idx_page_sections_wedding ON public.page_sections (wedding_id);

ALTER TABLE public.page_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY page_sections_select_public ON public.page_sections
  FOR SELECT USING (is_visible = TRUE);

CREATE POLICY page_sections_all_member ON public.page_sections
  FOR ALL
  USING (public.has_wedding_role(wedding_id, ARRAY['partner', 'planner']) OR public.is_super_admin())
  WITH CHECK (public.has_wedding_role(wedding_id, ARRAY['partner', 'planner']) OR public.is_super_admin());

-- ─── 5. Site Templates & Themes ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.templates (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name             TEXT        NOT NULL UNIQUE,
  slug             TEXT        NOT NULL UNIQUE,
  description      TEXT,
  thumbnail_url    TEXT,
  default_sections JSONB       NOT NULL DEFAULT '[]'::jsonb,
  is_active        BOOLEAN     NOT NULL DEFAULT TRUE,
  is_premium       BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.templates IS 'Curated system templates/themes selectable by couples.';

ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY templates_select_public ON public.templates
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY templates_all_super_admin ON public.templates
  FOR ALL
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

-- ─── 6. Tokenized Guest RSVPs & Invitation Codes ─────────────────────────────
ALTER TABLE public.guests
  ADD COLUMN IF NOT EXISTS invite_token TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS access_code  VARCHAR(8);

COMMENT ON COLUMN public.guests.invite_token IS 'Cryptographically secure unique token for direct RSVP link (e.g. /rsvp?token=XYZ).';
COMMENT ON COLUMN public.guests.access_code  IS 'Short human-readable 6-character code printed on physical invitations (e.g. LOVE24).';

CREATE INDEX IF NOT EXISTS idx_guests_invite_token ON public.guests (invite_token);
CREATE INDEX IF NOT EXISTS idx_guests_access_code ON public.guests (wedding_id, access_code);

-- ─── 7. Audit Logs ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   UUID        REFERENCES public.weddings(id) ON DELETE CASCADE,
  user_id     UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  action      TEXT        NOT NULL,
  entity_type TEXT        NOT NULL,
  entity_id   TEXT,
  details     JSONB       NOT NULL DEFAULT '{}'::jsonb,
  ip_address  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.audit_logs IS 'Platform-wide and tenant-specific audit log for security and troubleshooting.';

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY audit_logs_super_admin ON public.audit_logs
  FOR ALL USING (public.is_super_admin());

CREATE POLICY audit_logs_tenant_admin ON public.audit_logs
  FOR SELECT USING (
    tenant_id IN (SELECT public.my_wedding_ids())
  );
