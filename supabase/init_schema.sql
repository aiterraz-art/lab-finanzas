-- Script de Inicialización para gestion-laboratorio
-- Ejecutar este SQL en el Dashboard de Supabase (Editor SQL)

-- 1. Crear el esquema único
CREATE SCHEMA IF NOT EXISTS gestion_laboratorio;

-- 2. Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS "vector" SCHEMA extensions;

-- 3. Tabla de Ejemplo
CREATE TABLE IF NOT EXISTS gestion_laboratorio.facturas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT now(),
    tipo TEXT CHECK (tipo IN ('venta', 'compra')),
    monto DECIMAL(12,2),
    estado TEXT DEFAULT 'pendiente'
);
