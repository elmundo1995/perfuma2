// Service Worker para instalación PWA y Notificaciones Nativas PERFUMA2
const CACHE_NAME = 'perfuma2-v2';

self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(clients.claim());
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});

// Receptor de notificaciones nativas para pantalla de bloqueo y barra de estado
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'MOSTRAR_NOTIFICACION_SISTEMA') {
    const { titulo, opciones } = event.data;
    
    // Configuración nativa de vibración y visualización en bloqueo
    const opcionesNativas = {
      ...opciones,
      vibrate: [200, 100, 200, 100, 400],
      requireInteraction: true,
      tag: 'pedido-web',
      renotify: true
    };

    self.registration.showNotification(titulo, opcionesNativas);
    
    if (navigator.setAppBadge && event.data.cantidad) {
      navigator.setAppBadge(event.data.cantidad).catch(() => {});
    }
  }
});

// Al tocar la notificación en la pantalla de bloqueo
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes('perfuma2') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('./');
      }
    })
  );
});
