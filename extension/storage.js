// Storage management for Custom New Tab extension

class ExtensionStorage {
  constructor() {
    this.isExtension = typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id;
    this.initializeStorage();
  }

  async initializeStorage() {
    if (this.isExtension) {
      // Migrer les données localStorage vers chrome.storage si nécessaire
      await this.migrateFromLocalStorage();
      
      // Écouter les messages du background script
      chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === 'syncData') {
          this.syncDataFromExtension(request.data);
        }
      });
    }
  }

  async migrateFromLocalStorage() {
    const localStorageData = {};
    const keysToMigrate = [
      'shortcuts_personal',
      'shortcuts_professional', 
      'activeTab',
      'shortcutCount'
    ];

    // Récupérer les données du localStorage
    keysToMigrate.forEach(key => {
      const value = localStorage.getItem(key);
      if (value) {
        try {
          localStorageData[key] = JSON.parse(value);
        } catch (e) {
          localStorageData[key] = value;
        }
      }
    });

    // Si on a des données, les sauvegarder dans chrome.storage
    if (Object.keys(localStorageData).length > 0) {
      await this.setData(localStorageData);
      console.log('Données migrées vers chrome.storage');
    }
  }

  async getData(keys = null) {
    if (this.isExtension) {
      return new Promise((resolve) => {
        chrome.storage.local.get(keys, (items) => {
          resolve(items);
        });
      });
    } else {
      // Fallback localStorage pour les tests en dehors de l'extension
      const result = {};
      const keysArray = keys ? (Array.isArray(keys) ? keys : [keys]) : Object.keys(localStorage);
      
      keysArray.forEach(key => {
        const value = localStorage.getItem(key);
        if (value !== null) {
          try {
            result[key] = JSON.parse(value);
          } catch (e) {
            result[key] = value;
          }
        }
      });
      
      return result;
    }
  }

  async setData(data) {
    if (this.isExtension) {
      return new Promise((resolve) => {
        chrome.storage.local.set(data, () => {
          resolve();
        });
      });
    } else {
      // Fallback localStorage pour les tests en dehors de l'extension
      Object.entries(data).forEach(([key, value]) => {
        localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
      });
    }
  }

  syncDataFromExtension(data) {
    // Synchroniser les données reçues du background script avec localStorage pour compatibilité
    Object.entries(data).forEach(([key, value]) => {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, stringValue);
    });
    
    // Recharger les raccourcis si nécessaire
    if (typeof reloadShortcuts === 'function') {
      reloadShortcuts();
    }
  }

  // Wrapper functions pour maintenir la compatibilité avec le code existant
  async getShortcuts(tab) {
    const data = await this.getData(`shortcuts_${tab}`);
    return data[`shortcuts_${tab}`] || {};
  }

  async saveShortcuts(tab, shortcuts) {
    await this.setData({ [`shortcuts_${tab}`]: shortcuts });
    // Maintenir la synchronisation avec localStorage
    localStorage.setItem(`shortcuts_${tab}`, JSON.stringify(shortcuts));
  }

  async getActiveTab() {
    const data = await this.getData('activeTab');
    return data.activeTab || 'personal';
  }

  async setActiveTab(tab) {
    await this.setData({ activeTab: tab });
    localStorage.setItem('activeTab', tab);
  }

  async getShortcutCount() {
    const data = await this.getData('shortcutCount');
    return data.shortcutCount || 8;
  }

  async setShortcutCount(count) {
    await this.setData({ shortcutCount: count });
    localStorage.setItem('shortcutCount', count.toString());
  }
}

// Initialiser le gestionnaire de stockage
const extensionStorage = new ExtensionStorage();
