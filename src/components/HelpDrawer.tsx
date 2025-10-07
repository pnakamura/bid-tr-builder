import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { HelpCircle, BookOpen, Video, MessageCircle, Sparkles, CheckCircle2, FileText, Clock } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface HelpDrawerProps {
  onStartTour?: () => void;
}

export const HelpDrawer = ({ onStartTour }: HelpDrawerProps) => {
  const [open, setOpen] = useState(false);
  const [isPulsing, setIsPulsing] = useState(true);

  // Stop pulsing after user interacts
  useEffect(() => {
    const timer = setTimeout(() => setIsPulsing(false), 10000);
    return () => clearTimeout(timer);
  }, []);

  const faqs = [
    {
      question: 'Como criar um Termo de Referência?',
      answer: 'Para criar um TR, preencha os dados gerais (título, tipo, descrição), depois adicione especificações técnicas, defina o cronograma e orçamento, e por fim revise todas as informações antes de salvar.',
    },
    {
      question: 'O que são templates?',
      answer: 'Templates são modelos pré-configurados de Termos de Referência que aceleram o preenchimento. Você pode selecionar um template na etapa de dados gerais e ele preencherá automaticamente vários campos.',
    },
    {
      question: 'Como funciona o salvamento automático?',
      answer: 'O sistema salva automaticamente suas alterações a cada 30 segundos. Você verá um indicador de "Salvando..." ou "Salvo" no topo da página.',
    },
    {
      question: 'Quais campos são obrigatórios?',
      answer: 'Os campos marcados com asterisco (*) são obrigatórios. Cada etapa tem seus próprios campos obrigatórios que devem ser preenchidos antes de avançar.',
    },
    {
      question: 'Como adicionar especificações técnicas?',
      answer: 'Na etapa 2, você pode adicionar múltiplas especificações técnicas clicando em "Adicionar Especificação". Cada especificação pode ter descrição e requisitos específicos.',
    },
    {
      question: 'Posso editar um TR depois de salvá-lo?',
      answer: 'Sim! Você pode editar seus TRs a qualquer momento acessando a lista de relatórios e clicando no TR desejado.',
    },
    {
      question: 'O que é o cronograma de atividades?',
      answer: 'O cronograma permite você definir as etapas do projeto com datas de início e fim. Isso ajuda no planejamento e acompanhamento da execução.',
    },
    {
      question: 'Como funciona o orçamento?',
      answer: 'Na etapa de orçamento, você pode adicionar itens com descrição, quantidade, valor unitário. O sistema calcula automaticamente o valor total de cada item e o total geral.',
    },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={`fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-xl hover:shadow-2xl z-50 transition-all duration-300 hover:scale-110 bg-primary text-primary-foreground border-0 ${
            isPulsing ? 'animate-bounce' : ''
          }`}
          title="Ajuda"
          data-help-id="help-drawer"
          onClick={() => setIsPulsing(false)}
        >
          <HelpCircle className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-xl overflow-hidden flex flex-col">
        <SheetHeader className="pb-4 border-b">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <SheetTitle className="text-xl">Central de Ajuda</SheetTitle>
              <SheetDescription className="text-sm">
                Guias e recursos para aproveitar ao máximo o sistema
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1 -mx-6 px-6 py-6">
          <div className="space-y-6">
            {/* Quick Actions */}
            {onStartTour && (
              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base">Tour Guiado</CardTitle>
                    <Badge variant="secondary" className="ml-auto">Recomendado</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <CardDescription className="text-sm">
                    Aprenda a usar o sistema com um tour interativo passo a passo
                  </CardDescription>
                  <Button
                    className="w-full shadow-sm"
                    onClick={() => {
                      onStartTour();
                      setOpen(false);
                    }}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Iniciar Tour Guiado
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Quick Tips */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                Dicas Rápidas
              </h3>
              <div className="grid gap-3">
                <Card className="border-success/20">
                  <CardContent className="pt-4 pb-4">
                    <div className="flex gap-3">
                      <FileText className="h-5 w-5 text-success shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium mb-1">Use Templates</p>
                        <p className="text-xs text-muted-foreground">
                          Economize tempo usando modelos pré-configurados
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-primary/20">
                  <CardContent className="pt-4 pb-4">
                    <div className="flex gap-3">
                      <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium mb-1">Salvamento Automático</p>
                        <p className="text-xs text-muted-foreground">
                          Suas alterações são salvas automaticamente a cada 30s
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Separator />

            {/* FAQs */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-primary" />
                Perguntas Frequentes
              </h3>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left text-sm hover:text-primary transition-colors">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            <Separator />

            {/* Support */}
            <Card className="border-muted">
              <CardContent className="pt-6">
                <div className="text-center space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Não encontrou o que procura?
                  </p>
                  <Button variant="outline" className="w-full" asChild>
                    <a href="mailto:suporte@example.com">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Entrar em Contato
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
