// Service Worker pour les rappels de notes
const CACHE_NAME = 'note-reminders-v1';

// Installation du Service Worker
self.addEventListener('install', event => {
  console.log('Service Worker: Installed');
  self.skipWaiting();
});

// Activation du Service Worker
self.addEventListener('activate', event => {
  console.log('Service Worker: Activated');
  event.waitUntil(self.clients.claim());
});

// Écouter les messages du script principal
self.addEventListener('message', event => {
  const { type, data } = event.data;
  
  switch (type) {
    case 'SCHEDULE_REMINDER':
      scheduleReminder(data);
      break;
    case 'CANCEL_REMINDER':
      cancelReminder(data.noteId);
      break;
    case 'CHECK_REMINDERS':
      checkScheduledReminders();
      break;
  }
});

// Variables globales pour stocker les timers
let reminderTimers = new Map();

// Planifier un rappel
function scheduleReminder(reminderData) {
  const { noteId, noteText, schedule } = reminderData;
  
  // Annuler le rappel existant s'il y en a un
  cancelReminder(noteId);
  
  if (schedule.type === 'interval') {
    // Rappel basé sur un intervalle (comme avant)
    const intervalMs = schedule.interval * 60 * 1000;
    const timerId = setInterval(() => {
      showNotification(noteText, noteId);
    }, intervalMs);
    
    reminderTimers.set(noteId, { type: 'interval', id: timerId });
  } else if (schedule.type === 'scheduled') {
    // Rappel programmé (jours + heures)
    scheduleAdvancedReminder(noteId, noteText, schedule);
  }
}

// Planifier un rappel avancé avec jours et heures
function scheduleAdvancedReminder(noteId, noteText, schedule) {
  const { days, time, timezone } = schedule;
  
  function scheduleNext() {
    const now = new Date();
    const [hours, minutes] = time.split(':').map(Number);
    
    // Trouver le prochain jour valide
    let nextDate = new Date(now);
    let daysChecked = 0;
    
    while (daysChecked < 7) {
      const dayOfWeek = nextDate.getDay(); // 0 = Dimanche, 1 = Lundi, etc.
      
      if (days.includes(dayOfWeek)) {
        // Configurer l'heure
        nextDate.setHours(hours, minutes, 0, 0);
        
        // Si c'est aujourd'hui mais l'heure est passée, passer au jour suivant
        if (nextDate <= now) {
          nextDate.setDate(nextDate.getDate() + 1);
          daysChecked++;
          continue;
        }
        
        break;
      }
      
      nextDate.setDate(nextDate.getDate() + 1);
      daysChecked++;
    }
    
    const timeUntilReminder = nextDate.getTime() - now.getTime();
    
    if (timeUntilReminder > 0) {
      const timerId = setTimeout(() => {
        showNotification(noteText, noteId);
        // Programmer le suivant
        scheduleNext();
      }, timeUntilReminder);
      
      reminderTimers.set(noteId, { type: 'scheduled', id: timerId, nextDate });
      
      console.log(`Reminder scheduled for ${nextDate.toLocaleString()}`);
    }
  }
  
  scheduleNext();
}

// Annuler un rappel
function cancelReminder(noteId) {
  if (reminderTimers.has(noteId)) {
    const timer = reminderTimers.get(noteId);
    
    if (timer.type === 'interval') {
      clearInterval(timer.id);
    } else if (timer.type === 'scheduled') {
      clearTimeout(timer.id);
    }
    
    reminderTimers.delete(noteId);
    console.log(`Reminder cancelled for note ${noteId}`);
  }
}

// Afficher une notification
function showNotification(noteText, noteId) {
  const title = '📝 Note Reminder';
  const body = noteText.length > 100 ? noteText.substring(0, 100) + '...' : noteText;
  
  const options = {
    body: body,
    icon: '/media/favicon.ico',
    badge: '/media/favicon.ico',
    tag: `note-reminder-${noteId}`,
    requireInteraction: true,
    actions: [
      {
        action: 'view',
        title: 'View Note'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ],
    data: {
      noteId: noteId,
      noteText: noteText
    }
  };
  
  self.registration.showNotification(title, options);
}

// Gérer les clics sur les notifications
self.addEventListener('notificationclick', event => {
  const { action, data } = event;
  
  event.notification.close();
  
  if (action === 'view') {
    // Ouvrir ou focuser l'onglet de l'application
    event.waitUntil(
      self.clients.matchAll({ type: 'window' }).then(clients => {
        // Chercher un onglet existant
        for (const client of clients) {
          if (client.url.includes('index.html') || client.url.endsWith('/')) {
            return client.focus();
          }
        }
        // Ouvrir un nouvel onglet si aucun trouvé
        return self.clients.openWindow('/');
      })
    );
  }
});

// Vérifier périodiquement les rappels (au cas où)
function checkScheduledReminders() {
  console.log('Checking scheduled reminders...');
  // Cette fonction peut être utilisée pour vérifier la cohérence
}

// Écouter les changements de visibilité pour optimiser les performances
self.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    checkScheduledReminders();
  }
});
