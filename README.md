<h1 align="center">NewTab</h1>
<hr>
<p align="center">
  <img src="https://img.shields.io/badge/Projet-NewTab-white" alt="P## 🔧 Aspects techniques

### 🏗️ Architecture
Développé en **HTML, CSS et JavaScript vanilla**, sans dépendances lourdes, **NewTab** privilégie la **performance** et la **simplicité**.  
L'interface s'adapte à tous les formats d'écran et se charge instantanément à l'ouverture d'un nouvel onglet.

### 🎨 Technologies Utilisées
- **TailwindCSS** via CDN pour un styling rapide et cohérent
- **API Open-Meteo** pour les données météorologiques gratuites
- **API Nominatim** pour le géocodage des villes
- **LocalStorage** pour la persistance des données utilisateur
- **Font Patrick Hand** (Google Fonts) pour les notes manuscrites
- **SVG animations** pour les indicateurs de progression

### 🔒 Vie Privée et Performance
Les **données utilisateur restent strictement sur votre appareil**, avec une **empreinte mémoire minimale** pour ne pas ralentir votre navigateur.

- **Aucun tracking** ou analytique externe
- **APIs publiques** et gratuites pour les services météo
- **Stockage local** chiffré pour les préférences
- **Cache intelligent** pour les icônes et données

### 📁 Structure du Projet
```
newtab/
├── en/
│   ├── index.html          # Page principale (English)
│   ├── style.css           # Styles personnalisés
│   ├── sunny.png           # Icône météo soleil
│   └── cloudy.png          # Icône météo nuages
├── fr/
│   ├── index.html          # Page principale (Français)
│   └── style.css           # Styles personnalisés
├── media/
│   ├── favicon.ico         # Icône du site
│   └── img/
│       └── showcase.png    # Capture d'écran
└── README.md               # Documentation
```

---

## 🚀 Changelog v2.0.0

### ✨ Nouvelles Fonctionnalités
- **Sidebar interactive** avec largeur optimisée (320px)
- **Widget Météo** avec API Open-Meteo et géocodage
- **Widget Notes** avec système de post-it colorés et police manuscrite
- **Widget Pomodoro** avec timer, statistiques et paramètres
- **Slider de widgets** avec navigation et indicateurs
- **Séparation Personal/Professional** avec sauvegarde indépendante

### 🎨 Améliorations UI/UX
- **Design unifié** avec gradient bleu-violet sur tous les widgets
- **Navigation mobile** optimisée avec modal en bas d'écran
- **Animations fluides** et transitions CSS améliorées
- **Dropdown de moteurs de recherche** plus accessible
- **États visuels** pour le chargement et les erreurs

### 🐛 Corrections
- **Conflits JavaScript** dans les event listeners corrigés
- **Navigation entre onglets** Personal/Professional fonctionnelle
- **Dropdown de recherche** maintenant réactif
- **Layout responsive** amélioré pour mobile et desktop
- **Gestion des erreurs** API plus robuste

---

> **NewTab v2.0** est l'alliance parfaite entre **esthétique moderne**, **fonctionnalités pratiques** et **respect de votre vie privée** pour une expérience de navigation personnalisée et efficace.e" />
  <img src="https://img.shields.io/badge/Version-2.0.0-green" alt="Version Badge" />
  <img src="https://img.shields.io/badge/HTML-5-orange" alt="HTML Badge" />
  <img src="https://img.shields.io/badge/CSS-3-%231572B6" alt="CSS Badge" />
  <img src="https://img.shields.io/badge/JavaScript-yellow" alt="JS Badge" />
  <img src="https://img.shields.io/badge/Theme-Aurora-%237B5FFF?style=flat&logo=react&logoColor=white" alt="Theme Aurora Badge" />
  <img src="https://img.shields.io/badge/Widgets-Intégrés-purple" alt="Widgets Badge" />
  <img src="https://img.shields.io/badge/Licence-Propri%C3%A9t%C3%A9%20personnelle-red" alt="Badge de licence" />
</p>
<hr>

<p align="center">
  <img src="/media/img/showcase.png" alt="Screenshot de NewTab" style="max-width: 90%; border-radius: 10px; box-shadow: 0 0 15px rgba(123,95,255,0.5);" />
</p>
<hr>
<p align="center">
  📄 Ce projet est sous <a href="https://github.com/KilianBarbier/newtab?tab=License-1-ov-file">licence personnelle (FR)</a> / <a href="https://github.com/KilianBarbier/newtab?tab=License-2-ov-file">personal proprietary license (EN)</a> — toute utilisation commerciale ou redistribution est interdite sans autorisation écrite.
</p>
<hr>

## ✨ Caractéristiques principales

- **Barre de recherche centrale** avec support pour multiples moteurs de recherche
- **Système de commandes spéciales** :  
  Utilisez des commandes comme `/g` pour Google, `/yt` pour YouTube, `/gh` pour GitHub, et bien d'autres pour accéder directement à vos sites préférés  
- **Auto-correction intelligente** :  
  Détecte les commandes saisies avec le préfixe `:` et suggère la correction appropriée  
- **Raccourcis personnalisables** organisés en **grille adaptative** avec détection automatique des icônes  
- **Onglets thématiques** (Personnel/Professionnel) pour séparer vos sites avec sauvegarde indépendante
- **🆕 Sidebar interactive** avec widgets intégrés et navigation fluide
- **🆕 Système de widgets en slider** : météo, notes et pomodoro dans une interface unifiée

## 🔥 Nouveautés Version 2.0

### 📱 Sidebar Redesignée
- **Largeur optimisée** (320px) pour une meilleure visibilité
- **Navigation par onglets** entre espaces Personnel et Professionnel
- **Slider de widgets** avec navigation par flèches et indicateurs
- **Interface mobile** avec modal adaptatif

### 🌤️ Widget Météo
- **API Open-Meteo** pour des prévisions précises et gratuites
- **Géocodage Nominatim** pour la recherche de villes
- **Icônes personnalisées** pour les conditions météo (sunny.png, cloudy.png)
- **Prévisions 2 jours** avec températures min/max
- **Sauvegarde automatique** de la dernière ville recherchée
- **États visuels** : chargement, erreur, et affichage des données

### 📝 Widget Notes
- **Système de post-it** avec 4 couleurs (jaune, vert, rose, bleu)
- **Police manuscrite** Patrick Hand pour un rendu authentique
- **Taille de police dynamique** selon la longueur du texte
- **Rotation aléatoire** et bordures organiques pour un effet naturel
- **Persistance localStorage** avec horodatage
- **Actions complètes** : ajout, édition, suppression
- **État vide** avec message d'accueil

### ⏰ Widget Pomodoro
- **Timer 25/5 minutes** configurable (focus/pause)
- **Interface moderne** avec compteur géant
- **Cercle de progression** SVG animé avec couleur cyan
- **Modes de session** : Focus, Pause courte, Pause longue
- **Statistiques** : sessions du jour et total
- **Paramètres intégrés** pour personnaliser les durées
- **Messages motivationnels** personnalisés
- **Notifications** et gestion des états pause/reprise  

---

## ⚡ Commandes rapides disponibles

Tapez `/` suivi de la commande et de votre recherche pour accéder directement à :

- `/g` : Google  
- `/yt` : YouTube  
- `/gh` : GitHub  
- `/w` : Wikipedia  
- `/r` : Reddit  
- `/so` : Stack Overflow  
- `/a` : Amazon  
- `/n` : Netflix  
- `/sp` : Spotify  
- `/tw` : Twitter  
- `/ig` : Instagram  
- `/maps` : Google Maps  
- `/i` : Google Images  
- `/ddg` : DuckDuckGo  
- `/px` : Perplexity AI  

---

## 🛠️ Fonctionnalités avancées

### 🔍 Recherche Intelligente
- **Dropdown interactif** pour sélectionner le moteur de recherche
- **Détection intelligente** : tapez `:commande` pour déclencher l'assistant d'auto-correction  
- **Interface utilisateur intuitive** pour la correction et la validation des recherches  
- **Raccourcis clavier** :
  - Accepter une suggestion : `Shift + Y`  
  - Refuser une suggestion : `Shift + N`

### 🎛️ Gestion des Widgets
- **Navigation fluide** avec flèches gauche/droite
- **Indicateurs visuels** pour la position actuelle
- **Support tactile** avec gestes de balayage
- **Navigation clavier** avec les flèches directionnelles
- **Design unifié** avec gradient bleu-violet sur tous les widgets

### 📊 Raccourcis et Organisation
- **Organisation par glisser-déposer** pour réarranger facilement vos raccourcis  
- **Espaces séparés** : Personal et Professional avec sauvegarde indépendante
- **Sauvegarde locale** de toutes vos préférences — aucun serveur externe requis
- **Gestion contextuelle** : clic droit pour éditer/supprimer
- **Détection automatique** des favicons avec fallback

### 📱 Interface Responsive
- **Mode bureau** : sidebar fixe avec widgets visibles
- **Mode mobile** : navigation en bas avec modal pour accès rapide
- **Adaptation automatique** selon la taille d'écran
- **Animations fluides** et transitions CSS optimisées  

---

## 🔧 Aspects techniques

Développé en **HTML, CSS et JavaScript vanilla**, sans dépendances lourdes, **NewTab** privilégie la **performance** et la **simplicité**.  
L'interface s’adapte à tous les formats d’écran et se charge instantanément à l’ouverture d’un nouvel onglet.

Les **données utilisateur restent strictement sur votre appareil**, avec une **empreinte mémoire minimale** pour ne pas ralentir votre navigateur.

---

> **NewTab** est l’alliance parfaite entre **esthétique moderne**, **fonctionnalités pratiques** et **respect de votre vie privée** pour une expérience de navigation personnalisée et efficace.
