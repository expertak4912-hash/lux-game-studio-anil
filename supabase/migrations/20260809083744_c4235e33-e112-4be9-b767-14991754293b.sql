CREATE POLICY "admins manage media files" ON storage.objects FOR ALL TO authenticated
USING (bucket_id = 'media' AND public.is_admin()) WITH CHECK (bucket_id = 'media' AND public.is_admin());
CREATE POLICY "read media files" ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id = 'media');