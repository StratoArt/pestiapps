const CACHE='opt-explorer-v0.7';
const CORE=['./','./index.html','./manifest.json','./css/style.css','./js/app.js','./data/moa_master_2026.json','./data/opt.json','./data/image_sources.json','./assets/icons/icon.svg'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE))));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const url=new URL(e.request.url);
  const isPhoto=url.hostname==='commons.wikimedia.org' && url.pathname.includes('/Special:Redirect/file/');
  e.respondWith(caches.match(e.request).then(cached=>{
    if(cached)return cached;
    return fetch(e.request).then(res=>{
      if(res.ok || (isPhoto && res.type==='opaque')){
        const copy=res.clone(); caches.open(CACHE).then(c=>c.put(e.request,copy));
      }
      return res;
    }).catch(()=>caches.match('./index.html'));
  }));
});
