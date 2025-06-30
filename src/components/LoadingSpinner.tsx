import React from 'react';
import { Activity } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function LoadingSpinner({ message = 'Loading...', size = 'md' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center">
      <div className="text-center animate-fade-in">
        <div className="relative">
          {/* Outer spinning ring */}
          <div className={`animate-spin rounded-full ${sizeClasses[size]} border-4 border-neutral-200 dark:border-neutral-700 border-t-mint-300 mx-auto`}></div>
          
          {/* Inner logo */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Activity className="h-6 w-6 text-mint-300" />
          </div>
        </div>
        
        <div className="mt-6 space-y-2">
          <p className="text-lg font-semibold text-neutral-900 dark:text-white">{message}</p>
          <p className="text-sm text-neutral-600 dark:text-neutral-300">Please wait while we set things up</p>
        </div>
        
        {/* Animated dots */}
        <div className="flex justify-center space-x-1 mt-4">
          <div className="w-2 h-2 bg-mint-300 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-mint-300 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-mint-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
}