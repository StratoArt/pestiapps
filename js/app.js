const state={committee:'IRAC',data:null,opt:null,imageSources:null,search:'',group:'ALL',screen:'home',type:'Hama',pestFilter:'Semua',deferredPrompt:null};
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>'"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[m]));
const splitAI=s=>String(s||'').split(';').map(x=>x.trim()).filter(Boolean);

async function load(){
  const [moa,opt,imageSources]=await Promise.all([
    fetch('data/moa_master_2026.json').then(r=>r.json()),
    fetch('data/opt.json').then(r=>r.json()),
    fetch('data/image_sources.json').then(r=>r.json())
  ]);
  state.data=moa; state.opt=opt; state.imageSources=imageSources;
  updateHomeStats(); renderTypes(); renderPests(); renderDiseases(); renderWeeds(); renderCrops(); render();
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
  $('#detail').innerHTML=`<div class="detail-backdrop" id="detailBackdrop"></div><aside class="detail-sheet">
    <button class="close" id="closeDetail">×</button><div class="detail-code">${esc(state.committee)} · ${esc(x.code)}${x.legacy?` · Legacy ${esc(x.legacy)}`:''}</div>
    <h2>${esc(x.name)}</h2>${x.sub?`<p class="muted">${esc(x.sub)}</p>`:''}
    <div class="detail-grid"><div><label>Mode / target</label><strong>${esc(x.name)}</strong></div><div><label>Kelas kimia</label><strong>${esc(x.chem||'—')}</strong></div>${x.cat?`<div><label>Kategori</label><strong>${esc(x.cat)}</strong></div>`:''}${x.risk?`<div><label>Resistance risk</label><strong>${esc(x.risk)}</strong></div>`:''}</div>
    <h3>Active ingredients</h3><div class="ai-list">${x.ai.map(a=>`<span>${esc(a)}</span>`).join('')}</div>
    <p class="source-note">Referensi klasifikasi ${esc(state.committee)}. Gunakan sebagai referensi teknis dan selalu cek label serta registrasi lokal sebelum aplikasi.</p>
  </aside>`;
  $('#detailBackdrop').addEventListener('click',closeDetail);$('#closeDetail').addEventListener('click',closeDetail)
}
function closeDetail(){$('#detail').innerHTML=''}
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
function openOptDetail(x,type){
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
  </aside>`;
  $('#detailBackdrop').addEventListener('click',closeDetail);$('#closeDetail').addEventListener('click',closeDetail)
}
function openCropDetail(crop){
  const related=[...state.opt.pests,...state.opt.diseases,...state.opt.weeds].filter(x=>(x.hosts||[]).some(h=>h.toLowerCase().includes(crop.name.split(' ')[0].toLowerCase())||crop.name.toLowerCase().includes(h.toLowerCase())));
  $('#detail').innerHTML=`<div class="detail-backdrop" id="detailBackdrop"></div><aside class="detail-sheet">
    <button class="close" id="closeDetail">×</button><div class="detail-code">Tanaman & Inang</div>
    <div style="text-align:center;margin:16px 0 6px"><img src="assets/opt/${esc(crop.icon)}" style="width:150px;height:130px;color:#0a7548"></div>
    <h2>${esc(crop.name)}</h2><p class="muted"><i>${esc(crop.latin)}</i></p>
    <h3>OPT terkait</h3><div class="opt-list">${related.slice(0,12).map(x=>`<div class="opt-card" style="cursor:default"><img src="assets/opt/${esc(x.icon)}"><div class="opt-main"><h3>${esc(x.name)}</h3><p>${esc(x.common)}</p><small>${esc(x.category||'')}</small></div></div>`).join('')||'<div class="empty">Belum ada relasi OPT.</div>'}</div>
  </aside>`;
  $('#detailBackdrop').addEventListener('click',closeDetail);$('#closeDetail').addEventListener('click',closeDetail)
}
function showScreen(id){
  $$('.screen').forEach(s=>s.classList.toggle('active-screen',s.id===id));
  $$('.bottom-nav button').forEach(b=>b.classList.toggle('active',b.dataset.go===id));
  state.screen=id; if(id==='explore')render();
  if(id==='types')renderTypes(); if(id==='pests')renderPests();
  window.scrollTo({top:0,behavior:'smooth'})
}
function setCommittee(c){state.committee=c;state.group='ALL';state.search='';$('#search').value='';$$('.committee-tabs button').forEach(x=>x.classList.toggle('active',x.dataset.c===c));render()}
$$('[data-go]').forEach(b=>b.addEventListener('click',()=>{if(b.dataset.committee)setCommittee(b.dataset.committee);showScreen(b.dataset.go)}));
$$('.committee-tabs button').forEach(b=>b.addEventListener('click',()=>setCommittee(b.dataset.c)));
$$('.mini-tabs button[data-type]').forEach(b=>b.addEventListener('click',()=>{state.type=b.dataset.type;$$('.mini-tabs button[data-type]').forEach(x=>x.classList.toggle('active',x===b));renderTypes()}));
$$('.pest-tabs button').forEach(b=>b.addEventListener('click',()=>{state.pestFilter=b.dataset.pestFilter;renderPests()}));
$('#search').addEventListener('input',e=>{state.search=e.target.value;renderList()});$('#clearSearch').addEventListener('click',()=>{$('#search').value='';state.search='';renderList()});$('#focusSearch').addEventListener('click',()=>$('#search').focus());
$('#optSearch').addEventListener('input',e=>{
  const q=e.target.value.toLowerCase();
  $$('#typeGrid .type-card').forEach(card=>card.style.display=card.textContent.toLowerCase().includes(q)?'':'none')
});
$('#clearOptSearch').addEventListener('click',()=>{$('#optSearch').value='';$$('#typeGrid .type-card').forEach(c=>c.style.display='')});
$('#menuBtn').addEventListener('click',()=>showScreen('menu'));
$('#menuTheme').addEventListener('click',()=>document.documentElement.classList.toggle('dark'));
$('#themeBtn').addEventListener('click',()=>document.documentElement.classList.toggle('dark'));
$('#installBtn').addEventListener('click',async()=>{if(state.deferredPrompt){await state.deferredPrompt.prompt();state.deferredPrompt=null}else alert('Gunakan menu Chrome → Tambahkan ke layar utama untuk memasang aplikasi.')});
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();state.deferredPrompt=e;$('#installBtn').hidden=false});
window.addEventListener('appinstalled',()=>$('#installBtn').hidden=true);
if('serviceWorker'in navigator)navigator.serviceWorker.register('service-worker.js').catch(()=>{});
load().catch(e=>console.error(e));
