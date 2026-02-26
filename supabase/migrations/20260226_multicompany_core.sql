CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.empresas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    nombre TEXT NOT NULL UNIQUE,
    logo_url TEXT,
    activa BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS public.user_empresas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('owner', 'admin', 'manager', 'user', 'viewer')),
    UNIQUE (user_id, empresa_id)
);

DO $$
DECLARE default_empresa_id UUID;
BEGIN
    SELECT id INTO default_empresa_id
    FROM public.empresas
    ORDER BY created_at
    LIMIT 1;

    IF default_empresa_id IS NULL THEN
        INSERT INTO public.empresas (nombre)
        VALUES ('Empresa Principal')
        RETURNING id INTO default_empresa_id;
    END IF;

    ALTER TABLE public.terceros ADD COLUMN IF NOT EXISTS empresa_id UUID;
    UPDATE public.terceros SET empresa_id = default_empresa_id WHERE empresa_id IS NULL;
    ALTER TABLE public.terceros ALTER COLUMN empresa_id SET NOT NULL;
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'terceros_empresa_id_fkey'
          AND conrelid = 'public.terceros'::regclass
    ) THEN
        ALTER TABLE public.terceros
        ADD CONSTRAINT terceros_empresa_id_fkey
        FOREIGN KEY (empresa_id) REFERENCES public.empresas(id) ON DELETE CASCADE;
    END IF;

    ALTER TABLE public.facturas ADD COLUMN IF NOT EXISTS empresa_id UUID;
    UPDATE public.facturas SET empresa_id = default_empresa_id WHERE empresa_id IS NULL;
    ALTER TABLE public.facturas ALTER COLUMN empresa_id SET NOT NULL;
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'facturas_empresa_id_fkey'
          AND conrelid = 'public.facturas'::regclass
    ) THEN
        ALTER TABLE public.facturas
        ADD CONSTRAINT facturas_empresa_id_fkey
        FOREIGN KEY (empresa_id) REFERENCES public.empresas(id) ON DELETE CASCADE;
    END IF;

    ALTER TABLE public.movimientos_banco ADD COLUMN IF NOT EXISTS empresa_id UUID;
    UPDATE public.movimientos_banco SET empresa_id = default_empresa_id WHERE empresa_id IS NULL;
    ALTER TABLE public.movimientos_banco ALTER COLUMN empresa_id SET NOT NULL;
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'movimientos_banco_empresa_id_fkey'
          AND conrelid = 'public.movimientos_banco'::regclass
    ) THEN
        ALTER TABLE public.movimientos_banco
        ADD CONSTRAINT movimientos_banco_empresa_id_fkey
        FOREIGN KEY (empresa_id) REFERENCES public.empresas(id) ON DELETE CASCADE;
    END IF;

    ALTER TABLE public.rendiciones ADD COLUMN IF NOT EXISTS empresa_id UUID;
    UPDATE public.rendiciones SET empresa_id = default_empresa_id WHERE empresa_id IS NULL;
    ALTER TABLE public.rendiciones ALTER COLUMN empresa_id SET NOT NULL;
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'rendiciones_empresa_id_fkey'
          AND conrelid = 'public.rendiciones'::regclass
    ) THEN
        ALTER TABLE public.rendiciones
        ADD CONSTRAINT rendiciones_empresa_id_fkey
        FOREIGN KEY (empresa_id) REFERENCES public.empresas(id) ON DELETE CASCADE;
    END IF;

    ALTER TABLE public.rendicion_detalles ADD COLUMN IF NOT EXISTS empresa_id UUID;
    UPDATE public.rendicion_detalles SET empresa_id = default_empresa_id WHERE empresa_id IS NULL;
    ALTER TABLE public.rendicion_detalles ALTER COLUMN empresa_id SET NOT NULL;
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'rendicion_detalles_empresa_id_fkey'
          AND conrelid = 'public.rendicion_detalles'::regclass
    ) THEN
        ALTER TABLE public.rendicion_detalles
        ADD CONSTRAINT rendicion_detalles_empresa_id_fkey
        FOREIGN KEY (empresa_id) REFERENCES public.empresas(id) ON DELETE CASCADE;
    END IF;

    ALTER TABLE public.facturas_pagos ADD COLUMN IF NOT EXISTS empresa_id UUID;
    UPDATE public.facturas_pagos SET empresa_id = default_empresa_id WHERE empresa_id IS NULL;
    ALTER TABLE public.facturas_pagos ALTER COLUMN empresa_id SET NOT NULL;
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'facturas_pagos_empresa_id_fkey'
          AND conrelid = 'public.facturas_pagos'::regclass
    ) THEN
        ALTER TABLE public.facturas_pagos
        ADD CONSTRAINT facturas_pagos_empresa_id_fkey
        FOREIGN KEY (empresa_id) REFERENCES public.empresas(id) ON DELETE CASCADE;
    END IF;

    ALTER TABLE public.gastos_recurrentes ADD COLUMN IF NOT EXISTS empresa_id UUID;
    UPDATE public.gastos_recurrentes SET empresa_id = default_empresa_id WHERE empresa_id IS NULL;
    ALTER TABLE public.gastos_recurrentes ALTER COLUMN empresa_id SET NOT NULL;
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'gastos_recurrentes_empresa_id_fkey'
          AND conrelid = 'public.gastos_recurrentes'::regclass
    ) THEN
        ALTER TABLE public.gastos_recurrentes
        ADD CONSTRAINT gastos_recurrentes_empresa_id_fkey
        FOREIGN KEY (empresa_id) REFERENCES public.empresas(id) ON DELETE CASCADE;
    END IF;

    ALTER TABLE public.presupuestos ADD COLUMN IF NOT EXISTS empresa_id UUID;
    UPDATE public.presupuestos SET empresa_id = default_empresa_id WHERE empresa_id IS NULL;
    ALTER TABLE public.presupuestos ALTER COLUMN empresa_id SET NOT NULL;
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'presupuestos_empresa_id_fkey'
          AND conrelid = 'public.presupuestos'::regclass
    ) THEN
        ALTER TABLE public.presupuestos
        ADD CONSTRAINT presupuestos_empresa_id_fkey
        FOREIGN KEY (empresa_id) REFERENCES public.empresas(id) ON DELETE CASCADE;
    END IF;

    ALTER TABLE public.collection_reminders ADD COLUMN IF NOT EXISTS empresa_id UUID;
    UPDATE public.collection_reminders SET empresa_id = default_empresa_id WHERE empresa_id IS NULL;
    ALTER TABLE public.collection_reminders ALTER COLUMN empresa_id SET NOT NULL;
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'collection_reminders_empresa_id_fkey'
          AND conrelid = 'public.collection_reminders'::regclass
    ) THEN
        ALTER TABLE public.collection_reminders
        ADD CONSTRAINT collection_reminders_empresa_id_fkey
        FOREIGN KEY (empresa_id) REFERENCES public.empresas(id) ON DELETE CASCADE;
    END IF;

    INSERT INTO public.user_empresas (user_id, empresa_id, role)
    SELECT p.id, default_empresa_id,
        CASE WHEN p.role = 'admin' THEN 'admin' ELSE 'user' END
    FROM public.profiles p
    ON CONFLICT (user_id, empresa_id) DO NOTHING;
END $$;

CREATE INDEX IF NOT EXISTS idx_terceros_empresa_id ON public.terceros(empresa_id);
CREATE INDEX IF NOT EXISTS idx_facturas_empresa_id ON public.facturas(empresa_id);
CREATE INDEX IF NOT EXISTS idx_movimientos_banco_empresa_id ON public.movimientos_banco(empresa_id);
CREATE INDEX IF NOT EXISTS idx_rendiciones_empresa_id ON public.rendiciones(empresa_id);
CREATE INDEX IF NOT EXISTS idx_rendicion_detalles_empresa_id ON public.rendicion_detalles(empresa_id);
CREATE INDEX IF NOT EXISTS idx_facturas_pagos_empresa_id ON public.facturas_pagos(empresa_id);
CREATE INDEX IF NOT EXISTS idx_gastos_recurrentes_empresa_id ON public.gastos_recurrentes(empresa_id);
CREATE INDEX IF NOT EXISTS idx_presupuestos_empresa_id ON public.presupuestos(empresa_id);
CREATE INDEX IF NOT EXISTS idx_collection_reminders_empresa_id ON public.collection_reminders(empresa_id);
CREATE INDEX IF NOT EXISTS idx_user_empresas_user_empresa ON public.user_empresas(user_id, empresa_id);

ALTER TABLE public.empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_empresas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "empresas_authenticated_select" ON public.empresas;
CREATE POLICY "empresas_authenticated_select"
ON public.empresas FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "empresas_authenticated_write" ON public.empresas;
CREATE POLICY "empresas_authenticated_write"
ON public.empresas FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "user_empresas_authenticated_select" ON public.user_empresas;
CREATE POLICY "user_empresas_authenticated_select"
ON public.user_empresas FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "user_empresas_authenticated_write" ON public.user_empresas;
CREATE POLICY "user_empresas_authenticated_write"
ON public.user_empresas FOR ALL TO authenticated USING (true) WITH CHECK (true);
