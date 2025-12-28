-- =============================================
-- AutoAndrew Database Migration: Realtime
-- =============================================
-- Run this AFTER all other migrations
-- =============================================

-- Enable REPLICA IDENTITY FULL for complete row data in realtime events
ALTER TABLE public.valuation_messages REPLICA IDENTITY FULL;
ALTER TABLE public.valuation_requests REPLICA IDENTITY FULL;

-- Add tables to realtime publication
-- (These may already exist; errors can be ignored)
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.valuation_messages;
EXCEPTION WHEN duplicate_object THEN
  NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.valuation_requests;
EXCEPTION WHEN duplicate_object THEN
  NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.app_settings;
EXCEPTION WHEN duplicate_object THEN
  NULL;
END $$;
