# Fix: ERR_MODULE_NOT_FOUND - Cannot find module '/var/task/lib/api/storage'

## The Problem

**Error:**
```
Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/var/task/lib/api/storage' 
imported from /var/task/api/debug.js
```

**Root Cause:**
Vercel uses ES modules (ESM) for serverless functions. In ES modules, import paths **must include file extensions** (`.js`), even when importing TypeScript files.

## The Fix

Updated all import statements to include `.js` extension:

### Before (Broken):
```typescript
// ❌ Missing file extension
import { getUserByUsername } from '../lib/api/storage';
import { getBookings, createBooking } from '../../lib/api/storage';
```

### After (Fixed):
```typescript
// ✅ Includes .js extension (required for ES modules)
import { getUserByUsername } from '../lib/api/storage.js';
import { getBookings, createBooking } from '../../lib/api/storage.js';
```

## Files Updated

1. ✅ `api/debug.ts` - Fixed import path
2. ✅ `api/bookings/index.ts` - Fixed import path
3. ✅ `api/bookings/[id].ts` - Fixed import path
4. ✅ `api/auth/login.ts` - Fixed import path
5. ✅ `lib/api/storage.ts` - Fixed export path

## Why This Happens

**ES Modules (ESM) Requirements:**
- ES modules require explicit file extensions in import statements
- Even though source files are `.ts`, you use `.js` in imports
- After TypeScript compilation, `.ts` files become `.js` files
- The import path must match the compiled output

**Vercel Serverless Functions:**
- Vercel uses Node.js ES modules for serverless functions
- TypeScript is compiled to JavaScript before deployment
- Import paths must match the compiled `.js` files

## Verification

After deploying, test:
```
https://your-app.vercel.app/api/debug?type=supabase
```

Should now work without `ERR_MODULE_NOT_FOUND` error.

## Related Issues

If you see similar errors for other imports:
1. Check if the import is missing `.js` extension
2. Verify the relative path is correct
3. Ensure the file exists at that path

## Common Patterns

### ✅ Correct (ES Modules):
```typescript
import { something } from './module.js';
import { other } from '../lib/utils.js';
import type { Type } from './types.js';
```

### ❌ Incorrect (Missing Extension):
```typescript
import { something } from './module';      // ❌ Missing .js
import { other } from '../lib/utils';     // ❌ Missing .js
```

## Notes

- TypeScript will still type-check correctly with `.js` extensions
- The `.js` extension refers to the compiled output, not the source
- This is standard ES module behavior, not a Vercel quirk
- Your `tsconfig.json` doesn't need changes for this to work

## Status

✅ **Fixed** - All import paths updated with `.js` extensions
✅ **Build passes** - `npm run build` succeeds
✅ **Ready to deploy** - Should work in Vercel now

