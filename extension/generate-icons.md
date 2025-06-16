# Génération d'icônes pour l'extension

Pour créer les icônes aux bonnes tailles, vous pouvez utiliser ce script ou un outil en ligne.

## Tailles requises

### Chrome
- icon-16.png
- icon-32.png  
- icon-48.png
- icon-128.png

### Firefox
- icon-48.png
- icon-96.png

## Script PowerShell pour redimensionner (si vous avez une icône source)

```powershell
# Placez votre icône source (ex: icon-source.png) dans le dossier media/
# Exécutez ce script depuis le dossier extension/

$sourcePath = "chrome\media\favicon.ico"
$outputDir = "chrome\media\"

# Installer ImageMagick d'abord : https://imagemagick.org/script/download.php#windows

# Générer les tailles pour Chrome
magick convert $sourcePath -resize 16x16 "${outputDir}icon-16.png"
magick convert $sourcePath -resize 32x32 "${outputDir}icon-32.png"
magick convert $sourcePath -resize 48x48 "${outputDir}icon-48.png"
magick convert $sourcePath -resize 128x128 "${outputDir}icon-128.png"

# Copier vers Firefox
Copy-Item "${outputDir}icon-48.png" "firefox\media\"
magick convert $sourcePath -resize 96x96 "firefox\media\icon-96.png"

Write-Host "Icônes générées avec succès!"
```

## Outils en ligne recommandés
- [Favicon Generator](https://favicon.io/)
- [Real Favicon Generator](https://realfavicongenerator.net/)
- [ICO Convert](https://icoconvert.com/)

## Design recommendations
- Utilisez un design simple et reconnaissable
- Évitez les détails trop fins pour les petites tailles
- Privilégiez les couleurs contrastées
- Testez la lisibilité sur fond clair et foncé
