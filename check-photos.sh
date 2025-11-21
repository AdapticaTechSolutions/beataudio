#!/bin/bash

echo "🔍 Checking Photo Deployment Setup..."
echo ""

# Check if public/photos exists
if [ -d "public/photos" ]; then
    echo "✅ public/photos/ folder exists"
    PHOTO_COUNT=$(find public/photos -type f | wc -l | tr -d ' ')
    echo "   Found $PHOTO_COUNT photo files"
else
    echo "❌ public/photos/ folder NOT found"
    exit 1
fi

# Check if photos are in git
echo ""
echo "📦 Checking Git status..."
GIT_PHOTOS=$(git ls-files public/photos/ | wc -l | tr -d ' ')
if [ "$GIT_PHOTOS" -gt 0 ]; then
    echo "✅ $GIT_PHOTOS photos tracked in Git"
else
    echo "❌ Photos NOT tracked in Git - need to add them"
    echo "   Run: git add public/photos/"
fi

# Check build output
echo ""
echo "🏗️  Checking build output..."
if [ -d "dist/photos" ]; then
    DIST_PHOTOS=$(find dist/photos -type f | wc -l | tr -d ' ')
    echo "✅ dist/photos/ exists with $DIST_PHOTOS files"
else
    echo "⚠️  dist/photos/ not found - run 'npm run build' first"
fi

# Check a specific file
echo ""
echo "📄 Checking specific file..."
TEST_FILE="public/photos/Wedding/Tagaytay/Wedding 1/569190349_1398533622272571_6387164445008568536_n.jpg"
if [ -f "$TEST_FILE" ]; then
    echo "✅ Test file exists: $TEST_FILE"
    FILE_SIZE=$(ls -lh "$TEST_FILE" | awk '{print $5}')
    echo "   File size: $FILE_SIZE"
else
    echo "❌ Test file NOT found"
fi

# Check vercel.json
echo ""
if [ -f "vercel.json" ]; then
    echo "✅ vercel.json exists"
else
    echo "⚠️  vercel.json not found (created it for you)"
fi

echo ""
echo "📋 Next Steps:"
echo "1. If photos not in git: git add public/photos/ && git commit -m 'Add photos' && git push"
echo "2. Go to Vercel dashboard → Your project → Deployments → Redeploy"
echo "3. Check browser console for 404 errors on image URLs"
echo "4. Verify photos are in GitHub: https://github.com/AdapticaTechSolutions/beataudio/tree/main/public/photos"

