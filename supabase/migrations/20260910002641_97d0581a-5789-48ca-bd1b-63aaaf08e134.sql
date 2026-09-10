CREATE POLICY "admins can read midia" ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'midia' AND has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "admins can upload midia" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'midia' AND has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "admins can update midia" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'midia' AND has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (bucket_id = 'midia' AND has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "admins can delete midia" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'midia' AND has_role(auth.uid(), 'admin'::app_role));