# Debugging FUNCTION_INVOCATION_FAILED - Step by Step

## Current Status

✅ Environment variables are correctly configured (verified via `/api/env-check`)
❌ Still getting `FUNCTION_INVOCATION_FAILED` error

This means the issue is likely:
1. A runtime error when the function executes (not at module load)
2. An error in a specific endpoint
3. An import error or dependency issue

## Step 1: Identify Which Endpoint is Failing

**What endpoint are you calling when you see the error?**
- `/api/bookings`?
- `/api/auth/login`?
- `/api/debug`?
- Another endpoint?

## Step 2: Check Vercel Logs for the Actual Error

The `FUNCTION_INVOCATION_FAILED` error page shows an ID like:
```
ID: hkg1::72jgj-1763999370897-5cc7f30acf79
```

1. Go to **Vercel Dashboard** → Your Project
2. Click **Functions** tab
3. Find the function that's failing (e.g., `/api/bookings`)
4. Click on it → **Logs** tab
5. Look for the error with that ID
6. **Copy the entire error message and stack trace**

The logs will show the **actual error** that's causing the crash, not just "FUNCTION_INVOCATION_FAILED".

## Step 3: Test Simple Endpoint First

I've created `/api/test-simple` - a minimal endpoint with no imports.

Test it:
```
https://your-app.vercel.app/api/test-simple
```

**Expected:** Should return `{"success": true, "message": "Function loaded successfully"}`

**If this works:**
- ✅ Function loading is fine
- ❌ Issue is with imports or specific endpoint code

**If this fails:**
- ❌ There's a deeper Vercel/deployment issue

## Step 4: Test Each Endpoint Individually

Test endpoints one by one to find which one fails:

### Test 1: Simple endpoint (no imports)
```
https://your-app.vercel.app/api/test-simple
```

### Test 2: Environment check (no Supabase)
```
https://your-app.vercel.app/api/env-check
```

### Test 3: Debug endpoint (uses storage)
```
https://your-app.vercel.app/api/debug?type=supabase
```

### Test 4: Bookings endpoint
```
https://your-app.vercel.app/api/bookings
```

### Test 5: Login endpoint
```
https://your-app.vercel.app/api/auth/login
```

## Step 5: Common Causes of FUNCTION_INVOCATION_FAILED

Even with correct env vars, this error can occur due to:

### 1. Import Errors
- Missing dependencies
- Circular imports
- Type errors in imported modules

**Check:**
```bash
npm run build
```
If build fails, fix those errors first.

### 2. Runtime Errors in Handler
- Unhandled exceptions
- Missing error handling
- Invalid data access

**Check Vercel logs** for the actual error message.

### 3. TypeScript Compilation Errors
- Type errors that cause runtime issues
- Missing type definitions

**Check:**
```bash
npx tsc --noEmit
```

### 4. Missing Dependencies
- Package not installed
- Version mismatch

**Check:**
```bash
npm install
```

### 5. Vercel Build Configuration
- Wrong build command
- Missing output directory
- Runtime configuration issues

## Step 6: Check Vercel Build Logs

1. Go to **Vercel Dashboard** → Your Project → **Deployments**
2. Click on the latest deployment
3. Click **Build Logs** tab
4. Look for:
   - Build errors
   - TypeScript errors
   - Missing dependencies
   - Import errors

## Step 7: Test Locally First

Before debugging in Vercel, test locally:

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Test locally (if you have a local dev server)
npm run dev
```

If it works locally but fails in Vercel:
- Environment variable issue (but we verified these are correct)
- Build configuration issue
- Vercel-specific runtime issue

## Step 8: Check for Specific Error Patterns

Look in Vercel logs for these common errors:

### "Cannot find module"
```
Error: Cannot find module './supabase-storage'
```
**Fix:** Check import paths, verify files exist

### "TypeError: Cannot read property"
```
TypeError: Cannot read property 'from' of undefined
```
**Fix:** Supabase client not initialized properly

### "SyntaxError" or "ParseError"
```
SyntaxError: Unexpected token
```
**Fix:** Syntax error in code, check build logs

### "ReferenceError"
```
ReferenceError: process is not defined
```
**Fix:** Environment variable access issue

## Step 9: Enable More Detailed Logging

Add logging to your handler to see where it fails:

```typescript
export default async function handler(req, res) {
  console.log('Handler started');
  try {
    console.log('Inside try block');
    // Your code here
    console.log('Before response');
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error caught:', error);
    res.status(500).json({ error: error.message });
  }
}
```

Check Vercel logs to see how far the function gets before crashing.

## Step 10: Share Diagnostic Information

If still stuck, share:

1. **Which endpoint is failing:**
   - URL you're calling
   - HTTP method (GET, POST, etc.)

2. **Vercel Logs:**
   - Full error message
   - Stack trace
   - Any "Supabase initialization" logs

3. **Build Logs:**
   - Any build errors
   - TypeScript errors
   - Warnings

4. **Test Results:**
   - Does `/api/test-simple` work?
   - Does `/api/env-check` work?
   - Which endpoints work vs fail?

5. **Local Test Results:**
   - Does `npm run build` succeed?
   - Does it work locally?

## Quick Checklist

- [ ] Identified which endpoint is failing
- [ ] Checked Vercel Function Logs for actual error
- [ ] Tested `/api/test-simple` endpoint
- [ ] Tested `/api/env-check` endpoint
- [ ] Checked Vercel Build Logs
- [ ] Tested locally (`npm run build`)
- [ ] Reviewed error message and stack trace
- [ ] Checked for import errors
- [ ] Verified all dependencies are installed

## Most Likely Causes (Based on Your Setup)

Since env vars are correct, the issue is probably:

1. **Runtime error in handler** - Check Vercel logs for the actual error
2. **Import error** - Something in the import chain is failing
3. **TypeScript/build error** - Check build logs
4. **Specific endpoint issue** - One endpoint has a bug

**Next Step:** Check Vercel Function Logs - that's where the real error message will be!

