DROP POLICY IF EXISTS "Usuários autenticados leem suas fichas" ON public.fichas_tecnicas;
DROP POLICY IF EXISTS "Usuários autenticados criam fichas" ON public.fichas_tecnicas;
DROP POLICY IF EXISTS "Usuários autenticados editam suas fichas" ON public.fichas_tecnicas;
DROP POLICY IF EXISTS "Usuários autenticados excluem suas fichas" ON public.fichas_tecnicas;

CREATE POLICY "Equipe autenticada lê todas as fichas"
  ON public.fichas_tecnicas FOR SELECT TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Equipe autenticada cria fichas"
  ON public.fichas_tecnicas FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Equipe autenticada edita todas as fichas"
  ON public.fichas_tecnicas FOR UPDATE TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Equipe autenticada exclui todas as fichas"
  ON public.fichas_tecnicas FOR DELETE TO authenticated
  USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Usuários autenticados leem ingredientes das suas fichas" ON public.ficha_ingredientes;
DROP POLICY IF EXISTS "Usuários autenticados criam ingredientes das suas fichas" ON public.ficha_ingredientes;
DROP POLICY IF EXISTS "Usuários autenticados editam ingredientes das suas fichas" ON public.ficha_ingredientes;
DROP POLICY IF EXISTS "Usuários autenticados excluem ingredientes das suas fichas" ON public.ficha_ingredientes;

CREATE POLICY "Equipe autenticada lê todos os ingredientes"
  ON public.ficha_ingredientes FOR SELECT TO authenticated
  USING (auth.uid() IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.fichas_tecnicas f WHERE f.id = ficha_id
  ));

CREATE POLICY "Equipe autenticada cria ingredientes"
  ON public.ficha_ingredientes FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.fichas_tecnicas f WHERE f.id = ficha_id
  ));

CREATE POLICY "Equipe autenticada edita todos os ingredientes"
  ON public.ficha_ingredientes FOR UPDATE TO authenticated
  USING (auth.uid() IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.fichas_tecnicas f WHERE f.id = ficha_id
  ))
  WITH CHECK (auth.uid() IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.fichas_tecnicas f WHERE f.id = ficha_id
  ));

CREATE POLICY "Equipe autenticada exclui todos os ingredientes"
  ON public.ficha_ingredientes FOR DELETE TO authenticated
  USING (auth.uid() IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.fichas_tecnicas f WHERE f.id = ficha_id
  ));

DROP POLICY IF EXISTS "Dono lê próprias fotos" ON storage.objects;
DROP POLICY IF EXISTS "Dono envia próprias fotos" ON storage.objects;
DROP POLICY IF EXISTS "Dono altera próprias fotos" ON storage.objects;
DROP POLICY IF EXISTS "Dono exclui próprias fotos" ON storage.objects;

CREATE POLICY "Equipe autenticada lê todas as fotos"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'produtos-imagens' AND auth.uid() IS NOT NULL);

CREATE POLICY "Equipe autenticada envia fotos"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'produtos-imagens' AND auth.uid() IS NOT NULL);

CREATE POLICY "Equipe autenticada altera fotos"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'produtos-imagens' AND auth.uid() IS NOT NULL)
  WITH CHECK (bucket_id = 'produtos-imagens' AND auth.uid() IS NOT NULL);

CREATE POLICY "Equipe autenticada exclui fotos"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'produtos-imagens' AND auth.uid() IS NOT NULL);