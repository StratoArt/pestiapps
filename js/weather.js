/* Crop Expert v0.23.2 — Weather & Spray Assist */
(function(){
  const W={lat:null,lon:null,name:'Lokasi perangkat',data:null};
  const $=s=>document.querySelector(s);
  const f=(v,d=0)=>Number.isFinite(v)?Number(v).toLocaleString('id-ID',{maximumFractionDigits:d}):'—';
  const esc=s=>String(s??'').replace(/[&<>'"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[m]));
  function wmo(code){const m={0:'Cerah',1:'Cerah berawan',2:'Berawan sebagian',3:'Mendung',45:'Kabut',48:'Kabut',51:'Gerimis ringan',53:'Gerimis',55:'Gerimis lebat',61:'Hujan ringan',63:'Hujan sedang',65:'Hujan lebat',71:'Salju ringan',73:'Salju',75:'Salju lebat',80:'Hujan singkat',81:'Hujan singkat',82:'Hujan singkat lebat',95:'Badai petir',96:'Badai petir + es',99:'Badai petir + es'};return m[code]||'Kondisi cuaca';}
  function sprayStatus(h,i){
    const rain=h.precipitation_probability??100, precip=h.precipitation??99, wind=h.wind_speed_10m??99, temp=h.temperature_2m??99;
    const nextRain=i<2 ? (W.data?.hourly?.precipitation_probability||[]).slice(i,i+3).reduce((a,b)=>Math.max(a,b||0),0) : rain;
    if(precip>0.2 || nextRain>=60) return ['Tunda','Potensi hujan/air bebas cukup tinggi','bad'];
    if(wind>20) return ['Kurang ideal','Angin cukup tinggi untuk aplikasi semprot','warn'];
    if(temp<18 || temp>34) return ['Kurang ideal','Suhu di luar rentang kerja indikator','warn'];
    if(wind<=15 && nextRain<30 && temp>=18 && temp<=32) return ['Jendela cukup baik','Cuaca relatif mendukung perencanaan aplikasi','good'];
    return ['Perlu cek','Kondisi campuran; cek lapangan dan label','warn'];
  }
  function hourlyCards(){
    const h=W.data?.hourly;if(!h)return '';
    const times=h.time||[], out=[]; const now=Date.now();
    for(let i=0;i<times.length&&out.length<8;i++){
      const t=new Date(times[i]).getTime(); if(t<now-30*60*1000)continue;
      const s=sprayStatus({precipitation_probability:h.precipitation_probability?.[i],precipitation:h.precipitation?.[i],wind_speed_10m:h.wind_speed_10m?.[i],temperature_2m:h.temperature_2m?.[i]},i);
      out.push(`<div class="weather-hour"><strong>${new Date(times[i]).toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'})}</strong><span>${f(h.temperature_2m?.[i],0)}°C</span><small>${wmo(h.weather_code?.[i])}</small><em class="${s[2]}">${s[0]}</em><small>RH ${f(h.relative_humidity_2m?.[i],0)}% · angin ${f(h.wind_speed_10m?.[i],0)} km/jam</small></div>`);
    }
    return out.join('');
  }
  function render(){
    const p=$('#weatherPanel');if(!p)return;
    if(!W.data){p.innerHTML='<div class="empty">Aktifkan lokasi perangkat untuk memuat cuaca lokal.</div>';return;}
    const c=W.data.current||{}; const s=sprayStatus(c,0);
    p.innerHTML=`<div class="weather-current"><div><span class="eyebrow">LOKASI</span><h2>${esc(W.name)}</h2><small>${f(W.lat,4)}, ${f(W.lon,4)}</small></div><div class="weather-temp"><b>${f(c.temperature_2m,0)}°C</b><span>${wmo(c.weather_code)}</span></div></div>
      <div class="weather-metrics"><div><b>${f(c.relative_humidity_2m,0)}%</b><span>Kelembapan</span></div><div><b>${f(c.wind_speed_10m,0)} km/jam</b><span>Angin</span></div><div><b>${f(c.precipitation,1)} mm</b><span>Presipitasi</span></div></div>
      <div class="spray-assist ${s[2]}"><div><span class="eyebrow">SPRAY ASSIST</span><h3>${s[0]}</h3><p>${s[1]}</p></div><div class="assist-badge">${s[2]==='good'?'✓':'!'}</div></div>
      <h3 class="weather-subhead">Perkiraan jam terdekat</h3><div class="weather-hours">${hourlyCards()}</div>
      <div class="source-note">Data cuaca berasal dari Open-Meteo. Indikator Spray Assist adalah penyaring kondisi cuaca umum dan tidak menggantikan label, kalibrasi alat, pengamatan lapangan, atau keputusan agronomis.</div>`;
  }
  async function load(lat,lon){
    const p=$('#weatherPanel');if(p)p.innerHTML='<div class="empty">Memuat cuaca lokal…</div>';
    try{
      const u=`https://api.open-meteo.com/v1/forecast?latitude=${encodeURIComponent(lat)}&longitude=${encodeURIComponent(lon)}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,weather_code,wind_speed_10m&forecast_days=2&timezone=auto`;
      const r=await fetch(u);if(!r.ok)throw new Error('weather'); W.data=await r.json(); W.lat=lat;W.lon=lon; render();
    }catch(e){if(p)p.innerHTML='<div class="calc-error">Cuaca belum bisa dimuat. Cek koneksi internet atau coba lagi.</div>';}
  }
  function locate(){
    if(!navigator.geolocation){alert('Browser ini tidak menyediakan lokasi perangkat.');return;}
    navigator.geolocation.getCurrentPosition(pos=>load(pos.coords.latitude,pos.coords.longitude),()=>alert('Izin lokasi ditolak atau tidak tersedia. Kamu bisa memasukkan koordinat secara manual.'));
  }
  function manual(){
    const lat=prompt('Masukkan latitude, contoh -7.6020'); if(lat===null)return;
    const lon=prompt('Masukkan longitude, contoh 111.9040'); if(lon===null)return;
    const a=parseFloat(lat),b=parseFloat(lon); if(!Number.isFinite(a)||!Number.isFinite(b)||a<-90||a>90||b<-180||b>180){alert('Koordinat tidak valid.');return;} W.name='Koordinat manual'; load(a,b);
  }
  function open(){if(typeof showScreen==='function')showScreen('weather');if(!W.data)locate();}
  window.renderWeather=render;
  window.addEventListener('DOMContentLoaded',()=>{
    $('#weatherLocate')?.addEventListener('click',locate);$('#weatherManual')?.addEventListener('click',manual);$('#weatherRefresh')?.addEventListener('click',()=>{if(W.lat!==null)load(W.lat,W.lon);else locate();});$('#openWeather')?.addEventListener('click',open);
    if(location.hash==='#weather')setTimeout(open,0);
  });
  if(document.readyState!=='loading')setTimeout(()=>$('#openWeather')?.addEventListener('click',open),0);
})();
