import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase, isSupabaseConnected } from '../lib/supabase';
import { User } from '../types';

interface AuthContextType {
  user: SupabaseUser | null;
  userProfile: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (profile: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // If Supabase is not connected, don't try to authenticate
        if (!isSupabaseConnected) {
          console.log('Supabase not connected, skipping auth initialization');
          if (mounted) {
            setUser(null);
            setUserProfile(null);
            setLoading(false);
          }
          return;
        }

        console.log('Initializing auth...');
        
        // Get initial session with timeout
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Session timeout')), 10000)
        );
        
        const { data: { session }, error } = await Promise.race([
          sessionPromise,
          timeoutPromise
        ]) as any;
        
        if (error) {
          console.error('Session error:', error);
          if (mounted) {
            setUser(null);
            setUserProfile(null);
            setLoading(false);
          }
          return;
        }
        
        if (!mounted) return;

        console.log('Session:', session?.user?.id);
        setUser(session?.user ?? null);

        if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setUser(null);
          setUserProfile(null);
          setLoading(false);
        }
      }
    };

    // Set a maximum loading time
    const loadingTimeout = setTimeout(() => {
      if (mounted && loading) {
        console.warn('Auth loading timeout - proceeding without auth');
        setLoading(false);
      }
    }, 15000); // 15 seconds

    initializeAuth();

    // Listen for auth changes only if Supabase is connected
    let subscription: any;
    if (isSupabaseConnected) {
      const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state change:', event, session?.user?.id);
        
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else {
          setUserProfile(null);
          setLoading(false);
        }
      });
      subscription = data.subscription;
    }

    return () => {
      mounted = false;
      clearTimeout(loadingTimeout);
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      
      if (!isSupabaseConnected) {
        console.log('Supabase not connected, skipping profile fetch');
        setUserProfile(null);
        setLoading(false);
        return;
      }

      // Add timeout to profile fetch
      const profilePromise = supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
        
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Profile fetch timeout')), 10000)
      );

      const { data, error } = await Promise.race([
        profilePromise,
        timeoutPromise
      ]) as any;

      if (error && error.code !== 'PGRST116') {
        console.error('Profile fetch error:', error);
        // Don't throw error, just set profile to null and continue
        setUserProfile(null);
        setLoading(false);
        return;
      }
      
      console.log('Profile data:', data);
      setUserProfile(data);
    } catch (error) {
      console.error('Profile fetch error:', error);
      setUserProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      if (!isSupabaseConnected) {
        return { error: { message: 'Please connect to Supabase first' } };
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      if (!isSupabaseConnected) {
        return { error: { message: 'Please connect to Supabase first' } };
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    try {
      if (isSupabaseConnected) {
        const { error } = await supabase.auth.signOut();
        
        // Always clear local state, even if server-side logout fails
        // This handles cases where the session is already invalid on the server
        setUser(null);
        setUserProfile(null);
        
        // Only log the error if it's not a session_not_found error
        if (error && error.message !== 'Session from session_id claim in JWT does not exist') {
          console.error('Sign out error:', error);
        }
      } else {
        // If Supabase is not connected, just clear local state
        setUser(null);
        setUserProfile(null);
      }
    } catch (error: any) {
      // Always clear local state even if there's an error
      setUser(null);
      setUserProfile(null);
      
      // Handle both string and object errors properly
      const errorMessage = typeof error === 'string' ? error : (error?.message || '');
      const isSessionError = errorMessage.includes('Auth session missing') ||
                           errorMessage.includes('Session from session_id claim in JWT does not exist') ||
                           errorMessage.includes('session_not_found');
      
      if (!isSessionError) {
        console.error('Sign out error:', error);
      }
    }
  };

  const updateProfile = async (profile: Partial<User>) => {
    if (!user) {
      throw new Error('No authenticated user');
    }

    if (!isSupabaseConnected) {
      throw new Error('Please connect to Supabase first');
    }

    console.log('Updating profile for user:', user.id, 'with data:', profile);

    try {
      const { error } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          email: user.email,
          ...profile,
        });

      if (error) {
        console.error('Profile update error:', error);
        throw error;
      }

      console.log('Profile updated successfully');
      await fetchUserProfile(user.id);
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}