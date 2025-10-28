import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const glossaryTerms = [
  {
    term: "TR (Termo de Referência)",
    definition: "Documento que especifica requisitos, objetivos, escopo e critérios técnicos para contratação de serviços ou aquisição de produtos."
  },
  {
    term: "Processando",
    definition: "Status indicando que o TR está em fase de geração pelo sistema N8N. O documento está sendo criado automaticamente com base no template selecionado."
  },
  {
    term: "Concluído",
    definition: "TR finalizado com sucesso. O documento foi gerado e está disponível no Google Docs para visualização e edição."
  },
  {
    term: "Erro",
    definition: "Falha no processamento do TR que requer atenção. Pode indicar problemas na integração com N8N ou na geração do documento."
  },
  {
    term: "Template",
    definition: "Modelo pré-configurado de TR que contém estrutura, campos e formatação padrão. Agiliza a criação de novos documentos mantendo consistência."
  },
  {
    term: "Taxa de Sucesso",
    definition: "Percentual de TRs concluídos com sucesso em relação ao total de TRs criados no período. Indica a eficiência do sistema."
  },
  {
    term: "Tempo Médio de Processamento",
    definition: "Duração média entre a criação de um TR e sua conclusão. Calculado com base em todos os TRs finalizados no período."
  },
  {
    term: "Departamento",
    definition: "Unidade organizacional responsável pela criação e gestão de TRs. Permite análise segmentada de desempenho."
  },
  {
    term: "N8N",
    definition: "Plataforma de automação de fluxos de trabalho usada para processar e gerar documentos de TR automaticamente."
  },
  {
    term: "Callback",
    definition: "Mecanismo de resposta assíncrona onde o N8N notifica o sistema quando o processamento do TR é concluído."
  },
  {
    term: "Analytics",
    definition: "Análise de dados e estatísticas sobre o uso do sistema, incluindo métricas de desempenho, tendências e comparações."
  },
  {
    term: "KPI (Key Performance Indicator)",
    definition: "Indicador-chave de desempenho que mede o sucesso de uma atividade ou processo específico."
  }
];

export const GlossaryDialog = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTerms = glossaryTerms.filter(
    item =>
      item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" data-tour="reports-glossary">
          <BookOpen className="h-4 w-4 mr-2" />
          Glossário
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Glossário de Termos</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar termo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {filteredTerms.length > 0 ? (
                filteredTerms.map((item, index) => (
                  <div key={index} className="pb-4 border-b last:border-0">
                    <h4 className="font-semibold text-primary mb-2">{item.term}</h4>
                    <p className="text-sm text-muted-foreground">{item.definition}</p>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Nenhum termo encontrado para "{searchTerm}"
                </p>
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};
