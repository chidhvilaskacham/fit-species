import React, { useState, useEffect } from 'react';
import { Droplets, Plus, Minus, Target, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { supabase, isSupabaseConnected } from '../lib/supabase';
import toast from 'react-hot-toast';

interface WaterEntry {
  id: string;
  user_id: string;
  amount: number;
  date: string;
  created_at: string;
}

export default function WaterTracker() {
  const { userProfile } = useAuth();
  const [waterIntake, setWaterIntake] = useState(0);
  const [dailyGoal] = useState(2000); // 2L default goal
  const [loading, setLoading] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if (userProfile && isSupabaseConnected) {
      fetchTodayWaterIntake();
    }
  }, [userProfile]);

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

  const addWater = async (amount: number) => {
    if (!userProfile || !isSupabaseConnected) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('water_entries')
        .insert({
          user_id: userProfile.id,
          amount,
          date: new Date().toISOString().split('T')[0],
        });

      if (error) throw error;

      const newTotal = waterIntake + amount;
      setWaterIntake(newTotal);
      
      if (newTotal >= dailyGoal && waterIntake < dailyGoal) {
        setShowCelebration(true);
        toast.success('🎉 Daily water goal achieved!');
        setTimeout(() => setShowCelebration(false), 3000);
      } else {
        toast.success(`Added ${amount}ml water!`);
      }
    } catch (error) {
      toast.error('Failed to log water intake');
    }
    setLoading(false);
  };

  const progress = Math.min((waterIntake / dailyGoal) * 100, 100);
  const glassesCount = Math.floor(waterIntake / 250); // 250ml per glass

  return (
    <div className="glass-effect rounded-3xl shadow-xl p-6 border border-white/20 dark:border-neutral-700/30 card-hover relative overflow-hidden">
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-sm z-10 rounded-3xl"
          >
            <div className="text-center">
              <Award className="h-16 w-16 text-yellow-400 mx-auto mb-2 animate-bounce" />
              <p className="text-2xl font-bold text-white">Goal Achieved!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-3xl shadow-lg">
            <Droplets className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white">Water Intake</h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {waterIntake}ml of {dailyGoal}ml goal
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-cyan-600">{glassesCount}</p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">glasses</p>
        </div>
      </div>

      {/* Water Progress Visualization */}
      <div className="mb-6">
        <div className="relative h-32 bg-gradient-to-t from-cyan-100 to-cyan-50 dark:from-cyan-900/20 dark:to-cyan-800/10 rounded-2xl overflow-hidden border-2 border-cyan-200 dark:border-cyan-700">
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-cyan-400 to-cyan-300 rounded-2xl"
            initial={{ height: 0 }}
            animate={{ height: `${progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-cyan-700 dark:text-cyan-300 drop-shadow-lg">
              {Math.round(progress)}%
            </span>
          </div>
          
          {/* Water droplets animation */}
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-cyan-400 rounded-full opacity-60"
              style={{
                left: `${20 + i * 15}%`,
                top: `${10 + (i % 2) * 20}%`,
              }}
              animate={{
                y: [0, -10, 0],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.4,
              }}
            />
          ))}
        </div>
      </div>

      {/* Quick Add Buttons */}
      <div className="grid grid-cols-4 gap-3">
        {[250, 500, 750, 1000].map((amount) => (
          <motion.button
            key={amount}
            onClick={() => addWater(amount)}
            disabled={loading}
            className="flex flex-col items-center p-3 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-xl border border-cyan-200 dark:border-cyan-700 hover:shadow-lg transition-all duration-200 disabled:opacity-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="h-4 w-4 text-cyan-600 mb-1" />
            <span className="text-xs font-medium text-cyan-700 dark:text-cyan-300">
              {amount}ml
            </span>
          </motion.button>
        ))}
      </div>

      {/* Achievement Indicator */}
      {waterIntake >= dailyGoal && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl border border-yellow-200 dark:border-yellow-700"
        >
          <div className="flex items-center space-x-2">
            <Award className="h-5 w-5 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
              Daily goal achieved! 🎉
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}