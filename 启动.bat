@echo off
echo ==========================================
echo   Creative Bridge - Qi Dong Jiao Ben
echo ==========================================
echo.

cd /d "%~dp0"

echo [1/3] Jian Cha Node.js...
node --version
echo.

echo [2/3] Jian Cha Gou Jian...
if not exist ".next\BUILD_ID" (
    echo Zheng Zai Gou Jian Xiang Mu, Qing Shao Hou...
    call npm run build
    if errorlevel 1 (
        echo [Cuo Wu] Gou Jian Shi Bai
        pause
        exit /b 1
    )
) else (
    echo Gou Jian Wan Cheng
)
echo.

echo [3/3] Qi Dong Fu Wu Qi...
echo.
echo ==========================================
echo   Qi Dong Cheng Gong!
echo   Qing Fang Wen: http://localhost:3012
echo ==========================================
echo.
echo Ce Shi Zhang Hao:
echo   Chuang Zuo Zhe: creator@test.com / 123456
echo   Qi Ye: enterprise@test.com / 123456
echo.
echo An Ctrl+C Ting Zhi
echo.

set PORT=3012
npx next start -p 3012

pause
