/* OPT Explorer v0.12 — Calculator Suite
   Calculation aid only. It does not prescribe products, doses, intervals, PHI or PPE. */
(function(){
  const C={tab:'area'};
  const $=s=>document.querySelector(s);
  const esc=s=>String(s??'').replace(/[&<>'"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[m]));
  const n=v=>{const x=parseFloat(v);return Number.isFinite(x)?x:null};
  const f=(v,d=2)=>Number.isFinite(v)?v.toLocaleString('id-ID',{maximumFractionDigits:d}):'—';
  const field=(label,id,placeholder='',unit='',extra='')=>`<div class="calc-field ${extra}"><label for="${id}">${esc(label)}${unit?` (${esc(unit)})`:''}</label><input id="${id}" type="number" inputmode="decimal" min="0" step="any" placeholder="${esc(placeholder)}"></div>`;
  const select=(label,id,options,extra='')=>`<div class="calc-field ${extra}"><label for="${id}">${esc(label)}</label><select id="${id}">${options.map(([v,t])=>`<option value="${esc(v)}">${esc(t)}</option>`).join('')}</select></div>`;
  const panel=(title,desc,body,button='Hitung')=>`<div class="calc-panel"><h2>${title}</h2><p>${desc}</p><div class="calc-grid">${body}</div><div class="calc-actions"><button class="calc-btn" id="calcRun">${button}</button><button class="calc-btn secondary" id="calcReset">Reset</button></div><div id="calcOutput"></div></div>`;
  function result(title,items,formula=''){return `<div class="calc-result"><h3>${esc(title)}</h3><div class="calc-result-grid">${items.map(x=>`<div><span>${esc(x[0])}</span><b>${esc(x[1])}</b></div>`).join('')}</div>${formula?`<div class="formula">${formula}</div>`:''}</div>`}
  function error(msg){return `<div class="calc-error">${esc(msg)}</div>`}
  function render(){
    const p=$('#calculatorPanel'); if(!p)return;
    const tabs=[['area','📐 Area'],['spray','💧 Spray'],['dose','🧪 Dosis'],['backpack','🎒 Backpack'],['sprayer','🚜 Sprayer'],['tank','🧴 / Tank'],['granule','🌾 Granule'],['ai','⚗️ AI'],['seed','🌱 Seed']];
    $$('#calcTabs button').forEach(b=>b.classList.toggle('active',b.dataset.calc===C.tab));
    let html='';
    if(C.tab==='area') html=panel('Area Calculator','Hitung luas lahan dari bentuk sederhana atau bedengan.',select('Bentuk','shape',[['rect','Persegi panjang'],['square','Persegi'],['triangle','Segitiga'],['circle','Lingkaran'],['bed','Bedengan / jumlah unit']], 'full')+field('Panjang','a','0','m')+field('Lebar','b','0','m')+field('Jumlah bedengan','count','0','unit')+field('Radius','r','0','m')+`<div class="calc-field full calc-subtle">Untuk bedengan: panjang × lebar × jumlah bedengan. Untuk segitiga: ½ × alas × tinggi.</div>`);
    if(C.tab==='spray') html=panel('Spray Volume Calculator','Hitung total larutan semprot, jumlah tank, kapasitas area per tank, dan sisa tank terakhir.',field('Luas lahan','area','0','ha')+field('Volume aplikasi','rate','0','L/ha')+field('Kapasitas tangki','tank','0','L')+`<div class="calc-field full calc-subtle">Volume aplikasi sebaiknya berasal dari label atau hasil kalibrasi alat.</div>`);
    if(C.tab==='dose') html=panel('Dose Calculator','Pilih cara label dinyatakan. Kalkulator hanya menghitung angka yang kamu masukkan.',select('Basis label','basis',[['area','Per area (ml/L/ha, g/L/ha, L/ha, kg/ha)'],['volume','Per volume air (ml/L atau g/L)']],'full')+field('Luas lahan','area','0','ha')+field('Spray volume','spray','0','L/ha')+field('Kapasitas tangki','tank','0','L')+select('Unit dosis','unit',[['ml/ha','ml/ha'],['L/ha','L/ha'],['g/ha','g/ha'],['kg/ha','kg/ha'],['ml/L','ml/L'],['g/L','g/L']])+field('Angka dosis label','dose','0','')+`<div class="calc-field full calc-subtle">Untuk basis per-volume, total produk = konsentrasi label × total air. Untuk basis per-area, produk per tank = dosis area × kapasitas tank / spray volume.</div>`);
    if(C.tab==='backpack') html=panel('Backpack Calibration','Kalibrasi sederhana berdasarkan volume air yang benar-benar habis pada area uji.',field('Luas area uji','area','0','m²')+field('Air yang digunakan','water','0','L')+field('Kapasitas tangki','tank','0','L')+`<div class="calc-field full calc-subtle">Metode area/volume: isi sprayer, semprot dengan pola kerja normal, ukur volume yang dipakai untuk area uji, lalu konversi ke L/ha.</div>`);
    if(C.tab==='sprayer') html=panel('Sprayer Calibration','Hitung volume aplikasi dari debit nozzle, jumlah nozzle, lebar kerja, dan kecepatan.',field('Debit per nozzle','flow','0','L/min')+field('Jumlah nozzle','nozzles','1','nozzle')+field('Lebar kerja / swath','width','0','m')+field('Kecepatan aplikasi','speed','0','m/min')+`<div class="calc-field full calc-subtle">Rumus: L/ha = 10.000 × total debit (L/min) ÷ [lebar (m) × kecepatan (m/min)].</div>`);
    if(C.tab==='tank') html=panel('Product / Tank Calculator','Turunkan kebutuhan produk per tank dari dosis per area dan volume aplikasi.',field('Dosis label','dose','0','ml/ha atau L/ha')+select('Unit dosis','unit',[['ml/ha','ml/ha'],['L/ha','L/ha'],['g/ha','g/ha'],['kg/ha','kg/ha']])+field('Spray volume','spray','0','L/ha')+field('Kapasitas tangki','tank','0','L')+field('Luas lahan','area','0','ha','full')+`<div class="calc-field full calc-subtle">Produk per tank = dosis per ha × kapasitas tank ÷ spray volume. Jika luas dimasukkan, total kebutuhan juga dihitung.</div>`);
    if(C.tab==='granule') html=panel('Granule Calculator','Hitung kebutuhan formulasi granular berdasarkan rate per hektare.',field('Luas lahan','area','0','ha')+field('Rate label','rate','0','kg/ha')+select('Unit rate','unit',[['kg/ha','kg/ha'],['g/ha','g/ha']])+field('Jumlah aplikasi','apps','1','kali')+`<div class="calc-field full calc-subtle">Jumlah aplikasi hanya mengalikan kebutuhan produk; pastikan label memang mengizinkan jumlah aplikasi tersebut.</div>`);
    if(C.tab==='ai') html=panel('Active Ingredient Calculator','Konversi kandungan formulasi menjadi jumlah bahan aktif. Gunakan konsentrasi yang benar-benar tercantum pada label.',select('Jenis formulasi','kind',[['liquid','Cair — g AI/L'],['solid','Padat — % AI']],'full')+field('Kandungan AI','conc','0','g AI/L atau %')+field('Rate formulasi','rate','0','L/ha atau kg/ha')+field('Luas lahan','area','0','ha')+`<div class="calc-field full calc-subtle">Cair: g AI/ha = g AI/L × L produk/ha. Padat: g AI/ha = kg produk/ha × (%/100) × 1000.</div>`);
    if(C.tab==='seed') html=panel('Seed Treatment Calculator','Hitung kebutuhan produk berdasarkan rate AI per kg benih dan kandungan AI produk.',field('Jumlah benih','seed','0','kg')+field('Target rate AI','aiRate','0','g AI/kg seed')+field('Kandungan AI produk','productConc','0','g AI/kg produk')+field('Aplikasi','apps','1','kali')+`<div class="calc-field full calc-subtle">Produk (g) = kebutuhan AI total (g) ÷ kandungan AI produk (g AI/kg produk) × 1 kg. Data seed-treatment pada sumber pengguna harus diverifikasi terhadap label lokal; jangan menganggap contoh US sebagai registrasi Indonesia.</div>`);
    p.innerHTML=html;
    const run=$('#calcRun'), reset=$('#calcReset');
    run.onclick=calculate; reset.onclick=()=>render();
    const basis=$('#basis'); if(basis)basis.onchange=()=>{const u=$('#unit');if(!u)return;const area=basis.value==='area';u.innerHTML=(area?[['ml/ha','ml/ha'],['L/ha','L/ha'],['g/ha','g/ha'],['kg/ha','kg/ha']]:[['ml/L','ml/L'],['g/L','g/L']]).map(([v,t])=>`<option value="${v}">${t}</option>`).join('');};
  }
  function calculate(){
    const out=$('#calcOutput'); if(!out)return; let e=null, html='';
    const val=id=>n($('#'+id)?.value);
    if(C.tab==='area'){
      const shape=$('#shape').value; let area=null;
      if(shape==='rect'){const a=val('a'),b=val('b');if(a>0&&b>0)area=a*b;}
      if(shape==='square'){const a=val('a');if(a>0)area=a*a;}
      if(shape==='triangle'){const a=val('a'),b=val('b');if(a>0&&b>0)area=a*b/2;}
      if(shape==='circle'){const r=val('r');if(r>0)area=Math.PI*r*r;}
      if(shape==='bed'){const a=val('a'),b=val('b'),c=val('count');if(a>0&&b>0&&c>0)area=a*b*c;}
      html=area?result('Hasil',[['Luas',f(area)+' m²'],['Hektare',f(area/10000,4)+' ha']],`ha = m² ÷ 10.000`):error('Lengkapi angka bentuk lahan dengan nilai lebih dari 0.');
    }
    if(C.tab==='spray'){
      const a=val('area'),r=val('rate'),t=val('tank');
      if(a>0&&r>0&&t>0){const total=a*r,loads=total/t,full=Math.floor(loads+1e-10),last=total-full*t,cover=t/r;html=result('Kebutuhan spray',[['Total larutan',f(total)+' L'],['Tank ekuivalen',f(loads,2)+' tank'],['Tank penuh',String(full)],['Tank terakhir',f(last>1e-8?last:t,2)+' L'],['Cakupan / tank',f(cover,4)+' ha']],`Total air = luas × volume aplikasi = ${f(a)} × ${f(r)} = ${f(total)} L`)}else html=error('Masukkan luas, volume aplikasi, dan kapasitas tangki.');
    }
    if(C.tab==='dose'){
      const basis=$('#basis').value,a=val('area'),spray=val('spray'),tank=val('tank'),dose=val('dose'),unit=$('#unit').value;
      if(basis==='area'){
        if(!(a>0&&spray>0&&tank>0&&dose>0)) e='Lengkapi luas, spray volume, tank, dan dosis label.'; else {const factor=unit==='L/ha'||unit==='ml/ha'?1:1;let total=dose*a, perTank=dose*tank/spray, totalWater=a*spray;let u=unit.split('/')[0];html=result('Hasil dosis',[['Total air',f(totalWater)+' L'],['Total produk',f(total)+' '+u],['Produk / tank',f(perTank)+' '+u],['Tank ekuivalen',f(totalWater/tank,2)+' tank']],`Produk/tank = dosis/ha × kapasitas tank ÷ spray volume = ${f(dose)} × ${f(tank)} ÷ ${f(spray)}.`)}
      }else{if(!(a>0&&spray>0&&tank>0&&dose>0)) e='Lengkapi luas, spray volume, tank, dan konsentrasi label.';else{const totalWater=a*spray,total=dose*totalWater,perTank=dose*tank;const u=unit==='ml/L'?'ml':'g';html=result('Hasil dosis',[['Total air',f(totalWater)+' L'],['Total produk',f(total)+' '+u],['Produk / tank',f(perTank)+' '+u],['Tank ekuivalen',f(totalWater/tank,2)+' tank']],`Produk/tank = konsentrasi × kapasitas tank = ${f(dose)} × ${f(tank)}.`)}}
      if(e)html=error(e);
    }
    if(C.tab==='backpack'){
      const a=val('area'),w=val('water'),t=val('tank');if(a>0&&w>0){const lha=w/a*10000,cover=t>0?t/lha:null;html=result('Hasil kalibrasi',[['Volume aplikasi',f(lha)+' L/ha'],['Cakupan / tank',cover?f(cover,4)+' ha':'—'],['Area / tank',cover?f(cover*10000,0)+' m²':'—']],`L/ha = air terpakai ÷ area uji × 10.000 = ${f(w)} ÷ ${f(a)} × 10.000.`)}else html=error('Masukkan luas area uji dan air yang benar-benar digunakan.');
    }
    if(C.tab==='sprayer'){
      const flow=val('flow'),noz=val('nozzles'),width=val('width'),speed=val('speed');if(flow>0&&noz>0&&width>0&&speed>0){const total=flow*noz, lha=10000*total/(width*speed);html=result('Hasil kalibrasi',[['Total debit',f(total)+' L/min'],['Volume aplikasi',f(lha)+' L/ha'],['Per nozzle',f(flow)+' L/min']],`L/ha = 10.000 × total debit ÷ (lebar × kecepatan).`)}else html=error('Masukkan debit nozzle, jumlah nozzle, lebar kerja, dan kecepatan.');
    }
    if(C.tab==='tank'){
      const dose=val('dose'),spray=val('spray'),tank=val('tank'),area=val('area'),unit=$('#unit').value;if(dose>0&&spray>0&&tank>0){const pt=dose*tank/spray,total=area>0?dose*area:null,totalWater=area>0?area*spray:null,u=unit.split('/')[0];html=result('Kebutuhan per tank',[['Produk / tank',f(pt)+' '+u],['Total produk',total!==null?f(total)+' '+u:'—'],['Total air',totalWater!==null?f(totalWater)+' L':'—'],['Tank ekuivalen',totalWater!==null?f(totalWater/tank,2)+' tank':'—']],`Produk/tank = dosis/ha × tank ÷ spray volume.`)}else html=error('Lengkapi dosis, spray volume, dan kapasitas tangki.');
    }
    if(C.tab==='granule'){
      const a=val('area'),r=val('rate'),apps=val('apps'),u=$('#unit').value;if(a>0&&r>0&&apps>0){const per=r*(u==='g/ha'?0.001:1),total=per*a*apps;html=result('Kebutuhan granular',[['Per aplikasi',f(per)+' kg'],['Total',f(total)+' kg'],['Area',f(a)+' ha'],['Jumlah aplikasi',f(apps,0)+' kali']],`Total = rate × area × jumlah aplikasi.`)}else html=error('Lengkapi area, rate, dan jumlah aplikasi.');
    }
    if(C.tab==='ai'){
      const kind=$('#kind').value,conc=val('conc'),rate=val('rate'),area=val('area');if(conc>0&&rate>0&&area>0){const aiHa=kind==='liquid'?conc*rate:rate*(conc/100)*1000;html=result('Bahan aktif',[['AI / ha',f(aiHa)+' g AI/ha'],['AI total',f(aiHa*area)+' g AI'],['Rate formulasi',f(rate)+(kind==='liquid'?' L/ha':' kg/ha')],['Kandungan',f(conc)+(kind==='liquid'?' g AI/L':' % AI')]],`Konversi kandungan formulasi → AI/ha. Ini bukan rekomendasi rate.`)}else html=error('Lengkapi kandungan AI, rate formulasi, dan luas lahan.');
    }
    if(C.tab==='seed'){
      const seed=val('seed'),aiRate=val('aiRate'),conc=val('productConc'),apps=val('apps');if(seed>0&&aiRate>0&&conc>0&&apps>0){const ai=seed*aiRate*apps,kgProduct=ai/conc,grams=kgProduct*1000;html=result('Kebutuhan seed treatment',[['Kebutuhan AI',f(ai)+' g AI'],['Produk',f(grams)+' g'],['Produk / kg seed',f(grams/seed)+' g/kg seed'],['Aplikasi',f(apps,0)+' kali']],`Produk (kg) = kebutuhan AI (g) ÷ kandungan produk (g AI/kg).`)}else html=error('Lengkapi jumlah benih, target rate AI, kandungan AI produk, dan jumlah aplikasi.');
    }
    out.innerHTML=html;
  }
  window.renderCalculator=render;
  window.openCalculators=()=>{if(typeof showScreen==='function')showScreen('calculators');render()};
  window.addEventListener('DOMContentLoaded',()=>{
    $$('#calcTabs button').forEach(b=>b.addEventListener('click',()=>{C.tab=b.dataset.calc;render()}));
    $('#openCalculators')?.addEventListener('click',window.openCalculators);
    if(location.hash==='#calculators')setTimeout(()=>{if(typeof showScreen==='function')showScreen('calculators',{history:false});render()},0);
  });
  // Re-attach tab listeners if this script is loaded after the initial DOMContentLoaded event.
  if(document.readyState!=='loading'){
    setTimeout(()=>{
      $$('#calcTabs button').forEach(b=>b.onclick=()=>{C.tab=b.dataset.calc;render()});
      $('#openCalculators')?.addEventListener('click',window.openCalculators);
    },0);
  }
})();
