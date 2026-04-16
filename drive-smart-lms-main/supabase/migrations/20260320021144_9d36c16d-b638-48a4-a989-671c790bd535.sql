
ALTER TABLE public.tokens ADD COLUMN IF NOT EXISTS email_comprador text;
ALTER TABLE public.tokens ADD COLUMN IF NOT EXISTS nome_comprador text;
