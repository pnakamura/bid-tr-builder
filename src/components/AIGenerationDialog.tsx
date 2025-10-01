import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
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

interface AIGenerationDialogProps {
  onGenerate: (context: string) => void;
  isGenerating: boolean;
  disabled?: boolean;
}

export const AIGenerationDialog = ({ 
  onGenerate, 
  isGenerating, 
  disabled 
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
          variant="outline"
          className="gap-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5"
          disabled={disabled || isGenerating}
        >
          <Sparkles className="h-4 w-4 text-primary" />
          {isGenerating ? "Gerando..." : "Gerar com IA"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Gerar TR com Inteligência Artificial
          </DialogTitle>
          <DialogDescription>
            A IA irá gerar automaticamente o conteúdo do TR baseado no template selecionado.
            Você pode fornecer contexto adicional para personalizar o resultado.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="context">
              Contexto Adicional (Opcional)
            </Label>
            <Textarea
              id="context"
              placeholder="Ex: 'Projeto para desenvolvimento de sistema web de gestão escolar com módulos de matrícula, frequência e notas. Orçamento estimado em R$ 150.000. Prazo de 6 meses.'"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              rows={6}
              className="resize-none"
            />
            <p className="text-sm text-muted-foreground">
              Quanto mais detalhes você fornecer, melhor será o resultado gerado pela IA.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isGenerating}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Gerar TR
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
