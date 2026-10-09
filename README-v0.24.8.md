# Crop Expert v0.24.8 — Hide Technical Material (TC)

Perubahan:
- Produk dengan **Nama Merk berakhiran `TC`** dikeluarkan dari database produk yang tampil di Crop Expert.
- `TC` diperlakukan sebagai bahan teknis/technical material, bukan produk formulasi siap pakai untuk petani.
- Database produk: 929 → 905 record.
- CSV sumber v14-1 juga difilter agar konsisten.
- `product_moa_crosswalk_2026.json` difilter agar produk TC tidak ikut muncul sebagai produk.
- Cache service worker dinaikkan ke v0.24.8 agar perubahan database dapat diterima perangkat.

Catatan:
- Ini tidak menghapus master bahan aktif, IRAC/FRAC/HRAC, atau data teknis MoA.
- Yang disembunyikan hanya record produk/merk yang nama merknya berakhiran `TC`.
