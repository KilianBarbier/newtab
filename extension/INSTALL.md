# Instructions d'installation - Custom New Tab Extension

## 🚀 Installation rapide

### Étape 1: Préparer l'extension
1. Assurez-vous que tous les fichiers sont dans le dossier `extension/`
2. Vérifiez que le fichier `manifest.json` est présent

### Étape 2: Installer dans Chrome/Edge

#### Pour Chrome:
1. Ouvrez Chrome
2. Allez dans `chrome://extensions/`
3. Activez le **Mode développeur** (switch en haut à droite)
4. Cliquez sur **"Charger l'extension non empaquetée"**
5. Sélectionnez le dossier `extension/`
6. ✅ L'extension est installée !

#### Pour Microsoft Edge:
1. Ouvrez Edge
2. Allez dans `edge://extensions/`
3. Activez le **Mode développeur** (switch à gauche)
4. Cliquez sur **"Charger l'extension non empaquetée"**
5. Sélectionnez le dossier `extension/`
6. ✅ L'extension est installée !

### Étape 3: Test
1. Ouvrez un nouvel onglet
2. Vous devriez voir votre page personnalisée !
3. Si ce n'est pas le cas, vérifiez les erreurs dans `chrome://extensions/`

## 🔧 Dépannage

### L'extension ne se charge pas
- Vérifiez que `manifest.json` est valide
- Regardez les erreurs dans la console des extensions
- Assurez-vous que tous les fichiers sont présents

### La page ne s'affiche pas
- Vérifiez que `index.html` existe
- Vérifiez les chemins des fichiers CSS/JS
- Regardez la console du navigateur (F12)

### Les raccourcis ne se sauvegardent pas
- L'extension a besoin de permissions de stockage
- Vérifiez que `background.js` fonctionne
- Redémarrez le navigateur si nécessaire

## 📝 Fichiers requis

Assurez-vous que votre dossier `extension/` contient :

```
extension/
├── ✅ manifest.json
├── ✅ index.html  
├── ✅ style.css
├── ✅ script.js
├── ✅ storage.js
├── ✅ background.js
├── ✅ tailwindcss_cdn_410.js
├── ✅ favicon.ico
└── ✅ media/
    └── icons/ (tous les fichiers .ico et .svg)
```

## 🎯 Prochaines étapes

Une fois installée, vous pouvez :
1. Personnaliser vos raccourcis
2. Utiliser les commandes de recherche rapide
3. Organiser vos liens par catégories
4. Profiter de l'interface moderne !

---

**Besoin d'aide ?** Consultez le README.md ou ouvrez une issue sur GitHub.
