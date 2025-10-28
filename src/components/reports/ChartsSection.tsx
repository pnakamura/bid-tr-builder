import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";

interface ChartsSectionProps {
  trsByCategory: Record<string, number>;
  trsByMonth: Record<string, number>;
  templateUsage: Record<string, number>;
  stats: {
    processando: number;
    concluidos: number;
    erros: number;
  };
}

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

export const ChartsSection = ({ trsByCategory, trsByMonth, templateUsage, stats }: ChartsSectionProps) => {
  // Preparar dados para gráfico de pizza (categorias)
  const categoryData = Object.entries(trsByCategory).map(([name, value]) => ({
    name,
    value
  }));

  // Preparar dados para gráfico de barras (status)
  const statusData = [
    { name: 'Processando', value: stats.processando, fill: 'hsl(var(--chart-2))' },
    { name: 'Concluídos', value: stats.concluidos, fill: 'hsl(var(--chart-1))' },
    { name: 'Erros', value: stats.erros, fill: 'hsl(var(--destructive))' },
  ];

  // Preparar dados para gráfico de linhas (timeline)
  const timelineData = Object.entries(trsByMonth).map(([month, count]) => ({
    month,
    TRs: count
  }));

  // Top 5 templates
  const topTemplates = Object.entries(templateUsage)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, value]) => ({
      name: name.length > 20 ? name.substring(0, 20) + '...' : name,
      value
    }));

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Gráfico de Pizza - TRs por Categoria */}
        <Card data-tour="reports-chart-category">
          <CardHeader>
            <CardTitle>TRs por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="hsl(var(--primary))"
                    dataKey="value"
                  >
                    {categoryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                Nenhum dado disponível
              </div>
            )}
          </CardContent>
        </Card>

        {/* Gráfico de Barras - TRs por Status */}
        <Card data-tour="reports-chart-status">
          <CardHeader>
            <CardTitle>TRs por Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--foreground))" />
                <YAxis stroke="hsl(var(--foreground))" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Bar dataKey="value" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Área - Timeline */}
      <Card data-tour="reports-chart-timeline">
        <CardHeader>
          <CardTitle>Evolução de Criação de TRs</CardTitle>
        </CardHeader>
        <CardContent>
          {timelineData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--foreground))" />
                <YAxis stroke="hsl(var(--foreground))" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="TRs" 
                  stroke="hsl(var(--primary))" 
                  fill="hsl(var(--primary) / 0.2)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
              Nenhum dado disponível
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gráfico de Barras Horizontais - Top Templates */}
      <Card data-tour="reports-chart-templates">
        <CardHeader>
          <CardTitle>Top 5 Templates Mais Usados</CardTitle>
        </CardHeader>
        <CardContent>
          {topTemplates.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topTemplates} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--foreground))" />
                <YAxis dataKey="name" type="category" width={150} stroke="hsl(var(--foreground))" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Bar dataKey="value" fill="hsl(var(--chart-3))" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
              Nenhum template foi usado ainda
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
