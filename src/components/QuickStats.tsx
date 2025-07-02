import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, Calendar, Target, Flame, Droplets } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useFood } from '../contexts/FoodContext';
import { supabase, isSupabaseConnected } from '../lib/supabase';
import { format, subDays } from 'date-fns';

interface WeeklyStats {
  avgCalories: number;
  avgProtein: number;
  avgCarbs: number;
  avgFat: number;
  caloriesTrend: number;
  proteinTrend: number;
  daysLogged: number;
  goalAchieved: number;
}

export default function QuickStats() {
  const { userProfile } = useAuth();
  const { foodEntries } = useFood();
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats | null>(null);
  const [waterIntake, setWaterIntake] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userProfile && isSupabaseConnected) {
      calculateWeeklyStats();
      fetchTodayWaterIntake();
    }
  }, [userProfile, foodEntries]);

  const calculateWeeklyStats = async () => {
    if (!userProfile || !isSupabaseConnected) return;

    try {
      const sevenDaysAgo = format(subDays(new Date(), 7), 'yyyy-MM-dd');
      const fourteenDaysAgo = format(subDays(new Date(), 14), 'yyyy-MM-dd');

      // Get last 14 days of data for comparison
      const { data, error } = await supabase
        .from('food_entries')
        .select('date, calories, protein, carbs, fat')
        .eq('user_id', userProfile.id)
        .gte('date', fourteenDaysAgo)
        .order('date', { ascending: true });

      if (error) throw error;

      // Group by date and calculate daily totals
      const dailyTotals = (data || []).reduce((acc: any, entry: any) => {
        const date = entry.date;
        if (!acc[date]) {
          acc[date] = { calories: 0, protein: 0, carbs: 0, fat: 0 };
        }
        acc[date].calories += Number(entry.calories);
        acc[date].protein += Number(entry.protein);
        acc[date].carbs += Number(entry.carbs);
        acc[date].fat += Number(entry.fat);
        return acc;
      }, {});

      const allDates = Object.keys(dailyTotals).sort();
      const lastWeekDates = allDates.filter(date => date >= sevenDaysAgo);
      const previousWeekDates = allDates.filter(date => date >= fourteenDaysAgo && date < sevenDaysAgo);

      // Calculate averages for last week
      const lastWeekData = lastWeekDates.map(date => dailyTotals[date]);
      const avgCalories = lastWeekData.reduce((sum, day) => sum + day.calories, 0) / Math.max(lastWeekData.length, 1);
      const avgProtein = lastWeekData.reduce((sum, day) => sum + day.protein, 0) / Math.max(lastWeekData.length, 1);
      const avgCarbs = lastWeekData.reduce((sum, day) => sum + day.carbs, 0) / Math.max(lastWeekData.length, 1);
      const avgFat = lastWeekData.reduce((sum, day) => sum + day.fat, 0) / Math.max(lastWeekData.length, 1);

      // Calculate averages for previous week
      const previousWeekData = previousWeekDates.map(date => dailyTotals[date]);
      const prevAvgCalories = previousWeekData.reduce((sum, day) => sum + day.calories, 0) / Math.max(previousWeekData.length, 1);
      const prevAvgProtein = previousWeekData.reduce((sum, day) => sum + day.protein, 0) / Math.max(previousWeekData.length, 1);

      // Calculate trends
      const caloriesTrend = avgCalories - prevAvgCalories;
      const proteinTrend = avgProtein - prevAvgProtein;

      // Calculate goal achievements
      const goalCalories = userProfile.daily_calorie_goal || 2000;
      const goalAchieved = lastWeekData.filter(day => 
        Math.abs(day.calories - goalCalories) <= 100
      ).length;

      setWeeklyStats({
        avgCalories: Math.round(avgCalories),
        avgProtein: Math.round(avgProtein),
        avgCarbs: Math.round(avgCarbs),
        avgFat: Math.round(avgFat),
        caloriesTrend: Math.round(caloriesTrend),
        proteinTrend: Math.round(proteinTrend),
        daysLogged: lastWeekData.length,
        goalAchieved,
      });
    } catch (error) {
      console.error('Error calculating weekly stats:', error);
    }
    setLoading(false);
  };

  const fetchTodayWaterIntake = async () => {
    if (!userProfile || !isSupabaseConnected) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('water_entries')
        .select('amount')
        .eq('user_id', userProfile.id)
        .eq('date', today);

      if (error) throw error;
      
      const total = data?.reduce((sum, entry) => sum + entry.amount, 0) || 0;
      setWaterIntake(total);
    } catch (error) {
      console.error('Error fetching water intake:', error);
    }
  };

  if (loading || !weeklyStats) {
    return (
      <div className="glass-effect rounded-3xl shadow-xl p-6 border border-white/20 dark:border-neutral-700/30 animate-pulse">
        <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded mb-4"></div>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: 'Avg Calories',
      value: weeklyStats.avgCalories,
      trend: weeklyStats.caloriesTrend,
      icon: Flame,
      color: 'text-orange-600',
      bgColor: 'from-orange-400 to-red-500',
    },
    {
      label: 'Avg Protein',
      value: `${weeklyStats.avgProtein}g`,
      trend: weeklyStats.proteinTrend,
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'from-blue-400 to-purple-500',
    },
    {
      label: 'Days Logged',
      value: `${weeklyStats.daysLogged}/7`,
      trend: 0,
      icon: Calendar,
      color: 'text-emerald-600',
      bgColor: 'from-emerald-400 to-teal-500',
    },
    {
      label: 'Water Today',
      value: `${Math.round(waterIntake / 1000 * 10) / 10}L`,
      trend: 0,
      icon: Droplets,
      color: 'text-cyan-600',
      bgColor: 'from-cyan-400 to-blue-500',
    },
  ];

  return (
    <div className="glass-effect rounded-3xl shadow-xl p-6 border border-white/20 dark:border-neutral-700/30">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-neutral-900 dark:text-white">Weekly Overview</h3>
        <div className="text-sm text-neutral-500 dark:text-neutral-400">
          Last 7 days
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          const getTrendIcon = () => {
            if (stat.trend > 0) return TrendingUp;
            if (stat.trend < 0) return TrendingDown;
            return Minus;
          };
          const TrendIcon = getTrendIcon();
          
          return (
            <motion.div
              key={index}
              className="p-4 bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-700 rounded-2xl border border-neutral-200 dark:border-neutral-600"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 bg-gradient-to-br ${stat.bgColor} rounded-lg shadow-lg`}>
                  <IconComponent className="h-4 w-4 text-white" />
                </div>
                {stat.trend !== 0 && (
                  <div className={`flex items-center space-x-1 ${
                    stat.trend > 0 ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    <TrendIcon className="h-3 w-3" />
                    <span className="text-xs font-medium">
                      {Math.abs(stat.trend)}
                    </span>
                  </div>
                )}
              </div>
              
              <div>
                <p className="text-lg font-bold text-neutral-900 dark:text-white">
                  {stat.value}
                </p>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                  {stat.label}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Goal Achievement Progress */}
      <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl border border-emerald-200 dark:border-emerald-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
            Goal Achievement
          </span>
          <span className="text-sm font-bold text-emerald-600">
            {weeklyStats.goalAchieved}/7 days
          </span>
        </div>
        <div className="w-full bg-emerald-200 dark:bg-emerald-800 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-emerald-400 to-teal-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(weeklyStats.goalAchieved / 7) * 100}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
}