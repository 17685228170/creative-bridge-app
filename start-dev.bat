@echo off
echo ==========================================
echo   Creative Bridge - Startup
echo ==========================================
echo.

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo [Error] Node.js not found. Please install from https://nodejs.org/
    pause
    exit /b 1
)

echo [1/3] Node.js version:
node --version
echo.

cd /d "%~dp0"

echo [2/3] Checking dependencies...
if not exist "node_modules\next\package.json" (
    echo Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo [Error] Failed to install dependencies
        pause
        exit /b 1
    )
)
echo.

echo [3/3] Starting development server...
echo.
echo ==========================================
echo   Server starting on http://localhost:3004
echo ==========================================
echo.
echo Test accounts:
echo   Creator: creator@test.com / 123456
echo   Enterprise: enterprise@test.com / 123456
echo.
echo Press Ctrl+C to stop
echo.

set PORT=3004
npm run dev

pause
