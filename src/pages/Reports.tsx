import { useState } from "react";
import { Header } from "@/components/Header";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/EmptyState";
import { useReportsData } from "@/hooks/useReportsData";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
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
  AlertTriangle,
  Loader2
} from "lucide-react";

const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("last-month");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const { toast } = useToast();
  
  const { stats, trsByCategory, trsByMonth, templateUsage, recentActivities, isLoading } = useReportsData(
    selectedPeriod,
    selectedDepartment
  );

  const handleExportReport = () => {
    toast({
      title: "Exportação Iniciada",
      description: "Seu relatório será baixado em breve.",
    });
    // TODO: Implement actual export functionality
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

                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Departamentos</SelectItem>
                    <SelectItem value="Engenharia">Engenharia</SelectItem>
                    <SelectItem value="TI">TI</SelectItem>
                    <SelectItem value="Administrativo">Administrativo</SelectItem>
                    <SelectItem value="Jurídico">Jurídico</SelectItem>
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
              <TabsTrigger value="departments">Departamentos</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="activity">Atividade</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
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
            </TabsContent>

            <TabsContent value="departments" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Desempenho por Departamento</CardTitle>
                  <CardDescription>Comparativo de produtividade</CardDescription>
                </CardHeader>
                <CardContent>
                  <EmptyState
                    icon={Users}
                    title="Sem dados departamentais"
                    description="Os relatórios por departamento serão exibidos quando houver TRs cadastrados no sistema."
                  />
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
                  <EmptyState
                    icon={Calendar}
                    title="Timeline vazia"
                    description="O histórico de criação e finalização de TRs será exibido aqui conforme você utiliza o sistema."
                  />
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
                  <EmptyState
                    icon={Clock}
                    title="Nenhuma atividade recente"
                    description="As ações realizadas no sistema serão registradas e exibidas aqui para acompanhamento."
                  />
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