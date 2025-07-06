import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Target, Heart, Shield, User, Scale, Ruler, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function ProfileSetup() {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'prefer-not-to-say' as 'male' | 'female' | 'prefer-not-to-say',
    height: '',
    weight: '',
    dailyCalorieGoal: 2000,
    weightGoal: 'maintain' as 'maintain' | 'lose' | 'gain',
    activityLevel: 'moderate' as 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active',
    dietaryPreferences: [] as string[],
    allergies: '',
    units: 'imperial' as 'metric' | 'imperial',
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
    'Dairy-Free',
    'High-Protein',
  ];

  const weightGoalOptions = [
    { value: 'lose', label: 'Lose Weight', desc: 'Create a calorie deficit', icon: '📉' },
    { value: 'maintain', label: 'Maintain', desc: 'Stay at current weight', icon: '⚖️' },
    { value: 'gain', label: 'Gain Weight', desc: 'Build muscle or gain mass', icon: '📈' },
  ];

  const activityLevels = [
    { value: 'sedentary', label: 'Sedentary', desc: 'Little to no exercise' },
    { value: 'light', label: 'Light', desc: 'Light exercise 1-3 days/week' },
    { value: 'moderate', label: 'Moderate', desc: 'Moderate exercise 3-5 days/week' },
    { value: 'active', label: 'Active', desc: 'Heavy exercise 6-7 days/week' },
    { value: 'very-active', label: 'Very Active', desc: 'Very heavy exercise, physical job' },
  ];

  const genderOptions = [
    { value: 'male', label: 'Male', icon: '♂️' },
    { value: 'female', label: 'Female', icon: '♀️' },
    { value: 'prefer-not-to-say', label: 'Prefer not to say', icon: '🤝' },
  ];

  const handleDietaryPreferenceChange = (preference: string) => {
    setFormData(prev => ({
      ...prev,
      dietaryPreferences: prev.dietaryPreferences.includes(preference)
        ? prev.dietaryPreferences.filter(p => p !== preference)
        : [...prev.dietaryPreferences, preference]
    }));
  };

  const calculateCalorieGoal = () => {
    if (!formData.age || !formData.weight || !formData.height) return 2000;
    
    const age = parseInt(formData.age);
    const weight = parseFloat(formData.weight);
    const height = parseFloat(formData.height);
    
    // Convert to metric if needed
    const weightKg = formData.units === 'imperial' ? weight * 0.453592 : weight;
    const heightCm = formData.units === 'imperial' ? height * 2.54 : height;
    
    // Mifflin-St Jeor Equation
    let bmr;
    if (formData.gender === 'male') {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
    } else if (formData.gender === 'female') {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
    } else {
      // Average for prefer not to say
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 78;
    }
    
    // Activity multiplier
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      'very-active': 1.9,
    };
    
    const tdee = bmr * activityMultipliers[formData.activityLevel];
    
    // Adjust for weight goal
    if (formData.weightGoal === 'lose') {
      return Math.round(tdee - 500); // 500 calorie deficit
    } else if (formData.weightGoal === 'gain') {
      return Math.round(tdee + 300); // 300 calorie surplus
    }
    
    return Math.round(tdee);
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
      const calculatedCalories = calculateCalorieGoal();
      
      await updateProfile({
        name: formData.name.trim(),
        daily_calorie_goal: calculatedCalories,
        weight_goal: formData.weightGoal,
        dietary_preferences: formData.dietaryPreferences,
        allergies: formData.allergies.split(',').map(a => a.trim()).filter(a => a),
      });
      
      toast.success('Profile setup complete! Welcome to NutriTrack!');
      
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
    <div className="min-h-screen bg-gradient-to-br from-mint-50 via-sky-50 to-cyan-50 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-800 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-mint-200/20 to-sky-200/20 rounded-full blur-xl floating-element"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-br from-cyan-200/20 to-blue-200/20 rounded-full blur-xl floating-element" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-32 left-32 w-40 h-40 bg-gradient-to-br from-sky-200/20 to-mint-200/20 rounded-full blur-xl floating-element" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="max-w-4xl w-full bg-white/80 dark:bg-neutral-800/80 backdrop-blur-xl rounded-3xl shadow-xl p-6 sm:p-8 animate-fade-in border border-white/20 dark:border-neutral-700/30 relative z-10">
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-gradient-to-br from-mint-400 to-sky-500 rounded-3xl shadow-lg">
              <Activity className="h-12 w-12 sm:h-14 sm:w-14 text-white" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-2">Complete Your Profile</h1>
          <p className="text-neutral-600 dark:text-neutral-300">Let's personalize your nutrition journey with NutriTrack</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                className="w-full px-4 py-3 sm:py-4 border border-neutral-300/50 dark:border-neutral-600/50 rounded-2xl focus:ring-2 focus:ring-mint-400 focus:border-mint-400 transition-all bg-white/80 dark:bg-neutral-700/80 backdrop-blur-sm dark:text-white hover:scale-105 text-sm sm:text-base shadow-lg"
                placeholder="Enter your full name"
                disabled={loading}
              />
            </div>

            <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <label htmlFor="age" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3 flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Age
              </label>
              <input
                id="age"
                type="number"
                min="13"
                max="120"
                value={formData.age}
                onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                className="w-full px-4 py-3 sm:py-4 border border-neutral-300/50 dark:border-neutral-600/50 rounded-2xl focus:ring-2 focus:ring-mint-400 focus:border-mint-400 transition-all bg-white/80 dark:bg-neutral-700/80 backdrop-blur-sm dark:text-white hover:scale-105 text-sm sm:text-base shadow-lg"
                placeholder="Your age"
                disabled={loading}
              />
            </div>
          </div>

          {/* Gender Selection */}
          <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-4">
              Gender
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {genderOptions.map((option) => (
                <label
                  key={option.value}
                  className={`relative flex flex-col p-4 sm:p-6 border-2 rounded-2xl cursor-pointer transition-all hover:scale-105 ${
                    formData.gender === option.value
                      ? 'border-mint-400 bg-mint-50/80 dark:bg-mint-900/20 shadow-lg'
                      : 'border-neutral-200/50 dark:border-neutral-600/50 hover:border-neutral-300 dark:hover:border-neutral-500 bg-white/50 dark:bg-neutral-700/50'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <input
                    type="radio"
                    name="gender"
                    value={option.value}
                    checked={formData.gender === option.value}
                    onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value as 'male' | 'female' | 'prefer-not-to-say' }))}
                    className="sr-only"
                    disabled={loading}
                  />
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl mb-2">{option.icon}</div>
                    <span className="font-semibold text-neutral-900 dark:text-white block text-sm sm:text-base">{option.label}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Units Selection */}
          <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-4">
              Preferred Units
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className={`relative flex items-center p-4 border-2 rounded-2xl cursor-pointer transition-all hover:scale-105 ${
                formData.units === 'imperial'
                  ? 'border-mint-400 bg-mint-50/80 dark:bg-mint-900/20 shadow-lg'
                  : 'border-neutral-200/50 dark:border-neutral-600/50 hover:border-neutral-300 dark:hover:border-neutral-500 bg-white/50 dark:bg-neutral-700/50'
              }`}>
                <input
                  type="radio"
                  name="units"
                  value="imperial"
                  checked={formData.units === 'imperial'}
                  onChange={(e) => setFormData(prev => ({ ...prev, units: e.target.value as 'metric' | 'imperial' }))}
                  className="sr-only"
                />
                <div>
                  <span className="font-semibold text-neutral-900 dark:text-white">Imperial</span>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">Pounds, feet/inches, Fahrenheit</p>
                </div>
              </label>
              <label className={`relative flex items-center p-4 border-2 rounded-2xl cursor-pointer transition-all hover:scale-105 ${
                formData.units === 'metric'
                  ? 'border-mint-400 bg-mint-50/80 dark:bg-mint-900/20 shadow-lg'
                  : 'border-neutral-200/50 dark:border-neutral-600/50 hover:border-neutral-300 dark:hover:border-neutral-500 bg-white/50 dark:bg-neutral-700/50'
              }`}>
                <input
                  type="radio"
                  name="units"
                  value="metric"
                  checked={formData.units === 'metric'}
                  onChange={(e) => setFormData(prev => ({ ...prev, units: e.target.value as 'metric' | 'imperial' }))}
                  className="sr-only"
                />
                <div>
                  <span className="font-semibold text-neutral-900 dark:text-white">Metric</span>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">Kilograms, centimeters, Celsius</p>
                </div>
              </label>
            </div>
          </div>

          {/* Physical Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <label htmlFor="height" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3 flex items-center">
                <Ruler className="h-4 w-4 mr-2" />
                Height ({formData.units === 'imperial' ? 'inches' : 'cm'})
              </label>
              <input
                id="height"
                type="number"
                min="0"
                step="0.1"
                value={formData.height}
                onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
                className="w-full px-4 py-3 sm:py-4 border border-neutral-300/50 dark:border-neutral-600/50 rounded-2xl focus:ring-2 focus:ring-mint-400 focus:border-mint-400 transition-all bg-white/80 dark:bg-neutral-700/80 backdrop-blur-sm dark:text-white hover:scale-105 text-sm sm:text-base shadow-lg"
                placeholder={formData.units === 'imperial' ? 'e.g., 70' : 'e.g., 175'}
                disabled={loading}
              />
            </div>

            <div className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
              <label htmlFor="weight" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3 flex items-center">
                <Scale className="h-4 w-4 mr-2" />
                Weight ({formData.units === 'imperial' ? 'lbs' : 'kg'})
              </label>
              <input
                id="weight"
                type="number"
                min="0"
                step="0.1"
                value={formData.weight}
                onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                className="w-full px-4 py-3 sm:py-4 border border-neutral-300/50 dark:border-neutral-600/50 rounded-2xl focus:ring-2 focus:ring-mint-400 focus:border-mint-400 transition-all bg-white/80 dark:bg-neutral-700/80 backdrop-blur-sm dark:text-white hover:scale-105 text-sm sm:text-base shadow-lg"
                placeholder={formData.units === 'imperial' ? 'e.g., 150' : 'e.g., 70'}
                disabled={loading}
              />
            </div>
          </div>

          {/* Activity Level */}
          <div className="animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-4">
              Activity Level
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {activityLevels.map((level) => (
                <label
                  key={level.value}
                  className={`relative flex flex-col p-4 border-2 rounded-2xl cursor-pointer transition-all hover:scale-105 ${
                    formData.activityLevel === level.value
                      ? 'border-mint-400 bg-mint-50/80 dark:bg-mint-900/20 shadow-lg'
                      : 'border-neutral-200/50 dark:border-neutral-600/50 hover:border-neutral-300 dark:hover:border-neutral-500 bg-white/50 dark:bg-neutral-700/50'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <input
                    type="radio"
                    name="activityLevel"
                    value={level.value}
                    checked={formData.activityLevel === level.value}
                    onChange={(e) => setFormData(prev => ({ ...prev, activityLevel: e.target.value as any }))}
                    className="sr-only"
                    disabled={loading}
                  />
                  <div className="text-center">
                    <span className="font-semibold text-neutral-900 dark:text-white block text-sm">{level.label}</span>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">{level.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Weight Goal */}
          <div className="animate-slide-up" style={{ animationDelay: '0.7s' }}>
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
                      ? 'border-mint-400 bg-mint-50/80 dark:bg-mint-900/20 shadow-lg'
                      : 'border-neutral-200/50 dark:border-neutral-600/50 hover:border-neutral-300 dark:hover:border-neutral-500 bg-white/50 dark:bg-neutral-700/50'
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
          <div className="animate-slide-up" style={{ animationDelay: '0.8s' }}>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-4">
              Dietary Preferences (Optional)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {dietaryOptions.map((option) => (
                <label
                  key={option}
                  className={`flex items-center justify-center p-3 border-2 rounded-2xl cursor-pointer transition-all hover:scale-105 ${
                    formData.dietaryPreferences.includes(option)
                      ? 'border-mint-400 bg-mint-50/80 text-mint-700 dark:bg-mint-900/20 dark:text-mint-300 shadow-lg'
                      : 'border-neutral-200/50 dark:border-neutral-600/50 hover:border-neutral-300 dark:hover:border-neutral-500 bg-white/50 dark:bg-neutral-700/50'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={formData.dietaryPreferences.includes(option)}
                    onChange={() => handleDietaryPreferenceChange(option)}
                    className="sr-only"
                    disabled={loading}
                  />
                  <span className="text-sm font-medium text-center">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Allergies */}
          <div className="animate-slide-up" style={{ animationDelay: '0.9s' }}>
            <label htmlFor="allergies" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3 flex items-center">
              <Shield className="h-4 w-4 mr-2" />
              Allergies (Optional)
            </label>
            <input
              id="allergies"
              type="text"
              value={formData.allergies}
              onChange={(e) => setFormData(prev => ({ ...prev, allergies: e.target.value }))}
              className="w-full px-4 py-3 sm:py-4 border border-neutral-300/50 dark:border-neutral-600/50 rounded-2xl focus:ring-2 focus:ring-mint-400 focus:border-mint-400 transition-all bg-white/80 dark:bg-neutral-700/80 backdrop-blur-sm dark:text-white hover:scale-105 text-sm sm:text-base shadow-lg"
              placeholder="e.g., Peanuts, Shellfish, Dairy (comma-separated)"
              disabled={loading}
            />
          </div>

          {/* Calculated Calorie Goal Display */}
          {formData.age && formData.weight && formData.height && (
            <div className="animate-slide-up bg-mint-50/80 dark:bg-mint-900/20 border border-mint-200 dark:border-mint-800 rounded-2xl p-6 backdrop-blur-sm" style={{ animationDelay: '1s' }}>
              <div className="flex items-center space-x-3 mb-3">
                <Target className="h-6 w-6 text-mint-600" />
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Recommended Daily Calorie Goal</h3>
              </div>
              <p className="text-2xl font-bold text-mint-600 dark:text-mint-400 mb-2">
                {calculateCalorieGoal()} calories/day
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Based on your age, gender, height, weight, activity level, and weight goal. You can adjust this later in settings.
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !formData.name.trim()}
            className="w-full bg-gradient-to-r from-mint-400 to-sky-500 text-white py-3 sm:py-4 px-6 rounded-2xl hover:scale-105 focus:ring-2 focus:ring-mint-400 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm sm:text-lg shadow-lg hover:shadow-xl animate-slide-up"
            style={{ animationDelay: '1.1s' }}
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