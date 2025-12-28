-- =============================================
-- AutoAndrew Database Migration: Enums
-- =============================================
-- Run this FIRST before creating tables
-- =============================================

-- Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');
