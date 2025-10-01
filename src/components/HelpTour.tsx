import { useEffect, useRef } from 'react';
import { useHelp } from '@/contexts/HelpContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export const HelpTour = () => {
  const { isHelpMode, currentStep, helpSteps, nextStep, previousStep, skipHelp } = useHelp();
  const overlayRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isHelpMode || helpSteps.length === 0) return;

    const currentHelpStep = helpSteps[currentStep];
    const targetElement = document.querySelector(currentHelpStep.target);

    if (!targetElement || !tooltipRef.current) return;

    const rect = targetElement.getBoundingClientRect();
    const tooltip = tooltipRef.current;

    // Highlight the target element
    targetElement.classList.add('help-highlight');
    targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Position tooltip
    const placement = currentHelpStep.placement || 'bottom';
    let top = 0;
    let left = 0;

    switch (placement) {
      case 'top':
        top = rect.top - tooltip.offsetHeight - 16;
        left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2;
        break;
      case 'bottom':
        top = rect.bottom + 16;
        left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2;
        break;
      case 'left':
        top = rect.top + rect.height / 2 - tooltip.offsetHeight / 2;
        left = rect.left - tooltip.offsetWidth - 16;
        break;
      case 'right':
        top = rect.top + rect.height / 2 - tooltip.offsetHeight / 2;
        left = rect.right + 16;
        break;
    }

    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;

    return () => {
      targetElement.classList.remove('help-highlight');
    };
  }, [isHelpMode, currentStep, helpSteps]);

  if (!isHelpMode || helpSteps.length === 0) return null;

  const currentHelpStep = helpSteps[currentStep];

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black/50 z-[9998] pointer-events-none"
        style={{ backdropFilter: 'blur(2px)' }}
      />

      {/* Tooltip */}
      <Card
        ref={tooltipRef}
        className="fixed z-[9999] w-80 p-4 shadow-lg"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{currentHelpStep.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Passo {currentStep + 1} de {helpSteps.length}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={skipHelp}
            className="h-8 w-8 -mr-2 -mt-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <p className="text-sm mb-4">{currentHelpStep.content}</p>

        <div className="flex items-center justify-between gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={skipHelp}
          >
            Pular tour
          </Button>

          <div className="flex gap-2">
            {currentStep > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={previousStep}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Anterior
              </Button>
            )}
            <Button
              size="sm"
              onClick={nextStep}
            >
              {currentStep === helpSteps.length - 1 ? 'Concluir' : 'Próximo'}
              {currentStep < helpSteps.length - 1 && (
                <ChevronRight className="h-4 w-4 ml-1" />
              )}
            </Button>
          </div>
        </div>
      </Card>
    </>
  );
};
