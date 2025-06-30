/*
  # Create users table for nutrition app

  1. New Tables
    - `users`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique, not null)
      - `name` (text, user's full name)
      - `daily_calorie_goal` (integer, daily calorie target)
      - `weight_goal` (text, weight management goal)
      - `dietary_preferences` (text array, dietary preferences)
      - `allergies` (text array, food allergies)
      - `created_at` (timestamp with timezone, default now)

  2. Security
    - Enable RLS on `users` table
    - Add policy for users to view their own profile
    - Add policy for users to update their own profile
    - Add policy for new users to create their own profile
*/

CREATE TABLE IF NOT EXISTS public.users (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email text UNIQUE NOT NULL,
  name text,
  daily_calorie_goal integer DEFAULT 2000,
  weight_goal text DEFAULT 'maintain',
  dietary_preferences text[] DEFAULT '{}',
  allergies text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own profile"
  ON public.users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "New users can create their own profile"
  ON public.users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);