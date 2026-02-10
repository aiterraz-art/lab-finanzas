ALTER TABLE public.terceros 
ADD COLUMN IF NOT EXISTS es_trabajador boolean DEFAULT false;
