# Quick Fix for Login Error

## The Problem
Getting "The string did not match the expected pattern" error when trying to login.

## Immediate Fix (2 steps)

### Step 1: Disable RLS on Users Table

Go to **Supabase Dashboard → SQL Editor** and run:

```sql
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
```

This allows the API to read from the users table.

### Step 2: Deploy the Code Changes

The code has been fixed. Push to deploy:

```bash
git push
```

Wait for Vercel to deploy (usually 1-2 minutes).

## Test Login

After deploying:
- Username: `admin`
- Password: `password`

## Why This Works

1. **RLS was blocking access** - Even with SERVICE_ROLE_KEY, if RLS is enabled and has restrictive policies, it can cause issues
2. **UUID validation** - The code now avoids strict UUID validation that was causing pattern errors
3. **Better error handling** - The code now provides clearer error messages

## After It Works

Once login works, you can optionally re-enable RLS with a permissive policy:

```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service role access" ON users
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

But for now, disabling RLS is the quickest fix.

