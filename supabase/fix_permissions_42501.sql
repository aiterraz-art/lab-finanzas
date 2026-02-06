-- HABILITAR PERMISOS DE ACCESO (Fix Error 42501)
-- Ejecuta este script en el SQL Editor de Supabase

-- 1. Deshabilitar RLS temporalmente para simplificar (o puedes crear políticas específicas)
ALTER TABLE public.terceros DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.facturas DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.facturas_pagos DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.movimientos_banco DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.conciliaciones DISABLE ROW LEVEL SECURITY;

-- 2. Otorgar todos los permisos a los roles anon y authenticated
GRANT ALL ON TABLE public.terceros TO anon, authenticated;
GRANT ALL ON TABLE public.facturas TO anon, authenticated;
GRANT ALL ON TABLE public.facturas_pagos TO anon, authenticated;
GRANT ALL ON TABLE public.movimientos_banco TO anon, authenticated;
GRANT ALL ON TABLE public.conciliaciones TO anon, authenticated;

-- 3. Asegurar que las secuencias (si existen) también tengan permisos
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- 4. Otorgar uso del esquema public (generalmente ya está)
GRANT USAGE ON SCHEMA public TO anon, authenticated;
