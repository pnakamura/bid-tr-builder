import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Hook para buscar TODOS os programas (incluindo inativos) - para uso em filtros
export const useAllProgramas = () => {
  return useQuery({
    queryKey: ["all-programas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("programas")
        .select("*")
        .order("nome");
      
      if (error) throw error;
      return data;
    },
  });
};
