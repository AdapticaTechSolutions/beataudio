# How to Check Vercel Logs for the Error

## Step 1: Go to Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Sign in and select your project

## Step 2: Access Function Logs
1. Click on your project
2. Click the **"Functions"** tab at the top
3. Find `/api/auth/login` in the list
4. Click on it
5. Click the **"Logs"** tab

## Step 3: Trigger the Error
1. Keep the logs tab open
2. Try to login from your app (or visit the login endpoint)
3. Watch the logs in real-time

## Step 4: Look For
The logs will show:
- **Error messages** - The exact error causing the crash
- **Stack traces** - Where in the code it's failing
- **Console.log messages** - Debug info we added
- **Environment variables** - Whether keys are loaded

## What to Look For

### Common Errors:

1. **"Cannot find module"**
   - Import path issue
   - Missing dependency

2. **"Supabase client not initialized"**
   - Environment variable not set
   - Wrong variable name

3. **"getUserByUsername is not a function"**
   - Export/import issue

4. **"Database error"**
   - Supabase connection issue
   - Wrong credentials

## Copy the Error

When you see the error in the logs:
1. Copy the **entire error message**
2. Copy the **stack trace**
3. Share it so we can fix it

The logs will tell us exactly what's wrong!

