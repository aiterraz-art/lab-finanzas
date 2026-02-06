-- ACTUALIZACIÓN SCHEMA: PREVENCIÓN DE DUPLICADOS
-- Ejecutar en Supabase SQL Editor

-- 1. Agregar columnas para mejorar la identificación única
ALTER TABLE gestion_laboratorio.movimientos_banco 
ADD COLUMN IF NOT EXISTS n_operacion TEXT, -- ID único del banco (si existe)
ADD COLUMN IF NOT EXISTS saldo DECIMAL(12,2); -- Saldo contable después del movimiento

-- 2. Agregar RUT a facturas
ALTER TABLE gestion_laboratorio.facturas
ADD COLUMN IF NOT EXISTS rut TEXT;

-- 2. Restricción 1: ID de Operación Único
-- Si el banco trae un ID, no se puede repetir.
ALTER TABLE gestion_laboratorio.movimientos_banco 
DROP CONSTRAINT IF EXISTS unique_n_operacion;

ALTER TABLE gestion_laboratorio.movimientos_banco 
ADD CONSTRAINT unique_n_operacion UNIQUE (n_operacion);

-- 3. Restricción 2: Huella Digital Compuesta (Fallback)
-- Si no hay ID, usamos la combinación de campos para detectar duplicados.
-- Incluimos 'saldo' porque dos transacciones idénticas (mismo monto/desc) 
-- tendrán diferente saldo resultante.
ALTER TABLE gestion_laboratorio.movimientos_banco 
DROP CONSTRAINT IF EXISTS unique_movimiento_composite;

ALTER TABLE gestion_laboratorio.movimientos_banco 
ADD CONSTRAINT unique_movimiento_composite UNIQUE (fecha_movimiento, monto, descripcion, saldo);
