import { useEffect, useRef, useState } from 'react';
import { useHelp } from '@/contexts/HelpContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

export const HelpTour = () => {
  const { isHelpMode, currentStep, helpSteps, nextStep, previousStep, skipHelp } = useHelp();
  const overlayRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!isHelpMode || helpSteps.length === 0) return;

    setIsAnimating(true);
    const animationTimer = setTimeout(() => setIsAnimating(false), 300);

    const currentHelpStep = helpSteps[currentStep];
    const targetElement = document.querySelector(currentHelpStep.target);

    if (!targetElement || !tooltipRef.current) return;

    // Scroll and highlight with delay for smooth animation
    setTimeout(() => {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      targetElement.classList.add('help-highlight');
    }, 100);

    const updatePosition = () => {
      const rect = targetElement.getBoundingClientRect();
      const tooltip = tooltipRef.current;
      if (!tooltip) return;

      const placement = currentHelpStep.placement || 'bottom';
      const spacing = 24;
      let top = 0;
      let left = 0;

      // Calculate position with viewport bounds checking
      switch (placement) {
        case 'top':
          top = Math.max(spacing, rect.top - tooltip.offsetHeight - spacing);
          left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2;
          break;
        case 'bottom':
          top = rect.bottom + spacing;
          left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2;
          break;
        case 'left':
          top = rect.top + rect.height / 2 - tooltip.offsetHeight / 2;
          left = Math.max(spacing, rect.left - tooltip.offsetWidth - spacing);
          break;
        case 'right':
          top = rect.top + rect.height / 2 - tooltip.offsetHeight / 2;
          left = Math.min(window.innerWidth - tooltip.offsetWidth - spacing, rect.right + spacing);
          break;
      }

      // Keep within viewport bounds
      left = Math.max(spacing, Math.min(left, window.innerWidth - tooltip.offsetWidth - spacing));
      top = Math.max(spacing, Math.min(top, window.innerHeight - tooltip.offsetHeight - spacing));

      tooltip.style.top = `${top}px`;
      tooltip.style.left = `${left}px`;
      tooltip.setAttribute('data-placement', placement);
    };

    // Initial position
    setTimeout(updatePosition, 200);

    // Update on scroll/resize
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      targetElement.classList.remove('help-highlight');
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
      clearTimeout(animationTimer);
    };
  }, [isHelpMode, currentStep, helpSteps]);

  if (!isHelpMode || helpSteps.length === 0) return null;

  const currentHelpStep = helpSteps[currentStep];
  const progressPercentage = ((currentStep + 1) / helpSteps.length) * 100;

  return (
    <>
      {/* Overlay with smooth fade */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black/60 z-[9998] pointer-events-none animate-fade-in backdrop-blur-sm"
      />

      {/* Tooltip with improved design */}
      <Card
        ref={tooltipRef}
        className={`fixed z-[9999] w-96 max-w-[calc(100vw-2rem)] shadow-2xl border-2 transition-all duration-300 ${
          isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        } help-tour-card`}
      >
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-muted rounded-t-lg overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        <div className="p-5 pt-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 pr-2">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                <h3 className="font-bold text-lg leading-tight">{currentHelpStep.title}</h3>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">
                  {currentStep + 1} de {helpSteps.length}
                </span>
                <Progress value={progressPercentage} className="flex-1 h-1.5" />
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={skipHelp}
              className="h-8 w-8 -mr-2 -mt-1 hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <p className="text-sm leading-relaxed mb-5 text-foreground/90">
            {currentHelpStep.content}
          </p>

          {/* Actions */}
          <div className="flex items-center justify-between gap-3 pt-3 border-t">
            <Button
              variant="ghost"
              size="sm"
              onClick={skipHelp}
              className="text-muted-foreground hover:text-foreground"
            >
              Pular tour
            </Button>

            <div className="flex gap-2">
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={previousStep}
                  className="gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </Button>
              )}
              <Button
                size="sm"
                onClick={nextStep}
                className="gap-1 shadow-sm hover:shadow-md transition-shadow"
              >
                {currentStep === helpSteps.length - 1 ? (
                  <>
                    Concluir
                    <Sparkles className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Próximo
                    <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Pointer/Arrow indicator */}
        <div className="help-tour-pointer" />
      </Card>
    </>
  );
};
