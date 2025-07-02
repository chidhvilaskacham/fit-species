export interface CommonFood {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving: string;
  category: string;
}

export const commonFoods: CommonFood[] = [
  // Protein Sources
  { name: 'Whey Protein Powder', calories: 120, protein: 25, carbs: 3, fat: 1, serving: '1 scoop (30g)', category: 'Protein Supplements' },
  { name: 'Chicken Breast (grilled)', calories: 165, protein: 31, carbs: 0, fat: 3.6, serving: '100g', category: 'Proteins' },
  { name: 'Salmon (cooked)', calories: 206, protein: 22, carbs: 0, fat: 12, serving: '100g', category: 'Proteins' },
  { name: 'Eggs (large)', calories: 70, protein: 6, carbs: 0.6, fat: 5, serving: '1 large egg', category: 'Proteins' },
  { name: 'Greek Yogurt (plain)', calories: 100, protein: 17, carbs: 6, fat: 0.4, serving: '170g container', category: 'Proteins' },
  { name: 'Tofu (firm)', calories: 144, protein: 17.3, carbs: 2.8, fat: 8.7, serving: '100g', category: 'Proteins' },
  { name: 'Soya Chunks (dry)', calories: 345, protein: 52, carbs: 33, fat: 0.5, serving: '100g', category: 'Proteins' },
  { name: 'Cottage Cheese', calories: 98, protein: 11, carbs: 3.4, fat: 4.3, serving: '100g', category: 'Proteins' },
  { name: 'Tuna (canned in water)', calories: 116, protein: 25.5, carbs: 0, fat: 0.8, serving: '100g', category: 'Proteins' },
  { name: 'Turkey Breast', calories: 135, protein: 30, carbs: 0, fat: 1, serving: '100g', category: 'Proteins' },
  
  // Nuts & Seeds
  { name: 'Almonds', calories: 579, protein: 21.2, carbs: 21.6, fat: 49.9, serving: '100g', category: 'Nuts & Seeds' },
  { name: 'Walnuts', calories: 654, protein: 15.2, carbs: 13.7, fat: 65.2, serving: '100g', category: 'Nuts & Seeds' },
  { name: 'Sunflower Seeds', calories: 584, protein: 20.8, carbs: 20, fat: 51.5, serving: '100g', category: 'Nuts & Seeds' },
  { name: 'Pumpkin Seeds', calories: 559, protein: 30.2, carbs: 10.7, fat: 49, serving: '100g', category: 'Nuts & Seeds' },
  { name: 'Chia Seeds', calories: 486, protein: 16.5, carbs: 42.1, fat: 30.7, serving: '100g', category: 'Nuts & Seeds' },
  { name: 'Flax Seeds', calories: 534, protein: 18.3, carbs: 28.9, fat: 42.2, serving: '100g', category: 'Nuts & Seeds' },
  { name: 'Cashews', calories: 553, protein: 18.2, carbs: 30.2, fat: 43.9, serving: '100g', category: 'Nuts & Seeds' },
  { name: 'Peanut Butter', calories: 588, protein: 25.1, carbs: 19.6, fat: 50.4, serving: '100g', category: 'Nuts & Seeds' },
  { name: 'Almond Butter', calories: 614, protein: 21.2, carbs: 18.8, fat: 55.5, serving: '100g', category: 'Nuts & Seeds' },
  
  // Grains & Carbs
  { name: 'Oats (rolled, dry)', calories: 389, protein: 16.9, carbs: 66.3, fat: 6.9, serving: '100g', category: 'Grains' },
  { name: 'Oatmeal (cooked)', calories: 68, protein: 2.4, carbs: 12, fat: 1.4, serving: '100g', category: 'Grains' },
  { name: 'Brown Rice (cooked)', calories: 111, protein: 2.6, carbs: 23, fat: 0.9, serving: '100g', category: 'Grains' },
  { name: 'Quinoa (cooked)', calories: 120, protein: 4.4, carbs: 22, fat: 1.9, serving: '100g', category: 'Grains' },
  { name: 'Whole Wheat Bread', calories: 247, protein: 13, carbs: 41, fat: 4.2, serving: '100g', category: 'Grains' },
  { name: 'Sweet Potato (baked)', calories: 103, protein: 2.3, carbs: 24, fat: 0.1, serving: '100g', category: 'Grains' },
  { name: 'White Rice (cooked)', calories: 130, protein: 2.7, carbs: 28, fat: 0.3, serving: '100g', category: 'Grains' },
  { name: 'Pasta (cooked)', calories: 131, protein: 5, carbs: 25, fat: 1.1, serving: '100g', category: 'Grains' },
  
  // Fruits
  { name: 'Banana (medium)', calories: 105, protein: 1.3, carbs: 27, fat: 0.3, serving: '1 medium (118g)', category: 'Fruits' },
  { name: 'Apple (medium)', calories: 95, protein: 0.5, carbs: 25, fat: 0.3, serving: '1 medium (182g)', category: 'Fruits' },
  { name: 'Orange (medium)', calories: 62, protein: 1.2, carbs: 15.4, fat: 0.2, serving: '1 medium (154g)', category: 'Fruits' },
  { name: 'Strawberries', calories: 32, protein: 0.7, carbs: 7.7, fat: 0.3, serving: '100g', category: 'Fruits' },
  { name: 'Blueberries', calories: 57, protein: 0.7, carbs: 14.5, fat: 0.3, serving: '100g', category: 'Fruits' },
  { name: 'Dates (Medjool)', calories: 277, protein: 1.8, carbs: 75, fat: 0.2, serving: '100g', category: 'Fruits' },
  { name: 'Mango', calories: 60, protein: 0.8, carbs: 15, fat: 0.4, serving: '100g', category: 'Fruits' },
  { name: 'Grapes', calories: 62, protein: 0.6, carbs: 16.8, fat: 0.2, serving: '100g', category: 'Fruits' },
  { name: 'Pineapple', calories: 50, protein: 0.5, carbs: 13.1, fat: 0.1, serving: '100g', category: 'Fruits' },
  
  // Vegetables
  { name: 'Broccoli (cooked)', calories: 35, protein: 2.4, carbs: 7, fat: 0.4, serving: '100g', category: 'Vegetables' },
  { name: 'Spinach (raw)', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, serving: '100g', category: 'Vegetables' },
  { name: 'Avocado', calories: 234, protein: 2.9, carbs: 12, fat: 21, serving: '1 medium (150g)', category: 'Vegetables' },
  { name: 'Carrots', calories: 41, protein: 0.9, carbs: 9.6, fat: 0.2, serving: '100g', category: 'Vegetables' },
  { name: 'Bell Peppers', calories: 31, protein: 1, carbs: 7, fat: 0.3, serving: '100g', category: 'Vegetables' },
  { name: 'Cucumber', calories: 16, protein: 0.7, carbs: 4, fat: 0.1, serving: '100g', category: 'Vegetables' },
  { name: 'Tomatoes', calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, serving: '100g', category: 'Vegetables' },
  
  // Dairy & Alternatives
  { name: 'Milk (whole)', calories: 61, protein: 3.2, carbs: 4.8, fat: 3.3, serving: '100ml', category: 'Dairy' },
  { name: 'Almond Milk (unsweetened)', calories: 17, protein: 0.6, carbs: 0.6, fat: 1.5, serving: '100ml', category: 'Dairy' },
  { name: 'Cheddar Cheese', calories: 403, protein: 25, carbs: 1.3, fat: 33, serving: '100g', category: 'Dairy' },
  { name: 'Mozzarella Cheese', calories: 280, protein: 22, carbs: 2.2, fat: 22, serving: '100g', category: 'Dairy' },
  
  // Healthy Fats
  { name: 'Olive Oil', calories: 884, protein: 0, carbs: 0, fat: 100, serving: '100ml', category: 'Oils' },
  { name: 'Coconut Oil', calories: 862, protein: 0, carbs: 0, fat: 100, serving: '100ml', category: 'Oils' },
  
  // Legumes
  { name: 'Lentils (cooked)', calories: 116, protein: 9, carbs: 20, fat: 0.4, serving: '100g', category: 'Legumes' },
  { name: 'Chickpeas (cooked)', calories: 164, protein: 8.9, carbs: 27.4, fat: 2.6, serving: '100g', category: 'Legumes' },
  { name: 'Black Beans (cooked)', calories: 132, protein: 8.9, carbs: 23, fat: 0.5, serving: '100g', category: 'Legumes' },
  
  // Beverages
  { name: 'Green Tea', calories: 2, protein: 0, carbs: 0, fat: 0, serving: '1 cup (240ml)', category: 'Beverages' },
  { name: 'Coffee (black)', calories: 2, protein: 0.3, carbs: 0, fat: 0, serving: '1 cup (240ml)', category: 'Beverages' },
  { name: 'Protein Shake (with water)', calories: 130, protein: 25, carbs: 5, fat: 1.5, serving: '1 serving', category: 'Beverages' },
];
