/* Offline shell + notification handling. */

// Bump this whenever the shell changes shape: it drops every older cache on
// activate, so a page can never be served new markup with stale script.
const CACHE = 'homework-v8';

// Only what the app needs to run. The 512px icon is for the installer and the
// splash screen, which nobody reaches offline, so it is fetched if it is ever
// actually wanted rather than downloaded by everyone on their first visit.
const SHELL = [
  './index.html',
  './styles.css',
  './app.js',
  './manifest.webmanifest',
  './art/desk.jpg',
  './icons/favicon-64.png',
  './icons/icon-192.png',
];

// Cache each file on its own: one bad response shouldn't cost us offline support.
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => Promise.all(SHELL.map(url => c.add(url).catch(() => {}))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/**
 * Cache first, then refresh in the background.
 *
 * This used to go to the network first so that edits showed up. That cost a
 * round trip on every single file on every single launch, which on a phone is
 * the difference between the app being there and the app arriving — and it is
 * why the desk picture used to paint itself in halfway down the screen.
 *
 * Now a cached copy is served straight away and a fresh one is fetched behind
 * it for next time, so a new version is still never more than one launch away.
 * The cache name above is bumped with every release, which throws the whole
 * old set out at once rather than letting new markup meet stale script.
 */
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  if (new URL(req.url).origin !== self.location.origin) return;

  e.respondWith((async () => {
    const cached = await caches.match(req);

    const fresh = fetch(req).then((res) => {
      if (res && res.ok) {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
      }
      return res;
    }).catch(() => null);

    if (cached) return cached;                  // instant, every time after the first
    return (await fresh) || caches.match('./index.html');
  })());
});

// Tapping the daily reminder lands straight in the add-homework sheet.
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil((async () => {
    const all = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of all) {
      if ('focus' in client) {
        await client.focus();
        client.postMessage({ type: 'add-homework' });
        return;
      }
    }
    await self.clients.openWindow('./index.html?add=1');
  })());
});
