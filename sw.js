// UPDATE THIS VERSION MANUALLY TO TRIGGER UPDATES
const CACHE_NAME = 'japi-v1.2'; 

const ASSETS = [
  './index.html',
  './manifest.json',
  'https://cdn.jsdelivr.net/gh/altOpen/Japi@main/logo.png'
];

self.addEventListener('install', (e) => {
  // We removed self.skipWaiting() here so it doesn't update automatically.
  // Instead, it waits for the user to click the button.
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

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
  return self.clients.claim();
});

// NEW: This listens for the "Update Now" click from index.html
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});
