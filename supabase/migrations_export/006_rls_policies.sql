-- =============================================
-- AutoAndrew Database Migration: RLS Policies
-- =============================================
-- Run this AFTER 004_functions.sql
-- =============================================

-- =============================================
-- Enable RLS on all tables
-- =============================================
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.valuation_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.valuation_requests ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RLS: activity_log (Admin only)
-- =============================================
CREATE POLICY "Admins can view activity logs" ON public.activity_log
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert activity logs" ON public.activity_log
  FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete activity logs" ON public.activity_log
  FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- =============================================
-- RLS: app_settings (Admin only)
-- =============================================
CREATE POLICY "Admins can view settings" ON public.app_settings
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert settings" ON public.app_settings
  FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update settings" ON public.app_settings
  FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete settings" ON public.app_settings
  FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- =============================================
-- RLS: saved_vehicles (User owns their own)
-- =============================================
CREATE POLICY "Users can view own saved vehicles" ON public.saved_vehicles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own saved vehicles" ON public.saved_vehicles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own saved vehicles" ON public.saved_vehicles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved vehicles" ON public.saved_vehicles
  FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- RLS: user_profiles (User owns + Admin sees all)
-- =============================================
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" ON public.user_profiles
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- =============================================
-- RLS: user_roles (User sees own + Admin manages all)
-- =============================================
CREATE POLICY "Users can view their own role" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" ON public.user_roles
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert roles" ON public.user_roles
  FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update roles" ON public.user_roles
  FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete roles" ON public.user_roles
  FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- =============================================
-- RLS: valuation_requests (Public insert, Admin manages, User views own)
-- =============================================
CREATE POLICY "Anyone can submit valuation request" ON public.valuation_requests
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view valuation requests" ON public.valuation_requests
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view own requests" ON public.valuation_requests
  FOR SELECT USING (
    user_id = auth.uid() OR 
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

CREATE POLICY "Admins can update valuation requests" ON public.valuation_requests
  FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete valuation requests" ON public.valuation_requests
  FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- =============================================
-- RLS: valuation_messages (Insert via function only)
-- =============================================
-- Block direct inserts - must use send_valuation_message function
CREATE POLICY "Block direct inserts" ON public.valuation_messages
  FOR INSERT WITH CHECK (false);

CREATE POLICY "Admins can view all messages" ON public.valuation_messages
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view their request messages" ON public.valuation_messages
  FOR SELECT USING (user_owns_valuation_request(request_id));

CREATE POLICY "Admins can update messages" ON public.valuation_messages
  FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can update read status" ON public.valuation_messages
  FOR UPDATE 
  USING (user_owns_valuation_request(request_id) AND sender_type = 'admin')
  WITH CHECK (user_owns_valuation_request(request_id) AND sender_type = 'admin');
