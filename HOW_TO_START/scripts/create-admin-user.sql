-- ============================================
-- CREATE ADMIN USER SCRIPT
-- ============================================
-- Instructions:
-- 1. First, register a user account in your app
-- 2. Go to Supabase Dashboard → Authentication → Users
-- 3. Find your user and copy their UUID
-- 4. Replace 'YOUR_USER_UUID_HERE' below with the actual UUID
-- 5. Run this SQL in Supabase SQL Editor
-- ============================================

INSERT INTO user_roles (user_id, role) 
VALUES ('YOUR_USER_UUID_HERE', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- ============================================
-- VERIFY ADMIN WAS CREATED
-- ============================================
-- Run this to check if the admin role was added:
-- SELECT * FROM user_roles WHERE role = 'admin';
