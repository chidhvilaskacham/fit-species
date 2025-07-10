import React, { useState, useEffect } from 'react';
import { Search, Filter, Clock, Star, ArrowLeft, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useFood } from '../contexts/FoodContext';
import { commonFoods } from '../data/commonFoods';
import Fuse from 'fuse.js';
import toast from 'react-hot-toast';

export default function FoodSearch() {
  const navigate = useNavigate();
  const { addFoodEntry, recentFoods, fetchRecentFoods } = useFood();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFood, setSelectedFood] = useState<any>(null);
  const [quantity, setQuantity] = useState('1');
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snacks'>('breakfast');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  // Fuzzy search setup
  const fuse = new Fuse(commonFoods, {
    keys: ['name', 'category'],
    threshold: 0.3,
  });

  const categories = ['all', ...Array.from(new Set(commonFoods.map(food => food.category)))];

  const filteredFoods = React.useMemo(() => {
    let foods = searchTerm
      ? fuse.search(searchTerm).map(result => result.item)
      : commonFoods;

    if (selectedCategory !== 'all') {
      foods = foods.filter(food => food.category === selectedCategory);
    }

    return foods.slice(0, 50); // Limit results for performance
  }, [searchTerm, selectedCategory]);

  useEffect(() => {
    fetchRecentFoods();
  }, [fetchRecentFoods]);

  const handleSelectFood = (food: any) => {
    setSelectedFood(food);
    setQuantity('1');
    setNotes('');
  };

  const handleAddFood = async () => {
    if (!selectedFood) return;

    setLoading(true);
    try {
      const multiplier = parseFloat(quantity) || 1;
      
      await addFoodEntry({
        food_name: selectedFood.name,
        quantity: `${quantity} × ${selectedFood.serving}`,
        calories: selectedFood.calories * multiplier,
        protein: selectedFood.protein * multiplier,
        carbs: selectedFood.carbs * multiplier,
        fat: selectedFood.fat * multiplier,
        meal_type: mealType,
        notes: notes || undefined,
        date: new Date().toISOString().split('T')[0],
      });
      
      toast.success('Food added successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to add food entry');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/30 via-emerald-50/30 to-teal-50/30 relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 text-4xl opacity-10 animate-float" style={{ animationDelay: '0s' }}>🔍</div>
        <div className="absolute top-40 right-32 text-3xl opacity-15 animate-float" style={{ animationDelay: '2s' }}>🍎</div>
        <div className="absolute bottom-32 left-32 text-5xl opacity-8 animate-float" style={{ animationDelay: '4s' }}>🥗</div>
        <div className="absolute bottom-20 right-20 text-3xl opacity-12 animate-float" style={{ animationDelay: '1s' }}>🥑</div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center space-x-4 mb-4">
            <Link
              to="/dashboard"
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors rounded-lg hover:bg-white/50 backdrop-blur-sm dark:hover:bg-gray-700"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Food Database 🔍
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Search from thousands of foods and add to your meals
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Search & Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search Bar */}
            <div className="bg-white/90 backdrop-blur-sm dark:bg-gray-800/90 rounded-2xl shadow-lg p-6 border border-gray-100/50 dark:border-gray-700/50 animate-slide-up">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search foods (e.g., chicken breast, banana, oats...)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50/80 backdrop-blur-sm dark:bg-gray-700/80 dark:text-white transition-colors"
                  />
                </div>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="pl-10 pr-8 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50/80 backdrop-blur-sm dark:bg-gray-700/80 dark:text-white transition-colors"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Recent Foods */}
            {recentFoods.length > 0 && !searchTerm && (
              <div className="bg-white/90 backdrop-blur-sm dark:bg-gray-800/90 rounded-2xl shadow-lg p-6 border border-gray-100/50 dark:border-gray-700/50 animate-slide-up">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-blue-600" />
                  Recent Foods
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {recentFoods.slice(0, 6).map((food, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelectFood({
                        name: food.food_name,
                        calories: food.calories,
                        protein: food.protein,
                        carbs: food.carbs,
                        fat: food.fat,
                        serving: food.quantity,
                        category: 'Recent'
                      })}
                      className="p-4 text-left bg-blue-50/80 dark:bg-blue-900/20 rounded-xl border border-blue-200/50 dark:border-blue-800/50 hover:bg-blue-100/80 dark:hover:bg-blue-900/30 transition-all duration-200 transform hover:-translate-y-0.5"
                    >
                      <h4 className="font-medium text-gray-900 dark:text-white">{food.food_name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{food.calories} cal</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Search Results */}
            <div className="bg-white/90 backdrop-blur-sm dark:bg-gray-800/90 rounded-2xl shadow-lg border border-gray-100/50 dark:border-gray-700/50 animate-slide-up">
              <div className="p-6 border-b border-gray-200/50 dark:border-gray-600/50">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {searchTerm ? `Search Results (${filteredFoods.length})` : `All Foods (${filteredFoods.length})`}
                </h3>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {filteredFoods.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="text-6xl mb-4 opacity-20">🔍</div>
                    <p className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">No foods found</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">Try adjusting your search terms</p>
                  </div>
                ) : (
                  <div className="space-y-2 p-4">
                    {filteredFoods.map((food, index) => (
                      <button
                        key={index}
                        onClick={() => handleSelectFood(food)}
                        className={`w-full p-4 text-left rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 ${
                          selectedFood?.name === food.name
                            ? 'bg-green-100/80 dark:bg-green-900/20 border-2 border-green-500'
                            : 'bg-gray-50/80 dark:bg-gray-700/80 hover:bg-gray-100/80 dark:hover:bg-gray-600/80 border border-gray-200/50 dark:border-gray-600/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 dark:text-white">{food.name}</h4>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="text-sm text-gray-600 dark:text-gray-400">{food.serving}</span>
                              <span className="text-sm font-medium text-orange-600">{food.calories} cal</span>
                              <span className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full">
                                {food.category}
                              </span>
                            </div>
                          </div>
                          {selectedFood?.name === food.name && (
                            <div className="ml-4">
                              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                <Plus className="h-4 w-4 text-white" />
                              </div>
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Selected Food Details */}
          <div className="bg-white/90 backdrop-blur-sm dark:bg-gray-800/90 rounded-2xl shadow-lg p-6 border border-gray-100/50 dark:border-gray-700/50 animate-slide-up sticky top-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <Star className="h-5 w-5 mr-2 text-yellow-500" />
              Selected Food
            </h3>

            {selectedFood ? (
              <div className="space-y-6">
                {/* Food Info */}
                <div className="bg-gradient-to-r from-green-50/80 to-emerald-50/80 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border border-green-200/50 dark:border-green-800/50">
                  <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-2">{selectedFood.name}</h4>
                  <p className="text-gray-600 dark:text-gray-400">{selectedFood.serving}</p>
                  <p className="text-xs text-green-600 dark:text-green-400 font-medium mt-1">{selectedFood.category}</p>
                </div>

                {/* Nutrition Info */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-orange-50/80 dark:bg-orange-900/20 rounded-lg border border-orange-200/50 dark:border-orange-800/50">
                    <div className="text-xl font-bold text-orange-600">{selectedFood.calories}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Calories</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50/80 dark:bg-blue-900/20 rounded-lg border border-blue-200/50 dark:border-blue-800/50">
                    <div className="text-xl font-bold text-blue-600">{selectedFood.protein}g</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Protein</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-50/80 dark:bg-yellow-900/20 rounded-lg border border-yellow-200/50 dark:border-yellow-800/50">
                    <div className="text-xl font-bold text-yellow-600">{selectedFood.carbs}g</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Carbs</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50/80 dark:bg-purple-900/20 rounded-lg border border-purple-200/50 dark:border-purple-800/50">
                    <div className="text-xl font-bold text-purple-600">{selectedFood.fat}g</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Fat</div>
                  </div>
                </div>

                {/* Add to Meal Form */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Quantity
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0.1"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50/80 backdrop-blur-sm dark:bg-gray-700/80 dark:text-white transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Meal
                      </label>
                      <select
                        value={mealType}
                        onChange={(e) => setMealType(e.target.value as any)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50/80 backdrop-blur-sm dark:bg-gray-700/80 dark:text-white transition-colors"
                      >
                        <option value="breakfast">Breakfast</option>
                        <option value="lunch">Lunch</option>
                        <option value="dinner">Dinner</option>
                        <option value="snacks">Snacks</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Notes (Optional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50/80 backdrop-blur-sm dark:bg-gray-700/80 dark:text-white transition-colors"
                      placeholder="Any notes..."
                    />
                  </div>

                  <button
                    onClick={handleAddFood}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Adding...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <Plus className="h-4 w-4" />
                        <span>Add to {mealType.charAt(0).toUpperCase() + mealType.slice(1)}</span>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4 opacity-20">🍎</div>
                <p className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">No food selected</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Search and select a food to see details and add to your meal
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}