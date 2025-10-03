@echo off
echo Restarting LIVRAISON RAPIDE Application...
echo.

echo Stopping any running processes...
taskkill /f /im node.exe 2>nul

echo.
echo Starting Backend Test Server...
start "Backend Server" cmd /k "cd /d D:\Abroad Work\Trego\Backend && node test-server.js"

echo.
echo Waiting 3 seconds for backend to start...
timeout /t 3 /nobreak >nul

echo.
echo Starting Frontend...
start "Frontend Server" cmd /k "cd /d D:\Abroad Work\Trego\Frontend && npm start"

echo.
echo Application is starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit...
pause >nul

