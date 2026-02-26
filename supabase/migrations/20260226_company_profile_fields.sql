ALTER TABLE public.empresas ADD COLUMN IF NOT EXISTS rut TEXT;
ALTER TABLE public.empresas ADD COLUMN IF NOT EXISTS razon_social TEXT;
ALTER TABLE public.empresas ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.empresas ADD COLUMN IF NOT EXISTS telefono TEXT;
ALTER TABLE public.empresas ADD COLUMN IF NOT EXISTS direccion TEXT;
ALTER TABLE public.empresas ADD COLUMN IF NOT EXISTS ciudad TEXT;
ALTER TABLE public.empresas ADD COLUMN IF NOT EXISTS pais TEXT NOT NULL DEFAULT 'Chile';
ALTER TABLE public.empresas ADD COLUMN IF NOT EXISTS moneda TEXT NOT NULL DEFAULT 'CLP';
ALTER TABLE public.empresas ADD COLUMN IF NOT EXISTS timezone TEXT NOT NULL DEFAULT 'America/Santiago';

UPDATE public.empresas
SET razon_social = nombre
WHERE razon_social IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS ux_empresas_rut_unique
ON public.empresas (rut)
WHERE rut IS NOT NULL;
