import type { EducationFormValues } from '@/model/education'
import * as yup from 'yup'

function parseRequiredDateValue (value: string): number | null {
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

  return year * 100 + month
}

function parseOptionalDateValue (value: string): number | null {
  const trimmed = value.trim()
  if (trimmed.length === 0) {
    return null
  }
  return parseRequiredDateValue(trimmed)
}

export const educationSchema: yup.ObjectSchema<EducationFormValues> = yup.object({
  institution_name: yup.string().required('Nama institusi wajib diisi').max(255, 'Maksimal 255 karakter'),
  degree: yup.string().required('Gelar (ID) wajib diisi').max(255, 'Maksimal 255 karakter'),
  degree_en: yup.string().required('Gelar (EN) wajib diisi').max(255, 'Maksimal 255 karakter'),
  field_of_study: yup.string().required('Jurusan (ID) wajib diisi').max(255, 'Maksimal 255 karakter'),
  field_of_study_en: yup.string().required('Jurusan (EN) wajib diisi').max(255, 'Maksimal 255 karakter'),
  start_date: yup.string().required('Bulan mulai wajib diisi').test('start-date', 'Bulan mulai tidak valid', value => {
    if (!value) {
      return false
    }
    return parseRequiredDateValue(value) !== null
  }),
  end_date: yup.string().defined().test('end-date', 'Bulan selesai tidak valid', (value, context) => {
    const parent = context.parent as EducationFormValues
    const startValue = parseRequiredDateValue(parent.start_date)
    if (!value || value.trim().length === 0) {
      return true
    }

    const endValue = parseOptionalDateValue(value)
    if (endValue === null) {
      return false
    }

    if (startValue !== null && endValue < startValue) {
      return false
    }

    return true
  }),
  description: yup.string().defined(),
  description_en: yup.string().defined(),
  location: yup.string().defined().max(255, 'Maksimal 255 karakter'),
  is_active: yup.boolean().required(),
})

export function createDefaultEducationFormValues (): EducationFormValues {
  return {
    institution_name: '',
    degree: '',
    degree_en: '',
    field_of_study: '',
    field_of_study_en: '',
    start_date: '',
    end_date: '',
    description: '<p></p>',
    description_en: '<p></p>',
    location: '',
    is_active: true,
  }
}
