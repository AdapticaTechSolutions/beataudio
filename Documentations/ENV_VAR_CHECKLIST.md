# Environment Variable Setup Checklist

## ✅ Quick Verification Checklist

### Step 1: Vercel Dashboard Check

Go to: **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**

**Required Variables:**

- [ ] `SUPABASE_URL`
  - ✅ Should start with `https://`
  - ✅ Should end with `.supabase.co`
  - ✅ Should NOT have `VITE_` prefix
  - ✅ Set for: Production (and Preview if needed)

- [ ] `SUPABASE_SERVICE_ROLE_KEY`
  - ✅ Should start with `eyJ` (JWT format)
  - ✅ Should be very long (hundreds of characters)
  - ✅ Should NOT start with `sb_publishable_`
  - ✅ Should NOT have `VITE_` prefix
  - ✅ Set for: Production (and Preview if needed)

- [ ] `VITE_SUPABASE_URL` (for client-side)
  - ✅ Should match your Supabase project URL
  - ✅ Should have `VITE_` prefix
  - ✅ Set for: Production (and Preview if needed)

- [ ] `VITE_SUPABASE_ANON_KEY` (for client-side)
  - ✅ Can start with `eyJ` or `sb_publishable_`
  - ✅ Should have `VITE_` prefix
  - ✅ Set for: Production (and Preview if needed)

### Step 2: Verify Variable Values

**How to get the correct values from Supabase:**

1. Go to [supabase.com](https://supabase.com) → Your Project
2. Go to **Settings** → **API**
3. Find these values:

   - **Project URL** → Use for `SUPABASE_URL` and `VITE_SUPABASE_URL`
   - **service_role key** → Use for `SUPABASE_SERVICE_ROLE_KEY`
     - Click "Reveal" to see it
     - Starts with `eyJ`
     - Very long token
   - **anon / public key** → Use for `VITE_SUPABASE_ANON_KEY`
     - Starts with `eyJ` or `sb_publishable_`
     - Shorter than service_role key

### Step 3: Common Mistakes to Avoid

❌ **Don't use anon key for `SUPABASE_SERVICE_ROLE_KEY`**
- Anon key respects RLS → Will cause permission errors
- Service role key bypasses RLS → Required for server-side

❌ **Don't add `VITE_` prefix to `SUPABASE_SERVICE_ROLE_KEY`**
- `VITE_` variables are exposed to client-side code
- Service role key is secret → Should never be exposed

❌ **Don't forget to redeploy after adding variables**
- Vercel only loads env vars during deployment
- Must redeploy after adding/changing variables

❌ **Don't use wrong variable names**
- Correct: `SUPABASE_SERVICE_ROLE_KEY`
- Wrong: `SUPABASE_SERVICE_KEY`, `SUPABASE_SERVICE_ROLE`, `SERVICE_ROLE_KEY`

### Step 4: Test After Setup

1. **Redeploy your project:**
   - Go to Deployments → Click "..." → Redeploy
   - Or push a new commit

2. **Check Vercel Logs:**
   - Make a request to your API
   - Go to Functions → Logs
   - Look for: `Supabase initialization:`
   - Should show:
     ```
     hasUrl: true
     hasServiceRoleKey: true
     serviceRoleKeyPrefix: "eyJ..." (first 10 chars)
     ```

3. **Test API endpoint:**
   ```bash
   curl https://your-app.vercel.app/api/bookings
   ```
   - Should return data or empty array
   - Should NOT return "credentials not found" error

## 🔍 Troubleshooting

### Problem: "Supabase credentials not found"

**Check:**
1. Are variables set in Vercel Dashboard?
2. Are they set for the correct environment (Production)?
3. Did you redeploy after adding them?
4. Are the variable names spelled correctly?

### Problem: "Permission denied" or RLS errors

**Check:**
1. Are you using `SUPABASE_SERVICE_ROLE_KEY` (not anon key)?
2. Does the key start with `eyJ` (not `sb_publishable_`)?
3. Did you copy the entire service_role key?

### Problem: Variables work locally but not in Vercel

**Check:**
1. Are variables set in Vercel Dashboard (not just `.env.local`)?
2. Did you redeploy after adding them?
3. Are they set for Production environment?

### Problem: Client-side can't access Supabase

**Check:**
1. Are `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` set?
2. Do they have the `VITE_` prefix?
3. Did you rebuild/redeploy after adding them?

## 📝 Summary

**For Serverless Functions (API Routes):**
- `SUPABASE_URL` (no prefix)
- `SUPABASE_SERVICE_ROLE_KEY` (no prefix, use service_role key)

**For Client-Side Code:**
- `VITE_SUPABASE_URL` (with VITE_ prefix)
- `VITE_SUPABASE_ANON_KEY` (with VITE_ prefix, use anon key)

**Remember:**
- ✅ Always redeploy after adding/changing variables
- ✅ Use service_role key for server-side (bypasses RLS)
- ✅ Use anon key for client-side (respects RLS)
- ✅ Never expose service_role key to client-side code

