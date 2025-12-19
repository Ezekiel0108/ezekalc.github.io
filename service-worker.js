const CACHE_NAME = 'pwa-cache-v2';
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './script.js'
];

// Install event
self.addEventListener('install', (event) => {
  // Forces the waiting service worker to become the active service worker
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch event - Network First strategy
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // If valid network response, cache it and return it
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      })
      .catch(() => {
        // If network fails (offline), try to return from cache
        return caches.match(event.request);
      })
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  // Claims control of the clients immediately
  event.waitUntil(clients.claim());

  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});