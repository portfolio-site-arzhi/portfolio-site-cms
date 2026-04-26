import type { PortfolioFormValues } from '@/model/portfolio'
import * as yup from 'yup'

function isEmpty (value: unknown): boolean {
  if (value === null || value === undefined) {
    return true
  }

  if (typeof value !== 'string') {
    return false
  }

  return value.trim().length === 0
}

function isValidOptionalUrl (value: string): boolean {
  if (value.trim().length === 0) {
    return true
  }

  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}

function isValidOptionalDateTime (value: string): boolean {
  if (value.trim().length === 0) {
    return true
  }

  const date = new Date(value)
  return !Number.isNaN(date.getTime())
}

function isSupportedImageType (value: File | null): boolean {
  if (!value) {
    return true
  }

  return ['image/jpeg', 'image/png', 'image/webp'].includes(value.type)
}

const portfolioStackSchema = yup.object({
  id: yup.number().nullable().defined(),
  name: yup.string().required('Nama stack wajib diisi').max(120, 'Nama stack maksimal 120 karakter'),
})

export function createPortfolioSchema (_mode: 'create' | 'edit'): yup.ObjectSchema<PortfolioFormValues> {
  return yup.object({
    title: yup.string().required('Judul project wajib diisi').max(200, 'Judul project maksimal 200 karakter'),
    description: yup.string().required('Deskripsi (ID) wajib diisi'),
    description_en: yup.string().defined(),
    contribution: yup.string().defined(),
    contribution_en: yup.string().defined(),
    outcome: yup.string().defined(),
    outcome_en: yup.string().defined(),
    role: yup.string().defined().max(160, 'Role maksimal 160 karakter'),
    live_url: yup.string().transform(value => (isEmpty(value) ? '' : String(value))).defined().max(500, 'Live URL maksimal 500 karakter').test('live-url', 'Live URL tidak valid', value => isValidOptionalUrl(value ?? '')),
    github_url: yup.string().transform(value => (isEmpty(value) ? '' : String(value))).defined().max(500, 'GitHub URL maksimal 500 karakter').test('github-url', 'GitHub URL tidak valid', value => isValidOptionalUrl(value ?? '')),
    is_published: yup.boolean().required(),
    published_at: yup.string().defined().test(
      'published-at',
      'Tanggal publish tidak valid',
      value => isValidOptionalDateTime(value ?? ''),
    ),
    image_file: yup.mixed<File>().nullable().defined().test(
      'image-type',
      'Format gambar harus JPG, PNG, atau WebP',
      value => isSupportedImageType(value ?? null),
    ),
    image_url: yup.string().nullable().defined(),
    status_file: yup.mixed<0 | 1>().oneOf([0, 1]).required(),
    stacks: yup.array().of(portfolioStackSchema).defined(),
  })
}

export function createDefaultPortfolioFormValues (): PortfolioFormValues {
  return {
    title: '',
    description: '',
    description_en: '',
    contribution: '<p></p>',
    contribution_en: '<p></p>',
    outcome: '<p></p>',
    outcome_en: '<p></p>',
    role: '',
    live_url: '',
    github_url: '',
    is_published: true,
    published_at: '',
    image_file: null,
    image_url: null,
    status_file: 0,
    stacks: [],
  }
}
