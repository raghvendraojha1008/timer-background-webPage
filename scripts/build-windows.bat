@echo off
echo ====================================
echo  Live Clock Wallpaper - Build
echo ====================================
echo.
echo Building Windows installer...
echo This may take a few minutes.
echo.

npm run electron:build:win

echo.
echo ====================================
echo  Build Complete!
echo ====================================
echo.
echo Your installer is in: dist-electron\
echo.

pause
