-- =============================================
-- AutoAndrew Database Migration: Functions
-- =============================================
-- Run this AFTER 002_tables.sql
-- =============================================

-- =============================================
-- Function: get_user_role
-- Returns the role for a given user
-- =============================================
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id uuid)
RETURNS app_role
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  LIMIT 1
$function$;

-- =============================================
-- Function: has_role
-- Checks if a user has a specific role
-- =============================================
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$function$;

-- =============================================
-- Function: user_owns_valuation_request
-- Checks if current user owns the request (by user_id or email)
-- =============================================
CREATE OR REPLACE FUNCTION public.user_owns_valuation_request(_request_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.valuation_requests vr
    WHERE vr.id = _request_id
    AND (
      vr.user_id = auth.uid()
      OR vr.email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  )
$function$;

-- =============================================
-- Function: valuation_request_is_pending
-- Checks if user's request is still pending (can still message)
-- =============================================
CREATE OR REPLACE FUNCTION public.valuation_request_is_pending(_request_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.valuation_requests vr
    WHERE vr.id = _request_id
    AND vr.status = 'pending'
    AND (
      vr.user_id = auth.uid()
      OR vr.email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  )
$function$;

-- =============================================
-- Function: send_valuation_message
-- Sends a message in a valuation thread (with permissions check)
-- =============================================
CREATE OR REPLACE FUNCTION public.send_valuation_message(p_request_id uuid, p_body text, p_attachments jsonb DEFAULT NULL::jsonb)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
  
  -- Validate body
  IF length(trim(p_body)) = 0 THEN
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
$function$;

-- =============================================
-- Function: mark_thread_read
-- Marks messages as read for a thread (based on caller role)
-- =============================================
CREATE OR REPLACE FUNCTION public.mark_thread_read(p_request_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
$function$;

-- =============================================
-- Function: insert_system_message
-- Inserts a system message (admin only)
-- =============================================
CREATE OR REPLACE FUNCTION public.insert_system_message(p_request_id uuid, p_body text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
$function$;

-- =============================================
-- Function: handle_new_user
-- Trigger function: creates profile and role for new users
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Insert into user_profiles
  INSERT INTO public.user_profiles (user_id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'name', NEW.raw_user_meta_data ->> 'full_name', split_part(NEW.email, '@', 1))
  );
  
  -- Insert default user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$function$;
