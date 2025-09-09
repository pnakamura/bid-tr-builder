import { useState } from "react";
import { Header } from "@/components/Header";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  // Mock data for reports
  const statsData = {
    totalTRs: 156,
    activeTRs: 24,
    completedTRs: 42,
    averageTime: 12.5,
    efficiency: 89
  };

  const departmentData = [
    { name: "Engenharia", active: 8, completed: 15, pending: 3 },
    { name: "TI", active: 6, completed: 12, pending: 2 },
    { name: "Administrativo", active: 4, completed: 8, pending: 1 },
    { name: "Jurídico", active: 6, completed: 7, pending: 2 }
  ];

  const timelineData = [
    { month: "Jan", created: 12, completed: 8 },
    { month: "Fev", created: 15, completed: 12 },
    { month: "Mar", created: 18, completed: 15 },
    { month: "Abr", created: 14, completed: 16 },
    { month: "Mai", created: 16, completed: 14 }
  ];

  const recentActivity = [
    { id: 1, action: "TR Consultoria TI finalizado", user: "João Silva", time: "2h atrás", type: "completed" },
    { id: 2, action: "TR Obras Pavimentação em revisão", user: "Maria Santos", time: "4h atrás", type: "review" },
    { id: 3, action: "Novo TR Equipamentos criado", user: "Pedro Costa", time: "6h atrás", type: "created" },
    { id: 4, action: "TR Consultoria aprovado", user: "Ana Lima", time: "1d atrás", type: "approved" }
  ];

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
                    <SelectItem value="week">Última Semana</SelectItem>
                    <SelectItem value="month">Último Mês</SelectItem>
                    <SelectItem value="quarter">Último Trimestre</SelectItem>
                    <SelectItem value="year">Último Ano</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Departamentos</SelectItem>
                    <SelectItem value="engineering">Engenharia</SelectItem>
                    <SelectItem value="it">TI</SelectItem>
                    <SelectItem value="admin">Administrativo</SelectItem>
                    <SelectItem value="legal">Jurídico</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" className="hover-scale">
                  <Download className="mr-2 h-4 w-4" />
                  Exportar Relatório
                </Button>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            {[
              {
                title: "Total de TRs",
                value: statsData.totalTRs,
                change: "+12%",
                icon: FileText,
                color: "text-primary",
                bgColor: "bg-primary/10"
              },
              {
                title: "TRs Ativos",
                value: statsData.activeTRs,
                change: "+5%",
                icon: Clock,
                color: "text-yellow-600",
                bgColor: "bg-yellow-100"
              },
              {
                title: "Finalizados",
                value: statsData.completedTRs,
                change: "+8%",
                icon: CheckCircle,
                color: "text-success",
                bgColor: "bg-success/10"
              },
              {
                title: "Tempo Médio",
                value: `${statsData.averageTime} dias`,
                change: "-2d",
                icon: TrendingUp,
                color: "text-accent-foreground",
                bgColor: "bg-accent/20"
              },
              {
                title: "Eficiência",
                value: `${statsData.efficiency}%`,
                change: "+3%",
                icon: BarChart3,
                color: "text-success",
                bgColor: "bg-success/10"
              }
            ].map((metric, index) => (
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
                    {metric.change} vs período anterior
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Detailed Reports */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="departments">Departamentos</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="activity">Atividade</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="h-5 w-5" />
                      Status dos TRs
                    </CardTitle>
                    <CardDescription>Distribuição por status atual</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { status: "Em Elaboração", count: 24, color: "bg-yellow-500", percentage: 35 },
                        { status: "Em Revisão", count: 18, color: "bg-blue-500", percentage: 26 },
                        { status: "Aprovado", count: 15, color: "bg-green-500", percentage: 22 },
                        { status: "Finalizado", count: 12, color: "bg-gray-500", percentage: 17 }
                      ].map((item) => (
                        <div key={item.status} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                            <span className="text-sm font-medium">{item.status}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">{item.count}</span>
                            <Badge variant="outline">{item.percentage}%</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Tipos de Contratação
                    </CardTitle>
                    <CardDescription>Distribuição por categoria</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { type: "Consultoria", count: 32, percentage: 45 },
                        { type: "Obras", count: 18, percentage: 25 },
                        { type: "Equipamentos", count: 15, percentage: 21 },
                        { type: "Serviços", count: 6, percentage: 9 }
                      ].map((item) => (
                        <div key={item.type} className="flex items-center justify-between">
                          <span className="text-sm font-medium">{item.type}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-muted rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full" 
                                style={{ width: `${item.percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-muted-foreground w-8">{item.count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="departments" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Desempenho por Departamento</CardTitle>
                  <CardDescription>Comparativo de produtividade</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {departmentData.map((dept) => (
                      <div key={dept.name} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium">{dept.name}</h4>
                          <Badge>{dept.active + dept.completed + dept.pending} total</Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div className="text-center">
                            <div className="text-lg font-bold text-yellow-600">{dept.active}</div>
                            <div className="text-muted-foreground">Ativos</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-green-600">{dept.completed}</div>
                            <div className="text-muted-foreground">Finalizados</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-red-600">{dept.pending}</div>
                            <div className="text-muted-foreground">Pendentes</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="timeline" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Timeline de Criação vs Finalização</CardTitle>
                  <CardDescription>Últimos 5 meses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {timelineData.map((month) => (
                      <div key={month.month} className="flex items-center gap-4">
                        <div className="w-12 text-sm font-medium">{month.month}</div>
                        <div className="flex-1 flex gap-2">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span className="text-sm">Criados: {month.created}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-sm">Finalizados: {month.completed}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
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
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center gap-4 p-3 border rounded-lg">
                        <div className={`p-2 rounded-lg ${
                          activity.type === 'completed' ? 'bg-green-100 text-green-600' :
                          activity.type === 'review' ? 'bg-yellow-100 text-yellow-600' :
                          activity.type === 'created' ? 'bg-blue-100 text-blue-600' :
                          'bg-purple-100 text-purple-600'
                        }`}>
                          {activity.type === 'completed' ? <CheckCircle className="h-4 w-4" /> :
                           activity.type === 'review' ? <AlertTriangle className="h-4 w-4" /> :
                           activity.type === 'created' ? <FileText className="h-4 w-4" /> :
                           <Users className="h-4 w-4" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.action}</p>
                          <p className="text-xs text-muted-foreground">por {activity.user}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{activity.time}</span>
                      </div>
                    ))}
                  </div>
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