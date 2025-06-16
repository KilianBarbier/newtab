@echo off
echo Building New Tab Extension...

:: Create build directory
if not exist "build" mkdir build

:: Clean previous builds
if exist "build\chrome-extension.zip" del "build\chrome-extension.zip"
if exist "build\firefox-extension.zip" del "build\firefox-extension.zip"

:: Build Chrome extension
echo Building Chrome extension...
powershell Compress-Archive -Path "chrome\*" -DestinationPath "build\chrome-extension.zip" -Force

:: Build Firefox extension
echo Building Firefox extension...
powershell Compress-Archive -Path "firefox\*" -DestinationPath "build\firefox-extension.zip" -Force

echo.
echo Build completed!
echo Chrome extension: build\chrome-extension.zip
echo Firefox extension: build\firefox-extension.zip
echo.
echo Ready for upload to web stores!

pause
