-- MOVER TABLAS AL ESQUEMA PUBLIC (Versión Corregida)
-- Ejecuta este script en el SQL Editor de Supabase para resolver el error PGRST106 y 42P07

-- 1. Mover tabla terceros
DROP TABLE IF EXISTS public.terceros CASCADE;
ALTER TABLE gestion_laboratorio.terceros SET SCHEMA public;

-- 2. Mover tabla facturas
-- Borramos la que existe en public para evitar el error "relation already exists"
DROP TABLE IF EXISTS public.facturas CASCADE;
DO $$ 
BEGIN 
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'gestion_laboratorio' AND table_name = 'facturas') THEN
        ALTER TABLE gestion_laboratorio.facturas SET SCHEMA public;
    END IF;
END $$;

-- 3. Mover tabla facturas_pagos
DROP TABLE IF EXISTS public.facturas_pagos CASCADE;
ALTER TABLE gestion_laboratorio.facturas_pagos SET SCHEMA public;

-- 4. Mover otras tablas críticas
DROP TABLE IF EXISTS public.movimientos_banco CASCADE;
DO $$ 
BEGIN 
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'gestion_laboratorio' AND table_name = 'movimientos_banco') THEN
        ALTER TABLE gestion_laboratorio.movimientos_banco SET SCHEMA public;
    END IF;
END $$;

DROP TABLE IF EXISTS public.conciliaciones CASCADE;
DO $$ 
BEGIN 
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'gestion_laboratorio' AND table_name = 'conciliaciones') THEN
        ALTER TABLE gestion_laboratorio.conciliaciones SET SCHEMA public;
    END IF;
END $$;

-- 5. Limpiar el esquema antiguo
-- DROP SCHEMA IF EXISTS gestion_laboratorio CASCADE;
