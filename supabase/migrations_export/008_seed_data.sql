-- =============================================
-- AutoAndrew Database Migration: Seed Data
-- =============================================
-- OPTIONAL: Run this to set up initial data
-- =============================================

-- Default app settings
INSERT INTO public.app_settings (key, value) VALUES
  ('logo_text_visible', 'true'),
  ('publish_button_visible', 'false')
ON CONFLICT (key) DO NOTHING;

-- =============================================
-- IMPORTANT: Creating an admin user
-- =============================================
-- After creating a user through the auth system, you can make them an admin by:
-- 
-- 1. Get the user's UUID from auth.users:
--    SELECT id, email FROM auth.users WHERE email = 'your-admin@email.com';
--
-- 2. Update their role:
--    UPDATE public.user_roles SET role = 'admin' WHERE user_id = '<user-uuid>';
--
-- Or insert directly:
--    INSERT INTO public.user_roles (user_id, role) VALUES ('<user-uuid>', 'admin')
--    ON CONFLICT (user_id, role) DO UPDATE SET role = 'admin';
