# Creating Admin Users

Since your users table is empty, you need to create admin users. Here are 3 ways to do it:

## Method 1: Use the Seed Endpoint (Easiest)

Visit this URL in your browser or use curl:
```
https://beataudio.vercel.app/api/users/seed
```

Or use curl:
```bash
curl -X POST https://beataudio.vercel.app/api/users/seed
```

This will create:
- **Username:** `admin` | **Password:** `password` | **Role:** `admin`
- **Username:** `staff` | **Password:** `password` | **Role:** `staff`

## Method 2: Use Supabase SQL Editor (Recommended)

1. Go to Supabase Dashboard → SQL Editor
2. Run this SQL:

```sql
-- Insert admin user
INSERT INTO users (username, email, password_hash, role)
VALUES ('admin', 'admin@beataudio.ph', 'password', 'admin');

-- Insert staff user
INSERT INTO users (username, email, password_hash, role)
VALUES ('staff', 'staff@beataudio.ph', 'password', 'staff');
```

3. Click "Run" to execute

## Method 3: Use Supabase Table Editor

1. Go to Supabase Dashboard → Table Editor → users
2. Click "Insert" → "Insert row"
3. Fill in:
   - **id:** Leave empty (auto-generated UUID)
   - **username:** `admin`
   - **email:** `admin@beataudio.ph`
   - **password_hash:** `password`
   - **role:** `admin`
   - **created_at:** Leave empty (auto-generated)
4. Click "Save"
5. Repeat for staff user

## Verify Users Were Created

Run this SQL in Supabase SQL Editor:
```sql
SELECT id, username, email, role, created_at FROM users;
```

You should see your admin and staff users.

## Login Credentials

After creating users, you can login with:

**Admin:**
- Username: `admin`
- Password: `password`

**Staff:**
- Username: `staff`
- Password: `password`

## ⚠️ Security Note

**IMPORTANT:** Change these default passwords in production!

For production, use bcrypt to hash passwords:

```sql
-- Example with bcrypt hash (password: "your-secure-password")
-- Generate hash using: https://bcrypt-generator.com/ or Node.js bcrypt
UPDATE users 
SET password_hash = '$2a$10$YourBcryptHashHere' 
WHERE username = 'admin';
```

## Troubleshooting

### "The string did not match the expected pattern"
This error usually means:
1. **UUID format issue** - Make sure `id` field is UUID type
2. **Username validation** - Check username doesn't have special characters
3. **Email validation** - Check email format is valid

**Fix:** Make sure your users table schema matches:
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'staff',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);
```

### "User not found" after creating
- Check username spelling (case-sensitive)
- Verify user was actually inserted: `SELECT * FROM users;`
- Check for RLS policies blocking reads

### Still having issues?
1. Check Supabase Dashboard → Logs for errors
2. Verify table structure matches schema above
3. Try the seed endpoint: `/api/users/seed`

