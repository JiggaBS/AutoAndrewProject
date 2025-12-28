-- Update send_valuation_message function to allow empty body when attachments are present

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
  IF length(trim(p_body)) = 0 AND (p_attachments IS NULL OR p_attachments = '[]'::jsonb OR jsonb_array_length(p_attachments) = 0) THEN
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
    last_message_preview = CASE 
      WHEN length(trim(p_body)) > 0 THEN left(trim(p_body), 140)
      WHEN p_attachments IS NOT NULL AND jsonb_array_length(p_attachments) > 0 THEN '📎 Allegato'
      ELSE 'Messaggio'
    END,
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
    jsonb_build_object('sender_role', v_sender_role, 'has_attachments', p_attachments IS NOT NULL AND jsonb_array_length(p_attachments) > 0)
  );
  
  RETURN v_message_id;
END;
$$;
