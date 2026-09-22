const state={committee:'IRAC',data:null,opt:null,imageSources:null,control:null,eppoLinks:null,formulations:null,pesticideKnowledge:null,sources:null,agroKnowledge:null,fusarium:null,hamaSource:null,libraryFilter:'ALL',librarySearch:'',search:'',group:'ALL',screen:'home',type:'Hama',pestFilter:'Semua',formulationFilter:'ALL',formulationSearch:'',detailRef:null,deferredPrompt:null,historyReady:false,historyLock:false};
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>'"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[m]));
const splitAI=s=>String(s||'').split(';').map(x=>x.trim()).filter(Boolean);

async function load(){
  const [moa,opt,imageSources,control,eppoLinks,formulations,pesticideKnowledge,sources,agroKnowledge,fusarium,hamaSource]=await Promise.all([
    fetch('data/moa_master_2026.json').then(r=>r.json()),
    fetch('data/opt.json').then(r=>r.json()),
    fetch('data/image_sources.json').then(r=>r.json()),
    fetch('data/opt_control.json').then(r=>r.json()),
    fetch('data/eppo_links.json').then(r=>r.json()),
    fetch('data/formulations.json').then(r=>r.json()),
    fetch('data/pesticide_knowledge.json').then(r=>r.json()),
    fetch('data/sources.json').then(r=>r.json()),
    fetch('data/agrobiology_knowledge.json').then(r=>r.json()),
    fetch('data/fusarium_watermelon.json').then(r=>r.json()),
    fetch('data/hama_source_table.json').then(r=>r.json())
  ]);
  state.data=moa; state.opt=opt; state.imageSources=imageSources; state.control=control; state.eppoLinks=eppoLinks; state.formulations=formulations; state.pesticideKnowledge=pesticideKnowledge; state.sources=sources; state.agroKnowledge=agroKnowledge; state.fusarium=fusarium; state.hamaSource=hamaSource;
  updateHomeStats(); renderTypes(); renderPests(); renderDiseases(); renderWeeds(); renderCrops(); renderFormulations(); renderKnowledge(); renderSources(); renderLibrary(); render();
}
function rows(){return state.data?.records?.[state.committee]||[]}
function normalize(r){
  if(state.committee==='IRAC')return{code:r[1],name:r[2],sub:r[3],chem:r[4],ai:splitAI(r[5]),cat:r[6]};
  if(state.committee==='FRAC')return{code:r[1],name:r[2],sub:r[3],chem:r[4],ai:splitAI(r[5]),cat:r[6],risk:r[7]};
  return{code:r[1],legacy:r[2],name:r[3],chem:r[4],ai:splitAI(r[5])}
}
function filtered(){
  const q=state.search.toLowerCase();
  return rows().map(normalize).filter(x=>{
    const hay=[x.code,x.legacy,x.name,x.sub,x.chem,x.cat,x.risk,...x.ai].filter(Boolean).join(' ').toLowerCase();
    return(!q||hay.includes(q))&&(state.group==='ALL'||x.code===state.group)
  })
}
function groups(){return[...new Set(rows().map(normalize).map(x=>x.code))].filter(Boolean)}
function updateHomeStats(){
  const pests=state.opt.pests.length, diseases=state.opt.diseases.length, weeds=state.opt.weeds.length;
  $('#homeOpt').textContent=pests+diseases+weeds+'+';
  const all=['IRAC','FRAC','HRAC'].flatMap(c=>state.data?.records?.[c]||[]);
  $('#homeAI').textContent=[...new Set(all.flatMap(r=>splitAI(r[5])))].length+'+';
  $('#homeFormulations').textContent=(state.formulations?.items?.length||0)+'+';
}
function render(){
  if(state.screen!=='explore')return;
  $('#exploreTitle').textContent=state.committee;
  $('#exploreSub').textContent=state.committee==='IRAC'?'Insecticide · Acaricide · Nematicide':state.committee==='FRAC'?'Fungicide resistance & mode of action':'Herbicide mode of action';
  $('#activeCommittee').textContent=state.committee+' 2026';
  const gs=groups();
  $('#groupFilters').innerHTML='<button class="chip active" data-group="ALL">Semua</button>'+gs.map(g=>`<button class="chip" data-group="${esc(g)}">${esc(g)}</button>`).join('');
  $$('.chip').forEach(b=>b.addEventListener('click',()=>{state.group=b.dataset.group;$$('.chip').forEach(x=>x.classList.toggle('active',x===b));renderList()}));
  renderList();
}
function renderList(){
  const list=filtered();
  $('#resultCount').textContent=list.length;
  $('#cards').innerHTML=list.map((x,i)=>`<button class="moa-card" data-i="${i}">
    <div class="code">${esc(state.committee)}<strong>${esc(x.code)}</strong>${x.legacy?`<small>Legacy ${esc(x.legacy)}</small>`:''}</div>
    <div class="moa-main"><h3>${esc(x.name)}</h3><p>${esc(x.chem||x.sub||'')}</p><div class="ai-row">${x.ai.slice(0,4).map(a=>`<span>${esc(a)}</span>`).join('')}${x.ai.length>4?`<span>+${x.ai.length-4}</span>`:''}</div></div><span class="arrow">›</span>
  </button>`).join('')||'<div class="empty">Tidak ada data yang cocok.</div>';
  $$('.moa-card').forEach(b=>b.addEventListener('click',()=>openDetail(list[+b.dataset.i])));
}
function openDetail(x){
  state.detailRef={kind:'moa',id:x.code};
  if(state.historyReady && !state.historyLock) history.pushState({...navState(),detail:true,detailRef:state.detailRef},'',location.href);
  $('#detail').innerHTML=`<div class="detail-backdrop" id="detailBackdrop"></div><aside class="detail-sheet">
    <button class="close" id="closeDetail">×</button><div class="detail-code">${esc(state.committee)} · ${esc(x.code)}${x.legacy?` · Legacy ${esc(x.legacy)}`:''}</div>
    <h2>${esc(x.name)}</h2>${x.sub?`<p class="muted">${esc(x.sub)}</p>`:''}
    <div class="detail-grid"><div><label>Mode / target</label><strong>${esc(x.name)}</strong></div><div><label>Kelas kimia</label><strong>${esc(x.chem||'—')}</strong></div>${x.cat?`<div><label>Kategori</label><strong>${esc(x.cat)}</strong></div>`:''}${x.risk?`<div><label>Resistance risk</label><strong>${esc(x.risk)}</strong></div>`:''}</div>
    <h3>Active ingredients</h3><div class="ai-list">${x.ai.map(a=>`<span>${esc(a)}</span>`).join('')}</div>
    <p class="source-note">Referensi klasifikasi ${esc(state.committee)}. Gunakan sebagai referensi teknis dan selalu cek label serta registrasi lokal sebelum aplikasi.</p>
  </aside>`;
  $('#detailBackdrop').addEventListener('click',closeDetail);$('#closeDetail').addEventListener('click',closeDetail)
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
      else if(state.detailRef.kind==='moa'){ const x=filtered().find(x=>x.code===state.detailRef.id); if(x) openDetail(x); }
      else if(state.detailRef.kind==='opt'){ const pool=[...state.opt.pests,...state.opt.diseases,...state.opt.weeds]; const x=pool.find(x=>x.id===state.detailRef.id); if(x) openOptDetail(x,state.detailRef.type); }
      else if(state.detailRef.kind==='crop'){ const x=state.opt.crops.find(x=>x.id===state.detailRef.id); if(x) openCropDetail(x); }
      else if(state.detailRef.kind==='library'){ const x=libraryItemById(state.detailRef.id); if(x) openLibraryDetail(x); }
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
  const img=(x.images||[])[0];
  if(!img) return '';
  const src=img.local_path || img.remote_url;
  if(!src) return '';
  return `<div class="photo-card">
    <div class="photo-wrap"><img src="${esc(src)}" alt="Foto referensi ${esc(x.name)}" loading="lazy" onerror="this.closest('.photo-card').classList.add('photo-error')"><div class="photo-fallback"><img src="assets/opt/${esc(x.icon)}" alt=""><span>Foto tidak tersedia offline</span></div></div>
    <div class="photo-credit"><span><b>Foto referensi</b> · ${esc(img.license||'Lisensi tercantum pada sumber')}</span><a href="${esc(img.source_url)}" target="_blank" rel="noopener">Sumber ↗</a></div>
  </div>`;
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


function eppoBlock(x){
  const e=x.eppo || state.eppoLinks?.links?.[x.id];
  if(!e) return '';
  return `<section class="eppo-ref">
    <div class="eppo-ref-head">
      <div><strong>📷 Referensi Foto EPPO</strong><small>Foto tetap berada di EPPO Global Database</small></div>
      <button class="btn eppo-open" onclick="openEppoViewer('${esc(e.url)}','${esc(e.name)}')">Lihat di aplikasi</button>
    </div>
    <p>OPT Explorer tidak menyalin foto EPPO. Tombol di atas membuka halaman foto asli EPPO; jika embedding diblokir browser, tersedia tombol untuk membukanya langsung.</p>
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
    ${x.life?.length?`<h3>Siklus hidup</h3><div class="tag-row">${x.life.map(s=>`<span>${esc(s)}</span>`).join('')}</div>`:''}
    ${x.notes?`<p class="source-note">${esc(x.notes)}</p>`:''}
    ${controlBlock(x)}
    ${eppoBlock(x)}
  </aside>`;
  $('#detailBackdrop').addEventListener('click',closeDetail);$('#closeDetail').addEventListener('click',closeDetail)
}
function openCropDetail(crop){
  state.detailRef={kind:'crop',id:crop.id};
  if(state.historyReady && !state.historyLock) history.pushState({...navState(),detail:true,detailRef:state.detailRef},'',location.href);
  const related=[...state.opt.pests,...state.opt.diseases,...state.opt.weeds].filter(x=>(x.hosts||[]).some(h=>h.toLowerCase().includes(crop.name.split(' ')[0].toLowerCase())||crop.name.toLowerCase().includes(h.toLowerCase())));
  $('#detail').innerHTML=`<div class="detail-backdrop" id="detailBackdrop"></div><aside class="detail-sheet">
    <button class="close" id="closeDetail">×</button><div class="detail-code">Tanaman & Inang</div>
    <div style="text-align:center;margin:16px 0 6px"><img src="assets/opt/${esc(crop.icon)}" style="width:150px;height:130px;color:#0a7548"></div>
    <h2>${esc(crop.name)}</h2><p class="muted"><i>${esc(crop.latin)}</i></p>
    <h3>OPT terkait</h3><div class="opt-list">${related.slice(0,12).map(x=>`<div class="opt-card" style="cursor:default"><img src="assets/opt/${esc(x.icon)}"><div class="opt-main"><h3>${esc(x.name)}</h3><p>${esc(x.common)}</p><small>${esc(x.category||'')}</small></div></div>`).join('')||'<div class="empty">Belum ada relasi OPT.</div>'}</div>
  </aside>`;
  $('#detailBackdrop').addEventListener('click',closeDetail);$('#closeDetail').addEventListener('click',closeDetail)
}
function showScreen(id,opts={}){
  if(opts.history!==false) pushNav(id);
  $$('.screen').forEach(s=>s.classList.toggle('active-screen',s.id===id));
  $$('.bottom-nav button').forEach(b=>b.classList.toggle('active',b.dataset.go===id));
  state.screen=id; if(id==='explore')render();
  if(id==='types')renderTypes(); if(id==='calculators'&&window.renderCalculator)window.renderCalculator(); if(id==='pests')renderPests(); if(id==='formulations')renderFormulations(); if(id==='knowledge')renderKnowledge(); if(id==='sources')renderSources(); if(id==='library')renderLibrary();
  window.scrollTo({top:0,behavior:'smooth'});
}
function setCommittee(c){state.committee=c;state.group='ALL';state.search='';$('#search').value='';$$('.committee-tabs button').forEach(x=>x.classList.toggle('active',x.dataset.c===c));render()}
$$('[data-go]').forEach(b=>b.addEventListener('click',()=>{
  if(b.dataset.committee)setCommittee(b.dataset.committee);
  if(b.classList.contains('back-button') && state.historyReady && history.length>1){ history.back(); return; }
  showScreen(b.dataset.go);
}));
$$('.committee-tabs button').forEach(b=>b.addEventListener('click',()=>setCommittee(b.dataset.c)));
$$('.mini-tabs button[data-type]').forEach(b=>b.addEventListener('click',()=>{state.type=b.dataset.type;$$('.mini-tabs button[data-type]').forEach(x=>x.classList.toggle('active',x===b));renderTypes()}));
$$('.pest-tabs button').forEach(b=>b.addEventListener('click',()=>{state.pestFilter=b.dataset.pestFilter;renderPests()}));
$('#search').addEventListener('input',e=>{state.search=e.target.value;renderList()});$('#clearSearch').addEventListener('click',()=>{$('#search').value='';state.search='';renderList()});$('#focusSearch').addEventListener('click',()=>$('#search').focus());
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
$('#librarySearch').addEventListener('input',e=>{state.librarySearch=e.target.value;renderLibrary()});
$('#clearLibrarySearch').addEventListener('click',()=>{$('#librarySearch').value='';state.librarySearch='';renderLibrary()});
$$('.library-tabs button').forEach(b=>b.addEventListener('click',()=>{state.libraryFilter=b.dataset.libraryFilter;renderLibrary()}));
$('#librarySearchBtn').addEventListener('click',()=>$('#librarySearch').focus());
$('#menuBtn').addEventListener('click',()=>showScreen('menu'));
$('#menuTheme').addEventListener('click',()=>document.documentElement.classList.toggle('dark'));
$('#themeBtn').addEventListener('click',()=>document.documentElement.classList.toggle('dark'));
$('#installBtn').addEventListener('click',async()=>{if(state.deferredPrompt){await state.deferredPrompt.prompt();state.deferredPrompt=null}else alert('Gunakan menu Chrome → Tambahkan ke layar utama untuk memasang aplikasi.')});
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();state.deferredPrompt=e;$('#installBtn').hidden=false});
window.addEventListener('appinstalled',()=>$('#installBtn').hidden=true);
if('serviceWorker'in navigator)navigator.serviceWorker.register('service-worker.js').catch(()=>{});
initHistory();
load().catch(e=>console.error(e));
