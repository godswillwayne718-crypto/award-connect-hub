CREATE POLICY "tian_media_read_authenticated"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'tian-media');

CREATE POLICY "tian_media_insert_own"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'tian-media' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "tian_media_update_own"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'tian-media' AND auth.uid()::text = (storage.foldername(name))[1])
WITH CHECK (bucket_id = 'tian-media' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "tian_media_delete_own"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'tian-media' AND auth.uid()::text = (storage.foldername(name))[1]);