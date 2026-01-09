-- Migration: Create vehicle_badges table for managing "in_arrivo" badge
-- This table stores which vehicles should display the "In Arrivo" badge

CREATE TABLE IF NOT EXISTS public.vehicle_badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ad_number INTEGER NOT NULL UNIQUE,
  badge_type TEXT NOT NULL DEFAULT 'in_arrivo',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_vehicle_badges_ad_number ON public.vehicle_badges(ad_number);
CREATE INDEX IF NOT EXISTS idx_vehicle_badges_badge_type ON public.vehicle_badges(badge_type);

-- RLS Policies
ALTER TABLE public.vehicle_badges ENABLE ROW LEVEL SECURITY;

-- Allow admins to manage badges
CREATE POLICY "Admins can manage vehicle badges"
  ON public.vehicle_badges
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Allow public read access (for checking badges on vehicle cards)
CREATE POLICY "Anyone can view vehicle badges"
  ON public.vehicle_badges
  FOR SELECT
  USING (true);
