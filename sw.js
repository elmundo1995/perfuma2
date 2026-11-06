// Service Worker para instalación PWA PERFUMA2
const CACHE_NAME = 'perfuma2-v1';

self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(clients.claim());
});

self.addEventListener('fetch', (e) => {
  // Manejo de red directo para asegurar sincronización en tiempo real
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
