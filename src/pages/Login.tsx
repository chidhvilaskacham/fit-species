import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await signIn(email, password);
    
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Welcome back to Fit Species!');
      navigate('/dashboard');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-neutral-800 rounded-2xl shadow-md p-6 sm:p-8 animate-fade-in border border-neutral-200 dark:border-neutral-700">
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-br from-mint-300 to-sky-300 rounded-2xl shadow-md">
              <Activity className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mb-2">Welcome Back</h1>
          <p className="text-neutral-600 dark:text-neutral-300">Sign in to continue your fitness journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 sm:py-4 border border-neutral-300 dark:border-neutral-600 rounded-2xl focus:ring-2 focus:ring-mint-300 focus:border-mint-300 transition-all bg-neutral-50 dark:bg-neutral-700 dark:text-white hover:scale-105 text-sm sm:text-base"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 sm:py-4 border border-neutral-300 dark:border-neutral-600 rounded-2xl focus:ring-2 focus:ring-mint-300 focus:border-mint-300 transition-all bg-neutral-50 dark:bg-neutral-700 dark:text-white hover:scale-105 text-sm sm:text-base"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors hover:scale-105"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-mint-300 to-sky-300 text-white py-3 sm:py-4 px-4 rounded-2xl hover:scale-105 focus:ring-2 focus:ring-mint-300 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-md text-sm sm:text-base"
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Signing In...</span>
              </div>
            ) : (
              'Sign In'
            )}
          </button>

          <div className="text-center space-y-4">
            <Link
              to="/forgot-password"
              className="text-sm text-mint-600 hover:text-mint-700 font-medium transition-colors hover:scale-105 inline-block"
            >
              Forgot your password?
            </Link>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-300 dark:border-neutral-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400">New to Fit Species?</span>
              </div>
            </div>
            
            <Link
              to="/signup"
              className="block w-full text-center py-3 sm:py-4 px-4 border-2 border-mint-300 text-mint-600 rounded-2xl hover:bg-mint-50 dark:hover:bg-mint-900/20 hover:scale-105 transition-all font-medium text-sm sm:text-base"
            >
              Create your free account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}