import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Activity, Eye, EyeOff, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { signIn } = useAuth();
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState(true);

  // Get token from URL parameters
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    // In a real app, you would validate the token with your backend
    // For demo purposes, we'll accept any token
    if (!token) {
      setIsValidToken(false);
      toast.error('Invalid or missing reset token');
    }
  }, [token]);

  const validateForm = () => {
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

    try {
      // In a real app, you would call Supabase's password update function:
      // const { error } = await supabase.auth.updateUser({
      //   password: formData.password
      // });

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Password reset successful! You can now sign in with your new password.');
      
      // Redirect to login after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (error) {
      toast.error('Failed to reset password. Please try again.');
    }
    
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (!isValidToken) {
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
              <div className="p-4 bg-gradient-to-br from-red-400 to-pink-500 rounded-3xl shadow-lg">
                <AlertCircle className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-2">Invalid Reset Link</h1>
            <p className="text-neutral-600 dark:text-neutral-300">This password reset link is invalid or has expired</p>
          </div>

          <div className="space-y-6">
            <div className="bg-red-50/80 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-6 w-6 text-red-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">Link Expired or Invalid</h3>
                  <p className="text-red-700 dark:text-red-300 mb-4">
                    The password reset link you clicked is either invalid or has expired. 
                    Please request a new password reset link.
                  </p>
                  <div className="space-y-2 text-sm text-red-600 dark:text-red-400">
                    <p>• Reset links expire after 24 hours</p>
                    <p>• Links can only be used once</p>
                    <p>• Make sure you're using the latest email</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-4">
              <Link
                to="/forgot-password"
                className="w-full bg-gradient-to-r from-mint-400 to-sky-500 text-white py-3 sm:py-4 px-4 rounded-2xl hover:scale-105 focus:ring-2 focus:ring-mint-400 focus:ring-offset-2 transition-all font-semibold shadow-lg hover:shadow-xl text-sm sm:text-base text-center"
              >
                Request New Reset Link
              </Link>
              
              <Link
                to="/login"
                className="text-center text-sm text-mint-600 hover:text-mint-700 font-medium transition-colors hover:scale-105"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-2">Reset Password</h1>
          <p className="text-neutral-600 dark:text-neutral-300">
            {email ? `Resetting password for ${email}` : 'Enter your new password below'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              New Password
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
                placeholder="Enter your new password"
                disabled={loading}
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
              Confirm New Password
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
                placeholder="Confirm your new password"
                disabled={loading}
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

          {/* Password Requirements */}
          <div className="bg-blue-50/80 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4 backdrop-blur-sm">
            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">Password Requirements:</h4>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li className={`flex items-center space-x-2 ${formData.password.length >= 6 ? 'text-emerald-600' : ''}`}>
                <CheckCircle className={`h-4 w-4 ${formData.password.length >= 6 ? 'text-emerald-500' : 'text-gray-400'}`} />
                <span>At least 6 characters long</span>
              </li>
              <li className={`flex items-center space-x-2 ${formData.password === formData.confirmPassword && formData.password ? 'text-emerald-600' : ''}`}>
                <CheckCircle className={`h-4 w-4 ${formData.password === formData.confirmPassword && formData.password ? 'text-emerald-500' : 'text-gray-400'}`} />
                <span>Passwords match</span>
              </li>
            </ul>
          </div>

          <button
            type="submit"
            disabled={loading || formData.password.length < 6 || formData.password !== formData.confirmPassword}
            className="w-full bg-gradient-to-r from-mint-400 to-sky-500 text-white py-3 sm:py-4 px-4 rounded-2xl hover:scale-105 focus:ring-2 focus:ring-mint-400 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl text-sm sm:text-base"
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Resetting Password...</span>
              </div>
            ) : (
              'Reset Password'
            )}
          </button>

          <div className="text-center">
            <Link
              to="/login"
              className="text-sm text-mint-600 hover:text-mint-700 font-medium transition-colors hover:scale-105"
            >
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}