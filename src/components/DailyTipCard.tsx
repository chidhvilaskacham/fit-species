import React, { useState, useEffect } from 'react';
import { Lightbulb, Heart, RefreshCw, Sparkles } from 'lucide-react';
import { getDailyTip, getDailyQuote } from '../data/tips';

export default function DailyTipCard() {
  const [currentTip, setCurrentTip] = useState('');
  const [currentQuote, setCurrentQuote] = useState('');
  const [showTip, setShowTip] = useState(true);

  useEffect(() => {
    setCurrentTip(getDailyTip());
    setCurrentQuote(getDailyQuote());
  }, []);

  const toggleContent = () => {
    setShowTip(!showTip);
  };

  return (
    <div className="bg-gradient-to-br from-orange-50/90 to-yellow-50/90 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-3xl p-6 border border-orange-200/50 dark:border-orange-800/50 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-200/20 to-yellow-200/20 rounded-full blur-xl"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-2xl shadow-lg">
              {showTip ? (
                <Lightbulb className="h-6 w-6 text-white" />
              ) : (
                <Heart className="h-6 w-6 text-white" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {showTip ? 'Daily Nutrition Tip' : 'Daily Motivation'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {showTip ? 'Expert advice for better health' : 'Inspiration for your journey'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-yellow-500 animate-pulse" />
            <button
              onClick={toggleContent}
              className="p-2 text-orange-600 hover:text-orange-700 transition-colors rounded-lg hover:bg-orange-100/50 dark:hover:bg-orange-900/20"
              aria-label={showTip ? 'Show motivation' : 'Show tip'}
            >
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="min-h-[80px] flex items-center">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium italic">
            "{showTip ? currentTip : currentQuote}"
          </p>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              Updated daily
            </span>
          </div>
          
          <button
            onClick={toggleContent}
            className="text-sm text-orange-600 hover:text-orange-700 font-medium transition-colors"
          >
            {showTip ? 'Show Motivation →' : 'Show Tip →'}
          </button>
        </div>
      </div>
    </div>
  );
}