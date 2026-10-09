/* Crop Expert v0.23.5 — Calculator Suite
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
    const tabs=[['area','📐 Area'],['spray','💧 Spray'],['dose','🧪 Dosis'],['backpack','🎒 Backpack'],['sprayer','🚜 Sprayer'],['tank','🧴 / Tank'],['granule','🌾 Granule'],['ai','⚗️ AI'],['seed','🌱 Seed'],['calibration','🧰 Kalibrasi'],['seedrate','🌱 Benih'],['fertilizer','🧪 Pupuk'],['npk','🧬 NPK']];
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
    if(C.tab==='calibration') html=panel('Kalibrasi & Takaran','Gabungkan hasil kalibrasi dengan angka dosis dari label. Kalkulator tidak memilih dosis.',field('Air terpakai saat uji','calWater','0','L')+field('Luas petak uji','calArea','0','m²')+field('Kapasitas tangki penuh','calTank','0','L')+select('Bentuk dosis label','calBasis',[['area','Per hektare (ml/ha, L/ha, g/ha, kg/ha)'],['volume','Per volume air (ml/L atau g/L)']],'full')+field('Angka dosis label','calDose','0','')+select('Satuan dosis','calUnit',[['ml/ha','ml/ha'],['L/ha','L/ha'],['g/ha','g/ha'],['kg/ha','kg/ha'],['ml/L','ml/L'],['g/L','g/L']])+field('Luas target','calTarget','0','m²')+field('Volume botol ukur','calBottle','0','ml')+field('Jumlah tuangan tutup','calPours','0','kali')+`<div class="calc-field full calc-subtle">Rumus kalibrasi: L/ha = liter terpakai ÷ m² uji × 10.000. Untuk dosis per ha, produk/tangki = dosis/ha × cakupan tangki. Untuk dosis per liter, produk/tangki = konsentrasi × volume tangki.</div>`,'Hitung Kalibrasi');
    if(C.tab==='seedrate') html=panel('Kalkulator Benih','Hitung kebutuhan benih berdasarkan populasi tanam. Nilai jarak tanam, daya tumbuh, dan cadangan diisi sesuai rencana budidaya.',field('Luas lahan','seedArea','0','m²')+field('Jarak antarbaris','rowSpace','0','cm')+field('Jarak dalam baris','plantSpace','0','cm')+field('Benih per lubang','seedsHole','1','butir')+field('Cadangan','seedReserve','10','%')+field('Daya tumbuh','germination','85','%')+`<div class="calc-field full calc-subtle">Populasi teoritis = luas ÷ (jarak baris × jarak dalam baris). Kebutuhan benih disesuaikan dengan benih/lubang, cadangan, dan daya tumbuh yang kamu masukkan.</div>`,'Hitung Benih');
    if(C.tab==='fertilizer') html=panel('Kalkulator Pupuk','Hitung kebutuhan produk berdasarkan dosis yang sudah ditentukan dari label, rekomendasi teknis, atau hasil perhitungan agronomi.',field('Luas lahan','fertArea','0','ha')+field('Dosis pupuk','fertDose','0','kg/ha')+field('Jumlah aplikasi','fertApps','1','kali')+select('Satuan tampilan','fertUnit',[['kg','kg'],['ton','ton']],'full')+`<div class="calc-field full calc-subtle">Kalkulator ini hanya mengalikan dosis yang kamu masukkan × luas × jumlah aplikasi. Tidak memberikan rekomendasi jenis atau dosis pupuk.</div>`,'Hitung Pupuk');
    if(C.tab==='npk') html=panel('Kalkulator NPK','Hitung kebutuhan pupuk dari target hara N–P₂O₅–K₂O dan analisis pupuk yang kamu masukkan. Mode campuran menyelesaikan tiga pupuk sekaligus secara matematis.',select('Mode perhitungan','npkMode',[['single','1 produk NPK — cek kecukupan N, P₂O₅, K₂O'],['blend','Campuran 3 pupuk — hitung komposisi']],'full')+field('Luas lahan','npkArea','1','ha')+field('Target N','npkN','0','kg N/ha')+field('Target P₂O₅','npkP','0','kg P₂O₅/ha')+field('Target K₂O','npkK','0','kg K₂O/ha')+`<div id="npkSingleFields" class="calc-grid full">${field('Kadar N pupuk','npk1N','16','%')}${field('Kadar P₂O₅ pupuk','npk1P','16','%')}${field('Kadar K₂O pupuk','npk1K','16','%')}</div>`+`<div id="npkBlendFields" class="calc-grid full" style="display:none">${field('Pupuk A — N','npkAN','46','%')}${field('Pupuk A — P₂O₅','npkAP','0','%')}${field('Pupuk A — K₂O','npkAK','0','%')}${field('Pupuk B — N','npkBN','0','%')}${field('Pupuk B — P₂O₅','npkBP','36','%')}${field('Pupuk B — K₂O','npkBK','0','%')}${field('Pupuk C — N','npkCN','0','%')}${field('Pupuk C — P₂O₅','npkCP','0','%')}${field('Pupuk C — K₂O','npkCK','60','%')}</div>`+`<div class="calc-field full calc-subtle">P₂O₅ dan K₂O mengikuti angka analisis pada label pupuk, bukan unsur P dan K elemental. Mode 1 produk menunjukkan berapa kg produk diperlukan untuk mencapai masing-masing target dan apakah rasio produk sesuai. Mode campuran menyelesaikan kg/ha masing-masing pupuk; hasil negatif atau sistem tidak memiliki solusi ditandai sebagai tidak valid.</div>`,'Hitung NPK');
    p.innerHTML=html;
    const host=document.getElementById('calculatorExternalTools');
    if(host) host.innerHTML=`<div class="calc-tool-grid"><button class="calc-tool-card" data-open-calc="calibration"><span>🧰</span><div><strong>Kalibrasi & Takaran</strong><small>Hitung L/ha, cakupan tangki, produk/tangki, dan ukuran takaran.</small></div><b>›</b></button><button class="calc-tool-card" data-open-calc="seedrate"><span>🌱</span><div><strong>Kalkulator Benih</strong><small>Hitung kebutuhan benih dari luas, jarak tanam, daya tumbuh, dan cadangan.</small></div><b>›</b></button><button class="calc-tool-card" data-open-calc="fertilizer"><span>🧪</span><div><strong>Kalkulator Pupuk</strong><small>Hitung kebutuhan pupuk dari luas dan dosis label/rekomendasi yang sudah ditentukan.</small></div><b>›</b></button><button class="calc-tool-card npk-tool-card" data-open-calc="npk"><span>🧬</span><div><strong>Kalkulator NPK</strong><small>Hitung kg/ha dan total pupuk dari target N–P₂O₅–K₂O atau campuran 3 pupuk.</small></div><b>›</b></button></div>`;
    $$('#calculatorExternalTools [data-open-calc]').forEach(b=>b.onclick=()=>{C.tab=b.dataset.openCalc;render();document.getElementById('calculatorPanel')?.scrollIntoView({behavior:'smooth',block:'start'});});
    const run=$('#calcRun'), reset=$('#calcReset');
    run.onclick=calculate; reset.onclick=()=>render();
    const basis=$('#basis'); if(basis)basis.onchange=()=>{const u=$('#unit');if(!u)return;const area=basis.value==='area';u.innerHTML=(area?[['ml/ha','ml/ha'],['L/ha','L/ha'],['g/ha','g/ha'],['kg/ha','kg/ha']]:[['ml/L','ml/L'],['g/L','g/L']]).map(([v,t])=>`<option value="${v}">${t}</option>`).join('');};
    const calBasis=$('#calBasis'); if(calBasis)calBasis.onchange=()=>{const u=$('#calUnit');if(!u)return;const area=calBasis.value==='area';u.innerHTML=(area?[['ml/ha','ml/ha'],['L/ha','L/ha'],['g/ha','g/ha'],['kg/ha','kg/ha']]:[['ml/L','ml/L'],['g/L','g/L']]).map(([v,t])=>`<option value="${v}">${t}</option>`).join('');};
    const npkMode=$('#npkMode'); if(npkMode) npkMode.onchange=()=>{const single=$('#npkSingleFields'),blend=$('#npkBlendFields'); if(single)single.style.display=npkMode.value==='single'?'grid':'none'; if(blend)blend.style.display=npkMode.value==='blend'?'grid':'none';};
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
    if(C.tab==='calibration'){
      const water=val('calWater'),area=val('calArea'),tank=val('calTank'),basis=$('#calBasis')?.value,dose=val('calDose'),target=val('calTarget'),unit=$('#calUnit')?.value,bottle=val('calBottle'),pours=val('calPours');
      if(water>0&&area>0&&tank>0){
        const lha=water/area*10000, cover=tank/lha, targetHa=target>0?target/10000:null;
        let items=[['Volume aplikasi',f(lha)+' L/ha'],['Cakupan / tank',f(cover,4)+' ha'],['Area / tank',f(cover*10000,0)+' m²']];
        if(dose>0){if(basis==='area'){const baseUnit=unit.split('/')[0],perTank=dose*cover,total=targetHa!==null?dose*targetHa:null;items.push(['Produk / tank',f(perTank)+' '+baseUnit]);if(total!==null)items.push(['Produk area target',f(total)+' '+baseUnit]);}else{const baseUnit=unit.split('/')[0],perTank=dose*tank,totalWater=targetHa!==null?targetHa*lha:null,total=totalWater!==null?dose*totalWater:null;items.push(['Produk / tank',f(perTank)+' '+baseUnit]);if(total!==null)items.push(['Produk area target',f(total)+' '+baseUnit]);}}
        if(bottle>0&&pours>0)items.push(['Isi 1 takaran',f(bottle/pours,2)+' ml']);
        html=result('Hasil kalibrasi & takaran',items,'L/ha = air terpakai ÷ luas uji × 10.000. Angka dosis tetap berasal dari input label/rekomendasi yang kamu masukkan.');
      } else html=error('Masukkan air terpakai, luas petak uji, dan kapasitas tangki.');
    }
    if(C.tab==='seedrate'){
      const area=val('seedArea'),row=val('rowSpace'),plant=val('plantSpace'),hole=val('seedsHole'),reserve=val('seedReserve'),germ=val('germination');
      if(area>0&&row>0&&plant>0&&hole>0&&reserve>=0&&germ>0&&germ<=100){const spacing=row*plant/10000,pop=area/spacing,seeds=pop*hole*(1+reserve/100)/(germ/100);html=result('Kebutuhan benih',[['Populasi teoritis',f(pop,0)+' lubang'],['Kebutuhan dasar',f(pop*hole,0)+' butir'],['Dengan cadangan',f(pop*hole*(1+reserve/100),0)+' butir'],['Kebutuhan akhir',f(seeds,0)+' butir'],['Setara',f(seeds/1000,2)+' ribu butir']],`Kebutuhan akhir = populasi × benih/lubang × (1 + cadangan) ÷ daya tumbuh.`)}else html=error('Lengkapi luas, jarak tanam, benih/lubang, cadangan, dan daya tumbuh dengan angka yang valid.');
    }
    if(C.tab==='fertilizer'){
      const area=val('fertArea'),dose=val('fertDose'),apps=val('fertApps');
      if(area>0&&dose>0&&apps>0){const total=area*dose*apps;html=result('Kebutuhan pupuk',[['Per aplikasi',f(area*dose)+' kg'],['Total kebutuhan',f(total)+' kg'],['Setara',f(total/1000,3)+' ton'],['Luas',f(area,3)+' ha'],['Aplikasi',f(apps,0)+' kali']],`Total = luas × dosis yang kamu masukkan × jumlah aplikasi.`)}else html=error('Lengkapi luas lahan, dosis pupuk, dan jumlah aplikasi.');
    }
    if(C.tab==='npk'){
      const area=val('npkArea'), tn=val('npkN'), tp=val('npkP'), tk=val('npkK'), mode=$('#npkMode')?.value;
      const targets=[tn||0,tp||0,tk||0];
      if(!(area>0) || targets.some(x=>x<0) || targets.every(x=>x===0)) html=error('Masukkan luas lahan dan minimal satu target hara N, P₂O₅, atau K₂O yang lebih dari 0.');
      else if(mode==='single'){
        const pn=val('npk1N'), pp=val('npk1P'), pk=val('npk1K');
        if([pn,pp,pk].some(x=>x===null||x<0) || (pn+pp+pk)<=0) html=error('Lengkapi analisis N–P₂O₅–K₂O produk dengan angka yang valid.');
        else {
          const rates=targets.map((t,i)=>{const pct=[pn,pp,pk][i];return t>0&&pct>0?t/(pct/100):null;});
          const positive=rates.filter(x=>x!==null);
          const kgHa=Math.max(...positive);
          const supplied=[pn,pp,pk].map(p=>kgHa*p/100);
          const labels=['N','P₂O₅','K₂O'];
          const rows=[['Dosis untuk N',rates[0]!==null?f(rates[0])+' kg/ha':'—'],['Dosis untuk P₂O₅',rates[1]!==null?f(rates[1])+' kg/ha':'—'],['Dosis untuk K₂O',rates[2]!==null?f(rates[2])+' kg/ha':'—'],['Dosis kerja tertinggi',f(kgHa)+' kg/ha'],['Total produk area',f(kgHa*area)+' kg']];
          const balances=labels.map((lab,i)=>`${lab}: ${f(supplied[i])} vs target ${f(targets[i])} kg/ha`);
          const excess=supplied.map((v,i)=>v-targets[i]);
          html=result('Analisis 1 produk',rows,`Produk dihitung dengan kadar ${f(pn,2)}-${f(pp,2)}-${f(pk,2)}%. Dosis tertinggi dipakai hanya sebagai pembanding matematis agar semua target yang memiliki kadar >0 tercapai; hasil dapat menyebabkan kelebihan hara. ${balances.join(' · ')}`);
          if(excess.some((x,i)=>x>0.01&&targets[i]>0)) html+=`<div class="calc-warning"><strong>Perhatian rasio</strong><p>Satu produk ${f(pn,0)}-${f(pp,0)}-${f(pk,0)} tidak dapat memenuhi semua target tepat sekaligus pada angka ini. Cek selisih hara sebelum menjadikan hasil sebagai rencana pemupukan.</p></div>`;
        }
      } else {
        const A=[[val('npkAN')/100,val('npkBN')/100,val('npkCN')/100],[val('npkAP')/100,val('npkBP')/100,val('npkCP')/100],[val('npkAK')/100,val('npkBK')/100,val('npkCK')/100]];
        const flat=A.flat();
        if(flat.some(x=>!Number.isFinite(x)||x<0) || A.every(r=>r.every(x=>x===0))) html=error('Lengkapi analisis tiga pupuk dengan angka 0–100%.');
        else {
          const det=A[0][0]*(A[1][1]*A[2][2]-A[1][2]*A[2][1])-A[0][1]*(A[1][0]*A[2][2]-A[1][2]*A[2][0])+A[0][2]*(A[1][0]*A[2][1]-A[1][1]*A[2][0]);
          if(Math.abs(det)<1e-10) html=error('Kombinasi tiga pupuk tidak memiliki solusi unik. Gunakan analisis pupuk yang berbeda.');
          else {
            const b=targets;
            const determinant=m=>m[0][0]*(m[1][1]*m[2][2]-m[1][2]*m[2][1])-m[0][1]*(m[1][0]*m[2][2]-m[1][2]*m[2][0])+m[0][2]*(m[1][0]*m[2][1]-m[1][1]*m[2][0]);
          const xs=[0,1,2].map(col=>{const m=A.map(r=>r.slice());m[0][col]=b[0];m[1][col]=b[1];m[2][col]=b[2];return determinant(m)/det;});
            if(xs.some(x=>!Number.isFinite(x)||x<-1e-8)) html=error('Solusi matematis menghasilkan jumlah pupuk negatif. Kombinasi analisis ini tidak dapat memenuhi target hara tersebut tanpa menambah/mengganti pupuk.');
            else {
              const totalHa=xs.reduce((a,b)=>a+b,0), totalArea=xs.map(x=>x*area);
              html=result('Hasil campuran 3 pupuk',[['Pupuk A',f(xs[0])+' kg/ha'],['Pupuk B',f(xs[1])+' kg/ha'],['Pupuk C',f(xs[2])+' kg/ha'],['Total campuran',f(totalHa)+' kg/ha'],['Total area',f(totalArea.reduce((a,b)=>a+b,0))+' kg']],`Persamaan: N = target N; P₂O₅ = target P₂O₅; K₂O = target K₂O. Hasil ini murni solusi matematika dari analisis pupuk yang dimasukkan.`);
            }
          }
        }
      }
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
