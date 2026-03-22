@echo off
echo ==========================================
echo   Creative Bridge - Work Space Version
echo ==========================================
echo.

cd /d "C:\Users\nieka\.openclaw\workspace\creative-bridge"

echo Using workspace version (known working)...
echo.

echo [1/2] Checking build...
if not exist ".next\BUILD_ID" (
    echo Building project...
    call npm run build
)
echo.

echo [2/2] Starting server on port 3013...
echo.
echo ==========================================
echo   Access: http://localhost:3013
echo ==========================================
echo.
echo Test accounts:
echo   creator@test.com / 123456
echo   enterprise@test.com / 123456
echo.
echo Press Ctrl+C to stop
echo.

npx next start -p 3013

pause
