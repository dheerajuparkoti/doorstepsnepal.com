// components/ui/professional-payment/NetworkBanner.tsx
import React, { useState, useEffect } from 'react';

interface NetworkBannerProps {
  controller?: any; // Optional controller for custom offline handling
}

export function NetworkBanner({ controller }: NetworkBannerProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setWasOffline(true);
      
      // Auto-hide after 3 seconds
      setTimeout(() => setWasOffline(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Don't show anything if online and never went offline
  if (isOnline && !wasOffline) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 md:static md:mb-4">
      {!isOnline ? (
        // Offline Banner
        <div className="bg-orange-50 dark:bg-orange-900/20 border-b border-orange-200 dark:border-orange-800">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-orange-800 dark:text-orange-300">
                    You are offline
                  </p>
                  <p className="text-xs text-orange-700 dark:text-orange-400">
                    Some features may be unavailable. Check your internet connection.
                  </p>
                </div>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="flex items-center space-x-1 px-3 py-1.5 bg-orange-100 dark:bg-orange-900/40 rounded-lg text-orange-700 dark:text-orange-300 text-sm font-medium hover:bg-orange-200 dark:hover:bg-orange-900/60 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Retry</span>
              </button>
            </div>
          </div>
        </div>
      ) : wasOffline && (
        // Back Online Banner (auto-hides)
        <div className="bg-green-50 dark:bg-green-900/20 border-b border-green-200 dark:border-green-800 animate-fade-out">
          <div className="container mx-auto px-4 py-2">
            <div className="flex items-center justify-center space-x-2">
              <svg className="h-4 w-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-sm font-medium text-green-800 dark:text-green-300">
                Back online! Your data is up to date.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}