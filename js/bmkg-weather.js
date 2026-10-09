/* PestiApps v0.25.0 — BMKG Weather */
(function(){
'use strict';
const S={data:null,loading:false,error:null};
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>'"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[m]));
const fmt=n=>Number.isFinite(Number(n))?Number(n).toLocaleString('id-ID'):'—';
const flat=()=>{const g=S.data?.data?.[0]?.cuaca;return Array.isArray(g)?g.flat().filter(Boolean):[];};
const icon=s=>{s=String(s||'').toLowerCase();if(s.includes('badai')||s.includes('petir'))return'⛈️';if(s.includes('hujan'))return'🌧️';if(s.includes('berawan'))return'☁️';if(s.includes('kabut'))return'🌫️';if(s.includes('cerah'))return'☀️';return'🌤️';};
function card(x){
  const img=x?.image||'';
  const dt=x?.local_datetime||x?.datetime||'';
  let dateLabel='-',timeLabel='-';
  try{
    const d=new Date(dt);
    if(!Number.isNaN(d.getTime())){
      dateLabel=d.toLocaleDateString('id-ID',{
        weekday:'short',
        day:'2-digit',
        month:'short'
      });
      timeLabel=d.toLocaleTimeString('id-ID',{
        hour:'2-digit',
        minute:'2-digit',
        hour12:false
      });
    }else{
      timeLabel=dt.slice(11,16)||'-';
    }
  }catch(_){
    timeLabel=dt.slice(11,16)||'-';
  }

  return '<article class="bmkg-hour-card">'+
    '<small>'+esc(dateLabel)+' · '+esc(timeLabel)+'</small>'+
    (img?'<img src="'+esc(img)+'" alt="'+esc(x.weather_desc||'Cuaca')+'" loading="lazy">':'<span class="bmkg-weather-emoji">'+icon(x.weather_desc)+'</span>')+
    '<strong>'+fmt(x.t)+'°C</strong>'+
    '<span>'+esc(x.weather_desc||'-')+'</span>'+
    '<em>RH '+fmt(x.hu)+'%</em>'+
    '<em>💧 '+fmt(x.tp)+' mm</em>'+
    '<em>💨 '+fmt(x.ws)+' km/j</em>'+
  '</article>';
}

function renderHome(){const el=$('#homeWeatherPanel');if(!el)return;if(!S.data){el.innerHTML='<div class="home-weather-empty"><span>🌦️</span><div><b>Cuaca lokal</b><small>Gunakan lokasi untuk memuat prakiraan BMKG.</small></div><button id="homeWeatherDetail" type="button">Lihat detail</button></div>';return;}const loc=S.data.lokasi||{},now=flat()[0]||{},img=now.image||'';el.innerHTML='<div class="home-weather-bmkg"><div class="home-weather-place"><span>📍</span><div><b>'+esc(loc.desa||'Lokasi Anda')+'</b><small>'+esc((loc.kecamatan?'Kec. '+loc.kecamatan+', ':'')+(loc.kotkab||'')+(loc.provinsi?', '+loc.provinsi:''))+'</small></div><button id="homeWeatherDetail" type="button">Detail</button></div><div class="home-weather-main"><div class="home-weather-temp">'+fmt(now.t)+'°</div>'+(img?'<img src="'+esc(img)+'" alt="'+esc(now.weather_desc||'Cuaca')+'">':'<span>'+icon(now.weather_desc)+'</span>')+'<div><strong>'+esc(now.weather_desc||'—')+'</strong><small>BMKG · prakiraan lokal</small></div></div><div class="home-weather-metrics"><span>💧 '+fmt(now.hu)+'%</span><span>💨 '+fmt(now.ws)+' km/j</span><span>🌧️ '+fmt(now.tp)+' mm</span></div></div>';}
function render(){const panel=$('#bmkgWeatherPanel');if(!panel)return;if(S.loading){panel.innerHTML='<div class="empty">Memuat prakiraan BMKG…</div>';return;}if(S.error){panel.innerHTML='<div class="empty">Gagal memuat BMKG: '+esc(S.error)+'</div>';return;}if(!S.data){panel.innerHTML='<div class="empty">Aktifkan lokasi perangkat untuk memuat cuaca BMKG.</div>';return;}const loc=S.data.lokasi||{},rows=flat(),now=rows[0]||{},img=now.image||'';
const firstDt=new Date(now.local_datetime||now.datetime||Date.now());
const horizonEnd=new Date(firstDt.getTime()+72*60*60*1000);
const forecastRows=rows.filter(x=>{
  const d=new Date(x.local_datetime||x.datetime||'');
  return !Number.isNaN(d.getTime()) && d>=firstDt && d<=horizonEnd;
});
panel.innerHTML='<div class="bmkg-location-card"><span>📍</span><div><strong>Lokasi Anda</strong><b>'+esc(loc.desa||'—')+'</b><small>'+esc(loc.kecamatan?'Kec. '+loc.kecamatan:'')+'</small><small>'+esc(loc.kotkab||'')+(loc.provinsi?', '+esc(loc.provinsi):'')+'</small></div></div><div class="bmkg-current"><div class="bmkg-temp">'+fmt(now.t)+'°<small>C</small></div>'+(img?'<img src="'+esc(img)+'" alt="'+esc(now.weather_desc||'Cuaca')+'">':'<span class="bmkg-big-emoji">'+icon(now.weather_desc)+'</span>')+'<strong>'+esc(now.weather_desc||'—')+'</strong></div><div class="bmkg-metrics"><div><span>💧</span><b>'+fmt(now.hu)+'%</b><small>Kelembapan</small></div><div><span>💨</span><b>'+fmt(now.ws)+' km/j</b><small>Angin</small></div><div><span>🌧️</span><b>'+fmt(now.tp)+' mm</b><small>Curah hujan</small></div></div><div class="bmkg-section-title"><strong>Prakiraan 3 jam</strong><small>BMKG</small></div><div class="bmkg-hour-grid">'+forecastRows.map(card).join('')+'</div><div class="bmkg-source">Sumber data: <b>BMKG (Badan Meteorologi, Klimatologi, dan Geofisika)</b></div>';}
async function load(adm4){if(!adm4)return;S.loading=true;S.error=null;render();try{const r=await fetch('/api/bmkg-weather?adm4='+encodeURIComponent(adm4),{cache:'no-store'}),j=await r.json();if(!r.ok)throw new Error(j?.error||'HTTP '+r.status);S.data=j;renderHome();}catch(err){S.error=err?.message||'Gagal mengambil BMKG';}finally{S.loading=false;render();}}
function open(){if(typeof showScreen==='function')showScreen('weather');const loc=window.CropLocation?.get?.()||{};if(loc.adm4)load(loc.adm4);else window.CropLocation?.request?.().catch(()=>{});}
window.renderBMKG=render;window.loadBMKG=load;
window.addEventListener('cropexpert:location-updated',e=>{const d=e.detail||{};if(d.adm4)load(d.adm4);});
document.addEventListener('DOMContentLoaded',()=>{document.addEventListener('click',e=>{if(e.target?.closest?.('#homeWeatherDetail'))open();});renderHome();});
})();
