import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  variant?: 'default' | 'primary' | 'accent' | 'success';
}

export function StatsCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  className,
  variant = 'default'
}: StatsCardProps) {
  const getVariantStyles = (variant: StatsCardProps['variant']) => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-primary text-primary-foreground border-primary/20';
      case 'accent':
        return 'bg-gradient-accent text-accent-foreground border-accent/20';
      case 'success':
        return 'bg-success text-success-foreground border-success/20';
      default:
        return 'bg-card text-card-foreground border-border/50';
    }
  };

  const getIconStyles = (variant: StatsCardProps['variant']) => {
    switch (variant) {
      case 'primary':
      case 'accent':
      case 'success':
        return 'text-white/90';
      default:
        return 'text-primary';
    }
  };

  return (
    <Card className={cn(
      "transition-all duration-300 hover:shadow-soft hover:scale-[1.02] animate-fade-in",
      getVariantStyles(variant),
      className
    )}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className={cn(
              "text-sm font-medium",
              variant === 'default' ? 'text-muted-foreground' : 'text-white/70'
            )}>
              {title}
            </p>
            <div className="space-y-1">
              <p className="text-3xl font-bold tracking-tight">
                {value}
              </p>
              {subtitle && (
                <p className={cn(
                  "text-sm",
                  variant === 'default' ? 'text-muted-foreground' : 'text-white/70'
                )}>
                  {subtitle}
                </p>
              )}
            </div>
            {trend && (
              <div className={cn(
                "flex items-center text-sm font-medium",
                trend.isPositive ? 'text-success' : 'text-destructive',
                variant !== 'default' && trend.isPositive && 'text-white/90',
                variant !== 'default' && !trend.isPositive && 'text-white/90'
              )}>
                <span className="mr-1">
                  {trend.isPositive ? '↗' : '↘'}
                </span>
                {Math.abs(trend.value)}%
              </div>
            )}
          </div>
          <div className={cn(
            "p-3 rounded-lg",
            variant === 'default' ? 'bg-primary/10' : 'bg-white/10'
          )}>
            <Icon className={cn("w-6 h-6", getIconStyles(variant))} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}