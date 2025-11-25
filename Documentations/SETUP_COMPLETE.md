# ✅ Setup Complete - Next Steps

## Current Status

✅ Supabase is connected and working  
✅ Database operations (insert/delete) are successful  
✅ Environment variables are configured  

## Create Admin Users

Since your users table is empty, create users using one of these methods:

### Method 1: Seed Endpoint (Recommended)

Visit this URL:
```
https://beataudio.vercel.app/api/users/seed
```

Or use curl:
```bash
curl -X POST https://beataudio.vercel.app/api/users/seed
```

This creates:
- **admin** / **password** (admin role)
- **staff** / **password** (staff role)

### Method 2: Supabase SQL Editor

Go to Supabase Dashboard → SQL Editor and run:

```sql
INSERT INTO users (username, email, password_hash, role)
VALUES 
  ('admin', 'admin@beataudio.ph', 'password', 'admin'),
  ('staff', 'staff@beataudio.ph', 'password', 'staff');
```

## Login Credentials

After creating users:

**Admin:**
- Username: `admin`
- Password: `password`

**Staff:**
- Username: `staff`
- Password: `password`

## Test Your System

1. **Create Users** → Use seed endpoint above
2. **Test Login** → Go to `/admin` and login
3. **Test Booking** → Submit a booking form
4. **Check Admin Portal** → Verify booking appears

## Security Recommendation

You're currently using `VITE_SUPABASE_ANON_KEY`. For better security:

1. **Add SERVICE_ROLE_KEY** in Vercel Dashboard:
   - Go to Settings → Environment Variables
   - Add: `SUPABASE_SERVICE_ROLE_KEY` = (your service_role key from Supabase)
   - This bypasses RLS for server-side operations

2. **Change Default Passwords**:
   ```sql
   -- Use bcrypt to hash passwords
   -- Generate hash at: https://bcrypt-generator.com/
   UPDATE users 
   SET password_hash = '$2a$10$YourBcryptHashHere' 
   WHERE username = 'admin';
   ```

## Verify Everything Works

### 1. Check Users Exist
```sql
SELECT id, username, email, role FROM users;
```

### 2. Test Login
- Visit: `https://beataudio.vercel.app/#/admin`
- Login with: `admin` / `password`

### 3. Test Booking
- Fill out booking form
- Submit booking
- Check Supabase Dashboard → Table Editor → bookings

### 4. Check Admin Portal
- Login to admin portal
- Verify bookings appear
- Try updating booking status

## Troubleshooting

### "User not found" error
- Make sure users were created (check with SQL above)
- Verify username spelling (case-sensitive)

### "Failed to save booking"
- Check RLS policies in Supabase
- Visit `/api/debug-booking` for detailed error

### Still having issues?
- Check browser console (F12)
- Check Vercel function logs
- Check Supabase Dashboard → Logs

## You're All Set! 🎉

Your system is ready. Just create the users and you can start using it!

