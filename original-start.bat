@echo off
echo ==========================================
echo   Creative Bridge - Original Version
echo ==========================================
echo.

cd /d "C:\Users\nieka\.openclaw\workspace\creative-bridge"

echo Using original workspace version...
echo.

echo Starting server on port 3011...
echo.
echo Access: http://localhost:3011
echo.
echo Test accounts:
echo   creator@test.com / 123456
echo   enterprise@test.com / 123456
echo.

npx next dev -p 3011

pause
