INSERT INTO storage.buckets (id, name, public)
VALUES ('company-logos', 'company-logos', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "company_logos_public_read" ON storage.objects;
CREATE POLICY "company_logos_public_read"
ON storage.objects FOR SELECT
USING (bucket_id = 'company-logos');

DROP POLICY IF EXISTS "company_logos_auth_insert" ON storage.objects;
CREATE POLICY "company_logos_auth_insert"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'company-logos');

DROP POLICY IF EXISTS "company_logos_auth_update" ON storage.objects;
CREATE POLICY "company_logos_auth_update"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'company-logos')
WITH CHECK (bucket_id = 'company-logos');

DROP POLICY IF EXISTS "company_logos_auth_delete" ON storage.objects;
CREATE POLICY "company_logos_auth_delete"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'company-logos');
