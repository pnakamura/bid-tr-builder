import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";

export const useMeusTRs = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Fetch TRs with template info
  const { data: trs, isLoading, error } = useQuery({
    queryKey: ['termos-referencia'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('termos_referencia')
        .select(`
          *,
          templates (
            title,
            category
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });
  
  // Delete TR mutation
  const deleteTR = useMutation({
    mutationFn: async (trId: string) => {
      const { error } = await supabase
        .from('termos_referencia')
        .delete()
        .eq('id', trId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['termos-referencia'] });
      toast({
        title: "TR Excluído",
        description: "O termo de referência foi removido com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao Excluir",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  return { trs, isLoading, error, deleteTR };
};
