import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    setLoading(true);

    // Simulate sending reset email
    try {
      // In a real app, you would call Supabase's password reset function:
      // const { error } = await supabase.auth.resetPasswordForEmail(email, {
      //   redirectTo: `${window.location.origin}/reset-password`,
      // });

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setEmailSent(true);
      toast.success('Password reset instructions sent to your email!');
    } catch (error) {
      toast.error('Failed to send reset email. Please try again.');
    }
    
    setLoading(false);
  };

  const handleDemoReset = () => {
    // For demo purposes, show a success message and redirect
    toast.success('Demo: Password reset successful! Redirecting to login...');
    setTimeout(() => {
      navigate('/login');
    }, 2000);
  };

  if (emailSent) {
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
              <div className="p-4 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl shadow-lg">
                <CheckCircle className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-2">Check Your Email</h1>
            <p className="text-neutral-600 dark:text-neutral-300">We've sent password reset instructions to your email</p>
          </div>

          <div className="space-y-6">
            <div className="bg-emerald-50/80 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-start space-x-3">
                <Mail className="h-6 w-6 text-emerald-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-emerald-800 dark:text-emerald-200 mb-2">Email Sent Successfully</h3>
                  <p className="text-emerald-700 dark:text-emerald-300 mb-4">
                    We've sent password reset instructions to <strong>{email}</strong>. 
                    Please check your inbox and follow the link to reset your password.
                  </p>
                  <div className="space-y-2 text-sm text-emerald-600 dark:text-emerald-400">
                    <p>✓ Check your spam/junk folder if you don't see the email</p>
                    <p>✓ The reset link will expire in 24 hours</p>
                    <p>✓ You can request a new link if needed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Demo Reset Button */}
            <div className="bg-blue-50/80 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4 backdrop-blur-sm">
              <div className="flex items-center space-x-2 mb-3">
                <AlertCircle className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Demo Mode</span>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                Since this is a demo, click the button below to simulate a successful password reset:
              </p>
              <button
                onClick={handleDemoReset}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-2 px-4 rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 font-medium text-sm"
              >
                Demo: Complete Password Reset
              </button>
            </div>

            <div className="flex flex-col space-y-4">
              <button
                onClick={() => setEmailSent(false)}
                className="w-full bg-gradient-to-r from-mint-400 to-sky-500 text-white py-3 sm:py-4 px-4 rounded-2xl hover:scale-105 focus:ring-2 focus:ring-mint-400 focus:ring-offset-2 transition-all font-semibold shadow-lg hover:shadow-xl text-sm sm:text-base"
              >
                Send Another Email
              </button>
              
              <Link
                to="/login"
                className="text-center text-sm text-mint-600 hover:text-mint-700 font-medium transition-colors hover:scale-105 inline-flex items-center justify-center space-x-2"
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
          <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-2">Forgot Password</h1>
          <p className="text-neutral-600 dark:text-neutral-300">Enter your email to receive reset instructions</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
                className="w-full pl-10 pr-4 py-3 sm:py-4 border border-neutral-300/50 dark:border-neutral-600/50 rounded-2xl focus:ring-2 focus:ring-mint-400 focus:border-mint-400 transition-all bg-white/80 dark:bg-neutral-700/80 backdrop-blur-sm dark:text-white hover:scale-105 text-sm sm:text-base shadow-lg"
                placeholder="your@email.com"
                disabled={loading}
              />
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
                <span>Sending Reset Link...</span>
              </div>
            ) : (
              'Send Reset Link'
            )}
          </button>

          <div className="text-center space-y-4">
            <div className="bg-amber-50/80 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 backdrop-blur-sm">
              <p className="text-sm text-amber-700 dark:text-amber-300">
                <strong>Demo Note:</strong> This is a demonstration of the forgot password feature. 
                In a real application, this would send an actual email with reset instructions.
              </p>
            </div>
            
            <Link
              to="/login"
              className="text-sm text-mint-600 hover:text-mint-700 font-medium transition-colors hover:scale-105 inline-flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Login</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}