import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { NutritionSummary } from '../types';
import { Utensils, Sparkles } from 'lucide-react';

const CALORIES_PER_GRAM_PROTEIN = 4;
const CALORIES_PER_GRAM_CARBS = 4;
const CALORIES_PER_GRAM_FAT = 9;

interface NutritionChartProps {
  nutritionSummary: NutritionSummary;
}

export default function NutritionChart({ nutritionSummary }: NutritionChartProps) {
  const data = [
    {
      name: 'Protein',
      value: Math.round(Number(nutritionSummary.total_protein) * CALORIES_PER_GRAM_PROTEIN),
      grams: Math.round(Number(nutritionSummary.total_protein)),
      color: '#3B82F6',
      gradient: 'from-blue-400 to-blue-600',
    },
    {
      name: 'Carbs',
      value: Math.round(Number(nutritionSummary.total_carbs) * CALORIES_PER_GRAM_CARBS),
      grams: Math.round(Number(nutritionSummary.total_carbs)),
      color: '#F97316',
      gradient: 'from-orange-400 to-orange-600',
    },
    {
      name: 'Fat',
      value: Math.round(Number(nutritionSummary.total_fat) * CALORIES_PER_GRAM_FAT),
      grams: Math.round(Number(nutritionSummary.total_fat)),
      color: '#8B5CF6',
      gradient: 'from-purple-400 to-purple-600',
    },
  ];

  const totalCalories = Math.round(Number(nutritionSummary.total_calories));

  interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{ payload: typeof data[0] }>;
  }

  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-effect border border-white/20 dark:border-neutral-700/30 rounded-2xl p-4 shadow-xl backdrop-blur-xl">
          <div className="flex items-center space-x-2 mb-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: data.color }}
            ></div>
            <p className="font-semibold text-neutral-900 dark:text-white">{data.name}</p>
          </div>
          <p className="text-sm text-neutral-600 dark:text-neutral-300">
            {data.grams}g ({data.value} calories)
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {totalCalories > 0 ? ((data.value / totalCalories) * 100).toFixed(1) : 0}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  interface CustomLegendProps {
    payload?: Array<{ color: string; value: string; payload: { grams: number } }>;
  }

  const CustomLegend = ({ payload }: CustomLegendProps) => {
    return (
      <div className="flex justify-center space-x-6 mt-6">
        {payload?.map((entry: { color: string; value: string; payload: { grams: number } }, index: number) => (
          <div key={index} className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded-full shadow-sm"
              style={{ backgroundColor: entry.color }}
            ></div>
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              {entry.value} ({entry.payload.grams}g)
            </span>
          </div>
        ))}
      </div>
    );
  };

  if (totalCalories === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-neutral-500 dark:text-neutral-400">
        <div className="relative mb-6">
          <div className="w-32 h-32 bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 rounded-full flex items-center justify-center shadow-lg">
            <Utensils className="h-16 w-16 text-orange-400" />
          </div>
          <div className="absolute -top-2 -right-2">
            <Sparkles className="h-8 w-8 text-yellow-400 animate-pulse" />
          </div>
        </div>
        <h3 className="text-3xl font-bold mb-4 text-gradient-orange">No food entries for today</h3>
        <p className="text-center max-w-md text-lg font-medium">
          Start logging your meals to see your personalized nutrition breakdown and track your macros!
        </p>
        <div className="mt-8 flex space-x-3">
          <div className="w-4 h-4 bg-blue-400 rounded-full animate-bounce"></div>
          <div className="w-4 h-4 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-4 h-4 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <defs>
              <linearGradient id="proteinGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#60A5FA" />
                <stop offset="100%" stopColor="#3B82F6" />
              </linearGradient>
              <linearGradient id="carbsGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FB923C" />
                <stop offset="100%" stopColor="#F97316" />
              </linearGradient>
              <linearGradient id="fatGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#A78BFA" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
            </defs>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={140}
              paddingAngle={3}
              dataKey="value"
              animationBegin={0}
              animationDuration={1500}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={index === 0 ? 'url(#proteinGradient)' : index === 1 ? 'url(#carbsGradient)' : 'url(#fatGradient)'}
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      {/* Center text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <p className="text-5xl font-bold text-gradient-fitness">
            {totalCalories}
          </p>
          <p className="text-lg text-neutral-500 dark:text-neutral-400 font-semibold">
            total calories
          </p>
        </div>
      </div>
    </div>
  );
}