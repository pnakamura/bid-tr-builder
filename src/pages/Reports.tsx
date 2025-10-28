import { useState } from "react";
import { Header } from "@/components/Header";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/EmptyState";
import { useReportsData } from "@/hooks/useReportsData";
import { useAllProgramas } from "@/hooks/useAllProgramas";
import { useToast } from "@/hooks/use-toast";
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Calendar, 
  Download, 
  FileText,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("last-month");
  const [selectedProgram, setSelectedProgram] = useState("all");
  const { toast } = useToast();
  const { data: programas } = useAllProgramas();
  
  const { stats, trsByCategory, trsByMonth, templateUsage, recentActivities, programStats, isLoading } = useReportsData(
    selectedPeriod,
    selectedProgram
  );

  const handleExportReport = () => {
    toast({
      title: "Exportação Iniciada",
      description: "Seu relatório será baixado em breve.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Breadcrumbs />
      <main className="animate-fade-in">
        <div className="p-6 space-y-6">
          {/* Header Section */}
          <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-lg p-8 border shadow-sm">
            <div className="max-w-4xl">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <BarChart3 className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    Relatórios e Analytics
                  </h1>
                  <p className="text-lg text-muted-foreground">
                    Acompanhe o desempenho, produtividade e indicadores do sistema de 
                    Termos de Referência em tempo real.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last-week">Última Semana</SelectItem>
                    <SelectItem value="last-month">Último Mês</SelectItem>
                    <SelectItem value="last-quarter">Último Trimestre</SelectItem>
                    <SelectItem value="last-year">Último Ano</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedProgram} onValueChange={setSelectedProgram}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Programa" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Programas</SelectItem>
                    {programas && programas.map((programa: any) => (
                      <SelectItem key={programa.id} value={programa.id}>
                        {programa.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button variant="outline" className="hover-scale" onClick={handleExportReport}>
                  <Download className="mr-2 h-4 w-4" />
                  Exportar Relatório
                </Button>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
              {[...Array(5)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="pt-6">
                    <div className="animate-pulse space-y-2">
                      <div className="h-4 bg-muted rounded w-20" />
                      <div className="h-8 bg-muted rounded w-16" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
              {[
                {
                  title: "Total de TRs",
                  value: stats.totalTRs,
                  change: "Total criados",
                  icon: FileText,
                  color: "text-primary",
                  bgColor: "bg-primary/10"
                },
                {
                  title: "Processando",
                  value: stats.processando,
                  change: "Em andamento",
                  icon: Clock,
                  color: "text-yellow-600",
                  bgColor: "bg-yellow-100"
                },
                {
                  title: "Concluídos",
                  value: stats.concluidos,
                  change: "Finalizados",
                  icon: CheckCircle,
                  color: "text-success",
                  bgColor: "bg-success/10"
                },
                {
                  title: "Com Erro",
                  value: stats.erros,
                  change: "Falharam",
                  icon: AlertTriangle,
                  color: "text-destructive",
                  bgColor: "bg-destructive/10"
                },
                {
                  title: "Templates",
                  value: stats.totalTemplates,
                  change: "Disponíveis",
                  icon: BarChart3,
                  color: "text-accent-foreground",
                  bgColor: "bg-accent/20"
                }
              ].map((metric) => (
                <Card key={metric.title} className="hover:shadow-md transition-all duration-300 hover-scale">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                    <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                      <metric.icon className={`h-4 w-4 ${metric.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold mb-1">{metric.value}</div>
                    <p className="text-xs text-muted-foreground">
                      {metric.change}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Detailed Reports */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="programs">Programas</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="activity">Atividade</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {stats.totalTRs > 0 ? (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <PieChart className="h-5 w-5" />
                        Visão Geral
                      </CardTitle>
                      <CardDescription>
                        Dados consolidados dos últimos {selectedPeriod === 'last-week' ? '7 dias' : 
                        selectedPeriod === 'last-month' ? '30 dias' : 
                        selectedPeriod === 'last-quarter' ? '90 dias' : '365 dias'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-4">
                          <div className="p-4 border rounded-lg bg-gradient-to-br from-primary/5 to-transparent">
                            <h4 className="font-medium mb-4 flex items-center gap-2">
                              <PieChart className="h-4 w-4 text-primary" />
                              TRs por Categoria
                            </h4>
                            {Object.keys(trsByCategory || {}).length > 0 ? (
                              <div className="space-y-3">
                                {Object.entries(trsByCategory || {}).map(([cat, count]) => (
                                  <div key={cat} className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">{cat}</span>
                                    <div className="flex items-center gap-2">
                                      <div className="h-2 bg-primary/20 rounded-full w-24">
                                        <div 
                                          className="h-2 bg-primary rounded-full transition-all" 
                                          style={{ width: `${(count as number / stats.totalTRs) * 100}%` }}
                                        />
                                      </div>
                                      <span className="font-medium text-sm w-8 text-right">{count as number}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground">Nenhuma categoria registrada</p>
                            )}
                          </div>

                          <div className="p-4 border rounded-lg bg-gradient-to-br from-success/5 to-transparent">
                            <h4 className="font-medium mb-4 flex items-center gap-2">
                              <TrendingUp className="h-4 w-4 text-success" />
                              Performance
                            </h4>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Taxa de Sucesso</span>
                                <span className="font-medium text-success">
                                  {((stats.concluidos / stats.totalTRs) * 100).toFixed(1)}%
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Taxa de Erro</span>
                                <span className="font-medium text-destructive">
                                  {((stats.erros / stats.totalTRs) * 100).toFixed(1)}%
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Em Processamento</span>
                                <span className="font-medium text-yellow-600">
                                  {stats.processando}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="p-4 border rounded-lg bg-gradient-to-br from-accent/5 to-transparent">
                            <h4 className="font-medium mb-4 flex items-center gap-2">
                              <FileText className="h-4 w-4 text-accent-foreground" />
                              Templates Mais Usados
                            </h4>
                            {Object.keys(templateUsage || {}).length > 0 ? (
                              <div className="space-y-3">
                                {Object.entries(templateUsage || {})
                                  .sort(([, a], [, b]) => (b as number) - (a as number))
                                  .slice(0, 5)
                                  .map(([temp, count], index) => (
                                    <div key={temp} className="flex items-center gap-3">
                                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium">
                                        {index + 1}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm truncate" title={temp}>{temp}</p>
                                      </div>
                                      <span className="font-medium text-sm">{count as number}x</span>
                                    </div>
                                  ))}
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground">Nenhum template usado ainda</p>
                            )}
                          </div>

                          <div className="p-4 border rounded-lg bg-gradient-to-br from-blue-500/5 to-transparent">
                            <h4 className="font-medium mb-4 flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-blue-600" />
                              Distribuição Temporal
                            </h4>
                            {Object.keys(trsByMonth || {}).length > 0 ? (
                              <div className="space-y-2">
                                {Object.entries(trsByMonth || {})
                                  .slice(-3)
                                  .map(([month, count]) => (
                                    <div key={month} className="flex justify-between items-center text-sm">
                                      <span className="text-muted-foreground">{month}</span>
                                      <span className="font-medium">{count as number} TRs</span>
                                    </div>
                                  ))}
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground">Nenhum dado temporal</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="h-5 w-5" />
                      Visão Geral
                    </CardTitle>
                    <CardDescription>Análise consolidada do sistema</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <EmptyState
                      icon={BarChart3}
                      title="Nenhum dado disponível"
                      description="Comece criando Termos de Referência para visualizar estatísticas e relatórios detalhados."
                      actionLabel="Criar TR"
                      actionHref="/create-tr"
                    />
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="programs" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Desempenho por Programa</CardTitle>
                  <CardDescription>Comparativo de produtividade</CardDescription>
                </CardHeader>
                <CardContent>
                  {programStats && programStats.length > 0 ? (
                    <div className="space-y-4">
                      {programStats.map((prog: any) => (
                        <div key={prog.name} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium">{prog.name}</h4>
                            <span className="text-sm text-muted-foreground">
                              Taxa de sucesso: {prog.successRate.toFixed(1)}%
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Total:</span>
                              <span className="ml-2 font-medium">{prog.total}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Concluídos:</span>
                              <span className="ml-2 font-medium text-success">{prog.concluidos}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Erros:</span>
                              <span className="ml-2 font-medium text-destructive">{prog.erros}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      icon={Users}
                      title="Sem dados de programas"
                      description="Os relatórios por programa serão exibidos quando houver TRs cadastrados no sistema."
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="timeline" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Timeline de Criação vs Finalização</CardTitle>
                  <CardDescription>Histórico de atividades</CardDescription>
                </CardHeader>
                <CardContent>
                  {Object.keys(trsByMonth || {}).length > 0 ? (
                    <div className="space-y-2">
                      {Object.entries(trsByMonth || {}).map(([month, count]) => (
                        <div key={month} className="flex justify-between items-center p-3 border rounded">
                          <span className="font-medium">{month}</span>
                          <span className="text-muted-foreground">{count as number} TRs</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      icon={Calendar}
                      title="Timeline vazia"
                      description="O histórico de criação e finalização de TRs será exibido aqui conforme você utiliza o sistema."
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Atividade Recente</CardTitle>
                  <CardDescription>Últimas ações no sistema</CardDescription>
                </CardHeader>
                <CardContent>
                  {recentActivities && recentActivities.length > 0 ? (
                    <div className="space-y-2">
                      {recentActivities.slice(0, 10).map((activity: any) => (
                        <div key={activity.id} className="flex justify-between items-center p-3 border rounded hover:bg-muted/50 transition-colors">
                          <div className="flex-1">
                            <p className="font-medium">{activity.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {activity.action} por {activity.user}
                            </p>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(activity.timestamp).toLocaleDateString('pt-BR')}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      icon={Clock}
                      title="Nenhuma atividade recente"
                      description="As ações realizadas no sistema serão registradas e exibidas aqui para acompanhamento."
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Reports;
