-- Crear el bucket de storage para las facturas si no existe
INSERT INTO storage.buckets (id, name, public)
VALUES ('facturas', 'facturas', true)
ON CONFLICT (id) DO NOTHING;

-- Configurar políticas de RLS para el bucket (permitir lectura y escritura pública para prueba)
-- En producción deberías ajustar esto según tus necesidades de seguridad.
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'facturas');
CREATE POLICY "Public Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'facturas');
