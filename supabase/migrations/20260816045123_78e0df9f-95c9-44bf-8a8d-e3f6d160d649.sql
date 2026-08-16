-- No feature in the app uploads files, yet anyone (including anonymous
-- visitors) could push unlimited, arbitrary content into provider-documents.
DROP POLICY IF EXISTS "upload provider docs" ON storage.objects;

-- Signed-in applicants may upload only into their own folder; admins keep read.
CREATE POLICY "provider docs own folder insert"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'provider-documents'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "provider docs own folder read"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'provider-documents'
  AND (storage.foldername(name))[1] = auth.uid()::text
);