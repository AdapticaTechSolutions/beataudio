# Debug Steps for 500 Errors

## Step 1: Check Vercel Logs

1. Go to **Vercel Dashboard** → Your Project
2. Click **"Functions"** tab
3. Find `/api/auth/login` or `/api/bookings`
4. Click on it → **"Logs"** tab
5. Try logging in or creating a booking
6. **Copy the entire error message** from the logs

## Step 2: Look for These in Logs

### Check Supabase Initialization
Look for: `Supabase initialization:`
- `hasUrl: true/false` - Should be `true`
- `hasServiceRoleKey: true/false` - Should be `true`
- `serviceRoleKeyPrefix` - Should show first 10 chars of your key

### Check Environment Variables
Look for: `Environment check:`
- Both should be `true`

### Check Error Messages
Look for:
- `Error fetching user from database:`
- `Error creating booking:`
- Any error messages with details

## Step 3: Verify Environment Variables in Vercel

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. Verify these are set:
   - `SUPABASE_URL` - Should be your Supabase project URL
   - `SUPABASE_SERVICE_ROLE_KEY` - Should start with `sb_secret_` or `eyJ`

3. **Important:** After adding/changing env vars, you MUST redeploy:
   - Go to **Deployments** → Click "..." → **Redeploy**

## Step 4: Test Debug Endpoint

After deploying, test:
```
https://your-app.vercel.app/api/debug?type=login&username=admin
```

This will show you:
- If Supabase is configured
- If user lookup works
- The exact error if it fails

## Step 5: Share the Error

Copy and share:
1. The error message from Vercel logs
2. The `Supabase initialization:` log output
3. The `Environment check:` log output
4. Any stack traces

This will help identify the exact issue!

