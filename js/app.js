const state={committee:'IRAC',data:null,search:'',group:'ALL',deferredPrompt:null};
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>'"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[m]));
const splitAI=s=>String(s||'').split(';').map(x=>x.trim()).filter(Boolean);

async function load(){
  const r=await fetch('data/moa_master_2026.json'); state.data=await r.json();
  render();
}
function rows(){return state.data?.records?.[state.committee]||[]}
function normalize(r){
  if(state.committee==='IRAC') return {code:r[1],name:r[2],sub:r[3],chem:r[4],ai:splitAI(r[5]),cat:r[6]};
  if(state.committee==='FRAC') return {code:r[1],name:r[2],sub:r[3],chem:r[4],ai:splitAI(r[5]),cat:r[6],risk:r[7]};
  return {code:r[1],legacy:r[2],name:r[3],chem:r[4],ai:splitAI(r[5])};
}
function filtered(){
 const q=state.search.toLowerCase();
 return rows().map(normalize).filter(x=>{
   const hay=[x.code,x.legacy,x.name,x.sub,x.chem,x.cat,...x.ai].filter(Boolean).join(' ').toLowerCase();
   return (!q||hay.includes(q)) && (state.group==='ALL'||x.code===state.group);
 });
}
function groups(){return [...new Set(rows().map(normalize).map(x=>x.code))].filter(Boolean)}
function render(){
  $('#committeeTitle').textContent=state.committee;
  $('#committeeDesc').textContent=state.committee==='IRAC'?'Insecticide · Acaricide · Nematicide':state.committee==='FRAC'?'Fungicide resistance & mode of action':'Herbicide mode of action';
  $('#count').textContent=rows().length;
  $('#aiTotal').textContent=[...new Set(rows().flatMap(r=>{let x=normalize(r);return x.ai}))].length;
  const gs=groups();
  $('#groupFilters').innerHTML='<button class="chip active" data-group="ALL">Semua</button>'+gs.map(g=>`<button class="chip" data-group="${esc(g)}">${esc(g)}</button>`).join('');
  $('#groupFilters').addEventListener('click',e=>{const b=e.target.closest('.chip');if(!b)return;state.group=b.dataset.group;$$('.chip').forEach(x=>x.classList.toggle('active',x===b));renderList()});
  renderList();
}
function renderList(){
 const list=filtered(); $('#resultCount').textContent=list.length;
 $('#cards').innerHTML=list.map((x,i)=>`<button class="moa-card" data-i="${i}"><div class="code">${esc(state.committee)} <strong>${esc(x.code)}</strong>${x.legacy?`<small>Legacy ${esc(x.legacy)}</small>`:''}</div><div class="moa-main"><h3>${esc(x.name)}</h3><p>${esc(x.chem||x.sub||'')}</p><div class="ai-row">${x.ai.slice(0,5).map(a=>`<span>${esc(a)}</span>`).join('')}${x.ai.length>5?`<span>+${x.ai.length-5}</span>`:''}</div></div><span class="arrow">›</span></button>`).join('')||'<div class="empty">Tidak ada data yang cocok.</div>';
 $$('.moa-card').forEach(b=>b.addEventListener('click',()=>openDetail(list[+b.dataset.i])));
}
function openDetail(x){
 $('#detail').innerHTML=`<div class="detail-backdrop" id="detailBackdrop"></div><aside class="detail-sheet"><button class="close" id="closeDetail">×</button><div class="detail-code">${esc(state.committee)} <b>${esc(x.code)}</b>${x.legacy?` · Legacy ${esc(x.legacy)}`:''}</div><h2>${esc(x.name)}</h2>${x.sub?`<p class="muted">${esc(x.sub)}</p>`:''}<div class="detail-grid"><div><label>Target / proses</label><strong>${esc(x.name)}</strong></div><div><label>Kelas kimia</label><strong>${esc(x.chem||'—')}</strong></div>${x.cat?`<div><label>Kategori</label><strong>${esc(x.cat)}</strong></div>`:''}${x.risk?`<div><label>Resistance risk</label><strong>${esc(x.risk)}</strong></div>`:''}</div><h3>Active ingredients</h3><div class="ai-list">${x.ai.map(a=>`<span>${esc(a)}</span>`).join('')}</div><p class="source-note">Referensi klasifikasi resmi ${esc(state.committee)}. Selalu cek label dan registrasi lokal untuk penggunaan produk.</p></aside>`;
 $('#detailBackdrop').addEventListener('click',closeDetail); $('#closeDetail').addEventListener('click',closeDetail); $('#detail').classList.add('show');
}
function closeDetail(){ $('#detail').classList.remove('show'); setTimeout(()=>$('#detail').innerHTML='',180); }
function setCommittee(c){state.committee=c;state.group='ALL';state.search='';$('#search').value='';$$('.tab').forEach(x=>x.classList.toggle('active',x.dataset.c===c));render();}

$('#search').addEventListener('input',e=>{state.search=e.target.value;renderList()});
$$('.tab').forEach(b=>b.addEventListener('click',()=>setCommittee(b.dataset.c)));
$('#themeBtn').addEventListener('click',()=>document.documentElement.classList.toggle('dark'));
$('#installBtn').addEventListener('click',async()=>{if(state.deferredPrompt){state.deferredPrompt.prompt();state.deferredPrompt=null}else alert('Gunakan menu Chrome → Tambahkan ke layar utama untuk memasang aplikasi.')});
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();state.deferredPrompt=e;$('#installBtn').hidden=false});
window.addEventListener('appinstalled',()=>$('#installBtn').hidden=true);
if('serviceWorker' in navigator) navigator.serviceWorker.register('service-worker.js').catch(()=>{});
load().catch(err=>{$('#cards').innerHTML='<div class="empty">Database gagal dimuat. Pastikan website dibuka melalui hosting/server, bukan file://.</div>';console.error(err)});
