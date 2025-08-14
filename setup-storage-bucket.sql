-- Setup Supabase Storage bucket for driver documents
-- Run this in your Supabase SQL Editor

-- Create storage bucket for driver documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'driver-documents',
  'driver-documents',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
) ON CONFLICT (id) DO NOTHING;

-- Create storage policies for the bucket
-- Allow authenticated users to upload documents
CREATE POLICY "Allow authenticated users to upload driver documents" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'driver-documents' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to view documents
CREATE POLICY "Allow authenticated users to view driver documents" ON storage.objects
FOR SELECT USING (
  bucket_id = 'driver-documents' 
  AND auth.role() = 'authenticated'
);

-- Allow users to update their own documents
CREATE POLICY "Allow users to update their own driver documents" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'driver-documents' 
  AND auth.role() = 'authenticated'
);

-- Allow users to delete their own documents
CREATE POLICY "Allow users to delete their own driver documents" ON storage.objects
FOR DELETE USING (
  bucket_id = 'driver-documents' 
  AND auth.role() = 'authenticated'
);

-- Create folders for different document types
-- Note: Supabase Storage automatically creates folders when files are uploaded
-- These are just for reference:
-- - drivers-license/
-- - vehicle-registration/
-- - insurance/
-- - background-check/ 