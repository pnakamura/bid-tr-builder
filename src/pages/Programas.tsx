import { Header } from "@/components/Header";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { useState } from "react";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useProgramas } from "@/hooks/useProgramas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { EmptyState } from "@/components/EmptyState";

interface ProgramaForm {
  nome: string;
  descricao: string;
  codigo: string;
  status: string;
}

const Programas = () => {
  const { data: programas, isLoading } = useProgramas();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPrograma, setEditingPrograma] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [programaToDelete, setProgramaToDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProgramaForm>({
    nome: "",
    descricao: "",
    codigo: "",
    status: "Ativo"
  });

  // Mutation para criar programa
  const createPrograma = useMutation({
    mutationFn: async (data: ProgramaForm) => {
      const { error } = await supabase
        .from("programas")
        .insert(data);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["programas"] });
      toast({
        title: "Programa Criado",
        description: "O programa foi criado com sucesso.",
      });
      setDialogOpen(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao Criar",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Mutation para atualizar programa
  const updatePrograma = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ProgramaForm }) => {
      const { error } = await supabase
        .from("programas")
        .update(data)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["programas"] });
      toast({
        title: "Programa Atualizado",
        description: "O programa foi atualizado com sucesso.",
      });
      setDialogOpen(false);
      setEditingPrograma(null);
      resetForm();
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao Atualizar",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Mutation para deletar programa
  const deletePrograma = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("programas")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["programas"] });
      toast({
        title: "Programa Excluído",
        description: "O programa foi removido com sucesso.",
      });
      setDeleteDialogOpen(false);
      setProgramaToDelete(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao Excluir",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const resetForm = () => {
    setFormData({
      nome: "",
      descricao: "",
      codigo: "",
      status: "Ativo"
    });
  };

  const handleOpenDialog = (programa?: any) => {
    if (programa) {
      setEditingPrograma(programa);
      setFormData({
        nome: programa.nome,
        descricao: programa.descricao || "",
        codigo: programa.codigo || "",
        status: programa.status
      });
    } else {
      setEditingPrograma(null);
      resetForm();
    }
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPrograma) {
      updatePrograma.mutate({ id: editingPrograma.id, data: formData });
    } else {
      createPrograma.mutate(formData);
    }
  };

  const handleDeleteClick = (id: string) => {
    setProgramaToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (programaToDelete) {
      deletePrograma.mutate(programaToDelete);
    }
  };

  const filteredProgramas = programas?.filter((programa) =>
    programa.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (programa.codigo?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Breadcrumbs />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Gerenciar Programas</h1>
          <p className="text-muted-foreground">Cadastre e gerencie os programas do sistema</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <CardTitle>Lista de Programas</CardTitle>
                <CardDescription>
                  {filteredProgramas?.length || 0} programa(s) cadastrado(s)
                </CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar programa..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => handleOpenDialog()}>
                      <Plus className="mr-2 h-4 w-4" />
                      Novo Programa
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {editingPrograma ? "Editar Programa" : "Novo Programa"}
                      </DialogTitle>
                      <DialogDescription>
                        Preencha os dados do programa
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="nome">Nome *</Label>
                        <Input
                          id="nome"
                          value={formData.nome}
                          onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                          placeholder="Ex: PROSAMIN+"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="codigo">Código</Label>
                        <Input
                          id="codigo"
                          value={formData.codigo}
                          onChange={(e) => setFormData(prev => ({ ...prev, codigo: e.target.value }))}
                          placeholder="Ex: PROS001"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="descricao">Descrição</Label>
                        <Textarea
                          id="descricao"
                          value={formData.descricao}
                          onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                          placeholder="Descrição do programa"
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Ativo">Ativo</SelectItem>
                            <SelectItem value="Inativo">Inativo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                          Cancelar
                        </Button>
                        <Button type="submit">
                          {editingPrograma ? "Salvar Alterações" : "Criar Programa"}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            ) : !filteredProgramas || filteredProgramas.length === 0 ? (
              <EmptyState
                icon={Plus}
                title={searchQuery ? "Nenhum programa encontrado" : "Nenhum programa cadastrado"}
                description={
                  searchQuery
                    ? "Tente ajustar os termos de busca"
                    : "Comece criando seu primeiro programa"
                }
                actionLabel={!searchQuery ? "Criar Programa" : undefined}
                onAction={!searchQuery ? () => handleOpenDialog() : undefined}
              />
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Código</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProgramas.map((programa) => (
                      <TableRow key={programa.id}>
                        <TableCell className="font-medium">{programa.nome}</TableCell>
                        <TableCell className="text-muted-foreground">{programa.codigo || "-"}</TableCell>
                        <TableCell className="max-w-md truncate">{programa.descricao || "-"}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            programa.status === "Ativo" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-gray-100 text-gray-800"
                          }`}>
                            {programa.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenDialog(programa)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteClick(programa.id)}
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

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este programa? Esta ação não pode ser desfeita.
              Os TRs associados a este programa não serão excluídos, apenas desvinculados.
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

export default Programas;
