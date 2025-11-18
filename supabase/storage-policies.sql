-- Supabase Storage Policies for Report Images
-- Run these in your Supabase SQL Editor

-- Create storage bucket for report images
INSERT INTO storage.buckets (id, name, public)
VALUES ('report_images', 'report_images', false);

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy: Users can upload their own report images
CREATE POLICY "Users can upload report images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'report_images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Users can view their own report images
CREATE POLICY "Users can view their own report images"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'report_images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Users can delete their own report images
CREATE POLICY "Users can delete their own report images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'report_images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Users can update their own report images
CREATE POLICY "Users can update their own report images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'report_images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

