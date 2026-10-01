## v0.24.11
- Weather dipindahkan ke bawah Search.
- Lokasi perangkat diminta saat awal membuka aplikasi agar weather lokal langsung tersedia.
- Spray Assist ditempatkan di samping Weather pada Beranda.
- Palette visual Crop Expert diperbarui mengikuti palette baru.
- Credit diperbarui: Amrizal Ivan Pratama ditonjolkan bold dan lebih besar, diikuti Eber Lonameo dan Erwin Elyatalatof, lalu “Engineered by S.T.R.A.T.O”.
- Cache PWA dinaikkan ke v0.24.11.

# Changelog

## v0.24.9
- Perbaikan visual OPT Spodoptera exigua dan Spodoptera litura.
- Foto user-provided dipisahkan per entity dan tahap.
- Fallback ilustrasi Thrips tidak lagi dipakai untuk S. exigua/S. litura.
- Siklus hidup dibuat tahan terhadap data `life_cycle_reference` maupun `life`.
- Perbaikan mobile layout Cara Kerja Pestisida.
- Resize ilustrasi Target Sites untuk layar HP.
- Detail Target Site menampilkan target molekuler/proses, kelompok IRAC, dan contoh bahan aktif.
- Detail mode of entry menampilkan contoh bahan aktif/agen.
- Database MoA dinaikkan ke 2026.2.
- Version tracking ditambahkan melalui `VERSION`.

### v0.24.9 — FAW visual update
- Tambah alias **Fall Armyworm (FAW)** untuk `Spodoptera frugiperda`.
- Tambah visual larva FAW, referensi ciri larva, dan ilustrasi siklus hidup.
- Seluruh aset FAW dikunci ke entity `spodoptera-frugiperda`.

### v0.24.9 — Larva thumbnail & white stem borer visuals
- Tambah foto gejala whitehead/beluk dan foto larva user-provided untuk `Scirpophaga innotata`.
- Foto larva `Scirpophaga innotata` menjadi thumbnail utama penggerek batang padi putih.
- `photoThumb()` kini memprioritaskan aset dengan `stage: larva` untuk thumbnail; berlaku juga untuk OPT lain yang sudah memiliki foto larva lokal.

## v0.24.10
- Perluasan UI Target Site insektisida menjadi 6 kategori.
- Detail Target Site diseragamkan: target molekuler/proses, kelompok IRAC terkait, dan contoh bahan aktif.
- Target Site dapat dipilih langsung dari grid.
- Summary fitur utama dipindahkan ke bagian Tentang Crop Expert.
- Credit dipindahkan ke footer: “Dikembangkan bersama PEST AI”.
- Blok “Catatan data” pada Database Pestisida dihapus dari tampilan.
- PWA cache dinaikkan ke v0.24.10.
