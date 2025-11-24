# Supabase Integration Guide

## What is Supabase?

**Supabase** is an open-source Backend-as-a-Service (BaaS) platform that provides:

1. **PostgreSQL Database** - A fully managed, production-ready PostgreSQL database
2. **Authentication** - Built-in user management with email, social logins, etc.
3. **Real-time Subscriptions** - Listen to database changes in real-time
4. **Storage** - File and object storage with access policies
5. **Edge Functions** - Serverless functions for custom backend logic
6. **Row Level Security (RLS)** - Database-level security policies

## How Supabase Works

### Architecture

```
Your Frontend (React/Vite)
    ↓
Supabase Client Library (@supabase/supabase-js)
    ↓
Supabase API (REST + WebSocket)
    ↓
PostgreSQL Database (Managed by Supabase)
```

### Key Concepts

1. **Project**: Each Supabase project is a separate instance with its own database
2. **API Keys**: 
   - `anon` key: Public key for client-side operations (safe to expose)
   - `service_role` key: Private key for admin operations (server-side only)
3. **Tables**: Standard PostgreSQL tables with Row Level Security (RLS)
4. **Policies**: Security rules that control who can read/write data

## Why Use Supabase for Your Project?

✅ **PostgreSQL Database** - Industry-standard, powerful SQL database  
✅ **Real-time Updates** - Bookings can update in admin portal instantly  
✅ **Built-in Auth** - Can replace your custom login system  
✅ **Free Tier** - Generous free tier for small projects  
✅ **Easy Setup** - Get started in minutes  
✅ **Auto-scaling** - Handles growth automatically  
✅ **Dashboard** - Visual interface to manage data  

## Setup Steps

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up/login
3. Click "New Project"
4. Fill in:
   - Project name: `beat-audio-bookings`
   - Database password: (save this!)
   - Region: Choose closest to your users
5. Wait ~2 minutes for setup

### 2. Get Your Credentials

In Supabase Dashboard → Settings → API:

```
Project URL: https://xxxxx.supabase.co
anon/public key: eyJhbGc...
service_role key: eyJhbGc... (KEEP SECRET!)
```

### 3. Install Supabase Client

```bash
npm install @supabase/supabase-js
```

### 4. Create Database Tables

Go to Supabase Dashboard → SQL Editor and run:

```sql
-- Bookings table
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

-- Users table (for admin authentication)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'staff',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better performance
CREATE INDEX idx_bookings_event_date ON bookings(event_date);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_email ON bookings(email);

-- Enable Row Level Security (RLS)
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust based on your needs)
-- Allow anyone to read bookings (or restrict to authenticated users)
CREATE POLICY "Allow public read access" ON bookings
  FOR SELECT USING (true);

-- Only authenticated users can insert/update/delete
CREATE POLICY "Allow authenticated insert" ON bookings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated update" ON bookings
  FOR UPDATE USING (true);

CREATE POLICY "Allow authenticated delete" ON bookings
  FOR DELETE USING (true);

-- Users table: Only service role can access
CREATE POLICY "Service role only" ON users
  FOR ALL USING (false); -- Adjust based on your auth needs
```

### 5. Set Environment Variables

In Vercel Dashboard → Settings → Environment Variables:

```bash
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... (server-side only!)
```

### 6. Update Your Code

See `api/lib/supabase-storage.ts` for the implementation.

## How Supabase Differs from Current Setup

### Current (In-Memory)
- ❌ Data lost on server restart
- ❌ Not shared across instances
- ❌ No persistence
- ✅ Simple, works immediately

### Supabase
- ✅ Data persists permanently
- ✅ Shared across all instances
- ✅ Real-time updates
- ✅ Built-in security (RLS)
- ✅ Visual dashboard
- ✅ Automatic backups

## Real-time Features

Supabase can notify your app when bookings change:

```typescript
// Listen to booking changes in real-time
const subscription = supabase
  .channel('bookings')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'bookings' },
    (payload) => {
      console.log('Booking changed!', payload);
      // Update your UI automatically
    }
  )
  .subscribe();
```

This means:
- Admin creates booking → Appears instantly in admin portal
- Status changes → Calendar updates automatically
- No page refresh needed!

## Pricing

**Free Tier:**
- 500 MB database
- 2 GB bandwidth
- 50,000 monthly active users
- Unlimited API requests

**Pro Tier ($25/month):**
- 8 GB database
- 250 GB bandwidth
- Unlimited users
- Daily backups

## Security Best Practices

1. **Never expose service_role key** in client-side code
2. **Use RLS policies** to control data access
3. **Use anon key** for client-side operations
4. **Validate data** before inserting
5. **Use HTTPS** always (Supabase enforces this)

## Migration Checklist

- [ ] Create Supabase project
- [ ] Install `@supabase/supabase-js`
- [ ] Create database tables
- [ ] Set up RLS policies
- [ ] Add environment variables
- [ ] Update `api/lib/storage.ts` to use Supabase
- [ ] Test all CRUD operations
- [ ] Migrate existing data (if any)
- [ ] Set up real-time subscriptions (optional)
- [ ] Update authentication to use Supabase Auth (optional)

## Next Steps

1. **Try it out**: Create a free Supabase account
2. **Read the docs**: [supabase.com/docs](https://supabase.com/docs)
3. **See example**: Check `api/lib/supabase-storage.ts` for implementation
4. **Test locally**: Use Supabase CLI for local development

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Real-time Subscriptions](https://supabase.com/docs/guides/realtime)

