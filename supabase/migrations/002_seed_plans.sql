-- =============================================================================
-- Migration: 002_seed_plans.sql
-- Description: Seed initial subscription plans for EverAfter SaaS
-- =============================================================================

INSERT INTO public.plans (
  name,
  stripe_price_id,
  price_monthly_usd,
  max_guests,
  max_photos,
  custom_domain,
  remove_branding,
  features,
  is_active
)
VALUES
  (
    'Free',
    NULL,
    0.00,
    50,
    25,
    FALSE,
    FALSE,
    '{"rsvp": true, "guest_list": true, "registry": true, "subdomain": true, "seating_chart": false, "custom_domain": false, "photo_uploads": true, "analytics": false, "multi_wedding": false}'::jsonb,
    TRUE
  ),
  (
    'Premium',
    'price_premium_monthly',
    14.99,
    NULL,
    500,
    TRUE,
    TRUE,
    '{"rsvp": true, "guest_list": true, "registry": true, "subdomain": true, "seating_chart": true, "custom_domain": true, "photo_uploads": true, "analytics": true, "multi_wedding": false, "timeline": true, "priority_support": true}'::jsonb,
    TRUE
  ),
  (
    'Planner Pro',
    'price_planner_pro_monthly',
    49.99,
    NULL,
    NULL,
    TRUE,
    TRUE,
    '{"rsvp": true, "guest_list": true, "registry": true, "subdomain": true, "seating_chart": true, "custom_domain": true, "photo_uploads": true, "analytics": true, "multi_wedding": true, "timeline": true, "priority_support": true, "white_label": true, "client_management": true}'::jsonb,
    TRUE
  )
ON CONFLICT (name) DO UPDATE SET
  stripe_price_id = EXCLUDED.stripe_price_id,
  price_monthly_usd = EXCLUDED.price_monthly_usd,
  max_guests = EXCLUDED.max_guests,
  max_photos = EXCLUDED.max_photos,
  custom_domain = EXCLUDED.custom_domain,
  remove_branding = EXCLUDED.remove_branding,
  features = EXCLUDED.features,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();
