/*
  # Create food tracking tables

  1. New Tables
    - `food_entries`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `food_name` (text)
      - `quantity` (text)
      - `calories` (numeric)
      - `protein` (numeric)
      - `carbs` (numeric)
      - `fat` (numeric)
      - `meal_type` (text)
      - `notes` (text, optional)
      - `date` (date)
      - `created_at` (timestamp)
    
    - `weight_entries`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `weight` (numeric)
      - `date` (date)
      - `created_at` (timestamp)
    
    - `custom_foods`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `name` (text)
      - `calories_per_100g` (numeric)
      - `protein_per_100g` (numeric)
      - `carbs_per_100g` (numeric)
      - `fat_per_100g` (numeric)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create food_entries table
CREATE TABLE IF NOT EXISTS food_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  food_name text NOT NULL,
  quantity text NOT NULL,
  calories numeric NOT NULL DEFAULT 0,
  protein numeric NOT NULL DEFAULT 0,
  carbs numeric NOT NULL DEFAULT 0,
  fat numeric NOT NULL DEFAULT 0,
  meal_type text NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snacks')),
  notes text,
  date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

-- Create weight_entries table
CREATE TABLE IF NOT EXISTS weight_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  weight numeric NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

-- Create custom_foods table
CREATE TABLE IF NOT EXISTS custom_foods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  calories_per_100g numeric NOT NULL DEFAULT 0,
  protein_per_100g numeric NOT NULL DEFAULT 0,
  carbs_per_100g numeric NOT NULL DEFAULT 0,
  fat_per_100g numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE food_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE weight_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_foods ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for food_entries
CREATE POLICY "Users can view their own food entries"
  ON food_entries
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own food entries"
  ON food_entries
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own food entries"
  ON food_entries
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own food entries"
  ON food_entries
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create RLS policies for weight_entries
CREATE POLICY "Users can view their own weight entries"
  ON weight_entries
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own weight entries"
  ON weight_entries
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own weight entries"
  ON weight_entries
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own weight entries"
  ON weight_entries
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create RLS policies for custom_foods
CREATE POLICY "Users can view their own custom foods"
  ON custom_foods
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own custom foods"
  ON custom_foods
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own custom foods"
  ON custom_foods
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own custom foods"
  ON custom_foods
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_food_entries_user_date ON food_entries(user_id, date);
CREATE INDEX IF NOT EXISTS idx_food_entries_meal_type ON food_entries(meal_type);
CREATE INDEX IF NOT EXISTS idx_weight_entries_user_date ON weight_entries(user_id, date);
CREATE INDEX IF NOT EXISTS idx_custom_foods_user ON custom_foods(user_id);