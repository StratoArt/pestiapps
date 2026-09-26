const CACHE='crop-expert-v0.24.0-ai';
const CORE=['./','./index.html','./manifest.json','./css/style.css','./js/app.js','./js/scan-ai.js','./js/calculators.js','./js/weather.js','./data/moa_master_2026.json','./data/emerging_actives.json','./data/opt.json','./data/image_sources.json','./data/opt_control.json','./data/eppo_links.json','./data/formulations.json','./data/pesticide_knowledge.json','./data/pesticide_database_id.json','./data/sources.json','./data/agrobiology_knowledge.json','./data/pesticide_mode_of_action_2026.json','./data/fusarium_watermelon.json','./data/hama_source_table.json','./data/seed_treatments.json','./data/extraction_manifest.json','./data/scan_analysis_guide.json','./data/crop_opt_sources_2026.json','./data/crop_growth_guidelines_2026.json','./data/crop_nutrition_guideline_2026.json','./data/crop_nutrition_crop_guidelines_2026.json','./data/crop_profiles_2026.json','./data/crop_featured_pests_2026.json','./data/visual_attribution_2026.json','./assets/icons/icon.svg','./assets/icons/icon-192.png','./assets/icons/icon-512.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET') return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin) return;
  const path=url.pathname;
  const networkFirst = event.request.mode==='navigate' || /\.(?:html|js|css|json)$/.test(path) || path.endsWith('/');
  if(networkFirst){
    event.respondWith(fetch(new Request(event.request,{cache:'no-store'})).then(response=>{
      if(response.ok){const copy=response.clone();caches.open(CACHE).then(c=>c.put(event.request,copy));}
      return response;
    }).catch(()=>caches.match(event.request).then(c=>c||caches.match('./index.html'))));
  }else{
    event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(c=>c.put(event.request,copy));}return response;})));
  }
});
