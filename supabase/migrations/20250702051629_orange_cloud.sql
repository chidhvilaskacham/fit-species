/*
  # Create water_entries table

  1. New Tables
    - `water_entries`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `amount` (numeric, amount of water in ml)
      - `date` (date, date of entry)
      - `created_at` (timestamp with timezone, default now)

  2. Security
    - Enable RLS on `water_entries` table
    - Add policies for authenticated users to manage their own water entries
*/

CREATE TABLE IF NOT EXISTS water_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE water_entries ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for water_entries
CREATE POLICY "Users can view their own water entries"
  ON water_entries
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own water entries"
  ON water_entries
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own water entries"
  ON water_entries
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own water entries"
  ON water_entries
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_water_entries_user_date ON water_entries(user_id, date);