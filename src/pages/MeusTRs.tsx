import { Header } from "@/components/Header";
import { useState } from "react";
import { FileText, Eye, ExternalLink, Trash2, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useMeusTRs } from "@/hooks/useMeusTRs";
import { TRDetailsDialog } from "@/components/TRDetailsDialog";
import { EmptyState } from "@/components/EmptyState";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const MeusTRs = () => {
  const { trs, isLoading, deleteTR } = useMeusTRs();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedTR, setSelectedTR] = useState<any>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [trToDelete, setTrToDelete] = useState<string | null>(null);

  // Filter TRs based on search and status
  const filteredTRs = trs?.filter((tr) => {
    const matchesSearch = 
      tr.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tr.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || tr.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (tr: any) => {
    setSelectedTR(tr);
    setDetailsOpen(true);
  };

  const handleDeleteClick = (trId: string) => {
    setTrToDelete(trId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (trToDelete) {
      deleteTR.mutate(trToDelete);
      setDeleteDialogOpen(false);
      setTrToDelete(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const config = {
      processando: {
        variant: "default" as const,
        color: "bg-yellow-500",
        label: "Processando",
        animate: true
      },
      concluido: {
        variant: "default" as const,
        color: "bg-green-500",
        label: "Concluído",
        animate: false
      },
      erro: {
        variant: "destructive" as const,
        color: "bg-red-500",
        label: "Erro",
        animate: false
      }
    };

    const statusConfig = config[status as keyof typeof config] || config.processando;

    return (
      <Badge variant={statusConfig.variant} className="flex items-center gap-1 w-fit">
        <span 
          className={`w-2 h-2 rounded-full ${statusConfig.color} ${statusConfig.animate ? 'animate-pulse' : ''}`} 
        />
        {statusConfig.label}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Meus Termos de Referência</h1>
          <p className="text-muted-foreground">Gerencie todos os TRs criados e acesse os documentos gerados</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <CardTitle>Lista de TRs</CardTitle>
                <CardDescription>
                  {filteredTRs?.length || 0} termo(s) de referência {statusFilter !== "all" && `com status "${statusFilter}"`}
                </CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por título ou tipo..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="processando">Processando</SelectItem>
                    <SelectItem value="concluido">Concluído</SelectItem>
                    <SelectItem value="erro">Erro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            ) : !filteredTRs || filteredTRs.length === 0 ? (
              <EmptyState
                icon={FileText}
                title={searchQuery || statusFilter !== "all" ? "Nenhum TR encontrado" : "Nenhum TR criado ainda"}
                description={
                  searchQuery || statusFilter !== "all"
                    ? "Tente ajustar os filtros de busca"
                    : "Comece criando seu primeiro Termo de Referência"
                }
                actionLabel={!searchQuery && statusFilter === "all" ? "Criar TR" : undefined}
                actionHref={!searchQuery && statusFilter === "all" ? "/create-tr" : undefined}
              />
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Título</TableHead>
                      <TableHead>Programa</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Data de Criação</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTRs.map((tr) => (
                      <TableRow key={tr.id}>
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {tr.id.substring(0, 8)}...
                        </TableCell>
                        <TableCell className="font-medium">{tr.title}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {tr.programas?.nome || 'N/A'}
                        </TableCell>
                        <TableCell className="text-muted-foreground">{tr.type}</TableCell>
                        <TableCell>{getStatusBadge(tr.status)}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {format(new Date(tr.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDetails(tr)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {tr.google_docs_url && (
                              <Button
                                variant="ghost"
                                size="sm"
                                asChild
                              >
                                <a href={tr.google_docs_url} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-4 w-4" />
                                </a>
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteClick(tr.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <TRDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        tr={selectedTR}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este Termo de Referência? Esta ação não pode ser desfeita.
              O documento no Google Docs não será excluído.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MeusTRs;
