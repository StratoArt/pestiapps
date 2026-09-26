/* Crop Expert v0.24.0 — native AI Vision client */
(() => {
  const API_URL = window.CROP_EXPERT_AI_API || 'https://pestiapps.vercel.app/api/analyze';
  const MAX_EDGE = 1600;
  const JPEG_QUALITY = 0.82;

  const byId = id => document.getElementById(id);
  const escLocal = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function setStatus(text, type='idle') {
    const el = byId('aiStatus');
    if (!el) return;
    el.textContent = text;
    el.className = `ai-status ${type}`;
  }

  function imageToDataURL(file) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        try {
          const scale = Math.min(1, MAX_EDGE / Math.max(img.naturalWidth, img.naturalHeight));
          const canvas = document.createElement('canvas');
          canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
          canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
          const ctx = canvas.getContext('2d', { alpha: false });
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const data = canvas.toDataURL('image/jpeg', JPEG_QUALITY);
          URL.revokeObjectURL(url);
          resolve(data);
        } catch (e) { URL.revokeObjectURL(url); reject(e); }
      };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Foto tidak dapat dibaca.')); };
      img.src = url;
    });
  }

  function confidenceLabel(value) {
    return ({high:'Tinggi', medium:'Sedang', low:'Rendah'})[value] || value || '—';
  }

  function findDatabaseMatches(queries) {
    const pool = typeof optSearchPool === 'function' ? optSearchPool() : [];
    const terms = (queries || []).map(x => String(x).toLowerCase()).filter(Boolean);
    const hits = [];
    for (const item of pool) {
      const hay = [item.name, item.common, item.scientific, item.family, item.order, ...(item.aliases || [])].filter(Boolean).join(' ').toLowerCase();
      const score = terms.reduce((n, term) => n + (hay.includes(term) ? 1 : 0), 0);
      if (score) hits.push({ item, score });
    }
    return hits.sort((a,b) => b.score - a.score).slice(0, 5).map(x => x.item);
  }

  function renderResult(result) {
    const box = byId('aiResult');
    if (!box) return;
    const category = result.category || 'TIDAK_CUKUP_DATA';
    const categoryText = category.replaceAll('_', ' ');
    const candidates = Array.isArray(result.candidates) ? result.candidates : [];
    const dbHits = findDatabaseMatches(result.database_queries);

    box.hidden = false;
    box.innerHTML = `
      <div class="ai-result-head">
        <div><span class="ai-eyebrow">CROP EXPERT AI · ANALISIS VISUAL</span><h3>${escLocal(categoryText)}</h3></div>
        <span class="ai-category">${escLocal(result.crop || 'Komoditas belum jelas')}</span>
      </div>
      <div class="ai-summary"><strong>Yang terlihat</strong><p>${escLocal(result.visual_summary || 'Tidak ada ringkasan visual.')}</p></div>
      <div class="ai-candidates">
        ${candidates.length ? candidates.map((c, i) => `
          <article class="ai-candidate">
            <div class="ai-candidate-top"><b>${i+1}. ${escLocal(c.name)}</b><span class="ai-confidence ${escLocal(c.confidence)}">${confidenceLabel(c.confidence)}</span></div>
            ${c.scientific_name ? `<div class="ai-scientific">${escLocal(c.scientific_name)}</div>` : ''}
            <ul>${(c.supporting_signs || []).slice(0,5).map(s => `<li>${escLocal(s)}</li>`).join('')}</ul>
            ${c.differential ? `<div class="ai-diff"><b>Pembeda:</b> ${escLocal(c.differential)}</div>` : ''}
          </article>`).join('') : '<div class="ai-empty">AI belum menemukan kandidat yang cukup kuat dari foto ini.</div>'}
      </div>
      ${result.needs_more_photo ? `<div class="ai-followup"><b>📷 Foto tambahan diperlukan</b><p>${escLocal(result.follow_up || 'Ambil foto lebih dekat pada bagian yang menunjukkan gejala.')}</p></div>` : ''}
      ${dbHits.length ? `<div class="ai-db"><div><b>📚 Ditemukan di database Crop Expert</b><small>Hasil ini adalah kecocokan database, bukan konfirmasi diagnosis.</small></div>${dbHits.map(x => `<button class="ai-db-hit" data-db-id="${escLocal(x.id)}" data-db-cat="${escLocal(x.category || 'Hama')}">${escLocal(x.name)} <span>›</span></button>`).join('')}</div>` : ''}
      <div class="ai-disclaimer">AI membantu identifikasi awal dari foto. Verifikasi gejala, lingkungan, riwayat aplikasi, dan bila perlu pemeriksaan lapangan/laboratorium tetap diperlukan.</div>`;

    box.querySelectorAll('.ai-db-hit').forEach(btn => btn.addEventListener('click', () => {
      const item = findDatabaseMatches([btn.textContent.replace('›','').trim()])[0];
      if (item && typeof openOptDetail === 'function') openOptDetail(item, item.category === 'Penyakit' ? 'Penyakit' : item.category === 'Gulma' ? 'Gulma' : 'Hama');
    }));
  }

  async function analyze() {
    if (!state?.scanFile) { setStatus('Pilih foto terlebih dahulu.', 'error'); return; }
    const btn = byId('analyzeCropExpertBtn');
    if (btn) { btn.disabled = true; btn.textContent = '⏳ Menganalisis foto…'; }
    setStatus('Mengirim foto ke Crop Expert AI…', 'loading');
    byId('aiResult')?.setAttribute('hidden', '');
    try {
      const image = await imageToDataURL(window.state.scanFile);
      const response = await fetch(API_URL, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({image}) });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || `Server AI error (${response.status})`);
      renderResult(data);
      setStatus('Analisis selesai.', 'success');
    } catch (err) {
      console.error('[Crop Expert AI]', err);
      setStatus(err.message || 'Gagal menghubungi AI.', 'error');
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = '🤖 Analisis dengan Crop Expert AI'; }
    }
  }

  function init() {
    const scanInfo = document.querySelector('.scan-info');
    if (scanInfo) scanInfo.innerHTML = `<strong>🤖 AI Vision + Database Crop Expert</strong><ol><li>Ambil atau pilih foto OPT/gejala tanaman.</li><li>Tekan <b>Analisis dengan Crop Expert AI</b>.</li><li>AI memberikan maksimal 3 kandidat berdasarkan ciri yang terlihat.</li><li>Jika ada kecocokan, hasil dapat dibuka langsung di database Crop Expert.</li></ol><p><b>Catatan:</b> AI adalah alat identifikasi awal, bukan diagnosis pasti. Foto yang kurang jelas akan diminta untuk diulang/ditambah.</p>`;
    const scanBox = document.querySelector('.scan-box');
    if (scanBox && !byId('analyzeCropExpertBtn')) {
      const btn = document.createElement('button');
      btn.id = 'analyzeCropExpertBtn'; btn.className = 'ai-primary-btn'; btn.disabled = true; btn.textContent = '🤖 Analisis dengan Crop Expert AI';
      scanBox.insertBefore(btn, byId('googleLensBtn'));
      btn.addEventListener('click', analyze);
      const status = document.createElement('div'); status.id='aiStatus'; status.className='ai-status idle'; status.textContent='Pilih foto untuk mengaktifkan AI.';
      scanBox.insertBefore(status, btn.nextSibling);
      const result = document.createElement('div'); result.id='aiResult'; result.className='ai-result'; result.hidden=true;
      scanBox.parentNode.insertBefore(result, scanBox.nextSibling);
    }

  }

  // app.js is loaded before this file; wait one tick so its DOM wiring/data are ready.
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(init, 0));
  else setTimeout(init, 0);
  window.CropExpertAI = { analyze, onFileReady: () => { const aiBtn=byId('analyzeCropExpertBtn'); if(aiBtn) aiBtn.disabled=!state?.scanFile; setStatus(state?.scanFile ? 'Foto siap. Tekan Analisis dengan Crop Expert AI.' : 'Pilih foto untuk mengaktifkan AI.', state?.scanFile ? 'ready' : 'idle'); } };
})();
