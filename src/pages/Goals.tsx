import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, Award, Calendar, Edit3, Save, X, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useFood } from '../contexts/FoodContext';
import { supabase, isSupabaseConnected } from '../lib/supabase';
import { format, subDays, parseISO } from 'date-fns';
import toast from 'react-hot-toast';

interface Goal {
  id: string;
  user_id: string;
  type: 'calorie' | 'protein' | 'carbs' | 'fat' | 'weight' | 'water';
  target_value: number;
  current_value: number;
  target_date: string;
  title: string;
  description?: string;
  created_at: string;
}

export default function Goals() {
  const { userProfile, updateProfile } = useAuth();
  const { foodEntries } = useFood();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newGoal, setNewGoal] = useState({
    type: 'calorie' as Goal['type'],
    target_value: 0,
    target_date: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    title: '',
    description: '',
  });

  useEffect(() => {
    if (userProfile && isSupabaseConnected) {
      fetchGoals();
    }
  }, [userProfile]);

  const fetchGoals = async () => {
    if (!userProfile || !isSupabaseConnected) return;

    try {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', userProfile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGoals(data || []);
    } catch (error) {
      console.error('Error fetching goals:', error);
      toast.error('Failed to load goals');
    }
    setLoading(false);
  };

  const addGoal = async () => {
    if (!userProfile || !isSupabaseConnected || !newGoal.title.trim()) return;

    try {
      const { error } = await supabase
        .from('goals')
        .insert({
          user_id: userProfile.id,
          type: newGoal.type,
          target_value: newGoal.target_value,
          current_value: 0,
          target_date: newGoal.target_date,
          title: newGoal.title.trim(),
          description: newGoal.description.trim() || null,
        });

      if (error) throw error;
      
      toast.success('Goal added successfully!');
      setShowAddGoal(false);
      setNewGoal({
        type: 'calorie',
        target_value: 0,
        target_date: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
        title: '',
        description: '',
      });
      await fetchGoals();
    } catch (error) {
      console.error('Error adding goal:', error);
      toast.error('Failed to add goal');
    }
  };

  const updateGoal = async (goalId: string, updates: Partial<Goal>) => {
    if (!userProfile || !isSupabaseConnected) return;

    try {
      const { error } = await supabase
        .from('goals')
        .update(updates)
        .eq('id', goalId)
        .eq('user_id', userProfile.id);

      if (error) throw error;
      
      toast.success('Goal updated successfully!');
      setEditingGoal(null);
      await fetchGoals();
    } catch (error) {
      console.error('Error updating goal:', error);
      toast.error('Failed to update goal');
    }
  };

  const deleteGoal = async (goalId: string) => {
    if (!userProfile || !isSupabaseConnected) return;

    try {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', goalId)
        .eq('user_id', userProfile.id);

      if (error) throw error;
      
      toast.success('Goal deleted successfully!');
      await fetchGoals();
    } catch (error) {
      console.error('Error deleting goal:', error);
      toast.error('Failed to delete goal');
    }
  };

  const calculateProgress = (goal: Goal) => {
    const today = new Date().toISOString().split('T')[0];
    const targetDate = goal.target_date;
    const daysTotal = Math.ceil((new Date(targetDate).getTime() - new Date(goal.created_at).getTime()) / (1000 * 60 * 60 * 24));
    const daysRemaining = Math.ceil((new Date(targetDate).getTime() - new Date(today).getTime()) / (1000 * 60 * 60 * 24));
    
    let currentValue = 0;
    
    // Calculate current value based on goal type
    if (goal.type === 'calorie') {
      // Average daily calories over last 7 days
      const last7Days = foodEntries
        .filter(entry => {
          const entryDate = new Date(entry.date);
          const sevenDaysAgo = subDays(new Date(), 7);
          return entryDate >= sevenDaysAgo;
        })
        .reduce((sum, entry) => sum + Number(entry.calories), 0);
      currentValue = last7Days / 7;
    } else if (goal.type === 'protein') {
      // Average daily protein over last 7 days
      const last7Days = foodEntries
        .filter(entry => {
          const entryDate = new Date(entry.date);
          const sevenDaysAgo = subDays(new Date(), 7);
          return entryDate >= sevenDaysAgo;
        })
        .reduce((sum, entry) => sum + Number(entry.protein), 0);
      currentValue = last7Days / 7;
    }
    // Add more goal types as needed
    
    const progressPercentage = Math.min((currentValue / goal.target_value) * 100, 100);
    
    return {
      currentValue: Math.round(currentValue),
      progressPercentage,
      daysRemaining: Math.max(daysRemaining, 0),
      daysTotal,
    };
  };

  const getGoalIcon = (type: Goal['type']) => {
    switch (type) {
      case 'calorie': return '🔥';
      case 'protein': return '💪';
      case 'carbs': return '🍞';
      case 'fat': return '🥑';
      case 'weight': return '⚖️';
      case 'water': return '💧';
      default: return '🎯';
    }
  };

  const getGoalColor = (type: Goal['type']) => {
    switch (type) {
      case 'calorie': return 'from-orange-400 to-red-500';
      case 'protein': return 'from-blue-400 to-indigo-500';
      case 'carbs': return 'from-yellow-400 to-orange-500';
      case 'fat': return 'from-purple-400 to-pink-500';
      case 'weight': return 'from-green-400 to-emerald-500';
      case 'water': return 'from-cyan-400 to-blue-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/30 via-pink-50/30 to-indigo-50/30 relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 text-4xl opacity-10 animate-float" style={{ animationDelay: '0s' }}>🎯</div>
        <div className="absolute top-40 right-32 text-3xl opacity-15 animate-float" style={{ animationDelay: '2s' }}>🏆</div>
        <div className="absolute bottom-32 left-32 text-5xl opacity-8 animate-float" style={{ animationDelay: '4s' }}>⭐</div>
        <div className="absolute bottom-20 right-20 text-3xl opacity-12 animate-float" style={{ animationDelay: '1s' }}>🚀</div>
        <div className="absolute top-1/2 left-1/3 text-4xl opacity-10 animate-float" style={{ animationDelay: '3s' }}>💎</div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Goals Center 🎯
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Set and track your nutrition and health goals
              </p>
            </div>
            <button
              onClick={() => setShowAddGoal(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus className="h-4 w-4" />
              <span>Add Goal</span>
            </button>
          </div>
        </div>

        {/* Current Profile Goals */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 rounded-3xl shadow-xl p-6 border border-gray-100/50 dark:border-gray-700/50 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl shadow-lg">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Daily Calories</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Current Goal</p>
                </div>
              </div>
              <button
                onClick={() => setEditingGoal('calorie-goal')}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Edit3 className="h-4 w-4" />
              </button>
            </div>
            
            {editingGoal === 'calorie-goal' ? (
              <div className="space-y-3">
                <input
                  type="number"
                  defaultValue={userProfile?.daily_calorie_goal}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  onKeyPress={async (e) => {
                    if (e.key === 'Enter') {
                      const value = parseInt((e.target as HTMLInputElement).value);
                      if (value > 0) {
                        await updateProfile({ daily_calorie_goal: value });
                        setEditingGoal(null);
                        toast.success('Calorie goal updated!');
                      }
                    }
                  }}
                />
                <div className="flex space-x-2">
                  <button
                    onClick={async () => {
                      const input = document.querySelector('input[type="number"]') as HTMLInputElement;
                      const value = parseInt(input.value);
                      if (value > 0) {
                        await updateProfile({ daily_calorie_goal: value });
                        setEditingGoal(null);
                        toast.success('Calorie goal updated!');
                      }
                    }}
                    className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Save className="h-4 w-4 mx-auto" />
                  </button>
                  <button
                    onClick={() => setEditingGoal(null)}
                    className="flex-1 px-3 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    <X className="h-4 w-4 mx-auto" />
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {userProfile?.daily_calorie_goal || 2000} cal
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Weight goal: {userProfile?.weight_goal || 'maintain'}
                </p>
              </div>
            )}
          </div>

          {/* Add more profile goal cards here */}
        </div>

        {/* Custom Goals */}
        <div className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-100/50 dark:border-gray-700/50 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
            <Award className="h-5 w-5 mr-2" />
            Custom Goals
          </h2>

          {goals.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 opacity-20">🎯</div>
              <p className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">No custom goals yet</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">Create your first goal to start tracking progress!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {goals.map((goal) => {
                const progress = calculateProgress(goal);
                return (
                  <div
                    key={goal.id}
                    className="bg-gradient-to-br from-gray-50/80 to-gray-100/80 dark:from-gray-700/80 dark:to-gray-800/80 rounded-2xl p-6 border border-gray-200/50 dark:border-gray-600/50 backdrop-blur-sm"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`p-3 bg-gradient-to-br ${getGoalColor(goal.type)} rounded-2xl shadow-lg`}>
                          <span className="text-xl">{getGoalIcon(goal.type)}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">{goal.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{goal.type} goal</p>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteGoal(goal.id)}
                        className="p-2 text-red-400 hover:text-red-600 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {progress.currentValue} / {goal.target_value}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div
                          className={`h-3 bg-gradient-to-r ${getGoalColor(goal.type)} rounded-full transition-all duration-500`}
                          style={{ width: `${progress.progressPercentage}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {Math.round(progress.progressPercentage)}% complete
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">
                          {progress.daysRemaining} days left
                        </span>
                      </div>
                      <span className="text-gray-600 dark:text-gray-400">
                        Target: {format(parseISO(goal.target_date), 'MMM d')}
                      </span>
                    </div>

                    {goal.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 italic">
                        "{goal.description}"
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Add Goal Modal */}
        {showAddGoal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Add New Goal</h3>
                <button
                  onClick={() => setShowAddGoal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Goal Type
                  </label>
                  <select
                    value={newGoal.type}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, type: e.target.value as Goal['type'] }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 dark:text-white"
                  >
                    <option value="calorie">Daily Calories</option>
                    <option value="protein">Daily Protein (g)</option>
                    <option value="carbs">Daily Carbs (g)</option>
                    <option value="fat">Daily Fat (g)</option>
                    <option value="weight">Weight (lbs)</option>
                    <option value="water">Daily Water (ml)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Goal Title
                  </label>
                  <input
                    type="text"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., Increase daily protein"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Target Value
                  </label>
                  <input
                    type="number"
                    value={newGoal.target_value}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, target_value: parseFloat(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 dark:text-white"
                    placeholder="Target amount"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Target Date
                  </label>
                  <input
                    type="date"
                    value={newGoal.target_date}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, target_date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={newGoal.description}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 dark:text-white"
                    rows={3}
                    placeholder="Why is this goal important to you?"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowAddGoal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addGoal}
                    disabled={!newGoal.title.trim() || newGoal.target_value <= 0}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Add Goal
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}