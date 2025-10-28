import * as XLSX from 'xlsx';

interface ReportData {
  stats: {
    totalTRs: number;
    processando: number;
    concluidos: number;
    erros: number;
    totalTemplates: number;
  };
  trsByCategory: Record<string, number>;
  trsByMonth: Record<string, number>;
  templateUsage: Record<string, number>;
  recentActivities: any[];
  period: string;
  department: string;
}

export const exportReportExcel = (data: ReportData) => {
  // Create workbook
  const wb = XLSX.utils.book_new();

  // Sheet 1: Resumo
  const summaryData = [
    ['RELATÓRIO DE TERMOS DE REFERÊNCIA'],
    [''],
    ['Período:', data.period],
    ['Departamento:', data.department],
    ['Gerado em:', new Date().toLocaleDateString('pt-BR')],
    [''],
    ['INDICADORES PRINCIPAIS'],
    ['Total de TRs', data.stats.totalTRs],
    ['Processando', data.stats.processando],
    ['Concluídos', data.stats.concluidos],
    ['Com Erro', data.stats.erros],
    ['Templates Disponíveis', data.stats.totalTemplates],
    [''],
    ['Taxa de Sucesso', `${((data.stats.concluidos / data.stats.totalTRs) * 100 || 0).toFixed(1)}%`],
    ['Taxa de Erro', `${((data.stats.erros / data.stats.totalTRs) * 100 || 0).toFixed(1)}%`]
  ];

  const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Resumo');

  // Sheet 2: Por Categoria
  const categoryData = [
    ['Categoria', 'Quantidade'],
    ...Object.entries(data.trsByCategory).map(([category, count]) => [category, count])
  ];
  const wsCategory = XLSX.utils.aoa_to_sheet(categoryData);
  XLSX.utils.book_append_sheet(wb, wsCategory, 'Por Categoria');

  // Sheet 3: Timeline
  const timelineData = [
    ['Período', 'TRs Criados'],
    ...Object.entries(data.trsByMonth).map(([month, count]) => [month, count])
  ];
  const wsTimeline = XLSX.utils.aoa_to_sheet(timelineData);
  XLSX.utils.book_append_sheet(wb, wsTimeline, 'Timeline');

  // Sheet 4: Templates
  const templateData = [
    ['Template', 'Uso'],
    ...Object.entries(data.templateUsage)
      .sort(([, a], [, b]) => b - a)
      .map(([template, count]) => [template, count])
  ];
  const wsTemplates = XLSX.utils.aoa_to_sheet(templateData);
  XLSX.utils.book_append_sheet(wb, wsTemplates, 'Templates');

  // Sheet 5: Atividades Recentes
  if (data.recentActivities.length > 0) {
    const activitiesData = [
      ['Data', 'Ação', 'Título', 'Usuário', 'Status'],
      ...data.recentActivities.map(activity => [
        new Date(activity.timestamp).toLocaleString('pt-BR'),
        activity.action,
        activity.title,
        activity.user,
        activity.status
      ])
    ];
    const wsActivities = XLSX.utils.aoa_to_sheet(activitiesData);
    XLSX.utils.book_append_sheet(wb, wsActivities, 'Atividades');
  }

  // Generate and download file
  const fileName = `relatorio-trs-${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(wb, fileName);
};
