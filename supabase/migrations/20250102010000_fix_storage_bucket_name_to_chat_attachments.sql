-- Fix storage bucket name mismatch
-- Code expects 'chat-attachments' but migration created 'message-attachments'
-- This migration creates the correct bucket name and policies

-- Create the chat-attachments bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'chat-attachments',
  'chat-attachments',
  false, -- Private bucket - requires authentication
  10485760, -- 10MB limit per file
  ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'text/plain',
    'text/csv'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies for chat-attachments if they exist (to recreate them)
-- Drop old policy names (from message-attachments bucket)
DROP POLICY IF EXISTS "Users can upload message attachments" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload message attachments" ON storage.objects;
DROP POLICY IF EXISTS "Users can read their message attachments" ON storage.objects;
DROP POLICY IF EXISTS "Admins can read all message attachments" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own attachments" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete any attachment" ON storage.objects;
-- Drop new policy names (in case they already exist from a previous run)
DROP POLICY IF EXISTS "Users can upload chat attachments" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload chat attachments" ON storage.objects;
DROP POLICY IF EXISTS "Users can read their chat attachments" ON storage.objects;
DROP POLICY IF EXISTS "Admins can read all chat attachments" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own chat attachments" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete any chat attachment" ON storage.objects;
-- Drop new policy names (in case they already exist)
DROP POLICY IF EXISTS "Users can upload chat attachments" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload chat attachments" ON storage.objects;
DROP POLICY IF EXISTS "Users can read their chat attachments" ON storage.objects;
DROP POLICY IF EXISTS "Admins can read all chat attachments" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own chat attachments" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete any chat attachment" ON storage.objects;

-- Create storage policies for chat-attachments bucket

-- Policy: Users can upload files to their own request folders
-- Path format: request/{request_id}/{filename}
-- Uses user_owns_valuation_request function to safely check ownership
CREATE POLICY "Users can upload chat attachments"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'chat-attachments'
  AND (string_to_array(name, '/'))[1] = 'request'
  AND public.user_owns_valuation_request((string_to_array(name, '/'))[2]::uuid)
);

-- Policy: Admins can upload files to any request folder
CREATE POLICY "Admins can upload chat attachments"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'chat-attachments'
  AND EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);

-- Policy: Users can read files from their own request folders
-- Path format: request/{request_id}/{filename}
-- Uses user_owns_valuation_request function to safely check ownership
CREATE POLICY "Users can read their chat attachments"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'chat-attachments'
  AND (string_to_array(name, '/'))[1] = 'request'
  AND public.user_owns_valuation_request((string_to_array(name, '/'))[2]::uuid)
);

-- Policy: Admins can read all chat attachments
CREATE POLICY "Admins can read all chat attachments"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'chat-attachments'
  AND EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);

-- Policy: Users can delete their own uploaded files (within 24 hours)
CREATE POLICY "Users can delete their own chat attachments"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'chat-attachments'
  AND owner = auth.uid()
  AND created_at > now() - interval '24 hours'
);

-- Policy: Admins can delete any chat attachment
CREATE POLICY "Admins can delete any chat attachment"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'chat-attachments'
  AND EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);
