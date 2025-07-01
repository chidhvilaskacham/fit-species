import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, PlusCircle, TrendingUp, Settings, LogOut, Activity, Menu, X, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useState } from 'react';

export default function Layout() {
  const { signOut, userProfile } = useAuth();
  const { darkMode } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard', color: 'from-blue-500 to-purple-500' },
    { path: '/add-food', icon: PlusCircle, label: 'Add Food', color: 'from-emerald-500 to-teal-500' },
    { path: '/progress', icon: TrendingUp, label: 'Progress', color: 'from-orange-500 to-red-500' },
    { path: '/settings', icon: Settings, label: 'Settings', color: 'from-gray-500 to-gray-600' },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-emerald-50/50 via-teal-50/30 to-cyan-50/50 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-800 transition-all duration-500">
        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-emerald-200/20 to-teal-200/20 rounded-full blur-xl floating-element"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-br from-cyan-200/20 to-blue-200/20 rounded-full blur-xl floating-element" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-32 left-32 w-40 h-40 bg-gradient-to-br from-teal-200/20 to-emerald-200/20 rounded-full blur-xl floating-element" style={{ animationDelay: '4s' }}></div>
          <div className="absolute bottom-20 right-20 w-28 h-28 bg-gradient-to-br from-blue-200/20 to-cyan-200/20 rounded-full blur-xl floating-element" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Header */}
        <header className="glass-effect shadow-lg border-b border-white/20 dark:border-neutral-700/30 sticky top-0 z-50 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3 animate-slide-in-left">
                <div className="relative">
                  <div className="p-2 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl shadow-lg">
                    <Activity className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1">
                    <Sparkles className="h-4 w-4 text-yellow-400 animate-pulse" />
                  </div>
                </div>
                <div>
                  <h1 className="text-xl font-bold gradient-text">
                    Fit Species
                  </h1>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">Your wellness companion</p>
                </div>
              </div>
              
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-6 animate-slide-in-right">
                {userProfile && (
                  <div className="flex items-center space-x-3 px-4 py-2 glass-effect rounded-2xl">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {userProfile.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      {userProfile.name}
                    </span>
                  </div>
                )}
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 px-4 py-2 text-sm text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-all duration-300 rounded-2xl glass-effect hover:shadow-lg transform hover:-translate-y-0.5"
                  aria-label="Sign out of your account"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-2xl text-neutral-600 dark:text-neutral-300 glass-effect hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden glass-effect border-t border-white/20 dark:border-neutral-700/30 animate-slide-in-bottom">
              <div className="px-4 py-3 space-y-1">
                {navigationItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 px-6 py-4 rounded-2xl transition-all duration-300 transform hover:-translate-y-0.5 ${
                        isActive
                          ? `text-white bg-gradient-to-r ${item.color} shadow-lg`
                          : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white glass-effect hover:shadow-lg'
                      }`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                      aria-label={`Navigate to ${item.label}`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
                <div className="border-t border-neutral-200/50 dark:border-neutral-700/50 pt-3 mt-3">
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-3 px-6 py-4 w-full text-left text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white glass-effect hover:shadow-lg rounded-2xl transition-all duration-300 transform hover:-translate-y-0.5"
                    aria-label="Sign out of your account"
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium">Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </header>

        <div className="flex flex-1">
          {/* Sidebar (Desktop) */}
          <aside className="hidden md:block w-64 glass-effect border-r border-white/20 dark:border-neutral-700/30 overflow-y-auto">
            <nav className="p-6 space-y-2">
              {navigationItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-3 px-6 py-4 rounded-2xl transition-all duration-300 transform hover:-translate-y-0.5 animate-slide-in-left ${
                      isActive
                        ? `text-white bg-gradient-to-r ${item.color} shadow-lg`
                        : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white glass-effect hover:shadow-lg'
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                    aria-label={`Navigate to ${item.label}`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                    {isActive && (
                      <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    )}
                  </Link>
                );
              })}
              
              {/* Sidebar Footer */}
              <div className="mt-8 pt-6 border-t border-neutral-200/50 dark:border-neutral-700/50">
                <div className="glass-effect rounded-2xl p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                      <Activity className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-neutral-900 dark:text-white">Daily Goal</p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        {userProfile?.daily_calorie_goal || 2000} calories
                      </p>
                    </div>
                  </div>
                  <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-emerald-400 to-teal-500 h-2 rounded-full w-3/4 transition-all duration-500"></div>
                  </div>
                </div>
              </div>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-auto relative">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}