# Fix Row Level Security (RLS) Issue

## Problem
RLS policies are blocking user creation. Error: `new row violates row-level security policy`

## Quick Fix: Create Users via SQL (Easiest)

Go to **Supabase Dashboard → SQL Editor** and run:

```sql
-- Create admin users (bypasses RLS)
INSERT INTO users (username, email, password_hash, role)
VALUES 
  ('admin', 'admin@beataudio.ph', 'password', 'admin'),
  ('staff', 'staff@beataudio.ph', 'password', 'staff');
```

This works because SQL Editor uses service role which bypasses RLS.

## Solution 1: Use SERVICE_ROLE_KEY (Recommended)

1. **Get your SERVICE_ROLE_KEY:**
   - Go to Supabase Dashboard → Settings → API
   - Copy the `service_role` key (keep it secret!)

2. **Add to Vercel:**
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Add: `SUPABASE_SERVICE_ROLE_KEY` = (your service_role key)
   - **Redeploy** your project

3. **Try seed endpoint again:**
   ```bash
   curl -X POST https://beataudio.vercel.app/api/users/seed
   ```

## Solution 2: Disable RLS Temporarily

Run this SQL in Supabase SQL Editor:

```sql
-- Disable RLS for users table
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
```

Then try the seed endpoint again.

**⚠️ Re-enable RLS after creating users:**
```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
```

## Solution 3: Create Permissive RLS Policy

Run this SQL in Supabase SQL Editor:

```sql
-- Allow inserts for all users (for seeding)
CREATE POLICY "Allow public inserts" ON users
  FOR INSERT
  WITH CHECK (true);

-- Allow reads for all users
CREATE POLICY "Allow public reads" ON users
  FOR SELECT
  USING (true);
```

## Verify Users Created

```sql
SELECT id, username, email, role FROM users;
```

You should see:
- admin / admin@beataudio.ph / admin
- staff / staff@beataudio.ph / staff

## After Creating Users

1. **Test login:**
   - Username: `admin`
   - Password: `password`

2. **Re-enable RLS** (if you disabled it):
   ```sql
   ALTER TABLE users ENABLE ROW LEVEL SECURITY;
   ```

3. **Create proper RLS policies** for production:
   ```sql
   -- Only authenticated users can read
   CREATE POLICY "Authenticated users can read" ON users
     FOR SELECT
     USING (true);
   
   -- Only service role can insert (for admin operations)
   -- This is handled by using SERVICE_ROLE_KEY in API routes
   ```

## Recommended Setup

For production:
1. ✅ Use `SUPABASE_SERVICE_ROLE_KEY` in Vercel (server-side only)
2. ✅ Keep RLS enabled
3. ✅ Create proper policies for your use case
4. ✅ Use `VITE_SUPABASE_ANON_KEY` for client-side (respects RLS)

