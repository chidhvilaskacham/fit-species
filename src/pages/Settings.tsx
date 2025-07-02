import React, { useState } from 'react';
import { User, Target, Bell, Moon, Sun, Download, Save, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { supabase, isSupabaseConnected } from '../lib/supabase';
import { format as dateFormat } from 'date-fns';
import toast from 'react-hot-toast';

export default function Settings() {
  const { userProfile, updateProfile } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'data'>('profile');
  const [loading, setLoading] = useState(false);
  
  // Profile form states
  const [formData, setFormData] = useState({
    name: userProfile?.name || '',
    dailyCalorieGoal: userProfile?.daily_calorie_goal || 2000,
    weightGoal: userProfile?.weight_goal || 'maintain' as 'maintain' | 'lose' | 'gain',
    dietaryPreferences: userProfile?.dietary_preferences || [] as string[],
    allergies: userProfile?.allergies?.join(', ') || '',
  });
  
  // Notification states
  const [notifications, setNotifications] = useState({
    mealReminders: true,
    waterReminders: true,
    reminderTime: '09:00',
  });

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
    { value: 'lose', label: 'Lose Weight', icon: '📉' },
    { value: 'maintain', label: 'Maintain', icon: '⚖️' },
    { value: 'gain', label: 'Gain Weight', icon: '📈' },
  ];

  const handleDietaryPreferenceChange = (preference: string) => {
    setFormData(prev => ({
      ...prev,
      dietaryPreferences: prev.dietaryPreferences.includes(preference)
        ? prev.dietaryPreferences.filter(p => p !== preference)
        : [...prev.dietaryPreferences, preference]
    }));
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateProfile({
        name: formData.name,
        daily_calorie_goal: formData.dailyCalorieGoal,
        weight_goal: formData.weightGoal,
        dietary_preferences: formData.dietaryPreferences,
        allergies: formData.allergies.split(',').map(a => a.trim()).filter(a => a),
      });
      toast.success('Profile updated successfully!');
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const error = err as Error; // Or a more specific error type if available
      toast.error('Failed to update profile. Please try again.');
    }

    setLoading(false);
  };

  const handleExportData = async (exportFormat: 'csv' | 'json') => {
    if (!userProfile || !isSupabaseConnected) {
      toast.error('Database not connected. Cannot export data.');
      return;
    }

    try {
      // Fetch all user data
      const [foodEntries, weightEntries, customFoods] = await Promise.all([
        supabase.from('food_entries').select('*').eq('user_id', userProfile.id),
        supabase.from('weight_entries').select('*').eq('user_id', userProfile.id),
        supabase.from('custom_foods').select('*').eq('user_id', userProfile.id),
      ]);

      const exportData = {
        profile: userProfile,
        food_entries: foodEntries.data || [],
        weight_entries: weightEntries.data || [],
        custom_foods: customFoods.data || [],
        exported_at: new Date().toISOString(),
      };

      if (exportFormat === 'json') {
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `fit-species-data-${dateFormat(new Date(), 'yyyy-MM-dd')}.json`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        // Simple CSV export for food entries
        const csvData = [
          ['Date', 'Meal', 'Food', 'Quantity', 'Calories', 'Protein', 'Carbs', 'Fat', 'Notes'],
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ...exportData.food_entries.map((entry: any) => [
            entry.date,
            entry.meal_type,
            entry.food_name,
            entry.quantity,
            entry.calories,
            entry.protein,
            entry.carbs,
            entry.fat,
            entry.notes || '',
          ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `fit-species-food-log-${dateFormat(new Date(), 'yyyy-MM-dd')}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      }

      toast.success(`Data exported successfully as ${exportFormat.toUpperCase()}!`);
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const error = err as Error; // Or a more specific error type if available
      toast.error('Failed to export data. Please try again.');
    }
  };

  const tabs = [
    { key: 'profile', label: 'Profile', icon: User },
    { key: 'notifications', label: 'Notifications', icon: Bell },
    { key: 'data', label: 'Data & Privacy', icon: Download },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/30 via-teal-50/30 to-cyan-50/30 relative">
      {/* Subtle background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 text-4xl opacity-5 animate-float" style={{ animationDelay: '0s' }}>⚙️</div>
        <div className="absolute top-40 right-32 text-3xl opacity-8 animate-float" style={{ animationDelay: '2s' }}>👤</div>
        <div className="absolute bottom-32 left-32 text-5xl opacity-4 animate-float" style={{ animationDelay: '4s' }}>🔧</div>
        <div className="absolute bottom-20 right-20 text-3xl opacity-6 animate-float" style={{ animationDelay: '1s' }}>📱</div>
        <div className="absolute top-1/2 left-1/3 text-4xl opacity-5 animate-float" style={{ animationDelay: '3s' }}>🎨</div>
        <div className="absolute top-1/4 right-1/4 text-3xl opacity-7 animate-float" style={{ animationDelay: '5s' }}>🔒</div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Settings ⚙️
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Manage your account preferences and data
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200/50 dark:border-gray-700/50 mb-8">
          <nav className="flex space-x-8" role="tablist" aria-label="Settings Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                    onClick={() => setActiveTab(tab.key as 'profile' | 'notifications' | 'data')}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                    activeTab === tab.key
                      ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                  role="tab"
                  aria-selected={activeTab === tab.key}
                  aria-controls={`settings-tabpanel-${tab.key}`}
                  tabIndex={activeTab === tab.key ? 0 : -1}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 rounded-2xl shadow-lg border border-gray-100/50 dark:border-gray-700/50 p-6 animate-slide-up" id="settings-tabpanel-profile" role="tabpanel" aria-labelledby="settings-tab-profile">
            <form onSubmit={handleProfileUpdate} className="space-y-6" aria-label="Profile Settings Form">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50/80 backdrop-blur-sm dark:bg-gray-700/80 dark:text-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                  <Target className="h-4 w-4 mr-2" />
                  Daily Calorie Goal
                </label>
                <input
                  type="number"
                  required
                  min="1000"
                  max="5000"
                  value={formData.dailyCalorieGoal}
                  onChange={(e) => setFormData(prev => ({ ...prev, dailyCalorieGoal: parseInt(e.target.value) }))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50/80 backdrop-blur-sm dark:bg-gray-700/80 dark:text-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Weight Goal
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {weightGoalOptions.map((option) => (
                    <label
                      key={option.value}
                      className={`relative flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 backdrop-blur-sm ${
                        formData.weightGoal === option.value
                          ? 'border-emerald-500 bg-gradient-to-br from-emerald-50/80 to-teal-50/80 dark:from-emerald-900/20 dark:to-teal-900/20'
                          : 'border-gray-200/50 dark:border-gray-600/50 hover:border-gray-300 dark:hover:border-gray-500 bg-white/50 dark:bg-gray-700/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="weightGoal"
                        value={option.value}
                        checked={formData.weightGoal === option.value}
                        onChange={(e) => setFormData(prev => ({ ...prev, weightGoal: e.target.value as 'maintain' | 'lose' | 'gain' }))}
                        className="sr-only"
                      />
                      <div className="text-2xl mb-2">{option.icon}</div>
                      <span className="font-medium text-gray-900 dark:text-white text-center">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Dietary Preferences
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {dietaryOptions.map((option) => (
                    <label
                      key={option}
                      className={`flex items-center justify-center p-3 border-2 rounded-xl cursor-pointer transition-all duration-200 backdrop-blur-sm ${
                        formData.dietaryPreferences.includes(option)
                          ? 'border-emerald-500 bg-emerald-50/80 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300'
                          : 'border-gray-200/50 dark:border-gray-600/50 hover:border-gray-300 dark:hover:border-gray-500 bg-white/50 dark:bg-gray-700/50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.dietaryPreferences.includes(option)}
                        onChange={() => handleDietaryPreferenceChange(option)}
                        className="sr-only"
                      />
                      <span className="text-sm font-medium">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  Allergies
                </label>
                <input
                  type="text"
                  value={formData.allergies}
                  onChange={(e) => setFormData(prev => ({ ...prev, allergies: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50/80 backdrop-blur-sm dark:bg-gray-700/80 dark:text-white transition-colors"
                  placeholder="e.g., Peanuts, Shellfish, Dairy (comma-separated)"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50/80 to-gray-100/80 dark:from-gray-700/80 dark:to-gray-800/80 rounded-xl border border-gray-200/50 dark:border-gray-600/50 backdrop-blur-sm">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg shadow-lg">
                    {darkMode ? <Moon className="h-5 w-5 text-white" /> : <Sun className="h-5 w-5 text-white" />}
                  </div>
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      Dark Mode
                    </span>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Switch between light and dark themes
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={toggleDarkMode}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    darkMode ? 'bg-emerald-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      darkMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 px-6 rounded-xl hover:from-emerald-700 hover:to-teal-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                aria-label="Save Profile Changes"
                aria-busy={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Save className="h-4 w-4" />
                    <span>Save Changes</span>
                  </div>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 rounded-2xl shadow-lg border border-gray-100/50 dark:border-gray-700/50 p-6 animate-slide-up" id="settings-tabpanel-notifications" role="tabpanel" aria-labelledby="settings-tab-notifications">
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50/80 to-gray-100/80 dark:from-gray-700/80 dark:to-gray-800/80 rounded-xl border border-gray-200/50 dark:border-gray-600/50 backdrop-blur-sm">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg shadow-lg">
                    <Bell className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Meal Reminders</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Get reminded to log your meals throughout the day
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setNotifications(prev => ({ ...prev, mealReminders: !prev.mealReminders }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications.mealReminders ? 'bg-emerald-600' : 'bg-gray-200 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications.mealReminders ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50/80 to-gray-100/80 dark:from-gray-700/80 dark:to-gray-800/80 rounded-xl border border-gray-200/50 dark:border-gray-600/50 backdrop-blur-sm">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg shadow-lg">
                    <span className="text-white text-sm font-bold">💧</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Water Reminders</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Stay hydrated with regular water intake reminders
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setNotifications(prev => ({ ...prev, waterReminders: !prev.waterReminders }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications.waterReminders ? 'bg-emerald-600' : 'bg-gray-200 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications.waterReminders ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Daily Reminder Time
                </label>
                <input
                  type="time"
                  value={notifications.reminderTime}
                  onChange={(e) => setNotifications(prev => ({ ...prev, reminderTime: e.target.value }))}
                  className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50/80 backdrop-blur-sm dark:bg-gray-700/80 dark:text-white transition-colors"
                />
              </div>

              <div className="bg-blue-50/80 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 backdrop-blur-sm" aria-live="polite">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Note:</strong> Browser notifications require permission. 
                  We'll ask for permission when you enable reminders for the first time.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Data & Privacy Tab */}
        {activeTab === 'data' && (
          <div className="space-y-6" id="settings-tabpanel-data" role="tabpanel" aria-labelledby="settings-tab-data">
            <div className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 rounded-2xl shadow-lg border border-gray-100/50 dark:border-gray-700/50 p-6 animate-slide-up">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Download className="h-5 w-5 mr-2" />
                Export Your Data
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Download all your Fit Species data including food logs, weight entries, and custom foods.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => handleExportData('csv')}
                  className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <Download className="h-4 w-4" />
                  <span>Export as CSV</span>
                </button>
                
                <button
                  onClick={() => handleExportData('json')}
                  className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <Download className="h-4 w-4" />
                  <span>Export as JSON</span>
                </button>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 rounded-2xl shadow-lg border border-gray-100/50 dark:border-gray-700/50 p-6 animate-slide-up mt-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Privacy & Security
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Your data is encrypted and never shared without your consent. You can request account deletion at any time.
              </p>
              <button
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl hover:from-red-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                aria-label="Request Account Deletion"
                onClick={() => toast.info('Account deletion feature coming soon!')}
              >
                <Shield className="h-4 w-4" />
                <span>Request Account Deletion</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}