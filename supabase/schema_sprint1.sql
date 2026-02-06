-- SCHEMA SPRINT 1
-- Ejecutar en Supabase SQL Editor

CREATE SCHEMA IF NOT EXISTS gestion_laboratorio;

-- EXTENSIONES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" SCHEMA extensions;

-- 1. TABLAS MAESTRAS (Terceros)
CREATE TABLE IF NOT EXISTS gestion_laboratorio.clientes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT now(),
    nombre TEXT NOT NULL,
    rut TEXT,
    email TEXT,
    telefono TEXT
);

CREATE TABLE IF NOT EXISTS gestion_laboratorio.proveedores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT now(),
    nombre TEXT NOT NULL,
    rut TEXT,
    categoria TEXT
);

-- 2. FACTURAS (Actualizada)
CREATE TABLE IF NOT EXISTS gestion_laboratorio.facturas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT now(),
    tipo TEXT CHECK (tipo IN ('venta', 'compra')) NOT NULL,
    monto DECIMAL(12,2) NOT NULL,
    fecha_emision DATE, -- Fecha del documento
    descripcion TEXT,
    estado TEXT DEFAULT 'pendiente', -- pendiente, pagada, conciliada
    
    -- Relaciones (Opcionales por ahora, se rellenan segun el tipo)
    cliente_id UUID REFERENCES gestion_laboratorio.clientes(id),
    proveedor_id UUID REFERENCES gestion_laboratorio.proveedores(id),
    tercero_nombre TEXT, -- Fallback si no existe en tablas maestras aun
    
    archivo_url TEXT -- Link al PDF/Imagen en Storage
);

-- 3. MOVIMIENTOS BANCO
CREATE TABLE IF NOT EXISTS gestion_laboratorio.movimientos_banco (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT now(),
    fecha_movimiento DATE NOT NULL,
    descripcion TEXT,
    monto DECIMAL(12,2) NOT NULL, -- Positivo (abono) o Negativo (cargo)
    tipo TEXT, -- transferencia, cheque, comision, etc.
    estado TEXT DEFAULT 'no_conciliado' -- no_conciliado, conciliado
);

-- 4. CONCILIACIONES (Tabla intermedia)
CREATE TABLE IF NOT EXISTS gestion_laboratorio.conciliaciones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT now(),
    factura_id UUID REFERENCES gestion_laboratorio.facturas(id),
    movimiento_id UUID REFERENCES gestion_laboratorio.movimientos_banco(id),
    monto_conciliado DECIMAL(12,2), -- Cuánto de ese movimiento cubre esa factura
    tipo TEXT -- automatico, manual
);
