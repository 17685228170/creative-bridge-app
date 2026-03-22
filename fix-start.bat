@echo off
echo ==========================================
echo   Creative Bridge - Fix Version
echo ==========================================
echo.

cd /d "%~dp0"

echo Checking Node.js...
node --version
echo.

echo Installing compatible versions...
call npm install next@14.2.5 react@18.2.0 react-dom@18.2.0 --save
echo.

echo Clearing cache...
rmdir /s /q .next 2>nul
echo.

echo Starting server on port 3010...
echo.
echo Access: http://localhost:3010
echo.

set NODE_OPTIONS=--openssl-legacy-provider
npx next dev -p 3010

pause
