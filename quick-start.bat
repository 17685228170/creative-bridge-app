@echo off
echo ==========================================
echo   Creative Bridge - Quick Start
echo ==========================================
echo.

cd /d "%~dp0"

echo Starting on port 3006...
echo.
echo Access: http://localhost:3006
echo.
echo Test Accounts:
echo   creator@test.com / 123456
echo   enterprise@test.com / 123456
echo.

npx next dev -p 3006

pause
