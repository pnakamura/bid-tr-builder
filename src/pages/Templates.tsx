import React, { useState } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye, Download, Star, Calendar, FileText, Plus, Trash2, Edit, File, Search } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { TemplateUploadDialog } from "@/components/TemplateUploadDialog";
import { useTemplates, useDownloadTemplate, useDeleteTemplate, type Template, formatFileSize } from "@/hooks/useTemplates";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { HelpDrawer } from "@/components/HelpDrawer";
import { HelpTour } from "@/components/HelpTour";
import { useHelp } from "@/contexts/HelpContext";
import { templatesHelpSteps } from "@/config/templatesHelpSteps";
import { Link } from "react-router-dom";
import { SectionHeader } from "@/components/ui/section-header";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Templates = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const { user } = useAuth();
  const { startHelp } = useHelp();

  const { templates, isLoading } = useTemplates({
    search: searchTerm,
    category: selectedCategory,
    type: selectedType
  });

  const downloadTemplate = useDownloadTemplate();
  const deleteTemplate = useDeleteTemplate();

  const handleDownload = (template: Template) => {
    downloadTemplate.mutate(template);
  };

  const handleDelete = (templateId: string) => {
    deleteTemplate.mutate(templateId);
  };

  const canDeleteTemplate = (template: Template) => {
    return template.created_by === user?.id || user?.role === 'admin';
  };

  const handleStartTour = () => {
    startHelp(templatesHelpSteps);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HelpTour />
      <div className="container mx-auto px-4 py-8 space-y-8">
        <Breadcrumbs />
        
        <div className="flex justify-end">
          <HelpDrawer onStartTour={handleStartTour} />
        </div>
        
        <SectionHeader
          icon={FileText}
          title="Templates de Termos de Referência"
          description="Acesse nossa biblioteca de templates padronizados para criar Termos de Referência eficientes e em conformidade com as normas vigentes."
          badge="Biblioteca"
        />

        {/* Search and Filters */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow" data-help-id="templates-filters">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-primary" />
                  Buscar Templates
                </CardTitle>
                <CardDescription>
                  Use os filtros abaixo para encontrar o template ideal para seu projeto
                </CardDescription>
              </div>
              <TemplateUploadDialog>
                <Button data-help-id="upload-template-button" className="shadow-md hover:shadow-lg transition-all">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Template
                </Button>
              </TemplateUploadDialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                placeholder="Buscar por título ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as categorias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  <SelectItem value="Infraestrutura">Infraestrutura</SelectItem>
                  <SelectItem value="Tecnologia">Tecnologia</SelectItem>
                  <SelectItem value="Consultoria">Consultoria</SelectItem>
                  <SelectItem value="Obras">Obras</SelectItem>
                  <SelectItem value="Serviços">Serviços</SelectItem>
                  <SelectItem value="Aquisições">Aquisições</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="Básico">Básico</SelectItem>
                  <SelectItem value="Intermediário">Intermediário</SelectItem>
                  <SelectItem value="Avançado">Avançado</SelectItem>
                  <SelectItem value="Especializado">Especializado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Templates Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="flex gap-2 mt-3">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-8 flex-1" />
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.length > 0 ? (
              templates.map((template, index) => (
                <Card 
                  key={template.id} 
                  className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-border/50"
                  data-help-id={`template-card-${index}`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2 group-hover:text-primary transition-colors">
                          {template.title}
                          {template.downloads > 50 && (
                            <Badge variant="secondary" className="ml-2">
                              Popular
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription className="text-sm line-clamp-2">
                          {template.description || 'Sem descrição'}
                        </CardDescription>
                      </div>
                      {canDeleteTemplate(template) && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir Template</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir o template "{template.title}"? 
                                Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDelete(template.id)}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Badge variant="outline">{template.category}</Badge>
                      <Badge variant="outline">{template.type}</Badge>
                      {template.is_public ? (
                        <Badge variant="secondary">Público</Badge>
                      ) : (
                        <Badge variant="outline">Privado</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* File Information Section */}
                    {template.file_path && (
                      <div className="mb-4 p-3 bg-muted/50 rounded-md">
                        <div className="flex items-center gap-2 mb-2">
                          <File className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium text-foreground">Arquivo Disponível</span>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <Badge variant="secondary" className="text-xs">
                            {template.file_type?.split('/')[1]?.toUpperCase() || 'DOCX'}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {formatFileSize(template.file_size)}
                          </Badge>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(template.updated_at), 'dd/MM/yyyy', { locale: ptBR })}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Download className="h-4 w-4" />
                          {template.downloads}
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mb-3">
                      Por: {template.creator_name}
                    </div>
                    <div className="flex gap-2">
                      <Link to={`/create-tr?template=${template.id}`} className="flex-1">
                        <Button 
                          size="sm" 
                          className="w-full"
                          data-help-id={`use-template-${index}`}
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Usar Template
                        </Button>
                      </Link>
                      {template.file_path ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleDownload(template)}
                                disabled={downloadTemplate.isPending}
                                data-help-id={`download-template-${index}`}
                                className="relative"
                              >
                                {downloadTemplate.isPending ? (
                                  <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <Download className="h-4 w-4" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Baixar arquivo do template</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="outline"
                                disabled
                              >
                                <Download className="h-4 w-4 opacity-50" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Arquivo não disponível</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum template encontrado</h3>
                <p className="text-muted-foreground">
                  Tente ajustar os filtros ou termos de busca
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Templates;