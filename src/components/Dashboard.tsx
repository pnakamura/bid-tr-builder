import { useState } from "react";
import { Plus, FileText, Upload, Eye, BarChart3, Clock, CheckCircle, Zap, Target, ExternalLink, FolderKanban, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/EmptyState";
import { StatCard } from "@/components/ui/stat-card";
import { SectionHeader } from "@/components/ui/section-header";
import { ActionCard } from "@/components/ui/action-card";
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
      <div className="p-6 space-y-8">
        {/* Hero Section */}
        <SectionHeader
          icon={Target}
          title="Sistema de Termos de Referência"
          description="Plataforma integrada para criação, gestão e acompanhamento de Termos de Referência conforme diretrizes do BID e legislação brasileira."
          badge="BID"
        />

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-3">
          <ActionCard
            title="Criar Novo TR"
            description="Inicie um novo Termo de Referência com templates personalizados"
            icon={Plus}
            href="/create-tr"
            variant="primary"
          />
          <ActionCard
            title="Gerenciar Templates"
            description="Visualize e gerencie os templates disponíveis"
            icon={FileText}
            href="/templates"
            variant="secondary"
          />
          <ActionCard
            title="Gerenciar Programas"
            description="Configure e organize os programas do sistema"
            icon={FolderKanban}
            href="/programas"
            variant="accent"
          />
        </div>

        {/* Statistics Cards */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Estatísticas em Tempo Real</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {isLoading ? (
              [...Array(4)].map((_, i) => (
                <Card key={i} className="p-6">
                  <Skeleton className="h-24 w-full" />
                </Card>
              ))
            ) : (
              <>
                <StatCard
                  title="Total de TRs"
                  value={stats?.total || 0}
                  description="Termos criados no sistema"
                  icon={FileText}
                  variant="primary"
                />
                <StatCard
                  title="Processando"
                  value={stats?.processando || 0}
                  description="Em processamento"
                  icon={Clock}
                  variant="warning"
                />
                <StatCard
                  title="Concluídos"
                  value={stats?.concluidos || 0}
                  description="Finalizados com sucesso"
                  icon={CheckCircle}
                  variant="success"
                  trend={stats?.total ? {
                    value: Math.round((stats.concluidos / stats.total) * 100),
                    isPositive: true
                  } : undefined}
                />
                <StatCard
                  title="Com Erro"
                  value={stats?.erros || 0}
                  description="Necessitam atenção"
                  icon={AlertTriangle}
                  variant="destructive"
                />
              </>
            )}
          </div>
        </div>

        {/* Recent TRs */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Termos de Referência Recentes</h2>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link to="/meus-trs">
                Ver Todos
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <Card className="overflow-hidden">
            <CardContent className="p-6">{isLoadingTRs ? (
                <div className="space-y-3">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ) : trs && trs.length > 0 ? (
                <div className="space-y-3">{trs.slice(0, 5).map((tr) => (
                    <div
                      key={tr.id}
                      className="p-4 border rounded-lg hover:bg-muted/50 transition-all duration-200"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <Link to="/meus-trs" className="flex-1 min-w-0 hover:opacity-80">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-sm truncate">{tr.title}</h4>
                            <code className="text-[10px] font-mono text-muted-foreground bg-muted px-1 py-0.5 rounded">
                              {tr.id.substring(0, 8)}
                            </code>
                          </div>
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
                        </Link>
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
                    </div>
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