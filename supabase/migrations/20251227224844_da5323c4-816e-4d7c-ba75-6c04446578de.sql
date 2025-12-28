-- =============================================
-- MESSAGING SYSTEM OVERHAUL (FIXED ORDER)
-- =============================================

-- 1) Modify valuation_messages table to add new columns
ALTER TABLE public.valuation_messages 
ADD COLUMN IF NOT EXISTS attachments jsonb NULL;

-- Rename sender_id to sender_user_id if it exists (for consistency)
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'valuation_messages' AND column_name = 'sender_id') THEN
    ALTER TABLE public.valuation_messages RENAME COLUMN sender_id TO sender_user_id;
  END IF;
END $$;

-- Rename message to body if it exists
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'valuation_messages' AND column_name = 'message') THEN
    ALTER TABLE public.valuation_messages RENAME COLUMN message TO body;
  END IF;
END $$;

-- Drop the constraint first if it exists
ALTER TABLE public.valuation_messages 
DROP CONSTRAINT IF EXISTS valuation_messages_sender_type_check;

-- Update sender_type values - normalize 'client' to 'user'
UPDATE public.valuation_messages 
SET sender_type = 'user' WHERE sender_type = 'client';

-- Now add the constraint after data is normalized
ALTER TABLE public.valuation_messages 
ADD CONSTRAINT valuation_messages_sender_type_check 
CHECK (sender_type IN ('admin', 'user', 'system'));

-- 2) Add messaging columns to valuation_requests
ALTER TABLE public.valuation_requests 
ADD COLUMN IF NOT EXISTS last_message_at timestamptz NULL,
ADD COLUMN IF NOT EXISTS last_message_preview text NULL,
ADD COLUMN IF NOT EXISTS unread_count_user int NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS unread_count_admin int NOT NULL DEFAULT 0;

-- 3) Create index for faster message queries
CREATE INDEX IF NOT EXISTS idx_valuation_messages_request_created 
ON public.valuation_messages(request_id, created_at);

-- 4) Enable realtime for valuation_messages (ignore if already added)
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.valuation_messages;
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

-- 5) Drop existing RLS policies for valuation_messages
DROP POLICY IF EXISTS "Admins can insert messages" ON public.valuation_messages;
DROP POLICY IF EXISTS "Admins can update messages" ON public.valuation_messages;
DROP POLICY IF EXISTS "Admins can view all messages" ON public.valuation_messages;
DROP POLICY IF EXISTS "Clients can insert messages only when pending" ON public.valuation_messages;
DROP POLICY IF EXISTS "Clients can update their messages read status" ON public.valuation_messages;
DROP POLICY IF EXISTS "Clients can view their request messages" ON public.valuation_messages;
DROP POLICY IF EXISTS "Users can view their request messages" ON public.valuation_messages;
DROP POLICY IF EXISTS "Users can update read status" ON public.valuation_messages;
DROP POLICY IF EXISTS "Block direct inserts" ON public.valuation_messages;

-- 6) Create new RLS policies for valuation_messages (NO direct inserts - only RPC)
-- Users can SELECT their own request messages
CREATE POLICY "Users can view their request messages"
ON public.valuation_messages FOR SELECT
USING (
  user_owns_valuation_request(request_id)
);

-- Admins can SELECT all messages
CREATE POLICY "Admins can view all messages"
ON public.valuation_messages FOR SELECT
USING (
  has_role(auth.uid(), 'admin'::app_role)
);

-- Admins can update messages (mark read, etc)
CREATE POLICY "Admins can update messages"
ON public.valuation_messages FOR UPDATE
USING (
  has_role(auth.uid(), 'admin'::app_role)
);

-- Users can update read_at on their messages
CREATE POLICY "Users can update read status"
ON public.valuation_messages FOR UPDATE
USING (
  user_owns_valuation_request(request_id) AND sender_type = 'admin'
)
WITH CHECK (
  user_owns_valuation_request(request_id) AND sender_type = 'admin'
);

-- NO INSERT policies - all inserts go through RPC
-- Block direct inserts
CREATE POLICY "Block direct inserts"
ON public.valuation_messages FOR INSERT
WITH CHECK (false);

-- 7) Create RPC: send_valuation_message
CREATE OR REPLACE FUNCTION public.send_valuation_message(
  p_request_id uuid,
  p_body text,
  p_attachments jsonb DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_caller_id uuid;
  v_caller_role app_role;
  v_request_status text;
  v_request_owner_id uuid;
  v_request_email text;
  v_caller_email text;
  v_sender_role text;
  v_message_id uuid;
BEGIN
  -- Get caller info
  v_caller_id := auth.uid();
  IF v_caller_id IS NULL THEN
    RAISE EXCEPTION 'UNAUTHENTICATED';
  END IF;
  
  -- Get caller role
  SELECT role INTO v_caller_role
  FROM public.user_roles
  WHERE user_id = v_caller_id
  LIMIT 1;
  
  -- Get request info
  SELECT status, user_id, email INTO v_request_status, v_request_owner_id, v_request_email
  FROM public.valuation_requests
  WHERE id = p_request_id;
  
  IF v_request_status IS NULL THEN
    RAISE EXCEPTION 'REQUEST_NOT_FOUND';
  END IF;
  
  -- Get caller email
  SELECT email INTO v_caller_email
  FROM auth.users
  WHERE id = v_caller_id;
  
  -- Determine sender role and check permissions
  IF v_caller_role = 'admin' THEN
    v_sender_role := 'admin';
    -- Admin can always send
  ELSE
    v_sender_role := 'user';
    
    -- Check if user owns the request
    IF v_request_owner_id != v_caller_id AND v_request_email != v_caller_email THEN
      RAISE EXCEPTION 'ACCESS_DENIED';
    END IF;
    
    -- Check if status allows messaging (only 'pending' = 'in_attesa')
    IF v_request_status != 'pending' THEN
      RAISE EXCEPTION 'MESSAGING_LOCKED';
    END IF;
  END IF;
  
  -- Validate body - allow empty if attachments are present
  IF length(trim(p_body)) = 0 AND (p_attachments IS NULL OR p_attachments = '[]'::jsonb) THEN
    RAISE EXCEPTION 'EMPTY_MESSAGE';
  END IF;
  
  IF length(p_body) > 2000 THEN
    RAISE EXCEPTION 'MESSAGE_TOO_LONG';
  END IF;
  
  -- Insert message
  INSERT INTO public.valuation_messages (
    request_id,
    sender_user_id,
    sender_type,
    body,
    attachments,
    created_at
  ) VALUES (
    p_request_id,
    v_caller_id,
    v_sender_role,
    trim(p_body),
    p_attachments,
    now()
  ) RETURNING id INTO v_message_id;
  
  -- Update request metadata
  UPDATE public.valuation_requests
  SET 
    last_message_at = now(),
    last_message_preview = left(trim(p_body), 140),
    unread_count_admin = CASE WHEN v_sender_role = 'user' THEN unread_count_admin + 1 ELSE 0 END,
    unread_count_user = CASE WHEN v_sender_role = 'admin' THEN unread_count_user + 1 ELSE 0 END
  WHERE id = p_request_id;
  
  -- Log activity
  INSERT INTO public.activity_log (
    user_id,
    action,
    entity_type,
    entity_id,
    details
  ) VALUES (
    v_caller_id,
    'message_sent',
    'valuation_request',
    p_request_id,
    jsonb_build_object('sender_role', v_sender_role)
  );
  
  RETURN v_message_id;
END;
$$;

-- 8) Create RPC: mark_thread_read
CREATE OR REPLACE FUNCTION public.mark_thread_read(p_request_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_caller_id uuid;
  v_caller_role app_role;
  v_request_owner_id uuid;
  v_request_email text;
  v_caller_email text;
BEGIN
  -- Get caller info
  v_caller_id := auth.uid();
  IF v_caller_id IS NULL THEN
    RAISE EXCEPTION 'UNAUTHENTICATED';
  END IF;
  
  -- Get caller role
  SELECT role INTO v_caller_role
  FROM public.user_roles
  WHERE user_id = v_caller_id
  LIMIT 1;
  
  -- Get request info
  SELECT user_id, email INTO v_request_owner_id, v_request_email
  FROM public.valuation_requests
  WHERE id = p_request_id;
  
  IF v_request_owner_id IS NULL AND v_request_email IS NULL THEN
    RAISE EXCEPTION 'REQUEST_NOT_FOUND';
  END IF;
  
  -- Get caller email
  SELECT email INTO v_caller_email
  FROM auth.users
  WHERE id = v_caller_id;
  
  IF v_caller_role = 'admin' THEN
    -- Admin: mark user messages as read, reset admin unread count
    UPDATE public.valuation_messages
    SET read_at = now()
    WHERE request_id = p_request_id
      AND sender_type = 'user'
      AND read_at IS NULL;
    
    UPDATE public.valuation_requests
    SET unread_count_admin = 0
    WHERE id = p_request_id;
  ELSE
    -- User: check ownership first
    IF v_request_owner_id != v_caller_id AND v_request_email != v_caller_email THEN
      RAISE EXCEPTION 'ACCESS_DENIED';
    END IF;
    
    -- Mark admin messages as read, reset user unread count
    UPDATE public.valuation_messages
    SET read_at = now()
    WHERE request_id = p_request_id
      AND sender_type = 'admin'
      AND read_at IS NULL;
    
    UPDATE public.valuation_requests
    SET unread_count_user = 0
    WHERE id = p_request_id;
  END IF;
END;
$$;

-- 9) Create RPC: insert_system_message (for status changes, etc)
CREATE OR REPLACE FUNCTION public.insert_system_message(
  p_request_id uuid,
  p_body text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_caller_id uuid;
  v_caller_role app_role;
  v_message_id uuid;
BEGIN
  -- Get caller info
  v_caller_id := auth.uid();
  IF v_caller_id IS NULL THEN
    RAISE EXCEPTION 'UNAUTHENTICATED';
  END IF;
  
  -- Only admins can insert system messages
  SELECT role INTO v_caller_role
  FROM public.user_roles
  WHERE user_id = v_caller_id
  LIMIT 1;
  
  IF v_caller_role != 'admin' THEN
    RAISE EXCEPTION 'ACCESS_DENIED';
  END IF;
  
  -- Insert system message
  INSERT INTO public.valuation_messages (
    request_id,
    sender_user_id,
    sender_type,
    body,
    created_at
  ) VALUES (
    p_request_id,
    NULL,
    'system',
    p_body,
    now()
  ) RETURNING id INTO v_message_id;
  
  -- Update last message info
  UPDATE public.valuation_requests
  SET 
    last_message_at = now(),
    last_message_preview = left(p_body, 140)
  WHERE id = p_request_id;
  
  RETURN v_message_id;
END;
$$;

-- 10) Grant execute permissions on RPCs
GRANT EXECUTE ON FUNCTION public.send_valuation_message(uuid, text, jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION public.mark_thread_read(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.insert_system_message(uuid, text) TO authenticated;