-- Check RLS status on users table
-- Run this in Supabase SQL Editor to see if RLS is enabled

SELECT 
  schemaname,
  tablename,
  rowsecurity as "RLS Enabled"
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'users';

-- Check existing RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'users';

-- If RLS is enabled and blocking, disable it:
-- ALTER TABLE users DISABLE ROW LEVEL SECURITY;

