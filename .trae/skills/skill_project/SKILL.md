---
name: skill_project
description: when you change file
---

# SKILL – Workflow Standar Proyek

File ini berisi daftar skill (kumpulan langkah) yang bisa dipakai ulang ketika mengerjakan task di repo ini. Isinya diambil dari aturan di `.trae/rules/rules.md`, tapi aturan aslinya tetap berlaku sebagai sumber utama.

---

## Skill: Jalankan Quality Check Setelah Mengubah Kode

**Kapan dipakai**  
Setiap selesai mengubah kode di `src/**` (component, utils, store, API, dll).

**Langkah**
- Jalankan pengecekan tipe:
  - `npm run type-check`
- Jalankan lint:
  - `npm run lint`
- Kalau ada perubahan yang memengaruhi flow utama, jalankan semua unit test:
  - `npm run test:run`

---

## Skill: Buat Halaman CRUD Baru (Referensi `users.vue`)

**Kapan dipakai**  
Saat membuat halaman baru yang menampilkan list data dengan aksi CRUD (contoh: list project, artikel, dsb).

**Referensi utama**
- Struktur dan pola ambil dari:
  - `src/pages/users.vue`
  - `src/constants/user.constant.ts`

**Langkah inti**
- Model & tipe:
  - Buat / update interface di `src/model/...` (jangan definisi type di dalam component).
- API service:
  - Buat fungsi di `src/api/...-service.ts`.
  - Panggil API menggunakan Promise chain (`.then/.catch/.finally`), bukan `async/await`.
  - Di blok `catch`, cukup `console.error`.
- Table:
  - Gunakan `v-data-table-server` untuk pagination, sorting, dan search server-side.
  - Header table didefinisikan di file constant (mirip `USERS_TABLE_HEADERS` di `src/constants/user.constant.ts`).
  - Untuk mobile:
    - Pastikan tampilan nyaman di layar kecil.
    - Jika pakai `v-data-table-server`, gunakan prop `:mobile="smAndDown"` dari `useDisplay()`.
- Search:
  - Jangan pakai `watch` untuk search di halaman.
  - Gunakan event:
    - `@change="refreshPage"`
    - `@click:clear="refreshPage"`
- Aksi penting:
  - Aksi krusial (hapus, ubah status, dsb.) wajib pakai dialog konfirmasi.
  - Gunakan komponen dialog konfirmasi reusable (contoh pola di `src/pages/users.vue` dengan `ConfirmDialog`).

Setelah selesai coding, jalankan skill **“Jalankan Quality Check Setelah Mengubah Kode”**.

---

## Skill: Tambah / Ubah API Call

**Kapan dipakai**  
Saat menambah endpoint baru atau mengubah cara panggil API di service.

**Langkah**
- Dokumentasi:
  - Kalau butuh referensi library/API, gunakan Context7 sesuai aturan.
- Service:
  - Tambah / update fungsi di `src/api/...-service.ts`.
  - Jangan gunakan `async/await`, gunakan Promise chain:
    - `apiCall(...).then(...).catch(...).finally(...)`.
  - Di `catch`, log error dengan `console.error`.
- Tipe data:
  - Update / buat tipe di `src/model/...`.
  - Hindari `any`.
- Konsumen:
  - Sesuaikan pemanggilan di component / store agar mengikuti pola Promise chain.

Terakhir, jalankan skill **“Jalankan Quality Check Setelah Mengubah Kode”**.

---

## Skill: Tambah Tabel dengan Tampilan Mobile yang Baik

**Kapan dipakai**  
Saat menambah list data baru yang pakai table (Vuetify).

**Langkah**
- Jika menggunakan `v-data-table` atau `v-data-table-server`:
  - Pastikan tampilan mobile diperhatikan (smAndDown).
  - Untuk `v-data-table-server`, gunakan:
    - `:mobile="smAndDown"` (ambil dari `useDisplay()`).
- Untuk `v-table`:
  - Wajib sediakan tampilan alternatif mobile (smAndDown) yang setara dan rapi.
- Tombol action:
  - Hindari tombol “Action” yang lebar di mobile.
  - Gunakan `v-menu` dengan icon `mdi-dots-vertical` sebagai activator.
  - Pastikan state `:loading` / `:disabled` terhubung ke state loading yang tepat.

Setelah penyesuaian tampilan, jalankan skill **“Jalankan Quality Check Setelah Mengubah Kode”** jika ada perubahan logic.

---

## Skill: Aksi Krusial (Delete, Logout, Ubah Status, dll.)

**Kapan dipakai**  
Saat menambah / mengubah aksi yang berisiko (hapus data, logout, ubah status penting, dsb.).

**Langkah**
- Dialog konfirmasi:
  - Wajib gunakan dialog konfirmasi.
  - Pakai komponen reusable seperti `ConfirmDialog`.
- Alur:
  - Saat user klik aksi → buka dialog konfirmasi.
  - Saat user konfirmasi → panggil API (Promise chain).
  - Setelah sukses → refresh data atau arahkan ke halaman yang tepat.

Terakhir, jalankan skill **“Jalankan Quality Check Setelah Mengubah Kode”** jika ada perubahan di kode.