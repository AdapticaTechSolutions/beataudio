# Testing Guide - Supabase Setup Verification

## Quick Test Steps

### Step 1: Enable Supabase Storage (If Not Done)

Check if Supabase is enabled in `/api/lib/storage.ts`:

```typescript
// Should have this line uncommented:
export * from './supabase-storage';
```

If not, update the file:
1. Open `/api/lib/storage.ts`
2. Comment out the in-memory storage section
3. Uncomment: `export * from './supabase-storage';`

### Step 2: Start Your Dev Server

```bash
npm run dev
```

### Step 3: Test Supabase Connection

#### Option A: Use the Test HTML Page (Easiest)

1. Open `test-supabase.html` in your browser
2. Click "Run Tests"
3. Review the results

#### Option B: Use the API Endpoint Directly

Visit in browser or use curl:
```bash
# Local
curl http://localhost:5173/api/test-supabase

# Production (after deploy)
curl https://beataudio.vercel.app/api/test-supabase
```

#### Option C: Test via Browser Console

Open browser console on your site and run:
```javascript
fetch('/api/test-supabase')
  .then(r => r.json())
  .then(data => console.log(data));
```

## What the Tests Check

✅ **Environment Variables** - Are Supabase credentials set?  
✅ **Client Initialization** - Can we connect to Supabase?  
✅ **Database Connection** - Does the bookings table exist?  
✅ **Read Operation** - Can we read bookings?  
✅ **Create Operation** - Can we create a booking?  
✅ **Update Operation** - Can we update a booking?  
✅ **Delete Operation** - Can we delete a booking?  
✅ **Users Table** - Does the users table exist?  

## Expected Results

### ✅ All Tests Pass
```
✅ Environment Variables Check - PASS
✅ Supabase Client Initialization - PASS
✅ Database Connection - PASS
✅ Read Operation - PASS
✅ Create Operation - PASS
✅ Update Operation - PASS
✅ Delete Operation - PASS
✅ Users Table Check - PASS
```

**Next Steps:**
1. Test your booking form
2. Check admin portal
3. Verify bookings are saved

### ❌ Some Tests Fail

#### "Environment Variables Check - FAIL"
**Fix:** Add environment variables in Vercel Dashboard:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY` (or `SUPABASE_SERVICE_ROLE_KEY`)

#### "Database Connection - FAIL - Table does not exist"
**Fix:** Create tables in Supabase:
1. Go to Supabase Dashboard → SQL Editor
2. Run the SQL from `SUPABASE_GUIDE.md`
3. Or copy from below:

```sql
CREATE TABLE bookings (
  id VARCHAR(50) PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  contact_number VARCHAR(20),
  email VARCHAR(255) NOT NULL,
  event_date DATE NOT NULL,
  event_type VARCHAR(50) NOT NULL,
  venue VARCHAR(255) NOT NULL,
  ceremony_venue VARCHAR(255),
  guest_count INTEGER DEFAULT 0,
  services TEXT[] DEFAULT '{}',
  band_rider TEXT,
  total_amount DECIMAL(10,2),
  status VARCHAR(20) DEFAULT 'Inquiry',
  full_name VARCHAR(255),
  cel_number VARCHAR(20),
  venue_address VARCHAR(255),
  wedding_setup VARCHAR(50),
  service_lights BOOLEAN DEFAULT false,
  service_sounds BOOLEAN DEFAULT false,
  service_led_wall BOOLEAN DEFAULT false,
  service_projector BOOLEAN DEFAULT false,
  service_smoke BOOLEAN DEFAULT false,
  has_band BOOLEAN DEFAULT false,
  additional_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### "Create Operation - FAIL - RLS Policy"
**Fix:** Update Row Level Security policies:
1. Go to Supabase Dashboard → Authentication → Policies
2. For `bookings` table, create policy:
   - Policy name: "Allow public insert"
   - Operation: INSERT
   - Target roles: `public`
   - USING expression: `true`
   - WITH CHECK expression: `true`

## Manual Testing Checklist

After tests pass, verify:

- [ ] **Booking Form**
  - Fill out booking form
  - Submit booking
  - Check browser console for errors
  - Verify booking appears in Supabase Dashboard → Table Editor → bookings

- [ ] **Admin Portal**
  - Login to admin portal
  - Check if bookings load
  - Try updating a booking status
  - Verify changes in Supabase Dashboard

- [ ] **Calendar**
  - Open booking modal
  - Check if confirmed bookings show as "Booked"
  - Verify dates are blocked correctly

## Troubleshooting

### "Cannot connect to Supabase"
- Check environment variables are set correctly
- Verify Supabase project is active
- Check API keys are correct

### "Table does not exist"
- Run the SQL schema in Supabase SQL Editor
- Verify table names match (lowercase: `bookings`, not `Bookings`)

### "RLS Policy Error"
- Disable RLS temporarily for testing:
  ```sql
  ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;
  ```
- Or create proper policies (see SUPABASE_GUIDE.md)

### "CORS Error"
- This shouldn't happen with Vercel, but if it does:
  - Check API route CORS headers
  - Verify request is going to correct endpoint

## Production Testing

After deploying to Vercel:

1. **Set Environment Variables** in Vercel Dashboard
2. **Redeploy** (automatic after env vars change)
3. **Test API**: `https://beataudio.vercel.app/api/test-supabase`
4. **Test Booking Form** on live site
5. **Check Admin Portal** works

## Need Help?

1. Check Supabase Dashboard → Logs for errors
2. Check Vercel Dashboard → Functions → Logs
3. Check browser console for errors
4. Review `SUPABASE_GUIDE.md` for detailed setup

