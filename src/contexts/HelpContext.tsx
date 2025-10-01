import React, { createContext, useContext, useState, useCallback } from 'react';

interface HelpStep {
  id: string;
  target: string;
  title: string;
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

interface HelpContextType {
  isHelpMode: boolean;
  currentStep: number;
  helpSteps: HelpStep[];
  startHelp: (steps: HelpStep[]) => void;
  endHelp: () => void;
  nextStep: () => void;
  previousStep: () => void;
  skipHelp: () => void;
}

const HelpContext = createContext<HelpContextType | undefined>(undefined);

export const useHelp = () => {
  const context = useContext(HelpContext);
  if (!context) {
    throw new Error('useHelp must be used within a HelpProvider');
  }
  return context;
};

export const HelpProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isHelpMode, setIsHelpMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [helpSteps, setHelpSteps] = useState<HelpStep[]>([]);

  const startHelp = useCallback((steps: HelpStep[]) => {
    setHelpSteps(steps);
    setCurrentStep(0);
    setIsHelpMode(true);
  }, []);

  const endHelp = useCallback(() => {
    setIsHelpMode(false);
    setCurrentStep(0);
    setHelpSteps([]);
  }, []);

  const nextStep = useCallback(() => {
    if (currentStep < helpSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      endHelp();
    }
  }, [currentStep, helpSteps.length, endHelp]);

  const previousStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const skipHelp = useCallback(() => {
    endHelp();
    localStorage.setItem('help_tour_completed', 'true');
  }, [endHelp]);

  return (
    <HelpContext.Provider
      value={{
        isHelpMode,
        currentStep,
        helpSteps,
        startHelp,
        endHelp,
        nextStep,
        previousStep,
        skipHelp,
      }}
    >
      {children}
    </HelpContext.Provider>
  );
};
