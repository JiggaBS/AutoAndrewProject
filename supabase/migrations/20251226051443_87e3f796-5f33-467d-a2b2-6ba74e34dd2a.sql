-- Create valuation_messages table for per-request communication threads
CREATE TABLE public.valuation_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid NOT NULL REFERENCES public.valuation_requests(id) ON DELETE CASCADE,
  sender_type text NOT NULL CHECK (sender_type IN ('admin', 'client')),
  sender_id uuid, -- NULL for unauthenticated clients (legacy), user_id for authenticated
  message text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  read_at timestamp with time zone
);

-- Create index for efficient lookups
CREATE INDEX idx_valuation_messages_request_id ON public.valuation_messages(request_id);
CREATE INDEX idx_valuation_messages_created_at ON public.valuation_messages(created_at);

-- Enable RLS
ALTER TABLE public.valuation_messages ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can always read all messages
CREATE POLICY "Admins can view all messages"
ON public.valuation_messages
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Policy: Admins can always insert messages
CREATE POLICY "Admins can insert messages"
ON public.valuation_messages
FOR INSERT
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role)
  AND sender_type = 'admin'
);

-- Policy: Clients can read messages for their own requests (by email match)
CREATE POLICY "Clients can view their request messages"
ON public.valuation_messages
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.valuation_requests vr
    JOIN auth.users u ON u.email = vr.email
    WHERE vr.id = request_id
    AND u.id = auth.uid()
  )
);

-- Policy: Clients can ONLY insert messages when status = 'pending' (In attesa)
-- This is the critical enforcement for status-based messaging
CREATE POLICY "Clients can insert messages only when pending"
ON public.valuation_messages
FOR INSERT
WITH CHECK (
  sender_type = 'client'
  AND EXISTS (
    SELECT 1 FROM public.valuation_requests vr
    JOIN auth.users u ON u.email = vr.email
    WHERE vr.id = request_id
    AND u.id = auth.uid()
    AND vr.status = 'pending'  -- ONLY when status is "In attesa"
  )
);

-- Policy: Admins can update messages (e.g., mark as read)
CREATE POLICY "Admins can update messages"
ON public.valuation_messages
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Policy: Clients can update their own messages (mark as read)
CREATE POLICY "Clients can update their messages read status"
ON public.valuation_messages
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.valuation_requests vr
    JOIN auth.users u ON u.email = vr.email
    WHERE vr.id = request_id
    AND u.id = auth.uid()
  )
);

-- Add user_id column to valuation_requests to link requests to authenticated users
ALTER TABLE public.valuation_requests 
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- Update RLS policy for valuation_requests to allow clients to view their own requests
CREATE POLICY "Clients can view their own requests by user_id"
ON public.valuation_requests
FOR SELECT
USING (
  auth.uid() = user_id
  OR (
    EXISTS (
      SELECT 1 FROM auth.users u
      WHERE u.id = auth.uid()
      AND u.email = valuation_requests.email
    )
  )
);