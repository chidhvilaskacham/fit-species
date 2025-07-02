import React, { useState, useEffect } from 'react';
import { Calendar, Plus, ChefHat, Clock, Utensils, Star, Shuffle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { supabase, isSupabaseConnected } from '../lib/supabase';
import { format, addDays, startOfWeek } from 'date-fns';
import toast from 'react-hot-toast';

interface MealPlan {
  id: string;
  user_id: string;
  date: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
  planned_food: string;
  notes?: string;
  created_at: string;
}

interface MealSuggestion {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  time: string;
  ingredients: string[];
}

export default function MealPlanner() {
  const { userProfile } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snacks'>('breakfast');
  const [loading, setLoading] = useState(false);

  const mealSuggestions: MealSuggestion[] = [
    {
      name: 'Protein Smoothie Bowl',
      calories: 350,
      protein: 25,
      carbs: 35,
      fat: 12,
      category: 'Breakfast',
      difficulty: 'Easy',
      time: '10 min',
      ingredients: ['Protein powder', 'Banana', 'Berries', 'Almond milk', 'Granola'],
    },
    {
      name: 'Grilled Chicken Salad',
      calories: 420,
      protein: 35,
      carbs: 15,
      fat: 18,
      category: 'Lunch',
      difficulty: 'Medium',
      time: '25 min',
      ingredients: ['Chicken breast', 'Mixed greens', 'Cherry tomatoes', 'Avocado', 'Olive oil'],
    },
    {
      name: 'Salmon with Quinoa',
      calories: 480,
      protein: 32,
      carbs: 45,
      fat: 20,
      category: 'Dinner',
      difficulty: 'Medium',
      time: '30 min',
      ingredients: ['Salmon fillet', 'Quinoa', 'Broccoli', 'Lemon', 'Herbs'],
    },
    {
      name: 'Greek Yogurt Parfait',
      calories: 220,
      protein: 15,
      carbs: 25,
      fat: 8,
      category: 'Snacks',
      difficulty: 'Easy',
      time: '5 min',
      ingredients: ['Greek yogurt', 'Honey', 'Berries', 'Nuts', 'Granola'],
    },
  ];

  useEffect(() => {
    if (userProfile && isSupabaseConnected) {
      fetchMealPlans();
    }
  }, [userProfile, selectedDate]);

  const fetchMealPlans = async () => {
    if (!userProfile || !isSupabaseConnected) return;

    try {
      const weekStart = startOfWeek(selectedDate);
      const weekEnd = addDays(weekStart, 6);

      const { data, error } = await supabase
        .from('meal_plans')
        .select('*')
        .eq('user_id', userProfile.id)
        .gte('date', format(weekStart, 'yyyy-MM-dd'))
        .lte('date', format(weekEnd, 'yyyy-MM-dd'));

      if (error) throw error;
      setMealPlans(data || []);
    } catch (error) {
      console.error('Error fetching meal plans:', error);
    }
  };

  const addMealPlan = async (suggestion: MealSuggestion) => {
    if (!userProfile || !isSupabaseConnected) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('meal_plans')
        .insert({
          user_id: userProfile.id,
          date: format(selectedDate, 'yyyy-MM-dd'),
          meal_type: selectedMealType,
          planned_food: suggestion.name,
          notes: `${suggestion.calories} cal | ${suggestion.time} | ${suggestion.difficulty}`,
        });

      if (error) throw error;
      
      toast.success(`${suggestion.name} added to meal plan!`);
      setShowSuggestions(false);
      await fetchMealPlans();
    } catch (error) {
      toast.error('Failed to add meal to plan');
    }
    setLoading(false);
  };

  const generateWeekPlan = async () => {
    if (!userProfile || !isSupabaseConnected) return;

    setLoading(true);
    try {
      const weekStart = startOfWeek(selectedDate);
      const plans = [];

      for (let i = 0; i < 7; i++) {
        const date = addDays(weekStart, i);
        const dateStr = format(date, 'yyyy-MM-dd');
        
        // Generate random meals for each day
        const breakfastSuggestions = mealSuggestions.filter(m => m.category === 'Breakfast');
        const lunchSuggestions = mealSuggestions.filter(m => m.category === 'Lunch');
        const dinnerSuggestions = mealSuggestions.filter(m => m.category === 'Dinner');
        
        plans.push(
          {
            user_id: userProfile.id,
            date: dateStr,
            meal_type: 'breakfast',
            planned_food: breakfastSuggestions[Math.floor(Math.random() * breakfastSuggestions.length)].name,
          },
          {
            user_id: userProfile.id,
            date: dateStr,
            meal_type: 'lunch',
            planned_food: lunchSuggestions[Math.floor(Math.random() * lunchSuggestions.length)].name,
          },
          {
            user_id: userProfile.id,
            date: dateStr,
            meal_type: 'dinner',
            planned_food: dinnerSuggestions[Math.floor(Math.random() * dinnerSuggestions.length)].name,
          }
        );
      }

      const { error } = await supabase
        .from('meal_plans')
        .upsert(plans, { onConflict: 'user_id,date,meal_type' });

      if (error) throw error;
      
      toast.success('Week meal plan generated!');
      await fetchMealPlans();
    } catch (error) {
      toast.error('Failed to generate meal plan');
    }
    setLoading(false);
  };

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(selectedDate), i));
  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snacks'] as const;

  return (
    <div className="glass-effect rounded-3xl shadow-xl p-6 border border-white/20 dark:border-neutral-700/30">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-br from-purple-400 to-pink-500 rounded-3xl shadow-lg">
            <ChefHat className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white">Meal Planner</h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Plan your week ahead
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <motion.button
            onClick={generateWeekPlan}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Shuffle className="h-4 w-4" />
            <span className="text-sm font-medium">Generate Week</span>
          </motion.button>
        </div>
      </div>

      {/* Week Calendar */}
      <div className="grid grid-cols-7 gap-2 mb-6">
        {weekDays.map((day, index) => {
          const isSelected = format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
          const dayPlans = mealPlans.filter(plan => plan.date === format(day, 'yyyy-MM-dd'));
          
          return (
            <motion.div
              key={index}
              onClick={() => setSelectedDate(day)}
              className={`p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                isSelected
                  ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-center">
                <p className="text-xs font-medium opacity-80">
                  {format(day, 'EEE')}
                </p>
                <p className="text-lg font-bold">
                  {format(day, 'd')}
                </p>
                <div className="flex justify-center space-x-1 mt-1">
                  {mealTypes.slice(0, 3).map((mealType) => (
                    <div
                      key={mealType}
                      className={`w-1.5 h-1.5 rounded-full ${
                        dayPlans.some(plan => plan.meal_type === mealType)
                          ? isSelected ? 'bg-white' : 'bg-purple-400'
                          : 'bg-neutral-300 dark:bg-neutral-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Selected Day Meals */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-neutral-900 dark:text-white">
          {format(selectedDate, 'EEEE, MMMM d')}
        </h4>
        
        {mealTypes.map((mealType) => {
          const mealPlan = mealPlans.find(
            plan => plan.date === format(selectedDate, 'yyyy-MM-dd') && plan.meal_type === mealType
          );
          
          return (
            <div
              key={mealType}
              className="flex items-center justify-between p-4 bg-gradient-to-r from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-700 rounded-xl border border-neutral-200 dark:border-neutral-600"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg">
                  <Utensils className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-neutral-900 dark:text-white capitalize">
                    {mealType}
                  </p>
                  {mealPlan ? (
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {mealPlan.planned_food}
                    </p>
                  ) : (
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      No meal planned
                    </p>
                  )}
                </div>
              </div>
              
              <motion.button
                onClick={() => {
                  setSelectedMealType(mealType);
                  setShowSuggestions(true);
                }}
                className="p-2 text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Plus className="h-4 w-4" />
              </motion.button>
            </div>
          );
        })}
      </div>

      {/* Meal Suggestions Modal */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowSuggestions(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                  {selectedMealType.charAt(0).toUpperCase() + selectedMealType.slice(1)} Suggestions
                </h3>
                <button
                  onClick={() => setShowSuggestions(false)}
                  className="p-2 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 rounded-lg"
                >
                  ✕
                </button>
              </div>

              <div className="grid gap-4">
                {mealSuggestions
                  .filter(suggestion => 
                    suggestion.category.toLowerCase() === selectedMealType ||
                    (selectedMealType === 'snacks' && suggestion.category === 'Snacks')
                  )
                  .map((suggestion, index) => (
                    <motion.div
                      key={index}
                      className="p-4 border border-neutral-200 dark:border-neutral-600 rounded-xl hover:shadow-lg transition-all duration-200 cursor-pointer"
                      onClick={() => addMealPlan(suggestion)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-neutral-900 dark:text-white">
                            {suggestion.name}
                          </h4>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-sm text-neutral-600 dark:text-neutral-400 flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {suggestion.time}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              suggestion.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                              suggestion.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {suggestion.difficulty}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-purple-600">{suggestion.calories} cal</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-xs text-neutral-600 dark:text-neutral-400 mb-3">
                        <span>P: {suggestion.protein}g</span>
                        <span>C: {suggestion.carbs}g</span>
                        <span>F: {suggestion.fat}g</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {suggestion.ingredients.slice(0, 3).map((ingredient, i) => (
                          <span
                            key={i}
                            className="text-xs bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 px-2 py-1 rounded-full"
                          >
                            {ingredient}
                          </span>
                        ))}
                        {suggestion.ingredients.length > 3 && (
                          <span className="text-xs text-neutral-500">
                            +{suggestion.ingredients.length - 3} more
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}