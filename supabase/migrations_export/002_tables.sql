-- =============================================
-- AutoAndrew Database Migration: Tables
-- =============================================
-- Run this AFTER 001_enums.sql
-- =============================================

-- =============================================
-- Table: user_profiles
-- Stores additional user information beyond auth.users
-- =============================================
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

-- =============================================
-- Table: user_roles
-- Maps users to their roles (admin/user)
-- =============================================
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  role public.app_role NOT NULL DEFAULT 'user'::app_role,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- =============================================
-- Table: app_settings
-- Key-value store for application settings
-- =============================================
CREATE TABLE public.app_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =============================================
-- Table: saved_vehicles
-- User's saved/favorited vehicles
-- =============================================
CREATE TABLE public.saved_vehicles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  vehicle_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =============================================
-- Table: valuation_requests
-- Vehicle valuation requests submitted by users
-- =============================================
CREATE TABLE public.valuation_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Vehicle info
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  fuel_type TEXT NOT NULL,
  mileage INTEGER NOT NULL,
  condition TEXT NOT NULL,
  images JSONB DEFAULT '[]'::jsonb,
  
  -- Contact info
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  notes TEXT,
  
  -- Pricing
  price INTEGER,               -- User's requested price
  estimated_value INTEGER,     -- System estimated value
  final_offer INTEGER,         -- Admin's final offer
  
  -- Status and workflow
  status TEXT NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  appointment_date TIMESTAMP WITH TIME ZONE,
  
  -- Messaging metadata
  last_message_at TIMESTAMP WITH TIME ZONE,
  last_message_preview TEXT,
  unread_count_admin INTEGER NOT NULL DEFAULT 0,
  unread_count_user INTEGER NOT NULL DEFAULT 0,
  
  -- Link to user (optional - requests can be submitted without login)
  user_id UUID
);

-- =============================================
-- Table: valuation_messages
-- Messages within valuation request threads
-- =============================================
CREATE TABLE public.valuation_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID NOT NULL REFERENCES public.valuation_requests(id) ON DELETE CASCADE,
  sender_user_id UUID,         -- NULL for system messages
  sender_type TEXT NOT NULL,   -- 'admin', 'user', or 'system'
  body TEXT NOT NULL,
  attachments JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  read_at TIMESTAMP WITH TIME ZONE
);

-- =============================================
-- Table: activity_log
-- Audit log for admin actions
-- =============================================
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
