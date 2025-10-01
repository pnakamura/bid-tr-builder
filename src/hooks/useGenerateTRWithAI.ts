import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";

interface GenerateTRRequest {
  template_id: string;
  context?: string;
  custom_prompts?: {
    title?: string;
    description?: string;
    objective?: string;
    scope?: string;
    requirements?: string;
    technical_criteria?: string;
    experience_criteria?: string;
  };
}

interface TRData {
  title: string;
  type: string;
  description: string;
  objective: string;
  scope: string;
  requirements: string;
  technical_criteria: string;
  experience_criteria: string;
  duration: string;
  budget: string;
}

interface GenerateTRResponse {
  success: boolean;
  data?: TRData;
  error?: string;
}

export const useGenerateTRWithAI = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (payload: GenerateTRRequest): Promise<TRData> => {
      const { data, error } = await supabase.functions.invoke('generate-tr-with-ai', {
        body: payload
      });

      if (error) {
        throw new Error(error.message || 'Erro ao gerar TR com IA');
      }

      const response = data as GenerateTRResponse;

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Erro ao gerar TR');
      }

      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "TR Gerado com Sucesso! ✨",
        description: "O conteúdo foi preenchido automaticamente. Revise e ajuste conforme necessário.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao Gerar TR",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
