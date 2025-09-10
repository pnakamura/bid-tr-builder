import { Header } from "@/components/Header";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { AutoSaveIndicator } from "@/components/AutoSaveIndicator";
import { useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, FileText, Save, ArrowLeft, AlertCircle } from "lucide-react";
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
  const sendToN8N = useSendToN8N();
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    template_id: "",
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

  // Load saved data from localStorage on component mount
  const [initialLoad, setInitialLoad] = useState(true);
  
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
  useState(() => {
    if (initialLoad) {
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
      setInitialLoad(false);
    }
  });

  // Validation for current step
  const currentStepValidation = validateStep(currentStep, formData);
  const canProceed = currentStepValidation.success;

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
  };

  const handleStepClick = (stepId: number) => {
    setCurrentStep(stepId);
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
      await sendToN8N.mutateAsync({
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
        },
        template_id: formData.template_id
      });

      // Clear saved draft after successful submission
      localStorage.removeItem('tr-draft');
      
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
              <div>
                <Label htmlFor="title">Título do Termo de Referência *</Label>
                <Input 
                  id="title"
                  placeholder="Ex: Consultoria para Sistema de Gestão"
                  value={formData.title}
                  onChange={(e) => handleFieldChange("title", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="type">Tipo de Contratação *</Label>
                <Select value={formData.type} onValueChange={(value) => handleFieldChange("type", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="obras">Obras e Serviços de Engenharia</SelectItem>
                    <SelectItem value="consultoria">Consultorias e Serviços Técnicos</SelectItem>
                    <SelectItem value="equipamentos">Equipamentos e Materiais</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="template_id">Template a ser Seguido *</Label>
              <Select value={formData.template_id} onValueChange={(value) => handleFieldChange("template_id", value)}>
                <SelectTrigger>
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
                <p className="text-sm text-muted-foreground mt-1">
                  {templates.find(t => t.id === formData.template_id)?.description}
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="description">Descrição Geral *</Label>
              <Textarea 
                id="description"
                placeholder="Descreva brevemente o objeto da contratação..."
                rows={4}
                value={formData.description}
                onChange={(e) => handleFieldChange("description", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="objective">Objetivo da Contratação *</Label>
              <Textarea 
                id="objective"
                placeholder="Defina os objetivos específicos que se pretende alcançar..."
                rows={3}
                value={formData.objective}
                onChange={(e) => handleFieldChange("objective", e.target.value)}
              />
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="scope">Escopo dos Serviços *</Label>
              <Textarea 
                id="scope"
                placeholder="Detalhe o escopo completo dos serviços a serem executados..."
                rows={6}
                value={formData.scope}
                onChange={(e) => handleFieldChange("scope", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="requirements">Requisitos Técnicos</Label>
              <Textarea 
                id="requirements"
                placeholder="Liste os requisitos técnicos, qualificações necessárias, certificações, etc..."
                rows={4}
                value={formData.requirements}
                onChange={(e) => handleFieldChange("requirements", e.target.value)}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="technical_criteria">Critérios Técnicos *</Label>
                  <Textarea 
                    id="technical_criteria"
                    placeholder="Defina os critérios técnicos para avaliação das propostas..."
                    rows={4}
                    value={formData.technical_criteria}
                    onChange={(e) => handleFieldChange("technical_criteria", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="technical_weight">Peso Técnico (%)</Label>
                  <Input 
                    id="technical_weight"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.technical_weight}
                    onChange={(e) => handleFieldChange("technical_weight", parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="experience_criteria">Critérios de Experiência *</Label>
                  <Textarea 
                    id="experience_criteria"
                    placeholder="Defina os critérios de experiência e qualificação..."
                    rows={4}
                    value={formData.experience_criteria}
                    onChange={(e) => handleFieldChange("experience_criteria", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="experience_weight">Peso Experiência (%)</Label>
                  <Input 
                    id="experience_weight"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.experience_weight}
                    onChange={(e) => handleFieldChange("experience_weight", parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
            </div>
            
            {(formData.technical_weight + formData.experience_weight !== 100) && (
              <div className="flex items-center gap-2 p-3 bg-warning/10 border border-warning/20 rounded-lg">
                <AlertCircle className="h-4 w-4 text-warning" />
                <span className="text-sm text-warning">
                  A soma dos pesos deve ser igual a 100% (atual: {formData.technical_weight + formData.experience_weight}%)
                </span>
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="duration">Prazo de Execução</Label>
                <Input 
                  id="duration"
                  placeholder="Ex: 120 dias"
                  value={formData.duration}
                  onChange={(e) => handleFieldChange("duration", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="budget">Estimativa Orçamentária</Label>
                <Input 
                  id="budget"
                  placeholder="Ex: R$ 500.000,00"
                  value={formData.budget}
                  onChange={(e) => handleFieldChange("budget", e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="bg-muted p-6 rounded-lg">
              <h3 className="font-medium mb-4">Resumo do Termo de Referência</h3>
              <div className="space-y-3 text-sm">
                <div><strong>Título:</strong> {formData.title || "Não informado"}</div>
                <div><strong>Tipo:</strong> {formData.type || "Não informado"}</div>
                <div><strong>Template:</strong> {
                  formData.template_id 
                    ? templates?.find(t => t.id === formData.template_id)?.title || "Template selecionado"
                    : "Não selecionado"
                }</div>
                <div><strong>Descrição:</strong> {formData.description || "Não informado"}</div>
                <div><strong>Prazo:</strong> {formData.duration || "Não informado"}</div>
                <div><strong>Orçamento:</strong> {formData.budget || "Não informado"}</div>
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
      <Breadcrumbs />
      
      <main className="max-w-5xl mx-auto p-6 animate-fade-in">
        {/* Header Section with Auto-save */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild className="hover:bg-muted/50">
                <Link to="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Criar Termo de Referência
                </h1>
                <p className="text-muted-foreground mt-1">
                  Siga os passos para criar um TR completo conforme diretrizes do BID
                </p>
              </div>
            </div>
            <AutoSaveIndicator status={status} lastSaved={lastSaved} />
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
        <div className="flex justify-between mt-8">
          <Button 
            variant="outline" 
            onClick={handlePrevious} 
            disabled={currentStep === 1}
            className="hover-scale"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Anterior
          </Button>
          
          {currentStep === steps.length ? (
            <Button 
              className="bg-success hover:bg-success/90 hover-scale"
              disabled={!canProceed || isSubmitting}
              onClick={handleFinalizeTR}
            >
              <FileText className="h-4 w-4 mr-2" />
              {isSubmitting ? "Enviando..." : "Finalizar TR"}
            </Button>
          ) : (
            <Button 
              onClick={handleNext} 
              className="hover-scale"
              disabled={!canProceed}
            >
              Próximo
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          )}
          
          {!canProceed && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <AlertCircle className="h-4 w-4" />
              Preencha todos os campos obrigatórios
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CreateTR;