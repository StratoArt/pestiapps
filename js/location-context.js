/* PestiApps v0.25.0 — Shared Location Context */
(function(){
'use strict';
const STATE={lat:null,lon:null,village:'',district:'',regency:'',province:'',provinceCode:'',regencyCode:'',districtCode:'',adm4:'',source:'',ready:false,loading:false};
const PROVINCE_CODES={'aceh':'11','sumatera utara':'12','sumatera barat':'13','riau':'14','jambi':'15','sumatera selatan':'16','bengkulu':'17','lampung':'18','kepulauan bangka belitung':'19','kepulauan riau':'21','dki jakarta':'31','jakarta':'31','jawa barat':'32','jawa tengah':'33','di yogyakarta':'34','yogyakarta':'34','jawa timur':'35','banten':'36','bali':'51','nusa tenggara barat':'52','nusa tenggara timur':'53','kalimantan barat':'61','kalimantan tengah':'62','kalimantan selatan':'63','kalimantan timur':'64','kalimantan utara':'65','sulawesi utara':'71','sulawesi tengah':'72','sulawesi selatan':'73','sulawesi tenggara':'74','gorontalo':'75','sulawesi barat':'76','maluku':'81','maluku utara':'82','papua barat':'91','papua barat daya':'92','papua':'94','papua selatan':'95','papua tengah':'96','papua pegunungan':'97'};
const norm=s=>String(s||'').toLowerCase().replace(/^kabupaten\s+/,'').replace(/^kab\.\s+/,'').replace(/^kota\s+/,'').replace(/\s+/g,' ').trim();
const cleanProvince=s=>norm(s).replace(/^provinsi\s+/,'').trim();
function emit(){window.dispatchEvent(new CustomEvent('cropexpert:location-updated',{detail:{...STATE}}));}
function setState(p){Object.assign(STATE,p||{});STATE.ready=!!STATE.adm4||!!(STATE.regency&&STATE.province);emit();}
async function reverseBigDataCloud(lat,lon){const u='https://api.bigdatacloud.net/data/reverse-geocode-client?latitude='+encodeURIComponent(lat)+'&longitude='+encodeURIComponent(lon)+'&localityLanguage=id';const r=await fetch(u,{cache:'no-store'});if(!r.ok)throw new Error('Reverse geocoding HTTP '+r.status);return r.json();}
async function getEmsifaJson(path){const r=await fetch('https://www.emsifa.com/api-wilayah-indonesia/v2/'+path,{cache:'no-store'});if(!r.ok)throw new Error('Wilayah HTTP '+r.status);const j=await r.json();return Array.isArray(j?.data)?j.data:(j?.data?[j.data]:[]);}
function findName(list,name){const n=norm(name);if(!n)return null;return list.find(x=>norm(x.name)===n)||list.find(x=>norm(x.name).includes(n)||n.includes(norm(x.name)))||null;}
async function resolveADM4(reverse){
const li=reverse?.localityInfo?.administrative||[];
const village=reverse?.locality||li.find(x=>x.adminLevel===8)?.name||reverse?.city;
const district=li.find(x=>x.adminLevel===7)?.name||reverse?.district;
const regency=reverse?.city||li.find(x=>x.adminLevel===6)?.name||reverse?.county;
const province=reverse?.principalSubdivision||li.find(x=>x.adminLevel===4)?.name;
const provinceCode=PROVINCE_CODES[cleanProvince(province)];
if(!provinceCode)return{village,district,regency,province,adm4:''};
const regencies=await getEmsifaJson('regencies/'+provinceCode+'.json');
const reg=findName(regencies,regency);if(!reg)return{village,district,regency,province,provinceCode,adm4:''};
const districts=await getEmsifaJson('districts/'+reg.id+'.json');
const dis=findName(districts,district);if(!dis)return{village,district,regency,province,provinceCode,regencyCode:reg.id,adm4:''};
const villages=await getEmsifaJson('villages/'+dis.id+'.json');
const vil=findName(villages,village);
return{village:vil?.name||village||'',district:dis.name||district||'',regency:reg.name||regency||'',province:province||'',provinceCode,regencyCode:reg.id,districtCode:dis.id,adm4:vil?.id||''};
}
async function request(){
if(STATE.loading)return STATE;if(!navigator.geolocation)throw new Error('Geolocation tidak tersedia pada perangkat ini.');
STATE.loading=true;emit();
return new Promise((resolve,reject)=>{navigator.geolocation.getCurrentPosition(async pos=>{try{const lat=Number(pos.coords.latitude),lon=Number(pos.coords.longitude);const rev=await reverseBigDataCloud(lat,lon);const hierarchy=await resolveADM4(rev);setState({lat,lon,...hierarchy,source:'GPS + reverse geocoding',loading:false});try{localStorage.setItem('cropexpert_location',JSON.stringify(STATE));}catch(_){}resolve(STATE);}catch(err){STATE.loading=false;emit();reject(err);}},err=>{STATE.loading=false;emit();reject(new Error(err?.message||'Lokasi perangkat tidak dapat diakses.'));},{enableHighAccuracy:true,timeout:15000,maximumAge:300000});});
}
function restore(){try{const x=JSON.parse(localStorage.getItem('cropexpert_location')||'null');if(x&&Number.isFinite(x.lat)&&Number.isFinite(x.lon)){Object.assign(STATE,x);emit();}}catch(_){}}
window.CropLocation={state:STATE,request,restore,get:()=>({...STATE})};
document.addEventListener('DOMContentLoaded',restore);
})();
