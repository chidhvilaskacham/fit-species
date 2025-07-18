import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('Please enter your full name');
      return false;
    }
    if (!formData.email) {
      toast.error('Please enter your email address');
      return false;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    const { error } = await signUp(formData.email, formData.password);
    
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Welcome to Fit Species! Let\'s set up your profile.');
      navigate('/profile-setup');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-mint-50 via-sky-50 to-cyan-50 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-800 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-mint-200/20 to-sky-200/20 rounded-full blur-xl floating-element"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-br from-cyan-200/20 to-blue-200/20 rounded-full blur-xl floating-element" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-32 left-32 w-40 h-40 bg-gradient-to-br from-sky-200/20 to-mint-200/20 rounded-full blur-xl floating-element" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="max-w-md w-full bg-white/80 dark:bg-neutral-800/80 backdrop-blur-xl rounded-3xl shadow-xl p-6 sm:p-8 animate-fade-in border border-white/20 dark:border-neutral-700/30 relative z-10">
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-gradient-to-br from-mint-400 to-sky-500 rounded-3xl shadow-lg">
              <Activity className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-2">Join NutriTrack</h1>
          <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-2">Join Fit Species</h1>
          <p className="text-neutral-600 dark:text-neutral-300">Start your complete fitness journey today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 sm:py-4 border border-neutral-300/50 dark:border-neutral-600/50 rounded-2xl focus:ring-2 focus:ring-mint-400 focus:border-mint-400 transition-all bg-white/80 dark:bg-neutral-700/80 backdrop-blur-sm dark:text-white hover:scale-105 text-sm sm:text-base shadow-lg"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 sm:py-4 border border-neutral-300/50 dark:border-neutral-600/50 rounded-2xl focus:ring-2 focus:ring-mint-400 focus:border-mint-400 transition-all bg-white/80 dark:bg-neutral-700/80 backdrop-blur-sm dark:text-white hover:scale-105 text-sm sm:text-base shadow-lg"
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
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 sm:py-4 border border-neutral-300/50 dark:border-neutral-600/50 rounded-2xl focus:ring-2 focus:ring-mint-400 focus:border-mint-400 transition-all bg-white/80 dark:bg-neutral-700/80 backdrop-blur-sm dark:text-white hover:scale-105 text-sm sm:text-base shadow-lg"
                  placeholder="Create a secure password"
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

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 sm:py-4 border border-neutral-300/50 dark:border-neutral-600/50 rounded-2xl focus:ring-2 focus:ring-mint-400 focus:border-mint-400 transition-all bg-white/80 dark:bg-neutral-700/80 backdrop-blur-sm dark:text-white hover:scale-105 text-sm sm:text-base shadow-lg"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors hover:scale-105"
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-mint-400 to-sky-500 text-white py-3 sm:py-4 px-4 rounded-2xl hover:scale-105 focus:ring-2 focus:ring-mint-400 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl text-sm sm:text-base"
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Creating Account...</span>
              </div>
            ) : (
              'Create Account'
            )}
          </button>

          <div className="text-center">
            <p className="text-sm text-neutral-600 dark:text-neutral-300">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-mint-600 hover:text-mint-700 font-medium transition-colors hover:scale-105 inline-block"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}