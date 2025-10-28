import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfMonth, endOfMonth, subMonths, format } from "date-fns";

export const useReportsData = (dateRange: string, programa: string) => {
  // Calculate date range
  const getDateRange = () => {
    const now = new Date();
    switch (dateRange) {
      case "last-week":
        return { start: subMonths(now, 0.25), end: now }; // 7 days ago
      case "last-month":
        return { start: subMonths(now, 1), end: now }; // 30 days ago
      case "last-quarter":
        return { start: subMonths(now, 3), end: now }; // 90 days ago
      case "last-year":
        return { start: subMonths(now, 12), end: now }; // 365 days ago
      default:
        return { start: subMonths(now, 1), end: now };
    }
  };

  const { start, end } = getDateRange();

  // Fetch TRs data with filters
  const { data: trsData, isLoading: trsLoading } = useQuery({
    queryKey: ['reports-trs', dateRange, programa],
    queryFn: async () => {
      let query = supabase
        .from('termos_referencia')
        .select(`
          *,
          templates (
            title,
            category
          ),
          programas (
            nome,
            codigo
          )
        `)
        .gte('created_at', start.toISOString())
        .lte('created_at', end.toISOString());
      
      // Filter by programa if specified
      if (programa && programa !== "all") {
        query = query.eq('programa_id', programa);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch templates data
  const { data: templatesData, isLoading: templatesLoading } = useQuery({
    queryKey: ['reports-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('templates')
        .select('*');
      
      if (error) throw error;
      return data;
    }
  });

  // Calculate statistics
  const stats = {
    totalTRs: trsData?.length || 0,
    processando: trsData?.filter(tr => tr.status === 'processando').length || 0,
    concluidos: trsData?.filter(tr => tr.status === 'concluido').length || 0,
    erros: trsData?.filter(tr => tr.status === 'erro').length || 0,
    avgTimeToComplete: 0,
    totalTemplates: templatesData?.length || 0,
  };

  // Group by category
  const trsByCategory = trsData?.reduce((acc, tr) => {
    const category = tr.type || 'Outros';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  // Group by month
  const trsByMonth = trsData?.reduce((acc, tr) => {
    const month = format(new Date(tr.created_at), 'MMM yyyy');
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  // Top templates usage
  const templateUsage = trsData?.reduce((acc, tr) => {
    const templateTitle = tr.templates?.title || 'Sem template';
    acc[templateTitle] = (acc[templateTitle] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  // Recent activities
  const recentActivities = trsData
    ?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 10)
    .map(tr => ({
      id: tr.id,
      action: 'TR Criado',
      title: tr.title,
      user: (tr as any).profile?.nome || 'Usuário',
      timestamp: tr.created_at,
      status: tr.status,
    })) || [];

  // Program statistics
  const programStats = trsData?.reduce((acc, tr) => {
    const programName = (tr as any).programas?.nome || 'Sem Programa';
    
    if (!acc[programName]) {
      acc[programName] = {
        name: programName,
        total: 0,
        concluidos: 0,
        erros: 0,
        successRate: 0
      };
    }
    
    acc[programName].total++;
    if (tr.status === 'concluido') acc[programName].concluidos++;
    if (tr.status === 'erro') acc[programName].erros++;
    
    return acc;
  }, {} as Record<string, any>) || {};

  // Calculate success rates for programs
  const programStatsArray = Object.values(programStats).map((prog: any) => ({
    ...prog,
    successRate: prog.total > 0 ? (prog.concluidos / prog.total) * 100 : 0
  }));

  return {
    stats,
    trsByCategory,
    trsByMonth,
    templateUsage,
    recentActivities,
    programStats: programStatsArray,
    isLoading: trsLoading || templatesLoading,
  };
};
