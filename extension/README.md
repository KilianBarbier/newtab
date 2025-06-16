# Extension New Tab Pimpé

Une extension de navigateur qui remplace votre page "Nouvel onglet" par une interface moderne et personnalisable.

## Fonctionnalités

- **Raccourcis personnalisables** : Ajoutez vos sites favoris avec des icônes automatiques
- **Recherche intelligente** : Recherche rapide sur différents moteurs (Google, YouTube, GitHub, etc.)
- **Onglets séparés** : Personnel et Professionnel pour organiser vos raccourcis
- **Interface moderne** : Design avec glassmorphism et animations fluides
- **Drag & Drop** : Réorganisez vos raccourcis par glisser-déposer
- **Responsive** : Fonctionne parfaitement sur mobile et desktop

## Installation

### Chrome / Edge / Brave

1. Téléchargez le dossier `extension/chrome`
2. Ouvrez Chrome et allez dans `chrome://extensions/`
3. Activez le "Mode développeur" en haut à droite
4. Cliquez sur "Charger l'extension non empaquetée"
5. Sélectionnez le dossier `extension/chrome`
6. L'extension est maintenant installée !

### Firefox

1. Téléchargez le dossier `extension/firefox`
2. Ouvrez Firefox et allez dans `about:debugging`
3. Cliquez sur "Ce Firefox" dans la barre latérale
4. Cliquez sur "Charger un module temporaire"
5. Sélectionnez le fichier `manifest.json` dans le dossier `extension/firefox`
6. L'extension est maintenant installée !

### Publication sur les stores

Pour publier l'extension :

#### Chrome Web Store
1. Compressez le dossier `extension/chrome` en ZIP
2. Rendez-vous sur [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
3. Payez les frais d'inscription (5$ une fois)
4. Uploadez le fichier ZIP
5. Remplissez les informations requises
6. Soumettez pour révision

#### Firefox Add-ons (AMO)
1. Compressez le dossier `extension/firefox` en ZIP
2. Rendez-vous sur [Firefox Developer Hub](https://addons.mozilla.org/developers/)
3. Créez un compte développeur (gratuit)
4. Uploadez le fichier ZIP
5. Remplissez les informations requises
6. Soumettez pour révision

## Utilisation

### Ajouter un raccourci
1. Cliquez sur un emplacement vide (icône +)
2. Saisissez le titre et l'URL
3. Cliquez sur "Sauvegarder"
4. L'icône du site sera automatiquement récupérée

### Modifier/Supprimer un raccourci
1. Clic droit sur un raccourci existant
2. Choisissez "Modifier" ou "Supprimer"

### Changer d'onglet
1. Utilisez la barre latérale pour basculer entre "Personnel" et "Professionnel"
2. Chaque onglet a ses propres raccourcis

### Recherche rapide
1. Tapez dans la barre de recherche
2. Utilisez les commandes rapides avec "/" :
   - `/g terme` - Recherche Google
   - `/yt terme` - Recherche YouTube
   - `/gh terme` - Recherche GitHub
   - etc.

## Développement

### Structure des fichiers
```
extension/
├── chrome/
│   ├── manifest.json       # Manifest V3 pour Chrome
│   ├── index.html         # Page principale
│   ├── style.css          # Styles CSS
│   ├── aurora-animation.js # Animations
│   ├── aurora-svelte.js   # Animations Svelte
│   └── media/
│       └── favicon.ico    # Icône de l'extension
└── firefox/
    ├── manifest.json      # Manifest V2 pour Firefox
    └── [mêmes fichiers que Chrome]
```

### APIs utilisées
- **Chrome Storage API** : Pour sauvegarder les raccourcis de manière synchronisée
- **Chrome New Tab Override** : Pour remplacer la page nouvel onglet
- **Google Favicons API** : Pour récupérer automatiquement les icônes des sites

### Compatibilité du stockage
L'extension détecte automatiquement si elle fonctionne dans un navigateur (avec `chrome.storage`) ou en tant que webapp (avec `localStorage`) et adapte le stockage en conséquence.

## Permissions

L'extension demande uniquement la permission `storage` pour sauvegarder vos raccourcis localement.

## Support

- Chrome 88+
- Firefox 88+
- Edge 88+
- Brave (toutes versions récentes)

## Licence

Voir le fichier LICENSE dans le répertoire principal.
