@echo off
echo 🔧 Setting up environment variable for Vercel...
echo.

echo First, deploy your backend and get the URL:
echo.
cd Backend
vercel --prod --yes
echo.
echo ✅ Backend deployed! Copy the URL above.
echo.

echo Now set the environment variable for frontend:
echo.
cd ..\Frontend
echo.
echo 📝 Run this command (replace YOUR_BACKEND_URL with actual URL):
echo vercel env add REACT_APP_API_URL
echo.
echo Then redeploy:
echo vercel --prod --yes
echo.
pause
