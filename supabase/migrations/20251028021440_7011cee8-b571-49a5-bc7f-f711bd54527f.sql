-- Criar tabela de programas
CREATE TABLE public.programas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  descricao TEXT,
  codigo TEXT,
  status TEXT DEFAULT 'Ativo',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.programas ENABLE ROW LEVEL SECURITY;

-- Política para visualização (todos usuários autenticados podem ver)
CREATE POLICY "Usuários autenticados podem ver programas"
  ON public.programas
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Política para admin e gestores criarem/editarem
CREATE POLICY "Admins e gestores podem gerenciar programas"
  ON public.programas
  FOR ALL
  USING (is_admin_or_gestor(auth.uid()));

-- Adicionar coluna programa_id aos termos_referencia
ALTER TABLE public.termos_referencia
ADD COLUMN programa_id UUID REFERENCES public.programas(id) ON DELETE SET NULL;

-- Criar índice para melhor performance
CREATE INDEX idx_termos_referencia_programa ON public.termos_referencia(programa_id);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_programas_updated_at
  BEFORE UPDATE ON public.programas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Inserir alguns programas exemplo
INSERT INTO public.programas (nome, descricao, codigo) VALUES
  ('PROSAMIN+', 'Programa Social e Ambiental de Manaus e Interior', 'PROS001'),
  ('Educação e Cultura', 'Programa de Desenvolvimento Educacional e Cultural', 'EDU001'),
  ('Infraestrutura', 'Programa de Desenvolvimento de Infraestrutura', 'INF001'),
  ('Saúde', 'Programa de Desenvolvimento em Saúde', 'SAU001'),
  ('Meio Ambiente', 'Programa de Preservação e Sustentabilidade Ambiental', 'AMB001');