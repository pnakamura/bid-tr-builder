import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon, MinusIcon, HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ReactNode } from "react";

interface KPICardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'stable';
  };
  tooltip?: string;
  dataTour?: string;
}

export const KPICard = ({ title, value, icon, trend, tooltip, dataTour }: KPICardProps) => {
  const getTrendIcon = () => {
    if (!trend) return null;
    
    switch (trend.direction) {
      case 'up':
        return <ArrowUpIcon className="h-4 w-4 text-green-500" />;
      case 'down':
        return <ArrowDownIcon className="h-4 w-4 text-red-500" />;
      case 'stable':
        return <MinusIcon className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTrendColor = () => {
    if (!trend) return '';
    
    switch (trend.direction) {
      case 'up':
        return 'text-green-500';
      case 'down':
        return 'text-red-500';
      case 'stable':
        return 'text-muted-foreground';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow" data-tour={dataTour}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              {tooltip && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <div className="flex items-end gap-2">
              <p className="text-3xl font-bold">{value}</p>
              {trend && (
                <div className={`flex items-center gap-1 mb-1 ${getTrendColor()}`}>
                  {getTrendIcon()}
                  <span className="text-sm font-medium">
                    {Math.abs(trend.value)}%
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="text-primary">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
