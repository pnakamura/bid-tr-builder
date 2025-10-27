import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="p-6 bg-primary/5 rounded-full mb-6 animate-fade-in">
        <Icon className="h-12 w-12 text-primary/40" />
      </div>
      <h3 className="text-xl font-semibold mb-2 text-foreground">
        {title}
      </h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        {description}
      </p>
      {actionLabel && (actionHref || onAction) && (
        <>
          {actionHref ? (
            <Button asChild className="hover-scale">
              <Link to={actionHref}>{actionLabel}</Link>
            </Button>
          ) : (
            <Button onClick={onAction} className="hover-scale">
              {actionLabel}
            </Button>
          )}
        </>
      )}
    </div>
  );
};
