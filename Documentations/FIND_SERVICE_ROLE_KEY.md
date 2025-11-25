# How to Find the Service Role Key

## ❌ NOT These Keys:
- ❌ **Legacy JWT Secret** - This is for signing tokens, NOT for API access
- ❌ **JWT Secret** - Also for signing tokens
- ❌ **Anon/Public key** (starts with `sb_publishable_`) - Client-side only

## ✅ What You Need:

### Step 1: Go to API Settings
1. In Supabase Dashboard, go to **Settings** (gear icon on left sidebar)
2. Click **API** (not Authentication, not Database, but **API**)

### Step 2: Find the Service Role Key
You'll see a section that looks like this:

```
Project API keys

anon / public
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (or sb_publishable_...)

service_role (secret)
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (long JWT token)
```

### Step 3: Copy the Service Role Key
- Look for the key labeled **"service_role"** or **"service_role (secret)"**
- It should be a long JWT token starting with `eyJ`
- Click the "Reveal" or "Show" button to see the full key
- Copy the **entire** key

### Step 4: Add to Vercel
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add or update: `SUPABASE_SERVICE_ROLE_KEY`
3. Paste the **service_role** key (the one starting with `eyJ`)
4. Save

## Visual Guide:

In Supabase Dashboard:
```
Settings → API

Project API keys
├── anon / public          ← NOT THIS ONE
│   └── sb_publishable_... or eyJ...
│
└── service_role (secret)  ← THIS ONE! ✅
    └── eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (long token)
```

## Important Notes:

- The **service_role** key is **secret** - never expose it in client-side code
- It starts with `eyJ` (JWT format)
- It's much longer than the anon key
- It has a "Reveal" button because it's hidden by default
- It's labeled as "secret" or "service_role"

## After Adding:

1. **Redeploy** your Vercel project
2. Test the login again
3. Check Vercel logs if there are still issues

