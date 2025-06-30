import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { NutritionSummary } from '../types';

interface NutritionChartProps {
  nutritionSummary: NutritionSummary;
}

export default function NutritionChart({ nutritionSummary }: NutritionChartProps) {
  const data = [
    {
      name: 'Protein',
      value: Math.round(Number(nutritionSummary.total_protein) * 4), // 4 calories per gram
      grams: Math.round(Number(nutritionSummary.total_protein)),
      color: '#3B82F6',
    },
    {
      name: 'Carbs',
      value: Math.round(Number(nutritionSummary.total_carbs) * 4), // 4 calories per gram
      grams: Math.round(Number(nutritionSummary.total_carbs)),
      color: '#F97316',
    },
    {
      name: 'Fat',
      value: Math.round(Number(nutritionSummary.total_fat) * 9), // 9 calories per gram
      grams: Math.round(Number(nutritionSummary.total_fat)),
      color: '#8B5CF6',
    },
  ];

  const totalCalories = Math.round(Number(nutritionSummary.total_calories));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-xl">
          <p className="font-semibold text-gray-900 dark:text-white">{data.name}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {data.grams}g ({data.value} calories)
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {totalCalories > 0 ? ((data.value / totalCalories) * 100).toFixed(1) : 0}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  if (totalCalories === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        <div className="text-6xl mb-4">🍽️</div>
        <p className="text-lg font-medium">No food entries for today</p>
        <p className="text-sm">Start logging your meals to see your nutrition breakdown!</p>
      </div>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value, entry: any) => (
              <span className="text-gray-700 dark:text-gray-300">
                {value} ({entry.payload.grams}g)
              </span>
            )}
            wrapperStyle={{ fontSize: '14px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}