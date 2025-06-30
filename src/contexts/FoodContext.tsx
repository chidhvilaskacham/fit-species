import React, { createContext, useContext, useState, useEffect } from 'react';
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
  addFoodEntry: (entry: Omit<FoodEntry, 'id' | 'created_at'>) => Promise<void>;
  updateFoodEntry: (id: string, entry: Partial<FoodEntry>) => Promise<void>;
  deleteFoodEntry: (id: string) => Promise<void>;
  addCustomFood: (food: Omit<CustomFood, 'id' | 'created_at'>) => Promise<void>;
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

  const testConnection = async () => {
    if (!isSupabaseConnected) {
      setConnectionStatus('disconnected');
      toast.error('Supabase not configured. Please check your environment variables.');
      return;
    }

    setConnectionStatus('testing');
    const isConnected = await testSupabaseConnection();
    setConnectionStatus(isConnected ? 'connected' : 'disconnected');
    
    if (!isConnected) {
      toast.error('Unable to connect to database. Please check your Supabase configuration and internet connection.');
    } else {
      toast.success('Database connection established!');
    }
  };

  const fetchFoodEntries = async (date?: string) => {
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
      
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const { data, error } = await supabase
        .from('food_entries')
        .select('*')
        .eq('user_id', userProfile.id)
        .eq('date', targetDate)
        .order('created_at', { ascending: true })
        .abortSignal(controller.signal);

      clearTimeout(timeoutId);

      if (error) {
        console.error('Supabase error:', error);
        
        // Handle specific error types with more detailed messages
        if (error.message?.includes('Failed to fetch')) {
          toast.error('Network error: Unable to reach database. Please check your internet connection.');
          setConnectionStatus('disconnected');
        } else if (error.message?.includes('timeout') || error.message?.includes('aborted')) {
          toast.error('Request timed out. Please try again.');
          setConnectionStatus('disconnected');
        } else if (error.message?.includes('CORS')) {
          toast.error('Configuration error: Please check your Supabase project settings.');
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
      
      setFoodEntries(data || []);
      setConnectionStatus('connected');
    } catch (error: any) {
      console.error('Error fetching food entries:', error);
      
      if (error.name === 'AbortError') {
        toast.error('Request timed out. Please check your connection and try again.');
        setConnectionStatus('disconnected');
      } else if (error.message?.includes('Failed to fetch')) {
        toast.error('Network error: Unable to reach database. Please check your internet connection.');
        setConnectionStatus('disconnected');
      } else if (error.message?.includes('NetworkError')) {
        toast.error('Network error: Please check your internet connection.');
        setConnectionStatus('disconnected');
      } else {
        toast.error(`Unexpected error: ${error.message}`);
        setConnectionStatus('disconnected');
      }
      
      setFoodEntries([]);
    }
    setLoading(false);
  };

  const fetchCustomFoods = async () => {
    if (!userProfile || !isSupabaseConnected) return;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const { data, error } = await supabase
        .from('custom_foods')
        .select('*')
        .eq('user_id', userProfile.id)
        .order('created_at', { ascending: false })
        .abortSignal(controller.signal);

      clearTimeout(timeoutId);

      if (error) {
        console.error('Error fetching custom foods:', error);
        if (error.message?.includes('Failed to fetch')) {
          setConnectionStatus('disconnected');
        } else if (!error.message?.includes('JWT') && !error.message?.includes('auth')) {
          toast.error('Failed to load custom foods');
        }
        setCustomFoods([]);
        return;
      }
      
      setCustomFoods(data || []);
      setConnectionStatus('connected');
    } catch (error: any) {
      console.error('Error fetching custom foods:', error);
      if (error.name === 'AbortError' || error.message?.includes('Failed to fetch')) {
        setConnectionStatus('disconnected');
      }
      setCustomFoods([]);
    }
  };

  const fetchRecentFoods = async () => {
    if (!userProfile || !isSupabaseConnected) return;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const { data, error } = await supabase
        .from('food_entries')
        .select('*')
        .eq('user_id', userProfile.id)
        .order('created_at', { ascending: false })
        .limit(20)
        .abortSignal(controller.signal);

      clearTimeout(timeoutId);

      if (error) {
        console.error('Error fetching recent foods:', error);
        if (error.message?.includes('Failed to fetch')) {
          setConnectionStatus('disconnected');
        } else if (!error.message?.includes('JWT') && !error.message?.includes('auth')) {
          toast.error('Failed to load recent foods');
        }
        setRecentFoods([]);
        return;
      }
      
      // Remove duplicates based on food_name
      const uniqueRecentFoods = data?.filter((food, index, self) =>
        index === self.findIndex((f) => f.food_name === food.food_name)
      ).slice(0, 10) || [];
      
      setRecentFoods(uniqueRecentFoods);
      setConnectionStatus('connected');
    } catch (error: any) {
      console.error('Error fetching recent foods:', error);
      if (error.name === 'AbortError' || error.message?.includes('Failed to fetch')) {
        setConnectionStatus('disconnected');
      }
      setRecentFoods([]);
    }
  };

  const addFoodEntry = async (entry: Omit<FoodEntry, 'id' | 'created_at'>) => {
    if (!userProfile || !isSupabaseConnected) {
      toast.error('Please connect to database first');
      return;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const { error } = await supabase
        .from('food_entries')
        .insert({
          ...entry,
          user_id: userProfile.id,
        })
        .abortSignal(controller.signal);

      clearTimeout(timeoutId);

      if (error) {
        console.error('Error adding food entry:', error);
        if (error.message?.includes('Failed to fetch')) {
          setConnectionStatus('disconnected');
          toast.error('Network error: Unable to save food entry');
        } else if (!error.message?.includes('JWT') && !error.message?.includes('auth')) {
          toast.error('Failed to add food entry');
        }
        throw error;
      }
      
      toast.success('Food entry added successfully!');
      setConnectionStatus('connected');
      await fetchFoodEntries(entry.date);
      await fetchRecentFoods();
    } catch (error: any) {
      console.error('Error adding food entry:', error);
      if (error.name === 'AbortError' || error.message?.includes('Failed to fetch')) {
        setConnectionStatus('disconnected');
      }
      throw error;
    }
  };

  const updateFoodEntry = async (id: string, entry: Partial<FoodEntry>) => {
    if (!userProfile || !isSupabaseConnected) return;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const { error } = await supabase
        .from('food_entries')
        .update(entry)
        .eq('id', id)
        .eq('user_id', userProfile.id)
        .abortSignal(controller.signal);

      clearTimeout(timeoutId);

      if (error) {
        console.error('Error updating food entry:', error);
        if (error.message?.includes('Failed to fetch')) {
          setConnectionStatus('disconnected');
          toast.error('Network error: Unable to update food entry');
        } else if (!error.message?.includes('JWT') && !error.message?.includes('auth')) {
          toast.error('Failed to update food entry');
        }
        throw error;
      }
      
      toast.success('Food entry updated!');
      setConnectionStatus('connected');
      await fetchFoodEntries();
    } catch (error: any) {
      console.error('Error updating food entry:', error);
      if (error.name === 'AbortError' || error.message?.includes('Failed to fetch')) {
        setConnectionStatus('disconnected');
      }
      throw error;
    }
  };

  const deleteFoodEntry = async (id: string) => {
    if (!userProfile || !isSupabaseConnected) return;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const { error } = await supabase
        .from('food_entries')
        .delete()
        .eq('id', id)
        .eq('user_id', userProfile.id)
        .abortSignal(controller.signal);

      clearTimeout(timeoutId);

      if (error) {
        console.error('Error deleting food entry:', error);
        if (error.message?.includes('Failed to fetch')) {
          setConnectionStatus('disconnected');
          toast.error('Network error: Unable to delete food entry');
        } else if (!error.message?.includes('JWT') && !error.message?.includes('auth')) {
          toast.error('Failed to delete food entry');
        }
        throw error;
      }
      
      toast.success('Food entry deleted');
      setConnectionStatus('connected');
      await fetchFoodEntries();
    } catch (error: any) {
      console.error('Error deleting food entry:', error);
      if (error.name === 'AbortError' || error.message?.includes('Failed to fetch')) {
        setConnectionStatus('disconnected');
      }
      throw error;
    }
  };

  const addCustomFood = async (food: Omit<CustomFood, 'id' | 'created_at'>) => {
    if (!userProfile || !isSupabaseConnected) return;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const { error } = await supabase
        .from('custom_foods')
        .insert({
          ...food,
          user_id: userProfile.id,
        })
        .abortSignal(controller.signal);

      clearTimeout(timeoutId);

      if (error) {
        console.error('Error adding custom food:', error);
        if (error.message?.includes('Failed to fetch')) {
          setConnectionStatus('disconnected');
          toast.error('Network error: Unable to save custom food');
        } else if (!error.message?.includes('JWT') && !error.message?.includes('auth')) {
          toast.error('Failed to save custom food');
        }
        throw error;
      }
      
      toast.success('Custom food saved!');
      setConnectionStatus('connected');
      await fetchCustomFoods();
    } catch (error: any) {
      console.error('Error adding custom food:', error);
      if (error.name === 'AbortError' || error.message?.includes('Failed to fetch')) {
        setConnectionStatus('disconnected');
      }
      throw error;
    }
  };

  useEffect(() => {
    if (userProfile && isSupabaseConnected) {
      // Test connection first, then fetch data
      testConnection().then(() => {
        if (connectionStatus !== 'disconnected') {
          fetchFoodEntries();
          fetchCustomFoods();
          fetchRecentFoods();
        }
      });
    } else if (userProfile && !isSupabaseConnected) {
      setConnectionStatus('disconnected');
      toast.error('Database not configured. Please check your Supabase settings.');
    }
  }, [userProfile]);

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