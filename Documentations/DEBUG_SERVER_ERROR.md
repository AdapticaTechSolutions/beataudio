# Debugging Server Error: FUNCTION_INVOCATION_FAILED

## Quick Debug Steps

### Step 1: Test User Lookup
Visit this URL to test if user lookup works:
```
https://beataudio.vercel.app/api/auth/test-user-lookup?username=admin
```

This will show:
- If user can be fetched
- User data structure
- Any parsing errors

### Step 2: Check Vercel Function Logs
1. Go to Vercel Dashboard → Your Project
2. Click on "Functions" tab
3. Find `/api/auth/login`
4. Click on it → Check "Logs" tab
5. Look for the error stack trace

### Step 3: Test Login with curl
```bash
curl -X POST https://beataudio.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}' \
  -v
```

The `-v` flag shows detailed response headers and errors.

## Common Causes

### Cause 1: Missing created_at Column
If your users table doesn't have `created_at`, add it:
```sql
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
```

### Cause 2: Data Type Mismatch
Check your users table structure:
```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;
```

Should match:
- `id` → UUID
- `username` → VARCHAR(50)
- `email` → VARCHAR(255)
- `password_hash` → VARCHAR(255)
- `role` → VARCHAR(20)
- `created_at` → TIMESTAMP WITH TIME ZONE
- `last_login` → TIMESTAMP WITH TIME ZONE (nullable)

### Cause 3: Missing Columns
If any columns are missing, add them:
```sql
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE;
```

## Quick Fix: Verify Table Structure

Run this SQL to ensure your table matches:
```sql
-- Check current structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;

-- If created_at is missing, add it
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- If last_login is missing, add it
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE;

-- Update existing rows to have created_at
UPDATE users 
SET created_at = NOW() 
WHERE created_at IS NULL;
```

## Test After Fix

1. **Test user lookup:**
   ```
   GET /api/auth/test-user-lookup?username=admin
   ```

2. **Test login:**
   ```
   POST /api/auth/login
   Body: {"username":"admin","password":"password"}
   ```

3. **Check browser console** for detailed errors

## Share Error Details

If still failing, share:
1. Response from `/api/auth/test-user-lookup?username=admin`
2. Vercel function logs (from Dashboard)
3. Browser console errors
4. Full error message

