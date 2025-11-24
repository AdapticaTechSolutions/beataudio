# Debugging Login Issue

## Current Situation
- Username: `admin`
- Password: `password`
- Both exist in database
- Login is not working

## Step 1: Check Browser Console & Network Tab

1. **Open Browser DevTools** (F12 or Right-click → Inspect)
2. **Go to Network tab**
3. **Try logging in**
4. **Find the `/api/auth/login` request**
5. **Check:**
   - Request payload (what's being sent)
   - Response status code
   - Response body (error message)

**What to look for:**
- Is the request being sent? (Status: 200, 401, 500?)
- What error message is returned?
- Is the request body correct? `{"username": "admin", "password": "password"}`

## Step 2: Test User Lookup

Test if the user exists in the database:

```
https://your-app.vercel.app/api/debug?type=login&username=admin
```

**Expected response:**
```json
{
  "success": true,
  "type": "login",
  "username": "admin",
  "userFound": true,
  "user": {
    "id": "...",
    "username": "admin",
    "email": "...",
    "role": "admin",
    "hasPassword": true
  }
}
```

**If `userFound: false`:**
- User doesn't exist in database
- Need to create user using `/api/users/seed` or SQL

## Step 3: Check Vercel Logs

1. Go to **Vercel Dashboard** → Your Project
2. Click **Functions** → `/api/auth/login`
3. Click **Logs** tab
4. Try logging in again
5. Look for:
   - `"Attempting to fetch user: admin"`
   - `"User fetch result: Found"` or `"Not found"`
   - Any error messages

## Step 4: Verify Database Password

The password comparison is simple: `password === hash`

**Check what's actually stored in Supabase:**
1. Go to **Supabase Dashboard** → Your Project
2. Go to **Table Editor** → `users` table
3. Find the `admin` user
4. Check the `password_hash` column:
   - Should be exactly `"password"` (plain text, no quotes)
   - No extra spaces
   - No hashing

**If password_hash is different:**
- Update it to match: `password`
- Or update the code to match what's stored

## Step 5: Common Issues

### Issue 1: Password Hash Mismatch
**Symptom:** User found but password doesn't match

**Check:**
- Is `password_hash` in database exactly `"password"`?
- No extra whitespace?
- Case-sensitive? (should be lowercase)

**Fix:**
```sql
UPDATE users 
SET password_hash = 'password' 
WHERE username = 'admin';
```

### Issue 2: User Not Found
**Symptom:** `userFound: false` in debug endpoint

**Fix:**
- Run `/api/users/seed` to create default users
- Or create user manually in Supabase

### Issue 3: Database Connection Error
**Symptom:** Error fetching user from database

**Check:**
- Environment variables set correctly?
- Service role key correct?
- RLS disabled on users table?

### Issue 4: Request Not Reaching API
**Symptom:** No network request in browser

**Check:**
- Is the API URL correct?
- CORS issues?
- Network tab shows request?

## Step 6: Test with Debug Endpoint

Test the full login flow:

```bash
curl -X POST https://your-app.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'
```

**Expected response:**
```json
{
  "success": true,
  "token": "...",
  "user": {
    "id": "...",
    "username": "admin",
    "email": "...",
    "role": "admin"
  }
}
```

**If error:**
- Copy the error message
- Check what it says

## Quick Checklist

- [ ] Checked browser Network tab for `/api/auth/login` request
- [ ] Checked response status and error message
- [ ] Tested `/api/debug?type=login&username=admin`
- [ ] Verified user exists in Supabase `users` table
- [ ] Verified `password_hash` is exactly `"password"`
- [ ] Checked Vercel Function Logs for errors
- [ ] Tested with curl command

## Most Likely Issues

1. **Password hash mismatch** - Database has different value than expected
2. **User not found** - User doesn't exist in database
3. **Database connection** - Can't connect to Supabase
4. **Request format** - Request body not formatted correctly

## Next Steps

Share:
1. **Browser Network tab response** - What error is returned?
2. **Debug endpoint result** - Does `/api/debug?type=login&username=admin` find the user?
3. **Vercel logs** - What do the logs show?
4. **Database password_hash** - What's actually stored in Supabase?

