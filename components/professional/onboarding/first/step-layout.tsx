'use client';

import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';

interface StepLayoutProps {
  title: string;
  children: ReactNode;
}

export function StepLayout({ title, children }: StepLayoutProps) {
  return (
    <Card className="overflow-hidden border-0 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
      {/* Decorative header */}
      <div className="h-2 bg-gradient-to-r from-primary via-primary/50 to-primary/20" />
      
      <div className="p-8">
        <h2 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
          {title}
        </h2>
        
        <div className="space-y-6">
          {children}
        </div>
      </div>
    </Card>
  );
}