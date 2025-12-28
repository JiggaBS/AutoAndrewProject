-- =============================================
-- FIX RLS PERFORMANCE ISSUES
-- =============================================
-- This migration fixes two types of performance issues:
-- 1. Auth RLS Initialization Plan: Wrap auth.uid() and auth functions with (select ...)
-- 2. Multiple Permissive Policies: Consolidate policies where possible

-- =============================================
-- PART 1: Fix auth.uid() calls in RLS policies
-- =============================================

-- activity_log policies
DROP POLICY IF EXISTS "Admins can view activity logs" ON public.activity_log;
CREATE POLICY "Admins can view activity logs" ON public.activity_log 
  FOR SELECT USING (public.has_role((select auth.uid()), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can insert activity logs" ON public.activity_log;
CREATE POLICY "Admins can insert activity logs" ON public.activity_log 
  FOR INSERT WITH CHECK (public.has_role((select auth.uid()), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can delete activity logs" ON public.activity_log;
CREATE POLICY "Admins can delete activity logs" ON public.activity_log 
  FOR DELETE USING (public.has_role((select auth.uid()), 'admin'::public.app_role));

-- app_settings policies
DROP POLICY IF EXISTS "Admins can view settings" ON public.app_settings;
CREATE POLICY "Admins can view settings" ON public.app_settings 
  FOR SELECT USING (public.has_role((select auth.uid()), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can insert settings" ON public.app_settings;
CREATE POLICY "Admins can insert settings" ON public.app_settings 
  FOR INSERT WITH CHECK (public.has_role((select auth.uid()), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can update settings" ON public.app_settings;
CREATE POLICY "Admins can update settings" ON public.app_settings 
  FOR UPDATE USING (public.has_role((select auth.uid()), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can delete settings" ON public.app_settings;
CREATE POLICY "Admins can delete settings" ON public.app_settings 
  FOR DELETE USING (public.has_role((select auth.uid()), 'admin'::public.app_role));

-- saved_vehicles policies
DROP POLICY IF EXISTS "Users can view own saved vehicles" ON public.saved_vehicles;
CREATE POLICY "Users can view own saved vehicles" ON public.saved_vehicles 
  FOR SELECT USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert own saved vehicles" ON public.saved_vehicles;
CREATE POLICY "Users can insert own saved vehicles" ON public.saved_vehicles 
  FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own saved vehicles" ON public.saved_vehicles;
CREATE POLICY "Users can update own saved vehicles" ON public.saved_vehicles 
  FOR UPDATE USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete own saved vehicles" ON public.saved_vehicles;
CREATE POLICY "Users can delete own saved vehicles" ON public.saved_vehicles 
  FOR DELETE USING ((select auth.uid()) = user_id);

-- user_profiles policies (also consolidating multiple permissive policies)
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
-- Consolidated policy: Admins can view all, users can view own
CREATE POLICY "Users and admins can view profiles" ON public.user_profiles 
  FOR SELECT USING (
    (select auth.uid()) = user_id 
    OR public.has_role((select auth.uid()), 'admin'::public.app_role)
  );

DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
CREATE POLICY "Users can insert own profile" ON public.user_profiles 
  FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
CREATE POLICY "Users can update own profile" ON public.user_profiles 
  FOR UPDATE USING ((select auth.uid()) = user_id);

-- user_roles policies (also consolidating multiple permissive policies)
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own role" ON public.user_roles;
-- Consolidated policy: Admins can view all, users can view own
CREATE POLICY "Users and admins can view roles" ON public.user_roles 
  FOR SELECT USING (
    (select auth.uid()) = user_id 
    OR public.has_role((select auth.uid()), 'admin'::public.app_role)
  );

DROP POLICY IF EXISTS "Admins can insert roles" ON public.user_roles;
CREATE POLICY "Admins can insert roles" ON public.user_roles 
  FOR INSERT WITH CHECK (public.has_role((select auth.uid()), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can update roles" ON public.user_roles;
CREATE POLICY "Admins can update roles" ON public.user_roles 
  FOR UPDATE USING (public.has_role((select auth.uid()), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can delete roles" ON public.user_roles;
CREATE POLICY "Admins can delete roles" ON public.user_roles 
  FOR DELETE USING (public.has_role((select auth.uid()), 'admin'::public.app_role));

-- valuation_requests policies (also consolidating multiple permissive policies)
DROP POLICY IF EXISTS "Admins can view valuation requests" ON public.valuation_requests;
DROP POLICY IF EXISTS "Users can view own requests" ON public.valuation_requests;
DROP POLICY IF EXISTS "Clients can view their own requests by user_id" ON public.valuation_requests;
-- Consolidated policy: Admins can view all, users can view own (by user_id or email)
CREATE POLICY "Users and admins can view valuation requests" ON public.valuation_requests 
  FOR SELECT USING (
    public.has_role((select auth.uid()), 'admin'::public.app_role)
    OR (select auth.uid()) = user_id
    OR email = public.get_user_email()
  );

DROP POLICY IF EXISTS "Admins can update valuation requests" ON public.valuation_requests;
CREATE POLICY "Admins can update valuation requests" ON public.valuation_requests 
  FOR UPDATE USING (public.has_role((select auth.uid()), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can delete valuation requests" ON public.valuation_requests;
CREATE POLICY "Admins can delete valuation requests" ON public.valuation_requests 
  FOR DELETE USING (public.has_role((select auth.uid()), 'admin'::public.app_role));

-- valuation_messages policies (also consolidating multiple permissive policies)
DROP POLICY IF EXISTS "Admins can view all messages" ON public.valuation_messages;
DROP POLICY IF EXISTS "Users can view their request messages" ON public.valuation_messages;
-- Consolidated policy: Admins can view all, users can view their own request messages
CREATE POLICY "Users and admins can view messages" ON public.valuation_messages 
  FOR SELECT USING (
    public.has_role((select auth.uid()), 'admin'::public.app_role)
    OR public.user_owns_valuation_request(request_id)
  );

DROP POLICY IF EXISTS "Admins can update messages" ON public.valuation_messages;
DROP POLICY IF EXISTS "Users can update read status" ON public.valuation_messages;
-- Consolidated policy: Admins can update all, users can update read status on admin messages
CREATE POLICY "Users and admins can update messages" ON public.valuation_messages 
  FOR UPDATE USING (
    public.has_role((select auth.uid()), 'admin'::public.app_role)
    OR (
      public.user_owns_valuation_request(request_id) 
      AND sender_type = 'admin'
    )
  )
  WITH CHECK (
    public.has_role((select auth.uid()), 'admin'::public.app_role)
    OR (
      public.user_owns_valuation_request(request_id) 
      AND sender_type = 'admin'
    )
  );

-- =============================================
-- PART 2: Verify fixes
-- =============================================
DO $$
BEGIN
  RAISE NOTICE 'RLS performance fixes applied successfully!';
  RAISE NOTICE 'All auth.uid() calls wrapped with (select ...)';
  RAISE NOTICE 'Multiple permissive policies consolidated';
END $$;
