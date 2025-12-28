-- =============================================
-- AutoAndrew Database Migration: Triggers
-- =============================================
-- Run this AFTER 004_functions.sql
-- =============================================

-- =============================================
-- Trigger: on_auth_user_created
-- Automatically create profile and role when a new user signs up
-- =============================================
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- NOTE: This trigger is on the auth.users table which is managed by Supabase.
-- When setting up a new Supabase project, you may need to run this manually
-- through the Supabase dashboard SQL editor.
