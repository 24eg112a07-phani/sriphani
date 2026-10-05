@echo off
set "PATH=C:\Users\Dell\mingit\cmd;%PATH%"
cd /d "C:\Online-Quiz-Project"
echo ========================================================
echo Pushing Quiz Platform to https://github.com/24eg112a07-phani/sriphani
echo ========================================================
echo.
git remote set-url origin https://github.com/24eg112a07-phani/sriphani.git
git push -u origin main
echo.
if %ERRORLEVEL% EQU 0 (
    echo ========================================================
    echo SUCCESS: Project has been pushed to GitHub!
    echo View it at: https://github.com/24eg112a07-phani/sriphani
    echo ========================================================
) else (
    echo.
    echo If requested, authorize Git Credential Manager in your browser.
)
echo.
pause
