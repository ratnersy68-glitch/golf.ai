// Offline cache for Golf.ai. The build replaces __VERSION__ so every deploy refreshes the cache.
const VERSION = '__VERSION__';
const CACHE = `golfai-${VERSION}`;
const CORE = [
  './', 'index.html', 'styles.css', 'dist/game.js', 'manifest.webmanifest',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png', 'icons/icon.svg', 'icons/splash-landscape.png',
  'assets/courses/photos.json',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('golfai-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Google Fonts & other online assets: cache as they load, fall back to cache offline
  if (url.origin !== location.origin) {
    e.respondWith(caches.open(CACHE).then(c => fetch(req).then(res => { if (res.ok || res.type === 'opaque') c.put(req, res.clone()); return res; }).catch(() => c.match(req))));
    return;
  }
  // Pages: network first so updates arrive; cached copy when offline
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(res => { caches.open(CACHE).then(c => c.put('index.html', res.clone())); return res; }).catch(() => caches.match('index.html')));
    return;
  }
  // Game files: cache first, refresh in the background
  e.respondWith(caches.match(req).then(hit => {
    const net = fetch(req).then(res => { if (res.ok) caches.open(CACHE).then(c => c.put(req, res.clone())); return res; }).catch(() => hit);
    return hit || net;
  }));
});
