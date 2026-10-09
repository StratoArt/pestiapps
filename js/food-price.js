/* PestiApps v0.25.0 — Food Price / PIHPS */
(function(){
'use strict';
const ITEMS=[
{key:'bawang-merah',icon:'🧅',label:'Bawang Merah',match:['bawang merah ukuran sedang'],source:'PIHPS'},
{key:'cabai-rawit',icon:'🌶️',label:'Cabai Rawit Merah',match:['cabai rawit merah'],source:'PIHPS'},
{key:'cabai-besar',icon:'🌶️',label:'Cabai Merah Besar',match:['cabai merah besar'],source:'PIHPS'},
{key:'gabah',icon:'🌾',label:'Gabah',match:[],source:'PENDING'},
{key:'beras',icon:'🍚',label:'Beras Medium I',match:['beras kualitas medium i','beras medium i'],source:'PIHPS'}
];
const PROVINCE_BI={'11':'1','12':'2','13':'3','14':'4','21':'5','15':'6','17':'7','16':'8','19':'9','18':'10','36':'11','32':'12','31':'13','33':'14','34':'15','35':'16','51':'17','52':'18','53':'19','61':'20','63':'21','62':'22','64':'23','65':'24','73':'26','74':'27','72':'28','71':'29','76':'30','81':'31','82':'32','94':'33','91':'34'};
const state={catalog:null,cache:new Map()};
const $=s=>document.querySelector(s);
const norm=s=>String(s||'').toLowerCase().replace(/\s+/g,' ').trim();
const money=n=>Number.isFinite(Number(n))?'Rp '+Number(n).toLocaleString('id-ID'):'—';
const esc=s=>String(s??'').replace(/[&<>'"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[m]));
async function catalog(){if(state.catalog)return state.catalog;const r=await fetch('assets/data/bi-hargapangan-commodities.json',{cache:'no-store'}),j=await r.json();state.catalog=j.data||[];return state.catalog;}
async function resolveItems(){const c=await catalog();return ITEMS.map(w=>{const item=c.find(x=>w.match.includes(norm(x.name)))||c.find(x=>w.match.some(m=>norm(x.name).includes(m)));return{...w,id:item?.id||'',actualName:item?.name||w.label};});}
function parsePrice(v){if(v===null||v===undefined||v==='-')return null;const n=Number(String(v).replace(/,/g,''));return Number.isFinite(n)?n:null;}
function dateCols(row){return Object.keys(row||{}).filter(k=>/^\d{2}\/\d{2}\/\d{4}$/.test(k)).sort((a,b)=>new Date(a.split('/').reverse().join('-'))-new Date(b.split('/').reverse().join('-')));}
function matchRegency(row,name){const a=norm(row?.name),b=norm(name).replace(/^kabupaten\s+/,'').replace(/^kab\.\s+/,'').replace(/^kota\s+/,'');return a===b||a.includes(b)||b.includes(a);}
async function fetchOne(item,loc){
if(!item.id && item.source==='PENDING'){
return{item,price:null,previous:null,date:null,scope:'unavailable',available:false,pending:true};
}
if(!item.id)return{item,price:null,previous:null,date:null,scope:'unavailable',available:false};

const provinceId=loc?.provinceCode?(PROVINCE_BI[loc.provinceCode]||'9999'):'9999';
const wantedRegency=loc?.regency||'';
const requestedScope=wantedRegency&&loc?.provinceCode?'regency':(loc?.provinceCode?'province':'national');

const cacheKey=[item.id,provinceId,requestedScope,wantedRegency].join('|');
if(state.cache.has(cacheKey))return state.cache.get(cacheKey);

const u='/api/food-prices?comcat_id='+encodeURIComponent(item.id)
+'&province_id='+encodeURIComponent(requestedScope==='national'?'9999':provinceId)
+'&showKota='+(requestedScope==='regency'?'true':'false')
+'&start_date='+encodeURIComponent(new Date(Date.now()-7*86400000).toISOString().slice(0,10))
+'&end_date='+encodeURIComponent(new Date().toISOString().slice(0,10));

const r=await fetch(u,{cache:'no-store'});
const j=await r.json();
if(!r.ok)throw new Error(j?.error||'HTTP '+r.status);

const rows=Array.isArray(j.data)?j.data:[];
const cols=dateCols(rows[0]||{});
const latest=cols.at(-1);
const prev=cols.at(-2);

let row=null;
let scope='unavailable';

if(requestedScope==='regency'){
  row=rows.find(x=>Number(x.level)===2&&matchRegency(x,wantedRegency));

  if(row){
    scope='regency';
  }else{
    // Jangan memberi label Kab/Kota kalau data lokal tidak tersedia.
    // Turun ke provinsi bila tersedia.
    row=rows.find(x=>Number(x.level)===1);
    if(row)scope='province';
  }
}else if(requestedScope==='province'){
  row=rows.find(x=>Number(x.level)===1);
  if(row)scope='province';
}else{
  row=rows.find(x=>norm(x.name)==='indonesia')
    ||rows.find(x=>Number(x.level)===0);
  if(row)scope='national';
}

const result={
  item,
  price:parsePrice(row?.[latest]),
  previous:parsePrice(row?.[prev]),
  date:latest||null,
  scope,
  available:!!row,
  pending:false
};

state.cache.set(cacheKey,result);
return result;
}

function renderHome(results,loc){const el=$('#homeFoodPricePanel');if(!el)return;const sourceLocations=results
  .filter(r=>r?.available&&r?.sourceLocation)
  .map(r=>r.sourceLocation)
  .filter(Boolean);
const actualHomeLocation=
  sourceLocations.find(x=>!/^semua provinsi$/i.test(x))
  || (loc?.province || 'ID Nasional');
const place='📍 '+actualHomeLocation;el.innerHTML='<div class="food-price-head"><div><span class="eyebrow">HARGA PANGAN HARI INI</span><strong>'+place+'</strong><small>Sumber utama: PIHPS — Bank Indonesia</small></div><button id="foodPriceDetail" type="button">Lihat detail →</button></div><div class="food-price-list">'+results.map(r=>'<div class="food-price-item"><span>'+r.item.icon+'</span><div><b>'+esc(r.item.label)+'</b><small>'+(r.scope==='regency'?'Kab/Kota':r.scope==='province'?'Provinsi':'Nasional')+'</small></div><strong>'+(r.pending?'Segera hadir':money(r.price))+'</strong></div>').join('')+'</div>';}
async function loadHome(){const el=$('#homeFoodPricePanel');if(!el)return;const loc=window.CropLocation?.get?.()||{};el.innerHTML='<div class="food-price-loading">Memuat harga pangan…</div>';try{const items=await resolveItems();const results=await Promise.all(items.map(x=>fetchOne(x,loc).catch(()=>({item:x,price:null,available:false,scope:'unavailable'}))));renderHome(results,loc);}catch(err){el.innerHTML='<div class="food-price-error">Harga pangan belum dapat dimuat. <button id="foodPriceRetry" type="button">Coba lagi</button></div>';}}
function detail(){if(typeof showScreen==='function')showScreen('food-prices');loadDetail();}
async function loadDetail(){const panel=$('#foodPriceDetailPanel');if(!panel)return;const loc=window.CropLocation?.get?.()||{};panel.innerHTML='<div class="empty">Memuat seluruh komoditas PIHPS…</div>';try{const c=await catalog(),items=c.filter(x=>x.cat_id).slice(0,80),rows=[];let cursor=0;async function worker(){while(cursor<items.length){const i=cursor++,item=items[i];try{rows[i]=await fetchOne({key:'catalog-'+i,icon:'',label:item.name,match:[],id:item.id,actualName:item.name},loc);}catch(_){rows[i]={item:{label:item.name},price:null,previous:null,available:false};}}}await Promise.all([worker(),worker(),worker(),worker()]);const actualLocations=rows.filter(Boolean).map(r=>r.sourceLocation).filter(Boolean);
const actualLocation=actualLocations.find(x=>!/^semua provinsi$/i.test(x)) || (loc.province || 'Nasional');
panel.innerHTML='<div class="food-detail-location"><b>'+esc(actualLocation)+'</b><small>PIHPS — Bank Indonesia · Pasar Tradisional</small></div><div class="food-detail-table"><table><thead><tr><th>Komoditas</th><th>Harga</th><th>Δ vs sebelumnya</th></tr></thead><tbody>'+rows.filter(Boolean).map(r=>{const delta=(Number.isFinite(r.price)&&Number.isFinite(r.previous))?r.price-r.previous:null;return'<tr><td>'+esc(r.item.label)+'</td><td><b>'+money(r.price)+'</b></td><td>'+(delta===null?'—':(delta>0?'+':'')+money(delta))+'</td></tr>';}).join('')+'</tbody></table></div><div class="food-source-note">Sumber: Pusat Informasi Harga Pangan Strategis (PIHPS) — Bank Indonesia. Data dapat diperbarui/revisi sesuai siklus PIHPS.</div>';}catch(err){panel.innerHTML='<div class="empty">Gagal memuat detail harga: '+esc(err?.message||'error')+'</div>';}}
window.PestiFoodPrice={loadHome,loadDetail};
let lastLocationKey='';
window.addEventListener('cropexpert:location-updated',e=>{
const d=e.detail||{};
const key=[d.lat,d.lon,d.adm4,d.regencyCode,d.provinceCode].join('|');
if(key===lastLocationKey)return;
lastLocationKey=key;
loadHome();
});
document.addEventListener('DOMContentLoaded',()=>{loadHome();document.addEventListener('click',e=>{if(e.target?.closest?.('#foodPriceDetail'))detail();if(e.target?.closest?.('#foodPriceRetry'))loadHome();if(e.target?.closest?.('#foodPriceRefresh'))loadDetail();});});
})();
