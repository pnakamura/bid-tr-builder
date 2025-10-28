import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useProgramas = () => {
  return useQuery({
    queryKey: ["programas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("programas")
        .select("*")
        .eq("status", "Ativo")
        .order("nome");
      
      if (error) throw error;
      return data;
    },
  });
};
