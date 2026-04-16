
-- Tabela provinhas
CREATE TABLE public.provinhas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  descricao text,
  status text NOT NULL DEFAULT 'rascunho',
  criado_em timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.provinhas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read provinhas" ON public.provinhas FOR SELECT USING (true);
CREATE POLICY "Allow all write provinhas" ON public.provinhas FOR ALL USING (true) WITH CHECK (true);

-- Tabela provinhas_questoes
CREATE TABLE public.provinhas_questoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provinha_id uuid NOT NULL REFERENCES public.provinhas(id) ON DELETE CASCADE,
  enunciado text NOT NULL,
  alternativa_a text NOT NULL,
  alternativa_b text NOT NULL,
  alternativa_c text NOT NULL,
  alternativa_d text NOT NULL,
  alternativa_correta text NOT NULL,
  explicacao text,
  ordem integer NOT NULL DEFAULT 0
);

ALTER TABLE public.provinhas_questoes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read provinhas_questoes" ON public.provinhas_questoes FOR SELECT USING (true);
CREATE POLICY "Allow all write provinhas_questoes" ON public.provinhas_questoes FOR ALL USING (true) WITH CHECK (true);

-- Tabela provinhas_resultados (histórico do aluno)
CREATE TABLE public.provinhas_resultados (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token_aluno text NOT NULL,
  provinha_id uuid NOT NULL REFERENCES public.provinhas(id) ON DELETE CASCADE,
  acertos integer NOT NULL DEFAULT 0,
  total integer NOT NULL DEFAULT 0,
  percentual numeric NOT NULL DEFAULT 0,
  criado_em timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.provinhas_resultados ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read provinhas_resultados" ON public.provinhas_resultados FOR SELECT USING (true);
CREATE POLICY "Allow all write provinhas_resultados" ON public.provinhas_resultados FOR ALL USING (true) WITH CHECK (true);
