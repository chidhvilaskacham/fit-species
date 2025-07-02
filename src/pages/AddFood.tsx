import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Plus, Clock, Star, ArrowLeft, Save } from 'lucide-react';
import { useFood } from '../contexts/FoodContext';
import toast from 'react-hot-toast';
import Fuse from 'fuse.js';
import { commonFoods, CommonFood } from '../data/commonFoods';
import { FoodEntry } from '../types';

export default function AddFood() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addFoodEntry, addCustomFood, customFoods, recentFoods, fetchCustomFoods, fetchRecentFoods } = useFood();

  const [activeTab, setActiveTab] = useState<'search' | 'custom' | 'recent'>('search');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form states
  const [formData, setFormData] = useState({
    foodName: '',
    quantity: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);

  const mealType = searchParams.get('meal') || 'breakfast';
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

  // Fuzzy search setup
  const fuse = new Fuse(commonFoods, {
    keys: ['name', 'category'],
    threshold: 0.3,
  });
  const filteredFoods = searchTerm
    ? fuse.search(searchTerm).map(result => result.item)
    : commonFoods;

  useEffect(() => {
    fetchCustomFoods();
    fetchRecentFoods();
  }, [fetchCustomFoods, fetchRecentFoods]);

  const handleQuickAdd = (food: CommonFood | FoodEntry) => {
    setFormData({
      foodName: 'name' in food ? food.name : food.food_name,
      quantity: 'serving' in food ? food.serving : food.quantity || '100g',
      calories: food.calories.toString(),
      protein: food.protein.toString(),
      carbs: food.carbs.toString(),
      fat: food.fat.toString(),
      notes: '',
    });
    setActiveTab('custom');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addFoodEntry({
        food_name: formData.foodName,
        quantity: formData.quantity,
        calories: parseFloat(formData.calories),
        protein: parseFloat(formData.protein),
        carbs: parseFloat(formData.carbs),
        fat: parseFloat(formData.fat),
        meal_type: mealType as 'breakfast' | 'lunch' | 'dinner' | 'snacks',
        notes: formData.notes || undefined,
        date,
      });
      toast.success('Food added successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Error adding food entry');
      console.error('Error adding food entry:', error);
    }
    setLoading(false);
  };

  const saveAsCustomFood = async () => {
    if (!formData.foodName || !formData.calories || !formData.protein || !formData.carbs || !formData.fat || !formData.quantity) {
      toast.error('Please fill out all nutrient fields to save a custom food.');
      return;
    }

    try {
      // Use a regex that preserves decimal points
      const quantityNum = parseFloat(formData.quantity.replace(/[^0-9.]/g, ''));
      if (isNaN(quantityNum) || quantityNum === 0) {
        toast.error('Please enter a valid quantity with a numeric value (e.g., 100g).');
        return;
      }

      const caloriesNum = parseFloat(formData.calories);
      const proteinNum = parseFloat(formData.protein);
      const carbsNum = parseFloat(formData.carbs);
      const fatNum = parseFloat(formData.fat);

      if (isNaN(caloriesNum) || isNaN(proteinNum) || isNaN(carbsNum) || isNaN(fatNum)) {
        toast.error('Nutrient values must be valid numbers.');
        return;
      }

      await addCustomFood({
        name: formData.foodName,
        calories_per_100g: Math.round((caloriesNum / quantityNum) * 100),
        protein_per_100g: Math.round((proteinNum / quantityNum) * 100),
        carbs_per_100g: Math.round((carbsNum / quantityNum) * 100),
        fat_per_100g: Math.round((fatNum / quantityNum) * 100),
      });
      toast.success(`${formData.foodName} saved as a custom food!`);
    } catch (error) {
      console.error('Error saving custom food:', error);
      toast.error('Failed to save custom food.');
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setFormData({
          foodName: '',
          quantity: '',
          calories: '',
          protein: '',
          carbs: '',
          fat: '',
          notes: '',
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const tabs = [
    { key: 'search', label: 'Search Foods', icon: Search },
    { key: 'recent', label: 'Recent', icon: Clock },
    { key: 'custom', label: 'Custom', icon: Star },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/30 via-teal-50/30 to-cyan-50/30 relative">
      {/* Subtle background food elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 text-4xl opacity-5 animate-float" style={{ animationDelay: '0s' }}>🥗</div>
        <div className="absolute top-40 right-32 text-3xl opacity-8 animate-float" style={{ animationDelay: '2s' }}>🍎</div>
        <div className="absolute bottom-32 left-32 text-5xl opacity-4 animate-float" style={{ animationDelay: '4s' }}>🥑</div>
        <div className="absolute bottom-20 right-20 text-3xl opacity-6 animate-float" style={{ animationDelay: '1s' }}>🥕</div>
        <div className="absolute top-1/2 left-1/3 text-4xl opacity-5 animate-float" style={{ animationDelay: '3s' }}>🍌</div>
        <div className="absolute top-1/4 right-1/4 text-3xl opacity-7 animate-float" style={{ animationDelay: '5s' }}>🥦</div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors rounded-lg hover:bg-white/50 backdrop-blur-sm dark:hover:bg-gray-700"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Add Food to {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                {new Date(date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Food Search/Selection */}
          <div className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 rounded-2xl shadow-lg border border-gray-100/50 dark:border-gray-700/50 p-6 animate-slide-up" aria-label="Food Search Section">
            <div className="flex space-x-1 mb-6" role="tablist">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as 'search' | 'custom' | 'recent')}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all duration-200 ${
                      activeTab === tab.key
                        ? 'bg-gradient-to-r from-emerald-100/80 to-teal-100/80 text-emerald-700 dark:from-emerald-900/20 dark:to-teal-900/20 dark:text-emerald-300 shadow-md backdrop-blur-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50/50 dark:hover:bg-gray-700/50 backdrop-blur-sm'
                    }`}
                    role="tab"
                    aria-selected={activeTab === tab.key}
                    aria-controls={`tab-panel-${tab.key}`}
                    tabIndex={0}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    <span className="text-sm font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {activeTab === 'search' && (
              <div>
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search for foods or categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50/80 backdrop-blur-sm dark:bg-gray-700/80 dark:text-white transition-colors"
                  />
                </div>
                
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredFoods.map((food, index) => (
                    <div
                      key={index}
                      onClick={() => handleQuickAdd(food)}
                      className="p-4 border border-gray-200/50 dark:border-gray-600/50 rounded-xl hover:bg-gradient-to-r hover:from-emerald-50/80 hover:to-teal-50/80 dark:hover:from-emerald-900/10 dark:hover:to-teal-900/10 cursor-pointer transition-all duration-200 hover:shadow-md group backdrop-blur-sm"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-300">
                            {food.name}
                          </h4>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-sm text-gray-600 dark:text-gray-300">{food.serving}</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white bg-gray-100/80 dark:bg-gray-700/80 px-2 py-1 rounded-lg backdrop-blur-sm">
                              {food.calories} cal
                            </span>
                          </div>
                          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                            {food.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'recent' && (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {recentFoods.length === 0 ? (
                  <div className="text-center py-12">
                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No recent foods found</p>
                  </div>
                ) : (
                  recentFoods.map((food, index) => (
                    <div
                      key={index}
                      onClick={() => handleQuickAdd(food)}
                      className="p-4 border border-gray-200/50 dark:border-gray-600/50 rounded-xl hover:bg-gradient-to-r hover:from-emerald-50/80 hover:to-teal-50/80 dark:hover:from-emerald-900/10 dark:hover:to-teal-900/10 cursor-pointer transition-all duration-200 hover:shadow-md backdrop-blur-sm"
                    >
                      <h4 className="font-semibold text-gray-900 dark:text-white">{food.food_name}</h4>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm text-gray-600 dark:text-gray-300">{food.quantity}</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {food.calories} cal
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'custom' && (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {customFoods.length === 0 ? (
                  <div className="text-center py-12">
                    <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No custom foods saved yet</p>
                  </div>
                ) : (
                  customFoods.map((food) => (
                    <div
                      key={food.id}
                      onClick={() => handleQuickAdd({
                        name: food.name,
                        calories: food.calories_per_100g,
                        protein: food.protein_per_100g,
                        carbs: food.carbs_per_100g,
                        fat: food.fat_per_100g,
                        serving: '100g',
                      })}
                      className="p-4 border border-gray-200/50 dark:border-gray-600/50 rounded-xl hover:bg-gradient-to-r hover:from-emerald-50/80 hover:to-teal-50/80 dark:hover:from-emerald-900/10 dark:hover:to-teal-900/10 cursor-pointer transition-all duration-200 hover:shadow-md backdrop-blur-sm"
                    >
                      <h4 className="font-semibold text-gray-900 dark:text-white">{food.name}</h4>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm text-gray-600 dark:text-gray-300">per 100g</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {food.calories_per_100g} cal
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Food Entry Form */}
          <div className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 rounded-2xl shadow-lg border border-gray-100/50 dark:border-gray-700/50 p-6 animate-slide-up" style={{ animationDelay: '0.1s' }} aria-label="Food Entry Form">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <Plus className="h-5 w-5 mr-2" aria-hidden="true" />
              Food Details
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6" aria-label="Add Food Form">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Food Name *
                </label>
                <input
                  type="text"
                  name="foodName"
                  required
                  value={formData.foodName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50/80 backdrop-blur-sm dark:bg-gray-700/80 dark:text-white transition-colors"
                  placeholder="Enter food name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Quantity/Serving *
                </label>
                <input
                  type="text"
                  name="quantity"
                  required
                  value={formData.quantity}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50/80 backdrop-blur-sm dark:bg-gray-700/80 dark:text-white transition-colors"
                  placeholder="e.g., 100g, 1 cup, 1 piece"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Calories *
                  </label>
                  <input
                    type="number"
                    name="calories"
                    required
                    min="0"
                    step="0.1"
                    value={formData.calories}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50/80 backdrop-blur-sm dark:bg-gray-700/80 dark:text-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Protein (g) *
                  </label>
                  <input
                    type="number"
                    name="protein"
                    required
                    min="0"
                    step="0.1"
                    value={formData.protein}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50/80 backdrop-blur-sm dark:bg-gray-700/80 dark:text-white transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Carbs (g) *
                  </label>
                  <input
                    type="number"
                    name="carbs"
                    required
                    min="0"
                    step="0.1"
                    value={formData.carbs}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50/80 backdrop-blur-sm dark:bg-gray-700/80 dark:text-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Fat (g) *
                  </label>
                  <input
                    type="number"
                    name="fat"
                    required
                    min="0"
                    step="0.1"
                    value={formData.fat}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50/80 backdrop-blur-sm dark:bg-gray-700/80 dark:text-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50/80 backdrop-blur-sm dark:bg-gray-700/80 dark:text-white transition-colors"
                  placeholder="Mood, energy level, digestion, etc."
                />
              </div>

              {/* Live nutrient feedback */}
              <div className="mb-4" aria-live="polite">
                <div className="flex space-x-4 text-sm">
                  <span className="font-semibold text-emerald-700 dark:text-emerald-300">Calories: {formData.calories || 0}</span>
                  <span className="font-semibold text-emerald-700 dark:text-emerald-300">Protein: {formData.protein || 0}g</span>
                  <span className="font-semibold text-emerald-700 dark:text-emerald-300">Carbs: {formData.carbs || 0}g</span>
                  <span className="font-semibold text-emerald-700 dark:text-emerald-300">Fat: {formData.fat || 0}g</span>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 px-6 rounded-xl hover:from-emerald-700 hover:to-teal-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  aria-label="Add Food"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Adding...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <Plus className="h-4 w-4" />
                      <span>Add Food</span>
                    </div>
                  )}
                </button>
                
                {formData.foodName && (
                  <button
                    type="button"
                    onClick={saveAsCustomFood}
                    className="px-6 py-3 border-2 border-emerald-200 text-emerald-600 rounded-xl hover:bg-emerald-50/80 backdrop-blur-sm transition-colors font-medium flex items-center space-x-2"
                    aria-label="Save as Custom Food"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save Custom</span>
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}