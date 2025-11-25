# Troubleshooting: "Failed to save booking" Error

## Quick Debug Steps

### 1. Check Browser Console
Open browser DevTools (F12) → Console tab and look for error messages when submitting a booking.

### 2. Test Debug Endpoint
Visit: `https://beataudio.vercel.app/api/debug-booking`

This will test:
- Environment variables
- Database connection
- Insert operation
- Row Level Security policies

### 3. Check Vercel Function Logs
1. Go to Vercel Dashboard → Your Project → Functions
2. Click on `/api/bookings` function
3. Check "Logs" tab for errors

## Common Issues & Solutions

### Issue 1: Row Level Security (RLS) Policy Error

**Error:** `new row violates row-level security policy` or code `42501`

**Solution:**
1. Go to Supabase Dashboard → Authentication → Policies
2. Find the `bookings` table
3. Create a new policy:
   - **Policy name:** "Allow public inserts"
   - **Allowed operation:** INSERT
   - **Target roles:** `public`
   - **USING expression:** `true`
   - **WITH CHECK expression:** `true`

Or temporarily disable RLS for testing:
```sql
ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;
```

### Issue 2: Environment Variables Not Set

**Error:** `Supabase not configured` or `Supabase credentials not found`

**Solution:**
1. Go to Vercel Dashboard → Settings → Environment Variables
2. Add these variables:
   - `SUPABASE_URL` = Your Supabase project URL
   - `SUPABASE_SERVICE_ROLE_KEY` = Your service_role key (recommended)
   - OR `VITE_SUPABASE_ANON_KEY` = Your anon key (if not using service_role)

**Important:** After adding env vars, **redeploy** your project!

### Issue 3: Missing Required Fields

**Error:** `null value in column "X" violates not-null constraint`

**Solution:**
Check your database schema. Required fields in bookings table:
- `customer_name` (or `full_name`)
- `email`
- `event_date`
- `event_type`
- `venue` (or `venue_address`)

Make sure your booking form fills all required fields.

### Issue 4: Data Type Mismatch

**Error:** `invalid input syntax for type X`

**Solution:**
Check data types match:
- `event_date` should be DATE format: `YYYY-MM-DD`
- `guest_count` should be INTEGER
- `services` should be TEXT[] (array)
- `total_amount` should be DECIMAL

### Issue 5: API Route Not Found

**Error:** `404 Not Found` or `Failed to fetch`

**Solution:**
1. Check that API routes are in `/api` directory
2. Verify file names match: `index.ts`, `[id].ts`
3. Check Vercel build logs for compilation errors
4. Ensure `@vercel/node` is installed: `npm install @vercel/node`

## Step-by-Step Debugging

### Step 1: Verify Environment Variables

Run this in browser console:
```javascript
fetch('/api/debug-booking')
  .then(r => r.json())
  .then(d => console.log(d));
```

Check if `hasUrl` and `hasKey` are `true`.

### Step 2: Test Database Connection

Visit: `/api/test-supabase`

All tests should pass. If not, check the error messages.

### Step 3: Check RLS Policies

In Supabase Dashboard:
1. Go to Authentication → Policies
2. Check `bookings` table policies
3. Ensure INSERT policy allows `public` role

### Step 4: Test Manual Insert

In Supabase Dashboard → SQL Editor, try:
```sql
INSERT INTO bookings (
  id, customer_name, email, event_date, event_type, venue, guest_count, services, status
) VALUES (
  'TEST-123', 'Test User', 'test@example.com', '2025-12-25', 'Wedding', 'Test Venue', 100, ARRAY['Lights'], 'Inquiry'
);
```

If this fails, the issue is with RLS or table schema.

### Step 5: Check Browser Network Tab

1. Open DevTools → Network tab
2. Submit booking form
3. Find the POST request to `/api/bookings`
4. Check:
   - Request payload (is data correct?)
   - Response status (200, 400, 500?)
   - Response body (error message?)

## Quick Fixes

### Fix 1: Disable RLS Temporarily
```sql
ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
```

### Fix 2: Create Permissive Policies
```sql
-- Allow all operations for bookings
CREATE POLICY "Allow all operations" ON bookings
  FOR ALL USING (true) WITH CHECK (true);

-- Allow all operations for users (admin only)
CREATE POLICY "Allow all operations" ON users
  FOR ALL USING (true) WITH CHECK (true);
```

### Fix 3: Verify Table Schema
```sql
-- Check bookings table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'bookings';
```

## Still Not Working?

1. **Check Vercel Logs:**
   - Dashboard → Functions → `/api/bookings` → Logs
   - Look for error stack traces

2. **Check Supabase Logs:**
   - Dashboard → Logs → API Logs
   - Look for failed requests

3. **Test Locally:**
   ```bash
   npm run dev
   # Then test at http://localhost:5173
   ```

4. **Share Error Details:**
   - Browser console errors
   - Network tab response
   - Vercel function logs
   - Supabase error messages

## Prevention

After fixing, set up proper RLS policies:

```sql
-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert
CREATE POLICY "Authenticated users can insert" ON bookings
  FOR INSERT WITH CHECK (true);

-- Allow authenticated users to read
CREATE POLICY "Authenticated users can read" ON bookings
  FOR SELECT USING (true);
```

Or use service_role key in API routes (bypasses RLS).

