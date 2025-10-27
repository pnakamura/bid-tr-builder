import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useTRStats = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['tr-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('termos_referencia')
        .select('status');
      
      if (error) throw error;
      
      return {
        total: data.length,
        processando: data.filter(t => t.status === 'processando').length,
        concluidos: data.filter(t => t.status === 'concluido').length,
        erros: data.filter(t => t.status === 'erro').length,
      };
    }
  });

  return { stats, isLoading };
};
