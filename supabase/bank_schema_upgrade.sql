-- ACTUALIZACIÓN SCHEMA: SOPORTE PARA CARTOLA BANCARIA DETALLADA
-- Ejecutar en Supabase SQL Editor

-- 1. Agregar columnas necesarias para el mapeo de Excel
ALTER TABLE gestion_laboratorio.movimientos_banco 
ADD COLUMN IF NOT EXISTS n_operacion TEXT, -- Corresponde a "N° Doc." en Excel
ADD COLUMN IF NOT EXISTS sucursal TEXT,    -- Oficina o Sucursal
ADD COLUMN IF NOT EXISTS saldo DECIMAL(12,2); -- Saldo contable post-movimiento

-- 2. Asegurar que n_operacion sea único para evitar duplicados en importaciones
-- Nota: Primero eliminamos si existe para evitar errores al re-ejecutar.
ALTER TABLE gestion_laboratorio.movimientos_banco 
DROP CONSTRAINT IF EXISTS unique_n_operacion;

-- Solo agregamos la restricción si n_operacion no tiene nulos o si queremos manejarlo.
-- En bancos, n_operacion suele ser único por transacción.
ALTER TABLE gestion_laboratorio.movimientos_banco 
ADD CONSTRAINT unique_n_operacion UNIQUE (n_operacion);

-- 3. Índice para búsqueda rápida por n_operacion
CREATE INDEX IF NOT EXISTS idx_movimientos_n_operacion ON gestion_laboratorio.movimientos_banco(n_operacion);
