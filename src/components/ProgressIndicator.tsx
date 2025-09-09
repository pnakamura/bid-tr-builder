import { Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Step {
  id: number;
  title: string;
  description: string;
  progress?: number;
  completed?: boolean;
}

interface ProgressIndicatorProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (stepId: number) => void;
  className?: string;
}

export const ProgressIndicator = ({ steps, currentStep, onStepClick, className }: ProgressIndicatorProps) => {
  return (
    <div className={cn("w-full py-6", className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = step.completed || step.id < currentStep;
          const isCurrent = step.id === currentStep;
          const isUpcoming = step.id > currentStep;
          const progress = step.progress || 0;
          
          return (
            <div key={step.id} className="flex items-center">
              {/* Step indicator */}
              <div className="flex flex-col items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onStepClick?.(step.id)}
                  disabled={!onStepClick}
                  className={cn(
                    "relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 p-0",
                    "hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary/50",
                    isCompleted && "bg-success border-success text-success-foreground hover:bg-success/90",
                    isCurrent && "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90",
                    isUpcoming && "bg-muted border-muted-foreground/30 text-muted-foreground hover:bg-muted/80",
                    onStepClick && "cursor-pointer hover:shadow-lg",
                    !onStepClick && "cursor-default"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-semibold">{step.id}</span>
                  )}
                  
                  {/* Progress indicator for current step */}
                  {isCurrent && progress > 0 && progress < 100 && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-background rounded-full border border-primary">
                      <div 
                        className="w-full h-full bg-primary rounded-full transition-all duration-300"
                        style={{ 
                          background: `conic-gradient(hsl(var(--primary)) ${progress * 3.6}deg, hsl(var(--muted)) 0deg)` 
                        }}
                      />
                    </div>
                  )}
                </Button>
                
                {/* Step content - Hidden on mobile */}
                <div className="hidden md:block mt-3 text-center max-w-[150px]">
                  <div 
                    className={cn(
                      "text-sm font-medium transition-colors",
                      isCurrent && "text-primary",
                      isCompleted && "text-success",
                      isUpcoming && "text-muted-foreground"
                    )}
                  >
                    {step.title}
                  </div>
                  <div 
                    className={cn(
                      "text-xs mt-1 transition-colors",
                      isCurrent && "text-primary/70",
                      isCompleted && "text-success/70", 
                      isUpcoming && "text-muted-foreground/70"
                    )}
                  >
                    {step.description}
                  </div>
                  
                  {/* Progress percentage for current step */}
                  {isCurrent && progress > 0 && (
                    <div className="text-xs text-primary/60 mt-1">
                      {progress}% completo
                    </div>
                  )}
                </div>
              </div>
              
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div 
                  className={cn(
                    "hidden md:block h-px flex-1 mx-4 transition-all duration-500",
                    isCompleted && "bg-success",
                    isCurrent && "bg-gradient-to-r from-primary to-muted-foreground/30",
                    isUpcoming && "bg-muted-foreground/30"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};