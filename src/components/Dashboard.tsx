import { useState } from "react";
import { Plus, FileText, Calendar, Users, BarChart3, Search, Filter, Clock, CheckCircle, Zap, Target } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

// Mock data for statistics
const stats = {
  active: 24,
  draft: 7,
  completed: 42,
  users: 156
};

export const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");

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
              title: "TRs Ativos",
              value: stats.active,
              description: "+12% em relação ao mês anterior",
              icon: FileText,
              color: "text-primary",
              bgColor: "bg-primary/10"
            },
            {
              title: "Em Elaboração",
              value: stats.draft,
              description: "Aguardando revisão",
              icon: Clock,
              color: "text-yellow-600",
              bgColor: "bg-yellow-100"
            },
            {
              title: "Finalizados",
              value: stats.completed,
              description: "+5 neste mês",
              icon: CheckCircle,
              color: "text-success",
              bgColor: "bg-success/10"
            },
            {
              title: "Total de Usuários",
              value: stats.users,
              description: "Cadastrados no sistema",
              icon: Users,
              color: "text-accent-foreground",
              bgColor: "bg-accent/20"
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
              {[
                { label: "Criar TR - Consultoria", icon: Plus, href: "/create-tr" },
                { label: "Criar TR - Obras", icon: Plus, href: "/create-tr" },
                { label: "Criar TR - Equipamentos", icon: Plus, href: "/create-tr" },
                { label: "Importar Template", icon: FileText },
                { label: "Agenda de Revisões", icon: Calendar }
              ].map((action, index) => (
                <Button
                  key={action.label}
                  asChild={!!action.href}
                  variant="outline"
                  className="w-full justify-start hover:bg-primary/5 transition-all duration-200 hover-scale"
                >
                  {action.href ? (
                    <Link to={action.href}>
                      <action.icon className="mr-2 h-4 w-4" />
                      {action.label}
                    </Link>
                  ) : (
                    <>
                      <action.icon className="mr-2 h-4 w-4" />
                      {action.label}
                    </>
                  )}
                </Button>
              ))}
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
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Search className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { title: "Consultoria Sistema Gestão", type: "Consultoria", status: "Em Análise", date: "15/01" },
                  { title: "Obras Pavimentação", type: "Obras", status: "Aprovado", date: "14/01" },
                  { title: "Equipamentos Lab", type: "Equipamentos", status: "Rascunho", date: "12/01" },
                  { title: "Consultoria TI", type: "Consultoria", status: "Em Análise", date: "10/01" }
                ].map((tr, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-all duration-200 hover-scale">
                    <div>
                      <p className="font-medium">{tr.title}</p>
                      <p className="text-sm text-muted-foreground">{tr.type}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={tr.status === "Aprovado" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {tr.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{tr.date}</span>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4 hover-scale">
                Ver todos os TRs
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};