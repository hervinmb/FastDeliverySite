@echo off
echo 🚀 Starting LIVRAISON RAPIDE Application...
echo.

echo 📦 Installing Backend dependencies...
cd Backend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Backend installation failed
    pause
    exit /b 1
)

echo.
echo 📦 Installing Frontend dependencies...
cd ..\Frontend
call npm install --legacy-peer-deps
if %errorlevel% neq 0 (
    echo ❌ Frontend installation failed
    pause
    exit /b 1
)

echo.
echo 🔧 Starting Backend server...
cd ..\Backend
start "Backend Server" cmd /k "npm run dev"

echo.
echo ⏳ Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo.
echo 🎨 Starting Frontend server...
cd ..\Frontend
start "Frontend Server" cmd /k "npm start"

echo.
echo ✅ Application started successfully!
echo 🌐 Frontend: http://localhost:3000
echo 🔧 Backend: http://localhost:5000
echo.
echo 📝 Note: The app is running in TEST MODE
echo    - Login with any email/password
echo    - No Firebase connection required
echo.
pause
