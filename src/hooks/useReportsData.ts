import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfMonth, endOfMonth, subMonths, format, differenceInHours } from "date-fns";

export const useReportsData = (dateRange: string, department: string) => {
  // Calculate date range
  const getDateRange = () => {
    const now = new Date();
    switch (dateRange) {
      case "last-week":
        return { start: subMonths(now, 0), end: now };
      case "last-month":
        return { start: startOfMonth(subMonths(now, 1)), end: endOfMonth(subMonths(now, 1)) };
      case "last-quarter":
        return { start: subMonths(now, 3), end: now };
      case "last-year":
        return { start: subMonths(now, 12), end: now };
      default:
        return { start: subMonths(now, 1), end: now };
    }
  };

  const { start, end } = getDateRange();

  // Fetch TRs data with filters
  const { data: trsData, isLoading: trsLoading } = useQuery({
    queryKey: ['reports-trs', dateRange, department],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('termos_referencia')
        .select(`
          *,
          templates (
            title,
            category
          )
        `)
        .gte('created_at', start.toISOString())
        .lte('created_at', end.toISOString());
      
      if (error) throw error;
      
      // Fetch profiles separately
      if (data && data.length > 0) {
        const userIds = [...new Set(data.map(tr => tr.created_by))];
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, nome, departamento')
          .in('id', userIds);
        
        // Map profiles to TRs
        const trsWithProfiles = data.map(tr => ({
          ...tr,
          profile: profiles?.find(p => p.id === tr.created_by),
        }));
        
        // Filter by department if specified
        if (department && department !== "all") {
          return trsWithProfiles.filter(tr => tr.profile?.departamento === department);
        }
        
        return trsWithProfiles;
      }
      
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

  // Calculate average time to complete
  const calculateAvgProcessingTime = () => {
    if (!trsData) return 0;
    
    const completedTRs = trsData.filter(
      tr => tr.status === 'concluido' && tr.n8n_processed_at
    );
    
    if (completedTRs.length === 0) return 0;
    
    const totalHours = completedTRs.reduce((sum, tr) => {
      const hours = differenceInHours(
        new Date(tr.n8n_processed_at!),
        new Date(tr.created_at)
      );
      return sum + hours;
    }, 0);
    
    return totalHours / completedTRs.length;
  };

  // Calculate statistics
  const stats = {
    totalTRs: trsData?.length || 0,
    processando: trsData?.filter(tr => tr.status === 'processando').length || 0,
    concluidos: trsData?.filter(tr => tr.status === 'concluido').length || 0,
    erros: trsData?.filter(tr => tr.status === 'erro').length || 0,
    avgTimeToComplete: calculateAvgProcessingTime(),
    successRate: trsData && trsData.length > 0 
      ? ((trsData.filter(tr => tr.status === 'concluido').length / trsData.length) * 100)
      : 0,
    errorRate: trsData && trsData.length > 0
      ? ((trsData.filter(tr => tr.status === 'erro').length / trsData.length) * 100)
      : 0,
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
    .slice(0, 50)
    .map(tr => ({
      id: tr.id,
      action: 'TR Criado',
      title: tr.title,
      user: (tr as any).profile?.nome || 'Usuário',
      timestamp: tr.created_at,
      status: tr.status,
    })) || [];

  // Department statistics
  const departmentStats = trsData?.reduce((acc, tr) => {
    const deptName = (tr as any).profile?.departamento || 'Sem Departamento';
    
    if (!acc[deptName]) {
      acc[deptName] = {
        name: deptName,
        total: 0,
        concluidos: 0,
        erros: 0,
        successRate: 0
      };
    }
    
    acc[deptName].total++;
    if (tr.status === 'concluido') acc[deptName].concluidos++;
    if (tr.status === 'erro') acc[deptName].erros++;
    
    return acc;
  }, {} as Record<string, any>) || {};

  // Calculate success rates for departments
  const departmentStatsArray = Object.values(departmentStats).map((dept: any) => ({
    ...dept,
    successRate: dept.total > 0 ? (dept.concluidos / dept.total) * 100 : 0
  }));

  return {
    stats,
    trsByCategory,
    trsByMonth,
    templateUsage,
    recentActivities,
    departmentStats: departmentStatsArray,
    isLoading: trsLoading || templatesLoading,
  };
};
