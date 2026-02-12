// components/ui/StatusBadge.tsx
import React from 'react';

export interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'outline' | 'solid';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  className?: string;
}

const statusColorMap: Record<string, { bg: string; text: string; border: string }> = {
  // Withdrawal statuses
  pending: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  approved: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  rejected: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  completed: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  
  // Payment statuses
  paid: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  partial: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  unpaid: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' },
  
  // Default
  default: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' }
};

export function StatusBadge({ 
  status, 
  variant = 'outline', 
  size = 'md',
  icon,
  className = ''
}: StatusBadgeProps) {
  const colors = statusColorMap[status] || statusColorMap.default;
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm'
  };

  const variantClasses = {
    default: `${colors.bg} ${colors.text}`,
    outline: `bg-transparent border ${colors.border} ${colors.text}`,
    solid: `${colors.bg.replace('50', '600')} text-white border-transparent`
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        font-medium rounded-full
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span className="capitalize">{status}</span>
    </span>
  );
}