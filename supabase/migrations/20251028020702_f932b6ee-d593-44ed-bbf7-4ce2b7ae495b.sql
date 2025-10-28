-- Adicionar coluna para linkar riscos aos termos de referência
ALTER TABLE public.riscos 
ADD COLUMN termo_referencia_id UUID REFERENCES public.termos_referencia(id) ON DELETE SET NULL;

-- Criar índice para melhorar performance nas consultas
CREATE INDEX idx_riscos_termo_referencia ON public.riscos(termo_referencia_id);

-- Comentário explicativo
COMMENT ON COLUMN public.riscos.termo_referencia_id IS 'Referência ao Termo de Referência associado ao risco';