import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, PlusCircle, TrendingUp, Settings, LogOut, Activity, Menu, X, Sparkles, Droplets, Target, Bell, Search, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';

export default function Layout() {
  const { signOut, userProfile, loading } = useAuth();
  const { darkMode } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const navigationItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard', color: 'from-orange-500 to-red-500' },
    { path: '/workouts', icon: Activity, label: 'Workouts', color: 'from-purple-500 to-pink-500' },
    { path: '/add-food', icon: PlusCircle, label: 'Nutrition', color: 'from-green-500 to-emerald-500' },
    { path: '/progress', icon: TrendingUp, label: 'Progress', color: 'from-orange-500 to-red-500' },
    { path: '/hydration', icon: Droplets, label: 'Hydration', color: 'from-blue-500 to-indigo-500' },
    { path: '/goals', icon: Target, label: 'Goals', color: 'from-purple-500 to-pink-500' },
    { path: '/settings', icon: Settings, label: 'Settings', color: 'from-gray-500 to-gray-600' },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  if (loading) {
    return <LoadingSpinner message="Loading profile..." />;
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-mint-50/50 via-sky-50/30 to-cyan-50/50 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-800 transition-all duration-500">
        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-mint-200/20 to-sky-200/20 rounded-full blur-xl floating-element"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-br from-cyan-200/20 to-blue-200/20 rounded-full blur-xl floating-element" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-32 left-32 w-40 h-40 bg-gradient-to-br from-sky-200/20 to-mint-200/20 rounded-full blur-xl floating-element" style={{ animationDelay: '4s' }}></div>
          <div className="absolute bottom-20 right-20 w-28 h-28 bg-gradient-to-br from-blue-200/20 to-cyan-200/20 rounded-full blur-xl floating-element" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Header */}
        <header className="glass-effect shadow-lg border-b border-white/20 dark:border-neutral-700/30 sticky top-0 z-50 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <div className="flex items-center space-x-3 animate-slide-in-left">
                <div className="relative">
                  <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    <Activity className="h-7 w-7 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 animate-bounce">
                    <Sparkles className="h-5 w-5 text-yellow-400 animate-pulse" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    Fit Species
                  </h1>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">Complete Fitness Platform</p>
                </div>
              </div>
              
              {/* Search Bar - Desktop */}
              <div className="hidden lg:flex flex-1 max-w-lg mx-8">
                <div className="relative w-full">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search exercises, foods, or workouts..."
                    className="w-full pl-12 pr-4 py-3 bg-white/80 dark:bg-neutral-700/80 backdrop-blur-sm border border-neutral-200/50 dark:border-neutral-600/50 rounded-2xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all text-sm placeholder-neutral-400 dark:placeholder-neutral-500"
                  />
                </div>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-4 animate-slide-in-right">
                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-3 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-all duration-300 rounded-2xl glass-effect hover:shadow-lg transform hover:-translate-y-0.5 relative"
                    aria-label="Notifications"
                  >
                    <Bell className="h-5 w-5" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  </button>
                  
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 glass-effect rounded-2xl shadow-xl border border-white/20 dark:border-neutral-700/30 p-4 animate-slide-in-bottom">
                      <h3 className="font-semibold text-neutral-900 dark:text-white mb-3">Notifications</h3>
                      <div className="space-y-3">
                        <div className="p-3 bg-orange-50/80 dark:bg-orange-900/20 rounded-xl border border-orange-200/50 dark:border-orange-800/50">
                          <p className="text-sm font-medium text-orange-800 dark:text-orange-200">🎯 Goal Achievement</p>
                          <p className="text-xs text-orange-600 dark:text-orange-300">You've reached 80% of your daily calorie goal!</p>
                        </div>
                        <div className="p-3 bg-blue-50/80 dark:bg-blue-900/20 rounded-xl border border-blue-200/50 dark:border-blue-800/50">
                          <p className="text-sm font-medium text-blue-800 dark:text-blue-200">💧 Hydration Reminder</p>
                          <p className="text-xs text-blue-600 dark:text-blue-300">Time to drink some water!</p>
                        </div>
                        <div className="p-3 bg-green-50/80 dark:bg-green-900/20 rounded-xl border border-green-200/50 dark:border-green-800/50">
                          <p className="text-sm font-medium text-green-800 dark:text-green-200">🏋️ Workout Ready</p>
                          <p className="text-xs text-green-600 dark:text-green-300">Your scheduled workout starts in 30 minutes</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {userProfile && (
                  <div className="flex items-center space-x-3 px-4 py-3 glass-effect rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-sm">
                        {userProfile.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                        {userProfile.name}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        Level 5 Athlete
                      </p>
                    </div>
                  </div>
                )}
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 px-4 py-3 text-sm text-neutral-600 dark:text-neutral-300 hover:text-red-600 dark:hover:text-red-400 transition-all duration-300 rounded-2xl glass-effect hover:shadow-lg transform hover:-translate-y-0.5"
                  aria-label="Sign out of your account"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-3 rounded-2xl text-neutral-600 dark:text-neutral-300 glass-effect hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {mobileMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden glass-effect border-t border-white/20 dark:border-neutral-700/30 animate-slide-in-bottom">
              {/* Mobile Search */}
              <div className="px-4 py-4 border-b border-white/20 dark:border-neutral-700/30">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-12 pr-4 py-3 bg-white/80 dark:bg-neutral-700/80 backdrop-blur-sm border border-neutral-200/50 dark:border-neutral-600/50 rounded-2xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all text-sm"
                  />
                </div>
              </div>
              
              <div className="px-4 py-3 space-y-2">
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
                          ? `text-white bg-gradient-to-r ${item.color} shadow-lg scale-105`
                          : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white glass-effect hover:shadow-lg'
                      }`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                      aria-label={`Navigate to ${item.label}`}
                    >
                      <Icon className="h-6 w-6" />
                      <span className="font-semibold text-lg">{item.label}</span>
                      {isActive && (
                        <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      )}
                    </Link>
                  );
                })}
                <div className="border-t border-neutral-200/50 dark:border-neutral-700/50 pt-4 mt-4">
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-3 px-6 py-4 w-full text-left text-neutral-600 dark:text-neutral-300 hover:text-red-600 dark:hover:text-red-400 glass-effect hover:shadow-lg rounded-2xl transition-all duration-300 transform hover:-translate-y-0.5"
                    aria-label="Sign out of your account"
                  >
                    <LogOut className="h-6 w-6" />
                    <span className="font-semibold text-lg">Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </header>

        <div className="flex flex-1">
          {/* Sidebar (Desktop) */}
          <aside className="hidden md:block w-72 glass-effect border-r border-white/20 dark:border-neutral-700/30 overflow-y-auto">
            <nav className="p-6 space-y-3">
              {navigationItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`group flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all duration-300 transform hover:-translate-y-0.5 animate-slide-in-left ${
                      isActive
                        ? `text-white bg-gradient-to-r ${item.color} shadow-lg scale-105`
                        : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white glass-effect hover:shadow-lg'
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                    aria-label={`Navigate to ${item.label}`}
                  >
                    <Icon className={`h-6 w-6 ${isActive ? '' : 'group-hover:scale-110'} transition-transform duration-200`} />
                    <span className="font-semibold text-lg">{item.label}</span>
                    {isActive && (
                      <div className="ml-auto flex items-center space-x-1">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        <div className="w-1 h-1 bg-white/70 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                      </div>
                    )}
                  </Link>
                );
              })}
              
              {/* Sidebar Footer */}
              <div className="mt-8 pt-6 border-t border-neutral-200/50 dark:border-neutral-700/50 space-y-4">
                {/* Daily Progress Card */}
                <div className="glass-effect rounded-2xl p-5 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                      <Target className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-neutral-900 dark:text-white">Daily Progress</p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        {userProfile?.daily_calorie_goal ? `${userProfile.daily_calorie_goal} calories` : 'Not set'}
                      </p>
                    </div>
                  </div>
                  <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-3 mb-2">
                    <div className="bg-gradient-to-r from-orange-400 to-red-500 h-3 rounded-full w-3/4 transition-all duration-1000 relative overflow-hidden">
                      <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">75% Complete</p>
                </div>

                {/* Quick Stats */}
                <div className="glass-effect rounded-2xl p-4 hover:shadow-lg transition-all duration-300">
                  <h4 className="text-sm font-bold text-neutral-900 dark:text-white mb-3">Today's Stats</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-neutral-600 dark:text-neutral-400">Workouts</span>
                      <span className="text-xs font-semibold text-orange-600">2 completed</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-neutral-600 dark:text-neutral-400">Water</span>
                      <span className="text-xs font-semibold text-blue-600">1.2L / 2L</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-neutral-600 dark:text-neutral-400">Streak</span>
                      <span className="text-xs font-semibold text-green-600">7 days 🔥</span>
                    </div>
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