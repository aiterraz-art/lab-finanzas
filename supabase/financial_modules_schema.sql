-- Nuevas tablas para los módulos avanzados financieros

-- 1. Gastos Recurrentes (Para Cash Flow Proyectado)
CREATE TABLE IF NOT EXISTS public.gastos_recurrentes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    descripcion TEXT NOT NULL,
    monto DECIMAL(12,2) NOT NULL,
    dia_pago INTEGER CHECK (dia_pago BETWEEN 1 AND 31),
    categoria TEXT, -- ej: nomina, arriendo, servicios, suscripciones
    activo BOOLEAN DEFAULT true
);

-- 2. Presupuestos Mensuales
CREATE TABLE IF NOT EXISTS public.presupuestos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    mes DATE NOT NULL, -- Guardamos el primer día del mes
    categoria TEXT NOT NULL,
    monto_presupuestado DECIMAL(12,2) NOT NULL,
    UNIQUE(mes, categoria)
);

-- 3. Agregar campo de fecha de vencimiento a facturas si no existe
ALTER TABLE public.facturas ADD COLUMN IF NOT EXISTS fecha_vencimiento DATE;

-- Poblar fecha_vencimiento para datos existentes (ej: 30 días después de emisión)
UPDATE public.facturas SET fecha_vencimiento = fecha_emision + INTERVAL '30 days' WHERE fecha_vencimiento IS NULL;
