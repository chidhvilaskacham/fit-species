import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar, Plus, Target, TrendingUp, Flame, Activity } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useFood } from '../contexts/FoodContext';
import { NutritionSummary } from '../types';
import NutritionChart from '../components/NutritionChart';
import MealSection from '../components/MealSection';

export default function Dashboard() {
  const { userProfile } = useAuth();
  const { foodEntries, fetchFoodEntries, loading } = useFood();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [nutritionSummary, setNutritionSummary] = useState<NutritionSummary | null>(null);

  useEffect(() => {
    if (userProfile) {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      fetchFoodEntries(dateStr);
    }
  }, [userProfile, selectedDate, fetchFoodEntries]);

  useEffect(() => {
    calculateNutritionSummary();
  }, [foodEntries, userProfile]);

  const calculateNutritionSummary = () => {
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
  };

  const mealTypes = [
    { type: 'breakfast' as const, label: 'Breakfast', icon: '🥣', gradient: 'from-yellow-400 to-orange-500' },
    { type: 'lunch' as const, label: 'Lunch', icon: '🍱', gradient: 'from-mint-300 to-sky-300' },
    { type: 'dinner' as const, label: 'Dinner', icon: '🍽️', gradient: 'from-purple-400 to-pink-500' },
    { type: 'snacks' as const, label: 'Snacks', icon: '🍪', gradient: 'from-pink-400 to-red-500' },
  ];

  const getCalorieProgress = () => {
    if (!nutritionSummary) return 0;
    return Math.min((nutritionSummary.total_calories / nutritionSummary.goal_calories) * 100, 100);
  };

  if (!userProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mint-300"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
                Welcome back, {userProfile.name}! 👋
              </h1>
              <p className="text-neutral-600 dark:text-neutral-300 mt-1">
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
                  className="pl-10 pr-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-2xl focus:ring-2 focus:ring-mint-300 focus:border-mint-300 bg-white dark:bg-neutral-700 dark:text-white shadow-md hover:scale-105 transition-all text-sm sm:text-base"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Nutrition Summary Cards */}
        {nutritionSummary && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-md p-4 sm:p-6 border border-neutral-200 dark:border-neutral-700 animate-slide-up hover:scale-105 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Calories</p>
                  <p className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
                    {Math.round(nutritionSummary.total_calories)}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    of {nutritionSummary.goal_calories} goal
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-mint-300 to-sky-300 rounded-2xl shadow-md">
                  <Flame className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
              </div>
              <div className="mt-4">
                <div className="bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-mint-300 to-sky-300 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${getCalorieProgress()}%` }}
                  ></div>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  {nutritionSummary.remaining_calories > 0 
                    ? `${Math.round(nutritionSummary.remaining_calories)} remaining`
                    : `${Math.round(Math.abs(nutritionSummary.remaining_calories))} over goal`
                  }
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-md p-4 sm:p-6 border border-neutral-200 dark:border-neutral-700 animate-slide-up hover:scale-105 transition-all" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Protein</p>
                  <p className="text-2xl sm:text-3xl font-bold text-blue-600">{Math.round(nutritionSummary.total_protein)}g</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center shadow-md">
                  <span className="text-blue-600 font-bold text-sm sm:text-lg">P</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-md p-4 sm:p-6 border border-neutral-200 dark:border-neutral-700 animate-slide-up hover:scale-105 transition-all" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Carbs</p>
                  <p className="text-2xl sm:text-3xl font-bold text-orange-600">{Math.round(nutritionSummary.total_carbs)}g</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 dark:bg-orange-900/20 rounded-2xl flex items-center justify-center shadow-md">
                  <span className="text-orange-600 font-bold text-sm sm:text-lg">C</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-md p-4 sm:p-6 border border-neutral-200 dark:border-neutral-700 animate-slide-up hover:scale-105 transition-all" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Fat</p>
                  <p className="text-2xl sm:text-3xl font-bold text-purple-600">{Math.round(nutritionSummary.total_fat)}g</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center shadow-md">
                  <span className="text-purple-600 font-bold text-sm sm:text-lg">F</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Nutrition Chart */}
        {nutritionSummary && (
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-md p-4 sm:p-6 border border-neutral-200 dark:border-neutral-700 mb-6 sm:mb-8 animate-slide-up hover:scale-105 transition-all" style={{ animationDelay: '0.4s' }}>
            <h2 className="text-lg sm:text-xl font-semibold text-neutral-900 dark:text-white mb-4 sm:mb-6 flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Macronutrient Breakdown
            </h2>
            <NutritionChart nutritionSummary={nutritionSummary} />
          </div>
        )}

        {/* Meals */}
        <div className="space-y-4 sm:space-y-6">
          {mealTypes.map((meal, index) => (
            <div key={meal.type} className="animate-slide-up" style={{ animationDelay: `${0.5 + index * 0.1}s` }}>
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
        <div className="mt-6 sm:mt-8 text-center animate-slide-up" style={{ animationDelay: '0.9s' }}>
          <div className="inline-flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 bg-white dark:bg-neutral-800 rounded-2xl shadow-md p-4 sm:p-6 border border-neutral-200 dark:border-neutral-700">
            <span className="text-neutral-600 dark:text-neutral-300 font-medium">Quick Actions:</span>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <a
                href="/add-food"
                className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-mint-300 to-sky-300 text-white rounded-2xl hover:scale-105 transition-all font-medium shadow-md min-w-[140px]"
                aria-label="Add food to your daily log"
              >
                <Plus className="h-4 w-4" />
                <span>Add Food</span>
              </a>
              <a
                href="/progress"
                className="inline-flex items-center justify-center space-x-2 px-6 py-3 border-2 border-mint-300 text-mint-600 rounded-2xl hover:bg-mint-50 hover:scale-105 transition-all font-medium min-w-[140px]"
                aria-label="View your progress and trends"
              >
                <TrendingUp className="h-4 w-4" />
                <span>View Progress</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}