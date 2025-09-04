import { useState } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ArrowRight, FileText, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";

const steps = [
  { id: 1, title: "Informações Básicas", description: "Dados gerais do termo de referência" },
  { id: 2, title: "Especificações Técnicas", description: "Detalhes técnicos e requisitos" },
  { id: 3, title: "Critérios de Avaliação", description: "Definição dos critérios de seleção" },
  { id: 4, title: "Cronograma e Valores", description: "Prazos e estimativas orçamentárias" },
  { id: 5, title: "Revisão Final", description: "Validação e finalização do documento" }
];

const CreateTR = () => {
  const [currentStep, setCurrentStep] = useState(1);
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

  const navigate = useNavigate();

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
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
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="type">Tipo de Contratação *</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
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
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="objective">Objetivo da Contratação *</Label>
              <Textarea 
                id="objective"
                placeholder="Defina os objetivos específicos que se pretende alcançar..."
                rows={3}
                value={formData.objective}
                onChange={(e) => setFormData({...formData, objective: e.target.value})}
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
                onChange={(e) => setFormData({...formData, scope: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="requirements">Requisitos Técnicos</Label>
              <Textarea 
                id="requirements"
                placeholder="Liste os requisitos técnicos, qualificações necessárias, certificações, etc..."
                rows={4}
                value={formData.requirements}
                onChange={(e) => setFormData({...formData, requirements: e.target.value})}
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
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="budget">Estimativa Orçamentária</Label>
                <Input 
                  id="budget"
                  placeholder="Ex: R$ 500.000,00"
                  value={formData.budget}
                  onChange={(e) => setFormData({...formData, budget: e.target.value})}
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate("/")} className="p-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Novo Termo de Referência</h1>
              <p className="text-muted-foreground">Siga as etapas para criar seu TR</p>
            </div>
          </div>
          <Button variant="outline">
            <Save className="h-4 w-4 mr-2" />
            Salvar Rascunho
          </Button>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 
                  ${currentStep >= step.id 
                    ? 'bg-primary border-primary text-primary-foreground' 
                    : 'border-muted-foreground text-muted-foreground'}`}>
                  {step.id}
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-0.5 w-16 ml-2 ${currentStep > step.id ? 'bg-primary' : 'bg-muted'}`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h2 className="text-lg font-medium">{steps[currentStep - 1].title}</h2>
            <p className="text-muted-foreground">{steps[currentStep - 1].description}</p>
          </div>
        </div>

        {/* Form Content */}
        <Card>
          <CardHeader>
            <CardTitle>Etapa {currentStep} de {steps.length}</CardTitle>
          </CardHeader>
          <CardContent>
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Anterior
          </Button>
          
          {currentStep === steps.length ? (
            <Button className="bg-success hover:bg-success/90">
              <FileText className="h-4 w-4 mr-2" />
              Finalizar TR
            </Button>
          ) : (
            <Button onClick={handleNext}>
              Próximo
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </main>
    </div>
  );
};

export default CreateTR;