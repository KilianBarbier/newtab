# Custom New Tab Extension - Package Script (PowerShell)
Write-Host "Custom New Tab Extension - Package Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Créer le dossier de build
$buildPath = "build\custom-new-tab-extension"
if (Test-Path "build") {
    Remove-Item "build" -Recurse -Force
}
New-Item -ItemType Directory -Path $buildPath -Force | Out-Null

# Liste des fichiers à copier
$filesToCopy = @(
    "manifest.json",
    "index.html", 
    "style.css",
    "script.js",
    "storage.js",
    "background.js",
    "tailwindcss_cdn_410.js",
    "favicon.ico",
    "README.md",
    "INSTALL.md"
)

Write-Host "`nCopying files..." -ForegroundColor Yellow

# Copier les fichiers
foreach ($file in $filesToCopy) {
    if (Test-Path $file) {
        Copy-Item $file $buildPath
        Write-Host "✅ $file" -ForegroundColor Green
    } else {
        Write-Host "❌ $file (not found)" -ForegroundColor Red
    }
}

# Copier le dossier media
if (Test-Path "media") {
    Copy-Item "media" $buildPath -Recurse
    Write-Host "✅ media/ folder" -ForegroundColor Green
} else {
    Write-Host "❌ media/ folder (not found)" -ForegroundColor Red
}

Write-Host "`n✅ Extension packaged successfully!" -ForegroundColor Green
Write-Host "`n📁 Files are ready in: $buildPath" -ForegroundColor Cyan
Write-Host "`n🚀 Installation instructions:" -ForegroundColor Yellow
Write-Host "1. Open Chrome/Edge and go to chrome://extensions/ or edge://extensions/"
Write-Host "2. Enable Developer mode"  
Write-Host "3. Click 'Load unpacked'"
Write-Host "4. Select the folder: $buildPath"
Write-Host "`n📖 Read INSTALL.md for detailed instructions" -ForegroundColor Magenta

# Optionnel: ouvrir le dossier de build
$openFolder = Read-Host "`nOpen build folder? (y/n)"
if ($openFolder -eq "y" -or $openFolder -eq "Y") {
    Invoke-Item (Resolve-Path $buildPath)
}
