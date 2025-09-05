import { useState, useEffect, useCallback, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

type SaveStatus = "saved" | "saving" | "error" | "pending";

interface UseAutoSaveProps {
  data: Record<string, any>;
  onSave: (data: Record<string, any>) => Promise<void>;
  delay?: number; // milliseconds
  enabled?: boolean;
}

export const useAutoSave = ({
  data,
  onSave,
  delay = 2000,
  enabled = true
}: UseAutoSaveProps) => {
  const [status, setStatus] = useState<SaveStatus>("saved");
  const [lastSaved, setLastSaved] = useState<Date>(new Date());
  const timeoutRef = useRef<NodeJS.Timeout>();
  const previousDataRef = useRef<string>("");
  const { toast } = useToast();

  const save = useCallback(async () => {
    if (!enabled) return;

    setStatus("saving");
    try {
      await onSave(data);
      setStatus("saved");
      setLastSaved(new Date());
      previousDataRef.current = JSON.stringify(data);
    } catch (error) {
      setStatus("error");
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar automaticamente. Tente novamente.",
        variant: "destructive",
      });
    }
  }, [data, onSave, enabled, toast]);

  const triggerSave = useCallback(() => {
    if (!enabled) return;

    const currentDataString = JSON.stringify(data);
    
    // Só salva se os dados mudaram
    if (currentDataString === previousDataRef.current) {
      return;
    }

    setStatus("pending");

    // Limpa timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Agenda novo save
    timeoutRef.current = setTimeout(save, delay);
  }, [data, save, delay, enabled]);

  useEffect(() => {
    triggerSave();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [triggerSave]);

  const forceSave = useCallback(async () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    await save();
  }, [save]);

  return {
    status,
    lastSaved,
    forceSave,
    isEnabled: enabled
  };
};