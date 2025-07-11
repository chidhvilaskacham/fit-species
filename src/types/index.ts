export interface User {
  id: string;
  email: string;
  name: string;
  daily_calorie_goal: number;
  weight_goal: 'maintain' | 'lose' | 'gain';
  dietary_preferences: string[];
  allergies: string[];
  created_at: string;
}

export interface FoodEntry {
  id: string;
  user_id: string;
  food_name: string;
  quantity: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
  notes?: string;
  date: string;
  created_at: string;
}

export interface WeightEntry {
  id: string;
  user_id: string;
  weight: number;
  date: string;
  created_at: string;
}

export interface CustomFood {
  id: string;
  user_id: string;
  name: string;
  calories_per_100g: number;
  carbs_per_100g: number;
  protein_per_100g: number;
  fat_per_100g: number;
  created_at: string;
}

export interface HydrationEntry {
  id: string;
  user_id: string;
  amount_ml: number;
  date: string;
  created_at: string;
}

export interface Goal {
  id: string;
  user_id: string;
  type: 'calorie' | 'protein' | 'carbs' | 'fat' | 'weight' | 'water';
  target_value: number;
  current_value: number;
  target_date: string;
  title: string;
  description?: string;
  created_at: string;
}

export interface NutritionSummary {
  total_calories: number;
  total_carbs: number;
  total_protein: number;
  total_fat: number;
  goal_calories: number;
  remaining_calories: number;
}

export interface NutritionData {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  goal: number;
}