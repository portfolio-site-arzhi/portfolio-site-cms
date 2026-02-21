# Portfolio Site CMS

CMS admin panel untuk mengelola konten portfolio (users, experiences, educations, certifications, dan site configuration).

## Tech Stack

- Vue 3
- Vuetify 3
- Vite 7
- TypeScript
- Pinia
- Vue Router
- Axios
- Vitest + Vue Test Utils
- ESLint

## Requirements

- Node.js `24.11.1` (lihat `.nvmrc`)
- npm (direkomendasikan versi terbaru yang kompatibel dengan Node 24)

## Quick Start

1. Install dependency:

```bash
npm install
```

2. Jalankan aplikasi:

```bash
npm run dev
```

Catatan: konfigurasi environment dikelola internal.

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Jalankan Vite dev server |
| `npm run build` | Build production (termasuk type check) |
| `npm run build-only` | Build production tanpa type check |
| `npm run preview` | Preview hasil build |
| `npm run type-check` | Jalankan pengecekan tipe TypeScript/Vue |
| `npm run lint` | Jalankan ESLint dengan auto-fix |
| `npm run test:run` | Jalankan unit test (Vitest) |

## Quality Checks

Gunakan perintah ini sebelum merge:

```bash
npm run type-check
npm run lint
npm run test:run
```

## Docker

Build dan jalankan container:

```bash
docker compose up --build -d
```

Stop container:

```bash
docker compose down
```

Setelah berjalan, aplikasi tersedia di `http://localhost:3001`.

## Troubleshooting

- Aplikasi tidak bisa login atau data kosong: pastikan backend berjalan dan konfigurasi environment internal sudah benar.
- Port bentrok: sesuaikan konfigurasi internal dan restart dev server.
- Error dependency: hapus `node_modules` dan jalankan ulang `npm install`.

## Project Structure

```text
src/
  api/         # API service layer
  components/  # Reusable UI components
  constants/   # App constants
  logic/       # Feature/page composables
  model/       # Domain types/interfaces
  pages/       # Route pages
  plugins/     # Plugin registration
  router/      # Router + navigation guard
  schemas/     # Validation schemas
  stores/      # Pinia stores
  utils/       # Generic utilities
tests/         # Unit/integration tests
docker/        # Dockerfile + nginx config
```
