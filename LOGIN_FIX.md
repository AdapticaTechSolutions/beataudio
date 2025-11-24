# Fixing Login Error: "The string did not match the expected pattern"

## Quick Fix Steps

### Step 1: Check if Users Exist

Visit this URL to see what users are in your database:
```
https://beataudio.vercel.app/api/auth/test-login
```

This will show:
- How many users exist
- If admin user exists
- User data structure
- Any errors

### Step 2: Create Users (If None Exist)

**Option A: Use Seed Endpoint**
```
POST https://beataudio.vercel.app/api/users/seed
```

**Option B: Use Supabase SQL Editor**
```sql
INSERT INTO users (username, email, password_hash, role)
VALUES 
  ('admin', 'admin@beataudio.ph', 'password', 'admin'),
  ('staff', 'staff@beataudio.ph', 'password', 'staff');
```

### Step 3: Verify Users Table Structure

Run this in Supabase SQL Editor:
```sql
-- Check table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;

-- Check existing users
SELECT id, username, email, role, created_at FROM users;
```

### Step 4: Check for UUID Issues

The error might be caused by invalid UUID format. Verify:

```sql
-- Check if IDs are valid UUIDs
SELECT 
  id, 
  username,
  CASE 
    WHEN id::text ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' 
    THEN 'Valid UUID' 
    ELSE 'Invalid UUID' 
  END as uuid_status
FROM users;
```

## Common Causes & Solutions

### Cause 1: Users Table is Empty
**Solution:** Create users using seed endpoint or SQL above

### Cause 2: Invalid UUID Format
**Solution:** Ensure users table uses UUID type:
```sql
-- Verify ID column is UUID
ALTER TABLE users 
ALTER COLUMN id TYPE UUID USING id::uuid;
```

### Cause 3: RLS Policy Blocking Reads
**Solution:** Check RLS policies:
```sql
-- Temporarily disable RLS for testing
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Or create permissive policy
CREATE POLICY "Allow all reads" ON users
  FOR SELECT USING (true);
```

### Cause 4: Email Format Validation
**Solution:** Ensure emails are valid format:
```sql
-- Check email format
SELECT username, email FROM users 
WHERE email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
```

## Debug Endpoints

### Test Login Endpoint
```
GET /api/auth/test-login
```
Shows user data and structure

### Seed Users
```
POST /api/users/seed
```
Creates default admin/staff users

## Verify Fix

After creating users:

1. **Check users exist:**
   ```sql
   SELECT * FROM users;
   ```

2. **Test login endpoint:**
   ```bash
   curl -X POST https://beataudio.vercel.app/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"password"}'
   ```

3. **Try logging in** on the website

## Still Getting Error?

1. **Check browser console** - Look for detailed error messages
2. **Check Vercel logs** - Dashboard → Functions → `/api/auth/login` → Logs
3. **Check Supabase logs** - Dashboard → Logs → API Logs
4. **Share error details:**
   - Full error message from browser console
   - Response from `/api/auth/test-login`
   - Vercel function logs

