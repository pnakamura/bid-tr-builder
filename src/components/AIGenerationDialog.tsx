import { useState } from "react";
import { Sparkles, Loader2, Lightbulb, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AIGenerationDialogProps {
  onGenerate: (context: string) => void;
  isGenerating: boolean;
  disabled?: boolean;
  'data-help-id'?: string;
}

export const AIGenerationDialog = ({ 
  onGenerate, 
  isGenerating, 
  disabled = false,
  'data-help-id': dataHelpId
}: AIGenerationDialogProps) => {
  const [open, setOpen] = useState(false);
  const [context, setContext] = useState("");

  const handleGenerate = () => {
    onGenerate(context);
    setOpen(false);
    setContext("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="default"
          className="gap-2 shadow-sm hover:shadow-md transition-all duration-200"
          disabled={disabled || isGenerating}
          data-help-id={dataHelpId}
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Gerando...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Gerar com IA
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl">Gerar TR com IA</DialogTitle>
              <DialogDescription className="text-sm mt-1">
                Deixe a Inteligência Artificial criar o conteúdo para você
              </DialogDescription>
            </div>
            <Badge variant="secondary" className="shrink-0">Beta</Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Info Card */}
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardContent className="pt-4 pb-4">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Como funciona?</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    A IA analisa o template selecionado e gera automaticamente todo o conteúdo necessário. 
                    Forneça contexto adicional para resultados mais precisos e personalizados.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Context Input */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="context" className="text-base font-semibold">
                Contexto Adicional
              </Label>
              <Badge variant="outline" className="text-xs">Opcional</Badge>
            </div>
            <Textarea
              id="context"
              placeholder="Descreva seu projeto em detalhes..."
              value={context}
              onChange={(e) => setContext(e.target.value)}
              rows={5}
              className="resize-none text-sm"
            />
          </div>

          {/* Examples Card */}
          <Card className="border-muted">
            <CardContent className="pt-4 pb-4">
              <div className="flex gap-3">
                <Lightbulb className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                <div className="space-y-2 flex-1">
                  <p className="text-sm font-medium">Exemplos de contexto útil:</p>
                  <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside">
                    <li>Tipo e objetivo do projeto</li>
                    <li>Área de atuação e público-alvo</li>
                    <li>Orçamento estimado e prazos</li>
                    <li>Requisitos técnicos específicos</li>
                    <li>Localização e abrangência</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Warning */}
          <p className="text-xs text-muted-foreground flex items-start gap-2">
            <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
            <span>
              O conteúdo gerado pela IA é uma sugestão inicial. Revise e ajuste conforme necessário antes de finalizar.
            </span>
          </p>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setOpen(false);
              setContext("");
            }}
            disabled={isGenerating}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="gap-2 shadow-sm hover:shadow-md transition-shadow"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Gerar Agora
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
