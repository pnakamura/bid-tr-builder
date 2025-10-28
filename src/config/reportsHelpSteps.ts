export const reportsHelpSteps = [
  {
    id: 'reports-welcome',
    target: '[data-tour="reports-header"]',
    title: 'Central de Relatórios e Analytics',
    content: 'Bem-vindo à Central de Relatórios! Aqui você pode acompanhar o desempenho do sistema em tempo real, visualizar estatísticas detalhadas e exportar dados para análise.',
    placement: 'bottom' as const
  },
  {
    id: 'reports-filters',
    target: '[data-tour="reports-filters"]',
    title: 'Filtros de Relatório',
    content: 'Use estes filtros para personalizar sua análise. Você pode selecionar o período de tempo e filtrar por departamento específico.',
    placement: 'bottom' as const
  },
  {
    id: 'reports-period',
    target: '[data-tour="reports-period"]',
    title: 'Seleção de Período',
    content: 'Escolha o intervalo de tempo para análise: última semana, mês, trimestre ou ano. Os dados serão atualizados automaticamente.',
    placement: 'bottom' as const
  },
  {
    id: 'reports-department',
    target: '[data-tour="reports-department"]',
    title: 'Filtro por Departamento',
    content: 'Filtre os relatórios por departamento específico ou visualize dados consolidados de todos os departamentos.',
    placement: 'bottom' as const
  },
  {
    id: 'reports-export',
    target: '[data-tour="reports-export"]',
    title: 'Exportar Relatórios',
    content: 'Exporte os dados em formato PDF ou Excel para compartilhar com sua equipe ou realizar análises mais profundas.',
    placement: 'bottom' as const
  },
  {
    id: 'reports-kpi-total',
    target: '[data-tour="reports-kpi-total"]',
    title: 'Total de TRs',
    content: 'Quantidade total de Termos de Referência criados no período selecionado. A seta indica a tendência em relação ao período anterior.',
    placement: 'bottom' as const
  },
  {
    id: 'reports-kpi-processing',
    target: '[data-tour="reports-kpi-processing"]',
    title: 'TRs Processando',
    content: 'Número de TRs que estão sendo processados no momento pelo sistema N8N. Indica a carga de trabalho atual.',
    placement: 'bottom' as const
  },
  {
    id: 'reports-kpi-completed',
    target: '[data-tour="reports-kpi-completed"]',
    title: 'TRs Concluídos',
    content: 'TRs finalizados com sucesso. Alta taxa de conclusão indica boa performance do sistema.',
    placement: 'bottom' as const
  },
  {
    id: 'reports-kpi-errors',
    target: '[data-tour="reports-kpi-errors"]',
    title: 'TRs com Erro',
    content: 'Número de TRs que falharam no processamento. Monitore este indicador para identificar problemas rapidamente.',
    placement: 'bottom' as const
  },
  {
    id: 'reports-kpi-templates',
    target: '[data-tour="reports-kpi-templates"]',
    title: 'Total de Templates',
    content: 'Quantidade de templates disponíveis no sistema. Mais templates significam mais opções para criação de TRs.',
    placement: 'bottom' as const
  },
  {
    id: 'reports-tabs',
    target: '[data-tour="reports-tabs"]',
    title: 'Abas de Visualização',
    content: 'Navegue entre diferentes visualizações: Visão Geral (gráficos), Departamentos (comparações), Timeline (evolução) e Atividade (histórico).',
    placement: 'top' as const
  },
  {
    id: 'reports-chart-category',
    target: '[data-tour="reports-chart-category"]',
    title: 'TRs por Categoria',
    content: 'Gráfico de pizza mostrando a distribuição de TRs por categoria. Identifique rapidamente quais categorias são mais utilizadas.',
    placement: 'right' as const
  },
  {
    id: 'reports-chart-status',
    target: '[data-tour="reports-chart-status"]',
    title: 'TRs por Status',
    content: 'Gráfico de barras com a situação atual de todos os TRs: quantos estão processando, concluídos ou com erro.',
    placement: 'left' as const
  },
  {
    id: 'reports-glossary',
    target: '[data-tour="reports-glossary"]',
    title: 'Glossário de Termos',
    content: 'Clique aqui para acessar o glossário com explicações detalhadas de todos os termos técnicos usados nos relatórios.',
    placement: 'bottom' as const
  },
  {
    id: 'reports-conclusion',
    target: '[data-tour="reports-header"]',
    title: 'Pronto!',
    content: 'Agora você conhece todas as funcionalidades dos relatórios. Explore os dados, use os filtros e exporte relatórios sempre que precisar!',
    placement: 'bottom' as const
  }
];
