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
  };

  const fetchCustomFoods = async () => {
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
  };

  const fetchRecentFoods = async () => {
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
      const uniqueRecentFoods = data?.filter((food, index, self) =>
        index === self.findIndex((f) => f.food_name === food.food_name)
      ).slice(0, 10) || [];
      
      setRecentFoods(uniqueRecentFoods);
      setConnectionStatus('connected');
    } catch (error: any) {
      console.error('Error fetching recent foods:', error);
      setRecentFoods([]);
    }
  };

  const addFoodEntry = async (entry: Omit<FoodEntry, 'id' | 'created_at'>) => {
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
      
      toast.success('Food entry added successfully!');
      setConnectionStatus('connected');
      await fetchFoodEntries(entry.date);
      await fetchRecentFoods();
    } catch (error: any) {
      console.error('Error adding food entry:', error);
      throw error;
    }
  };

  const updateFoodEntry = async (id: string, entry: Partial<FoodEntry>) => {
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
      
      toast.success('Food entry updated!');
      setConnectionStatus('connected');
      await fetchFoodEntries();
    } catch (error: any) {
      console.error('Error updating food entry:', error);
      throw error;
    }
  };

  const deleteFoodEntry = async (id: string) => {
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
      
      toast.success('Food entry deleted');
      setConnectionStatus('connected');
      await fetchFoodEntries();
    } catch (error: any) {
      console.error('Error deleting food entry:', error);
      throw error;
    }
  };

  const addCustomFood = async (food: Omit<CustomFood, 'id' | 'created_at'>) => {
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
      
      toast.success('Custom food saved!');
      setConnectionStatus('connected');
      await fetchCustomFoods();
    } catch (error: any) {
      console.error('Error adding custom food:', error);
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
      toast.error('Database not configured. Please check your .env file for VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
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