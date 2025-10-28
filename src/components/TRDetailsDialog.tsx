import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ExternalLink, Calendar, DollarSign, Clock, FileText } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface TRDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tr: any;
}

export const TRDetailsDialog = ({ open, onOpenChange, tr }: TRDetailsDialogProps) => {
  if (!tr) return null;

  const statusVariant = {
    processando: "default" as const,
    concluido: "default" as const,
    erro: "destructive" as const,
  }[tr.status];

  const statusColor = {
    processando: "bg-yellow-500",
    concluido: "bg-green-500",
    erro: "bg-red-500",
  }[tr.status];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl mb-2">{tr.title}</DialogTitle>
              <DialogDescription className="flex items-center gap-2">
                <Badge variant={statusVariant} className="flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${statusColor}`} />
                  {tr.status.charAt(0).toUpperCase() + tr.status.slice(1)}
                </Badge>
                <span className="text-muted-foreground">•</span>
                <span>{tr.type}</span>
              </DialogDescription>
            </div>
            {tr.google_docs_url && (
              <Button asChild size="sm">
                <a href={tr.google_docs_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Abrir Documento
                </a>
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* ID do TR */}
          <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">ID do Termo de Referência:</span>
              <code className="text-xs font-mono bg-background px-2 py-1 rounded border">
                {tr.id}
              </code>
            </div>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Criado em:</span>
              <span className="font-medium">
                {format(new Date(tr.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Template:</span>
              <span className="font-medium">{tr.templates?.title || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Programa:</span>
              <span className="font-medium">{tr.programas?.nome || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Duração:</span>
              <span className="font-medium">{tr.duration}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Orçamento:</span>
              <span className="font-medium">{tr.budget}</span>
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h3 className="font-semibold text-lg mb-2">Descrição Geral</h3>
            <p className="text-muted-foreground leading-relaxed">{tr.description}</p>
          </div>

          <Separator />

          {/* Objective */}
          <div>
            <h3 className="font-semibold text-lg mb-2">Objetivo da Contratação</h3>
            <p className="text-muted-foreground leading-relaxed">{tr.objective}</p>
          </div>

          <Separator />

          {/* Scope */}
          <div>
            <h3 className="font-semibold text-lg mb-2">Escopo dos Serviços</h3>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{tr.scope}</p>
          </div>

          {tr.requirements && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold text-lg mb-2">Requisitos Técnicos</h3>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{tr.requirements}</p>
              </div>
            </>
          )}

          <Separator />

          {/* Evaluation Criteria */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center justify-between">
                Critérios Técnicos
                <Badge variant="outline">{tr.technical_weight}%</Badge>
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{tr.technical_criteria}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center justify-between">
                Critérios de Experiência
                <Badge variant="outline">{tr.experience_weight}%</Badge>
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{tr.experience_criteria}</p>
            </div>
          </div>

          {tr.error_message && (
            <>
              <Separator />
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <h3 className="font-semibold text-destructive mb-2">Mensagem de Erro</h3>
                <p className="text-sm text-destructive/80">{tr.error_message}</p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
