import type { ExportDocumentOption, ExportLocale } from '@/model/export'

export const DEFAULT_EXPORT_LOCALE: ExportLocale = 'en'

export const EXPORT_DOCUMENT_OPTIONS: ExportDocumentOption[] = [
  {
    type: 'cv',
    title: 'CV ATS PDF',
    description: 'Ekspor CV text-first yang sederhana untuk kebutuhan lamaran kerja dan sistem ATS.',
    helperText: 'Menggunakan data site configuration, experience publish, education aktif, certification aktif, dan skill aktif.',
    icon: 'mdi-file-account-outline',
    buttonText: 'Unduh CV PDF',
    buttonIcon: 'mdi-download',
    fallbackFileName: 'cv-ats',
    successMessage: 'CV ATS PDF berhasil diunduh.',
    errorMessage: 'Gagal mengunduh CV ATS PDF.',
  },
  {
    type: 'portfolios',
    title: 'Portfolio Detail PDF',
    description: 'Ekspor seluruh detail portfolio CMS ke file PDF terpisah dari CV.',
    helperText: 'Mencakup status publish, deskripsi, contribution, outcome, stack teknologi, dan link terkait.',
    icon: 'mdi-file-document-multiple-outline',
    buttonText: 'Unduh Portfolio PDF',
    buttonIcon: 'mdi-download',
    fallbackFileName: 'portfolio-detail',
    successMessage: 'Portfolio PDF berhasil diunduh.',
    errorMessage: 'Gagal mengunduh Portfolio PDF.',
  },
]
