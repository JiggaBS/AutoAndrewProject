-- Drop the problematic policy that references auth.users
DROP POLICY IF EXISTS "Clients can view their own requests by user_id" ON public.valuation_requests;

-- Also fix the valuation_messages policies that reference auth.users
DROP POLICY IF EXISTS "Clients can view their request messages" ON public.valuation_messages;
DROP POLICY IF EXISTS "Clients can insert messages only when pending" ON public.valuation_messages;
DROP POLICY IF EXISTS "Clients can update their messages read status" ON public.valuation_messages;

-- Create a security definer function to check if user owns a valuation request
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
      OR vr.email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  )
$$;

-- Create a function to check request status
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
      OR vr.email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  )
$$;

-- Recreate policies for valuation_messages using security definer functions
CREATE POLICY "Clients can view their request messages"
ON public.valuation_messages
FOR SELECT
USING (public.user_owns_valuation_request(request_id));

CREATE POLICY "Clients can insert messages only when pending"
ON public.valuation_messages
FOR INSERT
WITH CHECK (
  sender_type = 'client'
  AND public.valuation_request_is_pending(request_id)
);

CREATE POLICY "Clients can update their messages read status"
ON public.valuation_messages
FOR UPDATE
USING (public.user_owns_valuation_request(request_id));