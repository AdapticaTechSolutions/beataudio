# Verify Supabase Keys

## The Problem

If your `SUPABASE_SERVICE_ROLE_KEY` starts with `sb_publishable_`, you're using the **wrong key**!

## How to Get the Correct Keys

### Step 1: Go to Supabase Dashboard
1. Go to [supabase.com](https://supabase.com)
2. Select your project
3. Go to **Settings** → **API**

### Step 2: Find the Correct Keys

You'll see two keys:

1. **anon / public key** (starts with `sb_publishable_` or `eyJ...`)
   - This is for client-side use
   - Respects Row Level Security (RLS)
   - ⚠️ **NOT what you need for serverless functions**

2. **service_role key** (starts with `eyJ...` - JWT format)
   - This is for server-side use
   - **Bypasses Row Level Security (RLS)**
   - ✅ **This is what you need!**

### Step 3: Update Vercel Environment Variables

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Find `SUPABASE_SERVICE_ROLE_KEY`
3. **Delete it** if it starts with `sb_publishable_`
4. Add a **new** `SUPABASE_SERVICE_ROLE_KEY` with the **service_role** key from Supabase
5. Make sure it starts with `eyJ` (JWT format)

### Step 4: Also Set These (if not already set)

- `SUPABASE_URL` - Your Supabase project URL (e.g., `https://xxxxx.supabase.co`)
- `SUPABASE_SERVICE_ROLE_KEY` - The **service_role** key (starts with `eyJ`)

### Step 5: Redeploy

After updating environment variables:
1. Go to Vercel Dashboard → Your Project → Deployments
2. Click the "..." menu on the latest deployment
3. Click "Redeploy"

Or just push a new commit:
```bash
git commit --allow-empty -m "trigger redeploy"
git push
```

## How to Identify the Correct Key

**Service Role Key:**
- Starts with `eyJ` (JWT format)
- Usually much longer
- Labeled as "service_role" in Supabase dashboard
- ⚠️ **Keep this secret!** Never expose it in client-side code

**Anon/Public Key:**
- Starts with `sb_publishable_` or `eyJ`
- Labeled as "anon" or "public" in Supabase dashboard
- Safe to use in client-side code

## Why This Matters

- **Anon key** respects RLS policies → Can be blocked by RLS
- **Service role key** bypasses RLS → Full access to database

For serverless functions (API routes), you **must** use the service_role key to avoid RLS issues.

