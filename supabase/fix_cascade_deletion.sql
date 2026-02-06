-- Eliminar la restricción actual
ALTER TABLE public.facturas DROP CONSTRAINT IF EXISTS facturas_tercero_id_fkey;

-- Agregar la restricción con ON DELETE CASCADE
ALTER TABLE public.facturas 
ADD CONSTRAINT facturas_tercero_id_fkey 
FOREIGN KEY (tercero_id) 
REFERENCES public.terceros(id) 
ON DELETE CASCADE;
