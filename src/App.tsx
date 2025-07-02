import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { FoodProvider } from './contexts/FoodContext';
import { isSupabaseConnected } from './lib/supabase';
import LoadingSpinner from './components/LoadingSpinner';
import Layout from './components/Layout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProfileSetup from './pages/ProfileSetup';
import Dashboard from './pages/Dashboard';
import AddFood from './pages/AddFood';
import Progress from './pages/Progress';
import Settings from './pages/Settings';
import ConnectionRequired from './components/ConnectionRequired';
import ForgotPassword from './pages/ForgotPassword';

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
      <Route path="/profile-setup" element={<Navigate to="/dashboard" replace />} />
      
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="add-food" element={<AddFood />} />
        <Route path="progress" element={<Progress />} />
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
        <LoadingSpinner message="Starting Fit Species" />
      </ThemeProvider>
    );
  }

  if (!isSupabaseConnected) {
    return (
      <ThemeProvider>
        <Router>
          <ConnectionRequired />
        </Router>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <FoodProvider>
          <Router>
            <AppRoutes />
          </Router>
        </FoodProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;