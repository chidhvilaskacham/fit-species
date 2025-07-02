import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Mail, ArrowLeft } from 'lucide-react';

export default function ForgotPassword() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-neutral-800 rounded-2xl shadow-md p-6 sm:p-8 animate-fade-in border border-neutral-200 dark:border-neutral-700">
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-br from-mint-300 to-sky-300 rounded-2xl shadow-md">
              <Activity className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mb-2">Forgot Password</h1>
          <p className="text-neutral-600 dark:text-neutral-300">This feature is coming soon.</p>
        </div>

        <div className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
              <input
                id="email"
                type="email"
                disabled
                className="w-full pl-10 pr-4 py-3 sm:py-4 border border-neutral-300 dark:border-neutral-600 rounded-2xl transition-all bg-neutral-100 dark:bg-neutral-700 dark:text-white text-sm sm:text-base"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled
            className="w-full bg-gradient-to-r from-mint-300 to-sky-300 text-white py-3 sm:py-4 px-4 rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-md text-sm sm:text-base"
          >
            Send Reset Link
          </button>

          <div className="text-center">
            <Link
              to="/login"
              className="text-sm text-mint-600 hover:text-mint-700 font-medium transition-colors hover:scale-105 inline-flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Login</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
