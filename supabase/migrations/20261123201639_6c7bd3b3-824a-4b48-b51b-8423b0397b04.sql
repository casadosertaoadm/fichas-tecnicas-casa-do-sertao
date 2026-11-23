CREATE TABLE public.fichas_tecnicas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  categoria text NOT NULL DEFAULT 'Diversos',
  imagem_url text,
  rendimento_tipo text NOT NULL DEFAULT 'simples',
  rendimento_quantidade text NOT NULL DEFAULT '',
  rendimento_unidade text NOT NULL DEFAULT 'Unidades',
  rendimento_peso_unitario text,
  rendimento_unidade_peso text,
  utensilios text NOT NULL DEFAULT '',
  modo_preparo text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.ficha_ingredientes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ficha_id uuid NOT NULL REFERENCES public.fichas_tecnicas(id) ON DELETE CASCADE,
  nome_ingrediente text NOT NULL,
  quantidade text NOT NULL DEFAULT '',
  unidade text NOT NULL DEFAULT 'g',
  ordem int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON public.ficha_ingredientes(ficha_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.fichas_tecnicas TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ficha_ingredientes TO anon, authenticated;
GRANT ALL ON public.fichas_tecnicas TO service_role;
GRANT ALL ON public.ficha_ingredientes TO service_role;
ALTER TABLE public.fichas_tecnicas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ficha_ingredientes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Validação: acesso livre fichas" ON public.fichas_tecnicas FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Validação: acesso livre ingredientes" ON public.ficha_ingredientes FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE OR REPLACE FUNCTION public.update_updated_at_column() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER fichas_updated_at BEFORE UPDATE ON public.fichas_tecnicas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.fichas_tecnicas (id, nome, categoria, rendimento_quantidade, rendimento_unidade, utensilios, modo_preparo) VALUES
('11111111-1111-1111-1111-111111111111','Rocambole de Chocolate','Rocamboles','4','Unidades',E'Batedeira planetária (globo)\nAssadeira 40x60 cm com papel manteiga\nForno turbo a 180 °C por 12 minutos\nPano limpo para enrolar',E'Bater os ovos com o açúcar em velocidade alta até triplicar o volume.\nPeneirar a farinha, o chocolate e o fermento e incorporar delicadamente.\nEspalhar na assadeira e assar a 180 °C por 12 minutos.\nDesenformar sobre pano úmido, rechear e enrolar ainda morno.\nResfriar por 2 horas antes de embalar.'),
('22222222-2222-2222-2222-222222222222','Bolo de Macaxeira','Bolos Ligados','3','Formas',E'Liquidificador industrial\nFormas retangulares 30x20 cm untadas\nForno a 200 °C por 50 minutos',E'Espremer a macaxeira ralada para retirar o excesso de líquido.\nBater no liquidificador os ovos, leites, manteiga e açúcar.\nMisturar à macaxeira e ao coco ralado.\nDistribuir nas formas e assar a 200 °C por 50 minutos até dourar.'),
('33333333-3333-3333-3333-333333333333','Biscoito de Nata','Biscoitos','2.5','Kg',E'Masseira semi-rápida\nBicos de confeitar\nAssadeiras perfuradas\nForno a 170 °C por 18 minutos',E'Misturar nata, açúcar e ovos até homogeneizar.\nAdicionar a farinha e o fermento aos poucos.\nModelar os biscoitos e dispor nas assadeiras.\nAssar a 170 °C por 18 minutos.');
INSERT INTO public.ficha_ingredientes (ficha_id, nome_ingrediente, quantidade, unidade, ordem) VALUES
('11111111-1111-1111-1111-111111111111','Ovos','12','Unidades',0),('11111111-1111-1111-1111-111111111111','Açúcar refinado','360','g',1),('11111111-1111-1111-1111-111111111111','Farinha de trigo','240','g',2),('11111111-1111-1111-1111-111111111111','Chocolate em pó 50%','80','g',3),('11111111-1111-1111-1111-111111111111','Fermento químico','10','g',4),('11111111-1111-1111-1111-111111111111','Recheio de brigadeiro','1.2','Kg',5),
('22222222-2222-2222-2222-222222222222','Macaxeira ralada crua','2','Kg',0),('22222222-2222-2222-2222-222222222222','Leite de coco','400','ml',1),('22222222-2222-2222-2222-222222222222','Leite condensado','790','g',2),('22222222-2222-2222-2222-222222222222','Coco ralado','200','g',3),('22222222-2222-2222-2222-222222222222','Ovos','6','Unidades',4),('22222222-2222-2222-2222-222222222222','Manteiga','100','g',5),('22222222-2222-2222-2222-222222222222','Açúcar','300','g',6),
('33333333-3333-3333-3333-333333333333','Nata','500','g',0),('33333333-3333-3333-3333-333333333333','Açúcar','400','g',1),('33333333-3333-3333-3333-333333333333','Farinha de trigo','1.5','Kg',2),('33333333-3333-3333-3333-333333333333','Ovos','4','Unidades',3),('33333333-3333-3333-3333-333333333333','Fermento químico','2','Colheres',4);