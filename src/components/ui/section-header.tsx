import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  icon: LucideIcon;
  title: string;
  description: string;
  badge?: string;
  className?: string;
}

export function SectionHeader({
  icon: Icon,
  title,
  description,
  badge,
  className
}: SectionHeaderProps) {
  return (
    <div className={cn(
      "flex items-start gap-4 p-8 rounded-xl",
      "bg-gradient-to-br from-primary/10 via-primary/5 to-transparent",
      "border border-primary/20 shadow-sm",
      "hover:shadow-md transition-all duration-300",
      className
    )}>
      <div className="p-3 bg-gradient-to-br from-primary to-primary-dark rounded-xl shadow-lg">
        <Icon className="h-8 w-8 text-white" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-primary-dark to-secondary bg-clip-text text-transparent">
            {title}
          </h1>
          {badge && (
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-accent/20 to-secondary/20 text-accent-foreground border border-accent/30">
              {badge}
            </span>
          )}
        </div>
        <p className="text-lg text-muted-foreground max-w-3xl">
          {description}
        </p>
      </div>
    </div>
  );
}
