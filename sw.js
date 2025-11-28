// CHANGE THIS VERSION NUMBER MANUALLY WHENEVER YOU UPDATE YOUR CODE
const CACHE_NAME = 'japi-v1.1'; 

const ASSETS = [
  './index.html',
  './manifest.json',
  'https://cdn.jsdelivr.net/gh/altOpen/Japi@main/logo.png'
];

self.addEventListener('install', (e) => {
  // Force the waiting service worker to become the active service worker.
  self.skipWaiting(); 
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// New: Activate event to clean up old caches (CRITICAL for updates)
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim(); // Take control of all clients immediately
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});
