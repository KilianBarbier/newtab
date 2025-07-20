# 📁 Guide des Groupes de Raccourcis

## Vue d'ensemble

Les **Groupes de Raccourcis** sont une nouvelle fonctionnalité qui vous permet d'organiser vos raccourcis en catégories logiques pour une meilleure navigation et organisation.

## 🚀 Fonctionnalités Principales

### ✨ Créer un Groupe
1. Cliquez sur le bouton **"Create new group"** en bas de la page
2. Saisissez un nom descriptif pour votre groupe (ex: "Outils de Travail", "Réseaux Sociaux", "Divertissement")
3. Le groupe est créé instantanément

### 📝 Ajouter des Raccourcis à un Groupe
1. **Méthode 1** : Clic droit sur un raccourci existant → "Move to Group" → Sélectionner le groupe
2. **Méthode 2** : Cliquer sur le bouton ➕ dans l'en-tête du groupe pour ajouter directement

### 🎯 Gérer les Groupes
- **Renommer** : Cliquer sur le nom du groupe pour le modifier
- **Supprimer** : Cliquer sur l'icône 🗑️ (les raccourcis sont déplacés vers "Other Shortcuts")
- **Compter** : Le nombre de raccourcis est affiché automatiquement

## 🎨 Interface Utilisateur

### En-têtes de Groupes
- **Nom du groupe** : Cliquable pour renommer
- **Compteur** : "(X shortcuts)" affiche le nombre de raccourcis
- **Bouton d'ajout** : ➕ pour ajouter rapidement un raccourci
- **Bouton de suppression** : 🗑️ pour supprimer le groupe

### Section "Other Shortcuts"
- Contient automatiquement tous les raccourcis non groupés
- Apparaît seulement s'il y a des raccourcis sans groupe

## 💾 Persistance et Synchronisation

### Stockage Local
- Les groupes sont sauvegardés séparément pour "Personal" et "Professional"
- Format de stockage : `groups_personal` et `groups_professional`

### Export/Import
- **Version 2.0** : Nouvelle structure supportant les groupes
- **Rétrocompatibilité** : Les anciens exports (v1.0) fonctionnent toujours
- Les groupes sont inclus dans les exports JSON

### Structure d'Export
```json
{
  "version": "2.0",
  "exportDate": "2025-01-01T00:00:00.000Z",
  "shortcutCount": 8,
  "personal": {
    "shortcuts": { /* raccourcis avec groupId */ },
    "groups": { /* définitions des groupes */ }
  },
  "professional": {
    "shortcuts": { /* raccourcis avec groupId */ },
    "groups": { /* définitions des groupes */ }
  }
}
```

## 🔧 Utilisation Avancée

### Exemples de Groupes
- **"Daily Tools"** : Gmail, Calendar, Drive, Slack
- **"Development"** : GitHub, VS Code, Stack Overflow, NPM
- **"Design"** : Figma, Adobe Creative Suite, Unsplash, Dribbble
- **"Social Media"** : Facebook, Twitter, Instagram, LinkedIn
- **"Entertainment"** : Netflix, YouTube, Spotify, Twitch

### Meilleures Pratiques
1. **Noms descriptifs** : Utilisez des noms clairs et concis
2. **Logique d'organisation** : Groupez par fonction ou usage
3. **Taille optimale** : 3-8 raccourcis par groupe pour une meilleure lisibilité
4. **Révision régulière** : Réorganisez selon vos besoins évolutifs

## 🎪 Animations et Effets Visuels

- **Apparition graduelle** : Les raccourcis apparaissent avec un décalage animé
- **Hover effects** : Bordures colorées au survol
- **Transitions fluides** : Animations de 0.3s pour tous les changements
- **Feedback visuel** : Notifications pour les actions importantes

## 🤝 Compatibilité

### Versions
- **v1.0** : Raccourcis de base
- **v2.0+** : Support des groupes complet

### Migration Automatique
- Les anciens raccourcis restent dans "Other Shortcuts"
- Aucune perte de données lors de la mise à jour
- Import/Export rétrocompatible

## 📱 Responsive Design

- **Desktop** : Grille complète avec en-têtes de groupes
- **Mobile** : Interface adaptée dans la sidebar modale
- **Tablette** : Optimisé pour les écrans moyens

## 🎯 Raccourcis Clavier et Navigation

- **Glisser-déposer** : Réorganisation des raccourcis
- **Clic droit** : Menu contextuel avec options de groupe
- **Touches de navigation** : Support des flèches pour les widgets

## 🔮 Futures Améliorations Possibles

- **Icônes de groupes** : Personnalisation visuelle
- **Sous-groupes** : Hiérarchie à plusieurs niveaux
- **Partage de groupes** : Export/Import sélectif
- **Templates** : Groupes pré-configurés
- **Recherche dans groupes** : Filtrage avancé

---

*Cette fonctionnalité améliore considérablement l'organisation et la productivité de votre page New Tab !* 🚀
