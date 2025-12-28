-- =============================================
-- AutoAndrew Database - Full Migration
-- =============================================
-- This file combines all migrations into one.
-- Run this in your Supabase SQL editor.
-- =============================================

-- =============================================
-- STEP 1: ENUMS
-- =============================================
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- =============================================
-- STEP 2: TABLES
-- =============================================

-- User profiles
CREATE TABLE public.user_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  name TEXT,
  surname TEXT,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User roles
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  role public.app_role NOT NULL DEFAULT 'user'::app_role,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- App settings
CREATE TABLE public.app_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Saved vehicles
CREATE TABLE public.saved_vehicles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  vehicle_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Valuation requests
CREATE TABLE public.valuation_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  fuel_type TEXT NOT NULL,
  mileage INTEGER NOT NULL,
  condition TEXT NOT NULL,
  images JSONB DEFAULT '[]'::jsonb,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  notes TEXT,
  price INTEGER,
  estimated_value INTEGER,
  final_offer INTEGER,
  status TEXT NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  appointment_date TIMESTAMP WITH TIME ZONE,
  last_message_at TIMESTAMP WITH TIME ZONE,
  last_message_preview TEXT,
  unread_count_admin INTEGER NOT NULL DEFAULT 0,
  unread_count_user INTEGER NOT NULL DEFAULT 0,
  user_id UUID
);

-- Valuation messages
CREATE TABLE public.valuation_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID NOT NULL REFERENCES public.valuation_requests(id) ON DELETE CASCADE,
  sender_user_id UUID,
  sender_type TEXT NOT NULL,
  body TEXT NOT NULL,
  attachments JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  read_at TIMESTAMP WITH TIME ZONE
);

-- Activity log
CREATE TABLE public.activity_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  read_at TIMESTAMP WITH TIME ZONE
);

-- =============================================
-- STEP 3: INDEXES
-- =============================================
CREATE INDEX idx_activity_log_unread ON public.activity_log (read_at) WHERE read_at IS NULL;
CREATE INDEX idx_valuation_messages_request_id ON public.valuation_messages (request_id);
CREATE INDEX idx_valuation_messages_created_at ON public.valuation_messages (created_at);
CREATE INDEX idx_valuation_messages_request_created ON public.valuation_messages (request_id, created_at);

-- =============================================
-- STEP 4: FUNCTIONS
-- =============================================

CREATE OR REPLACE FUNCTION public.get_user_role(_user_id uuid)
RETURNS app_role
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT role FROM public.user_roles WHERE user_id = _user_id LIMIT 1
$function$;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$function$;

CREATE OR REPLACE FUNCTION public.user_owns_valuation_request(_request_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.valuation_requests vr
    WHERE vr.id = _request_id
    AND (vr.user_id = auth.uid() OR vr.email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  )
$function$;

CREATE OR REPLACE FUNCTION public.valuation_request_is_pending(_request_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.valuation_requests vr
    WHERE vr.id = _request_id AND vr.status = 'pending'
    AND (vr.user_id = auth.uid() OR vr.email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  )
$function$;

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
  v_caller_id := auth.uid();
  IF v_caller_id IS NULL THEN RAISE EXCEPTION 'UNAUTHENTICATED'; END IF;
  
  SELECT role INTO v_caller_role FROM public.user_roles WHERE user_id = v_caller_id LIMIT 1;
  SELECT status, user_id, email INTO v_request_status, v_request_owner_id, v_request_email
  FROM public.valuation_requests WHERE id = p_request_id;
  
  IF v_request_status IS NULL THEN RAISE EXCEPTION 'REQUEST_NOT_FOUND'; END IF;
  
  SELECT email INTO v_caller_email FROM auth.users WHERE id = v_caller_id;
  
  IF v_caller_role = 'admin' THEN
    v_sender_role := 'admin';
  ELSE
    v_sender_role := 'user';
    IF v_request_owner_id != v_caller_id AND v_request_email != v_caller_email THEN
      RAISE EXCEPTION 'ACCESS_DENIED';
    END IF;
    IF v_request_status != 'pending' THEN RAISE EXCEPTION 'MESSAGING_LOCKED'; END IF;
  END IF;
  
  IF length(trim(p_body)) = 0 THEN RAISE EXCEPTION 'EMPTY_MESSAGE'; END IF;
  IF length(p_body) > 2000 THEN RAISE EXCEPTION 'MESSAGE_TOO_LONG'; END IF;
  
  INSERT INTO public.valuation_messages (request_id, sender_user_id, sender_type, body, attachments, created_at)
  VALUES (p_request_id, v_caller_id, v_sender_role, trim(p_body), p_attachments, now())
  RETURNING id INTO v_message_id;
  
  UPDATE public.valuation_requests SET 
    last_message_at = now(),
    last_message_preview = left(trim(p_body), 140),
    unread_count_admin = CASE WHEN v_sender_role = 'user' THEN unread_count_admin + 1 ELSE 0 END,
    unread_count_user = CASE WHEN v_sender_role = 'admin' THEN unread_count_user + 1 ELSE 0 END
  WHERE id = p_request_id;
  
  INSERT INTO public.activity_log (user_id, action, entity_type, entity_id, details)
  VALUES (v_caller_id, 'message_sent', 'valuation_request', p_request_id, jsonb_build_object('sender_role', v_sender_role));
  
  RETURN v_message_id;
END;
$function$;

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
  v_caller_id := auth.uid();
  IF v_caller_id IS NULL THEN RAISE EXCEPTION 'UNAUTHENTICATED'; END IF;
  
  SELECT role INTO v_caller_role FROM public.user_roles WHERE user_id = v_caller_id LIMIT 1;
  SELECT user_id, email INTO v_request_owner_id, v_request_email FROM public.valuation_requests WHERE id = p_request_id;
  
  IF v_request_owner_id IS NULL AND v_request_email IS NULL THEN RAISE EXCEPTION 'REQUEST_NOT_FOUND'; END IF;
  
  SELECT email INTO v_caller_email FROM auth.users WHERE id = v_caller_id;
  
  IF v_caller_role = 'admin' THEN
    UPDATE public.valuation_messages SET read_at = now()
    WHERE request_id = p_request_id AND sender_type = 'user' AND read_at IS NULL;
    UPDATE public.valuation_requests SET unread_count_admin = 0 WHERE id = p_request_id;
  ELSE
    IF v_request_owner_id != v_caller_id AND v_request_email != v_caller_email THEN
      RAISE EXCEPTION 'ACCESS_DENIED';
    END IF;
    UPDATE public.valuation_messages SET read_at = now()
    WHERE request_id = p_request_id AND sender_type = 'admin' AND read_at IS NULL;
    UPDATE public.valuation_requests SET unread_count_user = 0 WHERE id = p_request_id;
  END IF;
END;
$function$;

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
  v_caller_id := auth.uid();
  IF v_caller_id IS NULL THEN RAISE EXCEPTION 'UNAUTHENTICATED'; END IF;
  
  SELECT role INTO v_caller_role FROM public.user_roles WHERE user_id = v_caller_id LIMIT 1;
  IF v_caller_role != 'admin' THEN RAISE EXCEPTION 'ACCESS_DENIED'; END IF;
  
  INSERT INTO public.valuation_messages (request_id, sender_user_id, sender_type, body, created_at)
  VALUES (p_request_id, NULL, 'system', p_body, now())
  RETURNING id INTO v_message_id;
  
  UPDATE public.valuation_requests SET last_message_at = now(), last_message_preview = left(p_body, 140)
  WHERE id = p_request_id;
  
  RETURN v_message_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.user_profiles (user_id, email, name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data ->> 'name', NEW.raw_user_meta_data ->> 'full_name', split_part(NEW.email, '@', 1)));
  
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$function$;

-- =============================================
-- STEP 5: TRIGGER (on auth.users)
-- =============================================
-- NOTE: Run this separately if you get permission errors
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- STEP 6: ENABLE RLS
-- =============================================
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.valuation_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.valuation_requests ENABLE ROW LEVEL SECURITY;

-- =============================================
-- STEP 7: RLS POLICIES
-- =============================================

-- activity_log
CREATE POLICY "Admins can view activity logs" ON public.activity_log FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert activity logs" ON public.activity_log FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete activity logs" ON public.activity_log FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- app_settings
CREATE POLICY "Admins can view settings" ON public.app_settings FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert settings" ON public.app_settings FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update settings" ON public.app_settings FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete settings" ON public.app_settings FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- saved_vehicles
CREATE POLICY "Users can view own saved vehicles" ON public.saved_vehicles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own saved vehicles" ON public.saved_vehicles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own saved vehicles" ON public.saved_vehicles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own saved vehicles" ON public.saved_vehicles FOR DELETE USING (auth.uid() = user_id);

-- user_profiles
CREATE POLICY "Users can view own profile" ON public.user_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all profiles" ON public.user_profiles FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can insert own profile" ON public.user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.user_profiles FOR UPDATE USING (auth.uid() = user_id);

-- user_roles
CREATE POLICY "Users can view their own role" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert roles" ON public.user_roles FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update roles" ON public.user_roles FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete roles" ON public.user_roles FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- valuation_requests
CREATE POLICY "Anyone can submit valuation request" ON public.valuation_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view valuation requests" ON public.valuation_requests FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can view own requests" ON public.valuation_requests FOR SELECT USING (user_id = auth.uid() OR email = (SELECT email FROM auth.users WHERE id = auth.uid()));
CREATE POLICY "Admins can update valuation requests" ON public.valuation_requests FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete valuation requests" ON public.valuation_requests FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- valuation_messages
CREATE POLICY "Block direct inserts" ON public.valuation_messages FOR INSERT WITH CHECK (false);
CREATE POLICY "Admins can view all messages" ON public.valuation_messages FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can view their request messages" ON public.valuation_messages FOR SELECT USING (user_owns_valuation_request(request_id));
CREATE POLICY "Admins can update messages" ON public.valuation_messages FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can update read status" ON public.valuation_messages FOR UPDATE USING (user_owns_valuation_request(request_id) AND sender_type = 'admin') WITH CHECK (user_owns_valuation_request(request_id) AND sender_type = 'admin');

-- =============================================
-- STEP 8: REALTIME
-- =============================================
ALTER TABLE public.valuation_messages REPLICA IDENTITY FULL;
ALTER TABLE public.valuation_requests REPLICA IDENTITY FULL;

DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.valuation_messages; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.valuation_requests; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.app_settings; EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- =============================================
-- STEP 9: SEED DATA (Optional)
-- =============================================
INSERT INTO public.app_settings (key, value) VALUES ('logo_text_visible', 'true'), ('publish_button_visible', 'false') ON CONFLICT (key) DO NOTHING;

-- =============================================
-- DONE!
-- =============================================
