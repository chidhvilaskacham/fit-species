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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/50 via-teal-50/30 to-cyan-50/50 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-800 flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-emerald-200/20 to-teal-200/20 rounded-full blur-xl floating-element"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-br from-cyan-200/20 to-blue-200/20 rounded-full blur-xl floating-element" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-32 left-32 w-40 h-40 bg-gradient-to-br from-teal-200/20 to-emerald-200/20 rounded-full blur-xl floating-element" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="text-center animate-fade-in-scale relative z-10">
        <div className="relative mb-8">
          {/* Outer spinning rings */}
          <div className={`animate-spin rounded-full ${sizeClasses[size]} border-4 border-transparent border-t-emerald-400 border-r-teal-400 mx-auto`}></div>
          <div className={`absolute inset-0 animate-spin rounded-full ${sizeClasses[size]} border-4 border-transparent border-b-cyan-400 border-l-blue-400 mx-auto`} style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          
          {/* Pulse rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full pulse-ring"></div>
          </div>
          
          {/* Inner logo */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <Activity className="h-6 w-6 text-emerald-500 animate-pulse" />
              <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-yellow-400 animate-ping" />
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-2xl font-bold gradient-text">{message}</h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-md mx-auto">
            Preparing your personalized wellness experience
          </p>
        </div>
        
        {/* Animated progress dots */}
        <div className="flex justify-center space-x-2 mt-8">
          <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>

        {/* Loading progress bar */}
        <div className="mt-8 w-64 mx-auto">
          <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-1">
            <div className="bg-gradient-to-r from-emerald-400 to-teal-500 h-1 rounded-full animate-pulse" style={{ width: '75%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}