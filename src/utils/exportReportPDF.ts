import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ReportData {
  stats: {
    totalTRs: number;
    processando: number;
    concluidos: number;
    erros: number;
    totalTemplates: number;
  };
  period: string;
  department: string;
  generatedAt: string;
}

export const exportReportPDF = async (data: ReportData) => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  let currentY = 20;

  // Header
  pdf.setFontSize(20);
  pdf.setTextColor(37, 99, 235); // primary color
  pdf.text('Relatório de Termos de Referência', pageWidth / 2, currentY, { align: 'center' });
  
  currentY += 10;
  pdf.setFontSize(10);
  pdf.setTextColor(100, 100, 100);
  pdf.text(`Gerado em: ${data.generatedAt}`, pageWidth / 2, currentY, { align: 'center' });
  
  currentY += 5;
  pdf.text(`Período: ${data.period}`, pageWidth / 2, currentY, { align: 'center' });
  
  currentY += 5;
  pdf.text(`Departamento: ${data.department}`, pageWidth / 2, currentY, { align: 'center' });

  // Line separator
  currentY += 10;
  pdf.setDrawColor(200, 200, 200);
  pdf.line(20, currentY, pageWidth - 20, currentY);

  // KPIs Section
  currentY += 15;
  pdf.setFontSize(14);
  pdf.setTextColor(0, 0, 0);
  pdf.text('Indicadores Principais', 20, currentY);

  currentY += 10;
  pdf.setFontSize(11);
  
  const kpis = [
    { label: 'Total de TRs', value: data.stats.totalTRs },
    { label: 'Processando', value: data.stats.processando },
    { label: 'Concluídos', value: data.stats.concluidos },
    { label: 'Com Erro', value: data.stats.erros },
    { label: 'Templates Disponíveis', value: data.stats.totalTemplates }
  ];

  kpis.forEach((kpi) => {
    pdf.setTextColor(100, 100, 100);
    pdf.text(kpi.label + ':', 25, currentY);
    pdf.setTextColor(0, 0, 0);
    pdf.setFont(undefined, 'bold');
    pdf.text(kpi.value.toString(), 80, currentY);
    pdf.setFont(undefined, 'normal');
    currentY += 8;
  });

  // Success Rate
  currentY += 5;
  const successRate = data.stats.totalTRs > 0 
    ? ((data.stats.concluidos / data.stats.totalTRs) * 100).toFixed(1)
    : '0.0';
  
  pdf.setTextColor(100, 100, 100);
  pdf.text('Taxa de Sucesso:', 25, currentY);
  pdf.setTextColor(34, 197, 94); // green
  pdf.setFont(undefined, 'bold');
  pdf.text(successRate + '%', 80, currentY);
  pdf.setFont(undefined, 'normal');

  // Capture charts if available
  currentY += 15;
  const chartsElement = document.querySelector('[data-tour="reports-chart-category"]')?.parentElement;
  
  if (chartsElement) {
    try {
      const canvas = await html2canvas(chartsElement as HTMLElement, {
        scale: 2,
        logging: false,
        useCORS: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = pageWidth - 40;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      if (currentY + imgHeight > pageHeight - 20) {
        pdf.addPage();
        currentY = 20;
      }
      
      pdf.addImage(imgData, 'PNG', 20, currentY, imgWidth, imgHeight);
    } catch (error) {
      console.error('Error capturing charts:', error);
    }
  }

  // Footer
  const totalPages = (pdf as any).internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text(
      `Página ${i} de ${totalPages} - Sistema de Gestão de TRs`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  }

  // Save PDF
  const fileName = `relatorio-trs-${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(fileName);
};
