import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Clock } from 'lucide-react';
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

  const totalCalories = entries.reduce((sum, entry) => sum + Number(entry.calories), 0);

  const handleDeleteEntry = async (entryId: string) => {
    setDeletingId(entryId);
    try {
      await deleteFoodEntry(entryId);
    } catch (error) {
      console.error('Error deleting food entry:', error);
    }
    setDeletingId(null);
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-md border border-neutral-200 dark:border-neutral-700 overflow-hidden hover:scale-105 transition-all">
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className={`p-2 sm:p-3 bg-gradient-to-br ${gradient} rounded-2xl shadow-md`}>
              <span className="text-xl sm:text-2xl">{mealIcon}</span>
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white">
                {mealLabel}
              </h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {Math.round(totalCalories)} calories
              </p>
            </div>
          </div>
          
          <Link
            to={`/add-food?meal=${mealType}&date=${format(selectedDate, 'yyyy-MM-dd')}`}
            className="flex items-center space-x-2 px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-mint-300 to-sky-300 text-white rounded-2xl hover:scale-105 transition-all shadow-md"
            aria-label={`Add food to ${mealLabel.toLowerCase()}`}
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline font-medium">Add Food</span>
          </Link>
        </div>

        {entries.length === 0 ? (
          <div className="text-center py-8 sm:py-12 bg-neutral-50 dark:bg-neutral-700 rounded-2xl border-2 border-dashed border-neutral-300 dark:border-neutral-600">
            <div className="text-3xl sm:text-4xl mb-3">{mealIcon}</div>
            <p className="text-neutral-500 dark:text-neutral-400 mb-4">
              No food logged for {mealLabel.toLowerCase()} yet
            </p>
            <Link
              to={`/add-food?meal=${mealType}&date=${format(selectedDate, 'yyyy-MM-dd')}`}
              className="inline-flex items-center space-x-2 text-mint-600 hover:text-mint-700 font-medium transition-colors hover:scale-105"
              aria-label={`Add your first food item to ${mealLabel.toLowerCase()}`}
            >
              <Plus className="h-4 w-4" />
              <span>Add your first item</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {entries.map((entry, index) => (
              <div
                key={entry.id}
                className="group flex items-center justify-between p-3 sm:p-4 bg-neutral-50 dark:bg-neutral-700 rounded-2xl border border-neutral-200 dark:border-neutral-600 hover:shadow-md hover:scale-105 transition-all animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-neutral-900 dark:text-white truncate pr-2">
                      {entry.food_name}
                    </h4>
                    <span className="text-sm font-bold text-neutral-900 dark:text-white bg-white dark:bg-neutral-600 px-2 sm:px-3 py-1 rounded-full shadow-sm flex-shrink-0">
                      {Math.round(Number(entry.calories))} cal
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300">
                    <span className="bg-white dark:bg-neutral-600 px-2 py-1 rounded-lg font-medium">
                      {entry.quantity}
                    </span>
                    <span className="flex items-center space-x-1">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span>P: {Math.round(Number(entry.protein))}g</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                      <span>C: {Math.round(Number(entry.carbs))}g</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      <span>F: {Math.round(Number(entry.fat))}g</span>
                    </span>
                  </div>
                  {entry.notes && (
                    <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-2 italic truncate">
                      "{entry.notes}"
                    </p>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleDeleteEntry(entry.id)}
                    disabled={deletingId === entry.id}
                    className="p-2 text-neutral-400 hover:text-red-600 transition-colors disabled:opacity-50 rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/20 hover:scale-105"
                    aria-label={`Delete ${entry.food_name} from ${mealLabel.toLowerCase()}`}
                  >
                    <Trash2 className="h-4 w-4" />
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