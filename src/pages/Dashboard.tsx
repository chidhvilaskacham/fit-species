import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar, Plus, Target, TrendingUp, Flame, Activity, Sparkles, Award, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useFood } from '../contexts/FoodContext';
import { NutritionSummary } from '../types';
import NutritionChart from '../components/NutritionChart';
import MealSection from '../components/MealSection';

const calculateStreak = (foodEntries: { date: string }[]): number => {
  if (foodEntries.length === 0) {
    return 0;
  }

  const entryDates = new Set(foodEntries.map(entry => entry.date));
  let streak = 0;
  let currentDate = new Date();

  // Check if today has an entry
  if (entryDates.has(format(currentDate, 'yyyy-MM-dd'))) {
    streak++;
    currentDate.setDate(currentDate.getDate() - 1);
  } else {
    // If today doesn't have an entry, check yesterday
    currentDate.setDate(currentDate.getDate() - 1);
    if (entryDates.has(format(currentDate, 'yyyy-MM-dd'))) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      return 0; // No streak if yesterday and today have no entries
    }
  }

  while (entryDates.has(format(currentDate, 'yyyy-MM-dd'))) {
    streak++;
    currentDate.setDate(currentDate.getDate() - 1);
  }

  return streak;
};

export default function Dashboard() {
  const { userProfile } = useAuth();
  const { foodEntries, fetchFoodEntries } = useFood();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [nutritionSummary, setNutritionSummary] = useState<NutritionSummary | null>(null);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    if (userProfile) {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      fetchFoodEntries(dateStr);
    }
  }, [userProfile, selectedDate, fetchFoodEntries]);

  useEffect(() => {
    if (foodEntries.length > 0) {
      setStreak(calculateStreak(foodEntries));
    }
  }, [foodEntries]);

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
        <div className="mb-10 animate-fade-in-scale">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Welcome to Fit Species, {userProfile.name}!
                </h1>
                <div className="flex space-x-1">
                  <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse" />
                  <Award className="h-6 w-6 text-emerald-500 animate-bounce" style={{ animationDelay: '0.5s' }} />
                </div>
              </div>
              {/* Animated motivational banner */}
              <div className="relative h-10">
                <div className="absolute inset-0 flex items-center transition-all duration-700 animate-fade-in" key={bannerIndex} aria-live="polite">
                  <p className="text-xl text-neutral-600 dark:text-neutral-300 font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                    {motivationalMessages[bannerIndex]}
                  </p>
                </div>
              </div>
              {/* Streak indicator */}
              {streak > 1 && (
                <div className="flex items-center space-x-3 mt-2 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl border border-yellow-200/50 dark:border-yellow-800/50" aria-label={`Streak: ${streak} days`}>
                  <div className="flex items-center space-x-1">
                    <Zap className="h-6 w-6 text-yellow-500 animate-bounce" />
                    <span className="text-2xl">🔥</span>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-yellow-700 dark:text-yellow-300">{streak} Day Streak!</p>
                    <p className="text-sm text-yellow-600 dark:text-yellow-400">Keep the momentum going!</p>
                  </div>
                </div>
              )}
              <p className="text-neutral-500 dark:text-neutral-400">
                Your complete fitness & nutrition dashboard for {format(selectedDate, 'EEEE, MMMM d, yyyy')}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {/* Calories Card */}
            <div className="glass-effect rounded-3xl shadow-xl p-6 border border-white/20 dark:border-neutral-700/30 card-hover animate-slide-in-left group relative overflow-hidden" tabIndex={0} aria-label="Calories summary">
              {/* Background gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">Calories</p>
                  <p className="text-4xl font-bold text-neutral-900 dark:text-white">
                    {Math.round(nutritionSummary.total_calories)}
                  </p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">
                    of {nutritionSummary.goal_calories} goal
                  </p>
                </div>
                <div className="relative">
                  <div className="p-4 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    <Flame className="h-7 w-7 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2">
                    <Zap className="h-5 w-5 text-yellow-400 animate-ping" />
                  </div>
                </div>
              </div>
              <div className="mt-6 relative z-10">
                <div className="bg-neutral-200 dark:bg-neutral-700 rounded-full h-4 overflow-hidden shadow-inner">
                  <div
                    className="bg-gradient-to-r from-emerald-400 to-teal-500 h-4 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                    style={{ width: `${getCalorieProgress()}%` }}
                  >
                    <div className="absolute inset-0 bg-white/30 animate-pulse rounded-full"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                  </div>
                </div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-3 font-medium">
                  {nutritionSummary.remaining_calories > 0
                    ? `${Math.round(nutritionSummary.remaining_calories)} remaining`
                    : `${Math.round(Math.abs(nutritionSummary.remaining_calories))} over goal`
                  }
                </p>
              </div>
            </div>

            <div className="glass-effect rounded-3xl shadow-xl p-6 border border-white/20 dark:border-neutral-700/30 card-hover animate-slide-in-left group relative overflow-hidden" style={{ animationDelay: '0.1s' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="flex items-center justify-between">
                <div className="relative z-10">
                  <p className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">Protein</p>
                  <p className="text-4xl font-bold text-blue-600">{Math.round(nutritionSummary.total_protein)}g</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <span className="text-white font-bold text-xl">P</span>
                </div>
              </div>
            </div>

            <div className="glass-effect rounded-3xl shadow-xl p-6 border border-white/20 dark:border-neutral-700/30 card-hover animate-slide-in-left group relative overflow-hidden" style={{ animationDelay: '0.2s' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="flex items-center justify-between">
                <div className="relative z-10">
                  <p className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">Carbs</p>
                  <p className="text-4xl font-bold text-orange-600">{Math.round(nutritionSummary.total_carbs)}g</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-3xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <span className="text-white font-bold text-xl">C</span>
                </div>
              </div>
            </div>

            <div className="glass-effect rounded-3xl shadow-xl p-6 border border-white/20 dark:border-neutral-700/30 card-hover animate-slide-in-left group relative overflow-hidden" style={{ animationDelay: '0.3s' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="flex items-center justify-between">
                <div className="relative z-10">
                  <p className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">Fat</p>
                  <p className="text-4xl font-bold text-purple-600">{Math.round(nutritionSummary.total_fat)}g</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-3xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <span className="text-white font-bold text-xl">F</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Nutrition Chart */}
        {nutritionSummary && (
          <div className="glass-effect rounded-3xl shadow-xl p-6 sm:p-8 border border-white/20 dark:border-neutral-700/30 mb-10 card-hover animate-slide-in-bottom relative overflow-hidden" style={{ animationDelay: '0.4s' }}>
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-500/10 to-teal-500/10"></div>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mb-8 flex items-center relative z-10">
              <Activity className="h-8 w-8 mr-4 text-emerald-500" />
              Macronutrient Breakdown
              <Sparkles className="h-6 w-6 ml-3 text-yellow-400 animate-pulse" />
            </h2>
            <div className="relative z-10">
              <NutritionChart nutritionSummary={nutritionSummary} />
            </div>
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
        <div className="mt-16 text-center animate-slide-in-bottom" style={{ animationDelay: '0.9s' }}>
          <div className="inline-flex flex-col sm:flex-row items-center space-y-6 sm:space-y-0 sm:space-x-8 glass-effect rounded-3xl shadow-xl p-8 sm:p-10 border border-white/20 dark:border-neutral-700/30 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-transparent to-emerald-500/5"></div>
            
            <div className="flex items-center space-x-3">
              <Target className="h-8 w-8 text-emerald-500" />
              <span className="text-neutral-700 dark:text-neutral-300 font-bold text-xl">Quick Actions:</span>
            </div>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 relative z-10">
              <a
                href="/workouts"
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 active:scale-95 inline-flex items-center justify-center space-x-3 min-w-[180px]"
                aria-label="Start a workout session"
              >
                <Activity className="h-6 w-6" />
                <span className="text-lg">Start Workout</span>
              </a>
              <a
                href="/add-food"
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 active:scale-95 inline-flex items-center justify-center space-x-3 min-w-[180px]"
                aria-label="Add food to your daily log"
              >
                <Plus className="h-6 w-6" />
                <span className="text-lg">Log Nutrition</span>
              </a>
              <a
                href="/progress"
                className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm border-2 border-orange-200 dark:border-orange-700 text-orange-700 dark:text-orange-300 font-bold py-4 px-8 rounded-2xl hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 active:scale-95 inline-flex items-center justify-center space-x-3 min-w-[180px]"
                aria-label="View your progress and trends"
              >
                <TrendingUp className="h-6 w-6" />
                <span className="text-lg">View Progress</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}