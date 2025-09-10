import { z } from "zod";

// Esquemas de validação por etapa do TR
export const basicInfoSchema = z.object({
  title: z.string()
    .min(10, "O título deve ter pelo menos 10 caracteres")
    .max(200, "O título não pode exceder 200 caracteres"),
  
  type: z.string()
    .min(1, "Selecione um tipo de contratação"),
  
  template_id: z.string()
    .min(1, "Selecione um template"),
  
  description: z.string()
    .min(50, "A descrição deve ter pelo menos 50 caracteres")
    .max(2000, "A descrição não pode exceder 2000 caracteres"),
  
  objective: z.string()
    .min(30, "O objetivo deve ter pelo menos 30 caracteres")
    .max(1000, "O objetivo não pode exceder 1000 caracteres"),
});

export const technicalSpecsSchema = z.object({
  scope: z.string()
    .min(100, "O escopo deve ter pelo menos 100 caracteres")
    .max(5000, "O escopo não pode exceder 5000 caracteres"),
  
  requirements: z.string()
    .min(50, "Os requisitos devem ter pelo menos 50 caracteres")
    .max(2000, "Os requisitos não podem exceder 2000 caracteres"),
});

export const evaluationCriteriaSchema = z.object({
  technical_criteria: z.string()
    .min(50, "Os critérios técnicos devem ter pelo menos 50 caracteres"),
  
  experience_criteria: z.string()
    .min(30, "Os critérios de experiência devem ter pelo menos 30 caracteres"),
  
  technical_weight: z.number()
    .min(0, "O peso deve ser no mínimo 0")
    .max(100, "O peso deve ser no máximo 100"),
  
  experience_weight: z.number()
    .min(0, "O peso deve ser no mínimo 0")
    .max(100, "O peso deve ser no máximo 100"),
});

export const financialDetailsSchema = z.object({
  duration: z.string()
    .min(1, "Informe o prazo de execução"),
  
  budget: z.string()
    .min(1, "Informe a estimativa orçamentária"),
});

// Schema completo do TR
export const trSchema = z.object({
  ...basicInfoSchema.shape,
  ...technicalSpecsSchema.shape,
  ...evaluationCriteriaSchema.shape,
  ...financialDetailsSchema.shape,
});

export type BasicInfoData = z.infer<typeof basicInfoSchema>;
export type TechnicalSpecsData = z.infer<typeof technicalSpecsSchema>;
export type EvaluationCriteriaData = z.infer<typeof evaluationCriteriaSchema>;
export type FinancialDetailsData = z.infer<typeof financialDetailsSchema>;
export type TRData = z.infer<typeof trSchema>;

// Função para validar um passo específico
export const validateStep = (step: number, data: any) => {
  switch (step) {
    case 1:
      return basicInfoSchema.safeParse(data);
    case 2:
      return technicalSpecsSchema.safeParse(data);
    case 3:
      return evaluationCriteriaSchema.safeParse(data);
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
                step === 3 ? evaluationCriteriaSchema :
                step === 4 ? financialDetailsSchema : null;
  
  if (!schema) return 100; // Passos sem validação são considerados completos
  
  const fields = Object.keys(schema.shape);
  const filledFields = fields.filter(field => {
    const value = data[field];
    return value && value.toString().trim().length > 0;
  });
  
  return Math.round((filledFields.length / fields.length) * 100);
};