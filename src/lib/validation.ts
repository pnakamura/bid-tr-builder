import { z } from "zod";

// Esquemas de validação por etapa do TR
export const basicInfoSchema = z.object({
  titulo: z.string()
    .min(10, "O título deve ter pelo menos 10 caracteres")
    .max(200, "O título não pode exceder 200 caracteres"),
  
  descricao: z.string()
    .min(50, "A descrição deve ter pelo menos 50 caracteres")
    .max(2000, "A descrição não pode exceder 2000 caracteres"),
  
  objetivo: z.string()
    .min(30, "O objetivo deve ter pelo menos 30 caracteres")
    .max(1000, "O objetivo não pode exceder 1000 caracteres"),
  
  justificativa: z.string()
    .min(100, "A justificativa deve ter pelo menos 100 caracteres")
    .max(3000, "A justificativa não pode exceder 3000 caracteres"),
});

export const technicalSpecsSchema = z.object({
  escopo: z.string()
    .min(100, "O escopo deve ter pelo menos 100 caracteres")
    .max(5000, "O escopo não pode exceder 5000 caracteres"),
  
  produtos: z.string()
    .min(50, "Os produtos esperados devem ter pelo menos 50 caracteres")
    .max(3000, "Os produtos não podem exceder 3000 caracteres"),
  
  perfil_consultor: z.string()
    .min(100, "O perfil do consultor deve ter pelo menos 100 caracteres")
    .max(2000, "O perfil não pode exceder 2000 caracteres"),
  
  qualificacoes: z.string()
    .min(50, "As qualificações devem ter pelo menos 50 caracteres")
    .max(1500, "As qualificações não podem exceder 1500 caracteres"),
});

export const financialDetailsSchema = z.object({
  valor_estimado: z.number()
    .min(1000, "O valor deve ser maior que R$ 1.000")
    .max(10000000, "O valor não pode exceder R$ 10.000.000"),
  
  moeda: z.enum(["BRL", "USD", "EUR"], {
    message: "Selecione uma moeda válida"
  }),
  
  fonte_recurso: z.string()
    .min(5, "Especifique a fonte do recurso")
    .max(200, "A fonte do recurso não pode exceder 200 caracteres"),
  
  prazo_execucao: z.number()
    .min(1, "O prazo deve ser de pelo menos 1 mês")
    .max(60, "O prazo não pode exceder 60 meses"),
});

// Schema completo do TR
export const trSchema = z.object({
  ...basicInfoSchema.shape,
  ...technicalSpecsSchema.shape,
  ...financialDetailsSchema.shape,
});

export type BasicInfoData = z.infer<typeof basicInfoSchema>;
export type TechnicalSpecsData = z.infer<typeof technicalSpecsSchema>;
export type FinancialDetailsData = z.infer<typeof financialDetailsSchema>;
export type TRData = z.infer<typeof trSchema>;

// Função para validar um passo específico
export const validateStep = (step: number, data: any) => {
  switch (step) {
    case 1:
      return basicInfoSchema.safeParse(data);
    case 2:
      return technicalSpecsSchema.safeParse(data);
    case 4:
      return financialDetailsSchema.safeParse(data);
    default:
      return { success: true, data };
  }
};

// Função para obter progresso de preenchimento de um passo
export const getStepProgress = (step: number, data: any): number => {
  const schema = step === 1 ? basicInfoSchema : 
                step === 2 ? technicalSpecsSchema : 
                step === 4 ? financialDetailsSchema : null;
  
  if (!schema) return 100; // Passos sem validação são considerados completos
  
  const fields = Object.keys(schema.shape);
  const filledFields = fields.filter(field => {
    const value = data[field];
    return value && value.toString().trim().length > 0;
  });
  
  return Math.round((filledFields.length / fields.length) * 100);
};