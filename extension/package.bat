@echo off
echo Custom New Tab Extension - Package Script
echo ========================================

:: Créer le dossier de build
if not exist "build" mkdir build

:: Nettoyer le dossier de build
if exist "build\custom-new-tab-extension" rmdir /s /q "build\custom-new-tab-extension"
mkdir "build\custom-new-tab-extension"

:: Copier les fichiers nécessaires
echo Copying files...
copy "manifest.json" "build\custom-new-tab-extension\"
copy "index.html" "build\custom-new-tab-extension\"
copy "style.css" "build\custom-new-tab-extension\"
copy "script.js" "build\custom-new-tab-extension\"
copy "storage.js" "build\custom-new-tab-extension\"
copy "background.js" "build\custom-new-tab-extension\"
copy "tailwindcss_cdn_410.js" "build\custom-new-tab-extension\"
copy "favicon.ico" "build\custom-new-tab-extension\"
copy "README.md" "build\custom-new-tab-extension\"
copy "INSTALL.md" "build\custom-new-tab-extension\"

:: Copier le dossier media
xcopy "media" "build\custom-new-tab-extension\media" /e /i /h

echo.
echo ✅ Extension packaged successfully!
echo.
echo 📁 Files are ready in: build\custom-new-tab-extension\
echo.
echo 🚀 Installation instructions:
echo 1. Open Chrome/Edge and go to chrome://extensions/ or edge://extensions/
echo 2. Enable Developer mode
echo 3. Click "Load unpacked"
echo 4. Select the folder: build\custom-new-tab-extension\
echo.
echo 📖 Read INSTALL.md for detailed instructions
echo.
pause
