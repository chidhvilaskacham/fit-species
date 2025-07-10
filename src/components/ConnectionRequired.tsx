import React from 'react';
import { Activity, Database, ExternalLink, AlertCircle } from 'lucide-react';

export default function ConnectionRequired() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white dark:bg-neutral-800 rounded-2xl shadow-md p-6 sm:p-8 text-center animate-fade-in border border-neutral-200 dark:border-neutral-700">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="p-4 bg-gradient-to-br from-mint-300 to-sky-300 rounded-2xl shadow-md">
              <Activity className="h-16 w-16 sm:h-20 sm:w-20 text-white" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-red-100 dark:bg-red-900/20 rounded-full p-2">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
          Welcome to Fit Species
        </h1>
        
        <p className="text-lg sm:text-xl text-neutral-600 dark:text-neutral-300 mb-8">
          Your complete fitness platform for tracking workouts, nutrition, and achieving your fitness goals.
        </p>

        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6 mb-8">
          <div className="flex items-start space-x-3">
            <Database className="h-6 w-6 text-amber-600 mt-1 flex-shrink-0" />
            <div className="text-left">
              <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-200 mb-2">Database Connection Required</h3>
              <p className="text-amber-700 dark:text-amber-300 mb-4">
                Fit Species uses Supabase to securely store your fitness data, workout logs, nutrition tracking, and progress monitoring. 
                Click the "Connect to Supabase" button in the top right corner to set up your database.
              </p>
              <div className="space-y-2 text-sm text-amber-600 dark:text-amber-400">
                <p>✓ Secure data storage & encryption</p>
                <p>✓ Real-time synchronization across devices</p>
                <p>✓ Automatic backup & recovery</p>
                <p>✓ AI-powered fitness insights</p>
                <p>✓ Multi-device access</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-mint-50 dark:bg-mint-900/20 rounded-2xl p-6 border border-mint-200 dark:border-mint-800">
            <h3 className="font-semibold text-neutral-900 dark:text-white mb-3">New to Supabase?</h3>
            <p className="text-neutral-600 dark:text-neutral-300 text-sm mb-4">
              Supabase is a free, open-source backend platform that provides secure database hosting with enterprise-grade security.
            </p>
            <a
              href="https://supabase.com/docs/guides/getting-started"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 text-mint-600 hover:text-mint-700 font-medium text-sm transition-colors hover:scale-105"
            >
              <span>Get started with Supabase</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
          
          <div className="bg-sky-50 dark:bg-sky-900/20 rounded-2xl p-6 border border-sky-200 dark:border-sky-800">
            <h3 className="font-semibold text-neutral-900 dark:text-white mb-3">Already have Supabase?</h3>
            <p className="text-neutral-600 dark:text-neutral-300 text-sm mb-4">
              Click "Connect to Supabase" above and enter your project URL and API key to get started immediately.
            </p>
            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 text-sky-600 hover:text-sky-700 font-medium text-sm transition-colors hover:scale-105"
            >
              <span>Go to Supabase Dashboard</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <strong>Privacy First:</strong> Your data is stored securely in your own Supabase project. 
            Fit Species doesn't have access to your personal information or fitness data.
          </p>
        </div>
      </div>
    </div>
  );
}