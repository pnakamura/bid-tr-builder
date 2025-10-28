import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Activity {
  id: string;
  action: string;
  title: string;
  user: string;
  timestamp: string;
  status: string;
}

interface RecentActivitiesTableProps {
  activities: Activity[];
}

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'concluido':
      return 'default';
    case 'processando':
      return 'secondary';
    case 'erro':
      return 'destructive';
    default:
      return 'outline';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'concluido':
      return 'Concluído';
    case 'processando':
      return 'Processando';
    case 'erro':
      return 'Erro';
    default:
      return status;
  }
};

export const RecentActivitiesTable = ({ activities }: RecentActivitiesTableProps) => {
  if (activities.length === 0) {
    return (
      <Card data-tour="reports-activities">
        <CardHeader>
          <CardTitle>Atividades Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground mb-4">
              Nenhuma atividade registrada no período selecionado.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-tour="reports-activities">
      <CardHeader>
        <CardTitle>Atividades Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Ação</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell className="whitespace-nowrap">
                    {format(new Date(activity.timestamp), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                  </TableCell>
                  <TableCell>{activity.action}</TableCell>
                  <TableCell className="max-w-[300px] truncate" title={activity.title}>
                    {activity.title}
                  </TableCell>
                  <TableCell>{activity.user}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(activity.status)}>
                      {getStatusLabel(activity.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.location.href = `/meus-trs`}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
