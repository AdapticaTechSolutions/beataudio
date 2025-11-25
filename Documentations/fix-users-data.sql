-- Fix users table data
-- Run this in Supabase SQL Editor

-- Delete existing corrupted users
DELETE FROM users WHERE username IN ('admin', 'staff');

-- Insert correct users
INSERT INTO users (username, email, password_hash, role)
VALUES 
  ('admin', 'admin@beataudio.ph', 'password', 'admin'),
  ('staff', 'staff@beataudio.ph', 'password', 'staff');

-- Verify the fixes
SELECT id, username, email, password_hash, role, created_at 
FROM users 
ORDER BY username;

-- Note: The password_hash is plain text 'password' which works with the current login logic
-- In production, you should use bcrypt to hash passwords properly

