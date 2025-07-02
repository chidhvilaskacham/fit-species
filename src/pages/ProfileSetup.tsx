import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Target, Heart, Shield, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function ProfileSetup() {
  const [formData, setFormData] = useState({
    name: '',
    dailyCalorieGoal: 2000,
    weightGoal: 'maintain' as 'maintain' | 'lose' | 'gain',
    dietaryPreferences: [] as string[],
    allergies: '',
  });
  const [loading, setLoading] = useState(false);
  const { updateProfile, user } = useAuth();
  const navigate = useNavigate();

  const dietaryOptions = [
    'Balanced',
    'Vegetarian',
    'Vegan',
    'Keto',
    'Low-Carb',
    'Mediterranean',
    'Paleo',
    'Gluten-Free',
  ];

  const weightGoalOptions = [
    { value: 'lose', label: 'Lose Weight', desc: 'Create a calorie deficit', icon: '📉' },
    { value: 'maintain', label: 'Maintain', desc: 'Stay at current weight', icon: '⚖️' },
    { value: 'gain', label: 'Gain Weight', desc: 'Build muscle or gain mass', icon: '📈' },
  ];

  const handleDietaryPreferenceChange = (preference: string) => {
    setFormData(prev => ({
      ...prev,
      dietaryPreferences: prev.dietaryPreferences.includes(preference)
        ? prev.dietaryPreferences.filter(p => p !== preference)
        : [...prev.dietaryPreferences, preference]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    if (!user) {
      toast.error('No authenticated user found. Please try logging in again.');
      return;
    }

    setLoading(true);

    try {
      await updateProfile({
        name: formData.name.trim(),
        daily_calorie_goal: formData.dailyCalorieGoal,
        weight_goal: formData.weightGoal,
        dietary_preferences: formData.dietaryPreferences,
        allergies: formData.allergies.split(',').map(a => a.trim()).filter(a => a),
      });
      
      toast.success('Profile setup complete! Welcome to Fit Species!');
      
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 100);
      
    } catch (err) {
      console.error('Profile update error:', err);
      toast.error((err as Error).message || 'Failed to save profile. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white dark:bg-neutral-800 rounded-2xl shadow-md p-6 sm:p-8 animate-fade-in border border-neutral-200 dark:border-neutral-700">
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-br from-mint-300 to-sky-300 rounded-2xl shadow-md">
              <Activity className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mb-2">Complete Your Profile</h1>
          <p className="text-neutral-600 dark:text-neutral-300">Let's personalize your fitness journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          {/* Name */}
          <div className="animate-slide-up">
            <label htmlFor="name" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3 flex items-center">
              <User className="h-4 w-4 mr-2" />
              Full Name *
            </label>
            <input
              id="name"
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 sm:py-4 border border-neutral-300 dark:border-neutral-600 rounded-2xl focus:ring-2 focus:ring-mint-300 focus:border-mint-300 transition-all bg-neutral-50 dark:bg-neutral-700 dark:text-white hover:scale-105 text-sm sm:text-base"
              placeholder="Enter your full name"
              disabled={loading}
            />
          </div>

          {/* Daily Calorie Goal */}
          <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <label htmlFor="calories" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3 flex items-center">
              <Target className="h-4 w-4 mr-2" />
              Daily Calorie Goal
            </label>
            <input
              id="calories"
              type="number"
              required
              min="1000"
              max="5000"
              value={formData.dailyCalorieGoal}
              onChange={(e) => setFormData(prev => ({ ...prev, dailyCalorieGoal: parseInt(e.target.value) }))}
              className="w-full px-4 py-3 sm:py-4 border border-neutral-300 dark:border-neutral-600 rounded-2xl focus:ring-2 focus:ring-mint-300 focus:border-mint-300 transition-all bg-neutral-50 dark:bg-neutral-700 dark:text-white hover:scale-105 text-sm sm:text-base"
              disabled={loading}
            />
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">Typical range: 1,500-2,500 calories per day</p>
          </div>

          {/* Weight Goal */}
          <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-4 flex items-center">
              <Heart className="h-4 w-4 mr-2" />
              Weight Goal
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {weightGoalOptions.map((option) => (
                <label
                  key={option.value}
                  className={`relative flex flex-col p-4 sm:p-6 border-2 rounded-2xl cursor-pointer transition-all hover:scale-105 ${
                    formData.weightGoal === option.value
                      ? 'border-mint-300 bg-mint-50 dark:bg-mint-900/20 shadow-md'
                      : 'border-neutral-200 dark:border-neutral-600 hover:border-neutral-300 dark:hover:border-neutral-500 bg-white dark:bg-neutral-700'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <input
                    type="radio"
                    name="weightGoal"
                    value={option.value}
                    checked={formData.weightGoal === option.value}
                    onChange={(e) => setFormData(prev => ({ ...prev, weightGoal: e.target.value as 'maintain' | 'lose' | 'gain' }))}
                    className="sr-only"
                    disabled={loading}
                  />
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl mb-2">{option.icon}</div>
                    <span className="font-semibold text-neutral-900 dark:text-white block text-sm sm:text-base">{option.label}</span>
                    <span className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">{option.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Dietary Preferences */}
          <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-4">
              Dietary Preferences (Optional)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {dietaryOptions.map((option) => (
                <label
                  key={option}
                  className={`flex items-center justify-center p-3 border-2 rounded-2xl cursor-pointer transition-all hover:scale-105 ${
                    formData.dietaryPreferences.includes(option)
                      ? 'border-mint-300 bg-mint-50 text-mint-700 dark:bg-mint-900/20 dark:text-mint-300 shadow-md'
                      : 'border-neutral-200 dark:border-neutral-600 hover:border-neutral-300 dark:hover:border-neutral-500 bg-white dark:bg-neutral-700'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={formData.dietaryPreferences.includes(option)}
                    onChange={() => handleDietaryPreferenceChange(option)}
                    className="sr-only"
                    disabled={loading}
                  />
                  <span className="text-sm font-medium">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Allergies */}
          <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <label htmlFor="allergies" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3 flex items-center">
              <Shield className="h-4 w-4 mr-2" />
              Allergies (Optional)
            </label>
            <input
              id="allergies"
              type="text"
              value={formData.allergies}
              onChange={(e) => setFormData(prev => ({ ...prev, allergies: e.target.value }))}
              className="w-full px-4 py-3 sm:py-4 border border-neutral-300 dark:border-neutral-600 rounded-2xl focus:ring-2 focus:ring-mint-300 focus:border-mint-300 transition-all bg-neutral-50 dark:bg-neutral-700 dark:text-white hover:scale-105 text-sm sm:text-base"
              placeholder="e.g., Peanuts, Shellfish, Dairy (comma-separated)"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !formData.name.trim()}
            className="w-full bg-gradient-to-r from-mint-300 to-sky-300 text-white py-3 sm:py-4 px-6 rounded-2xl hover:scale-105 focus:ring-2 focus:ring-mint-300 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm sm:text-lg shadow-md animate-slide-up"
            style={{ animationDelay: '0.5s' }}
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Setting up your profile...</span>
              </div>
            ) : (
              'Complete Setup & Start Tracking'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}