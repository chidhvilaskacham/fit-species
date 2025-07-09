import React, { useState } from 'react';
import { Plus, Trash2, Clock, Sparkles, ChefHat, AlertCircle, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FoodEntry } from '../types';
import { useFood } from '../contexts/FoodContext';
import { format } from 'date-fns';

interface MealSectionProps {
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
  mealLabel: string;
  mealIcon: string;
  gradient: string;
  entries: FoodEntry[];
  selectedDate: Date;
}

export default function MealSection({
  mealType,
  mealLabel,
  mealIcon,
  gradient,
  entries,
  selectedDate,
}: MealSectionProps) {
  const { deleteFoodEntry } = useFood();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const totalCalories = entries.reduce((sum, entry) => sum + Number(entry.calories), 0);
  const totalProtein = entries.reduce((sum, entry) => sum + Number(entry.protein), 0);
  const totalCarbs = entries.reduce((sum, entry) => sum + Number(entry.carbs), 0);
  const totalFat = entries.reduce((sum, entry) => sum + Number(entry.fat), 0);

  const handleDeleteEntry = async (entryId: string) => {
    setDeletingId(entryId);
    setError(null);
    try {
      await deleteFoodEntry(entryId);
    } catch (error) {
      console.error('Error deleting food entry:', error);
      setError('Failed to delete entry. Please try again.');
    }
    setDeletingId(null);
  };

  return (
    <div className="glass-effect rounded-3xl shadow-xl border border-white/20 dark:border-neutral-700/30 overflow-hidden card-hover group relative">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="p-6 sm:p-8 relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className={`p-5 bg-gradient-to-br ${gradient} rounded-3xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                <span className="text-3xl sm:text-4xl">{mealIcon}</span>
              </div>
              {entries.length > 0 && (
                <div className="absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                  <span className="text-white text-sm font-bold">{entries.length}</span>
                </div>
              )}
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white flex items-center gap-3 group-hover:text-emerald-600 transition-colors duration-300">
                {mealLabel}
                {entries.length > 0 && <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse" />}
              </h3>
              <div className="flex items-center space-x-4 mt-1">
                <p className="text-lg text-neutral-500 dark:text-neutral-400 flex items-center font-semibold">
                  <Clock className="h-5 w-5 mr-2" />
                  {Math.round(totalCalories)} calories
                </p>
                {entries.length > 0 && (
                  <div className="flex items-center space-x-3 text-sm">
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full font-semibold">
                      P: {Math.round(totalProtein)}g
                    </span>
                    <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full font-semibold">
                      C: {Math.round(totalCarbs)}g
                    </span>
                    <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full font-semibold">
                      F: {Math.round(totalFat)}g
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <Link
            to={`/add-food?meal=${mealType}&date=${format(selectedDate, 'yyyy-MM-dd')}`}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-3 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 active:scale-95 flex items-center space-x-2"
            aria-label={`Add food to ${mealLabel.toLowerCase()}`}
          >
            <Plus className="h-5 w-5" />
            <span className="hidden sm:inline">Add Food</span>
          </Link>
        </div>

        {error && (
          <div className="bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-2xl relative mb-4 flex items-center space-x-2">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
            <button onClick={() => setError(null)} className="absolute top-2 right-2 text-red-700 dark:text-red-300">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {entries.length === 0 ? (
          <div className="text-center py-16 bg-gradient-to-br from-neutral-50/70 to-neutral-100/70 dark:from-neutral-800/70 dark:to-neutral-700/70 rounded-3xl border-2 border-dashed border-neutral-300/50 dark:border-neutral-600/50 backdrop-blur-sm hover:border-emerald-300/50 dark:hover:border-emerald-600/50 transition-all duration-300">
            <div className="relative mb-4">
              <div className="text-8xl sm:text-9xl opacity-20">{mealIcon}</div>
              <ChefHat className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-10 w-10 text-neutral-400 animate-pulse" />
            </div>
            <h4 className="text-2xl font-bold text-neutral-700 dark:text-neutral-300 mb-3">
              No food logged yet
            </h4>
            <p className="text-lg text-neutral-500 dark:text-neutral-400 mb-8 max-w-sm mx-auto">
              Start building your {mealLabel.toLowerCase()} by adding your first food item
            </p>
            <Link
              to={`/add-food?meal=${mealType}&date=${format(selectedDate, 'yyyy-MM-dd')}`}
              className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm border-2 border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 font-bold py-3 px-6 rounded-2xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 active:scale-95 inline-flex items-center space-x-2"
              aria-label={`Add your first food item to ${mealLabel.toLowerCase()}`}
            >
              <Plus className="h-5 w-5" />
              <span>Add your first item</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {entries.map((entry, index) => (
              <div
                key={entry.id}
                className="group/item flex items-center justify-between p-5 sm:p-6 glass-effect rounded-2xl border border-white/20 dark:border-neutral-700/30 hover:shadow-xl transition-all duration-500 animate-slide-in-bottom transform hover:-translate-y-1 hover:scale-[1.02]"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-neutral-900 dark:text-white truncate pr-2 text-xl group-hover/item:text-emerald-600 transition-colors duration-300">
                      {entry.food_name}
                    </h4>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2 rounded-full shadow-lg">
                        {Math.round(Number(entry.calories))} cal
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap items-center gap-3 text-sm sm:text-base">
                      <span className="bg-white/90 dark:bg-neutral-600/90 backdrop-blur-sm px-4 py-2 rounded-xl font-bold text-neutral-700 dark:text-neutral-300 border border-neutral-200/50 dark:border-neutral-600/50 shadow-sm">
                        {entry.quantity}
                      </span>
                      <span className="flex items-center space-x-2 px-3 py-2 bg-blue-100/80 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg backdrop-blur-sm font-semibold">
                        <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                        <span>P: {Math.round(Number(entry.protein))}g</span>
                      </span>
                      <span className="flex items-center space-x-2 px-3 py-2 bg-orange-100/80 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-lg backdrop-blur-sm font-semibold">
                        <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
                        <span>C: {Math.round(Number(entry.carbs))}g</span>
                      </span>
                      <span className="flex items-center space-x-2 px-3 py-2 bg-purple-100/80 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg backdrop-blur-sm font-semibold">
                        <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
                        <span>F: {Math.round(Number(entry.fat))}g</span>
                      </span>
                    </div>
                  </div>
                  
                  {entry.notes && (
                    <div className="mt-4 p-4 bg-gradient-to-r from-neutral-50/90 to-neutral-100/90 dark:from-neutral-700/70 dark:to-neutral-600/70 rounded-xl border border-neutral-200/50 dark:border-neutral-600/50 backdrop-blur-sm">
                      <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 italic font-medium">
                        💭 "{entry.notes}"
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-3 ml-6 opacity-0 group-hover/item:opacity-100 transition-all duration-300">
                  <button
                    onClick={() => handleDeleteEntry(entry.id)}
                    disabled={deletingId === entry.id}
                    className="p-3 text-neutral-400 hover:text-red-600 transition-all duration-300 disabled:opacity-50 rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/20 transform hover:scale-110 active:scale-95 shadow-lg hover:shadow-xl"
                    aria-label={`Delete ${entry.food_name} from ${mealLabel.toLowerCase()}`}
                  >
                    {deletingId === entry.id ? (
                      <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Trash2 className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}