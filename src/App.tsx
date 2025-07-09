import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { FoodProvider } from './contexts/FoodContext';
import { isSupabaseConnected } from './lib/supabase';
import LoadingSpinner from './components/LoadingSpinner';
import Layout from './components/Layout';

// Lazy-loaded pages
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const ProfileSetup = lazy(() => import('./pages/ProfileSetup'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AddFood = lazy(() => import('./pages/AddFood'));
const Workouts = lazy(() => import('./pages/Workouts'));
const Progress = lazy(() => import('./pages/Progress'));
const Settings = lazy(() => import('./pages/Settings'));
const Hydration = lazy(() => import('./pages/Hydration'));
const Goals = lazy(() => import('./pages/Goals'));
const ConnectionRequired = lazy(() => import('./components/ConnectionRequired'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));

function AppRoutes() {
  const { user, userProfile, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner message="Loading your profile" />;
  }

  // Not authenticated - show auth pages
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // Authenticated but no profile - show profile setup
  if (!userProfile) {
    return (
      <Routes>
        <Route path="/profile-setup" element={<ProfileSetup />} />
        <Route path="*" element={<Navigate to="/profile-setup" replace />} />
      </Routes>
    );
  }

  // Authenticated with profile - show main app
  return (
    <Routes>
      <Route path="/login" element={<Navigate to="/dashboard" replace />} />
      <Route path="/signup" element={<Navigate to="/dashboard" replace />} />
      <Route path="/forgot-password" element={<Navigate to="/dashboard" replace />} />
      <Route path="/reset-password" element={<Navigate to="/dashboard" replace />} />
      <Route path="/profile-setup" element={<Navigate to="/dashboard" replace />} />
      
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="workouts" element={<Workouts />} />
        <Route path="add-food" element={<AddFood />} />
        <Route path="progress" element={<Progress />} />
        <Route path="hydration" element={<Hydration />} />
        <Route path="goals" element={<Goals />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function App() {
  const [isCheckingConnection, setIsCheckingConnection] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsCheckingConnection(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (isCheckingConnection) {
    return (
      <ThemeProvider>
        <LoadingSpinner message="Starting NutriTrack" />
      </ThemeProvider>
    );
  }

  if (!isSupabaseConnected) {
    return (
      <ThemeProvider>
        <Router>
          <Suspense fallback={<LoadingSpinner />}>
            <ConnectionRequired />
          </Suspense>
        </Router>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <FoodProvider>
          <Router>
            <Suspense fallback={<LoadingSpinner message="Loading page..." />}>
              <AppRoutes />
            </Suspense>
          </Router>
        </FoodProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;