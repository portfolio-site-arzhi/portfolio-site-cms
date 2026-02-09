---
name: "Skills"
description: "Applies workspace coding rules. Invoke whenever editing/adding files or writing new features."
---

# Workspace Rules (Wajib)

Gunakan skill ini setiap kali:
- Mengubah file apa pun
- Menambah file baru
- Refactor, menambah fitur, atau memperbaiki bug

## 1) Dokumentasi & Referensi Library
- Gunakan Context7 saat butuh pembuatan kode, setup/konfigurasi, atau dokumentasi library/API.
  - Wajib: resolve Library ID dulu, lalu ambil docs dari Context7.
- Gunakan Vuetify MCP saat butuh pembuatan kode, setup/konfigurasi, atau dokumentasi Vuetify.

## 2) Menjalankan Project (Jangan jalankan dev server)
- Jangan jalankan dev server (user sudah run). Fokus ke unit test.
- Jika ada perubahan code, buat/ubah unit test untuk mengetes flow utama.
- Setelah mengubah kode, jalankan:
  - `npm run type-check`
  - `npm run lint`
- Untuk menjalankan semua unit test: `npm run test:run`

## 3) Struktur File
- Lebih baik banyak file yang spesifik dan jelas tanggung jawabnya.
- Hindari 1 file besar berisi banyak hal tidak related.
- Jika file mulai membesar, pecah ke file baru yang fokus.
- Penempatan:
  - `src/model`: interface/type domain & payload API saja.
  - `src/schemas`: yup schema + form initialValues/helper.
  - `src/components` / `src/pages`: UI & wiring tampilan, jangan simpan interface/type.

## 4) Console & Logging
- Hindari `console.log`.
- Boleh `console.error` untuk error handling.
- Jika debug sementara, seminimal mungkin dan hapus sebelum selesai.

## 5) TypeScript & Tipe Data
- Hindari `any` sebisa mungkin.
- Jangan buat interface/type di dalam component.
- Pastikan tidak ada diagnostics pada file yang diubah.

## 6) API Call Style
- Jika ada call API: gunakan Promise chain (`.then/.catch/.finally`), jangan `async/await`.
- `catch` cukup `console.error` (error handling utama sudah di config api).

## 7) Vue / Router Import
- Import `vue` dan `vue-router` tidak perlu (sudah auto import).

## 8) UI/UX
- Textfield gunakan `density="compact"`.
- Textfield readonly biasakan background abu-abu.
- Setiap input wajib punya attribute `name` yang stabil (autocomplete & testing).
- Tampilan responsif dan enak dilihat.

## 9) Browser Console
- Pastikan tidak ada error/warning baru di console browser akibat perubahan.

## 10) Table Mobile
- Untuk `v-data-table` / `v-data-table-server`, wajib perhatikan tampilan mobile.
- Jika memakai `v-table`, wajib buat alternatif tampilan mobile (`smAndDown`) yang setara/rapi.
- Hindari tombol Action lebar di mobile; gunakan `v-menu` activator icon `mdi-dots-vertical` dengan `:loading/:disabled` pakai `resultLoading`.

## 11) Install Package
- Jangan edit `package.json` manual untuk install package.
- Gunakan `npm install <package>` atau `npm install -D <package>`.

## 12) Konfirmasi Aksi Krusial
- Aksi krusial (hapus data/logout) wajib dialog konfirmasi.
- Pakai ConfirmDialog reusable agar konsisten.

## 13) Referensi Halaman & Komponen
- Untuk table CRUD, gunakan `src/pages/users.vue` sebagai referensi:
  - `v-data-table-server` + pagination/sorting/search server-side
  - Search: `@change="refreshPage"` dan `@click:clear="refreshPage"`
  - Header table di file constant (`src/constants/*`)
  - Aksi penting pakai ConfirmDialog reusable

## 14) Form Validation
- Gunakan `vee-validate` + `yup`.
- Schema validasi jelas.
- Unit test wajib mencakup interaksi user isi/ubah field sebelum submit.

## 15) Pemisahan Logic vs Component
- `src/pages`: route page (`*.vue`) dan wiring UI (tipis).
- `src/components`: UI reusable / potongan halaman.
- `src/logic`: business logic/composable untuk state, API call, mapping payload.
- Struktur composable per fitur: `src/logic/<feature>/use-*.ts`.

## 16) Struktur Direktori Project
- Root: `.trae/`, `docker/`, `public/`, `src/`, `tests/`.
- `src/`: `api/`, `assets/`, `components/`, `constants/`, `helper/`, `layouts/`, `logic/`, `model/`, `pages/`, `plugins/`, `router/`, `schemas/`, `stores/`, `styles/`.
