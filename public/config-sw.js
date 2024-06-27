const CACHE_NAME = 'next-agilts-staging-v1.8';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(['/']);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event?.request).then((response) => {
      return response || fetch(event?.request);
    })
  );
});
