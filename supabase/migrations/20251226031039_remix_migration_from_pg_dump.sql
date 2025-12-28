CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "plpgsql" WITH SCHEMA "pg_catalog";
CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";
BEGIN;

--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



--
-- Name: app_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.app_role AS ENUM (
    'admin',
    'user'
);


--
-- Name: get_user_role(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_user_role(_user_id uuid) RETURNS public.app_role
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  LIMIT 1
$$;


--
-- Name: has_role(uuid, public.app_role); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.has_role(_user_id uuid, _role public.app_role) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;


SET default_table_access_method = heap;

--
-- Name: activity_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.activity_log (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    action text NOT NULL,
    entity_type text NOT NULL,
    entity_id uuid NOT NULL,
    details jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    read_at timestamp with time zone
);


--
-- Name: app_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.app_settings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    key text NOT NULL,
    value text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: saved_vehicles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.saved_vehicles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    vehicle_data jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: user_profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_profiles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    name text,
    surname text,
    phone text,
    email text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_roles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    role public.app_role DEFAULT 'user'::public.app_role NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: valuation_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.valuation_requests (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    make text NOT NULL,
    model text NOT NULL,
    year integer NOT NULL,
    fuel_type text NOT NULL,
    mileage integer NOT NULL,
    condition text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    phone text NOT NULL,
    notes text,
    estimated_value integer,
    status text DEFAULT 'pending'::text NOT NULL,
    images jsonb DEFAULT '[]'::jsonb,
    admin_notes text,
    final_offer integer,
    appointment_date timestamp with time zone,
    price integer
);


--
-- Name: activity_log activity_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activity_log
    ADD CONSTRAINT activity_log_pkey PRIMARY KEY (id);


--
-- Name: app_settings app_settings_key_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.app_settings
    ADD CONSTRAINT app_settings_key_key UNIQUE (key);


--
-- Name: app_settings app_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.app_settings
    ADD CONSTRAINT app_settings_pkey PRIMARY KEY (id);


--
-- Name: saved_vehicles saved_vehicles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.saved_vehicles
    ADD CONSTRAINT saved_vehicles_pkey PRIMARY KEY (id);


--
-- Name: user_profiles user_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT user_profiles_pkey PRIMARY KEY (id);


--
-- Name: user_profiles user_profiles_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT user_profiles_user_id_key UNIQUE (user_id);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_user_id_role_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_role_key UNIQUE (user_id, role);


--
-- Name: valuation_requests valuation_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.valuation_requests
    ADD CONSTRAINT valuation_requests_pkey PRIMARY KEY (id);


--
-- Name: idx_activity_log_unread; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_activity_log_unread ON public.activity_log USING btree (read_at) WHERE (read_at IS NULL);


--
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: activity_log Admins can delete activity logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can delete activity logs" ON public.activity_log FOR DELETE USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: user_roles Admins can delete roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can delete roles" ON public.user_roles FOR DELETE USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: app_settings Admins can delete settings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can delete settings" ON public.app_settings FOR DELETE USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: valuation_requests Admins can delete valuation requests; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can delete valuation requests" ON public.valuation_requests FOR DELETE USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: activity_log Admins can insert activity logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can insert activity logs" ON public.activity_log FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: user_roles Admins can insert roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can insert roles" ON public.user_roles FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: app_settings Admins can insert settings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can insert settings" ON public.app_settings FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: user_roles Admins can update roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update roles" ON public.user_roles FOR UPDATE USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: app_settings Admins can update settings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update settings" ON public.app_settings FOR UPDATE USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: valuation_requests Admins can update valuation requests; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update valuation requests" ON public.valuation_requests FOR UPDATE USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: activity_log Admins can view activity logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view activity logs" ON public.activity_log FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: user_profiles Admins can view all profiles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all profiles" ON public.user_profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: user_roles Admins can view all roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: app_settings Admins can view settings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view settings" ON public.app_settings FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: valuation_requests Admins can view valuation requests; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view valuation requests" ON public.valuation_requests FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: valuation_requests Anyone can submit valuation request; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can submit valuation request" ON public.valuation_requests FOR INSERT WITH CHECK (true);


--
-- Name: saved_vehicles Users can delete own saved vehicles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete own saved vehicles" ON public.saved_vehicles FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: user_profiles Users can insert own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own profile" ON public.user_profiles FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: saved_vehicles Users can insert own saved vehicles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own saved vehicles" ON public.saved_vehicles FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: user_profiles Users can update own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own profile" ON public.user_profiles FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: saved_vehicles Users can update own saved vehicles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own saved vehicles" ON public.saved_vehicles FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: user_profiles Users can view own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own profile" ON public.user_profiles FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: saved_vehicles Users can view own saved vehicles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own saved vehicles" ON public.saved_vehicles FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: user_roles Users can view their own role; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own role" ON public.user_roles FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: activity_log; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

--
-- Name: app_settings; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

--
-- Name: saved_vehicles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.saved_vehicles ENABLE ROW LEVEL SECURITY;

--
-- Name: user_profiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: user_roles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

--
-- Name: valuation_requests; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.valuation_requests ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--




COMMIT;