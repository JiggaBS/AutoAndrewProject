-- Create storage bucket for message attachments
-- This bucket will store documents and files sent in messages

-- Create the bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'message-attachments',
  'message-attachments',
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

-- Create storage policies for message attachments bucket

-- Policy: Users can upload files to their own request folders
-- Path format: request/{request_id}/{filename}
CREATE POLICY "Users can upload message attachments"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'message-attachments'
  AND (string_to_array(name, '/'))[1] = 'request'
  AND EXISTS (
    SELECT 1 FROM public.valuation_requests vr
    WHERE vr.id::text = (string_to_array(name, '/'))[2]
    AND (
      vr.user_id = auth.uid()
      OR vr.email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  )
);

-- Policy: Admins can upload files to any request folder
CREATE POLICY "Admins can upload message attachments"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'message-attachments'
  AND EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);

-- Policy: Users can read files from their own request folders
-- Path format: request/{request_id}/{filename}
CREATE POLICY "Users can read their message attachments"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'message-attachments'
  AND (string_to_array(name, '/'))[1] = 'request'
  AND EXISTS (
    SELECT 1 FROM public.valuation_requests vr
    WHERE vr.id::text = (string_to_array(name, '/'))[2]
    AND (
      vr.user_id = auth.uid()
      OR vr.email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  )
);

-- Policy: Admins can read all message attachments
CREATE POLICY "Admins can read all message attachments"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'message-attachments'
  AND EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);

-- Policy: Users can delete their own uploaded files (within 24 hours)
CREATE POLICY "Users can delete their own attachments"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'message-attachments'
  AND owner = auth.uid()
  AND created_at > now() - interval '24 hours'
);

-- Policy: Admins can delete any attachment
CREATE POLICY "Admins can delete any attachment"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'message-attachments'
  AND EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);
