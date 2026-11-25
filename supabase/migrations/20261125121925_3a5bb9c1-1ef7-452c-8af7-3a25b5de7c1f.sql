CREATE TYPE public.app_role AS ENUM ('admin', 'staff');

CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL DEFAULT 'staff',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.is_team_member(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
  )
$$;

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role
FROM auth.users
WHERE id = '0ec7f6c5-fcf2-4211-a036-6df78871b649'
ON CONFLICT (user_id, role) DO NOTHING;

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'staff'::public.app_role
FROM auth.users
WHERE id = 'd3e148dc-8750-4eb8-b975-11f5f5549d14'
ON CONFLICT (user_id, role) DO NOTHING;

DROP POLICY IF EXISTS "Equipe autenticada lê todas as fichas" ON public.fichas_tecnicas;
DROP POLICY IF EXISTS "Equipe autenticada cria fichas" ON public.fichas_tecnicas;
DROP POLICY IF EXISTS "Equipe autenticada edita todas as fichas" ON public.fichas_tecnicas;
DROP POLICY IF EXISTS "Equipe autenticada exclui todas as fichas" ON public.fichas_tecnicas;

CREATE POLICY "Equipe autorizada lê fichas"
ON public.fichas_tecnicas
FOR SELECT
TO authenticated
USING (public.is_team_member(auth.uid()));

CREATE POLICY "Equipe autorizada cria fichas"
ON public.fichas_tecnicas
FOR INSERT
TO authenticated
WITH CHECK (public.is_team_member(auth.uid()) AND (user_id IS NULL OR user_id = auth.uid()));

CREATE POLICY "Equipe autorizada edita fichas"
ON public.fichas_tecnicas
FOR UPDATE
TO authenticated
USING (public.is_team_member(auth.uid()))
WITH CHECK (public.is_team_member(auth.uid()));

CREATE POLICY "Equipe autorizada exclui fichas"
ON public.fichas_tecnicas
FOR DELETE
TO authenticated
USING (public.is_team_member(auth.uid()));

DROP POLICY IF EXISTS "Equipe autenticada lê todos os ingredientes" ON public.ficha_ingredientes;
DROP POLICY IF EXISTS "Equipe autenticada cria ingredientes" ON public.ficha_ingredientes;
DROP POLICY IF EXISTS "Equipe autenticada edita todos os ingredientes" ON public.ficha_ingredientes;
DROP POLICY IF EXISTS "Equipe autenticada exclui todos os ingredientes" ON public.ficha_ingredientes;

CREATE POLICY "Equipe autorizada lê ingredientes"
ON public.ficha_ingredientes
FOR SELECT
TO authenticated
USING (
  public.is_team_member(auth.uid())
  AND EXISTS (SELECT 1 FROM public.fichas_tecnicas f WHERE f.id = ficha_ingredientes.ficha_id)
);

CREATE POLICY "Equipe autorizada cria ingredientes"
ON public.ficha_ingredientes
FOR INSERT
TO authenticated
WITH CHECK (
  public.is_team_member(auth.uid())
  AND EXISTS (SELECT 1 FROM public.fichas_tecnicas f WHERE f.id = ficha_ingredientes.ficha_id)
);

CREATE POLICY "Equipe autorizada edita ingredientes"
ON public.ficha_ingredientes
FOR UPDATE
TO authenticated
USING (
  public.is_team_member(auth.uid())
  AND EXISTS (SELECT 1 FROM public.fichas_tecnicas f WHERE f.id = ficha_ingredientes.ficha_id)
)
WITH CHECK (
  public.is_team_member(auth.uid())
  AND EXISTS (SELECT 1 FROM public.fichas_tecnicas f WHERE f.id = ficha_ingredientes.ficha_id)
);

CREATE POLICY "Equipe autorizada exclui ingredientes"
ON public.ficha_ingredientes
FOR DELETE
TO authenticated
USING (
  public.is_team_member(auth.uid())
  AND EXISTS (SELECT 1 FROM public.fichas_tecnicas f WHERE f.id = ficha_ingredientes.ficha_id)
);

DROP POLICY IF EXISTS "Equipe autenticada lê todas as fotos" ON storage.objects;
DROP POLICY IF EXISTS "Equipe autenticada envia fotos" ON storage.objects;
DROP POLICY IF EXISTS "Equipe autenticada altera fotos" ON storage.objects;
DROP POLICY IF EXISTS "Equipe autenticada exclui fotos" ON storage.objects;

CREATE POLICY "Equipe autorizada lê próprias fotos"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'produtos-imagens'
  AND public.is_team_member(auth.uid())
  AND (storage.foldername(name))[1] = (SELECT auth.uid()::text)
);

CREATE POLICY "Equipe autorizada envia próprias fotos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'produtos-imagens'
  AND public.is_team_member(auth.uid())
  AND (storage.foldername(name))[1] = (SELECT auth.uid()::text)
);

CREATE POLICY "Equipe autorizada altera próprias fotos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'produtos-imagens'
  AND public.is_team_member(auth.uid())
  AND (storage.foldername(name))[1] = (SELECT auth.uid()::text)
)
WITH CHECK (
  bucket_id = 'produtos-imagens'
  AND public.is_team_member(auth.uid())
  AND (storage.foldername(name))[1] = (SELECT auth.uid()::text)
);

CREATE POLICY "Equipe autorizada exclui próprias fotos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'produtos-imagens'
  AND public.is_team_member(auth.uid())
  AND (storage.foldername(name))[1] = (SELECT auth.uid()::text)
);