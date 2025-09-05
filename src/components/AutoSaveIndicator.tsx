import { useEffect, useState } from "react";
import { Check, Clock, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type SaveStatus = "saved" | "saving" | "error" | "pending";

interface AutoSaveIndicatorProps {
  status?: SaveStatus;
  lastSaved?: Date;
  className?: string;
}

export const AutoSaveIndicator = ({ 
  status = "saved", 
  lastSaved = new Date(), 
  className 
}: AutoSaveIndicatorProps) => {
  const [timeAgo, setTimeAgo] = useState<string>("");

  useEffect(() => {
    const updateTimeAgo = () => {
      const now = new Date();
      const diffMs = now.getTime() - lastSaved.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      
      if (diffMins < 1) {
        setTimeAgo("agora");
      } else if (diffMins < 60) {
        setTimeAgo(`${diffMins} min atrás`);
      } else {
        const diffHours = Math.floor(diffMins / 60);
        setTimeAgo(`${diffHours}h atrás`);
      }
    };

    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [lastSaved]);

  const getStatusConfig = () => {
    switch (status) {
      case "saving":
        return {
          icon: Loader2,
          text: "Salvando...",
          className: "text-blue-600 animate-spin",
        };
      case "error":
        return {
          icon: AlertCircle,
          text: "Erro ao salvar",
          className: "text-destructive",
        };
      case "pending":
        return {
          icon: Clock,
          text: "Alterações pendentes",
          className: "text-yellow-600",
        };
      default:
        return {
          icon: Check,
          text: `Salvo ${timeAgo}`,
          className: "text-green-600",
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div className={cn(
      "flex items-center gap-2 text-sm transition-all duration-300",
      className
    )}>
      <Icon className={cn("h-4 w-4", config.className)} />
      <span className={cn("font-medium", config.className)}>
        {config.text}
      </span>
    </div>
  );
};