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
  tr_id: string;
  message: string;
  google_docs_url?: string;
  n8n_response?: any;
  error?: string;
  warning?: string;
  n8n_available?: boolean;
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
        let message = data.message;
        
        // Check if N8N is available and document was generated
        if (data.google_docs_url) {
          message = `${message}\n\n📄 Documento disponível no Google Docs\nID: ${data.request_id.slice(0, 8)}...`;
        } else if (data.warning) {
          message = `${message}\n\n⚠️ ${data.warning}`;
        }
          
        toast({
          title: data.google_docs_url ? "✅ TR Criado com Sucesso!" : "⚠️ TR Salvo",
          description: message,
          duration: 10000,
          variant: data.warning ? "default" : "default",
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