const state={committee:'IRAC',data:null,emerging:null,opt:null,imageSources:null,control:null,eppoLinks:null,formulations:null,pesticideKnowledge:null,pesticides:null,sources:null,agroKnowledge:null,fusarium:null,hamaSource:null,cropGrowth:null,cropNutritionProfiles:null,nutrition:null,nutritionFilter:'ALL',nutritionSearch:'',libraryFilter:'ALL',librarySearch:'',search:'',group:'ALL',screen:'home',type:'Hama',pestFilter:'Semua',formulationFilter:'ALL',formulationSearch:'',pesticideFilter:'ALL',pesticideSearch:'',moaView:'ai',detailRef:null,deferredPrompt:null,historyReady:false,historyLock:false,targetCategory:'nerve-muscle',scanFile:null,lensSearch:''};
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>'"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[m]));
const splitAI=s=>String(s||'').split(';').map(x=>x.trim()).filter(Boolean);

const ID_MOA={
'Acetylcholinesterase (AChE) inhibitors':'Penghambat asetilkolinesterase (AChE)','GABA-gated chloride channel blockers':'Penghambat saluran klorida berpintu GABA','Sodium channel modulators':'Modulator saluran natrium','nAChR competitive modulators':'Modulator kompetitif reseptor nAChR','nAChR allosteric modulators – Site I':'Modulator alosterik nAChR – Situs I','Glutamate-gated chloride channel allosteric modulators':'Modulator alosterik saluran klorida berpintu glutamat','Juvenile hormone receptor modulators':'Modulator reseptor hormon juvenil','Chordotonal organ TRPV channel modulators':'Modulator kanal TRPV organ kordotonal','Mite growth inhibitors affecting CHS1':'Penghambat pertumbuhan tungau yang memengaruhi CHS1','Microbial disruptors of insect midgut membranes':'Pengganggu membran usus tengah serangga oleh mikroba','Inhibitors of mitochondrial ATP synthase':'Penghambat ATP sintase mitokondria','Uncouplers of oxidative phosphorylation via disruption of proton gradient':'Pengurai fosforilasi oksidatif melalui gangguan gradien proton','nAChR channel blockers':'Penghambat kanal nAChR','Inhibitors of chitin biosynthesis affecting CHS1':'Penghambat biosintesis kitin yang memengaruhi CHS1','Inhibitors of chitin biosynthesis, type 1':'Penghambat biosintesis kitin tipe 1','Moulting disruptor, Dipteran':'Pengganggu pergantian kulit pada Diptera','Ecdysone receptor agonists':'Agonis reseptor ekdison','Octopamine receptor agonists':'Agonis reseptor oktopamin','Voltage-dependent sodium channel blockers':'Penghambat saluran natrium bergantung tegangan','Inhibitors of acetyl-CoA carboxylase':'Penghambat asetil-KoA karboksilase','Mitochondrial complex IV electron transport inhibitors':'Penghambat transpor elektron kompleks IV mitokondria','Mitochondrial complex II electron transport inhibitors':'Penghambat transpor elektron kompleks II mitokondria','Ryanodine receptor modulators':'Modulator reseptor ryanodine','Chordotonal organ nicotinamidase inhibitors':'Penghambat nikotinamidase organ kordotonal','GABA-gated chloride channel allosteric modulators':'Modulator alosterik saluran klorida berpintu GABA',
'RNA polymerase I':'RNA polimerase I','DNA/RNA synthesis (proposed)':'Sintesis DNA/RNA (diusulkan)','DNA topoisomerase type II (gyrase)':'DNA topoisomerase tipe II (girase)','dihydroorotate dehydrogenase (DHODH)':'Dihidroorotat dehidrogenase (DHODH)','tubulin polymerization':'Polimerisasi tubulin','cell division (unknown site)':'Pembelahan sel (situs belum diketahui)','actin/myosin/fimbrin function':'Fungsi aktin/miosin/fimbrin','complex II succinate dehydrogenase':'Kompleks II – suksinat dehidrogenase','complex III cytochrome bc1 Qo site':'Kompleks III sitokrom bc1 – situs Qo','complex III cytochrome bc1 Qi site':'Kompleks III sitokrom bc1 – situs Qi','uncouplers of oxidative phosphorylation':'Pengurai fosforilasi oksidatif','ATP synthase':'ATP sintase','methionine biosynthesis':'Biosintesis metionin','protein synthesis, ribosome termination':'Sintesis protein – terminasi ribosom','protein synthesis, ribosome initiation':'Sintesis protein – inisiasi ribosom','protein synthesis, ribosome elongation':'Sintesis protein – elongasi ribosom','leucyl-tRNA synthetase':'Leusil-tRNA sintetase','signal transduction, mechanism unknown':'Transduksi sinyal, mekanisme belum diketahui',
'Inhibition of Acetyl CoA Carboxylase (ACCase)':'Penghambatan asetil-KoA karboksilase (ACCase)','Inhibition of Acetolactate Synthase (ALS)':'Penghambatan asetolaktat sintase (ALS)','Inhibition of Microtubule Assembly / α-Tubulin':'Penghambatan pembentukan mikrotubulus / α-tubulin','Auxin Mimics':'Mimetik auksin','Inhibition of Photosynthesis at PS II – D1 Serine 264 binders':'Penghambatan fotosintesis PS II – pengikat D1 Serin 264','Inhibition of Photosynthesis at PS II – D1 Histidine 215 binders':'Penghambatan fotosintesis PS II – pengikat D1 Histidin 215','Inhibition of EPSPS':'Penghambatan EPSPS','Inhibition of Glutamine Synthetase (GS)':'Penghambatan glutamin sintetase (GS)','Inhibition of Phytoene Desaturase (PDS)':'Penghambatan fitoena desaturase (PDS)','Inhibition of Deoxy-D-Xylulose Phosphate Synthase (DXPS)':'Penghambatan deoksi-D-xilulosa fosfat sintase (DXPS)','Inhibition of Protoporphyrinogen Oxidase (PPO)':'Penghambatan protoporfirinogen oksidase (PPO)','Inhibition of Very Long-Chain Fatty Acid Synthesis (VLCFA)':'Penghambatan sintesis asam lemak rantai sangat panjang (VLCFA)','Inhibition of Dihydropteroate Synthase (DHPS)':'Penghambatan dihidropteroat sintase (DHPS)','Auxin Transport Inhibitors':'Penghambat transport auksin','PS I Electron Diversion':'Pengalihan elektron PSI','Microtubule Interference – Unclear Site of Action':'Gangguan mikrotubulus – situs kerja belum jelas','Inhibition of Hydroxyphenyl Pyruvate Dioxygenase (HPPD)':'Penghambatan hidroksifenil piruvat dioksigenase (HPPD)','Inhibition of Dihydroorotate Dehydrogenase (DHODH)':'Penghambatan dihidroorotat dehidrogenase (DHODH)','Inhibition of Cellulose Synthesis':'Penghambatan sintesis selulosa','Inhibition of Fatty Acid Thioesterase (FAT)':'Penghambatan fatty acid thioesterase (FAT)','Inhibition of Solanesyl Diphosphate Synthase (SDPS)':'Penghambatan solanesil difosfat sintase (SDPS)','Inhibition of Homogentisate Solanesyltransferase (HST)':'Penghambatan homogentisat solanesiltransferase (HST)','Unknown Mode of Action':'Mekanisme kerja belum diketahui'};
const moaLabel=x=>ID_MOA[x]||x;


async function load(){
  const [moa,emerging,opt,imageSources,control,eppoLinks,formulations,pesticideKnowledge,pesticides,sources,agroKnowledge,fusarium,hamaSource,cropGuidelines,targetMap,scanGuide,cropOptSources,cropGrowth,nutrition,cropNutritionProfiles]=await Promise.all([
    fetch('data/moa_master_2026.json').then(r=>r.json()),
    fetch('data/emerging_actives.json').then(r=>r.json()),
    fetch('data/opt.json').then(r=>r.json()),
    fetch('data/image_sources.json').then(r=>r.json()),
    fetch('data/opt_control.json').then(r=>r.json()),
    fetch('data/eppo_links.json').then(r=>r.json()),
    fetch('data/formulations.json').then(r=>r.json()),
    fetch('data/pesticide_knowledge.json').then(r=>r.json()),
    fetch('data/pesticide_database_id.json').then(r=>r.json()),
    fetch('data/sources.json').then(r=>r.json()),
    fetch('data/agrobiology_knowledge.json').then(r=>r.json()),
    fetch('data/fusarium_watermelon.json').then(r=>r.json()),
    fetch('data/hama_source_table.json').then(r=>r.json()),
    fetch('data/crop_guidelines.json').then(r=>r.json()),
    fetch('data/irac_target_site_map.json').then(r=>r.json()),
    fetch('data/scan_analysis_guide.json').then(r=>r.json()),
    fetch('data/crop_opt_sources_2026.json').then(r=>r.json()),
    fetch('data/crop_growth_guidelines_2026.json').then(r=>r.json()),
    fetch('data/crop_nutrition_guideline_2026.json').then(r=>r.json()),
    fetch('data/crop_nutrition_crop_guidelines_2026.json').then(r=>r.json())
  ]);
  state.data=moa; state.cropGrowth=cropGrowth; state.cropNutritionProfiles=cropNutritionProfiles; state.nutrition=nutrition; state.targetMap=targetMap; state.scanGuide=scanGuide; state.emerging=emerging; state.opt=opt; state.imageSources=imageSources; state.control=control; state.eppoLinks=eppoLinks; state.formulations=formulations; state.pesticideKnowledge=pesticideKnowledge; state.pesticides=pesticides; state.sources=sources; state.agroKnowledge=agroKnowledge; state.fusarium=fusarium; state.hamaSource=hamaSource; state.cropGuidelines=cropGuidelines; state.cropOptSources=cropOptSources;
  updateHomeStats(); renderPesticides(); renderTypes(); renderPests(); renderDiseases(); renderWeeds(); renderCrops(); renderFormulations(); renderNutrition(); renderCropGuidelines(); renderKnowledge(); renderSources(); renderLibrary(); render();
}
function normalizeText(s){return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()}
function rows(){return state.data?.records?.[state.committee]||[]}
function normalize(r){
  if(state.committee==='IRAC')return{code:r[1],name:r[2],sub:r[3],chem:r[4],ai:splitAI(r[5]),cat:r[6]};
  if(state.committee==='FRAC')return{code:r[1],name:r[2],sub:r[3],chem:r[4],ai:splitAI(r[5]),cat:r[6],risk:r[7]};
  return{code:r[1],legacy:r[2],name:r[3],chem:r[4],ai:splitAI(r[5])}
}
function groupRows(){return rows().map(normalize)}
function expandedRows(){
  const out=[];
  groupRows().forEach(g=>{
    const ais=g.ai.length?g.ai:['(Tidak ada bahan aktif tercantum)'];
    ais.forEach((ai,i)=>out.push({...g,id:`${state.committee}:${g.code}:${i}:${ai}`,active:ai}));
  });
  return out;
}
function filtered(){
  const q=state.search.toLowerCase();
  let source=state.moaView==='group'?groupRows():expandedRows();
  if(state.committee==='IRAC' && state.moaView==='ai') source=source.concat((state.emerging?.records||[]).filter(x=>x.claimed_group==='IRAC Group 28').map((x,i)=>({code:'28',name:'Ryanodine receptor modulators',sub:'Emerging / eksternal',chem:x.chemical_class,ai:[x.name],active:x.name,cat:'Bahan aktif emerging',status:'emerging',id:`IRAC:EMERGING:${i}:${x.name}`,source:x})));
  return source.filter(x=>{
    const hay=[x.code,x.legacy,x.name,x.sub,x.chem,x.cat,x.risk,x.active,...x.ai,x.source?.market_status,x.source?.targets].filter(Boolean).join(' ').toLowerCase();
    return(!q||hay.includes(q))&&(state.group==='ALL'||x.code===state.group)
  })
}
function groups(){return[...new Set(groupRows().map(x=>x.code))].filter(Boolean)}
function updateHomeStats(){
  const pests=state.opt.pests.length, diseases=state.opt.diseases.length, weeds=state.opt.weeds.length;
  $('#homeOpt').textContent=pests+diseases+weeds+'+';
  const all=['IRAC','FRAC','HRAC'].flatMap(c=>state.data?.records?.[c]||[]);
  $('#homeAI').textContent=[...new Set(all.flatMap(r=>splitAI(r[5]).map(a=>a.toLowerCase())))].length+'+';
  $('#homeFormulations').textContent=(state.formulations?.items?.length||0)+'+';
}
function render(){
  if(state.screen!=='explore')return;
  if(state.moaView==='emerging'){ renderEmerging(); return; }
  if(state.moaView==='target'){ renderTargetSite(); return; }
  $('#exploreTitle').textContent=state.committee;
  $('#exploreSub').textContent=state.committee==='IRAC'?'Insecticide · Acaricide · Nematicide':state.committee==='FRAC'?'Resistensi dan mekanisme kerja fungisida':'Mekanisme kerja herbisida';
  $('#activeCommittee').textContent=state.committee+' 2026';
  const gs=groups();
  $('#groupFilters').innerHTML='<button class="chip active" data-group="ALL">Semua</button>'+gs.map(g=>`<button class="chip" data-group="${esc(g)}">${esc(g)}</button>`).join('');
  $$('.chip').forEach(b=>b.addEventListener('click',()=>{state.group=b.dataset.group;$$('.chip').forEach(x=>x.classList.toggle('active',x===b));renderList()}));
  $$('.moa-view-tabs button').forEach(b=>b.addEventListener('click',()=>{state.moaView=b.dataset.moaView;$$('.moa-view-tabs button').forEach(x=>x.classList.toggle('active',x===b));render()}));
  renderList();
}
function renderTargetSite(){
  $('#exploreTitle').textContent='Target Site'; $('#exploreSub').textContent='Cara mudah memahami target biologis insektisida'; $('#activeCommittee').textContent='IRAC · Target Site'; $('#groupFilters').innerHTML='';
  const cats=state.targetMap?.categories||[]; const active=cats.find(c=>c.id===state.targetCategory)||cats[0]; $('#resultCount').textContent=cats.length;
  const insectSvg=`<svg class="target-insect-svg" viewBox="0 0 240 300" role="img" aria-label="Ilustrasi serangga dan target biologis"><defs><linearGradient id="tg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0b7b4b"/><stop offset="1" stop-color="#35ad76"/></linearGradient></defs><ellipse cx="120" cy="150" rx="48" ry="92" fill="url(#tg)"/><circle cx="120" cy="56" r="31" fill="#145c40"/><ellipse cx="78" cy="126" rx="45" ry="72" fill="#dff3e8"/><ellipse cx="162" cy="126" rx="45" ry="72" fill="#dff3e8"/><circle cx="110" cy="53" r="4" fill="#fff"/><circle cx="130" cy="53" r="4" fill="#fff"/><path d="M95 36 Q65 12 52 28 M145 36 Q175 12 188 28" fill="none" stroke="#145c40" stroke-width="4" stroke-linecap="round"/><path d="M86 148 Q52 142 33 124 M86 170 Q48 180 29 201 M154 148 Q188 142 207 124 M154 170 Q192 180 211 201" fill="none" stroke="#145c40" stroke-width="5" stroke-linecap="round"/><circle cx="120" cy="104" r="13" fill="#fff" stroke="#0b7b4b" stroke-width="5"/><circle cx="120" cy="153" r="18" fill="#fff" stroke="#0b7b4b" stroke-width="5"/><circle cx="120" cy="211" r="13" fill="#fff" stroke="#0b7b4b" stroke-width="5"/><text x="120" y="109" text-anchor="middle" font-size="10" font-weight="800" fill="#087443">N</text><text x="120" y="158" text-anchor="middle" font-size="10" font-weight="800" fill="#087443">E</text><text x="120" y="216" text-anchor="middle" font-size="10" font-weight="800" fill="#087443">G</text></svg>`;
  const cards=cats.map(c=>`<button class="target-cat ${c.id===active.id?'active':''}" data-target-cat="${esc(c.id)}"><span class="target-cat-icon">${esc(c.icon||'◉')}</span><span><b>${esc(c.name_id)}</b><small>${esc(c.speed)}</small></span><i>›</i></button>`).join('');
  $('#cards').innerHTML=`<div class="target-map-intro"><div><span class="eyebrow">IRAC · TARGET-SITE TAXONOMY</span><h2>Dari target biologis → efek pada OPT</h2><p>Warna kategori membantu memahami bagian/fungsi biologis yang dipengaruhi. Untuk rotasi resistensi, tetap gunakan nomor kelompok MoA.</p></div></div><div class="target-visual"><div class="target-visual-art">${insectSvg}<span class="target-label label-head">Saraf & otot</span><span class="target-label label-mid">Usus tengah</span><span class="target-label label-body">Pertumbuhan</span><span class="target-label label-power">Respirasi</span></div><div class="target-detail"><div class="target-detail-badge">${esc(active.icon||'◉')} ${esc(active.name_id)}</div><h3>${esc(active.short)}</h3><div class="target-analogy"><b>Gampangnya:</b> ${esc(active.analogy)}</div><div class="target-effect"><b>Efek yang biasanya terlihat:</b><p>${esc(active.effect)}</p></div><div class="target-groups"><b>Kelompok MoA:</b><div>${(active.groups||[]).map(g=>`<span>${esc(g)}</span>`).join('')}</div></div></div></div><div class="target-cats">${cards}</div><div class="target-footer-note"><b>Catatan penting:</b> kategori fisiologis ini adalah alat bantu memahami target, bukan dasar rotasi. IRAC menyatakan manajemen resistensi harus didasarkan pada nomor kelompok MoA.</div>`;
  $$('.target-cat').forEach(b=>b.addEventListener('click',()=>{state.targetCategory=b.dataset.targetCat;renderTargetSite()}));
}
function renderEmerging(){
  $('#exploreTitle').textContent='Emerging';
  $('#exploreSub').textContent='Bahan aktif baru · pipeline · pra-klasifikasi';
  $('#activeCommittee').textContent='Emerging / Pipeline';
  $('#groupFilters').innerHTML='';
  const q=state.search.toLowerCase();
  const list=(state.emerging?.records||[]).filter(x=>!q || [x.name,x.type,x.chemical_class,x.claimed_moa,x.claimed_group,x.market_status,x.targets].join(' ').toLowerCase().includes(q));
  $('#resultCount').textContent=list.length;
  $('#cards').innerHTML=list.map((x,i)=>`<button class="moa-card emerging-card" data-i="${i}">
    <div class="code"><strong>NEW</strong><small>${esc(x.type)}</small></div>
    <div class="moa-main"><h3>${esc(x.name)}</h3><p>${esc(x.claimed_moa)}</p><div class="ai-row"><span>${esc(x.claimed_group)}</span><span>${esc(x.chemical_class)}</span></div></div><span class="arrow">›</span>
  </button>`).join('')||'<div class="empty">Tidak ada data emerging yang cocok.</div>';
  $$('.emerging-card').forEach(b=>b.addEventListener('click',()=>openEmergingDetail(list[+b.dataset.i])));
}
function openEmergingDetail(x){
  state.detailRef={kind:'emerging',id:x.name};
  if(state.historyReady && !state.historyLock) history.pushState({...navState(),detail:true,detailRef:state.detailRef},'',location.href);
  $('#detail').innerHTML=`<div class="detail-backdrop" id="detailBackdrop"></div><aside class="detail-sheet">
    <button class="close" id="closeDetail">×</button><div class="detail-code">EMERGING · ${esc(x.type)}</div>
    <h2>${esc(x.name)}</h2><p class="muted">${esc(x.chemical_class)}</p>
    <div class="detail-grid"><div><label>MoA diklaim</label><strong>${esc(x.claimed_moa)}</strong></div><div><label>Kelompok</label><strong>${esc(x.claimed_group)}</strong></div><div><label>Status</label><strong>${esc(x.market_status)}</strong></div><div><label>OPT/sasaran</label><strong>${esc(x.targets)}</strong></div></div>
    <div class="source-box"><strong>Catatan database</strong><p>${esc(x.notes)}</p><p><a href="${esc(x.url)}" target="_blank" rel="noopener">Buka sumber</a></p></div>
    <p class="source-note">Ini adalah lapisan emerging/pipeline dan bukan pengganti klasifikasi resmi IRAC/FRAC/HRAC atau bukti registrasi Indonesia. Status lokal harus diverifikasi pada registri dan label terbaru.</p>
  </aside>`;
  $('#detailBackdrop').addEventListener('click',closeDetail);$('#closeDetail').addEventListener('click',closeDetail); $$('.pesticide-link-card').forEach(b=>b.addEventListener('click',()=>openPesticideDetail(pesticideRecords().find(v=>v.id===b.dataset.pesticideId))));
}
function renderList(){
  const list=filtered();
  $('#resultCount').textContent=list.length;
  $('#cards').innerHTML=list.map((x,i)=>`<button class="moa-card" data-i="${i}">
    <div class="code">${esc(state.committee)}<strong>${esc(x.code)}</strong>${x.legacy?`<small>Legacy ${esc(x.legacy)}</small>`:''}</div>
    <div class="moa-main"><h3>${esc(state.moaView==='ai' ? x.active : x.name)}</h3><p>${esc(moaLabel(x.name))}</p><div class="ai-row">${state.moaView==='ai'?`<span>${esc(x.chem||x.sub||'')}</span>`:x.ai.slice(0,4).map(a=>`<span>${esc(a)}</span>`).join('')}${state.moaView==='group'&&x.ai.length>4?`<span>+${x.ai.length-4}</span>`:''}</div></div><span class="arrow">›</span>
  </button>`).join('')||'<div class="empty">Tidak ada data yang cocok.</div>';
  $$('.moa-card').forEach(b=>b.addEventListener('click',()=>openDetail(list[+b.dataset.i])));
}
function normalizeAIName(s){
  let x=String(s||'').toLowerCase().trim();
  x=x.replace(/\b\d+(?:[.,]\d+)?\s*(?:g\/l|g\/kg|%)\b/gi,'').replace(/\s+/g,' ').trim();
  const a={'tetraniliprol':'tetraniliprole','spirotetramat':'spirotetramat','propineb':'propineb','beta siflutrin':'beta-cyfluthrin','deltametrin':'deltamethrin','imidakloprid':'imidacloprid','klorantraniliprol':'chlorantraniliprole'};
  return a[x]||x;
}
function productsForAI(ai){
  const q=normalizeAIName(ai); return (state.pesticides?.records||[]).filter(p=>String(p['Bahan Aktif']||'').split(';').some(v=>normalizeAIName(v)===q));
}
function productBlockForAI(ai){
  const ps=productsForAI(ai); if(!ps.length)return '';
  return `<h3>Contoh produk dalam database Indonesia</h3><div class="ai-control-list">${ps.slice(0,16).map(p=>`<button class="ai-control-card pesticide-link-card" data-pesticide-id="${esc(p.id)}"><div class="ai-control-head"><strong>${esc(p['Nama Merk'])}</strong><span>${esc(p['Kategori']||'')}</span></div><div class="ai-control-meta">${esc(p['Bahan Aktif']||'')} · ${esc(p['Formulasi']||'')}</div><p>Sasaran dataset: ${esc(p['Sasaran Hama/Penyakit/Gulma']||'—')}</p></button>`).join('')}</div>`;
}
function openDetail(x){
  state.detailRef={kind:'moa',id:x.id||x.code};
  if(state.historyReady && !state.historyLock) history.pushState({...navState(),detail:true,detailRef:state.detailRef},'',location.href);
  $('#detail').innerHTML=`<div class="detail-backdrop" id="detailBackdrop"></div><aside class="detail-sheet">
    <button class="close" id="closeDetail">×</button><div class="detail-code">${esc(state.committee)} · ${esc(x.code)}${x.legacy?` · Legacy ${esc(x.legacy)}`:''}</div>
    <h2>${esc(state.moaView==='ai' ? x.active : moaLabel(x.name))}</h2>${x.sub?`<p class="muted">${esc(x.sub)}</p>`:''}
    <div class="detail-grid"><div><label>Kelompok MoA</label><strong>${esc(x.code)}</strong></div><div><label>Mode / target</label><strong>${esc(moaLabel(x.name))}</strong></div><div><label>Kelas kimia</label><strong>${esc(x.chem||'—')}</strong></div>${x.cat?`<div><label>Kategori</label><strong>${esc(x.cat)}</strong></div>`:''}${x.risk?`<div><label>Resistance risk</label><strong>${esc(x.risk)}</strong></div>`:''}</div>
    <h3>Bahan aktif</h3><div class="ai-list">${(state.moaView==='ai'?[x.active]:x.ai).map(a=>`<span>${esc(a)}</span>`).join('')}</div>
    ${(state.moaView==='ai'&&x.active)?productBlockForAI(x.active):''}
    <p class="source-note">Master ${esc(state.committee)} mengikuti snapshot resmi 2026 yang dimuat di aplikasi. Contoh produk berasal dari database produk Indonesia pengguna dan bukan bukti registrasi/label. Selalu cek sumber resmi terbaru dan registrasi lokal.</p>
  </aside>`;
  $('#detailBackdrop').addEventListener('click',closeDetail);$('#closeDetail').addEventListener('click',closeDetail); $$('.pesticide-link-card').forEach(b=>b.addEventListener('click',()=>openPesticideDetail(pesticideRecords().find(v=>v.id===b.dataset.pesticideId))));
}
function closeDetail(opts={}){
  const hadDetail=!!$('#detail').innerHTML.trim();
  $('#detail').innerHTML='';
  state.detailRef=null;
  if(hadDetail && !opts.fromHistory && state.historyReady && !state.historyLock) history.back();
}
function navState(){return {__optExplorer:true,screen:state.screen,committee:state.committee,type:state.type,pestFilter:state.pestFilter,detail:false,eppo:false,detailRef:null};}
function pushNav(screen){
  if(!state.historyReady || state.historyLock) return;
  if(state.screen===screen) return;
  history.pushState({...navState(),screen},'',location.href);
}
function initHistory(){
  const current=history.state;
  if(!current || current.__optExplorer!==true){
    history.replaceState({...navState(),screen:'home'},'',location.href);
  }else{
    state.screen=current.screen||'home';
  }
  state.historyReady=true;
}
function handlePopState(e){
  const s=e.state;
  state.historyLock=true;
  const eppoOpen=document.getElementById('eppoViewer')?.classList.contains('show');
  if(eppoOpen) closeEppoViewer({fromHistory:true});
  if(s && s.__optExplorer){
    state.committee=s.committee||'IRAC';
    state.type=s.type||'Hama';
    state.pestFilter=s.pestFilter||'Semua';
    state.screen=s.screen||'home';
    state.detailRef=s.detailRef||null;
    showScreen(state.screen,{history:false});
    $('#detail').innerHTML='';
    if(state.detailRef){
      if(state.detailRef.kind==='formulation') openFormulationDetail(state.formulations.items.find(x=>x.code===state.detailRef.id));
      else if(state.detailRef.kind==='moa'){ const x=filtered().find(x=>x.id===state.detailRef.id||x.code===state.detailRef.id); if(x) openDetail(x); }
      else if(state.detailRef.kind==='opt'){ const pool=[...state.opt.pests,...state.opt.diseases,...state.opt.weeds]; const x=pool.find(x=>x.id===state.detailRef.id); if(x) openOptDetail(x,state.detailRef.type); }
      else if(state.detailRef.kind==='crop'){ const x=state.opt.crops.find(x=>x.id===state.detailRef.id); if(x) openCropDetail(x); }
      else if(state.detailRef.kind==='crop-opt'){ openCropOptRef(`${state.detailRef.type}|${state.detailRef.id||''}|${state.detailRef.scientific||''}|${state.detailRef.common||''}`); }
      else if(state.detailRef.kind==='library'){ const x=libraryItemById(state.detailRef.id); if(x) openLibraryDetail(x); } else if(state.detailRef.kind==='pesticide'){ const x=state.pesticides?.records?.find(x=>x.id===state.detailRef.id); if(x) openPesticideDetail(x); }
    }
  }else{
    history.pushState(navState(),'',location.href);
    state.detailRef=null;
    $('#detail').innerHTML='';
    showScreen('home',{history:false});
  }
  state.historyLock=false;
}
window.addEventListener('popstate',handlePopState);

function photoBlock(x){
  const imgs=(x.images||[]).filter(img=>img && (img.local_path||img.remote_url));
  if(!imgs.length) return '';
  return `<section class="media-gallery"><div class="media-gallery-head"><div><span class="eyebrow">VISUAL REFERENSI</span><h3>Foto & ilustrasi OPT</h3></div><span>${imgs.length} aset</span></div><div class="media-gallery-grid">${imgs.map((img,i)=>{
    const src=img.local_path || img.remote_url;
    const label=img.image_type==='lifecycle'?'Siklus hidup':img.image_type==='species_reference'?'Tabel spesies / inang':img.image_type==='organism'?'Foto organisme':'Referensi visual';
    const link=img.source_url?`<a href="${esc(img.source_url)}" target="_blank" rel="noopener">Sumber ↗</a>`:'';
    return `<article class="media-card"><div class="media-image"><img src="${esc(src)}" alt="${esc(label)} ${esc(x.name)}" loading="lazy" onerror="this.closest('.media-card').classList.add('media-error')"><div class="media-fallback"><img src="assets/opt/${esc(x.icon)}" alt=""><span>Visual tidak tersedia offline</span></div></div><div class="media-caption"><strong>${esc(label)}</strong><small>${esc(img.notes||img.attribution||'Referensi visual')}</small>${link}</div></article>`;
  }).join('')}</div></section>`;
}
function photoThumb(x){
  const img=(x.images||[])[0];
  if(!img) return `<img src="assets/opt/${esc(x.icon)}" alt="">`;
  const src=img.local_path || img.remote_url;
  return `<div class="thumb-photo"><img src="${esc(src)}" alt="" loading="lazy" onerror="this.parentElement.classList.add('photo-error')"><div class="thumb-fallback"><img src="assets/opt/${esc(x.icon)}" alt=""></div></div>`;
}

function renderTypes(){
  const type=state.type;
  const source=type==='Hama'?state.opt.categories: type==='Penyakit'?state.opt.diseases:state.opt.weeds;
  if(type==='Hama'){
    $('#typeGrid').innerHTML=source.map(x=>`<button class="type-card" data-cat="${esc(x.name)}"><img src="assets/opt/${esc(x.icon)}"><strong>${esc(x.name)}</strong><small>${esc(x.label)}</small><i>›</i></button>`).join('');
    $$('.type-card').forEach(b=>b.addEventListener('click',()=>{state.pestFilter=b.dataset.cat;showScreen('pests');renderPests()}));
  }else{
    $('#typeGrid').innerHTML=source.map(x=>`<button class="type-card" data-go-list="${esc(x.id)}"><img src="assets/opt/${esc(x.icon)}"><strong>${esc(x.name)}</strong><small>${esc(x.common)}</small><i>›</i></button>`).join('');
    $$('.type-card').forEach(b=>b.addEventListener('click',()=>openOptDetail(source.find(x=>x.id===b.dataset.goList),type)));
  }
}
function renderPests(){
  let list=state.opt.pests;
  if(state.pestFilter && state.pestFilter!=='Semua' && state.pestFilter!=='Hama') list=list.filter(x=>x.category===state.pestFilter);
  $('#pestList').innerHTML=list.map((x,i)=>`<button class="opt-card" data-id="${esc(x.id)}">${photoThumb(x)}<div class="opt-main"><h3>${esc(x.name)}</h3><p>${esc(x.common)}</p><small>${esc(x.category)} · ${esc(x.family)}</small></div><span class="arrow">›</span></button>`).join('');
  $$('#pestList .opt-card').forEach(b=>b.addEventListener('click',()=>openOptDetail(state.opt.pests.find(x=>x.id===b.dataset.id),'Hama')));
  $$('.pest-tabs button').forEach(b=>b.classList.toggle('active',b.dataset.pestFilter===state.pestFilter));
}
function renderDiseases(){
  $('#diseaseList').innerHTML=state.opt.diseases.map(x=>`<button class="opt-card" data-id="${esc(x.id)}">${photoThumb(x)}<div class="opt-main"><h3>${esc(x.name)}</h3><p>${esc(x.common)}</p><small>${esc(x.category)}</small></div><span class="arrow">›</span></button>`).join('');
  $$('#diseaseList .opt-card').forEach(b=>b.addEventListener('click',()=>openOptDetail(state.opt.diseases.find(x=>x.id===b.dataset.id),'Penyakit')));
}
function renderWeeds(){
  $('#weedList').innerHTML=state.opt.weeds.map(x=>`<button class="opt-card" data-id="${esc(x.id)}">${photoThumb(x)}<div class="opt-main"><h3>${esc(x.name)}</h3><p>${esc(x.common)}</p><small>${esc(x.category)}</small></div><span class="arrow">›</span></button>`).join('');
  $$('#weedList .opt-card').forEach(b=>b.addEventListener('click',()=>openOptDetail(state.opt.weeds.find(x=>x.id===b.dataset.id),'Gulma')));
}
function renderCrops(){
  $('#cropGrid').innerHTML=state.opt.crops.map(x=>`<button class="crop-card" data-id="${esc(x.id)}"><img src="assets/opt/${esc(x.icon)}"><strong>${esc(x.name)}</strong><small>${esc(x.latin)}</small></button>`).join('');
  $$('.crop-card').forEach(b=>b.addEventListener('click',()=>openCropDetail(state.opt.crops.find(x=>x.id===b.dataset.id))));
}

function formulationVisual(x){
  const mode=x.visual||'suspension';
  const common=`<rect x="12" y="12" width="216" height="126" rx="18" fill="none" stroke="currentColor" stroke-opacity=".18"/>`;
  if(mode==='solution') return `<svg class="form-visual" viewBox="0 0 240 150" role="img" aria-label="Ilustrasi larutan"><defs><linearGradient id="sol" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#bfe8cf"/><stop offset="1" stop-color="#65b889"/></linearGradient></defs>${common}<path d="M55 45h130v66a12 12 0 0 1-12 12H67a12 12 0 0 1-12-12V45Z" fill="url(#sol)" opacity=".72"/><path d="M55 45h130" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><g fill="#fff" opacity=".7"><circle cx="82" cy="77" r="4"/><circle cx="112" cy="92" r="3"/><circle cx="145" cy="72" r="4"/><circle cx="164" cy="96" r="3"/></g><text x="120" y="31" text-anchor="middle" font-size="10" fill="currentColor" font-weight="700">SOLUTION</text></svg>`;
  if(mode==='granule') return `<svg class="form-visual" viewBox="0 0 240 150" role="img" aria-label="Ilustrasi granul">${common}<path d="M35 105c40-16 90-17 170 0" fill="none" stroke="currentColor" stroke-opacity=".2" stroke-width="3"/><g fill="#7fb58f">${[[55,78],[75,95],[96,76],[118,96],[139,80],[160,100],[181,76]].map(([cx,cy])=>`<circle cx="${cx}" cy="${cy}" r="9"/>`).join('')}</g><text x="120" y="38" text-anchor="middle" font-size="10" fill="currentColor" font-weight="700">GRANULE</text></svg>`;
  if(mode==='tablet') return `<svg class="form-visual" viewBox="0 0 240 150" role="img" aria-label="Ilustrasi tablet">${common}<g transform="translate(70 42)"><rect width="100" height="62" rx="20" fill="#d6efe0" stroke="currentColor" stroke-opacity=".25"/><path d="M50 0v62" stroke="currentColor" stroke-opacity=".18" stroke-width="3"/><circle cx="25" cy="31" r="7" fill="#7fbf99"/><circle cx="75" cy="31" r="7" fill="#7fbf99"/></g><text x="120" y="127" text-anchor="middle" font-size="10" fill="currentColor" font-weight="700">TABLET / DOSING UNIT</text></svg>`;
  if(mode==='emulsion' || mode==='microemulsion'){
    const micro=mode==='microemulsion';
    const r=micro?4:9;
    const label=micro?'MICROEMULSION':'EMULSION';
    const dots=[[66,68],[98,88],[133,62],[166,91],[185,68],[117,108]];
    return `<svg class="form-visual" viewBox="0 0 240 150" role="img" aria-label="Ilustrasi ${label.toLowerCase()}">${common}<rect x="28" y="42" width="184" height="78" rx="14" fill="#e7f4ec"/><g fill="#73b88f" stroke="#3c7b5c" stroke-opacity=".28">${dots.map(([cx,cy])=>`<circle cx="${cx}" cy="${cy}" r="${r}"/>`).join('')}</g><g fill="none" stroke="#fff" stroke-width="2" opacity=".9">${dots.slice(0,4).map(([cx,cy])=>`<circle cx="${cx}" cy="${cy}" r="${r+3}"/>`).join('')}</g><text x="120" y="31" text-anchor="middle" font-size="10" fill="currentColor" font-weight="700">${label}</text></svg>`;
  }
  return `<svg class="form-visual" viewBox="0 0 240 150" role="img" aria-label="Ilustrasi suspensi">${common}<rect x="28" y="42" width="184" height="78" rx="14" fill="#edf5f0"/><g fill="#6fae87">${[[55,63],[88,83],[118,60],[151,92],[185,68],[72,105],[139,73],[175,103]].map(([cx,cy])=>`<circle cx="${cx}" cy="${cy}" r="5"/>`).join('')}</g><path d="M42 111c42 5 115 4 156 0" stroke="#4f8067" stroke-opacity=".25" stroke-width="3"/><text x="120" y="31" text-anchor="middle" font-size="10" fill="currentColor" font-weight="700">SUSPENSION</text></svg>`;
}
function renderFormulations(){
  if(!state.formulations || !$('#formulationList')) return;
  $('#bioLosses').innerHTML=state.formulations.bioavailability.losses.map(x=>`<span>${esc(x)}</span>`).join('');
  const q=state.formulationSearch.toLowerCase();
  const list=state.formulations.items.filter(x=>{
    const cat=state.formulationFilter;
    const categoryMatch=cat==='ALL'||(cat==='Dry / solid'&&x.category==='Dry / solid')||(cat==='Liquid'&&x.category.startsWith('Liquid'))||(cat==='Emulsion'&&x.system.toLowerCase().includes('emulsion'));
    const hay=[x.code,x.name,x.category,x.system,x.advantages.join(' '),x.disadvantages.join(' ')].join(' ').toLowerCase();
    return categoryMatch&&(!q||hay.includes(q));
  });
  $('#formulationList').innerHTML=list.map(x=>`<button class="formulation-card" data-form-id="${esc(x.code)}">${formulationVisual(x)}<div class="form-code">${esc(x.code)}</div><div class="form-main"><h3>${esc(x.name)}</h3><small>${esc(x.category)} · ${esc(x.system)}</small><div class="form-tags"><span>${esc(x.pages==='3'?'Page 3':`Pages ${x.pages}`)}</span>${x.droplet?`<span>${esc(x.droplet)}</span>`:''}</div></div><span class="arrow">›</span></button>`).join('')||'<div class="empty">Tidak ada formulasi yang cocok.</div>';
  $$('#formulationList .formulation-card').forEach(b=>b.addEventListener('click',()=>openFormulationDetail(state.formulations.items.find(x=>x.code===b.dataset.formId))));
  $$('.formulation-tabs button').forEach(b=>b.classList.toggle('active',b.dataset.formFilter===state.formulationFilter));
}
function openFormulationDetail(x){
  if(!x) return;
  state.detailRef={kind:'formulation',id:x.code};
  if(state.historyReady&&!state.historyLock) history.pushState({...navState(),detail:true,detailRef:state.detailRef},'',location.href);
  $('#detail').innerHTML=`<div class="detail-backdrop" id="detailBackdrop"></div><aside class="detail-sheet formulation-detail"><button class="close" id="closeDetail">×</button><div class="detail-code">FORMULATION · ${esc(x.code)}</div>${formulationVisual(x)}<h2>${esc(x.name)}</h2><p class="muted">${esc(x.category)} · ${esc(x.system)}</p><div class="detail-grid"><div><label>Kode</label><strong>${esc(x.code)}</strong></div><div><label>Perilaku</label><strong>${esc(x.system)}</strong></div><div><label>Halaman sumber</label><strong>${esc(x.pages)}</strong></div>${x.droplet?`<div><label>Ukuran droplet</label><strong>${esc(x.droplet)}</strong></div>`:''}</div><h3>Keunggulan yang disebut sumber</h3><div class="source-box"><ul>${x.advantages.map(a=>`<li>${esc(a)}</li>`).join('')}</ul></div><h3>Keterbatasan yang disebut sumber</h3><div class="source-box warn"><ul>${x.disadvantages.map(a=>`<li>${esc(a)}</li>`).join('')}</ul></div><h3>Apa yang terjadi saat pencampuran?</h3><p class="detail-copy">${esc(x.mixing)}</p><div class="source-note">Sumber: Agrobiology of Agrochemical Formulations I - Essentials · Formulation Types, halaman ${esc(x.pages)}. Karakteristik di atas adalah ekstraksi materi sumber.</div></aside>`;
  $('#detailBackdrop').addEventListener('click',closeDetail);$('#closeDetail').addEventListener('click',closeDetail);
  $$('.pesticide-link-card').forEach(b=>b.addEventListener('click',()=>openPesticideDetail(state.pesticides.records.find(v=>v.id===b.dataset.pesticideId))));
}
function libraryItems(){
  const items=[];
  const a=state.agroKnowledge?.sections||[];
  a.forEach(sec=>items.push({id:`agro:${sec.id}`,kind:sec.id,title:sec.title,icon:sec.icon,source_id:sec.source_id,pages:sec.pages,summary:sec.intro||sec.items?.[0]?.summary||sec.items?.[0]?.role||'' ,data:sec}));
  if(state.fusarium) items.push({id:'fusarium:watermelon',kind:'fusarium',title:state.fusarium.title,icon:'🍉',source_id:state.fusarium.source_id,pages:state.fusarium.pages,summary:'FON, races, gejala, kondisi pendukung dan manajemen terpadu layu Fusarium pada semangka.',data:state.fusarium});
  return items;
}
function libraryItemById(id){return libraryItems().find(x=>x.id===id)}
function libraryCategory(item){
  if(item.kind==='adjuvants'||item.kind==='adjuvant-behavior')return 'adjuvant';
  if(item.kind==='spray-quality')return 'spray-quality';
  if(item.kind==='insecticide-delivery'||item.kind==='insecticide-targeting'||item.kind==='insecticide-mechanisms')return 'insecticide';
  if(item.kind==='fungicide-mechanisms'||item.kind==='herbicide-pathways')return 'mechanism';
  if(item.kind==='fusarium')return 'fusarium';
  if(item.kind==='formulation')return 'formulation';
  return 'mechanism';
}
function renderLibrary(){
  if(!state.agroKnowledge||!$('#libraryList'))return;
  const q=state.librarySearch.toLowerCase();
  const items=libraryItems().filter(x=>{
    const cat=libraryCategory(x);
    const hay=[x.title,x.summary,x.pages,x.data?.intro,JSON.stringify(x.data?.items||[]),JSON.stringify(x.data?.examples||[])].join(' ').toLowerCase();
    return (state.libraryFilter==='ALL'||cat===state.libraryFilter)&&(!q||hay.includes(q));
  });
  $('#libraryList').innerHTML=items.map(x=>`<button class="library-card" data-library-id="${esc(x.id)}"><div class="library-icon">${esc(x.icon)}</div><div class="library-main"><span>${esc(libraryCategory(x).replace('spray-quality','SPRAY QUALITY'))}</span><h3>${esc(x.title)}</h3><p>${esc(x.summary)}</p><small>${esc(x.source_id)} · halaman ${esc(x.pages)}</small></div><b>›</b></button>`).join('')||'<div class="empty">Tidak ada materi yang cocok.</div>';
  $$('.library-card').forEach(b=>b.addEventListener('click',()=>openLibraryDetail(libraryItemById(b.dataset.libraryId))));
  $$('.library-tabs button').forEach(b=>b.classList.toggle('active',b.dataset.libraryFilter===state.libraryFilter));
  if(state.hamaSource&&$('#hamaSourceCard')){
    $('#hamaSourceCard').innerHTML=`<strong>📋 Tabel Hama Indonesia — sumber historis</strong><p>${esc(state.hamaSource.record_count)} baris berhasil diekstrak dari PDF. Mencakup tanaman, hama/penyakit, produk dan klasifikasi pestisida sebagaimana tertulis pada sumber. Data ini <b>bukan</b> database registrasi terkini.</p><div class="library-stat-row"><span><b>${esc(state.hamaSource.crop_names_source.length)}</b> nama tanaman sumber</span><span><b>${esc(state.hamaSource.products.length)}</b> nama produk</span><span><b>${esc(state.hamaSource.classifications.length)}</b> klasifikasi</span></div>`;
  }
}
function openLibraryDetail(x){
  if(!x)return;
  state.detailRef={kind:'library',id:x.id};
  if(state.historyReady&&!state.historyLock)history.pushState({...navState(),detail:true,detailRef:state.detailRef},'',location.href);
  let body='';
  const d=x.data;
  if(x.kind==='fusarium'){
    body=`<h3>Patogen</h3><div class="source-box"><strong>${esc(d.pathogen.name)}</strong><p>Forma specialis: ${esc(d.pathogen.abbreviation)} · inang: ${esc(d.pathogen.host)}</p></div><h3>Fakta kunci</h3><ul class="library-detail-list">${d.key_facts.map(v=>`<li>${esc(v)}</li>`).join('')}</ul><h3>Gejala</h3><ul class="library-detail-list">${d.symptoms.map(v=>`<li>${esc(v)}</li>`).join('')}</ul><h3>Kondisi yang mendukung</h3><div class="tag-row">${d.favorable_conditions.map(v=>`<span>${esc(v)}</span>`).join('')}</div><h3>Manajemen menurut sumber</h3>${d.management.map(m=>`<div class="source-box"><strong>${esc(m.title)}</strong><ul class="library-detail-list">${m.items.map(v=>`<li>${esc(v)}</li>`).join('')}</ul></div>`).join('')}<div class="source-note">Sumber Seminis 2016. Dokumen sendiri menekankan evaluasi lokal, pembacaan label dan penggunaan tenaga profesional sebagai konteks keputusan.</div>`;
  }else{
    body=`${d.intro?`<p class="detail-copy">${esc(d.intro)}</p>`:''}${d.source_snapshot?`<div class="source-box"><strong>Snapshot sumber</strong><p>${esc(d.source_snapshot.note||'')}</p><b>${esc(d.source_snapshot.groups)} groups</b></div>`:''}${d.items?.map(it=>`<div class="library-detail-item"><div class="library-detail-head"><strong>${esc(it.name||it.mode||it.parameter||'')}</strong>${it.tag?`<span>${esc(it.tag)}</span>`:''}</div>${it.role?`<p><b>Peran:</b> ${esc(it.role)}</p>`:''}${it.target?`<p><b>Target:</b> ${esc(it.target)}</p>`:''}${it.summary?`<p>${esc(it.summary)}</p>`:''}${it.benefits?.length?`<ul class="library-detail-list">${it.benefits.map(v=>`<li>${esc(v)}</li>`).join('')}</ul>`:''}${it.mechanisms?.length?`<div class="tag-row">${it.mechanisms.map(v=>`<span>${esc(v)}</span>`).join('')}</div>`:''}${it.examples?.length?`<div class="tag-row">${it.examples.map(v=>`<span>${esc(v)}</span>`).join('')}</div>`:''}${it.advantages?.length?`<div class="source-box"><b>Kelebihan:</b><ul class="library-detail-list">${it.advantages.map(v=>`<li>${esc(v)}</li>`).join('')}</ul></div>`:''}${it.challenges?.length?`<div class="source-box warn"><b>Tantangan:</b><ul class="library-detail-list">${it.challenges.map(v=>`<li>${esc(v)}</li>`).join('')}</ul></div>`:''}</div>`).join('')||''}${d.examples?.length?`<h3>Contoh pada materi sumber</h3><div class="library-example-table">${d.examples.map(v=>`<div><b>${esc(v.family)}</b><span>${esc(v.active)}</span><span>logP ${esc(v.logP)}</span><span>${esc(v.systemicity)}</span><span>${esc(v.activity)}</span></div>`).join('')}</div>`:''}${d.uptake_logic?.length?`<h3>Logika uptake & transport</h3><ul class="library-detail-list">${d.uptake_logic.map(v=>`<li>${esc(v)}</li>`).join('')}</ul>`:''}${d.technology?.length?`<h3>Contoh parameter teknologi</h3><div class="library-example-table">${d.technology.map(v=>`<div><b>${esc(v.parameter)}</b><span>${esc(v.example)}</span><span>${esc(v.note)}</span></div>`).join('')}</div>`:''}${d.note?`<p class="source-note">${esc(d.note)}</p>`:''}`;
  }
  $('#detail').innerHTML=`<div class="detail-backdrop" id="detailBackdrop"></div><aside class="detail-sheet library-detail"><button class="close" id="closeDetail">×</button><div class="detail-code">AGROBIOLOGY LIBRARY · ${esc(libraryCategory(x))}</div><div class="library-detail-title"><span>${esc(x.icon)}</span><div><h2>${esc(x.title)}</h2><p class="muted">Sumber: ${esc(x.source_id)} · halaman ${esc(x.pages)}</p></div></div>${body}<div class="source-note">Konten ini adalah ekstraksi dari materi sumber pengguna. Klasifikasi MoA current tetap menggunakan master IRAC/FRAC/HRAC 2026 di aplikasi.</div></aside>`;
  $('#detailBackdrop').addEventListener('click',closeDetail);$('#closeDetail').addEventListener('click',closeDetail);
}

function cropNutritionProfileForCrop(cropId){ return (state.cropNutritionProfiles?.records||[]).find(r=>r.crop_id===cropId); }
function nutritionFocusTags(ids){
  return (ids||[]).map(id=>`<button class="nutrient-mini" data-nutrient-id="${esc(id)}">${esc(id)}</button>`).join('');
}
function nutritionBlockForCrop(crop){
  const r=cropNutritionProfileForCrop(crop.id); if(!r) return '';
  return `<section class="crop-nutrition-section">
    <div class="growth-head"><div><span class="eyebrow">CROP NUTRITION PROFILE</span><h3>Guideline Nutrisi</h3></div><span class="growth-status">KUALITATIF</span></div>
    <div class="nutrition-profile-summary"><strong>${esc(r.production_goal)}</strong><p>${esc(r.note)}</p></div>
    <div class="nutrition-focus"><div><span class="eyebrow">Fokus hara umum</span><div class="nutrient-focus-tags">${nutritionFocusTags(r.nutrition_focus)}</div></div></div>
    <div class="crop-stage-nutrition">${(r.stages||[]).map(st=>`<article><div class="stage-nutrition-head"><strong>${esc(st.name)}</strong><div>${nutritionFocusTags(st.focus)}</div></div><small>Fokus fisiologis, bukan dosis aplikasi.</small></article>`).join('')}</div>
    <div class="nutrition-two-col"><div><h4>Hal yang perlu diamati</h4><ul>${(r.diagnostic_watchpoints||[]).map(v=>`<li>${esc(v)}</li>`).join('')}</ul></div><div><h4>Biostimulan</h4><ul>${(r.biostimulant_context||[]).map(v=>`<li>${esc(v)}</li>`).join('')}</ul><h4>PGR</h4><ul>${(r.pgr_context||[]).map(v=>`<li>${esc(v)}</li>`).join('')}</ul></div></div>
    <div class="source-note">Status: ${esc(r.status)}. Profil ini menghubungkan fase pertumbuhan dengan fungsi nutrisi secara kualitatif; tidak menetapkan dosis, ppm, interval atau produk.</div>
  </section>`;
}
function renderCropGuidelines(){
  const root=$('#cropGuidelineList'); if(!root||!state.opt||!state.cropNutritionProfiles)return;
  const q=normalizeText($('#cropGuidelineSearch')?.value||'');
  const rows=(state.cropNutritionProfiles.records||[]).map(r=>{const c=state.opt.crops.find(x=>x.id===r.crop_id);return {...r,crop:c};}).filter(r=>r.crop && (!q||normalizeText([r.crop.name,r.crop.latin,r.family,r.production_goal,r.nutrition_focus.join(' ')].join(' ')).includes(q)));
  root.innerHTML=rows.map(r=>`<button class="crop-guideline-card" data-crop-guideline="${esc(r.crop_id)}"><img src="assets/opt/${esc(r.crop.icon)}"><div><span class="eyebrow">${esc(r.family)}</span><h3>${esc(r.crop.name)}</h3><p>${esc(r.production_goal)}</p><div class="nutrient-focus-tags">${nutritionFocusTags(r.nutrition_focus)}</div></div><span class="arrow">›</span></button>`).join('')||'<div class="empty">Crop tidak ditemukan.</div>';
  $$('.crop-guideline-card').forEach(b=>b.addEventListener('click',()=>{const c=state.opt.crops.find(x=>x.id===b.dataset.cropGuideline);if(c)openCropDetail(c);}));
}

function renderNutrition(){
  const root=$('#nutritionList'); if(!root||!state.nutrition)return;
  const q=normalizeText(state.nutritionSearch||'');
  const f=state.nutritionFilter;
  const cards=[];
  (state.nutrition.categories||[]).forEach(cat=>{
    if(f!=='ALL'&&f!==cat.id)return;
    (cat.items||[]).forEach(x=>cards.push({type:'category',categoryId:cat.id,category:cat.name,...x}));
  });
  if(f==='ALL'||f==='biostimulants') (state.nutrition.biostimulants||[]).forEach(x=>cards.push({type:'biostimulant',categoryId:'biostimulants',category:'Biostimulan',...x}));
  if(f==='ALL'||f==='growth_regulators') (state.nutrition.growth_regulators||[]).forEach(x=>cards.push({type:'pgr',categoryId:'growth_regulators',category:'Plant Growth Regulator (PGR)',...x}));
  const filtered=cards.filter(x=>!q||normalizeText([x.name,x.symbol,x.group,x.category,x.what,x.examples?.join(' '),...(x.role||[])].join(' ')).includes(q));
  $('#nutritionSearchBtn')?.setAttribute('aria-label','Cari nutrisi');
  root.innerHTML=filtered.length?filtered.map(x=>{
    const badge=x.type==='category'?(x.group||x.category):(x.category||'');
    return `<article class="nutrition-card"><div class="nutrition-card-head"><div><span class="eyebrow">${esc(x.category||'')}</span><h3>${esc(x.name)}${x.symbol?` <small>${esc(x.symbol)}</small>`:''}</h3></div><span class="nutrition-badge">${esc(badge)}</span></div>${x.what?`<p class="nutrition-what">${esc(x.what)}</p>`:''}${x.forms?.length?`<div class="nutrition-forms"><b>Bentuk umum:</b> ${x.forms.map(v=>esc(v)).join(' · ')}</div>`:''}${x.examples?.length?`<div class="tag-row">${x.examples.map(v=>`<span>${esc(v)}</span>`).join('')}</div>`:''}${x.mobility?`<div class="nutrition-meta"><span>Mobilitas: ${esc(x.mobility)}</span></div>`:''}<div class="nutrition-role"><b>Peran pada tanaman</b><ul>${(x.role||[]).map(v=>`<li>${esc(v)}</li>`).join('')}</ul></div>${x.diagnostic_clue?`<div class="nutrition-diagnostic"><b>Petunjuk gejala:</b> ${esc(x.diagnostic_clue)}</div>`:''}${x.note?`<p class="nutrition-note">${esc(x.note)}</p>`:''}</article>`;
  }).join(''):`<div class="empty">Tidak ada data nutrisi yang cocok dengan pencarian.</div>`;
  const fw=state.nutrition.diagnostic_framework; const interactions=state.nutrition.interaction_examples||[];
  if($('#nutritionFramework')) $('#nutritionFramework').innerHTML=`<div class="nutrition-framework-grid"><div><span class="eyebrow">DIAGNOSIS</span><h3>${esc(fw?.title||'Kerangka diagnosis nutrisi')}</h3><ol>${(fw?.steps||[]).map(v=>`<li>${esc(v)}</li>`).join('')}</ol><p class="source-note">${esc(fw?.note||'')}</p></div><div><span class="eyebrow">INTERAKSI</span><h3>Nutrient balance</h3>${interactions.map(v=>`<div class="interaction-row"><strong>${esc(v.pair)}</strong><span>${esc(v.type)}</span><small>${esc(v.note)}</small></div>`).join('')}</div></div>`;
}
function renderKnowledge(){
  if(!state.pesticideKnowledge||!$('#knowledgeList')) return;
  $('#knowledgeList').innerHTML=state.pesticideKnowledge.sections.map(sec=>`<article class="knowledge-card"><div class="knowledge-head"><div><span>PDF KEMENTAN · HALAMAN ${esc(sec.pages)}</span><h3>${esc(sec.title)}</h3></div>${sec.warning?'<b class="knowledge-warn">REFERENSI HISTORIS</b>':''}</div><ul>${sec.items.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>${sec.warning?`<p class="knowledge-note">${esc(sec.warning)}</p>`:''}</article>`).join('');
}
function renderSources(){
  if(!state.sources||!$('#sourceList')) return;
  const extra=state.pesticideKnowledge?.sections?.length||0;
  $('#sourceList').innerHTML=state.sources.sources.map(s=>`<article class="source-card"><div class="source-icon">${s.id==='pestisida-kementan'?'📘':s.id==='formulation-types-bioscience-academy'?'🧪':s.id==='eppo'?'🌐':'◈'}</div><div><span class="source-type">${esc(s.type)}</span><h3>${esc(s.title)}</h3><p>${esc(s.publisher)}</p><small>${esc(s.scope)}${s.pages?` · ${esc(s.pages)}`:''}${s.year?` · ${esc(s.year)}`:''}</small></div></article>`).join('')+`<div class="source-box"><strong>Ekstraksi PDF aktif</strong><p>PDF Kementan: ${extra} kelompok pengetahuan. Formulation Types: ${(state.formulations?.items?.length||0)} tipe formulasi terstruktur.</p></div>`;
}
function controlBlock(x){
  const rel=(state.control?.relationships||{})[x.id]||[];
  if(!rel.length) return `<div class="control-empty">Belum ada relasi bahan aktif terverifikasi untuk OPT ini. Data akan ditambahkan bertahap berdasarkan literatur dan label lokal.</div>`;
  const master=Object.fromEntries((state.control?.active_ingredients||[]).map(a=>[a.id,a]));
  return `<h3>Bahan aktif terkait</h3>
    <p class="source-note">Referensi teknis — bukan rekomendasi otomatis. Cek label, komoditas, OPT sasaran, dosis, interval, PHI dan registrasi Indonesia sebelum aplikasi.</p>
    <div class="ai-control-list">${rel.map(r=>{
      const a=master[r.active_id]||{};
      const badge=r.status==='documented'?'Terdokumentasi':'Perlu verifikasi';
      return `<div class="ai-control-card">
        <div class="ai-control-head"><strong>${esc(a.name||r.active_id)}</strong><span>${esc(badge)}</span></div>
        <div class="ai-control-meta">${esc(a.committee||'')} ${a.group?`· Group ${esc(a.group)}`:''}${a.class?` · ${esc(a.class)}`:''}</div>
        <p>${esc(r.note||'')}</p>
      </div>`;
    }).join('')}</div>`;
}



function pesticideRecords(){
  return state.pesticides?.records||[];
}
function pesticideMatches(){
  const q=state.pesticideSearch.toLowerCase();
  return pesticideRecords().filter(p=>{
    const hay=[p['Nama Merk'],p['Perusahaan'],p['Bahan Aktif'],p['Formulasi'],p['IRAC Group'],p['FRAC Group'],p['HRAC Group'],p['Sasaran Hama/Penyakit/Gulma']].join(' ').toLowerCase();
    const cat=String(p['Kategori']||''); const catOk=state.pesticideFilter==='ALL'||cat===state.pesticideFilter||(state.pesticideFilter==='LAINNYA'&&!['Insektisida','Fungisida','Herbisida'].includes(cat)); return catOk&&(!q||hay.includes(q));
  });
}
function renderPesticides(){
  if(!state.pesticides||!$('#pesticideList'))return;
  const list=pesticideMatches();
  $('#pesticideCount').textContent=pesticideRecords().length;
  $('#pesticideResultCount').textContent=list.length;
  $('#pesticideList').innerHTML=list.map(p=>{
    const groups=[p['IRAC Group'],p['FRAC Group'],p['HRAC Group']].filter(x=>x&&x!=='-'&&!String(x).toLowerCase().includes('tidak tersedia'));
    return `<button class="pesticide-card" data-pesticide-id="${esc(p.id)}">
      <div class="pesticide-card-top"><span class="pesticide-category">${esc(p['Kategori'])}</span>${groups.length?`<span class="pesticide-groups">${groups.map(g=>esc(g)).join(' · ')}</span>`:''}</div>
      <h3>${esc(p['Nama Merk'])}</h3>
      <p class="pesticide-ai">${esc(p['Bahan Aktif'])}</p>
      <div class="pesticide-meta"><span>${esc(p['Perusahaan']||'—')}</span><span>${esc(p['Formulasi']||'—')}</span></div>
      <p class="pesticide-target"><b>Sasaran:</b> ${esc(p['Sasaran Hama/Penyakit/Gulma']||'—')}</p>
    </button>`;
  }).join('')||'<div class="empty">Tidak ada produk yang cocok.</div>';
  $$('.pesticide-card').forEach(b=>b.addEventListener('click',()=>openPesticideDetail(pesticideRecords().find(x=>x.id===b.dataset.pesticideId))));
  $$('.pesticide-tabs button').forEach(b=>b.classList.toggle('active',b.dataset.pesticideFilter===state.pesticideFilter));
}
function pesticideRelatedOpt(p){
  const ids=p.linked_opt_ids||[];
  const pests=state.opt?.pests||[], diseases=state.opt?.diseases||[], weeds=state.opt?.weeds||[];
  const all=[...pests,...diseases,...weeds];
  return ids.map(id=>{
    const x=all.find(v=>v.id===id);
    if(!x)return null;
    return {...x,_type:pests.some(v=>v.id===id)?'Hama':diseases.some(v=>v.id===id)?'Penyakit':'Gulma'};
  }).filter(Boolean);
}
function pesticideMoaMatches(p){
  return p.ai_master_matches||[];
}
function openPesticideDetail(p){
  if(!p)return;
  state.detailRef={kind:'pesticide',id:p.id};
  if(state.historyReady&&!state.historyLock)history.pushState({...navState(),detail:true,detailRef:state.detailRef},'',location.href);
  const related=pesticideRelatedOpt(p);
  const moa=pesticideMoaMatches(p);
  const sourceGroups=[p['IRAC Group'],p['FRAC Group'],p['HRAC Group']].filter(x=>x&&x!=='');
  $('#detail').innerHTML=`<div class="detail-backdrop" id="detailBackdrop"></div><aside class="detail-sheet">
    <button class="close" id="closeDetail">×</button>
    <div class="detail-code">${esc(p['Kategori']||'Pestisida')} · ${esc(p['Nama Merk']||'')}</div>
    <div class="pesticide-detail-hero"><div class="pesticide-bottle">🧴</div><div><h2>${esc(p['Nama Merk'])}</h2><p class="muted">${esc(p['Perusahaan']||'')}</p></div></div>
    <div class="detail-grid">
      <div><label>Bahan aktif</label><strong>${esc(p['Bahan Aktif']||'—')}</strong></div>
      <div><label>Formulasi</label><strong>${esc(p['Formulasi']||'—')}</strong></div>
      <div><label>Kemasan</label><strong>${esc(p['Kemasan']||'—')}</strong></div>
      <div><label>Kategori</label><strong>${esc(p['Kategori']||'—')}</strong></div>
    </div>
    <div class="pesticide-status-grid"><div><label>Status registrasi pada sumber</label><strong>${esc(p['Status Registrasi']||'Tidak dicantumkan')}</strong></div><div><label>Status pasar pada sumber</label><strong>${esc(p['Status Pasar']||'Tidak dicantumkan')}</strong></div><div><label>Nomor pendaftaran</label><strong>${esc(p['Nomor Pendaftaran']||'Tidak dicantumkan')}</strong></div><div><label>Sumber data</label><strong>${esc(p['Sumber Data']||p['database_source']||'—')}</strong></div></div>
    ${p.source_variant_count>1?`<div class="source-box"><strong>${esc(p.source_variant_count)} varian baris sumber</strong><p>Nama produk ini muncul pada beberapa baris sumber dengan perbedaan penulisan/perusahaan/bahan aktif. Semua varian asal dipertahankan di database.</p></div>`:''}
    <h3>Sasaran dalam dataset</h3><div class="source-box"><p style="margin:0">${esc(p['Sasaran Hama/Penyakit/Gulma']||'—')}</p></div>
    <h3>MoA dalam dataset</h3><div class="tag-row">${sourceGroups.length?sourceGroups.map(g=>`<span>${esc(g)}</span>`).join(''):'<span>Belum tersedia / perlu verifikasi</span>'}</div>
    ${moa.length?`<h3>Tautan ke master Bahan Aktif Pestisida</h3><div class="ai-control-list">${moa.map(m=>`<div class="ai-control-card"><div class="ai-control-head"><strong>${esc(m.name||'')}</strong><span>${esc(m.committee||'')}</span></div><div class="ai-control-meta">Group ${esc(m.group||m.code||'')}</div></div>`).join('')}</div>`:''}
    ${related.length?`<h3>OPT yang terhubung</h3><p class="source-note">Koneksi ini dibuat dari kecocokan teks sasaran pada dataset dengan nama/alias Crop Expert. Ini bukan konfirmasi label.</p><div class="pesticide-related-opt">${related.map(x=>`<button data-opt-id="${esc(x.id)}" data-opt-type="${esc(x._type||'Hama')}" class="related-opt-card"><strong>${esc(x.name)}</strong><span>${esc(x.common||x.category||'')}</span></button>`).join('')}</div>`:''}
    <div class="source-box"><strong>⚠️ Status data</strong><p>Data produk berasal dari dataset pengguna. Status registrasi, komoditas, dosis, interval, PHI, kompatibilitas, dan penggunaan legal harus diverifikasi pada label/registrasi Indonesia terkini.</p></div>
  </aside>`;
  $('#detailBackdrop').addEventListener('click',closeDetail);
  $('#closeDetail').addEventListener('click',closeDetail);
  $$('.related-opt-card').forEach(b=>b.addEventListener('click',()=>{
    const all=[...(state.opt?.pests||[]),...(state.opt?.diseases||[]),...(state.opt?.weeds||[])];
    const x=all.find(v=>v.id===b.dataset.optId); if(x) openOptDetail(x,b.dataset.optType);
  }));
}
function pesticideBlock(x){
  if(!state.pesticides)return '';
  const ids=[];
  const all=[...(state.opt?.pests||[]),...(state.opt?.diseases||[]),...(state.opt?.weeds||[])];
  const p=state.pesticides.records.filter(v=>(v.linked_opt_ids||[]).includes(x.id));
  if(!p.length)return '';
  return `<h3>Produk dalam Database Pestisida</h3>
    <p class="source-note">Ditautkan dari kecocokan sasaran pada dataset produk. Bukan rekomendasi penggunaan dan bukan validasi label.</p>
    <div class="ai-control-list">${p.slice(0,12).map(v=>`<button class="ai-control-card pesticide-link-card" data-pesticide-id="${esc(v.id)}"><div class="ai-control-head"><strong>${esc(v['Nama Merk'])}</strong><span>${esc(v['Kategori']||'')}</span></div><div class="ai-control-meta">${esc(v['Bahan Aktif']||'')} ${v['IRAC Group']?`· IRAC ${esc(v['IRAC Group'])}`:''}${v['FRAC Group']&&v['FRAC Group']!=='-'?` · FRAC ${esc(v['FRAC Group'])}`:''}${v['HRAC Group']&&v['HRAC Group']!=='-'?` · HRAC ${esc(v['HRAC Group'])}`:''}</div><p>Sasaran dataset: ${esc(v['Sasaran Hama/Penyakit/Gulma']||'—')}</p></button>`).join('')}</div>
    ${p.length>12?`<button class="btn" id="morePesticidesForOpt">Lihat semua ${p.length} produk terkait ↗</button>`:''}`;
}

function eppoBlock(x){
  const e=x.eppo || state.eppoLinks?.links?.[x.id];
  if(!e) return '';
  return `<section class="eppo-ref">
    <div class="eppo-ref-head">
      <div><strong>📷 Referensi Foto EPPO</strong><small>Foto tetap berada di EPPO Global Database</small></div>
      <button class="btn eppo-open" onclick="openEppoViewer('${esc(e.url)}','${esc(e.name)}')">Lihat di aplikasi</button>
    </div>
    <p>Crop Expert tidak menyalin foto EPPO. Tombol di atas membuka halaman foto asli EPPO; jika embedding diblokir browser, tersedia tombol untuk membukanya langsung.</p>
  </section>`;
}

window.openEppoViewer=function(url,name){
  if(state.historyReady && !state.historyLock) history.pushState({...navState(),detail:!!$('#detail').innerHTML.trim(),detailRef:state.detailRef,eppo:true},'',location.href);
  let modal=document.getElementById('eppoViewer');
  if(!modal){
    modal=document.createElement('div');
    modal.id='eppoViewer';
    modal.className='eppo-modal';
    modal.innerHTML=`<div class="eppo-sheet">
      <div class="eppo-bar">
        <button class="eppo-close" onclick="closeEppoViewer()">← Kembali</button>
        <strong id="eppoViewerTitle">EPPO</strong>
        <a id="eppoDirect" class="eppo-direct" target="_blank" rel="noopener">↗</a>
      </div>
      <div class="eppo-frame-wrap">
        <iframe id="eppoFrame" title="EPPO Global Database"></iframe>
        <div id="eppoFallback" class="eppo-fallback">
          <div>EPPO menolak ditampilkan di dalam frame.</div>
          <a id="eppoFallbackLink" class="btn" target="_blank" rel="noopener">Buka halaman EPPO ↗</a>
        </div>
      </div>
    </div>`;
    document.body.appendChild(modal);
  }
  document.getElementById('eppoViewerTitle').textContent=name||'EPPO';
  document.getElementById('eppoDirect').href=url;
  document.getElementById('eppoFallbackLink').href=url;
  document.getElementById('eppoFallback').style.display='none';
  const frame=document.getElementById('eppoFrame');
  frame.style.display='block';
  frame.src=url;
  modal.classList.add('show');
  // If EPPO blocks framing, the browser may fire load but display an error page;
  // keep a direct-open control always visible as the robust fallback.
};
window.closeEppoViewer=function(opts={}){
  const modal=document.getElementById('eppoViewer');
  if(!modal) return;
  modal.classList.remove('show');
  const frame=document.getElementById('eppoFrame');
  frame.src='about:blank';
  if(!opts.fromHistory && state.historyReady && !state.historyLock) history.back();
};

function growthRecordForCrop(cropId){ return (state.cropGrowth?.records||[]).find(r=>r.crop_id===cropId); }
function growthLinksForOpt(optId){
  const out=[];
  for(const r of (state.cropGrowth?.records||[])) for(const l of (r.opt_stage_links||[])) if(l.opt_id===optId) out.push({...l,crop_id:r.crop_id,crop_name:r.crop_name,phases:r.phases||[]});
  return out;
}
function growthBlockForCrop(crop){
  const g=growthRecordForCrop(crop.id); if(!g) return '';
  const phases=g.phases||[];
  const links=g.opt_stage_links||[];
  return `<section class="growth-section"><div class="growth-head"><div><span class="eyebrow">CROP GROWTH GUIDELINE</span><h3>Tahapan Pertumbuhan</h3></div><span class="growth-status">${g.source_status==='source_supported'?'SOURCE':'KERANGKA'}</span></div>
    <div class="growth-timeline">${phases.map((p,i)=>`<div class="growth-stage"><span>${i+1}</span><strong>${esc(p.name)}</strong>${p.label?`<small>${esc(p.label)}</small>`:''}</div>`).join('')}</div>
    ${links.length?`<div class="growth-opt-map"><h4>OPT menurut fase</h4>${phases.map(ph=>{const ls=links.filter(l=>(l.stages||[]).includes(ph.id)); if(!ls.length)return ''; return `<div class="growth-opt-row"><div class="growth-phase"><strong>${esc(ph.name)}</strong><small>${esc(ph.group||'')}</small></div><div class="growth-opt-items">${ls.map(l=>{const ox=[...(state.opt?.pests||[]),...(state.opt?.diseases||[]),...(state.opt?.weeds||[])].find(v=>v.id===l.opt_id); return `<button class="stage-opt-link" data-opt-stage-ref="${esc(`${l.type}|${l.opt_id}`)}">${esc(l.type)} · ${esc(ox?.common||ox?.name||l.opt_id)} ›</button>`}).join('')}</div></div>`}).join('')}</div>`:''}
    ${g.note?`<div class="source-note">${esc(g.note)}</div>`:''}
    ${g.sources?.length?`<div class="growth-sources">${g.sources.map(s=>`<small>• ${esc(s.name)}${s.note?` — ${esc(s.note)}`:''}</small>`).join('')}</div>`:''}
  </section>`;
}
function growthBlockForOpt(x){
  const links=growthLinksForOpt(x.id); if(!links.length) return '';
  return `<section class="growth-section"><div class="growth-head"><div><span class="eyebrow">CROP GROWTH STAGE</span><h3>Fase serangan / pengamatan</h3></div></div>
    ${links.map(l=>`<div class="opt-growth-card"><strong>${esc(l.crop_name)}</strong><div class="tag-row">${(l.phases||[]).filter(p=>(l.stages||[]).includes(p.id)).map(p=>`<span>${esc(p.name)}</span>`).join('')}</div><p>${esc(l.importance_note||'')}</p></div>`).join('')}
    <div class="source-note">Pemetaan fase ditampilkan hanya dari sumber yang tercatat di database. Ini bukan ambang kendali atau jadwal aplikasi.</div>
  </section>`;
}
function lifeCycleBlock(x){
  const ref=x.life_cycle_reference;
  if(!ref) return '';
  return `<section class="lifecycle-section"><div class="growth-head"><div><span class="eyebrow">BIOLOGI OPT</span><h3>Siklus hidup</h3></div><span class="growth-status">REFERENSI</span></div>
    <div class="lifecycle-stages">${(ref.stages||[]).map((v,i)=>`<div class="lifecycle-stage"><span>${i+1}</span><strong>${esc(v)}</strong>${i<(ref.stages||[]).length-1?'<b>→</b>':''}</div>`).join('')}</div>
    ${ref.source_note?`<div class="source-note">${esc(ref.source_note)}</div>`:''}
  </section>`;
}
function sourceTableBlock(x){
  const t=x.source_table; if(!t) return '';
  const row=(label,arr,cls)=>arr?.length?`<div class="source-host-row"><strong>${esc(label)}</strong><div class="tag-row">${arr.map(v=>`<span class="${cls||''}">${esc(v)}</span>`).join('')}</div></div>`:'';
  return `<section class="source-table-section"><div class="growth-head"><div><span class="eyebrow">DATA GAMBAR REFERENSI</span><h3>Inang & tingkat kerusakan</h3></div></div>${row('Kerusakan berat',t.severe,'severe')}${row('Kerusakan sedang',t.moderate,'moderate')}<div class="source-note">${esc(t.source||'Data berasal dari sumber visual pengguna.')}. Istilah dan kelompok tanaman dipertahankan dari tabel sumber; data ini bukan klaim universal untuk semua lokasi.</div></section>`;
}
function openOptDetail(x,type){
  state.detailRef={kind:'opt',id:x.id,type};
  if(state.historyReady && !state.historyLock) history.pushState({...navState(),detail:true,detailRef:state.detailRef},'',location.href);
  const hosts=x.hosts||[];
  $('#detail').innerHTML=`<div class="detail-backdrop" id="detailBackdrop"></div><aside class="detail-sheet">
    <button class="close" id="closeDetail">×</button>
    <div class="detail-code">${esc(type)} · ${esc(x.category||x.family||'')}</div>${photoBlock(x)}
    <div style="text-align:center;margin:16px 0 6px"><img src="assets/opt/${esc(x.icon)}" style="width:180px;height:150px;color:#0a7548"></div>
    <h2><i>${esc(x.name)}</i></h2><p class="muted">${esc(x.common||'')}</p>
    <div class="detail-grid"><div><label>Nama umum</label><strong>${esc(x.common||'—')}</strong></div><div><label>Kelompok</label><strong>${esc(x.category||'—')}</strong></div>${x.family?`<div><label>Famili</label><strong>${esc(x.family)}</strong></div>`:''}<div><label>Type OPT</label><strong>${esc(type)}</strong></div></div>
    ${hosts.length?`<h3>Tanaman Inang</h3><div class="tag-row">${hosts.map(h=>`<span>${esc(h)}</span>`).join('')}</div>`:''}
    ${x.symptoms?.length?`<h3>Gejala / ciri</h3><div class="source-box"><ul style="margin:0;padding-left:17px">${x.symptoms.map(s=>`<li style="font-size:10px;margin:6px 0">${esc(s)}</li>`).join('')}</ul></div>`:''}
    ${lifeCycleBlock(x)}
    ${x.life?.length?`<h3>Tahap perkembangan</h3><div class="tag-row">${x.life.map(s=>`<span>${esc(s)}</span>`).join('')}</div>`:''}
    ${sourceTableBlock(x)}
    ${x.notes?`<p class="source-note">${esc(x.notes)}</p>`:''}
    ${growthBlockForOpt(x)}
    ${controlBlock(x)}
    ${pesticideBlock(x)}
    ${eppoBlock(x)}
  </aside>`;
  $('#detailBackdrop').addEventListener('click',closeDetail);$('#closeDetail').addEventListener('click',closeDetail); $$('.pesticide-link-card').forEach(b=>b.addEventListener('click',()=>openPesticideDetail(pesticideRecords().find(v=>v.id===b.dataset.pesticideId))));
}
function openCropDetail(crop){
  state.detailRef={kind:'crop',id:crop.id};
  if(state.historyReady && !state.historyLock) history.pushState({...navState(),detail:true,detailRef:state.detailRef},'',location.href);
  const master=[...state.opt.pests,...state.opt.diseases,...state.opt.weeds];
  const sourceRows=(state.cropOptSources?.records?.[crop.id]||[]);
  const fallback=master.filter(x=>(x.hosts||[]).some(h=>h.toLowerCase().includes(crop.name.split(' ')[0].toLowerCase())||crop.name.toLowerCase().includes(h.toLowerCase()))).map(x=>({type:x.category==='Fungi'||x.category==='Bacteria'||x.category==='Fungi-like'?'Penyakit':x.category==='Grass'||x.category==='Broadleaf'||x.category==='Sedge'?'Gulma':'Hama',common:x.common||x.name,scientific:x.name,master_id:x.id,source:'master'}));
  const rows=sourceRows.length?sourceRows:fallback;
  const sections=['Hama','Penyakit','Gulma'].map(type=>{const list=rows.filter(x=>x.type===type); if(!list.length)return ''; return `<div class="crop-opt-section"><div class="crop-opt-section-head"><strong>${type}</strong><span>${list.length}</span></div><div class="opt-list">${list.map(x=>{const m=x.master_id?master.find(v=>v.id===x.master_id):null; const ref=`${type}|${x.master_id||''}|${x.scientific||x.common||''}|${x.common||''}`; return `<button class="opt-card crop-opt-link" data-opt-ref="${esc(ref)}"><img src="assets/opt/${esc(m?.icon|| (type==='Hama'?'category-pest.svg':type==='Penyakit'?'category-disease.svg':'category-weed.svg'))}"><div class="opt-main"><h3>${esc(x.scientific||x.common)}</h3><p>${esc(x.common||'')}</p><small>${esc(type)}${x.source&&x.source!=='master'?' · sumber tabel pengguna':''}</small></div><span class="arrow">›</span></button>`}).join('')}</div></div>`}).join('');
  $('#detail').innerHTML=`<div class="detail-backdrop" id="detailBackdrop"></div><aside class="detail-sheet">
    <button class="close" id="closeDetail">×</button><div class="detail-code">Tanaman & Inang</div>
    <div style="text-align:center;margin:16px 0 6px"><img src="assets/opt/${esc(crop.icon)}" style="width:150px;height:130px;color:#0a7548"></div>
    <h2>${esc(crop.name)}</h2><p class="muted"><i>${esc(crop.latin)}</i></p>
    ${crop.source_guidelines?`<div class="source-box"><strong>Sumber pengetahuan</strong><p>${esc(crop.source_guidelines.summary_id)}</p><small>${esc(crop.source_guidelines.source)} · ${esc(crop.source_guidelines.source_note)}</small></div>`:''}
    <div class="crop-source-badge">${rows.length} relasi OPT dari lapisan sumber + master</div>
    ${growthBlockForCrop(crop)}
    ${nutritionBlockForCrop(crop)}
    <h3>OPT terkait</h3>${sections||'<div class="empty">Belum ada relasi OPT yang terpetakan.</div>'}
    <div class="source-note">Relasi dari TABEL HAMA (ID).pdf diperlakukan sebagai sumber pengetahuan/provenance. Nama produk pada dokumen tidak dianggap sebagai bukti registrasi pestisida Indonesia saat ini.</div>
  </aside>`;
  $('#detailBackdrop').addEventListener('click',closeDetail);$('#closeDetail').addEventListener('click',closeDetail); $$('.crop-opt-link').forEach(b=>b.addEventListener('click',()=>openCropOptRef(b.dataset.optRef))); $$('.stage-opt-link').forEach(b=>b.addEventListener('click',()=>{const [t,id]=String(b.dataset.optStageRef||'').split('|'); const x=[...state.opt.pests,...state.opt.diseases,...state.opt.weeds].find(v=>v.id===id); if(x) openOptDetail(x,t);}));
}
function openCropOptRef(ref){
  const [type,id,scientific,common]=String(ref||'').split('|');
  const master=[...state.opt.pests,...state.opt.diseases,...state.opt.weeds];
  const m=id?master.find(v=>v.id===id):null;
  if(m){ openOptDetail(m,type); return; }
  state.detailRef={kind:'crop-opt',id:'',type,scientific,common};
  if(state.historyReady && !state.historyLock) history.pushState({...navState(),detail:true,detailRef:state.detailRef},'',location.href);
  const icon=type==='Hama'?'category-pest.svg':type==='Penyakit'?'category-disease.svg':'category-weed.svg';
  $('#detail').innerHTML=`<div class="detail-backdrop" id="detailBackdrop"></div><aside class="detail-sheet">
    <button class="close" id="closeDetail">×</button><div class="detail-code">${esc(type)} · sumber tanaman</div>
    <div style="text-align:center;margin:18px 0 8px"><img src="assets/opt/${icon}" style="width:150px;height:125px"></div>
    <h2>${esc(scientific||common||'OPT')}</h2><p class="muted">${esc(common||'')}</p>
    <div class="source-box"><strong>Relasi OPT pada tanaman</strong><p>Entri ini berasal dari lapisan relasi sumber tanaman dan belum memiliki record detail lengkap di Master Crop Expert.</p></div>
    <div class="source-note">Data sumber ditampilkan apa adanya dan tidak dipakai untuk membuat klaim diagnosis, registrasi pestisida, dosis, atau rekomendasi aplikasi.</div>
  </aside>`;
  $('#detailBackdrop').addEventListener('click',closeDetail); $('#closeDetail').addEventListener('click',closeDetail);
}
function setScanFile(file){
  if(!file || !file.type.startsWith('image/')) return; state.scanFile=file;
  const preview=$('#scanPreview'); const url=URL.createObjectURL(file); preview.style.backgroundImage=`url("${url}")`; preview.style.backgroundSize='cover'; preview.style.backgroundPosition='center';
  preview.querySelector('span').textContent='✓'; $('#scanPreviewTitle').textContent=file.name||'Foto siap dianalisis'; $('#scanPreviewHint').textContent='Foto siap. Kamu bisa lanjut ke Google Lens atau ChatGPT.';
  $('#scanFileMeta').hidden=false; $('#scanFileMeta').textContent=`${file.name||'foto'} · ${Math.round(file.size/1024)} KB`; $('#analyzeChatGPTBtn').disabled=false; $('#copyScanPromptBtn').disabled=false; $('#googleLensBtn').disabled=false;
}
function buildScanPrompt(){return `Saya sedang menggunakan Crop Expert untuk identifikasi awal OPT tanaman. Analisis foto yang saya lampirkan.\n\nTugas:\n1. Identifikasi tanaman/komoditas jika dapat terlihat.\n2. Tentukan apakah foto lebih mungkin menunjukkan HAMA, PENYAKIT, GULMA, gangguan ABIOTIK, atau KERUSAKAN PESTISIDA.\n3. Berikan maksimal 3 kandidat berdasarkan kecocokan ciri visual yang terlihat; jangan mengarang kepastian.\n4. Untuk setiap kandidat tuliskan nama umum Indonesia, nama ilmiah bila dapat ditentukan, dan ciri foto yang mendukung.\n5. Jelaskan ciri yang membedakannya dari kandidat lain.\n6. Jika foto tidak cukup, minta foto tambahan yang spesifik.\n7. Beri tingkat keyakinan kualitatif: tinggi/sedang/rendah, bukan angka probabilitas.\n8. Jangan menyatakan diagnosis pasti hanya dari foto. Untuk penyakit, pertimbangkan bahwa konfirmasi profesional/laboratorium mungkin diperlukan.\n9. Jangan memberikan dosis pestisida atau campuran tangki otomatis dari hasil foto.\n\nJawab dalam Bahasa Indonesia dan gunakan nama ilmiah/istilah teknis aslinya bila relevan.`}
function openGoogleLens(){
  if(!state.scanFile)return;
  window.open('https://lens.google.com/','_blank','noopener');
}
function optSearchPool(){return [...(state.opt?.pests||[]),...(state.opt?.diseases||[]),...(state.opt?.weeds||[])];}
function searchOptFromLens(){
  const q=String($('#lensResultSearch')?.value||'').trim().toLowerCase();
  if(!q)return;
  const pool=optSearchPool();
  const hits=pool.filter(x=>[x.name,x.common,x.scientific,x.family,x.order,...(x.aliases||[])].filter(Boolean).join(' ').toLowerCase().includes(q));
  if(hits.length===1){openOptDetail(hits[0], hits[0].category==='Penyakit'?'Penyakit':hits[0].category==='Gulma'?'Gulma':'Hama');return;}
  if(!hits.length){alert('Belum ada kecocokan dengan kata tersebut di database Crop Expert. Coba nama ilmiah atau nama umum lain dari hasil Google Lens.');return;}
  state.detailRef={kind:'lens-results',id:q};
  $('#detail').innerHTML=`<div class="detail-backdrop" id="detailBackdrop"></div><aside class="detail-sheet"><button class="close" id="closeDetail">×</button><div class="detail-code">HASIL PENCARIAN LENS</div><h2>${esc(q)}</h2><p class="muted">Beberapa kandidat ditemukan di database Crop Expert.</p><div class="lens-hit-list">${hits.slice(0,20).map(x=>`<button class="lens-hit" data-opt-id="${esc(x.id)}" data-opt-type="${esc(x.category||'Hama')}"><strong>${esc(x.name)}</strong><span>${esc(x.common||x.scientific||x.category||'')}</span></button>`).join('')}</div></aside>`;
  $('#detailBackdrop').addEventListener('click',closeDetail); $('#closeDetail').addEventListener('click',closeDetail);
  $$('.lens-hit').forEach(b=>b.addEventListener('click',()=>{const x=optSearchPool().find(v=>v.id===b.dataset.optId);if(x)openOptDetail(x,b.dataset.optType);}));
}
async function shareScanToChatGPT(){
  if(!state.scanFile)return; const prompt=buildScanPrompt(), file=state.scanFile;
  if(navigator.share && navigator.canShare){try{if(navigator.canShare({files:[file]})){await navigator.share({title:'Crop Expert — Analisis Foto OPT',text:prompt,files:[file]});return;}}catch(e){if(e?.name==='AbortError')return;}}
  try{await navigator.clipboard.writeText(prompt)}catch(e){}
  window.open('https://chatgpt.com/','_blank','noopener'); alert('Browser ini tidak mendukung berbagi file langsung. ChatGPT sudah dibuka. Tempel foto secara manual lalu kirim prompt yang sudah disalin jika tersedia.');
}
async function copyScanPrompt(){try{await navigator.clipboard.writeText(buildScanPrompt());alert('Prompt analisis sudah disalin.')}catch(e){alert(buildScanPrompt())}}
function showScreen(id,opts={}){
  if(opts.history!==false) pushNav(id);
  $$('.screen').forEach(s=>s.classList.toggle('active-screen',s.id===id));
  $$('.bottom-nav button').forEach(b=>b.classList.toggle('active',b.dataset.go===id));
  state.screen=id; if(id==='explore')render();
  if(id==='types')renderTypes(); if(id==='calculators'&&window.renderCalculator)window.renderCalculator(); if(id==='pests')renderPests(); if(id==='formulations')renderFormulations(); if(id==='knowledge')renderKnowledge(); if(id==='sources')renderSources(); if(id==='library')renderLibrary(); if(id==='pesticides')renderPesticides(); if(id==='nutrition')renderNutrition(); if(id==='crop-guidelines')renderCropGuidelines();
  window.scrollTo({top:0,behavior:'smooth'});
}
function setCommittee(c){state.committee=c;state.moaView='ai';state.group='ALL';state.search='';$('#search').value='';$$('.committee-tabs button').forEach(x=>x.classList.toggle('active',x.dataset.c===c));render()}
$$('[data-go]').forEach(b=>b.addEventListener('click',()=>{
  if(b.dataset.committee)setCommittee(b.dataset.committee);
  if(b.classList.contains('back-button') && state.historyReady && history.length>1){ history.back(); return; }
  showScreen(b.dataset.go);
}));
$$('.committee-tabs button').forEach(b=>b.addEventListener('click',()=>setCommittee(b.dataset.c)));
$$('.mini-tabs button[data-type]').forEach(b=>b.addEventListener('click',()=>{state.type=b.dataset.type;$$('.mini-tabs button[data-type]').forEach(x=>x.classList.toggle('active',x===b));renderTypes()}));
$$('.pest-tabs button').forEach(b=>b.addEventListener('click',()=>{state.pestFilter=b.dataset.pestFilter;renderPests()}));
$('#search').addEventListener('input',e=>{state.search=e.target.value;state.moaView==='emerging'?renderEmerging():renderList()});$('#clearSearch').addEventListener('click',()=>{$('#search').value='';state.search='';state.moaView==='emerging'?renderEmerging():renderList()});$('#focusSearch').addEventListener('click',()=>$('#search').focus());
$('#optSearch').addEventListener('input',e=>{
  const q=e.target.value.toLowerCase();
  $$('#typeGrid .type-card').forEach(card=>card.style.display=card.textContent.toLowerCase().includes(q)?'':'none')
});
$('#clearOptSearch').addEventListener('click',()=>{$('#optSearch').value='';$$('#typeGrid .type-card').forEach(c=>c.style.display='')});
$('#formulationSearch').addEventListener('input',e=>{state.formulationSearch=e.target.value;renderFormulations()});
$('#clearFormulationSearch').addEventListener('click',()=>{$('#formulationSearch').value='';state.formulationSearch='';renderFormulations()});
$$('.formulation-tabs button').forEach(b=>b.addEventListener('click',()=>{state.formulationFilter=b.dataset.formFilter;renderFormulations()}));
$('#formulationSearchBtn').addEventListener('click',()=>$('#formulationSearch').focus());
$('#openFormulations').addEventListener('click',()=>showScreen('formulations'));
$('#openAbout').addEventListener('click',()=>showScreen('about'));
$('#openSources').addEventListener('click',()=>showScreen('sources'));
$('#openKnowledge').addEventListener('click',()=>showScreen('knowledge'));
$('#openLibrary').addEventListener('click',()=>showScreen('library'));
$('#openPesticides').addEventListener('click',()=>showScreen('pesticides'));
$('#librarySearch').addEventListener('input',e=>{state.librarySearch=e.target.value;renderLibrary()});
$('#clearLibrarySearch').addEventListener('click',()=>{$('#librarySearch').value='';state.librarySearch='';renderLibrary()});
$$('.library-tabs button').forEach(b=>b.addEventListener('click',()=>{state.libraryFilter=b.dataset.libraryFilter;renderLibrary()}));
$('#librarySearchBtn').addEventListener('click',()=>$('#librarySearch').focus());
$('#nutritionSearchBtn').addEventListener('click',()=>$('#nutritionSearch').focus());
$('#nutritionSearch').addEventListener('input',e=>{state.nutritionSearch=e.target.value;renderNutrition()});
$('#clearNutritionSearch').addEventListener('click',()=>{$('#nutritionSearch').value='';state.nutritionSearch='';renderNutrition()});
$$('.nutrition-tabs button').forEach(b=>b.addEventListener('click',()=>{state.nutritionFilter=b.dataset.nutritionFilter;$$('.nutrition-tabs button').forEach(x=>x.classList.toggle('active',x===b));renderNutrition()}));
$('#openNutrition').addEventListener('click',()=>showScreen('nutrition'));
$('#openCropGuidelines').addEventListener('click',()=>showScreen('crop-guidelines'));
$('#cropGuidelineSearch').addEventListener('input',renderCropGuidelines);
$('#pesticideSearchBtn').addEventListener('click',()=>$('#pesticideSearch').focus());
$('#pesticideSearch').addEventListener('input',e=>{state.pesticideSearch=e.target.value;renderPesticides()});
$('#clearPesticideSearch').addEventListener('click',()=>{$('#pesticideSearch').value='';state.pesticideSearch='';renderPesticides()});
$$('.pesticide-tabs button').forEach(b=>b.addEventListener('click',()=>{state.pesticideFilter=b.dataset.pesticideFilter;renderPesticides()}));
$('#menuBtn').addEventListener('click',()=>showScreen('menu'));
$('#menuTheme').addEventListener('click',()=>document.documentElement.classList.toggle('dark'));
$('#themeBtn').addEventListener('click',()=>document.documentElement.classList.toggle('dark'));
$('#cameraBtn').addEventListener('click',()=>$('#cameraInput').click());
$('#galleryBtn').addEventListener('click',()=>$('#galleryInput').click());
$('#cameraInput').addEventListener('change',e=>setScanFile(e.target.files?.[0]));
$('#galleryInput').addEventListener('change',e=>setScanFile(e.target.files?.[0]));
$('#googleLensBtn').addEventListener('click',openGoogleLens);
$('#analyzeChatGPTBtn').addEventListener('click',shareScanToChatGPT);
$('#lensResultSearchBtn').addEventListener('click',searchOptFromLens);
$('#lensResultSearch').addEventListener('keydown',e=>{if(e.key==='Enter')searchOptFromLens()});
$('#copyScanPromptBtn').addEventListener('click',copyScanPrompt);
$('#installBtn').addEventListener('click',async()=>{if(state.deferredPrompt){await state.deferredPrompt.prompt();state.deferredPrompt=null}else alert('Gunakan menu Chrome → Tambahkan ke layar utama untuk memasang aplikasi.')});
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();state.deferredPrompt=e;$('#installBtn').hidden=false});
window.addEventListener('appinstalled',()=>$('#installBtn').hidden=true);
if('serviceWorker'in navigator)navigator.serviceWorker.register('service-worker.js').catch(()=>{});
initHistory();
load().catch(e=>console.error(e));
