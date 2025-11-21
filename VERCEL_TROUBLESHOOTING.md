# Vercel Photo Deployment Troubleshooting

## Current Status
✅ Photos are in `public/photos/` (correct location)
✅ Photos are tracked in Git
✅ Local build includes photos in `dist/photos/`
✅ 38 photo files confirmed

## Steps to Fix on Vercel

### 1. Trigger a Manual Rebuild
1. Go to your Vercel dashboard
2. Select your project
3. Click on "Deployments"
4. Find the latest deployment
5. Click the "..." menu → "Redeploy"
6. Or push a new commit to trigger rebuild

### 2. Check Vercel Build Logs
1. In Vercel dashboard → Your project → Deployments
2. Click on the latest deployment
3. Check "Build Logs" tab
4. Look for any errors related to:
   - File copying
   - Public folder
   - Asset paths

### 3. Verify Vercel Settings
In Vercel project settings, ensure:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 4. Check File Paths
The paths in code use spaces: `/photos/Wedding/Tagaytay/Wedding 1/...`
- Vite should handle this automatically
- But verify in browser console if you see 404 errors with encoded paths

### 5. Clear Vercel Cache
1. Vercel Dashboard → Your Project → Settings
2. Go to "General" → "Clear Build Cache"
3. Then trigger a new deployment

### 6. Verify GitHub Repository
Make sure `public/photos/` folder is actually in your GitHub repo:
1. Go to: https://github.com/AdapticaTechSolutions/beataudio
2. Navigate to `public/photos/`
3. Verify files are there

### 7. Test Locally First
```bash
npm run build
npm run preview
```
Then visit http://localhost:4173 and check if photos load

### 8. Check Browser Console
On your deployed site:
1. Open browser DevTools (F12)
2. Go to "Network" tab
3. Filter by "Img"
4. Reload page
5. Check which images are failing (404 errors)
6. Note the exact URL that's failing

## Common Issues

### Issue: Photos show 404 in browser
**Solution**: Check if paths have spaces - they might need URL encoding
- Current: `/photos/Wedding/Tagaytay/Wedding 1/file.jpg`
- Might need: `/photos/Wedding/Tagaytay/Wedding%201/file.jpg`

### Issue: Vercel build succeeds but photos don't load
**Solution**: 
1. Check if `dist/photos/` exists in build output
2. Verify Vercel is serving static files correctly
3. Check Vercel function limits (shouldn't apply to static files)

### Issue: Some photos load, others don't
**Solution**: 
1. Check file names for special characters
2. Verify all files are committed to Git
3. Check file permissions

## Quick Fix Commands

```bash
# Verify photos are in public
ls -la public/photos/

# Verify photos are in git
git ls-files public/photos/ | wc -l

# Rebuild locally to test
npm run build
ls -la dist/photos/

# Force push to trigger Vercel rebuild
git add .
git commit -m "fix: Ensure photos are deployed"
git push origin main
```

## Next Steps
1. Check Vercel build logs for errors
2. Verify photos are in GitHub repo
3. Trigger manual rebuild on Vercel
4. Check browser console for 404 errors
5. Share the exact error message if photos still don't load

