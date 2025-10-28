import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useReportsData } from "@/hooks/useReportsData";
import { useToast } from "@/hooks/use-toast";
import { Download, FileSpreadsheet, FileText, TrendingUp, Clock, AlertCircle, CheckCircle, FolderKanban, PlayCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { KPICard } from "@/components/reports/KPICard";
import { ChartsSection } from "@/components/reports/ChartsSection";
import { RecentActivitiesTable } from "@/components/reports/RecentActivitiesTable";
import { DepartmentComparison } from "@/components/reports/DepartmentComparison";
import { GlossaryDialog } from "@/components/reports/GlossaryDialog";
import { exportReportPDF } from "@/utils/exportReportPDF";
import { exportReportExcel } from "@/utils/exportReportExcel";
import { useHelp } from "@/contexts/HelpContext";
import { reportsHelpSteps } from "@/config/reportsHelpSteps";

const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("last-month");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const { toast } = useToast();
  const { startHelp } = useHelp();
  
  const { stats, trsByCategory, trsByMonth, templateUsage, recentActivities, departmentStats, isLoading } = useReportsData(
    selectedPeriod,
    selectedDepartment
  );

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('reports_tour_completed');
    if (!hasSeenTour) {
      const timer = setTimeout(() => {
        if (window.confirm('Bem-vindo aos Relatórios! Gostaria de fazer um tour guiado?')) {
          startHelp(reportsHelpSteps);
          localStorage.setItem('reports_tour_completed', 'true');
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [startHelp]);

  const handleExportPDF = async () => {
    try {
      await exportReportPDF({
        stats,
        period: selectedPeriod,
        department: selectedDepartment === 'all' ? 'Todos' : selectedDepartment,
        generatedAt: new Date().toLocaleString('pt-BR')
      });
      toast({ title: "Relatório PDF exportado com sucesso" });
    } catch (error) {
      toast({ title: "Erro ao exportar PDF", variant: "destructive" });
    }
  };

  const handleExportExcel = () => {
    try {
      exportReportExcel({ stats, trsByCategory, trsByMonth, templateUsage, recentActivities, period: selectedPeriod, department: selectedDepartment });
      toast({ title: "Relatório Excel exportado com sucesso" });
    } catch (error) {
      toast({ title: "Erro ao exportar Excel", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8" data-tour="reports-header">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold">Relatórios e Analytics</h1>
              <p className="text-muted-foreground mt-2">Acompanhe o desempenho do sistema em tempo real</p>
            </div>
            <div className="flex gap-2">
              <GlossaryDialog />
              <Button variant="outline" size="sm" onClick={() => startHelp(reportsHelpSteps)}>Iniciar Tour</Button>
            </div>
          </div>
          <div className="flex flex-wrap gap-4" data-tour="reports-filters">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod} data-tour="reports-period">
              <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="last-week">Última Semana</SelectItem>
                <SelectItem value="last-month">Último Mês</SelectItem>
                <SelectItem value="last-quarter">Último Trimestre</SelectItem>
                <SelectItem value="last-year">Último Ano</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment} data-tour="reports-department">
              <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Departamentos</SelectItem>
                {departmentStats.map((d) => <SelectItem key={d.name} value={d.name}>{d.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <div className="ml-auto" data-tour="reports-export">
              <DropdownMenu>
                <DropdownMenuTrigger asChild><Button><Download className="mr-2 h-4 w-4" />Exportar</Button></DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={handleExportPDF}><FileText className="mr-2 h-4 w-4" />PDF</DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExportExcel}><FileSpreadsheet className="mr-2 h-4 w-4" />Excel</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-5 mb-8">
          <KPICard title="Total de TRs" value={isLoading ? "..." : stats.totalTRs} icon={<TrendingUp className="h-6 w-6" />} tooltip="Total de TRs criados" dataTour="reports-kpi-total" />
          <KPICard title="Processando" value={isLoading ? "..." : stats.processando} icon={<PlayCircle className="h-6 w-6" />} tooltip="TRs em processamento" dataTour="reports-kpi-processing" />
          <KPICard title="Concluídos" value={isLoading ? "..." : stats.concluidos} icon={<CheckCircle className="h-6 w-6" />} tooltip="TRs finalizados" dataTour="reports-kpi-completed" />
          <KPICard title="Com Erro" value={isLoading ? "..." : stats.erros} icon={<AlertCircle className="h-6 w-6" />} tooltip="TRs com erro" dataTour="reports-kpi-errors" />
          <KPICard title="Templates" value={isLoading ? "..." : stats.totalTemplates} icon={<FolderKanban className="h-6 w-6" />} tooltip="Templates disponíveis" dataTour="reports-kpi-templates" />
        </div>

        <Tabs defaultValue="overview" className="space-y-6" data-tour="reports-tabs">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="departments">Departamentos</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="activity">Atividade</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            {isLoading ? <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div> : 
            stats.totalTRs > 0 ? <ChartsSection trsByCategory={trsByCategory} trsByMonth={trsByMonth} templateUsage={templateUsage} stats={stats} /> : 
            <div className="text-center py-12"><p className="text-muted-foreground mb-4">Nenhum dado disponível</p><Button onClick={() => window.location.href = '/create-tr'}>Criar Primeiro TR</Button></div>}
          </TabsContent>
          <TabsContent value="departments">{isLoading ? <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div> : <DepartmentComparison departmentStats={departmentStats} />}</TabsContent>
          <TabsContent value="timeline">{isLoading ? <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div> : <ChartsSection trsByCategory={{}} trsByMonth={trsByMonth} templateUsage={{}} stats={stats} />}</TabsContent>
          <TabsContent value="activity">{isLoading ? <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div> : <RecentActivitiesTable activities={recentActivities} />}</TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Reports;