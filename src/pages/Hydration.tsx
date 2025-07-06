import React, { useState, useEffect } from 'react';
import { Droplets, Plus, Minus, Target, TrendingUp, Award, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, isSupabaseConnected } from '../lib/supabase';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

interface HydrationEntry {
  id: string;
  user_id: string;
  amount_ml: number;
  date: string;
  created_at: string;
}

export default function Hydration() {
  const { userProfile } = useAuth();
  const [hydrationEntries, setHydrationEntries] = useState<HydrationEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [dailyGoal, setDailyGoal] = useState(2000); // 2L default
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const presetAmounts = [
    { label: 'Glass', amount: 250, icon: '🥛' },
    { label: 'Bottle', amount: 500, icon: '🍼' },
    { label: 'Large Bottle', amount: 750, icon: '🍶' },
    { label: 'Cup', amount: 200, icon: '☕' },
  ];

  useEffect(() => {
    if (userProfile && isSupabaseConnected) {
      fetchHydrationData();
    }
  }, [userProfile, selectedDate]);

  const fetchHydrationData = async () => {
    if (!userProfile || !isSupabaseConnected) return;

    try {
      const { data, error } = await supabase
        .from('hydration_entries')
        .select('*')
        .eq('user_id', userProfile.id)
        .eq('date', selectedDate)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setHydrationEntries(data || []);
    } catch (error) {
      console.error('Error fetching hydration data:', error);
      toast.error('Failed to load hydration data');
    }
    setLoading(false);
  };

  const addHydration = async (amount: number) => {
    if (!userProfile || !isSupabaseConnected) return;

    setAdding(true);
    try {
      const { error } = await supabase
        .from('hydration_entries')
        .insert({
          user_id: userProfile.id,
          amount_ml: amount,
          date: selectedDate,
        });

      if (error) throw error;
      
      toast.success(`Added ${amount}ml of water!`);
      await fetchHydrationData();
    } catch (error) {
      console.error('Error adding hydration:', error);
      toast.error('Failed to add hydration entry');
    }
    setAdding(false);
  };

  const removeLastEntry = async () => {
    if (!userProfile || !isSupabaseConnected || hydrationEntries.length === 0) return;

    const lastEntry = hydrationEntries[hydrationEntries.length - 1];
    
    try {
      const { error } = await supabase
        .from('hydration_entries')
        .delete()
        .eq('id', lastEntry.id);

      if (error) throw error;
      
      toast.success(`Removed ${lastEntry.amount_ml}ml entry`);
      await fetchHydrationData();
    } catch (error) {
      console.error('Error removing hydration entry:', error);
      toast.error('Failed to remove entry');
    }
  };

  const totalIntake = hydrationEntries.reduce((sum, entry) => sum + entry.amount_ml, 0);
  const progressPercentage = Math.min((totalIntake / dailyGoal) * 100, 100);
  const remaining = Math.max(dailyGoal - totalIntake, 0);

  const getProgressColor = () => {
    if (progressPercentage >= 100) return 'from-emerald-400 to-teal-500';
    if (progressPercentage >= 75) return 'from-blue-400 to-cyan-500';
    if (progressPercentage >= 50) return 'from-sky-400 to-blue-500';
    return 'from-cyan-300 to-sky-400';
  };

  const getMotivationalMessage = () => {
    if (progressPercentage >= 100) return "🎉 Excellent! You've reached your hydration goal!";
    if (progressPercentage >= 75) return "💪 Great job! You're almost there!";
    if (progressPercentage >= 50) return "👍 Good progress! Keep it up!";
    if (progressPercentage >= 25) return "🌊 Nice start! Stay hydrated!";
    return "💧 Time to hydrate! Your body will thank you!";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-cyan-50/30 to-sky-50/30 relative">
      {/* Animated water droplets */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 text-4xl opacity-10 animate-float" style={{ animationDelay: '0s' }}>💧</div>
        <div className="absolute top-40 right-32 text-3xl opacity-15 animate-float" style={{ animationDelay: '2s' }}>🌊</div>
        <div className="absolute bottom-32 left-32 text-5xl opacity-8 animate-float" style={{ animationDelay: '4s' }}>💦</div>
        <div className="absolute bottom-20 right-20 text-3xl opacity-12 animate-float" style={{ animationDelay: '1s' }}>🥤</div>
        <div className="absolute top-1/2 left-1/3 text-4xl opacity-10 animate-float" style={{ animationDelay: '3s' }}>🚰</div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Hydration Tracker 💧
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Stay hydrated and track your daily water intake
          </p>
        </div>

        {/* Date Selector */}
        <div className="mb-8">
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select Date
          </label>
          <input
            id="date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm dark:bg-gray-700/80 dark:text-white transition-colors shadow-lg"
          />
        </div>

        {/* Progress Overview */}
        <div className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-100/50 dark:border-gray-700/50 mb-8 animate-slide-up">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg">
                <Droplets className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {totalIntake}ml / {dailyGoal}ml
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {Math.round(progressPercentage)}% of daily goal
                </p>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-6 mb-4 overflow-hidden">
              <div
                className={`h-6 bg-gradient-to-r ${getProgressColor()} rounded-full transition-all duration-1000 ease-out relative`}
                style={{ width: `${progressPercentage}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full"></div>
              </div>
              {progressPercentage >= 100 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Award className="h-4 w-4 text-white animate-bounce" />
                </div>
              )}
            </div>

            <p className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2">
              {getMotivationalMessage()}
            </p>
            
            {remaining > 0 && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {remaining}ml remaining to reach your goal
              </p>
            )}
          </div>

          {/* Daily Goal Adjustment */}
          <div className="flex items-center justify-center space-x-4 mb-6">
            <Target className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Daily Goal:</span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setDailyGoal(Math.max(1000, dailyGoal - 250))}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="font-semibold text-gray-900 dark:text-white min-w-[80px] text-center">
                {dailyGoal}ml
              </span>
              <button
                onClick={() => setDailyGoal(Math.min(5000, dailyGoal + 250))}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Add Buttons */}
        <div className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 rounded-3xl shadow-xl p-6 border border-gray-100/50 dark:border-gray-700/50 mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Quick Add Water
          </h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {presetAmounts.map((preset) => (
              <button
                key={preset.amount}
                onClick={() => addHydration(preset.amount)}
                disabled={adding}
                className="flex flex-col items-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl border border-blue-200/50 dark:border-blue-700/50 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="text-2xl mb-2">{preset.icon}</div>
                <span className="font-semibold text-gray-900 dark:text-white text-sm">{preset.label}</span>
                <span className="text-xs text-gray-600 dark:text-gray-400">{preset.amount}ml</span>
              </button>
            ))}
          </div>

          {/* Custom Amount */}
          <div className="flex items-center space-x-4">
            <input
              type="number"
              min="1"
              max="2000"
              placeholder="Custom amount (ml)"
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50/80 backdrop-blur-sm dark:bg-gray-700/80 dark:text-white transition-colors"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  const amount = parseInt((e.target as HTMLInputElement).value);
                  if (amount > 0) {
                    addHydration(amount);
                    (e.target as HTMLInputElement).value = '';
                  }
                }
              }}
            />
            <button
              onClick={(e) => {
                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                const amount = parseInt(input.value);
                if (amount > 0) {
                  addHydration(amount);
                  input.value = '';
                }
              }}
              disabled={adding}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {adding ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Adding...</span>
                </div>
              ) : (
                'Add'
              )}
            </button>
          </div>
        </div>

        {/* Today's Entries */}
        <div className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 rounded-3xl shadow-xl p-6 border border-gray-100/50 dark:border-gray-700/50 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Today's Hydration Log
            </h3>
            {hydrationEntries.length > 0 && (
              <button
                onClick={removeLastEntry}
                className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:text-red-700 border border-red-200 hover:border-red-300 rounded-xl transition-colors"
              >
                <Minus className="h-4 w-4" />
                <span className="text-sm">Remove Last</span>
              </button>
            )}
          </div>

          {hydrationEntries.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 opacity-20">💧</div>
              <p className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">No water logged today</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">Start tracking your hydration above!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {hydrationEntries.map((entry, index) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50/80 to-cyan-50/80 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200/50 dark:border-blue-700/50 backdrop-blur-sm animate-slide-in-bottom"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg shadow-md">
                      <Droplets className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {entry.amount_ml}ml
                      </span>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {format(new Date(entry.created_at), 'h:mm a')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {entry.amount_ml >= 500 && <Zap className="h-4 w-4 text-yellow-500" />}
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      +{entry.amount_ml}ml
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}