-- Agregar columna plazo_pago_dias a la tabla terceros
-- Esto es necesario para la automatización de fechas de vencimiento y flujo de caja.

ALTER TABLE public.terceros 
ADD COLUMN IF NOT EXISTS plazo_pago_dias INTEGER DEFAULT 30;

-- Actualizar registros existentes con el valor por defecto
UPDATE public.terceros SET plazo_pago_dias = 30 WHERE plazo_pago_dias IS NULL;
