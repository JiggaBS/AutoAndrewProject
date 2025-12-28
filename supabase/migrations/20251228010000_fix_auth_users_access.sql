-- =============================================
-- Fix: Remove direct auth.users access in RLS policies and functions
-- =============================================
-- This migration fixes "permission denied for table users" errors
-- by using SECURITY DEFINER functions with proper permissions

-- 1. Create a helper function to get user email
-- Uses SECURITY DEFINER to safely access auth.users
CREATE OR REPLACE FUNCTION public.get_user_email()
RETURNS text
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_email text;
BEGIN
  -- First try user_profiles (most reliable, no auth.users access needed)
  SELECT email INTO user_email
  FROM public.user_profiles
  WHERE user_id = auth.uid()
  LIMIT 1;
  
  -- If found, return it
  IF user_email IS NOT NULL THEN
    RETURN user_email;
  END IF;
  
  -- Fallback: get from auth.users (requires SECURITY DEFINER)
  -- This works because SECURITY DEFINER functions run with creator's privileges
  SELECT email INTO user_email
  FROM auth.users
  WHERE id = auth.uid()
  LIMIT 1;
  
  RETURN user_email;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_user_email() TO authenticated;

-- 2. Fix user_owns_valuation_request function
CREATE OR REPLACE FUNCTION public.user_owns_valuation_request(_request_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.valuation_requests vr
    WHERE vr.id = _request_id
    AND (
      vr.user_id = auth.uid()
      OR vr.email = public.get_user_email()
    )
  )
$$;

-- 3. Fix valuation_request_is_pending function
CREATE OR REPLACE FUNCTION public.valuation_request_is_pending(_request_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.valuation_requests vr
    WHERE vr.id = _request_id
    AND vr.status = 'pending'
    AND (
      vr.user_id = auth.uid()
      OR vr.email = public.get_user_email()
    )
  )
$$;

-- 4. Drop and recreate RLS policies that use auth.users
DROP POLICY IF EXISTS "Users can view own requests" ON public.valuation_requests;
DROP POLICY IF EXISTS "Clients can view their own requests by user_id" ON public.valuation_requests;

-- Recreate without direct auth.users access
CREATE POLICY "Users can view own requests" ON public.valuation_requests
  FOR SELECT USING (
    user_id = auth.uid() 
    OR email = public.get_user_email()
  );

CREATE POLICY "Clients can view their own requests by user_id" ON public.valuation_requests
  FOR SELECT USING (
    auth.uid() = user_id
    OR email = public.get_user_email()
  );
