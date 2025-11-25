# Environment Variable Setup Diagnostic Guide

## 🚨 Critical Issue Found

Your code has a **problematic fallback** that could cause issues:

```typescript
// Current code (line 24-25 in supabase-storage.ts)
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
```

**Problem:** If `SUPABASE_SERVICE_ROLE_KEY` is missing, it falls back to `VITE_SUPABASE_ANON_KEY`, which:
- ❌ Respects Row Level Security (RLS) → Can cause permission errors
- ❌ Is meant for client-side use, not server-side
- ❌ May not have the permissions needed for API routes

## ✅ Correct Environment Variable Setup

### For Vercel Serverless Functions (API Routes)

Set these variables **WITHOUT** the `VITE_` prefix:

```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (long JWT)
```

**Why?**
- Variables without `VITE_` are **only** available in serverless functions
- `SUPABASE_SERVICE_ROLE_KEY` bypasses RLS (needed for server-side operations)
- These are **secret** and should never be exposed to client-side code

### For Client-Side Code (React Components)

Set these variables **WITH** the `VITE_` prefix:

```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (or sb_publishable_...)
```

**Why?**
- Variables with `VITE_` are exposed to client-side code
- `VITE_SUPABASE_ANON_KEY` respects RLS (safe for client-side)
- These are **public** and can be seen in browser dev tools

## 🔍 How to Check Your Current Setup

### Step 1: Check Vercel Dashboard

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. Look for these variables:

**Required for API Routes (Serverless Functions):**
- [ ] `SUPABASE_URL` (without VITE_ prefix)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` (without VITE_ prefix)

**Required for Client-Side:**
- [ ] `VITE_SUPABASE_URL` (with VITE_ prefix)
- [ ] `VITE_SUPABASE_ANON_KEY` (with VITE_ prefix)

### Step 2: Verify Variable Names

**Common Mistakes:**
- ❌ `SUPABASE_SERVICE_KEY` (missing `_ROLE`)
- ❌ `SUPABASE_SERVICE_ROLE` (missing `_KEY`)
- ❌ `VITE_SUPABASE_SERVICE_ROLE_KEY` (should NOT have VITE_ prefix)
- ❌ Using anon key instead of service_role key

### Step 3: Check Variable Values

**SUPABASE_URL should:**
- Start with `https://`
- End with `.supabase.co`
- Example: `https://abcdefghijklmnop.supabase.co`

**SUPABASE_SERVICE_ROLE_KEY should:**
- Start with `eyJ` (JWT format)
- Be very long (hundreds of characters)
- **NOT** start with `sb_publishable_` (that's the anon key!)
- Be labeled as "service_role" in Supabase dashboard

**VITE_SUPABASE_ANON_KEY should:**
- Start with `eyJ` or `sb_publishable_`
- Be shorter than service_role key
- Be labeled as "anon" or "public" in Supabase dashboard

### Step 4: Check Environment Scopes

In Vercel, make sure variables are set for the correct environments:

- **Production** - For production deployments
- **Preview** - For preview deployments (pull requests)
- **Development** - For local development (optional)

**Recommendation:** Set all variables for all environments unless you have different Supabase projects.

## 🐛 Common Issues

### Issue 1: Using Anon Key Instead of Service Role Key

**Symptoms:**
- RLS (Row Level Security) errors
- "permission denied" errors
- Functions work locally but fail in Vercel

**Fix:**
1. Go to Supabase Dashboard → Settings → API
2. Copy the **service_role** key (not the anon key)
3. Update `SUPABASE_SERVICE_ROLE_KEY` in Vercel
4. Redeploy

### Issue 2: Missing VITE_ Prefix for Client-Side

**Symptoms:**
- Client-side code can't access Supabase
- `undefined` values in browser console

**Fix:**
- Make sure client-side variables have `VITE_` prefix
- Redeploy

### Issue 3: Variables Not Available After Adding

**Symptoms:**
- Variables set in Vercel but still undefined in functions

**Fix:**
- **You MUST redeploy after adding/changing environment variables**
- Go to Deployments → Click "..." → Redeploy
- Or push a new commit

### Issue 4: Wrong Variable Names

**Symptoms:**
- Functions can't find credentials
- "Supabase credentials not found" errors

**Fix:**
- Double-check spelling: `SUPABASE_SERVICE_ROLE_KEY` (exact spelling)
- Check for typos or extra spaces
- Make sure it's set for the correct environment (Production/Preview)

## 📋 Complete Checklist

### In Vercel Dashboard:

- [ ] `SUPABASE_URL` is set (without VITE_)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is set (without VITE_)
- [ ] `VITE_SUPABASE_URL` is set (with VITE_)
- [ ] `VITE_SUPABASE_ANON_KEY` is set (with VITE_)
- [ ] All variables are set for Production environment
- [ ] All variables are set for Preview environment (if using)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` starts with `eyJ` (not `sb_publishable_`)
- [ ] Variables were added **before** deployment (or redeployed after adding)

### In Supabase Dashboard:

- [ ] You're using the **service_role** key (not anon key) for `SUPABASE_SERVICE_ROLE_KEY`
- [ ] The service_role key starts with `eyJ`
- [ ] You copied the **entire** key (it's very long)

## 🧪 Test Your Setup

### Test 1: Check Vercel Logs

1. Make a request to your API (e.g., create a booking)
2. Go to Vercel Dashboard → Functions → Logs
3. Look for: `Supabase initialization:`
4. Check:
   - `hasUrl: true` ✅
   - `hasServiceRoleKey: true` ✅
   - `serviceRoleKeyPrefix` shows first 10 chars (should start with `eyJ`)

### Test 2: Use Debug Endpoint

If you have `/api/debug` endpoint:
```
https://your-app.vercel.app/api/debug
```

This should show:
- Environment variables present
- Supabase client initialized
- Connection successful

### Test 3: Test API Route Directly

```bash
curl https://your-app.vercel.app/api/bookings
```

Should return bookings (or empty array), not an error about missing credentials.

## 🔧 Recommended Fix

Consider updating your code to be more explicit about which variables to use:

```typescript
// Better approach - don't fallback to client-side variables
function getSupabaseClient(): SupabaseClient {
  if (supabaseClient) return supabaseClient;
  
  // For server-side: ONLY use server-side variables
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      'Server-side Supabase credentials not found. ' +
      'Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel.'
    );
  }
  
  supabaseClient = createClient(supabaseUrl, supabaseKey);
  return supabaseClient;
}
```

This makes it clear that server-side functions should use server-side variables only.

## 📚 Understanding Vercel Environment Variables

### Variable Prefixes:

- **No prefix** (`SUPABASE_URL`) → Available in serverless functions only
- **`VITE_` prefix** (`VITE_SUPABASE_URL`) → Available in both client-side AND serverless functions

### Best Practice:

- **Server-side secrets** → No prefix (e.g., `SUPABASE_SERVICE_ROLE_KEY`)
- **Client-side public keys** → `VITE_` prefix (e.g., `VITE_SUPABASE_ANON_KEY`)

### Why This Matters:

- Variables without `VITE_` are **never** exposed to client-side code
- Variables with `VITE_` are **bundled** into your client-side JavaScript
- **Never** put secrets in variables with `VITE_` prefix!

## 🎯 Quick Fix Steps

1. **Verify in Vercel Dashboard:**
   - Go to Settings → Environment Variables
   - Check that `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` exist
   - Verify they're set for Production environment

2. **Verify in Supabase Dashboard:**
   - Go to Settings → API
   - Copy the **service_role** key (starts with `eyJ`)
   - Make sure it's the full key

3. **Update Vercel:**
   - If missing, add `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
   - Use the service_role key (not anon key)
   - Set for Production (and Preview if needed)

4. **Redeploy:**
   - Go to Deployments → Click "..." → Redeploy
   - Or push a new commit

5. **Test:**
   - Check Vercel logs for "Supabase initialization"
   - Test an API endpoint
   - Verify it works

## ❓ Still Having Issues?

If you're still seeing errors after checking everything:

1. **Check Vercel Logs:**
   - Look for the exact error message
   - Check the "Supabase initialization" log output
   - Share the error details

2. **Verify Variable Values:**
   - Make sure there are no extra spaces
   - Make sure you copied the entire key
   - Check for typos

3. **Test Locally:**
   - Create a `.env.local` file with the same variables
   - Test if it works locally
   - If it works locally but not in Vercel, it's an env var setup issue

4. **Double-Check Supabase:**
   - Make sure you're using the correct project
   - Verify the URL matches your Supabase project
   - Check that RLS policies aren't blocking access

