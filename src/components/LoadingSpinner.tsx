import React from 'react';
import { Activity, Sparkles } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-mint-50/50 via-sky-50/30 to-cyan-50/50 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-800 flex items-center justify-center">

      <div className="text-center animate-fade-in-scale relative z-10">
        <div className="relative mb-8">
          {/* Outer spinning rings */}
          <div className={`animate-spin rounded-full ${sizeClasses[size]} border-4 border-transparent border-t-orange-400 mx-auto`}></div>
          
          {/* Inner logo */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <Activity className="h-6 w-6 text-orange-500 animate-pulse" />
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">{message}</h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-md mx-auto">
            Preparing your personalized fitness experience
          </p>
        </div>
      </div>
    </div>
  );
}