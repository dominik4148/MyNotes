/* Offline režim: všechny soubory aplikace se uloží do mezipaměti. Při změně aplikace zvyš číslo verze.
   Maže a čte jen vlastní mezipaměť (zapisnik-…), jiné aplikace na stejné adrese neovlivní. */
const VER = 'zapisnik-v7';
const FILES = ['./', 'index.html', 'app.css', 'manifest.webmanifest', 'icon-180.png', 'icon-512.png',
  'js/util.js', 'js/db.js', 'js/geom.js', 'js/shapes.js', 'js/text.js', 'js/render.js', 'js/pdfio.js', 'js/home.js', 'js/editor.js', 'js/main.js',
  'lib/pdf-lib.min.js', 'lib/pdf.min.js', 'lib/pdf.worker.min.js'];
self.addEventListener('install', e => e.waitUntil(caches.open(VER).then(c => c.addAll(FILES)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VER && k.startsWith('zapisnik-')).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(caches.open(VER).then(c => c.match(e.request, { ignoreSearch: true })).then(hit => hit || fetch(e.request).then(res => {
    if (res.ok) { const copy = res.clone(); caches.open(VER).then(c => c.put(e.request, copy)); }
    return res;
  })));
});
