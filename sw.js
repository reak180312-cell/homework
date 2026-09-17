/* Offline shell + notification handling. */

// Bump this whenever the shell changes shape: it drops every older cache on
// activate, so a page can never be served new markup with stale script.
/* Which app this worker belongs to. It is registered as sw.js?p=<id>, so a
   second profile on the same phone gets a cache of its own rather than
   fighting the first one for the same names — and only carries its own
   bag pictures. */
const PROFILE = new URL(self.location).searchParams.get('p') || 'rea';
const CACHE = 'homework-v52-' + PROFILE;

// Only what the app needs to run. The 512px icon is for the installer and the
// splash screen, which nobody reaches offline, so it is fetched if it is ever
// actually wanted rather than downloaded by everyone on their first visit.
/* One bag each. 150KB of somebody else's school things is not worth
   downloading to never look at. */
const BAGS = {
  rea: ['./art/bag/pack.webp', './art/bag/pencil.webp', './art/bag/bottle.webp',
        './art/bag/lunch.webp', './art/bag/notebook.webp', './art/bag/books.webp',
        './art/bag/shoes.webp', './art/bag/laptop.webp', './art/bag/airpods.webp',
        './art/bag/tanach.webp'],
  yb:  ['./art/bag2/ipad.webp', './art/bag2/case.webp', './art/bag2/pen.webp',
        './art/bag2/charger.webp', './art/bag2/tanach.webp', './art/bag2/diplomacy.webp',
        './art/bag2/lit.webp', './art/bag2/eng.webp', './art/bag2/sportkit.webp',
        './art/bag2/deo.webp', './art/bag2/bottle.webp'],
};

const SHELL = [
  './index.html',
  './styles.css',
  './app.js',
  './manifest.webmanifest',
  './art/desk.jpg',
  './art/cork.webp',
  './art/wall.jpg',
  './art/shelf.jpg',
  './art/addnote.webp',
  './art/set/room.webp',
  './art/set/sprout.webp',
  './art/set/book.webp',
  './art/set/egg.webp',
  './art/set/hello.webp',
  './art/set/bell.webp',
  './art/set/bag.webp',
  './art/set/globe.webp',
  ...BAGS[PROFILE],
  './icons/favicon-64.png',
  './icons/icon-192.png',
  // The one the phone puts on the Home Screen. It is 34KB and it is the
  // first thing anybody sees of this app, so it is not left to a network
  // fetch that might not land.
  './icons/apple-touch-icon.png',
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

    const res = await fresh;
    if (res) return res;

    // Offline, and nothing cached. A page can stand in for a page — that is
    // what makes the app open at all without a network. It cannot stand in
    // for anything else: handing index.html back for a PNG gives whatever
    // asked for it a document where it wanted a picture, and the phone,
    // fetching the Home Screen icon, quietly drew a letter instead.
    if (req.mode === 'navigate' || req.destination === 'document') {
      return (await caches.match('./index.html'))
        || new Response('', { status: 504, statusText: 'Offline' });
    }
    return new Response('', { status: 504, statusText: 'Offline' });
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
