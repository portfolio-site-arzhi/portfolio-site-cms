ATURAN WAJIB (dibaca sebelum mulai coding)

1) Dokumentasi & Referensi Library
- Selalu gunakan Context7 saat membutuhkan pembuatan kode, langkah setup/konfigurasi, atau dokumentasi library/API.
  - Wajib: resolve Library ID dulu, lalu ambil docs dari Context7.
- Selalu gunakan alat Vuetify MCP saat membutuhkan pembuatan kode, langkah setup/konfigurasi, atau dokumentasi Vuetify.

2) Menjalankan Project (Jangan jalankan dev server)
- Jangan running aplikasi/dev server (saya sudah run). Fokus hanya ke unit test.
- Jika ada perubahan code, buat/ubah unit test untuk mengetes flow utama.
- Untuk menjalankan semua unit test: npm run test:run
- Setiap selesai mengubah kode, jalankan: npm run type-check dan npm run lint

3) Struktur File (Wajib, untuk semua file: component/ts/utils/test)
- Pattern: lebih baik banyak file yang penting, spesifik, dan gampang untuk di-maintain dan di-debug.
- Hindari 1 file besar untuk banyak komponen/flow/fitur yang tidak related.
- Jika refactor/penambahan fitur membuat file membesar dan tidak fokus, pecah menjadi beberapa file yang jelas tanggung jawabnya.

4) Console & Logging (Wajib)
- Hindari console.log (cepat penuh log docker).
- Boleh: console.error saja (untuk error handling).
- Jika benar-benar perlu debug sementara, gunakan seminimal mungkin dan hapus sebelum selesai.

5) TypeScript & Tipe Data (Wajib)
- Hindari tipe any sebisa mungkin.
- Jangan buat interface/type di dalam component.
  - Taruh interface/type di src/model (atau file model yang relevan).
- Pastikan tidak ada error message/diagnostic pada file yang diubah.

6) API Call Style (Wajib)
- Jika ada call API: gunakan Promise chain (.then/.catch/.finally), jangan pakai async/await.
- Bagian catch cukup console.error saja (error handling utama sudah di config api).

7) Vue / Router Import (Wajib)
- Import vue dan vue-router tidak perlu (sudah auto import).

8) UI/UX (Wajib)
- Textfield gunakan density="compact".
- Textfield readonly biasakan background warna abu-abu.
- Tampilan harus responsif dan enak dilihat.

9) Browser Console
- Pastikan tidak ada error atau warning di console browser akibat perubahan.

10) Table Mobile (Wajib)
- Untuk table Vuetify (v-data-table / v-data-table-server), wajib perhatikan tampilan mobile.
- Jika memakai v-table, wajib buat alternatif tampilan mobile (smAndDown) yang setara/rapi.
- Hindari tombol "Action" lebar di mobile; gunakan v-menu activator icon (mdi-dots-vertical) dengan :loading/:disabled pakai resultLoading.

11) Install Package (Wajib)
- Kalau install package, jangan edit package.json manual; selalu gunakan command `npm install <package>` atau `npm install -D <package>` agar versi terbaru yang kompatibel terpasang otomatis.

12) Konfirmasi Aksi Krusial (Wajib)
- Aksi krusial (misalnya delete data atau logout) wajib pakai dialog konfirmasi.
- Gunakan komponen dialog konfirmasi reusable (misalnya ConfirmDialog) agar konsisten.

13) Referensi Halaman & Komponen
- Untuk halaman atau fitur baru yang memakai table dan aksi CRUD, gunakan `src/pages/users.vue` sebagai referensi utama:
  - v-data-table-server dengan pagination, sorting, dan pencarian server-side
  - Pencarian pakai `@change="refreshPage"` dan `@click:clear="refreshPage"`
  - Header table didefinisikan di file constant (contoh: `src/constants/user.constant.ts`)
  - Aksi penting (ubah status, hapus, dll.) pakai ConfirmDialog reusable
