ATURAN WAJIB (dibaca sebelum mulai coding)

1) Dokumentasi & Referensi Library
- Selalu gunakan Context7 saat membutuhkan pembuatan kode, langkah setup/konfigurasi, atau dokumentasi library/API.
  - Wajib: resolve Library ID dulu, lalu ambil docs dari Context7.
- Selalu gunakan alat Vuetify MCP saat membutuhkan pembuatan kode, langkah setup/konfigurasi, atau dokumentasi Vuetify.

2) Menjalankan Project (Jangan jalankan dev server)
- Jangan running aplikasi/dev server (saya sudah run). Fokus hanya ke unit test.
- Jika ada perubahan code, buat/ubah unit test untuk mengetes flow utama.
- Setiap selesai mengubah kode, jalankan: npm run type-check dan npm run lint
- Untuk menjalankan semua unit test: npm run test:run

3) Struktur File (Wajib, untuk semua file: component/ts/utils/test)
- Lebih baik punya banyak file yang penting dan spesifik, dengan nama file yang jelas
  merepresentasikan fitur/tanggung jawabnya (misal: site-config.store.ts, home-tab.vue).
- Hindari 1 file besar yang berisi banyak komponen/flow/fitur yang tidak related.
- Jika refactor/penambahan fitur membuat sebuah file mulai membesar dan tidak fokus,
  pindahkan bagian yang punya tanggung jawab jelas ke file baru yang namanya spesifik.
  - Contoh pembagian tanggung jawab:
    - src/model -> hanya interface/type untuk domain & payload API.
    - src/schemas -> schema validasi (yup) + konfigurasi form (initialValues/helper seperti createDefaultXxxFormValues).
    - src/components / src/pages -> komponen UI dan logic tampilan, tidak menyimpan interface/type.

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
- Untuk setiap input, wajib tambahkan attribute name yang stabil (untuk autocomplete & testing).
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

14) Form Validation (Wajib)
- Gunakan package `vee-validate` dan `yup` untuk validasi form.
- Tentukan schema validasi yang jelas.
- Pastikan unit test mencakup interaksi user mengisi/mengubah field sebelum submit.

15) Pemisahan Logic vs Component (Wajib)
- `src/pages` hanya untuk file route (`*.vue`) dan wiring UI halaman (sebisa mungkin tipis).
- `src/components` hanya untuk UI reusable/potongan halaman; simpan logic yang benar-benar UI (misal computed label kecil, emit click, prop mapping).
- `src/logic` untuk business logic/composable yang:
  - Mengelola state halaman (loading/error/search/pagination/dialog/selected item).
  - Memanggil API (`src/api`) dan mengatur success/error state.
  - Melakukan mapping/normalisasi data payload (bukan UI).
  - Dipakai ulang oleh lebih dari satu page/component, atau sudah membuat file `.vue` terlalu panjang.
- Jangan pindahkan “UI logic kecil” ke `src/logic` jika hanya 1 computed sederhana dan tidak reusable (contoh: label tombol/menu).
- Penamaan & lokasi:
  - Simpan per fitur: `src/logic/<feature>/use-*.ts` (contoh: `src/logic/users/use-users-page.ts`, `src/logic/experiences/use-experiences-page.ts`).
  - Satu composable fokus satu tanggung jawab; bila mulai membesar, pecah lagi.

16) Struktur Direktori Project (Wajib dipahami)
- Root:
  - .trae/ -> konfigurasi Trae (rules & skill workflow).
  - docker/ -> konfigurasi Docker (nginx, vue) untuk deployment.
  - public/ -> asset statis yang di-serve langsung oleh Vite.
  - src/ -> semua source code aplikasi frontend.
  - tests/ -> file unit/integration test (Vitest).
- Di dalam src/:
  - src/api -> fungsi pemanggilan API ke backend (`*-service.ts`, `http.ts`).
  - src/assets -> asset statis (gambar, logo) yang di-bundle oleh Vite.
  - src/components -> komponen Vue reusable dan bagian halaman (misal: `site-config/*`, `user/*`).
  - src/constants -> konstanta aplikasi (header table, layout navigation, dsb.).
  - src/helper -> helper kecil yang spesifik (misalnya manipulasi nama).
  - src/layouts -> layout global aplikasi (default, blank) yang membungkus `<router-view>`.
  - src/logic -> composable/logic reusable untuk page & component (tanpa template/UI).
  - src/model -> hanya interface/type untuk domain & payload API (tidak ada fungsi).
  - src/pages -> file halaman yang terhubung ke route (users, login, site-configurations, dll).
  - src/plugins -> inisialisasi plugin (Vuetify, Pinia, auto-import, dsb.).
  - src/router -> konfigurasi router utama (route guard auth, dsb.).
  - src/schemas -> schema validasi (yup) + konfigurasi form (initialValues/helper seperti `createDefaultXxxFormValues`).
  - src/stores -> Pinia store (state global seperti auth, site-config, app).
  - src/styles -> style global (SCSS, settings tema).
  - src/utils -> util umum yang tidak spesifik domain (auth-cookie, navigation).
  - App.vue, main.ts, typed-router.d.ts -> entry aplikasi dan konfigurasi router/auto-import.
