import { useState } from "react";
import { Plus, FileText, Upload, Eye, BarChart3, Clock, CheckCircle, Zap, Target, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/EmptyState";
import { useTRStats } from "@/hooks/useTRStats";
import { useMeusTRs } from "@/hooks/useMeusTRs";
import { TemplateUploadDialog } from "@/components/TemplateUploadDialog";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export const Dashboard = () => {
  const { stats, isLoading } = useTRStats();
  const { trs, isLoading: isLoadingTRs } = useMeusTRs();

  return (
    <div className="animate-fade-in">
      <div className="p-6 space-y-6">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-lg p-8 border shadow-sm hover:shadow-md transition-all duration-300">
          <div className="max-w-4xl">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Sistema de Termos de Referência
                </h1>
                <p className="text-lg text-muted-foreground">
                  Plataforma integrada para criação, gestão e acompanhamento de Termos de Referência
                  conforme diretrizes do BID e legislação brasileira.
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="shadow-md hover:shadow-lg transition-all duration-200 hover-scale">
                <Link to="/create-tr">
                  <Plus className="mr-2 h-5 w-5" />
                  Novo Termo de Referência
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="hover-scale transition-all duration-200">
                <Link to="/templates">
                  <FileText className="mr-2 h-5 w-5" />
                  Templates
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="hover-scale transition-all duration-200">
                <Link to="/reports">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Relatórios
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Total de TRs",
              value: isLoading ? "..." : (stats?.total || 0),
              description: isLoading ? "Carregando..." : `${stats?.total || 0} TRs criados`,
              icon: FileText,
              color: "text-primary",
              bgColor: "bg-primary/10"
            },
            {
              title: "Processando",
              value: isLoading ? "..." : (stats?.processando || 0),
              description: isLoading ? "Carregando..." : `${stats?.processando || 0} em processamento`,
              icon: Clock,
              color: "text-yellow-600",
              bgColor: "bg-yellow-100"
            },
            {
              title: "Concluídos",
              value: isLoading ? "..." : (stats?.concluidos || 0),
              description: isLoading ? "Carregando..." : `${stats?.concluidos || 0} finalizados`,
              icon: CheckCircle,
              color: "text-success",
              bgColor: "bg-success/10"
            },
            {
              title: "Com Erro",
              value: isLoading ? "..." : (stats?.erros || 0),
              description: isLoading ? "Carregando..." : `${stats?.erros || 0} com erro`,
              icon: FileText,
              color: "text-destructive",
              bgColor: "bg-destructive/10"
            }
          ].map((stat, index) => (
            <Card key={stat.title} className="hover:shadow-md transition-all duration-300 hover-scale border-l-4 border-l-transparent hover:border-l-primary">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions and Recent TRs */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Quick Actions */}
          <Card className="lg:col-span-1 hover:shadow-md transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Ações Rápidas
              </CardTitle>
              <CardDescription>Acesso direto às funcionalidades principais</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start hover:bg-primary/5 transition-all duration-200 hover-scale"
                asChild
              >
                <Link to="/create-tr">
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Termo de Referência
                </Link>
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start hover:bg-primary/5 transition-all duration-200 hover-scale"
                asChild
              >
                <Link to="/templates">
                  <FileText className="mr-2 h-4 w-4" />
                  Ver Templates
                </Link>
              </Button>
              
              <TemplateUploadDialog>
                <Button
                  variant="outline"
                  className="w-full justify-start hover:bg-primary/5 transition-all duration-200 hover-scale"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Importar Template
                </Button>
              </TemplateUploadDialog>
              
              <Button
                variant="outline"
                className="w-full justify-start hover:bg-primary/5 transition-all duration-200 hover-scale"
                asChild
              >
                <Link to="/meus-trs">
                  <Eye className="mr-2 h-4 w-4" />
                  Ver Meus TRs
                </Link>
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start hover:bg-primary/5 transition-all duration-200 hover-scale"
                asChild
              >
                <Link to="/reports">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Ver Relatórios
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Recent TRs */}
          <Card className="lg:col-span-2 hover:shadow-md transition-all duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    TRs Recentes
                  </CardTitle>
                  <CardDescription>Últimos documentos atualizados</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingTRs ? (
                <div className="space-y-3">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ) : trs && trs.length > 0 ? (
                <div className="space-y-3">
                  {trs.slice(0, 5).map((tr) => (
                    <Link
                      key={tr.id}
                      to="/meus-trs"
                      className="block p-4 border rounded-lg hover:bg-muted/50 transition-all duration-200 hover-scale"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm mb-1 truncate">{tr.title}</h4>
                          <p className="text-xs text-muted-foreground mb-2 line-clamp-1">{tr.description}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>
                              {formatDistanceToNow(new Date(tr.created_at), {
                                addSuffix: true,
                                locale: ptBR
                              })}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge
                            variant={
                              tr.status === 'concluido' ? 'default' :
                              tr.status === 'processando' ? 'secondary' :
                              'destructive'
                            }
                            className="text-xs"
                          >
                            {tr.status === 'concluido' ? 'Concluído' :
                             tr.status === 'processando' ? 'Processando' :
                             'Erro'}
                          </Badge>
                          {tr.google_docs_url && (
                            <Button size="sm" variant="ghost" className="h-6 px-2" asChild>
                              <a href={tr.google_docs_url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={FileText}
                  title="Nenhum TR cadastrado"
                  description="Comece criando seu primeiro Termo de Referência usando um dos templates disponíveis."
                  actionLabel="Criar Primeiro TR"
                  actionHref="/create-tr"
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};