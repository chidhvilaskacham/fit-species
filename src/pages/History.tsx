import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, TrendingUp, Flame, Droplets, Dumbbell } from 'lucide-react';
import { useFood } from '../contexts/FoodContext';
import { format, addDays, subDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';

export default function History() {
  const { foodEntries, fetchFoodEntries } = useFood();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (viewMode === 'day') {
      fetchFoodEntries(format(selectedDate, 'yyyy-MM-dd'));
    } else {
      // For week view, we'd need to fetch multiple days
      const weekStart = startOfWeek(selectedDate);
      const weekEnd = endOfWeek(selectedDate);
      const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
      
      // For now, just fetch the selected date
      fetchFoodEntries(format(selectedDate, 'yyyy-MM-dd'));
    }
  }, [selectedDate, viewMode, fetchFoodEntries]);

  const navigateDate = (direction: 'prev' | 'next') => {
    if (viewMode === 'day') {
      setSelectedDate(prev => direction === 'next' ? addDays(prev, 1) : subDays(prev, 1));
    } else {
      setSelectedDate(prev => direction === 'next' ? addDays(prev, 7) : subDays(prev, 7));
    }
  };

  const getDayStats = () => {
    const totalCalories = foodEntries.reduce((sum, entry) => sum + Number(entry.calories), 0);
    const totalProtein = foodEntries.reduce((sum, entry) => sum + Number(entry.protein), 0);
    const totalCarbs = foodEntries.reduce((sum, entry) => sum + Number(entry.carbs), 0);
    const totalFat = foodEntries.reduce((sum, entry) => sum + Number(entry.fat), 0);

    return { totalCalories, totalProtein, totalCarbs, totalFat };
  };

  const getMealEntries = (mealType: string) => {
    return foodEntries.filter(entry => entry.meal_type === mealType);
  };

  const stats = getDayStats();
  const mealTypes = [
    { type: 'breakfast', label: 'Breakfast', icon: '🌅', color: 'from-yellow-400 to-orange-500' },
    { type: 'lunch', label: 'Lunch', icon: '☀️', color: 'from-emerald-400 to-teal-500' },
    { type: 'dinner', label: 'Dinner', icon: '🌙', color: 'from-purple-400 to-pink-500' },
    { type: 'snacks', label: 'Snacks', icon: '🍿', color: 'from-pink-400 to-red-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/30 via-purple-50/30 to-pink-50/30 relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 text-4xl opacity-10 animate-float" style={{ animationDelay: '0s' }}>📅</div>
        <div className="absolute top-40 right-32 text-3xl opacity-15 animate-float" style={{ animationDelay: '2s' }}>📊</div>
        <div className="absolute bottom-32 left-32 text-5xl opacity-8 animate-float" style={{ animationDelay: '4s' }}>📈</div>
        <div className="absolute bottom-20 right-20 text-3xl opacity-12 animate-float" style={{ animationDelay: '1s' }}>🗓️</div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            History & Analytics 📊
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Review your nutrition journey and track progress over time
          </p>
        </div>

        {/* Date Navigation */}
        <div className="bg-white/90 backdrop-blur-sm dark:bg-gray-800/90 rounded-2xl shadow-lg p-6 border border-gray-100/50 dark:border-gray-700/50 mb-8 animate-slide-up">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigateDate('prev')}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {viewMode === 'day' 
                    ? format(selectedDate, 'EEEE, MMMM d, yyyy')
                    : `Week of ${format(startOfWeek(selectedDate), 'MMM d')} - ${format(endOfWeek(selectedDate), 'MMM d, yyyy')}`
                  }
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {viewMode === 'day' ? 'Daily View' : 'Weekly View'}
                </p>
              </div>
              
              <button
                onClick={() => navigateDate('next')}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('day')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  viewMode === 'day'
                    ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Day
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  viewMode === 'week'
                    ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Week
              </button>
            </div>
          </div>
        </div>

        {/* Daily Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/90 backdrop-blur-sm dark:bg-gray-800/90 rounded-2xl shadow-lg p-6 border border-gray-100/50 dark:border-gray-700/50 animate-slide-up">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Calories</p>
                <p className="text-3xl font-bold text-orange-600">{Math.round(stats.totalCalories)}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg">
                <Flame className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm dark:bg-gray-800/90 rounded-2xl shadow-lg p-6 border border-gray-100/50 dark:border-gray-700/50 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Protein</p>
                <p className="text-3xl font-bold text-blue-600">{Math.round(stats.totalProtein)}g</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl shadow-lg">
                <Dumbbell className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm dark:bg-gray-800/90 rounded-2xl shadow-lg p-6 border border-gray-100/50 dark:border-gray-700/50 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Carbs</p>
                <p className="text-3xl font-bold text-yellow-600">{Math.round(stats.totalCarbs)}g</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl shadow-lg">
                <span className="text-white font-bold text-lg">C</span>
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm dark:bg-gray-800/90 rounded-2xl shadow-lg p-6 border border-gray-100/50 dark:border-gray-700/50 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Fat</p>
                <p className="text-3xl font-bold text-purple-600">{Math.round(stats.totalFat)}g</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
                <span className="text-white font-bold text-lg">F</span>
              </div>
            </div>
          </div>
        </div>

        {/* Meal Breakdown */}
        <div className="space-y-6">
          {mealTypes.map((meal, index) => {
            const entries = getMealEntries(meal.type);
            const mealCalories = entries.reduce((sum, entry) => sum + Number(entry.calories), 0);
            
            return (
              <div
                key={meal.type}
                className="bg-white/90 backdrop-blur-sm dark:bg-gray-800/90 rounded-2xl shadow-lg border border-gray-100/50 dark:border-gray-700/50 animate-slide-up"
                style={{ animationDelay: `${0.4 + index * 0.1}s` }}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className={`p-4 bg-gradient-to-br ${meal.color} rounded-2xl shadow-lg`}>
                        <span className="text-2xl">{meal.icon}</span>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{meal.label}</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          {entries.length} items • {Math.round(mealCalories)} calories
                        </p>
                      </div>
                    </div>
                  </div>

                  {entries.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50/80 dark:bg-gray-700/80 rounded-xl">
                      <div className="text-4xl mb-2 opacity-20">{meal.icon}</div>
                      <p className="text-gray-500 dark:text-gray-400">No food logged for {meal.label.toLowerCase()}</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {entries.map((entry, entryIndex) => (
                        <div
                          key={entry.id}
                          className="flex items-center justify-between p-4 bg-gray-50/80 dark:bg-gray-700/80 rounded-xl"
                        >
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 dark:text-white">{entry.food_name}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{entry.quantity}</p>
                            {entry.notes && (
                              <p className="text-sm text-gray-500 dark:text-gray-400 italic mt-1">"{entry.notes}"</p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-900 dark:text-white">{Math.round(Number(entry.calories))} cal</p>
                            <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400">
                              <span>P: {Math.round(Number(entry.protein))}g</span>
                              <span>C: {Math.round(Number(entry.carbs))}g</span>
                              <span>F: {Math.round(Number(entry.fat))}g</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 text-center animate-slide-up" style={{ animationDelay: '0.8s' }}>
          <div className="inline-flex items-center space-x-4 bg-white/90 backdrop-blur-sm dark:bg-gray-800/90 rounded-2xl shadow-lg p-6 border border-gray-100/50 dark:border-gray-700/50">
            <Calendar className="h-6 w-6 text-indigo-600" />
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </span>
            <button
              onClick={() => setSelectedDate(new Date())}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Go to Today
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}