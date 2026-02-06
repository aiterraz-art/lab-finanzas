-- PELIGRO: Este script borrará TODA la información de las tablas transactional y maestras.
-- No borra el esquema (tablas), solo los datos.

BEGIN;

-- 1. Eliminar relaciones N:N y tablas dependientes
TRUNCATE TABLE public.facturas_pagos CASCADE;

-- 2. Eliminar movimientos de banco y facturas
TRUNCATE TABLE public.facturas CASCADE;
TRUNCATE TABLE public.movimientos_banco CASCADE;

-- 3. Eliminar módulos financieros
TRUNCATE TABLE public.gastos_recurrentes CASCADE;
TRUNCATE TABLE public.presupuestos CASCADE;

-- 4. Eliminar maestros (Terceros)
TRUNCATE TABLE public.terceros CASCADE;

-- Reiniciar secuencias si existen
ALTER SEQUENCE IF EXISTS movimientos_banco_id_secuencial_seq RESTART WITH 1;

COMMIT;

-- Nota: Si TRUNCATE falla por permisos, puedes usar DELETE FROM:
/*
DELETE FROM public.facturas_pagos;
DELETE FROM public.facturas;
DELETE FROM public.movimientos_banco;
DELETE FROM public.gastos_recurrentes;
DELETE FROM public.presupuestos;
DELETE FROM public.terceros;
*/
