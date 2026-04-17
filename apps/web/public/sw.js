/**
 * ValueBite Service Worker
 * Provides basic offline shell + caching for Android PWA / TWA installability.
 */
const CACHE_NAME = 'valuebite-v1';
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(STATIC_ASSETS)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  // Don't intercept API calls — always go network
  if (url.pathname.startsWith('/api/')) return;
  // Cross-origin: pass through
  if (url.origin !== self.location.origin) return;
  // Network-first with cache fallback for navigations
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).catch(() => caches.match('/') || new Response('Offline', { status: 503 }))
    );
    return;
  }
  // Cache-first for static assets
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request).then((networkRes) => {
      if (networkRes.ok && url.pathname.match(/\.(png|jpg|jpeg|svg|css|js|woff2?)$/)) {
        const clone = networkRes.clone();
        caches.open(CACHE_NAME).then((c) => c.put(e.request, clone));
      }
      return networkRes;
    }))
  );
});
