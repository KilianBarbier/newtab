# Custom New Tab Extension

Une extension Chrome/Edge personnalisée qui remplace la page nouvel onglet par une interface moderne avec des raccourcis personnalisables et une recherche intelligente.

## Fonctionnalités

- 🔗 **Raccourcis personnalisables** : Ajoutez vos sites favoris avec glisser-déposer
- 🔍 **Recherche intelligente** : Recherche rapide sur multiple moteurs (Google, YouTube, GitHub, etc.)
- 📱 **Design responsive** : Interface adaptée mobile et desktop
- 🎨 **Interface moderne** : Design glassmorphism avec animations fluides
- 👤 **Onglets contextuels** : Séparez vos raccourcis personnels et professionnels
- 💾 **Synchronisation** : Vos données sont sauvegardées et synchronisées

## Installation

### Installation manuelle (Développement)

1. Téléchargez ou clonez ce repository
2. Ouvrez Chrome/Edge et allez dans `chrome://extensions/` ou `edge://extensions/`
3. Activez le "Mode développeur" en haut à droite
4. Cliquez sur "Charger l'extension non empaquetée"
5. Sélectionnez le dossier `extension/` de ce projet
6. L'extension est maintenant installée !

### Installation depuis le Chrome Web Store

*[À venir - extension en cours de publication]*

## Utilisation

### Raccourcis personnalisés
- Cliquez sur "Add a shortcut" pour ajouter un nouveau raccourcis
- Faites glisser les raccourcis pour les réorganiser
- Clic droit sur un raccourci pour l'éditer ou le supprimer

### Recherche intelligente
- Tapez directement dans la barre de recherche pour rechercher sur Google
- Utilisez les commandes slash pour rechercher sur d'autres sites :
  - `/yt cats` - Recherche "cats" sur YouTube
  - `/gh react` - Recherche "react" sur GitHub
  - `/w javascript` - Recherche "javascript" sur Wikipedia
  - `/r programming` - Recherche "programming" sur Reddit
  - Et bien d'autres...

### Onglets contextuels
- Utilisez les onglets "Personal" et "Professional" dans la sidebar
- Chaque onglet garde ses propres raccourcis
- Idéal pour séparer vie privée et travail

## Commandes de recherche disponibles

| Commande | Site | Exemple |
|----------|------|---------|
| `/g` | Google | `/g javascript` |
| `/yt` | YouTube | `/yt music` |
| `/gh` | GitHub | `/gh vue` |
| `/w` | Wikipedia | `/w react` |
| `/r` | Reddit | `/r programming` |
| `/so` | Stack Overflow | `/so error` |
| `/a` | Amazon | `/a laptop` |
| `/n` | Netflix | `/n stranger things` |
| `/sp` | Spotify | `/sp jazz` |
| `/tw` | Twitter | `/tw news` |
| `/ig` | Instagram | `/ig food` |
| `/maps` | Google Maps | `/maps paris` |
| `/i` | Google Images | `/i sunset` |
| `/ddg` | DuckDuckGo | `/ddg privacy` |
| `/px` | Perplexity AI | `/px ai trends` |

## Structure du projet

```
extension/
├── manifest.json          # Configuration de l'extension
├── index.html            # Page nouvel onglet
├── style.css             # Styles CSS
├── script.js             # Logique principale
├── storage.js            # Gestion du stockage
├── background.js         # Service worker
├── favicon.ico           # Icône de l'extension
└── media/
    └── icons/            # Icônes des moteurs de recherche
```

## Développement

### Technologies utilisées
- HTML5, CSS3, JavaScript ES6+
- Tailwind CSS (via CDN)
- Chrome Extension API v3
- Glassmorphism design

### Contribution
Les contributions sont les bienvenues ! N'hésitez pas à :
1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commit vos changements
4. Push vers la branche
5. Ouvrir une Pull Request

## Licence

MIT License - voir le fichier [LICENSE](../LICENSE.txt) pour plus de détails.

## Support

Si vous rencontrez des problèmes ou avez des suggestions :
- Ouvrez une issue sur GitHub
- Contactez-nous à [votre-email]

---

Profitez de votre nouvelle page d'accueil ! 🎉
