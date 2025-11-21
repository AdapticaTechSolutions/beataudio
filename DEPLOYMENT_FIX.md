# Photo Deployment Fix for Vercel

## Problem
Photos were not showing up on Vercel because they were in the root `photos/` folder instead of the `public/` folder.

## Solution Applied
✅ Moved `photos/` folder to `public/photos/`

## Next Steps to Deploy

### 1. Stage the changes in Git:
```bash
# Add the new public/photos folder
git add public/photos/

# Remove the old photos folder from git tracking
git rm -r photos/

# Or if you want to keep it staged:
git add -A
```

### 2. Commit the changes:
```bash
git commit -m "fix: Move photos folder to public directory for Vercel deployment"
```

### 3. Push to GitHub:
```bash
git push origin main
# or
git push origin master
```

### 4. Vercel will automatically rebuild
Once you push, Vercel will detect the changes and rebuild your site. The photos should now be accessible.

## How It Works
- Vite serves all files from the `public/` folder as static assets
- Files in `public/` are copied to the root of the build output
- Your code references photos with `/photos/...` which will now work correctly
- Vercel includes everything in `public/` when deploying

## Verify After Deployment
After Vercel rebuilds, check:
1. Open your deployed site
2. Check browser console for any 404 errors on images
3. Verify photos load in:
   - Hero section
   - Event Types
   - Packages
   - Portfolio
   - Services (if using images)

## If Photos Still Don't Load
1. Check browser console for exact error messages
2. Verify the file paths in your code match the folder structure
3. Make sure all photos are committed to Git (not in .gitignore)
4. Check Vercel build logs for any errors

