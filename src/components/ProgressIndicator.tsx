import { Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Step {
  id: number;
  title: string;
  description: string;
}

interface ProgressIndicatorProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export const ProgressIndicator = ({ steps, currentStep, className }: ProgressIndicatorProps) => {
  return (
    <div className={cn("w-full py-6", className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = currentStep > stepNumber;
          const isCurrent = currentStep === stepNumber;
          const isUpcoming = currentStep < stepNumber;

          return (
            <div key={step.id} className="flex items-center">
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300",
                    {
                      "bg-primary border-primary text-primary-foreground": isCompleted,
                      "bg-primary/10 border-primary text-primary ring-4 ring-primary/20": isCurrent,
                      "bg-muted border-muted-foreground/20 text-muted-foreground": isUpcoming,
                    }
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <Circle className="h-4 w-4" fill="currentColor" />
                  )}
                </div>
                
                {/* Step Info */}
                <div className="mt-2 text-center max-w-[120px]">
                  <p
                    className={cn(
                      "text-sm font-medium transition-colors duration-300",
                      {
                        "text-primary": isCompleted || isCurrent,
                        "text-muted-foreground": isUpcoming,
                      }
                    )}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-4 mt-[-60px] transition-all duration-300",
                    {
                      "bg-primary": currentStep > stepNumber,
                      "bg-muted": currentStep <= stepNumber,
                    }
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