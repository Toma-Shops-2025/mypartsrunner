-- Enable CORS for storage bucket
ALTER BUCKET "product-images" SET CORS = '{
  "AllowedOrigins": ["*"],
  "AllowedMethods": ["GET"],
  "AllowedHeaders": ["*"],
  "MaxAgeSeconds": 3000
}';

-- Add RLS policy to allow public read access to product images
CREATE POLICY "Allow public read access to product images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'product-images');

-- Add RLS policy to allow authenticated users to upload product images
CREATE POLICY "Allow authenticated uploads to product images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images'); 