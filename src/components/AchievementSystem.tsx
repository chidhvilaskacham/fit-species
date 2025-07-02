import React, { useState, useEffect } from 'react';
import { Trophy, Star, Flame, Target, Calendar, Award, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useFood } from '../contexts/FoodContext';
import { supabase, isSupabaseConnected } from '../lib/supabase';
import Confetti from 'react-confetti';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  gradient: string;
  condition: (data: any) => boolean;
  unlocked: boolean;
  unlockedAt?: string;
}

export default function AchievementSystem() {
  const { userProfile } = useAuth();
  const { foodEntries } = useFood();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);

  const achievementDefinitions: Omit<Achievement, 'unlocked' | 'unlockedAt'>[] = [
    {
      id: 'first_meal',
      title: 'First Steps',
      description: 'Log your first meal',
      icon: Star,
      color: 'text-yellow-600',
      gradient: 'from-yellow-400 to-orange-500',
      condition: (data) => data.totalEntries >= 1,
    },
    {
      id: 'week_streak',
      title: 'Week Warrior',
      description: 'Log meals for 7 consecutive days',
      icon: Flame,
      color: 'text-red-600',
      gradient: 'from-red-400 to-pink-500',
      condition: (data) => data.streak >= 7,
    },
    {
      id: 'goal_achiever',
      title: 'Goal Crusher',
      description: 'Meet your daily calorie goal 5 times',
      icon: Target,
      color: 'text-emerald-600',
      gradient: 'from-emerald-400 to-teal-500',
      condition: (data) => data.goalAchievements >= 5,
    },
    {
      id: 'month_tracker',
      title: 'Monthly Master',
      description: 'Track for 30 days',
      icon: Calendar,
      color: 'text-blue-600',
      gradient: 'from-blue-400 to-purple-500',
      condition: (data) => data.trackingDays >= 30,
    },
    {
      id: 'protein_power',
      title: 'Protein Power',
      description: 'Consume 100g+ protein in a day',
      icon: Zap,
      color: 'text-purple-600',
      gradient: 'from-purple-400 to-indigo-500',
      condition: (data) => data.maxDailyProtein >= 100,
    },
    {
      id: 'consistency_king',
      title: 'Consistency King',
      description: 'Log meals for 30 consecutive days',
      icon: Trophy,
      color: 'text-amber-600',
      gradient: 'from-amber-400 to-yellow-500',
      condition: (data) => data.streak >= 30,
    },
  ];

  useEffect(() => {
    if (userProfile && isSupabaseConnected) {
      loadAchievements();
    }
  }, [userProfile]);

  useEffect(() => {
    if (foodEntries.length > 0) {
      checkAchievements();
    }
  }, [foodEntries]);

  const loadAchievements = async () => {
    if (!userProfile || !isSupabaseConnected) return;

    try {
      const { data, error } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', userProfile.id);

      if (error) throw error;

      const unlockedIds = new Set(data?.map(a => a.achievement_id) || []);
      
      const achievementsWithStatus = achievementDefinitions.map(achievement => ({
        ...achievement,
        unlocked: unlockedIds.has(achievement.id),
        unlockedAt: data?.find(a => a.achievement_id === achievement.id)?.unlocked_at,
      }));

      setAchievements(achievementsWithStatus);
    } catch (error) {
      console.error('Error loading achievements:', error);
    }
  };

  const checkAchievements = async () => {
    if (!userProfile || !isSupabaseConnected) return;

    // Calculate user stats
    const totalEntries = foodEntries.length;
    const uniqueDates = new Set(foodEntries.map(entry => entry.date));
    const trackingDays = uniqueDates.size;
    
    // Calculate streak (simplified)
    const sortedDates = Array.from(uniqueDates).sort();
    let streak = 0;
    let currentDate = new Date();
    for (let i = sortedDates.length - 1; i >= 0; i--) {
      const entryDate = new Date(sortedDates[i]);
      const daysDiff = Math.floor((currentDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
      if (daysDiff === streak) {
        streak++;
        currentDate = entryDate;
      } else {
        break;
      }
    }

    // Calculate daily stats
    const dailyStats = Array.from(uniqueDates).map(date => {
      const dayEntries = foodEntries.filter(entry => entry.date === date);
      const totalCalories = dayEntries.reduce((sum, entry) => sum + Number(entry.calories), 0);
      const totalProtein = dayEntries.reduce((sum, entry) => sum + Number(entry.protein), 0);
      return { date, totalCalories, totalProtein };
    });

    const goalAchievements = dailyStats.filter(day => 
      Math.abs(day.totalCalories - (userProfile.daily_calorie_goal || 2000)) <= 100
    ).length;

    const maxDailyProtein = Math.max(...dailyStats.map(day => day.totalProtein), 0);

    const userData = {
      totalEntries,
      trackingDays,
      streak,
      goalAchievements,
      maxDailyProtein,
    };

    // Check for new achievements
    for (const achievement of achievements) {
      if (!achievement.unlocked && achievement.condition(userData)) {
        await unlockAchievement(achievement);
      }
    }
  };

  const unlockAchievement = async (achievement: Achievement) => {
    if (!userProfile || !isSupabaseConnected) return;

    try {
      const { error } = await supabase
        .from('user_achievements')
        .insert({
          user_id: userProfile.id,
          achievement_id: achievement.id,
          unlocked_at: new Date().toISOString(),
        });

      if (error) throw error;

      // Update local state
      setAchievements(prev => prev.map(a => 
        a.id === achievement.id 
          ? { ...a, unlocked: true, unlockedAt: new Date().toISOString() }
          : a
      ));

      // Show celebration
      setNewAchievement(achievement);
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
        setNewAchievement(null);
      }, 5000);

    } catch (error) {
      console.error('Error unlocking achievement:', error);
    }
  };

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <>
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
        />
      )}

      <AnimatePresence>
        {newAchievement && (
          <motion.div
            initial={{ opacity: 0, scale: 0, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0, y: -50 }}
            className="fixed top-4 right-4 z-50 bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl p-6 border border-neutral-200 dark:border-neutral-700 max-w-sm"
          >
            <div className="text-center">
              <div className={`p-4 bg-gradient-to-br ${newAchievement.gradient} rounded-2xl shadow-lg mb-4 mx-auto w-fit`}>
                <newAchievement.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">
                Achievement Unlocked!
              </h3>
              <h4 className="font-semibold text-neutral-800 dark:text-neutral-200">
                {newAchievement.title}
              </h4>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {newAchievement.description}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="glass-effect rounded-3xl shadow-xl p-6 border border-white/20 dark:border-neutral-700/30">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl shadow-lg">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white">Achievements</h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {unlockedCount} of {achievements.length} unlocked
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-amber-600">{unlockedCount}</p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">earned</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {achievements.map((achievement) => {
            const IconComponent = achievement.icon;
            return (
              <motion.div
                key={achievement.id}
                className={`relative p-4 rounded-2xl border-2 transition-all duration-300 ${
                  achievement.unlocked
                    ? `bg-gradient-to-br ${achievement.gradient} border-transparent shadow-lg`
                    : 'bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600 opacity-60'
                }`}
                whileHover={{ scale: achievement.unlocked ? 1.05 : 1 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: achievements.indexOf(achievement) * 0.1 }}
              >
                {achievement.unlocked && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Star className="h-3 w-3 text-white" />
                  </div>
                )}
                
                <div className="text-center">
                  <div className={`p-3 rounded-xl mb-3 mx-auto w-fit ${
                    achievement.unlocked 
                      ? 'bg-white/20 backdrop-blur-sm' 
                      : 'bg-neutral-200 dark:bg-neutral-700'
                  }`}>
                    <IconComponent className={`h-6 w-6 ${
                      achievement.unlocked ? 'text-white' : 'text-neutral-500'
                    }`} />
                  </div>
                  <h4 className={`font-semibold text-sm mb-1 ${
                    achievement.unlocked 
                      ? 'text-white' 
                      : 'text-neutral-700 dark:text-neutral-300'
                  }`}>
                    {achievement.title}
                  </h4>
                  <p className={`text-xs ${
                    achievement.unlocked 
                      ? 'text-white/80' 
                      : 'text-neutral-500 dark:text-neutral-400'
                  }`}>
                    {achievement.description}
                  </p>
                  {achievement.unlocked && achievement.unlockedAt && (
                    <p className="text-xs text-white/60 mt-2">
                      {new Date(achievement.unlockedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </>
  );
}