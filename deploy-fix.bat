@echo off
echo 🚀 Deploying LIVRAISON RAPIDE to Vercel...
echo.

echo 📦 Step 1: Deploying Backend...
cd Backend
vercel --prod --yes
echo.
echo ✅ Backend deployed! Copy the URL above.
echo.

echo 📦 Step 2: Deploying Frontend...
cd ..\Frontend
vercel --prod --yes
echo.
echo ✅ Frontend deployed! Copy the URL above.
echo.

echo 🎉 Deployment complete!
echo.
echo 📋 Next steps:
echo 1. Go to Vercel Dashboard → Frontend Project
echo 2. Settings → Environment Variables
echo 3. Add: REACT_APP_API_URL = [your-backend-url]
echo 4. Redeploy frontend
echo 5. Test the "Add New" button! 🎉
echo.
echo 💡 No .env files needed - Vercel handles everything!
echo.
pause
