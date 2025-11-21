# Fix Photos Not Showing on Vercel

## ✅ What's Already Done
- Photos moved to `public/photos/` ✅
- All 38 photos are tracked in Git ✅
- Local build includes photos ✅
- `vercel.json` created ✅

## 🔧 Steps to Fix on Vercel

### Step 1: Verify Photos are on GitHub
1. Go to: https://github.com/AdapticaTechSolutions/beataudio
2. Click on `public` folder
3. Click on `photos` folder
4. Verify you can see the folder structure (Wedding, Corporate, Kiddie)
5. **If photos are NOT there**, run:
   ```bash
   git add public/photos/
   git commit -m "Add photos to public folder"
   git push origin main
   ```

### Step 2: Commit Vercel Configuration
```bash
git add vercel.json .vercelignore
git commit -m "Add Vercel configuration"
git push origin main
```

### Step 3: Trigger Vercel Rebuild
**Option A: Manual Rebuild**
1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to "Deployments" tab
4. Click the "..." menu on latest deployment
5. Click "Redeploy"

**Option B: Push Empty Commit**
```bash
git commit --allow-empty -m "Trigger Vercel rebuild"
git push origin main
```

### Step 4: Check Vercel Build Logs
1. In Vercel dashboard → Your project → Deployments
2. Click on the latest deployment
3. Check "Build Logs"
4. Look for:
   - ✅ "Copying public files..."
   - ✅ "dist/photos/" in output
   - ❌ Any errors about missing files

### Step 5: Verify on Deployed Site
1. Open your deployed site
2. Open Browser DevTools (F12)
3. Go to "Network" tab
4. Filter by "Img"
5. Reload the page
6. Check which images return 404

### Step 6: Test Image URL Directly
Try accessing an image directly:
```
https://your-site.vercel.app/photos/Wedding/Tagaytay/Wedding%201/569190349_1398533622272571_6387164445008568536_n.jpg
```

**Note**: Spaces in folder names become `%20` in URLs

## 🐛 Common Issues & Solutions

### Issue: Photos show 404
**Check**: 
- Are photos actually in GitHub repo?
- Did Vercel rebuild after moving photos?
- Check browser console for exact URL that's failing

### Issue: Some photos load, others don't
**Check**:
- File names with special characters
- File sizes (very large files might timeout)
- Check Vercel function timeout settings

### Issue: Build succeeds but photos don't load
**Solution**:
1. Clear Vercel cache (Settings → General → Clear Build Cache)
2. Check Vercel project settings match:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

## 📝 Quick Commands

```bash
# Verify everything is committed
git status

# Check if photos are in git
git ls-files public/photos/ | wc -l

# Force rebuild
git commit --allow-empty -m "Trigger rebuild"
git push origin main
```

## 🔍 Debug Checklist
- [ ] Photos exist in `public/photos/` locally
- [ ] Photos are committed to Git
- [ ] Photos are visible on GitHub
- [ ] Vercel build completed successfully
- [ ] Checked Vercel build logs for errors
- [ ] Checked browser console for 404 errors
- [ ] Tried accessing image URL directly
- [ ] Cleared browser cache
- [ ] Cleared Vercel build cache

## Still Not Working?
Share:
1. Exact error from browser console (404 URL)
2. Vercel build log output
3. Screenshot of GitHub repo showing `public/photos/` folder

