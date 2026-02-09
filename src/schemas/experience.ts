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

function parseOptionalMonthValue (value: string): number | null {
  const trimmed = value.trim()
  if (trimmed.length === 0) {
    return null
  }

  const match = /^(\d{4})-(\d{2})$/.exec(trimmed)
  if (!match) {
    return null
  }

  const year = Number(match[1])
  const month = Number(match[2])

  if (!Number.isFinite(year) || !Number.isFinite(month)) {
    return null
  }
  if (year < 1900 || year > 2100) {
    return null
  }
  if (month < 1 || month > 12) {
    return null
  }

  return year * 12 + month
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
  start_date: yup.string().defined().test('start-date', 'Bulan mulai tidak valid', value => {
    if (!value || value.trim().length === 0) {
      return true
    }
    return parseOptionalMonthValue(value) !== null
  }),
  end_date: yup.string().defined().test('end-date', 'Bulan selesai tidak valid', (value, context) => {
    const parent = context.parent as ExperienceFormValues
    const { is_current, start_date } = parent

    if (is_current) {
      return !value || value.trim().length === 0
    }

    if (!value || value.trim().length === 0) {
      return true
    }

    const endMonthValue = parseOptionalMonthValue(value)
    if (endMonthValue === null) {
      return false
    }

    const startMonthValue = parseOptionalMonthValue(start_date)
    if (startMonthValue !== null && endMonthValue < startMonthValue) {
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
    start_date: '',
    end_date: '',
    is_current: false,
    description_id: '<p></p>',
    description_en: '<p></p>',
    skills: [],
  }
}
