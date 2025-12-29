-- Fix existing user profiles where Google auth stored full name in name field
-- This migration splits full names into name and surname for existing users

UPDATE public.user_profiles
SET 
  name = trim(split_part(name, ' ', 1)),
  surname = CASE 
    WHEN position(' ' in name) > 0 
    THEN trim(substring(name from position(' ' in name) + 1))
    ELSE surname
  END,
  updated_at = now()
WHERE 
  -- Only update profiles where name contains spaces but surname is empty/null
  name IS NOT NULL 
  AND trim(name) != ''
  AND position(' ' in trim(name)) > 0
  AND (surname IS NULL OR trim(surname) = '');
