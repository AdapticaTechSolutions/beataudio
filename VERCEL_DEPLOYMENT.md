# Vercel Deployment Guide

## API Routes Configuration

Vercel automatically detects API routes in the `/api` directory. No `vercel.json` configuration is needed for basic setups.

## If You Need vercel.json

If you encounter issues, create a minimal `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

**Do NOT** specify function runtimes - Vercel auto-detects TypeScript API routes.

## Deployment Checklist

- [ ] Push code to GitHub
- [ ] Vercel auto-detects the project
- [ ] Set environment variables in Vercel Dashboard:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (for server-side operations)
- [ ] Deploy

## Troubleshooting

### "Function Runtimes must have a valid version"
- **Solution**: Remove `vercel.json` or ensure it doesn't specify function runtimes
- Vercel auto-detects TypeScript API routes

### "API routes not working"
- Check that files are in `/api` directory
- Ensure files export a default function handler
- Check Vercel Function logs in dashboard

### "Environment variables not working"
- Variables starting with `VITE_` are available in client-side code
- Server-side variables (without `VITE_`) are available in API routes
- Redeploy after adding environment variables

## API Routes Structure

Your API routes should follow this structure:

```
/api
  /bookings
    index.ts          → GET, POST /api/bookings
    [id].ts           → GET, PUT, DELETE /api/bookings/:id
  /auth
    login.ts          → POST /api/auth/login
  /test-supabase.ts   → GET /api/test-supabase
```

Each file should export a default async function:

```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Your code here
}
```

## Testing After Deployment

1. Test API endpoint: `https://your-app.vercel.app/api/test-supabase`
2. Test booking creation: Submit a booking form
3. Check Vercel Dashboard → Functions → Logs for errors

