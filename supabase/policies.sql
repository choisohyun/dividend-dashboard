-- Row Level Security (RLS) Policies for Dividend Dashboard
-- Run these in your Supabase SQL Editor after migrations

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE holdings ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE dividends ENABLE ROW LEVEL SECURITY;
ALTER TABLE cash_flows ENABLE ROW LEVEL SECURITY;
ALTER TABLE symbol_meta ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Holdings policies
CREATE POLICY "Users can view their own holdings"
  ON holdings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own holdings"
  ON holdings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own holdings"
  ON holdings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own holdings"
  ON holdings FOR DELETE
  USING (auth.uid() = user_id);

-- Transactions policies
CREATE POLICY "Users can view their own transactions"
  ON transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions"
  ON transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transactions"
  ON transactions FOR DELETE
  USING (auth.uid() = user_id);

-- Dividends policies
CREATE POLICY "Users can view their own dividends"
  ON dividends FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own dividends"
  ON dividends FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own dividends"
  ON dividends FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own dividends"
  ON dividends FOR DELETE
  USING (auth.uid() = user_id);

-- Cash flows policies
CREATE POLICY "Users can view their own cash flows"
  ON cash_flows FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cash flows"
  ON cash_flows FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cash flows"
  ON cash_flows FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cash flows"
  ON cash_flows FOR DELETE
  USING (auth.uid() = user_id);

-- Symbol meta policies (public read, no write from client)
CREATE POLICY "Anyone can view symbol metadata"
  ON symbol_meta FOR SELECT
  TO authenticated
  USING (true);



