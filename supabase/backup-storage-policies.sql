-- Supabase Storage Policies for Backups
-- Run these in your Supabase SQL Editor

-- Create storage bucket for backups (private)
INSERT INTO storage.buckets (id, name, public)
VALUES ('backups', 'backups', false);

-- Enable RLS on storage.objects (if not already enabled)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only upload backups to their own folder
CREATE POLICY "Users can upload backups"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'backups' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Users can only view/download their own backups
CREATE POLICY "Users can view their own backups"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'backups' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Users can delete their own backups
CREATE POLICY "Users can delete their own backups"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'backups' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Service role can manage all backups (for cron jobs)
CREATE POLICY "Service role can manage backups"
ON storage.objects
TO service_role
USING (bucket_id = 'backups')
WITH CHECK (bucket_id = 'backups');

