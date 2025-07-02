import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar, Plus, Target, TrendingUp, Flame, Activity, Sparkles, Award, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useFood } from '../contexts/FoodContext';
import { NutritionSummary } from '../types';
import NutritionChart from '../components/NutritionChart';
import MealSection from '../components/MealSection';

export default function Dashboard() {
  const { userProfile } = useAuth();
  const { foodEntries, fetchFoodEntries } = useFood();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [nutritionSummary, setNutritionSummary] = useState<NutritionSummary | null>(null);

  useEffect(() => {
    if (userProfile) {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      fetchFoodEntries(dateStr);
    }
  }, [userProfile, selectedDate, fetchFoodEntries]);

  const calculateNutritionSummary = React.useCallback(() => {
    const totalCalories = foodEntries.reduce((sum, entry) => sum + Number(entry.calories), 0);
    const totalCarbs = foodEntries.reduce((sum, entry) => sum + Number(entry.carbs), 0);
    const totalProtein = foodEntries.reduce((sum, entry) => sum + Number(entry.protein), 0);
    const totalFat = foodEntries.reduce((sum, entry) => sum + Number(entry.fat), 0);
    const goalCalories = userProfile?.daily_calorie_goal || 2000;

    setNutritionSummary({
      total_calories: totalCalories,
      total_carbs: totalCarbs,
      total_protein: totalProtein,
      total_fat: totalFat,
      goal_calories: goalCalories,
      remaining_calories: goalCalories - totalCalories,
    });
  }, [foodEntries, userProfile]);

  useEffect(() => {
    calculateNutritionSummary();
  }, [foodEntries, userProfile, calculateNutritionSummary]);

  const mealTypes = [
    { type: 'breakfast' as const, label: 'Breakfast', icon: '🌅', gradient: 'from-yellow-400 to-orange-500' },
    { type: 'lunch' as const, label: 'Lunch', icon: '☀️', gradient: 'from-emerald-400 to-teal-500' },
    { type: 'dinner' as const, label: 'Dinner', icon: '🌙', gradient: 'from-purple-400 to-pink-500' },
    { type: 'snacks' as const, label: 'Snacks', icon: '🍿', gradient: 'from-pink-400 to-red-500' },
  ];

  const getCalorieProgress = () => {
    if (!nutritionSummary) return 0;
    return Math.min((nutritionSummary.total_calories / nutritionSummary.goal_calories) * 100, 100);
  };

  // Streak calculation (simple example: count consecutive days with entries)
  const [streak, setStreak] = useState(0);
  useEffect(() => {
    if (!userProfile || !foodEntries.length) return;
    let streakCount = 0;
    let currentDate = new Date(selectedDate);
    for (let i = 0; i < 30; i++) {
      const dateStr = format(currentDate, 'yyyy-MM-dd');
      if (foodEntries.some(entry => entry.date === dateStr)) {
        streakCount++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    setStreak(streakCount);
  }, [foodEntries, selectedDate, userProfile]);

  // Rotating motivational messages
  const motivationalMessages = [
    'Ready to start your day? 🌟',
    'Great start! Keep going! 💪',
    "You're on fire! 🔥",
    'Almost there! 🎯',
    'So close to your goal! 🏆',
    'Goal achieved! Amazing! 🎉',
    'Consistency is key! Keep it up! 🔑',
    'Every meal counts! 🍽️',
  ];
  const [bannerIndex, setBannerIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setBannerIndex(i => (i + 1) % motivationalMessages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [motivationalMessages.length]);

  if (!userProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50/50 via-teal-50/30 to-cyan-50/50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/50 via-teal-50/30 to-cyan-50/50 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-800 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-emerald-200/20 to-teal-200/20 rounded-full blur-xl floating-element"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-br from-cyan-200/20 to-blue-200/20 rounded-full blur-xl floating-element" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-32 left-32 w-40 h-40 bg-gradient-to-br from-teal-200/20 to-emerald-200/20 rounded-full blur-xl floating-element" style={{ animationDelay: '4s' }}></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-gradient-to-br from-blue-200/20 to-cyan-200/20 rounded-full blur-xl floating-element" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in-scale">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white">
                  Welcome back, {userProfile.name}!
                </h1>
                <div className="flex space-x-1">
                  <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse" />
                  <Award className="h-6 w-6 text-emerald-500 animate-bounce" style={{ animationDelay: '0.5s' }} />
                </div>
              </div>
              {/* Animated motivational banner */}
              <div className="relative h-10">
                <div className="absolute inset-0 flex items-center transition-opacity duration-700 animate-fade-in" key={bannerIndex} aria-live="polite">
                  <p className="text-lg text-neutral-600 dark:text-neutral-300 font-semibold">
                    {motivationalMessages[bannerIndex]}
                  </p>
                </div>
              </div>
              {/* Streak indicator */}
              {streak > 1 && (
                <div className="flex items-center space-x-2 mt-1" aria-label={`Streak: ${streak} days`}>
                  <Zap className="h-5 w-5 text-yellow-400 animate-pulse" />
                  <span className="text-emerald-600 dark:text-emerald-300 font-bold">{streak} day streak!</span>
                </div>
              )}
              <p className="text-neutral-500 dark:text-neutral-400">
                Track your nutrition for {format(selectedDate, 'EEEE, MMMM d, yyyy')}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <label htmlFor="date-picker" className="sr-only">Select date</label>
                <input
                  id="date-picker"
                  type="date"
                  value={format(selectedDate, 'yyyy-MM-dd')}
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                  className="input-field pl-10 pr-4 py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Nutrition Summary Cards */}
        {nutritionSummary && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Calories Card */}
            <div className="glass-effect rounded-3xl shadow-xl p-6 border border-white/20 dark:border-neutral-700/30 card-hover animate-slide-in-left group" tabIndex={0} aria-label="Calories summary">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Calories</p>
                  <p className="text-3xl font-bold text-neutral-900 dark:text-white">
                    {Math.round(nutritionSummary.total_calories)}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    of {nutritionSummary.goal_calories} goal
                  </p>
                </div>
                <div className="relative">
                  <div className="p-4 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl shadow-lg">
                    <Flame className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1">
                    <Zap className="h-4 w-4 text-yellow-400 animate-ping" />
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <div className="bg-neutral-200 dark:bg-neutral-700 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-400 to-teal-500 h-3 rounded-full transition-all duration-1000 ease-out relative"
                    style={{ width: `${getCalorieProgress()}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full"></div>
                  </div>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                  {nutritionSummary.remaining_calories > 0
                    ? `${Math.round(nutritionSummary.remaining_calories)} remaining`
                    : `${Math.round(Math.abs(nutritionSummary.remaining_calories))} over goal`
                  }
                </p>
              </div>
            </div>

            <div className="glass-effect rounded-3xl shadow-xl p-6 border border-white/20 dark:border-neutral-700/30 card-hover animate-slide-in-left" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Protein</p>
                  <p className="text-3xl font-bold text-blue-600">{Math.round(nutritionSummary.total_protein)}g</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">P</span>
                </div>
              </div>
            </div>

            <div className="glass-effect rounded-3xl shadow-xl p-6 border border-white/20 dark:border-neutral-700/30 card-hover animate-slide-in-left" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Carbs</p>
                  <p className="text-3xl font-bold text-orange-600">{Math.round(nutritionSummary.total_carbs)}g</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-3xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">C</span>
                </div>
              </div>
            </div>

            <div className="glass-effect rounded-3xl shadow-xl p-6 border border-white/20 dark:border-neutral-700/30 card-hover animate-slide-in-left" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Fat</p>
                  <p className="text-3xl font-bold text-purple-600">{Math.round(nutritionSummary.total_fat)}g</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-3xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">F</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Nutrition Chart */}
        {nutritionSummary && (
          <div className="glass-effect rounded-3xl shadow-xl p-6 sm:p-8 border border-white/20 dark:border-neutral-700/30 mb-8 card-hover animate-slide-in-bottom" style={{ animationDelay: '0.4s' }}>
            <h2 className="text-xl sm:text-2xl font-semibold text-neutral-900 dark:text-white mb-6 flex items-center">
              <Activity className="h-6 w-6 mr-3 text-emerald-500" />
              Macronutrient Breakdown
              <Sparkles className="h-5 w-5 ml-2 text-yellow-400 animate-pulse" />
            </h2>
            <NutritionChart nutritionSummary={nutritionSummary} />
          </div>
        )}

        {/* Meals */}
        <div className="space-y-8">
          {mealTypes.map((meal, index) => (
            <div key={meal.type} className="animate-slide-in-bottom" style={{ animationDelay: `${0.5 + index * 0.1}s` }}>
              <MealSection
                mealType={meal.type}
                mealLabel={meal.label}
                mealIcon={meal.icon}
                gradient={meal.gradient}
                entries={foodEntries.filter(entry => entry.meal_type === meal.type)}
                selectedDate={selectedDate}
              />
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-12 text-center animate-slide-in-bottom" style={{ animationDelay: '0.9s' }}>
          <div className="inline-flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 glass-effect rounded-3xl shadow-xl p-6 sm:p-8 border border-white/20 dark:border-neutral-700/30">
            <div className="flex items-center space-x-3">
              <Target className="h-6 w-6 text-emerald-500" />
              <span className="text-neutral-700 dark:text-neutral-300 font-semibold text-lg">Quick Actions:</span>
            </div>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <a
                href="/add-food"
                className="button-primary inline-flex items-center justify-center space-x-2 min-w-[160px]"
                aria-label="Add food to your daily log"
              >
                <Plus className="h-5 w-5" />
                <span>Add Food</span>
              </a>
              <a
                href="/progress"
                className="button-secondary inline-flex items-center justify-center space-x-2 min-w-[160px]"
                aria-label="View your progress and trends"
              >
                <TrendingUp className="h-5 w-5" />
                <span>View Progress</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}