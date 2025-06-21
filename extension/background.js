// Background script for Custom New Tab extension

// Installation de l'extension
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Custom New Tab extension installed');
    
    // Initialiser les données par défaut si nécessaire
    chrome.storage.local.get(['shortcuts_personal', 'shortcuts_professional'], (result) => {
      if (!result.shortcuts_personal) {
        chrome.storage.local.set({
          'shortcuts_personal': {},
          'shortcuts_professional': {},
          'activeTab': 'personal',
          'shortcutCount': 8
        });
      }
    });
  }
});

// Synchronisation des données avec le localStorage
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && tab.url.startsWith('chrome://newtab/')) {
    // La page new tab est chargée, on peut synchroniser les données
    chrome.storage.local.get(null, (items) => {
      chrome.tabs.sendMessage(tabId, {
        action: 'syncData',
        data: items
      }).catch(() => {
        // Ignorer les erreurs si le content script n'est pas prêt
      });
    });
  }
});

// Écouter les messages de la page new tab
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'saveData') {
    chrome.storage.local.set(request.data, () => {
      sendResponse({ success: true });
    });
    return true; // Indique une réponse asynchrone
  }
  
  if (request.action === 'getData') {
    chrome.storage.local.get(request.keys || null, (items) => {
      sendResponse(items);
    });
    return true; // Indique une réponse asynchrone
  }
});
