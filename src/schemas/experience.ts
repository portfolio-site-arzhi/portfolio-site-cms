import type { ExperienceFormValues } from '@/model/experience'
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

function parseOptionalYear (value: string): number | null {
  const trimmed = value.trim()
  if (trimmed.length === 0) {
    return null
  }

  const numeric = Number(trimmed)
  if (!Number.isFinite(numeric)) {
    return null
  }

  return Math.trunc(numeric)
}

export const experienceSchema: yup.ObjectSchema<ExperienceFormValues> = yup.object({
  is_published: yup.boolean().required(),
  role_id: yup.string().required('Role (ID) wajib diisi').max(180, 'Maksimal 180 karakter'),
  role_en: yup.string().required('Role (EN) wajib diisi').max(180, 'Maksimal 180 karakter'),
  company_name: yup.string().required('Nama perusahaan wajib diisi').max(180, 'Maksimal 180 karakter'),
  company_url: yup.string().transform(value => {
    if (isEmpty(value)) {
      return ''
    }
    return String(value)
  }).defined().max(500, 'Maksimal 500 karakter').test('is-url', 'URL perusahaan tidak valid', value => {
    if (!value) {
      return true
    }
    try {
      new URL(value)
      return true
    } catch {
      return false
    }
  }),
  year_start: yup.string().defined().test('year-start', 'Tahun mulai tidak valid', value => {
    if (!value || value.trim().length === 0) {
      return true
    }
    const numeric = Number(value)
    if (!Number.isFinite(numeric)) {
      return false
    }
    const year = Math.trunc(numeric)
    return year >= 1900 && year <= 2100
  }),
  year_end: yup.string().defined().test('year-end', 'Tahun selesai tidak valid', (value, context) => {
    const parent = context.parent as ExperienceFormValues
    const { is_current, year_start } = parent

    if (is_current) {
      return !value || value.trim().length === 0
    }

    if (!value || value.trim().length === 0) {
      return true
    }

    const endNumeric = Number(value)
    if (!Number.isFinite(endNumeric)) {
      return false
    }

    const endYear = Math.trunc(endNumeric)
    if (endYear < 1900 || endYear > 2100) {
      return false
    }

    const startYear = parseOptionalYear(year_start)
    if (startYear !== null && endYear < startYear) {
      return false
    }

    return true
  }),
  is_current: yup.boolean().required(),
  description_id: yup.string().required('Deskripsi (ID) wajib diisi'),
  description_en: yup.string().required('Deskripsi (EN) wajib diisi'),
  skills: yup.array().of(
    yup.string().transform(value => String(value ?? '').trim()).required('Nama skill wajib diisi'),
  ).defined(),
})

export function createDefaultExperienceFormValues (): ExperienceFormValues {
  return {
    is_published: true,
    role_id: '',
    role_en: '',
    company_name: '',
    company_url: '',
    year_start: '',
    year_end: '',
    is_current: false,
    description_id: '<p></p>',
    description_en: '<p></p>',
    skills: [],
  }
}
