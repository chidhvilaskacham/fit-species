import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { supabase, isSupabaseConnected, testSupabaseConnection } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { FoodEntry, CustomFood } from '../types';
import toast from 'react-hot-toast';

interface FoodContextType {
  foodEntries: FoodEntry[];
  customFoods: CustomFood[];
  recentFoods: FoodEntry[];
  loading: boolean;
  connectionStatus: 'connected' | 'disconnected' | 'testing';
  addFoodEntry: (entry: Omit<FoodEntry, 'id' | 'created_at' | 'user_id'>) => Promise<void>;
  updateFoodEntry: (id: string, entry: Partial<FoodEntry>) => Promise<void>;
  deleteFoodEntry: (id: string) => Promise<void>;
  addCustomFood: (food: Omit<CustomFood, 'id' | 'created_at' | 'user_id'>) => Promise<void>;
  fetchFoodEntries: (date?: string) => Promise<void>;
  fetchCustomFoods: () => Promise<void>;
  fetchRecentFoods: () => Promise<void>;
  testConnection: () => Promise<void>;
}

const FoodContext = createContext<FoodContextType | undefined>(undefined);

export function useFood() {
  const context = useContext(FoodContext);
  if (context === undefined) {
    throw new Error('useFood must be used within a FoodProvider');
  }
  return context;
}

export function FoodProvider({ children }: { children: React.ReactNode }) {
  const { userProfile } = useAuth();
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([]);
  const [customFoods, setCustomFoods] = useState<CustomFood[]>([]);
  const [recentFoods, setRecentFoods] = useState<FoodEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'testing'>('disconnected');

  const testConnection = useCallback(async () => {
    if (!isSupabaseConnected) {
      setConnectionStatus('disconnected');
      toast.error('Supabase not configured. Please check your .env file for VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
      return;
    }

    setConnectionStatus('testing');
    const isConnected = await testSupabaseConnection();
    setConnectionStatus(isConnected ? 'connected' : 'disconnected');
    
    if (!isConnected) {
      toast.error('Unable to connect to Supabase. Please verify your project URL and API key in the .env file.');
    } else {
      toast.success('Database connection established!');
    }
  }, []);

  const fetchFoodEntries = useCallback(async (date?: string) => {
    if (!userProfile) {
      console.log('Skipping fetch - no user profile');
      return;
    }

    if (!isSupabaseConnected) {
      console.log('Skipping fetch - Supabase not connected');
      setConnectionStatus('disconnected');
      return;
    }

    setLoading(true);
    try {
      const targetDate = date || new Date().toISOString().split('T')[0];
      
      console.log('Fetching food entries for date:', targetDate);
      
      const { data, error } = await supabase
        .from('food_entries')
        .select('*')
        .eq('user_id', userProfile.id)
        .eq('date', targetDate)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Supabase error:', error);
        
        // Handle specific error types
        if (error.message?.includes('Failed to fetch') || 
            error.message?.includes('Network error') ||
            error.message?.includes('fetch')) {
          toast.error('Connection failed. Please check your Supabase project status.');
          setConnectionStatus('disconnected');
        } else if (error.message?.includes('JWT') || error.message?.includes('auth')) {
          // Auth errors don't necessarily mean connection is bad
          console.log('Authentication error, but connection may be OK');
        } else {
          toast.error(`Database error: ${error.message}`);
          setConnectionStatus('disconnected');
        }
        
        setFoodEntries([]);
        return;
      }
      
      console.log('Successfully fetched food entries:', data?.length || 0);
      setFoodEntries(data || []);
      setConnectionStatus('connected');
    } catch (error: any) {
      console.error('Error fetching food entries:', error);
      
      if (error.name === 'AbortError') {
        toast.error('Request timed out. Please check your connection.');
      } else if (error.message?.includes('Failed to fetch') || 
                 error.message?.includes('Network error') ||
                 error.message?.includes('fetch')) {
        toast.error('Connection failed. Please verify your Supabase configuration.');
      } else {
        toast.error(`Unexpected error: ${error.message}`);
      }
      
      setConnectionStatus('disconnected');
      setFoodEntries([]);
    }
    setLoading(false);
  }, [userProfile]);

  const fetchCustomFoods = useCallback(async () => {
    if (!userProfile || !isSupabaseConnected) return;

    try {
      const { data, error } = await supabase
        .from('custom_foods')
        .select('*')
        .eq('user_id', userProfile.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching custom foods:', error);
        if (!error.message?.includes('JWT') && !error.message?.includes('auth')) {
          toast.error('Failed to load custom foods');
        }
        setCustomFoods([]);
        return;
      }
      
      setCustomFoods(data || []);
      setConnectionStatus('connected');
    } catch (error: any) {
      console.error('Error fetching custom foods:', error);
      setCustomFoods([]);
    }
  }, [userProfile]);

  const fetchRecentFoods = useCallback(async () => {
    if (!userProfile || !isSupabaseConnected) return;

    try {
      const { data, error } = await supabase
        .from('food_entries')
        .select('*')
        .eq('user_id', userProfile.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error fetching recent foods:', error);
        if (!error.message?.includes('JWT') && !error.message?.includes('auth')) {
          toast.error('Failed to load recent foods');
        }
        setRecentFoods([]);
        return;
      }
      
      // Remove duplicates based on food_name
      const uniqueRecentFoods = data?.filter(
        (food: FoodEntry, index: number, self: FoodEntry[]) =>
          index === self.findIndex((f: FoodEntry) => f.food_name === food.food_name)
      ).slice(0, 10) || [];
      
      setRecentFoods(uniqueRecentFoods);
      setConnectionStatus('connected');
    } catch (error: any) {
      console.error('Error fetching recent foods:', error);
      setRecentFoods([]);
    }
  }, [userProfile]);

  const addFoodEntry = useCallback(async (entry: Omit<FoodEntry, 'id' | 'created_at' | 'user_id'>) => {
    if (!userProfile || !isSupabaseConnected) {
      toast.error('Please connect to database first');
      return;
    }

    try {
      const { error } = await supabase
        .from('food_entries')
        .insert({
          ...entry,
          user_id: userProfile.id,
        });

      if (error) {
        console.error('Error adding food entry:', error);
        toast.error('Failed to add food entry');
        throw error;
      }
      // No need to refetch, real-time subscription will handle it.
      // We still fetch recent foods as that's a separate list.
      await fetchRecentFoods();
    } catch (error: any) {
      console.error('Error adding food entry:', error);
      throw error;
    }
  }, [userProfile, fetchRecentFoods]);

  const updateFoodEntry = useCallback(async (id: string, entry: Partial<FoodEntry>) => {
    if (!userProfile || !isSupabaseConnected) return;

    try {
      const { error } = await supabase
        .from('food_entries')
        .update(entry)
        .eq('id', id)
        .eq('user_id', userProfile.id);

      if (error) {
        console.error('Error updating food entry:', error);
        toast.error('Failed to update food entry');
        throw error;
      }
      // No need to refetch, real-time subscription will handle it.
    } catch (error: any) {
      console.error('Error updating food entry:', error);
      throw error;
    }
  }, [userProfile]);

  const deleteFoodEntry = useCallback(async (id: string) => {
    if (!userProfile || !isSupabaseConnected) return;

    try {
      const { error } = await supabase
        .from('food_entries')
        .delete()
        .eq('id', id)
        .eq('user_id', userProfile.id);

      if (error) {
        console.error('Error deleting food entry:', error);
        toast.error('Failed to delete food entry');
        throw error;
      }
      // No need to refetch, real-time subscription will handle it.
    } catch (error: any) {
      console.error('Error deleting food entry:', error);
      throw error;
    }
  }, [userProfile]);

  const addCustomFood = useCallback(async (food: Omit<CustomFood, 'id' | 'created_at' | 'user_id'>) => {
    if (!userProfile || !isSupabaseConnected) return;

    try {
      const { error } = await supabase
        .from('custom_foods')
        .insert({
          ...food,
          user_id: userProfile.id,
        });

      if (error) {
        console.error('Error adding custom food:', error);
        toast.error('Failed to save custom food');
        throw error;
      }
      // No need to refetch, real-time subscription will handle it.
    } catch (error: any) {
      console.error('Error adding custom food:', error);
      throw error;
    }
  }, [userProfile]);

  useEffect(() => {
    if (userProfile && isSupabaseConnected) {
      // Test connection when user profile is available.
      // Data fetching will be triggered by the connectionStatus change.
      testConnection();
    } else if (userProfile && !isSupabaseConnected) {
      setConnectionStatus('disconnected');
      toast.error('Database not configured. Please check your .env file for VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
    }
  }, [userProfile, testConnection]);

  useEffect(() => {
    // Fetch data once the connection is confirmed to be 'connected' and we have a user.
    if (connectionStatus === 'connected' && userProfile) {
      const today = new Date().toISOString().split('T')[0];
      fetchFoodEntries(today);
      fetchCustomFoods();
      fetchRecentFoods();
    }
  }, [connectionStatus, userProfile, fetchFoodEntries, fetchCustomFoods, fetchRecentFoods]);

  // Real-time subscriptions
  useEffect(() => {
    if (connectionStatus !== 'connected' || !userProfile) {
      return;
    }

    // Subscribe to food_entries changes
    const foodEntriesSubscription = supabase
      .channel('food_entries_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'food_entries', filter: `user_id=eq.${userProfile.id}` },
        (payload: RealtimePostgresChangesPayload<FoodEntry>) => {
          console.log('Realtime food entry change received!', payload);
          const { eventType, new: newRecord, old: oldRecord } = payload;
          
          if (eventType === 'INSERT') {
            toast.success(`New food added: ${newRecord.food_name}`);
            setFoodEntries(current => [...current, newRecord as FoodEntry].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()));
          }
          if (eventType === 'UPDATE') {
            toast.success(`Updated: ${newRecord.food_name}`);
            setFoodEntries(current => current.map(entry => entry.id === newRecord.id ? { ...entry, ...newRecord } : entry));
          }
          if (eventType === 'DELETE') {
            toast.error(`Removed: ${oldRecord.food_name}`);
            setFoodEntries(current => current.filter(entry => entry.id !== oldRecord.id));
          }
        }
      )
      .subscribe();

    // Subscribe to custom_foods changes
    const customFoodsSubscription = supabase
      .channel('custom_foods_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'custom_foods', filter: `user_id=eq.${userProfile.id}` },
        (payload: RealtimePostgresChangesPayload<CustomFood>) => {
          console.log('Realtime custom food change received!', payload);
          const { eventType, new: newRecord, old: oldRecord } = payload;

          if (eventType === 'INSERT') {
            setCustomFoods(current => [newRecord as CustomFood, ...current]);
          }
          if (eventType === 'UPDATE') {
            setCustomFoods(current => current.map(food => food.id === newRecord.id ? { ...food, ...newRecord } : food));
          }
          if (eventType === 'DELETE') {
            setCustomFoods(current => current.filter(food => food.id !== oldRecord.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(foodEntriesSubscription);
      supabase.removeChannel(customFoodsSubscription);
    };
  }, [connectionStatus, userProfile]);

  const value = {
    foodEntries,
    customFoods,
    recentFoods,
    loading,
    connectionStatus,
    addFoodEntry,
    updateFoodEntry,
    deleteFoodEntry,
    addCustomFood,
    fetchFoodEntries,
    fetchCustomFoods,
    fetchRecentFoods,
    testConnection,
  };

  return (
    <FoodContext.Provider value={value}>
      {children}
    </FoodContext.Provider>
  );
}