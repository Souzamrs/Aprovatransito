
-- Tokens de aluno
CREATE TABLE public.tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  token TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'cancelado')),
  nome_aluno TEXT,
  criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.tokens ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for service role" ON public.tokens FOR ALL USING (true) WITH CHECK (true);

-- Categorias (módulos)
CREATE TABLE public.categorias (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  emoji TEXT DEFAULT '📚',
  descricao TEXT,
  ordem INT NOT NULL DEFAULT 0,
  criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read categorias" ON public.categorias FOR SELECT USING (true);
CREATE POLICY "Allow all write categorias" ON public.categorias FOR ALL USING (true) WITH CHECK (true);

-- Aulas
CREATE TABLE public.aulas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  categoria_id UUID REFERENCES public.categorias(id) ON DELETE CASCADE NOT NULL,
  conteudo TEXT DEFAULT '',
  tempo_leitura TEXT DEFAULT '5 min',
  status TEXT NOT NULL DEFAULT 'rascunho' CHECK (status IN ('publicada', 'rascunho')),
  ordem INT NOT NULL DEFAULT 0,
  criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.aulas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read aulas" ON public.aulas FOR SELECT USING (true);
CREATE POLICY "Allow all write aulas" ON public.aulas FOR ALL USING (true) WITH CHECK (true);

-- Questões
CREATE TABLE public.questoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  enunciado TEXT NOT NULL,
  categoria_id UUID REFERENCES public.categorias(id) ON DELETE CASCADE NOT NULL,
  alternativa_a TEXT NOT NULL,
  alternativa_b TEXT NOT NULL,
  alternativa_c TEXT NOT NULL,
  alternativa_d TEXT NOT NULL,
  alternativa_correta TEXT NOT NULL CHECK (alternativa_correta IN ('a', 'b', 'c', 'd')),
  explicacao TEXT,
  criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.questoes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read questoes" ON public.questoes FOR SELECT USING (true);
CREATE POLICY "Allow all write questoes" ON public.questoes FOR ALL USING (true) WITH CHECK (true);
