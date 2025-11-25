-- Fix RLS for users table - Run this in Supabase SQL Editor
-- This allows the service_role key to access users table

-- Option 1: Disable RLS temporarily (for testing)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Option 2: Create permissive policy for service_role (recommended)
-- First, re-enable RLS if you disabled it:
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Then create a policy that allows service_role to access:
-- Note: Service role bypasses RLS by default, but if you have policies, ensure they allow access
CREATE POLICY IF NOT EXISTS "Allow service role full access" ON users
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Verify RLS status
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'users';

