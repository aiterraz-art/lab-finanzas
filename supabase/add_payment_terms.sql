-- Agregar campo para plazos de pago automáticos
ALTER TABLE public.terceros ADD COLUMN IF NOT EXISTS plazo_pago_dias INTEGER DEFAULT 30;

-- Comentario para claridad
COMMENT ON COLUMN public.terceros.plazo_pago_dias IS 'Plazo de pago por defecto en días para este cliente/proveedor';
