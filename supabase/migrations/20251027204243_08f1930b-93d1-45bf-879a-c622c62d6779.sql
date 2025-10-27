-- Corrigir trigger e limpar banco de dados

-- 1. Dropar função com CASCADE (remove todos os triggers dependentes)
DROP FUNCTION IF EXISTS public.sync_causas_bidirectional() CASCADE;

-- Recriar função corrigida
CREATE OR REPLACE FUNCTION public.sync_causas_bidirectional()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  causas_concatenadas TEXT;
BEGIN
  IF TG_TABLE_NAME = 'riscos_causas' THEN
    -- Concatenar causas (corrigido: STRING_AGG com ORDER BY inline)
    SELECT STRING_AGG(descricao, '. ' ORDER BY created_at) INTO causas_concatenadas
    FROM public.riscos_causas 
    WHERE risco_id = COALESCE(NEW.risco_id, OLD.risco_id);
    
    UPDATE public.riscos 
    SET causas = causas_concatenadas, updated_at = NOW()
    WHERE id = COALESCE(NEW.risco_id, OLD.risco_id);
    
    RETURN COALESCE(NEW, OLD);
  END IF;
  
  RETURN NULL;
END;
$function$;

-- Recriar triggers
CREATE TRIGGER sync_causas_on_insert
  AFTER INSERT ON public.riscos_causas
  FOR EACH ROW EXECUTE FUNCTION public.sync_causas_bidirectional();

CREATE TRIGGER sync_causas_on_update
  AFTER UPDATE ON public.riscos_causas
  FOR EACH ROW EXECUTE FUNCTION public.sync_causas_bidirectional();

CREATE TRIGGER sync_causas_on_delete
  AFTER DELETE ON public.riscos_causas
  FOR EACH ROW EXECUTE FUNCTION public.sync_causas_bidirectional();

-- 2. LIMPEZA DO BANCO (mantém templates e usuários admin)
DELETE FROM public.riscos_variaveis_historico;
DELETE FROM public.riscos_historico;
DELETE FROM public.riscos_causas;
DELETE FROM public.riscos;
DELETE FROM public.osrl_assessments;
DELETE FROM public.projetos;
DELETE FROM public.profiles WHERE role != 'admin';