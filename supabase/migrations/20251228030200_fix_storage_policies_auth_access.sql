-- Fix storage policies to use helper functions instead of direct auth.users access
-- This fixes "permission denied" errors when uploading files

-- Drop existing policies
DROP POLICY IF EXISTS "Users can upload message attachments" ON storage.objects;
DROP POLICY IF EXISTS "Users can read their message attachments" ON storage.objects;

-- Recreate with proper helper function usage
-- Policy: Users can upload files to their own request folders
-- Path format: request/{request_id}/{filename}
-- Uses user_owns_valuation_request function to safely check ownership
CREATE POLICY "Users can upload message attachments"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'chat-attachments'
  AND (string_to_array(name, '/'))[1] = 'request'
  AND public.user_owns_valuation_request((string_to_array(name, '/'))[2]::uuid)
);

-- Policy: Users can read files from their own request folders
-- Path format: request/{request_id}/{filename}
-- Uses user_owns_valuation_request function to safely check ownership
CREATE POLICY "Users can read their message attachments"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'chat-attachments'
  AND (string_to_array(name, '/'))[1] = 'request'
  AND public.user_owns_valuation_request((string_to_array(name, '/'))[2]::uuid)
);
