import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PendingApprovalBannerProps {
  label?: string;
  className?: string;
}

export function PendingApprovalBanner({ label, className }: PendingApprovalBannerProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm',
        className,
      )}
    >
      <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
      <span className="text-amber-800 font-medium">
        {label ?? 'Pending admin approval — changes are locked until reviewed.'}
      </span>
    </div>
  );
}
