import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface ActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  variant?: "primary" | "secondary" | "accent";
  className?: string;
}

const variantStyles = {
  primary: {
    gradient: "from-primary/10 via-primary/5 to-transparent",
    iconBg: "from-primary to-primary-dark",
    iconColor: "text-white",
    hoverShadow: "hover:shadow-primary/20"
  },
  secondary: {
    gradient: "from-secondary/10 via-secondary/5 to-transparent",
    iconBg: "from-secondary to-accent",
    iconColor: "text-white",
    hoverShadow: "hover:shadow-secondary/20"
  },
  accent: {
    gradient: "from-accent/10 via-accent/5 to-transparent",
    iconBg: "from-accent to-secondary",
    iconColor: "text-white",
    hoverShadow: "hover:shadow-accent/20"
  }
};

export function ActionCard({
  title,
  description,
  icon: Icon,
  href,
  variant = "primary",
  className
}: ActionCardProps) {
  const styles = variantStyles[variant];

  return (
    <Link to={href} className="block">
      <Card className={cn(
        "group relative overflow-hidden",
        "hover:shadow-xl hover:-translate-y-2",
        "transition-all duration-300",
        styles.hoverShadow,
        className
      )}>
        {/* Background Gradient */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-50",
          "group-hover:opacity-70 transition-opacity duration-300",
          styles.gradient
        )} />
        
        <CardContent className="relative p-6">
          <div className="flex items-start gap-4">
            <div className={cn(
              "p-3 rounded-xl shadow-md",
              "bg-gradient-to-br",
              "group-hover:scale-110 transition-transform duration-300",
              styles.iconBg
            )}>
              <Icon className={cn("h-6 w-6", styles.iconColor)} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-1 group-hover:text-primary transition-colors">
                {title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {description}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
