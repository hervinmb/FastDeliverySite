@echo off
echo Starting Vercel deployment process...

echo Step 1: Installing dependencies...
cd Frontend
call npm ci
if %errorlevel% neq 0 (
    echo Error: Failed to install dependencies
    exit /b 1
)

echo Step 2: Building project...
call npm run build
if %errorlevel% neq 0 (
    echo Error: Build failed
    exit /b 1
)

echo Step 3: Build completed successfully!
echo Build files are in Frontend/build/
echo You can now deploy to Vercel manually or use Vercel CLI

cd ..
echo Deployment preparation complete!
