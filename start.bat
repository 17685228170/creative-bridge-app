@echo off
echo ==========================================
echo   Creative Bridge Startup
echo ==========================================
echo.

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo [Error] Node.js not found. Please install from https://nodejs.org/
    pause
    exit /b 1
)

echo [1/4] Node.js version:
node --version
echo.

cd /d "%~dp0"

echo [2/4] Checking dependencies...
if not exist "node_modules\next\package.json" (
    echo Installing dependencies, please wait...
    call npm install
    if errorlevel 1 (
        echo [Error] Failed to install dependencies
        pause
        exit /b 1
    )
) else (
    echo Dependencies OK
)
echo.

echo [3/4] Checking database...
if not exist "prisma\dev.db" (
    echo Initializing database...
    call npx prisma migrate dev --name init
    call npx prisma db seed
) else (
    echo Database OK
)
echo.

REM Check if built
if not exist ".next\standalone\server.js" (
    echo [4/4] Building project...
    call npm run build
    if errorlevel 1 (
        echo [Error] Build failed
        pause
        exit /b 1
    )
) else (
    echo [4/4] Build OK
)

echo.
echo ==========================================
echo   Starting server on port 3002...
echo ==========================================
echo.
echo Test accounts:
echo   Creator: creator@test.com / 123456
echo   Enterprise: enterprise@test.com / 123456
echo.
echo Press Ctrl+C to stop
echo.

set PORT=3002
node .next/standalone/server.js

pause
