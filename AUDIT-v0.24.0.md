# Crop Expert v0.24.0 — Audit & AI Vision

## Perubahan
- Native AI Vision via `/api/analyze` (Vercel serverless).
- API key tetap server-side: `OPENAI_API_KEY`.
- Scan UI: AI Vision menjadi alur utama; Google Lens/ChatGPT tetap sebagai fallback.
- Maksimal 3 kandidat, kategori OPT, confidence kualitatif, ciri visual, pembeda, permintaan foto tambahan.
- Hasil AI mencoba mencocokkan kandidat ke `data/opt.json`.
- Versi `v0.24.0 · AI Vision MVP` terlihat di bawah halaman utama.
- Service Worker cache diganti dan dibuat network-first untuk HTML/JS/CSS/JSON.
- Service Worker didaftarkan dengan `updateViaCache:'none'` dan auto-update.
- `vercel.json` memberi no-cache pada app shell dan runtime API.

## Deployment
- Repository utama tetap `main`.
- Vercel project yang dipakai: `pestiapps.vercel.app`.
- Endpoint: `https://pestiapps.vercel.app/api/analyze`.
- Vercel Environment Variable: `OPENAI_API_KEY`.
- Opsional: `OPENAI_MODEL` (default `gpt-5.6-luna`).
- Opsional: `ALLOWED_ORIGIN` untuk membatasi CORS setelah URL GitHub Pages final diketahui.

## Audit checklist
- [x] Struktur database v0.23.8 dipertahankan.
- [x] AI backend ditambahkan tanpa menaruh secret di frontend.
- [x] UI versi terlihat.
- [x] PWA cache invalidation diperbaiki.
- [x] Scan native AI ditambahkan.
- [ ] Uji live POST `/api/analyze` dengan foto nyata.
- [ ] Uji GitHub Pages -> Vercel CORS.
- [ ] Uji PWA update di Android setelah push.
- [ ] Setelah URL GitHub Pages diketahui, batasi `ALLOWED_ORIGIN`.
