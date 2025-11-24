# Test Login After Deployment

## Step 1: Push Code
```bash
git push
```

Wait 1-2 minutes for Vercel to deploy.

## Step 2: Test Debug Endpoint

After deployment, test the debug endpoint to see the actual error:

Visit: `https://your-app.vercel.app/api/debug?type=login&username=admin`

This will show you:
- If the user is found
- The exact error message
- Error code and details

## Step 3: Check Vercel Function Logs

1. Go to Vercel Dashboard → Your Project
2. Click "Functions" tab
3. Find `/api/auth/login`
4. Click on it → Check "Logs" tab
5. Look for the error when you try to login

The logs will show:
- Console.log messages we added
- The exact Supabase error
- Error code and details

## Step 4: Verify Environment Variables

Make sure these are set in Vercel:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` (preferred) OR `VITE_SUPABASE_ANON_KEY`

After adding/changing env vars, **redeploy**!

## What to Look For

The error "The string did not match the expected pattern" could mean:
1. **UUID validation** - But RLS is disabled, so this shouldn't be it
2. **Query syntax issue** - The select('*') should work
3. **Environment variable issue** - SERVICE_ROLE_KEY might not be set
4. **Supabase client initialization** - Check logs for "Supabase client not initialized"

## Quick Test

After pushing, try the debug endpoint first:
```
https://your-app.vercel.app/api/debug?type=login&username=admin
```

This will give you the exact error without going through the login form.

