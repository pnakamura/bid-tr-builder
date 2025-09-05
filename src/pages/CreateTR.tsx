import { Header } from "@/components/Header";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { AutoSaveIndicator } from "@/components/AutoSaveIndicator";
import { useState } from "react";
import { ChevronLeft, ChevronRight, FileText, Save, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const steps = [
  { id: 1, title: "Informações Básicas", description: "Dados gerais do termo de referência" },
  { id: 2, title: "Especificações Técnicas", description: "Detalhes técnicos e requisitos" },
  { id: 3, title: "Critérios de Avaliação", description: "Definição dos critérios de seleção" },
  { id: 4, title: "Cronograma e Valores", description: "Prazos e estimativas orçamentárias" },
  { id: 5, title: "Revisão Final", description: "Validação e finalização do documento" }
];

const CreateTR = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "error" | "pending">("saved");
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    description: "",
    objective: "",
    scope: "",
    duration: "",
    budget: "",
    requirements: ""
  });

  const handleNext = () => {
    if (currentStep < steps.length) {
      setSaveStatus("saving");
      // Simulate save
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setSaveStatus("saved");
        toast({
          title: "Progresso salvo",
          description: `Etapa ${currentStep} concluída com sucesso.`,
        });
      }, 1000);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setSaveStatus("pending");
    
    // Simulate auto-save after 2 seconds
    setTimeout(() => {
      setSaveStatus("saving");
      setTimeout(() => {
        setSaveStatus("saved");
      }, 800);
    }, 2000);
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
            <div className="text-center py-8">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Critérios de Avaliação</h3>
              <p className="text-muted-foreground">
                Esta seção será implementada na próxima versão com templates específicos do BID
              </p>
            </div>
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
            <AutoSaveIndicator status={saveStatus} />
          </div>
        </div>

        {/* Progress Indicator */}
        <ProgressIndicator 
          steps={steps} 
          currentStep={currentStep} 
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
            <Button className="bg-success hover:bg-success/90 hover-scale">
              <FileText className="h-4 w-4 mr-2" />
              Finalizar TR
            </Button>
          ) : (
            <Button onClick={handleNext} className="hover-scale">
              Próximo
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </main>
    </div>
  );
};

export default CreateTR;