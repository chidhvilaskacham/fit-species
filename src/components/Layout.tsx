import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, PlusCircle, TrendingUp, Settings, LogOut, Activity, Menu, X } from 'lucide-react';
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
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/add-food', icon: PlusCircle, label: 'Add Food' },
    { path: '/progress', icon: TrendingUp, label: 'Progress' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="flex flex-col min-h-screen bg-neutral-50 dark:bg-neutral-900 transition-colors">
        {/* Header */}
        <header className="bg-white dark:bg-neutral-800 shadow-md border-b border-neutral-200 dark:border-neutral-700 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-mint-300 to-sky-300 rounded-2xl shadow-md">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-xl font-bold text-neutral-900 dark:text-white">
                  Fit Species
                </h1>
              </div>
              
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-6">
                {userProfile && (
                  <span className="text-sm text-neutral-600 dark:text-neutral-300">
                    Welcome, <span className="font-medium text-mint-600">{userProfile.name}</span>
                  </span>
                )}
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 px-4 py-2 text-sm text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors rounded-2xl hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:scale-105"
                  aria-label="Sign out of your account"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-2xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:scale-105 transition-all"
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-white dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700 animate-slide-up">
              <div className="px-4 py-3 space-y-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 px-6 py-4 rounded-2xl transition-all hover:scale-105 ${
                        isActive
                          ? 'text-white bg-gradient-to-r from-mint-300 to-sky-300 shadow-md'
                          : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-700'
                      }`}
                      aria-label={`Navigate to ${item.label}`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
                <div className="border-t border-neutral-200 dark:border-neutral-700 pt-3 mt-3">
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-3 px-6 py-4 w-full text-left text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-2xl transition-all hover:scale-105"
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
          <aside className="hidden md:block w-64 bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700 overflow-y-auto">
            <nav className="p-6 space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-3 px-6 py-4 rounded-2xl transition-all hover:scale-105 ${
                      isActive
                        ? 'text-white bg-gradient-to-r from-mint-300 to-sky-300 shadow-md'
                        : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-700'
                    }`}
                    aria-label={`Navigate to ${item.label}`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}