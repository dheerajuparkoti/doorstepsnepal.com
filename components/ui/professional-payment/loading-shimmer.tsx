// components/ui/LoadingShimmer.tsx
import React from 'react';

interface LoadingShimmerProps {
  type?: 'card' | 'list' | 'grid' | 'profile';
  count?: number;
}

export function LoadingShimmer({ type = 'card', count = 3 }: LoadingShimmerProps) {
  const renderShimmer = () => {
    switch (type) {
      case 'card':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse" />
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6 animate-pulse" />
            </div>
          </div>
        );

      case 'grid':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="mt-4 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        );

      case 'profile':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <div className="flex flex-col items-center">
              <div className="h-24 w-24 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
              <div className="mt-4 space-y-2 w-full">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto animate-pulse" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mx-auto animate-pulse" />
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-3">
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            ))}
          </div>
        );
    }
  };

  return <div className="w-full">{renderShimmer()}</div>;
}