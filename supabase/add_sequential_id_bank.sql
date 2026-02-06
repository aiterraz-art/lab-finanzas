-- AGREGAR COLUMNA SECUENCIAL PARA ORDEN DE IMPORTACIÓN
-- Esto permite saber cuál fue el movimiento "más arriba" en el Excel original

ALTER TABLE public.movimientos_banco 
ADD COLUMN IF NOT EXISTS id_secuencial SERIAL;

-- Crear un índice para optimizar la búsqueda del último registro
CREATE INDEX IF NOT EXISTS idx_movimientos_id_secuencial ON public.movimientos_banco(id_secuencial);
