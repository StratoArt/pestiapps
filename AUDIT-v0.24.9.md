# Audit v0.24.9

## Baseline ditemukan pada ZIP laptop
- UI `index.html` masih menampilkan `v0.24.7`.
- `service-worker.js` sudah memakai cache `v0.24.8-no-tc`.
- `README-v0.24.8.md` sudah ada.
- `data/pesticide_tc_removal_audit_2026.json` menyatakan release `v0.24.8`.

Kesimpulan: baseline ZIP memiliki **version drift** antara UI dan release metadata. Batch ini menyelaraskannya ke `v0.24.9`.

## Temuan OPT
- `Spodoptera exigua` dan `Spodoptera litura` sudah memiliki entity ID terpisah.
- Asset lokal `spodoptera-exigua.webp` pada baseline ternyata merupakan ilustrasi **Thrips tabaci**, sehingga salah secara semantik.
- Asset lokal tersebut dihapus dari batch.
- Foto user-provided dipasang dengan nama file dan stage yang eksplisit.
- `photoBlock()` sekarang membaca `stage` untuk label Imago/Larva/Gejala.
- `lifeCycleBlock()` sekarang tetap merender siklus dari `life_cycle_reference` atau fallback `life`.

## Temuan Cara Kerja Pestisida
- Alur 4 tahap pada mobile sebelumnya dipaksa menjadi layout 3 kolom parsial sehingga tahap Target/Efek dapat terlihat terpotong.
- Batch ini membuat 4 tahap menjadi grid 2×2 pada mobile.
- Ilustrasi Target Sites Lepidoptera dibatasi ukurannya pada mobile.
- Detail Target Site sekarang menampilkan target molekuler/proses, kelompok IRAC sebagai tag, dan contoh bahan aktif sebagai tag.
- Detail Mode of Entry menampilkan contoh bahan aktif/agen.

## Validasi
- `node --check js/app.js`: OK
- JSON `opt.json`, `pesticide_mode_of_action_2026.json`, dan `visual_attribution_2026.json`: OK

## Tambahan FAW
`Spodoptera frugiperda` kini memiliki alias **Fall Armyworm (FAW)** dan tiga aset lokal yang dikunci berdasarkan entity ID: larva, referensi ciri morfologi, dan siklus hidup.


### Tambahan visual terbaru
- Spodoptera exigua: lifecycle illustration added.
- Thrips tabaci: adult photo and lifecycle illustration added.
- One uploaded image showing a caterpillar was intentionally NOT assigned to Thrips because it does not visually match a thrips life stage.

### Rice white stem borer
Added `Scirpophaga innotata` as a separate pest entity from yellow stem borer (`Scirpophaga incertulas`), based on PPPW v13 Fact Sheet 411. External public-domain adult illustration is referenced but not mirrored.

## Visual white stem borer & thumbnail
- `Scirpophaga innotata` sekarang memiliki foto gejala whitehead/beluk dan foto larva user-provided.
- Foto larva dipakai sebagai thumbnail utama.
- Mekanisme thumbnail dipindah dari `images[0]` menjadi: cari `stage: larva` terlebih dahulu, lalu fallback ke aset pertama yang tersedia.
- OPT Lepidoptera yang sudah memiliki foto larva lokal (`Spodoptera exigua`, `S. frugiperda`, `S. litura`) otomatis ikut memakai foto larva sebagai thumbnail.
- Rujukan eksternal PPPW menjelaskan larva `S. innotata` berwarna putih hingga kekuningan dan gejala whitehead merupakan gejala penggerek batang; gejala dapat tumpang tindih dengan spesies penggerek lain.
