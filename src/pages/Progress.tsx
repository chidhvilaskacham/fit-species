import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Calendar, TrendingUp, TrendingDown, Minus, Plus, Target, Activity, Flame } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, isSupabaseConnected } from '../lib/supabase';
import { WeightEntry, NutritionData } from '../types';
import { format, subDays, parseISO } from 'date-fns';
import toast from 'react-hot-toast';

export default function Progress() {
  const { userProfile } = useAuth();
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
  const [nutritionHistory, setNutritionHistory] = useState<NutritionData[]>([]);
  const [newWeight, setNewWeight] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [addingWeight, setAddingWeight] = useState(false);

  useEffect(() => {
    if (userProfile && isSupabaseConnected) {
      fetchWeightEntries();
      fetchNutritionHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile]);

  const fetchWeightEntries = React.useCallback(async () => {
    if (!userProfile || !isSupabaseConnected) return;

    try {
      const { data, error } = await supabase
        .from('weight_entries')
        .select('*')
        .eq('user_id', userProfile.id)
        .order('date', { ascending: true });

      if (error) throw error;
      setWeightEntries(data || []);
    } catch (error) {
      console.error('Error fetching weight entries:', error);
      toast.error('Failed to load weight data');
    }
  }, [userProfile]);

  const fetchNutritionHistory = React.useCallback(async () => {
    if (!userProfile || !isSupabaseConnected) return;

    try {
      const thirtyDaysAgo = format(subDays(new Date(), 30), 'yyyy-MM-dd');

      const { data, error } = await supabase
        .from('food_entries')
        .select('date, calories, protein, carbs, fat')
        .eq('user_id', userProfile.id)
        .gte('date', thirtyDaysAgo)
        .order('date', { ascending: true });

      if (error) throw error;

      // Group by date and sum nutrition values
      const groupedData = (data || []).reduce((acc: Record<string, NutritionData>, entry: { date: string; calories: number; protein: number; carbs: number; fat: number }) => {
        const date = entry.date;
        if (!acc[date]) {
          acc[date] = {
            date,
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0,
            goal: userProfile.daily_calorie_goal,
          };
        }
        acc[date].calories += Number(entry.calories);
        acc[date].protein += Number(entry.protein);
        acc[date].carbs += Number(entry.carbs);
        acc[date].fat += Number(entry.fat);
        return acc;
      }, {});

      setNutritionHistory(Object.values(groupedData));
    } catch (error) {
      console.error('Error fetching nutrition history:', error);
      toast.error('Failed to load nutrition history');
    }
    setLoading(false);
  }, [userProfile]);

  const handleAddWeight = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile || !newWeight || !isSupabaseConnected) return;

    setAddingWeight(true);
    try {
      const { error } = await supabase
        .from('weight_entries')
        .insert({
          user_id: userProfile.id,
          weight: parseFloat(newWeight),
          date: selectedDate,
        });

      if (error) throw error;
      
      setNewWeight('');
      toast.success('Weight entry added!');
      await fetchWeightEntries();
    } catch (error) {
      console.error('Error adding weight entry:', error);
      toast.error('Failed to add weight entry');
    }
    setAddingWeight(false);
  };

  const weightTrend = weightEntries.length >= 2 
    ? weightEntries[weightEntries.length - 1].weight - weightEntries[weightEntries.length - 2].weight
    : 0;

  const averageCalories = nutritionHistory.length > 0
    ? Math.round(nutritionHistory.reduce((sum, day) => sum + day.calories, 0) / nutritionHistory.length)
    : 0;

  const currentWeight = weightEntries.length > 0 ? weightEntries[weightEntries.length - 1].weight : null;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" aria-busy="true" aria-live="polite">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/30 via-teal-50/30 to-cyan-50/30 relative">
      {/* Subtle background food elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 text-4xl opacity-5 animate-float" style={{ animationDelay: '0s' }}>📊</div>
        <div className="absolute top-40 right-32 text-3xl opacity-8 animate-float" style={{ animationDelay: '2s' }}>📈</div>
        <div className="absolute bottom-32 left-32 text-5xl opacity-4 animate-float" style={{ animationDelay: '4s' }}>⚖️</div>
        <div className="absolute bottom-20 right-20 text-3xl opacity-6 animate-float" style={{ animationDelay: '1s' }}>🎯</div>
        <div className="absolute top-1/2 left-1/3 text-4xl opacity-5 animate-float" style={{ animationDelay: '3s' }}>📋</div>
        <div className="absolute top-1/4 right-1/4 text-3xl opacity-7 animate-float" style={{ animationDelay: '5s' }}>💪</div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Progress Tracking 📈
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Monitor your weight and nutrition trends over time
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 rounded-2xl shadow-lg p-6 border border-gray-100/50 dark:border-gray-700/50 animate-slide-up">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Current Weight</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {currentWeight ? `${currentWeight} lbs` : 'No data'}
                </p>
              </div>
              <div className={`flex items-center p-3 rounded-xl shadow-lg ${
                weightTrend > 0 ? 'bg-red-100 text-red-600' : 
                weightTrend < 0 ? 'bg-green-100 text-green-600' : 
                'bg-gray-100 text-gray-400'
              }`}>
                {weightTrend > 0 && <TrendingUp className="h-6 w-6" />}
                {weightTrend < 0 && <TrendingDown className="h-6 w-6" />}
                {weightTrend === 0 && <Minus className="h-6 w-6" />}
              </div>
            </div>
            {weightTrend !== 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {weightTrend > 0 ? '+' : ''}{weightTrend.toFixed(1)} lbs from last entry
              </p>
            )}
          </div>

          <div className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 rounded-2xl shadow-lg p-6 border border-gray-100/50 dark:border-gray-700/50 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Weight Goal</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white capitalize">
                  {userProfile?.weight_goal || 'Not set'}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl shadow-lg">
                <Target className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 rounded-2xl shadow-lg p-6 border border-gray-100/50 dark:border-gray-700/50 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Daily Calories</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {averageCalories}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Goal: {userProfile?.daily_calorie_goal}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg">
                <Flame className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 rounded-2xl shadow-lg p-6 border border-gray-100/50 dark:border-gray-700/50 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tracking Days</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {nutritionHistory.length}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Last 30 days
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl shadow-lg">
                <Activity className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Charts */}
          <div className="lg:col-span-2 space-y-8">
            {/* Weight Chart */}
            <div className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 rounded-2xl shadow-lg border border-gray-100/50 dark:border-gray-700/50 p-6 animate-slide-up" style={{ animationDelay: '0.4s' }} aria-label="Weight Progress Chart" tabIndex={0}>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Weight Progress
              </h2>
              
              {weightEntries.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weightEntries} aria-label="Weight Trend Line Chart">
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(date) => format(parseISO(date), 'MMM d')}
                        className="text-gray-600 dark:text-gray-300"
                        aria-label="Date axis"
                      />
                      <YAxis className="text-gray-600 dark:text-gray-300" aria-label="Weight axis" />
                      <Tooltip 
                        labelFormatter={(date) => format(parseISO(date), 'MMM d, yyyy')}
                        formatter={(value) => [`${value} lbs`, 'Weight']}
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(229, 231, 235, 0.5)',
                          borderRadius: '12px',
                          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                        }}
                        cursor={{ stroke: '#22c55e', strokeWidth: 2 }}
                        aria-label="Weight chart tooltip"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="weight" 
                        stroke="url(#weightGradient)" 
                        strokeWidth={3}
                        dot={{ r: 6, fill: '#22c55e' }}
                        activeDot={{ r: 8, fill: '#16a34a' }}
                        aria-label="Weight trend line"
                      />
                      <defs>
                        <linearGradient id="weightGradient" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#22c55e" />
                          <stop offset="100%" stopColor="#A3D9A5" />
                        </linearGradient>
                      </defs>
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                  <div className="text-6xl mb-4">⚖️</div>
                  <p className="text-lg font-medium">No weight entries yet</p>
                  <p className="text-sm">Add your first weight entry to see progress!</p>
                </div>
              )}
            </div>

            {/* Nutrition History Chart */}
            <div className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 rounded-2xl shadow-lg border border-gray-100/50 dark:border-gray-700/50 p-6 animate-slide-up" style={{ animationDelay: '0.5s' }} aria-label="Daily Calories Chart" tabIndex={0}>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                <Flame className="h-5 w-5 mr-2" />
                Daily Calories (Last 30 Days)
              </h2>
              
              {nutritionHistory.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={nutritionHistory} aria-label="Calories Bar Chart">
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(date) => format(parseISO(date), 'M/d')}
                        className="text-gray-600 dark:text-gray-300"
                        aria-label="Date axis"
                      />
                      <YAxis className="text-gray-600 dark:text-gray-300" aria-label="Calories axis" />
                      <Tooltip 
                        labelFormatter={(date) => format(parseISO(date), 'MMM d, yyyy')}
                        formatter={(value, name) => [
                          name === 'calories' ? `${value} cal` : `${value} cal goal`,
                          name === 'calories' ? 'Consumed' : 'Goal'
                        ]}
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(229, 231, 235, 0.5)',
                          borderRadius: '12px',
                          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                        }}
                        cursor={{ fill: '#22c55e', opacity: 0.2 }}
                        aria-label="Calories chart tooltip"
                      />
                      {/* Goal bar */}
                      <Bar dataKey="goal" fill="#E5E7EB" radius={[4, 4, 0, 0]} aria-label="Goal bar" />
                      <Bar dataKey="calories" fill="url(#calorieGradient)" radius={[4, 4, 0, 0]} aria-label="Calories bar" />
                      <defs>
                        <linearGradient id="calorieGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#22c55e" />
                          <stop offset="100%" stopColor="#A3D9A5" />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                  <div className="text-6xl mb-4">📊</div>
                  <p className="text-lg font-medium">No nutrition data yet</p>
                  <p className="text-sm">Start logging your meals to see trends!</p>
                </div>
              )}
            </div>
          </div>

          {/* Add Weight Form */}
          <div className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 rounded-2xl shadow-lg border border-gray-100/50 dark:border-gray-700/50 p-6 animate-slide-up" style={{ animationDelay: '0.6s' }} aria-label="Log Weight Form">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Log Weight
            </h2>
            
            <form onSubmit={handleAddWeight} className="space-y-6" aria-label="Add Weight Entry Form">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="weight-date-input">
                  Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="weight-date-input"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50/80 backdrop-blur-sm dark:bg-gray-700/80 dark:text-white transition-colors"
                    aria-label="Weight entry date"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="weight-value-input">
                  Weight (lbs)
                </label>
                <input
                  id="weight-value-input"
                  type="number"
                  step="0.1"
                  min="0"
                  required
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50/80 backdrop-blur-sm dark:bg-gray-700/80 dark:text-white transition-colors"
                  placeholder="Enter your weight"
                  aria-label="Weight value"
                />
              </div>

              <button
                type="submit"
                disabled={addingWeight}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 px-6 rounded-xl hover:from-emerald-700 hover:to-teal-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                aria-label="Add Weight Entry"
                aria-busy={addingWeight}
              >
                {addingWeight ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Adding...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>Add Weight Entry</span>
                  </div>
                )}
              </button>
            </form>

            {/* Recent Weight Entries */}
            {weightEntries.length > 0 && (
              <div className="mt-8">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                  Recent Entries
                </h3>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {weightEntries.slice(-5).reverse().map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50/80 to-gray-100/80 dark:from-gray-700/80 dark:to-gray-800/80 rounded-xl border border-gray-200/50 dark:border-gray-600/50 backdrop-blur-sm"
                    >
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {format(parseISO(entry.date), 'MMM d, yyyy')}
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white bg-white/80 dark:bg-gray-700/80 px-3 py-1 rounded-full shadow-sm backdrop-blur-sm">
                        {entry.weight} lbs
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}