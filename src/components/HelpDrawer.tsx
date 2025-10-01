import { useState } from 'react';
import { Button } from '@/components/ui/button';
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
import { HelpCircle, BookOpen, Video, MessageCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface HelpDrawerProps {
  onStartTour?: () => void;
}

export const HelpDrawer = ({ onStartTour }: HelpDrawerProps) => {
  const [open, setOpen] = useState(false);

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
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
          title="Ajuda"
        >
          <HelpCircle className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Central de Ajuda</SheetTitle>
          <SheetDescription>
            Encontre respostas para suas dúvidas sobre o sistema
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-120px)] mt-6 pr-4">
          <div className="space-y-6">
            {/* Quick Actions */}
            {onStartTour && (
              <div className="space-y-3">
                <h3 className="font-semibold text-sm">Ações Rápidas</h3>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    onStartTour();
                    setOpen(false);
                  }}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Iniciar Tour Guiado
                </Button>
              </div>
            )}

            {/* FAQs */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm">Perguntas Frequentes</h3>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left text-sm">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Resources */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm">Recursos</h3>
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <a href="#" onClick={(e) => e.preventDefault()}>
                    <Video className="h-4 w-4 mr-2" />
                    Vídeos Tutoriais
                  </a>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <a href="#" onClick={(e) => e.preventDefault()}>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Suporte
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
