# 🔴 CRITICAL: Wrong Service Role Key Detected

## The Problem

Your `SUPABASE_SERVICE_ROLE_KEY` is **WRONG**:
- ❌ Starts with `sb_secret_` (41 characters)
- ✅ Should start with `eyJ` (200+ characters)

This is why your functions are failing!

## How to Fix It

### Step 1: Get the Correct Key from Supabase

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API** (left sidebar)
4. Scroll to **Project API keys** section

### Step 2: Find the Service Role Key

You'll see something like this:

```
Project API keys

anon / public
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (or sb_publishable_...)
[Reveal] [Copy]

service_role (secret)  ← THIS ONE!
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtYXR0cm90YnlsdmVycG9pYmJyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNDk4NzYwMCwiZXhwIjoyMDUwNTYzNjAwfQ... (VERY LONG!)
[Reveal] [Copy]
```

**What to look for:**
- ✅ Labeled as **"service_role"** or **"service_role (secret)"**
- ✅ Starts with **`eyJ`** (JWT format)
- ✅ Is **VERY LONG** (200-400+ characters)
- ✅ Has a **"Reveal"** button (because it's secret)

**What NOT to use:**
- ❌ `sb_secret_...` (this is NOT the service_role key)
- ❌ `sb_publishable_...` (this is the anon key)
- ❌ Any key that's only 41 characters

### Step 3: Copy the Full Key

1. Click **"Reveal"** next to the service_role key
2. Click **"Copy"** to copy the entire key
3. Make sure you copied the **entire** key (it's very long!)

### Step 4: Update in Vercel

1. Go to **Vercel Dashboard** → Your Project
2. Go to **Settings** → **Environment Variables**
3. Find `SUPABASE_SERVICE_ROLE_KEY`
4. Click the **"..."** menu → **Edit**
5. **Delete** the old value (the `sb_secret_...` one)
6. **Paste** the new service_role key (starts with `eyJ`)
7. Click **Save**

### Step 5: Verify

After updating, the key should:
- ✅ Start with `eyJ`
- ✅ Be 200+ characters long
- ✅ Not start with `sb_secret_` or `sb_publishable_`

### Step 6: Redeploy

**CRITICAL:** You MUST redeploy after changing environment variables!

1. Go to **Deployments** tab
2. Click **"..."** on the latest deployment
3. Click **"Redeploy"**

Or push a new commit:
```bash
git commit --allow-empty -m "trigger redeploy after env var update"
git push
```

### Step 7: Test Again

After redeploying, test the diagnostic endpoint:
```
https://your-app.vercel.app/api/env-check
```

Should now show:
- ✅ `setupCorrect: true`
- ✅ `SUPABASE_SERVICE_ROLE_KEY.startsWith: "eyJ"`
- ✅ `SUPABASE_SERVICE_ROLE_KEY.length: 200+`
- ✅ No issues in the `issues` array

## Why This Matters

The `sb_secret_...` key you have is:
- ❌ Not the service_role key
- ❌ Too short (only 41 characters)
- ❌ Won't work for server-side operations
- ❌ May not bypass RLS (causing permission errors)

The correct `eyJ...` service_role key:
- ✅ Bypasses Row Level Security (RLS)
- ✅ Has full database access
- ✅ Required for serverless functions
- ✅ Is the correct format for Supabase

## Still Having Issues?

If you can't find the service_role key in Supabase:

1. **Check you're in the right project** - Make sure you selected the correct Supabase project
2. **Check API settings** - Go to Settings → API (not Authentication, not Database)
3. **Look for "service_role"** - It's labeled as "service_role" or "service_role (secret)"
4. **Click "Reveal"** - The key is hidden by default, you need to reveal it

## Quick Checklist

- [ ] Went to Supabase Dashboard → Settings → API
- [ ] Found the "service_role" key (starts with `eyJ`)
- [ ] Copied the ENTIRE key (200+ characters)
- [ ] Updated `SUPABASE_SERVICE_ROLE_KEY` in Vercel
- [ ] Verified it starts with `eyJ` and is long
- [ ] Redeployed the project
- [ ] Tested `/api/env-check` - shows `setupCorrect: true`

