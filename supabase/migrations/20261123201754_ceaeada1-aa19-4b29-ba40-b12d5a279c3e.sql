CREATE POLICY "Validação: ler fotos" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'produtos-imagens');
CREATE POLICY "Validação: enviar fotos" ON storage.objects FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'produtos-imagens');
CREATE POLICY "Validação: alterar fotos" ON storage.objects FOR UPDATE TO anon, authenticated USING (bucket_id = 'produtos-imagens');
CREATE POLICY "Validação: excluir fotos" ON storage.objects FOR DELETE TO anon, authenticated USING (bucket_id = 'produtos-imagens');