import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon, Edit } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';

interface DetailItemProps {
  icon: LucideIcon;
  title: string;
  value: ReactNode;
  isEditable?: boolean;
  onEdit?: () => void;
  className?: string;
  description?: string;
  status?: 'default' | 'success' | 'warning' | 'error' | 'info';
}

export function DetailItem({ 
  icon: Icon, 
  title, 
  value, 
  isEditable = false, 
  onEdit,
  className,
  description,
  status = 'default'
}: DetailItemProps) {
  const statusColors = {
    default: 'border-border hover:border-primary/50 dark:hover:border-primary/70',
    success: 'border-green-200 dark:border-green-800 hover:border-green-300 dark:hover:border-green-600',
    warning: 'border-amber-200 dark:border-amber-800 hover:border-amber-300 dark:hover:border-amber-600',
    error: 'border-red-200 dark:border-red-800 hover:border-red-300 dark:hover:border-red-600',
    info: 'border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-600'
  };

  const iconColors = {
    default: 'text-primary',
    success: 'text-green-600 dark:text-green-400',
    warning: 'text-amber-600 dark:text-amber-400',
    error: 'text-red-600 dark:text-red-400',
    info: 'text-blue-600 dark:text-blue-400'
  };

  const iconBackgrounds = {
    default: 'bg-primary/10 dark:bg-primary/20',
    success: 'bg-green-100 dark:bg-green-900/30',
    warning: 'bg-amber-100 dark:bg-amber-900/30',
    error: 'bg-red-100 dark:bg-red-900/30',
    info: 'bg-blue-100 dark:bg-blue-900/30'
  };

  return (
    <Card className={cn(
      "border transition-all duration-200 hover:shadow-md dark:hover:shadow-lg overflow-hidden bg-card",
      statusColors[status],
      className
    )}>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          {/* Left side: Icon and Content */}
          <div className="flex items-center space-x-4 min-w-0 flex-1">
            {/* Icon Container */}
            <div className={cn(
              "flex-shrink-0 p-3 rounded-xl",
              iconBackgrounds[status]
            )}>
              <Icon className={cn("h-5 w-5", iconColors[status])} />
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
              <div className="flex items-center space-x-2">
                <p className="text-base md:text-lg font-semibold text-foreground truncate">
                  {value}
                </p>
                {description && (
                  <span className="text-sm text-muted-foreground hidden md:inline">
                    • {description}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right side: Edit Button */}
          {isEditable && onEdit && (
            <button
              onClick={onEdit}
              className="flex-shrink-0 group flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors"
              aria-label={`Edit ${title}`}
            >
              <span className="text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity hidden sm:inline">
                Edit
              </span>
              <div className={cn(
                "p-2 rounded-full transition-colors",
                iconBackgrounds.default
              )}>
                <Edit className="h-4 w-4 text-primary" />
              </div>
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}