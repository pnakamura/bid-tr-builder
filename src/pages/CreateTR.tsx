import { Header } from "@/components/Header";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { SectionHeader } from "@/components/ui/section-header";
import { AutoSaveIndicator } from "@/components/AutoSaveIndicator";
import { HelpDrawer } from "@/components/HelpDrawer";
import { HelpTour } from "@/components/HelpTour";
import { FormField } from "@/components/FormField";
import { useState, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight, FileText, ArrowLeft, AlertCircle, PlayCircle, CheckCircle2, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useFormValidation } from "@/hooks/useFormValidation";
import { useAutoSave } from "@/hooks/useAutoSave";
import { validateStep, getStepProgress } from "@/lib/validation";
import { useTemplates } from "@/hooks/useTemplates";
import { useSendToN8N } from "@/hooks/useSendToN8N";
import { useGenerateTRWithAI } from "@/hooks/useGenerateTRWithAI";
import { useProgramas } from "@/hooks/useProgramas";
import { AIGenerationDialog } from "@/components/AIGenerationDialog";
import { useHelp } from "@/contexts/HelpContext";
import { createTRWithTemplatesHelpSteps } from "@/config/createTRWithTemplatesHelpSteps";

const steps = [
  { id: 1, title: "Informações Básicas", description: "Dados gerais do termo de referência" },
  { id: 2, title: "Especificações Técnicas", description: "Detalhes técnicos e requisitos" },
  { id: 3, title: "Critérios de Avaliação", description: "Definição dos critérios de seleção" },
  { id: 4, title: "Cronograma e Valores", description: "Prazos e estimativas orçamentárias" },
  { id: 5, title: "Revisão Final", description: "Validação e finalização do documento" }
];

const CreateTR = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { templates, isLoading: templatesLoading } = useTemplates();
  const { data: programas, isLoading: programasLoading } = useProgramas();
  const sendToN8N = useSendToN8N();
  const generateWithAI = useGenerateTRWithAI();
  const { startHelp } = useHelp();
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    template_id: "",
    programa_id: "",
    description: "",
    objective: "",
    scope: "",
    duration: "",
    budget: "",
    requirements: "",
    technical_criteria: "",
    experience_criteria: "",
    technical_weight: 70,
    experience_weight: 30
  });

  // Auto-save functionality
  const saveToLocalStorage = useCallback(async (data: typeof formData) => {
    localStorage.setItem('tr-draft', JSON.stringify({ data, currentStep, timestamp: Date.now() }));
  }, [currentStep]);

  const { status, lastSaved } = useAutoSave({
    data: formData,
    onSave: saveToLocalStorage,
    delay: 2000,
    enabled: true
  });

  // Load saved data on mount
  useEffect(() => {
    const saved = localStorage.getItem('tr-draft');
    if (saved) {
      try {
        const { data, currentStep: savedStep } = JSON.parse(saved);
        setFormData(data);
        setCurrentStep(savedStep);
        toast({
          title: "Rascunho recuperado",
          description: "Seus dados foram restaurados automaticamente.",
        });
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []); // Empty dependency array - run only once on mount

  // Validation for current step
  const currentStepValidation = validateStep(currentStep, formData);
  const canProceed = currentStepValidation.success;
  
  // Real-time field validation states
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  
  // Validate individual field
  const validateField = (field: string, value: string | number) => {
    const errors: Record<string, string> = {};
    
    if (currentStep === 1) {
      if (field === 'title' && typeof value === 'string' && value.length < 10) {
        errors.title = 'Mínimo 10 caracteres';
      }
      if (field === 'description' && typeof value === 'string' && value.length < 50) {
        errors.description = 'Mínimo 50 caracteres';
      }
      if (field === 'objective' && typeof value === 'string' && value.length < 30) {
        errors.objective = 'Mínimo 30 caracteres';
      }
      if (field === 'type' && !value) {
        errors.type = 'Campo obrigatório';
      }
      if (field === 'template_id' && !value) {
        errors.template_id = 'Campo obrigatório';
      }
    }
    
    if (currentStep === 2) {
      if (field === 'scope' && typeof value === 'string' && value.length < 30) {
        errors.scope = 'Mínimo 30 caracteres';
      }
    }
    
    if (currentStep === 3) {
      if (field === 'technical_criteria' && typeof value === 'string' && value.length < 30) {
        errors.technical_criteria = 'Mínimo 30 caracteres';
      }
      if (field === 'experience_criteria' && typeof value === 'string' && value.length < 20) {
        errors.experience_criteria = 'Mínimo 20 caracteres';
      }
    }
    
    if (currentStep === 4) {
      if (field === 'duration' && !value) {
        errors.duration = 'Campo obrigatório';
      }
      if (field === 'budget' && !value) {
        errors.budget = 'Campo obrigatório';
      }
    }
    
    return errors;
  };

  const handleNext = () => {
    if (currentStep < steps.length && canProceed) {
      setCurrentStep(currentStep + 1);
      toast({
        title: "Progresso salvo",
        description: `Etapa ${currentStep} concluída com sucesso.`,
      });
    } else if (!canProceed) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios antes de continuar.",
        variant: "destructive"
      });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFieldChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    setFieldErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
    
    // Validate on blur (debounced)
    setTimeout(() => {
      const errors = validateField(field, value);
      setFieldErrors(prev => ({ ...prev, ...errors }));
    }, 500);
  };

  const handleStepClick = (stepId: number) => {
    setCurrentStep(stepId);
  };

  const handleStartTour = () => {
    startHelp(createTRWithTemplatesHelpSteps);
  };

  const handleGenerateWithAI = (context: string) => {
    if (!formData.template_id) {
      toast({
        title: "Template Necessário",
        description: "Selecione um template antes de gerar com IA",
        variant: "destructive",
      });
      return;
    }

    generateWithAI.mutate(
      {
        template_id: formData.template_id,
        context: context || undefined,
      },
      {
        onSuccess: (data) => {
          setFormData((prev) => ({
            ...prev,
            title: data.title,
            type: data.type,
            description: data.description,
            objective: data.objective,
            scope: data.scope,
            requirements: data.requirements,
            technical_criteria: data.technical_criteria,
            experience_criteria: data.experience_criteria,
            duration: data.duration,
            budget: data.budget,
          }));
        },
      }
    );
  };

  const handleFinalizeTR = async () => {
    if (!formData.template_id) {
      toast({
        title: "Template obrigatório",
        description: "Selecione um template antes de finalizar o TR.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await sendToN8N.mutateAsync({
        tr_data: {
          title: formData.title,
          type: formData.type,
          description: formData.description,
          objective: formData.objective,
          scope: formData.scope,
          requirements: formData.requirements,
          technical_criteria: formData.technical_criteria,
          experience_criteria: formData.experience_criteria,
          technical_weight: formData.technical_weight,
          experience_weight: formData.experience_weight,
          duration: formData.duration,
          budget: formData.budget,
          programa_id: formData.programa_id || undefined,
        },
        template_id: formData.template_id
      });

      // Clear saved draft after successful submission
      localStorage.removeItem('tr-draft');
      
      // Show success message and redirect
      toast({
        title: "TR Armazenado no Sistema",
        description: "Você pode acessá-lo na página 'Meus TRs'",
      });
      
      // Redirect to Meus TRs page after 2 seconds
      setTimeout(() => {
        window.location.href = '/meus-trs';
      }, 2000);
      
    } catch (error) {
      console.error('Error sending TR to N8N:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Título do Termo de Referência"
                helpText="Digite um título claro e descritivo para o Termo de Referência. Mínimo de 10 caracteres."
                error={fieldErrors.title}
                success={formData.title.length >= 10}
                required
                htmlFor="title"
                dataHelpId="field-title"
              >
                <Input 
                  id="title"
                  placeholder="Ex: Consultoria para Sistema de Gestão"
                  value={formData.title}
                  onChange={(e) => handleFieldChange("title", e.target.value)}
                  className={fieldErrors.title ? "border-destructive" : formData.title.length >= 10 ? "border-success" : ""}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.title.length}/10 caracteres mínimos
                </p>
              </FormField>

              <FormField
                label="Tipo de Contratação"
                helpText="Selecione o tipo de contratação que melhor se adequa ao seu projeto."
                error={fieldErrors.type}
                success={!!formData.type}
                required
                htmlFor="type"
                dataHelpId="field-type"
              >
                <Select value={formData.type} onValueChange={(value) => handleFieldChange("type", value)}>
                  <SelectTrigger className={fieldErrors.type ? "border-destructive" : formData.type ? "border-success" : ""}>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="obras">Obras e Serviços de Engenharia</SelectItem>
                    <SelectItem value="consultoria">Consultorias e Serviços Técnicos</SelectItem>
                    <SelectItem value="equipamentos">Equipamentos e Materiais</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
            </div>

            <FormField
              label="Programa Associado"
              helpText="Selecione o programa ao qual este TR estará vinculado."
              error={fieldErrors.programa_id}
              success={!!formData.programa_id}
              required
              htmlFor="programa_id"
              dataHelpId="field-programa"
            >
              <Select value={formData.programa_id} onValueChange={(value) => handleFieldChange("programa_id", value)}>
                <SelectTrigger 
                  className={fieldErrors.programa_id ? "border-destructive" : formData.programa_id ? "border-success" : ""}
                  disabled={programasLoading}
                >
                  <SelectValue placeholder={
                    programasLoading 
                      ? "Carregando programas..." 
                      : (!programas || programas.length === 0)
                        ? "Nenhum programa disponível"
                        : "Selecione um programa"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {programas?.map((programa) => (
                    <SelectItem key={programa.id} value={programa.id}>
                      {programa.nome} {programa.codigo && `(${programa.codigo})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formData.programa_id && programas && (
                <p className="text-sm text-muted-foreground mt-2">
                  {programas.find(p => p.id === formData.programa_id)?.descricao}
                </p>
              )}
            </FormField>

            <FormField
              label="Template a ser Seguido"
              helpText="Selecione um template para preencher automaticamente vários campos com valores predefinidos. Isso acelera o processo de criação."
              error={fieldErrors.template_id}
              success={!!formData.template_id}
              required
              htmlFor="template_id"
              dataHelpId="field-template"
            >
              <Select value={formData.template_id} onValueChange={(value) => handleFieldChange("template_id", value)}>
                <SelectTrigger 
                  className={fieldErrors.template_id ? "border-destructive" : formData.template_id ? "border-success" : ""}
                  disabled={templatesLoading}
                >
                  <SelectValue placeholder={
                    templatesLoading 
                      ? "Carregando templates..." 
                      : (!templates || templates.length === 0)
                        ? "Nenhum template disponível"
                        : "Selecione um template"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {templates?.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.title} ({template.category})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formData.template_id && templates && (
                <p className="text-sm text-muted-foreground mt-2">
                  {templates.find(t => t.id === formData.template_id)?.description}
                </p>
              )}
            </FormField>
            
            <FormField
              label="Descrição Geral"
              helpText="Descreva detalhadamente o objeto da contratação, incluindo todas as características relevantes. Mínimo de 50 caracteres."
              error={fieldErrors.description}
              success={formData.description.length >= 50}
              required
              htmlFor="description"
              dataHelpId="field-description"
            >
              <Textarea 
                id="description"
                placeholder="Descreva brevemente o objeto da contratação..."
                rows={4}
                value={formData.description}
                onChange={(e) => handleFieldChange("description", e.target.value)}
                className={fieldErrors.description ? "border-destructive" : formData.description.length >= 50 ? "border-success" : ""}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formData.description.length}/50 caracteres mínimos
              </p>
            </FormField>

            <FormField
              label="Objetivo da Contratação"
              helpText="Defina claramente os objetivos que devem ser alcançados com esta contratação. Mínimo de 30 caracteres."
              error={fieldErrors.objective}
              success={formData.objective.length >= 30}
              required
              htmlFor="objective"
              dataHelpId="field-objective"
            >
              <Textarea 
                id="objective"
                placeholder="Defina os objetivos específicos que se pretende alcançar..."
                rows={3}
                value={formData.objective}
                onChange={(e) => handleFieldChange("objective", e.target.value)}
                className={fieldErrors.objective ? "border-destructive" : formData.objective.length >= 30 ? "border-success" : ""}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formData.objective.length}/30 caracteres mínimos
              </p>
            </FormField>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <FormField
              label="Escopo dos Serviços"
              helpText="Detalhe o escopo completo dos serviços a serem executados. Mínimo de 30 caracteres."
              error={fieldErrors.scope}
              success={formData.scope.length >= 30}
              required
              htmlFor="scope"
              dataHelpId="field-scope"
            >
              <Textarea 
                id="scope"
                placeholder="Detalhe o escopo completo dos serviços a serem executados..."
                rows={6}
                value={formData.scope}
                onChange={(e) => handleFieldChange("scope", e.target.value)}
                className={fieldErrors.scope ? "border-destructive" : formData.scope.length >= 30 ? "border-success" : ""}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formData.scope.length}/30 caracteres mínimos
              </p>
            </FormField>

            <FormField
              label="Requisitos Técnicos"
              helpText="Liste os requisitos técnicos, qualificações necessárias, certificações, etc."
              htmlFor="requirements"
              dataHelpId="field-requirements"
            >
              <Textarea 
                id="requirements"
                placeholder="Liste os requisitos técnicos, qualificações necessárias, certificações, etc..."
                rows={4}
                value={formData.requirements}
                onChange={(e) => handleFieldChange("requirements", e.target.value)}
              />
            </FormField>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <FormField
                  label="Critérios Técnicos"
                  helpText="Defina os critérios técnicos para avaliação das propostas. Mínimo de 30 caracteres."
                  error={fieldErrors.technical_criteria}
                  success={formData.technical_criteria.length >= 30}
                  required
                  htmlFor="technical_criteria"
                  dataHelpId="field-technical-criteria"
                >
                  <Textarea 
                    id="technical_criteria"
                    placeholder="Defina os critérios técnicos para avaliação das propostas..."
                    rows={4}
                    value={formData.technical_criteria}
                    onChange={(e) => handleFieldChange("technical_criteria", e.target.value)}
                    className={fieldErrors.technical_criteria ? "border-destructive" : formData.technical_criteria.length >= 30 ? "border-success" : ""}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.technical_criteria.length}/30 caracteres mínimos
                  </p>
                </FormField>
                
                <FormField
                  label="Peso Técnico (%)"
                  helpText="Defina o peso percentual para os critérios técnicos"
                  htmlFor="technical_weight"
                  dataHelpId="field-technical-weight"
                >
                  <Input 
                    id="technical_weight"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.technical_weight}
                    onChange={(e) => handleFieldChange("technical_weight", parseInt(e.target.value) || 0)}
                  />
                </FormField>
              </div>
              
              <div className="space-y-4">
                <FormField
                  label="Critérios de Experiência"
                  helpText="Defina os critérios de experiência e qualificação. Mínimo de 20 caracteres."
                  error={fieldErrors.experience_criteria}
                  success={formData.experience_criteria.length >= 20}
                  required
                  htmlFor="experience_criteria"
                  dataHelpId="field-experience-criteria"
                >
                  <Textarea 
                    id="experience_criteria"
                    placeholder="Defina os critérios de experiência e qualificação..."
                    rows={4}
                    value={formData.experience_criteria}
                    onChange={(e) => handleFieldChange("experience_criteria", e.target.value)}
                    className={fieldErrors.experience_criteria ? "border-destructive" : formData.experience_criteria.length >= 20 ? "border-success" : ""}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.experience_criteria.length}/20 caracteres mínimos
                  </p>
                </FormField>
                
                <FormField
                  label="Peso Experiência (%)"
                  helpText="Defina o peso percentual para os critérios de experiência"
                  htmlFor="experience_weight"
                  dataHelpId="field-experience-weight"
                >
                  <Input 
                    id="experience_weight"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.experience_weight}
                    onChange={(e) => handleFieldChange("experience_weight", parseInt(e.target.value) || 0)}
                  />
                </FormField>
              </div>
            </div>
            
            {(formData.technical_weight + formData.experience_weight !== 100) && (
              <div className="flex items-center gap-2 p-3 bg-accent/10 border border-accent rounded-lg animate-in fade-in">
                <AlertCircle className="h-4 w-4 text-accent-foreground" />
                <span className="text-sm text-accent-foreground">
                  A soma dos pesos deve ser igual a 100% (atual: {formData.technical_weight + formData.experience_weight}%)
                </span>
              </div>
            )}
            
            {(formData.technical_weight + formData.experience_weight === 100) && (
              <div className="flex items-center gap-2 p-3 bg-success/10 border border-success rounded-lg animate-in fade-in">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <span className="text-sm text-success-foreground">
                  Perfeito! A soma dos pesos está correta (100%)
                </span>
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Prazo de Execução"
                helpText="Informe o prazo estimado para execução do projeto"
                error={fieldErrors.duration}
                success={!!formData.duration}
                required
                htmlFor="duration"
                dataHelpId="field-duration"
              >
                <Input 
                  id="duration"
                  placeholder="Ex: 120 dias"
                  value={formData.duration}
                  onChange={(e) => handleFieldChange("duration", e.target.value)}
                  className={fieldErrors.duration ? "border-destructive" : formData.duration ? "border-success" : ""}
                />
              </FormField>
              
              <FormField
                label="Estimativa Orçamentária"
                helpText="Informe o valor estimado para o projeto"
                error={fieldErrors.budget}
                success={!!formData.budget}
                required
                htmlFor="budget"
                dataHelpId="field-budget"
              >
                <Input 
                  id="budget"
                  placeholder="Ex: R$ 500.000,00"
                  value={formData.budget}
                  onChange={(e) => handleFieldChange("budget", e.target.value)}
                  className={fieldErrors.budget ? "border-destructive" : formData.budget ? "border-success" : ""}
                />
              </FormField>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-primary/5 to-accent/5 p-6 rounded-lg border-2 border-primary/20">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">Resumo do Termo de Referência</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-3">
                  <div className="bg-card p-3 rounded border">
                    <strong className="text-muted-foreground">Título:</strong>
                    <p className="mt-1">{formData.title || "Não informado"}</p>
                  </div>
                  <div className="bg-card p-3 rounded border">
                    <strong className="text-muted-foreground">Tipo:</strong>
                    <p className="mt-1">{formData.type || "Não informado"}</p>
                  </div>
                  <div className="bg-card p-3 rounded border">
                    <strong className="text-muted-foreground">Template:</strong>
                    <p className="mt-1">{
                      formData.template_id 
                        ? templates?.find(t => t.id === formData.template_id)?.title || "Template selecionado"
                        : "Não selecionado"
                    }</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-card p-3 rounded border">
                    <strong className="text-muted-foreground">Prazo:</strong>
                    <p className="mt-1">{formData.duration || "Não informado"}</p>
                  </div>
                  <div className="bg-card p-3 rounded border">
                    <strong className="text-muted-foreground">Orçamento:</strong>
                    <p className="mt-1">{formData.budget || "Não informado"}</p>
                  </div>
                  <div className="bg-card p-3 rounded border">
                    <strong className="text-muted-foreground">Pesos:</strong>
                    <p className="mt-1">Técnico: {formData.technical_weight}% | Experiência: {formData.experience_weight}%</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 bg-card p-3 rounded border">
                <strong className="text-muted-foreground">Descrição:</strong>
                <p className="mt-1 text-sm">{formData.description || "Não informado"}</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HelpTour />
      
      <main className="max-w-5xl mx-auto p-6 animate-fade-in space-y-6">
        <Breadcrumbs />
        
        <SectionHeader
          icon={FileText}
          title="Criar Termo de Referência"
          description="Siga os passos para criar um TR completo conforme diretrizes do BID"
          badge="Novo TR"
        />
        
        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" asChild className="hover:bg-muted/50">
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <AIGenerationDialog
              onGenerate={handleGenerateWithAI}
              isGenerating={generateWithAI.isPending}
              disabled={!formData.template_id}
              data-help-id="ai-generate-button"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleStartTour}
              title="Iniciar tour guiado"
            >
              <PlayCircle className="h-4 w-4 mr-2" />
              Tour Guiado
            </Button>
            <HelpDrawer onStartTour={handleStartTour} data-help-id="help-drawer" />
            <AutoSaveIndicator status={status} lastSaved={lastSaved} data-help-id="autosave-indicator" />
          </div>
        </div>

        {/* Progress Indicator */}
        <ProgressIndicator 
          steps={steps.map(step => ({
            ...step,
            progress: getStepProgress(step.id, formData),
            completed: validateStep(step.id, formData).success
          }))} 
          currentStep={currentStep} 
          onStepClick={handleStepClick}
          className="mb-8"
          data-help-id="progress-indicator"
        />

        <Card className="shadow-md animate-scale-in">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <span className="text-primary font-semibold">{currentStep}</span>
              </div>
              <div>
                <CardTitle className="text-xl">{steps[currentStep - 1].title}</CardTitle>
                <CardDescription className="text-base mt-1">
                  {steps[currentStep - 1].description}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-0">
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
          <Button 
            variant="outline" 
            onClick={handlePrevious} 
            disabled={currentStep === 1}
            className="hover-scale w-full sm:w-auto"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Anterior
          </Button>
          
          <div className="flex-1 flex justify-center">
            {!canProceed && Object.keys(fieldErrors).length > 0 && (
              <div className="flex items-center gap-2 text-sm text-destructive animate-in fade-in">
                <AlertCircle className="h-4 w-4" />
                <span>Corrija os erros antes de continuar</span>
              </div>
            )}
            {!canProceed && Object.keys(fieldErrors).length === 0 && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground animate-in fade-in">
                <AlertCircle className="h-4 w-4" />
                <span>Preencha todos os campos obrigatórios</span>
              </div>
            )}
          </div>
          
          {currentStep === steps.length ? (
            <Button 
              className="bg-success hover:bg-success/90 hover-scale w-full sm:w-auto"
              disabled={!canProceed || isSubmitting}
              onClick={handleFinalizeTR}
            >
              <FileText className="h-4 w-4 mr-2" />
              {isSubmitting ? "Enviando..." : "Finalizar TR"}
            </Button>
          ) : (
            <Button 
              onClick={handleNext} 
              className="hover-scale w-full sm:w-auto"
              disabled={!canProceed}
              data-help-id="next-button"
            >
              Próximo
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </main>
      
      <HelpTour />
    </div>
  );
};

export default CreateTR;