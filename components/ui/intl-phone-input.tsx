'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface IntlPhoneInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
}

export function IntlPhoneInput({
  value,
  onChange,
  className,
  disabled,
  placeholder = "98XXXXXXXX",
  ...props
}: IntlPhoneInputProps) {
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove all non-digits and limit to 10 digits
    const cleaned = e.target.value.replace(/\D/g, '').slice(0, 10);
    onChange(cleaned);
  };

  // Format display value with Nepal country code
  const displayValue = value ? `+977 ${value}` : '';

  return (
    <div className="relative flex items-center">
      {/* Static Nepal country code indicator */}
      <div className={cn(
        "absolute left-0 top-0 bottom-0 flex items-center px-3",
        "bg-muted/50 rounded-l-lg border-r",
        "text-sm font-medium text-muted-foreground",
        disabled && "opacity-50"
      )}>
        <span>+977</span>
      </div>

      <input
        type="tel"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
        disabled={disabled}
        placeholder={`+977 ${placeholder}`}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2",
          "pl-[60px] text-sm ring-offset-background",
          "placeholder:text-muted-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />

      {/* Character count indicator */}
      {value && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <span className={cn(
            "text-xs",
            value.length === 10 ? "text-green-600" : "text-amber-600"
          )}>
            {value.length}/10
          </span>
        </div>
      )}
    </div>
  );
}

export default IntlPhoneInput;