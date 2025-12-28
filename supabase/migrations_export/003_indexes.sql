-- =============================================
-- AutoAndrew Database Migration: Indexes
-- =============================================
-- Run this AFTER 002_tables.sql
-- =============================================

-- Activity log: filter unread entries quickly
CREATE INDEX idx_activity_log_unread ON public.activity_log (read_at) WHERE read_at IS NULL;

-- Valuation messages: query by request and time
CREATE INDEX idx_valuation_messages_request_id ON public.valuation_messages (request_id);
CREATE INDEX idx_valuation_messages_created_at ON public.valuation_messages (created_at);
CREATE INDEX idx_valuation_messages_request_created ON public.valuation_messages (request_id, created_at);
