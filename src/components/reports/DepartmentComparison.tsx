import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface DepartmentStats {
  name: string;
  total: number;
  concluidos: number;
  erros: number;
  successRate: number;
}

interface DepartmentComparisonProps {
  departmentStats: DepartmentStats[];
}

export const DepartmentComparison = ({ departmentStats }: DepartmentComparisonProps) => {
  if (departmentStats.length === 0) {
    return (
      <Card data-tour="reports-departments">
        <CardHeader>
          <CardTitle>Comparação por Departamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground mb-4">
              Nenhum dado de departamento disponível no período selecionado.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Preparar dados para o gráfico
  const chartData = departmentStats.map(dept => ({
    name: dept.name.length > 15 ? dept.name.substring(0, 15) + '...' : dept.name,
    Total: dept.total,
    Concluídos: dept.concluidos,
    Erros: dept.erros,
  }));

  return (
    <div className="space-y-6" data-tour="reports-departments">
      {/* Gráfico de Barras */}
      <Card>
        <CardHeader>
          <CardTitle>TRs por Departamento</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
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
              <Legend />
              <Bar dataKey="Total" fill="hsl(var(--chart-1))" />
              <Bar dataKey="Concluídos" fill="hsl(var(--chart-2))" />
              <Bar dataKey="Erros" fill="hsl(var(--destructive))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Tabela Detalhada */}
      <Card>
        <CardHeader>
          <CardTitle>Ranking de Departamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Departamento</TableHead>
                  <TableHead className="text-right">Total TRs</TableHead>
                  <TableHead className="text-right">Concluídos</TableHead>
                  <TableHead className="text-right">Erros</TableHead>
                  <TableHead className="text-right">Taxa de Sucesso</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {departmentStats
                  .sort((a, b) => b.total - a.total)
                  .map((dept) => (
                    <TableRow key={dept.name}>
                      <TableCell className="font-medium">{dept.name}</TableCell>
                      <TableCell className="text-right">{dept.total}</TableCell>
                      <TableCell className="text-right">{dept.concluidos}</TableCell>
                      <TableCell className="text-right">{dept.erros}</TableCell>
                      <TableCell className="text-right">
                        <Badge 
                          variant={dept.successRate >= 90 ? "default" : dept.successRate >= 70 ? "secondary" : "destructive"}
                        >
                          {dept.successRate.toFixed(1)}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
