import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";

interface TRData {
  title: string;
  type: string;
  description: string;
  objective: string;
  scope: string;
  requirements: string;
  technical_criteria: string;
  experience_criteria: string;
  technical_weight: number;
  experience_weight: number;
  duration: string;
  budget: string;
}

interface SendToN8NPayload {
  tr_data: TRData;
  template_id: string;
}

interface SendToN8NResponse {
  success: boolean;
  request_id: string;
  message: string;
  n8n_response?: any;
  error?: string;
}

export const useSendToN8N = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (payload: SendToN8NPayload): Promise<SendToN8NResponse> => {
      const { data, error } = await supabase.functions.invoke('send-to-n8n', {
        body: payload
      });

      if (error) {
        throw new Error(error.message || 'Erro ao enviar TR para processamento');
      }

      return data;
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "TR Enviado com Sucesso!",
          description: `${data.message} (ID: ${data.request_id.slice(0, 8)}...)`,
        });
      } else {
        throw new Error(data.error || 'Erro desconhecido');
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao Enviar TR",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};