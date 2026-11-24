ALTER TABLE public.fichas_tecnicas
  ADD COLUMN IF NOT EXISTS user_id uuid DEFAULT auth.uid();

CREATE INDEX IF NOT EXISTS fichas_tecnicas_user_id_idx ON public.fichas_tecnicas(user_id);

DROP POLICY IF EXISTS "Validação: acesso livre fichas" ON public.fichas_tecnicas;
DROP POLICY IF EXISTS "Validação: acesso livre ingredientes" ON public.ficha_ingredientes;

REVOKE ALL ON public.fichas_tecnicas FROM anon;
REVOKE ALL ON public.ficha_ingredientes FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.fichas_tecnicas TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ficha_ingredientes TO authenticated;

CREATE POLICY "Usuários autenticados leem suas fichas"
  ON public.fichas_tecnicas FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Usuários autenticados criam fichas"
  ON public.fichas_tecnicas FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Usuários autenticados editam suas fichas"
  ON public.fichas_tecnicas FOR UPDATE TO authenticated
  USING (user_id = auth.uid() OR user_id IS NULL)
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Usuários autenticados excluem suas fichas"
  ON public.fichas_tecnicas FOR DELETE TO authenticated
  USING (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Usuários autenticados leem ingredientes das suas fichas"
  ON public.ficha_ingredientes FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.fichas_tecnicas f
    WHERE f.id = ficha_id AND (f.user_id = auth.uid() OR f.user_id IS NULL)
  ));

CREATE POLICY "Usuários autenticados criam ingredientes das suas fichas"
  ON public.ficha_ingredientes FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.fichas_tecnicas f
    WHERE f.id = ficha_id AND (f.user_id = auth.uid() OR f.user_id IS NULL)
  ));

CREATE POLICY "Usuários autenticados editam ingredientes das suas fichas"
  ON public.ficha_ingredientes FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.fichas_tecnicas f
    WHERE f.id = ficha_id AND (f.user_id = auth.uid() OR f.user_id IS NULL)
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.fichas_tecnicas f
    WHERE f.id = ficha_id AND (f.user_id = auth.uid() OR f.user_id IS NULL)
  ));

CREATE POLICY "Usuários autenticados excluem ingredientes das suas fichas"
  ON public.ficha_ingredientes FOR DELETE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.fichas_tecnicas f
    WHERE f.id = ficha_id AND (f.user_id = auth.uid() OR f.user_id IS NULL)
  ));

DROP POLICY IF EXISTS "Validação: ler fotos" ON storage.objects;
DROP POLICY IF EXISTS "Validação: enviar fotos" ON storage.objects;
DROP POLICY IF EXISTS "Validação: alterar fotos" ON storage.objects;
DROP POLICY IF EXISTS "Validação: excluir fotos" ON storage.objects;

CREATE POLICY "Dono lê próprias fotos"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'produtos-imagens' AND (storage.foldername(name))[1] = (select auth.uid()::text));

CREATE POLICY "Dono envia próprias fotos"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'produtos-imagens' AND (storage.foldername(name))[1] = (select auth.uid()::text));

CREATE POLICY "Dono altera próprias fotos"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'produtos-imagens' AND (storage.foldername(name))[1] = (select auth.uid()::text))
  WITH CHECK (bucket_id = 'produtos-imagens' AND (storage.foldername(name))[1] = (select auth.uid()::text));

CREATE POLICY "Dono exclui próprias fotos"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'produtos-imagens' AND (storage.foldername(name))[1] = (select auth.uid()::text));