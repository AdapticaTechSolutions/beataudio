# Debugging "Still Error" - Step by Step Guide

## Step 1: Check What Error You're Seeing

**Where is the error appearing?**

### Option A: In Browser/Client
- What's the exact error message?
- Is it a network error (500, 502, etc.)?
- What endpoint are you calling?

### Option B: In Vercel Logs
1. Go to **Vercel Dashboard** → Your Project
2. Click **Functions** tab
3. Find the function that's failing (e.g., `/api/bookings`, `/api/auth/login`)
4. Click on it → **Logs** tab
5. **Copy the entire error message**

## Step 2: Run Environment Variable Check

I've created a diagnostic endpoint. Test it:

```
https://your-app.vercel.app/api/env-check
```

This will show you:
- ✅ Which environment variables are set
- ❌ Which ones are missing
- ⚠️ Any configuration issues
- 🔍 What values the code will actually use

**What to look for:**
- `setupCorrect: false` → There's a configuration issue
- `issues` array → Lists specific problems
- `effectiveKey.warning` → Shows if using fallback (bad!)

## Step 3: Check Vercel Logs for Detailed Errors

1. **Make a request** to your failing endpoint
2. **Immediately check** Vercel Dashboard → Functions → Logs
3. Look for these log messages:

### Look for "Supabase initialization:"
```
Supabase initialization: {
  hasUrl: true/false,
  hasServiceRoleKey: true/false,
  serviceRoleKeyPrefix: "eyJ..." or "sb_publishable_..." or "none"
}
```

**What it means:**
- `hasUrl: false` → `SUPABASE_URL` or `VITE_SUPABASE_URL` not found
- `hasServiceRoleKey: false` → `SUPABASE_SERVICE_ROLE_KEY` not found
- `serviceRoleKeyPrefix: "sb_publishable_"` → ❌ Using anon key instead of service_role key!

### Look for Error Messages:
- `"Supabase credentials not found"` → Environment variables missing
- `"permission denied"` or `"row-level security"` → Using anon key instead of service_role key
- `"FUNCTION_INVOCATION_FAILED"` → Module-level error (should be fixed, but check)

## Step 4: Verify Environment Variables in Vercel

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**

2. **Check these exist:**
   - [ ] `SUPABASE_URL` (without VITE_ prefix)
   - [ ] `SUPABASE_SERVICE_ROLE_KEY` (without VITE_ prefix)

3. **Verify the values:**
   - `SUPABASE_URL` should start with `https://` and end with `.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY` should:
     - ✅ Start with `eyJ` (JWT format)
     - ✅ Be very long (hundreds of characters)
     - ❌ NOT start with `sb_publishable_` (that's anon key!)

4. **Check environment scope:**
   - Make sure variables are set for **Production** (and Preview if needed)
   - Variables set only for "Development" won't work in deployed functions

## Step 5: Common Issues & Fixes

### Issue 1: "Supabase credentials not found"

**Symptoms:**
- Error message says credentials not found
- `hasUrl: false` or `hasServiceRoleKey: false` in logs

**Fix:**
1. Add missing variables in Vercel Dashboard
2. **Redeploy** (critical!)
3. Test again

### Issue 2: "Permission denied" or RLS errors

**Symptoms:**
- Error mentions "row-level security" or "permission denied"
- `serviceRoleKeyPrefix: "sb_publishable_"` in logs

**Fix:**
1. Go to Supabase Dashboard → Settings → API
2. Copy the **service_role** key (starts with `eyJ`, not `sb_publishable_`)
3. Update `SUPABASE_SERVICE_ROLE_KEY` in Vercel
4. **Redeploy**

### Issue 3: Variables exist but still erroring

**Possible causes:**
- Variables added but not redeployed
- Variables set for wrong environment (e.g., only Development)
- Typo in variable name
- Wrong value copied

**Fix:**
1. Double-check variable names (exact spelling)
2. Verify values are correct (full keys, no extra spaces)
3. **Redeploy** after any changes
4. Check `/api/env-check` to see what's actually loaded

### Issue 4: FUNCTION_INVOCATION_FAILED

**Symptoms:**
- Function crashes before handling request
- Error in Vercel shows FUNCTION_INVOCATION_FAILED

**Possible causes:**
- Module-level error (should be fixed, but check)
- Import error
- Syntax error

**Fix:**
1. Check Vercel build logs for errors
2. Test locally: `npm run build`
3. Check for syntax errors in code

## Step 6: Test with Debug Endpoints

### Test 1: Environment Check
```
https://your-app.vercel.app/api/env-check
```
Shows environment variable status

### Test 2: Supabase Connection
```
https://your-app.vercel.app/api/debug?type=supabase
```
Tests if Supabase connection works

### Test 3: Full Diagnostic
```
https://your-app.vercel.app/api/debug?type=full
```
Runs all tests

## Step 7: Share Diagnostic Info

If still stuck, share:

1. **Output from `/api/env-check`:**
   ```bash
   curl https://your-app.vercel.app/api/env-check
   ```

2. **Error from Vercel Logs:**
   - Copy the full error message
   - Include the "Supabase initialization" log if present

3. **Environment Variable Status:**
   - Which variables are set in Vercel
   - What `serviceRoleKeyPrefix` shows in logs

## Quick Checklist

- [ ] Ran `/api/env-check` endpoint
- [ ] Checked Vercel logs for exact error
- [ ] Verified `SUPABASE_URL` exists in Vercel
- [ ] Verified `SUPABASE_SERVICE_ROLE_KEY` exists in Vercel
- [ ] Confirmed service_role key starts with `eyJ` (not `sb_publishable_`)
- [ ] Variables set for Production environment
- [ ] Redeployed after adding/changing variables
- [ ] Checked for typos in variable names

## Still Not Working?

1. **Test locally first:**
   - Create `.env.local` with same variables
   - Run `npm run dev`
   - Test if it works locally
   - If local works but Vercel doesn't → Environment variable setup issue

2. **Check Supabase Dashboard:**
   - Verify project URL is correct
   - Verify service_role key is correct
   - Check if RLS is enabled (may need to disable for testing)

3. **Check Vercel Build Logs:**
   - Go to Deployments → Latest deployment → Build Logs
   - Look for any build errors

4. **Share the diagnostic output:**
   - Run `/api/env-check`
   - Copy the JSON output
   - Share it for analysis

