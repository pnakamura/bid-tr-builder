import { Label } from "@/components/ui/label";
import { FieldHelp } from "./FieldHelp";
import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  helpText?: string;
  error?: string;
  success?: boolean;
  required?: boolean;
  children: React.ReactNode;
  htmlFor?: string;
  dataHelpId?: string;
}

export const FormField = ({
  label,
  helpText,
  error,
  success,
  required,
  children,
  htmlFor,
  dataHelpId
}: FormFieldProps) => {
  return (
    <div data-help-id={dataHelpId} className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={htmlFor} className="flex items-center gap-1">
          {label} {required && <span className="text-destructive">*</span>}
          {helpText && <FieldHelp content={helpText} />}
        </Label>
        {success && (
          <div className="flex items-center gap-1 text-xs text-success animate-in fade-in">
            <CheckCircle2 className="h-3 w-3" />
            <span>Válido</span>
          </div>
        )}
      </div>
      
      <div className="relative">
        {children}
        {error && (
          <div className="flex items-center gap-1 mt-1 text-xs text-destructive animate-in fade-in slide-in-from-top-1">
            <XCircle className="h-3 w-3" />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
};
