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
    if (!isSupabaseConnected) {
      console.log('Supabase not connected, skipping auth initialization.');
      setLoading(false);
      return;
    }

    setLoading(true);
    console.log('Setting up auth state listener...');

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (
        event: import('@supabase/supabase-js').AuthChangeEvent,
        session: import('@supabase/supabase-js').Session | null
      ) => {
        console.log('Auth state change event:', event, session?.user?.id);
        const currentUser = session?.user ?? null;
        setUser(currentUser);

      if (currentUser) {
        // On initial sign-in or session load, create a profile if it doesn't exist.
        // This handles the 'INITIAL_SESSION' and 'SIGNED_IN' events.
        if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN') {
          const { data: profile } = await supabase
            .from('users')
            .select('id')
            .eq('id', currentUser.id)
            .maybeSingle();

          if (!profile) {
            console.log('No profile found for user, creating one...');
            const { error: createError } = await supabase
              .from('users')
              .insert({ id: currentUser.id, email: currentUser.email! });

            if (createError) {
              console.error('Failed to create user profile:', createError);
            }
          }
        }
        // Always fetch the latest profile data.
        await fetchUserProfile(currentUser.id);
      } else {
        // User is signed out
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => {
      console.log('Unsubscribing from auth state changes.');
      subscription.unsubscribe();
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

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Profile fetch error:', error);
        setUserProfile(null);
        setLoading(false);
        return;
      }
      
      console.log('Profile data:', data);
      setUserProfile(data);
    } catch (error: any) {
      console.error('Profile fetch error:', error);
      setUserProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      if (!isSupabaseConnected) {
        return { error: { message: 'Supabase not connected. Please check your .env configuration.' } };
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
        return { error: { message: 'Supabase not connected. Please check your .env configuration.' } };
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
      throw new Error('Supabase not connected. Please check your .env configuration.');
    }

    console.log('Updating profile for user:', user.id, 'with data:', profile);

    try {
      // Destructure to prevent updating the id or email directly.
      const { id, email, ...updateData } = profile;

      const { error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', user.id);

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