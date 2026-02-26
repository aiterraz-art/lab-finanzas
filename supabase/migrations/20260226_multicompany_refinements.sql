DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'presupuestos_mes_categoria_key'
      AND conrelid = 'public.presupuestos'::regclass
  ) THEN
    ALTER TABLE public.presupuestos DROP CONSTRAINT presupuestos_mes_categoria_key;
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS ux_presupuestos_empresa_mes_categoria
ON public.presupuestos (empresa_id, mes, categoria);

CREATE OR REPLACE FUNCTION public.assign_default_company_to_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  first_empresa_id UUID;
BEGIN
  SELECT id INTO first_empresa_id
  FROM public.empresas
  ORDER BY created_at ASC
  LIMIT 1;

  IF first_empresa_id IS NOT NULL THEN
    INSERT INTO public.user_empresas (user_id, empresa_id, role)
    VALUES (NEW.id, first_empresa_id, CASE WHEN NEW.role = 'admin' THEN 'admin' ELSE 'user' END)
    ON CONFLICT (user_id, empresa_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_profile_created_assign_company ON public.profiles;
CREATE TRIGGER on_profile_created_assign_company
AFTER INSERT ON public.profiles
FOR EACH ROW EXECUTE PROCEDURE public.assign_default_company_to_profile();
