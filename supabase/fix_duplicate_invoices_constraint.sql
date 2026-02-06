-- PREVENCIÓN DE FACTURAS DUPLICADAS (Base de Datos)
-- Ejecutar en Supabase SQL Editor

-- 1. Agregar restricción de unicidad
-- Esto asegura que no pueda haber dos facturas con el mismo número para el mismo cliente/proveedor.
ALTER TABLE public.facturas 
DROP CONSTRAINT IF EXISTS unique_invoice_number_per_tercero;

ALTER TABLE public.facturas 
ADD CONSTRAINT unique_invoice_number_per_tercero UNIQUE (numero_documento, tercero_id);
