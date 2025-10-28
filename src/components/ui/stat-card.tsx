import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "primary" | "success" | "warning" | "destructive";
  className?: string;
}

const variantStyles = {
  default: {
    icon: "text-muted-foreground",
    iconBg: "bg-muted",
    border: "border-l-muted-foreground",
    gradient: "from-muted/50 to-transparent"
  },
  primary: {
    icon: "text-primary",
    iconBg: "bg-primary/10",
    border: "border-l-primary",
    gradient: "from-primary/10 to-transparent"
  },
  success: {
    icon: "text-success",
    iconBg: "bg-success/10",
    border: "border-l-success",
    gradient: "from-success/10 to-transparent"
  },
  warning: {
    icon: "text-warning",
    iconBg: "bg-warning/10",
    border: "border-l-warning",
    gradient: "from-warning/10 to-transparent"
  },
  destructive: {
    icon: "text-destructive",
    iconBg: "bg-destructive/10",
    border: "border-l-destructive",
    gradient: "from-destructive/10 to-transparent"
  }
};

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  variant = "default",
  className
}: StatCardProps) {
  const styles = variantStyles[variant];

  return (
    <Card 
      className={cn(
        "relative overflow-hidden border-l-4 transition-all duration-300",
        "hover:shadow-lg hover:-translate-y-1",
        styles.border,
        className
      )}
    >
      {/* Gradient Background */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-50",
        styles.gradient
      )} />
      
      <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={cn(
          "p-2 rounded-lg transition-transform duration-300 hover:scale-110",
          styles.iconBg
        )}>
          <Icon className={cn("h-4 w-4", styles.icon)} />
        </div>
      </CardHeader>
      
      <CardContent className="relative">
        <div className="flex items-baseline justify-between">
          <div className="text-3xl font-bold tracking-tight">
            {value}
          </div>
          {trend && (
            <div className={cn(
              "text-xs font-medium px-2 py-1 rounded-full",
              trend.isPositive 
                ? "bg-success/10 text-success" 
                : "bg-destructive/10 text-destructive"
            )}>
              {trend.isPositive ? "+" : ""}{trend.value}%
            </div>
          )}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-2">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
