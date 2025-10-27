import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";
import { useEffect, useRef } from "react";

export const useMeusTRs = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const previousTRsRef = useRef<any[]>([]);
  
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
    },
    refetchInterval: (query) => {
      // Auto-refresh every 10 seconds if there are TRs with status 'processando'
      const hasProcessing = query.state.data?.some((tr: any) => tr.status === 'processando');
      return hasProcessing ? 10000 : false;
    },
  });

  // Detect when a TR changes from 'processando' to 'concluido'
  useEffect(() => {
    if (!trs || !previousTRsRef.current.length) {
      previousTRsRef.current = trs || [];
      return;
    }

    trs.forEach((currentTR: any) => {
      const previousTR = previousTRsRef.current.find((tr: any) => tr.id === currentTR.id);
      
      if (previousTR && previousTR.status === 'processando' && currentTR.status === 'concluido') {
        // TR just finished processing!
        toast({
          title: "🎉 Documento Pronto!",
          description: `O TR "${currentTR.title}" foi processado com sucesso e está disponível para acesso.`,
          duration: 8000,
        });
      } else if (previousTR && previousTR.status === 'processando' && currentTR.status === 'erro') {
        // TR failed processing
        toast({
          title: "⚠️ Erro no Processamento",
          description: `Houve um erro ao processar o TR "${currentTR.title}". Tente novamente.`,
          variant: "destructive",
          duration: 8000,
        });
      }
    });

    previousTRsRef.current = trs;
  }, [trs, toast]);
  
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
