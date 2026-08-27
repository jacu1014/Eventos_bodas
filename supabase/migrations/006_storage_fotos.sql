-- Migration 006: Create storage bucket for photos
-- This enables photo uploads to Supabase Storage instead of falling back to base64 in localStorage

-- Create the 'fotos' bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public) VALUES ('fotos', 'fotos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for the 'fotos' bucket
CREATE POLICY "fotos_select_public" ON storage.objects FOR SELECT USING (bucket_id = 'fotos');
CREATE POLICY "fotos_insert_public" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'fotos');
CREATE POLICY "fotos_delete_auth" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'fotos');
