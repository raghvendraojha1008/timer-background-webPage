@echo off
echo ====================================
echo  Live Clock Wallpaper - Store Build
echo ====================================
echo.
echo Building Microsoft Store package (APPX)...
echo This may take a few minutes.
echo.
echo Make sure you've updated electron-builder.json with your:
echo  - Identity Name
echo  - Publisher
echo  - Publisher Display Name
echo.

pause

npm run electron:build:appx

echo.
echo ====================================
echo  Store Build Complete!
echo ====================================
echo.
echo Your APPX package is in: dist-electron\
echo Upload this to Microsoft Partner Center
echo.

pause
