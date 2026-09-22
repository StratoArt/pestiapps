const CACHE='opt-explorer-v1';
const ASSETS=['./','./index.html','./manifest.json','./css/style.css','./js/app.js','./data/demo.json','./assets/icons/icon.svg','./assets/opt/thrips.svg','./assets/opt/spodoptera.svg','./assets/opt/plutella.svg','./assets/opt/helicoverpa.svg'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{const copy=res.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return res}).catch(()=>caches.match('./index.html')))));
