const CACHE='crop-expert-v0.23.0';
const CORE=['./','./index.html','./manifest.json','./css/style.css','./js/app.js','./js/calculators.js','./data/moa_master_2026.json','./data/emerging_actives.json','./data/opt.json','./data/image_sources.json','./data/opt_control.json','./data/eppo_links.json','./data/formulations.json','./data/pesticide_knowledge.json','./data/pesticide_database_id.json','./data/sources.json','./data/agrobiology_knowledge.json','./data/fusarium_watermelon.json','./data/hama_source_table.json','./data/seed_treatments.json','./data/extraction_manifest.json','./assets/icons/icon.svg','./assets/icons/icon-192.png','./assets/icons/icon-512.png','./assets/opt/crop-rice.svg','./assets/opt/crop-chili.svg','./assets/opt/crop-tomato.svg','./assets/opt/crop-onion.svg','./assets/opt/crop-cabbage.svg','./assets/opt/crop-cucumber.svg','./assets/opt/crop-corn.svg','./assets/opt/crop-soy.svg','./assets/opt/crop-watermelon.svg','./assets/opt/crop-melon.svg','./assets/opt/crop-potato.svg','./assets/opt/crop-beans.svg','./assets/opt/crop-eggplant.svg','./assets/opt/crop-banana.svg','./assets/opt/crop-citrus.svg','./assets/opt/crop-coffee.svg','./assets/opt/crop-cacao.svg','./assets/opt/crop-tea.svg','./assets/opt/crop-coconut.svg','./assets/opt/crop-palm.svg','./assets/opt/crop-cassava.svg','./assets/opt/crop-peanut.svg','./data/irac_target_site_map.json','./data/scan_analysis_guide.json','./assets/opt/reference/thrips-species-hosts.png','./assets/opt/reference/thrips-life-cycle.png','./assets/opt/reference/spodoptera-exigua-life-cycle.png','./assets/opt/reference/spodoptera-exigua-larva.png','./data/crop_opt_sources_2026.json','./data/crop_growth_guidelines_2026.json','./data/crop_nutrition_guideline_2026.json','./data/crop_nutrition_crop_guidelines_2026.json'];
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
