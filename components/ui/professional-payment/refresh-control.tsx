// components/ui/professional-payment/RefreshControl.tsx
import React, { useState, useCallback } from 'react';

interface RefreshControlProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  className?: string;
}

export function RefreshControl({ onRefresh, children, className = '' }: RefreshControlProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [startY, setStartY] = useState(0);
  const [pullDistance, setPullDistance] = useState(0);
  const maxPullDistance = 80;
  const threshold = 60;

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      setStartY(e.touches[0].clientY);
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (startY > 0) {
      const currentY = e.touches[0].clientY;
      const diff = currentY - startY;
      
      if (diff > 0 && window.scrollY === 0) {
        e.preventDefault();
        const distance = Math.min(diff * 0.5, maxPullDistance);
        setPullDistance(distance);
      }
    }
  }, [startY]);

  const handleTouchEnd = useCallback(async () => {
    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }
    setStartY(0);
    setPullDistance(0);
  }, [pullDistance, isRefreshing, onRefresh]);

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`relative ${className}`}
    >
      {/* Pull to refresh indicator */}
      <div 
        className="absolute left-0 right-0 flex justify-center transition-transform"
        style={{ 
          transform: `translateY(${pullDistance - 50}px)`,
          opacity: Math.min(pullDistance / threshold, 1)
        }}
      >
        <div className="bg-white dark:bg-gray-800 rounded-full shadow-lg px-4 py-2 flex items-center space-x-2">
          {isRefreshing ? (
            <>
              <svg className="animate-spin h-4 w-4 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-sm text-gray-700 dark:text-gray-300">Refreshing...</span>
            </>
          ) : (
            <>
              <svg className="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="text-sm text-gray-700 dark:text-gray-300">Pull to refresh</span>
            </>
          )}
        </div>
      </div>

      {/* Content with pull effect */}
      <div style={{ transform: `translateY(${pullDistance}px)` }}>
        {children}
      </div>
    </div>
  );
}