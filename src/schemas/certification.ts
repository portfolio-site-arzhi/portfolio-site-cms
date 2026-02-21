import type { CertificationFormValues } from '@/model/certification'
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

export const certificationSchema: yup.ObjectSchema<CertificationFormValues> = yup.object({
  name: yup.string().required('Nama sertifikasi (ID) wajib diisi').max(255, 'Maksimal 255 karakter'),
  name_en: yup.string().required('Nama sertifikasi (EN) wajib diisi').max(255, 'Maksimal 255 karakter'),
  issuing_organization: yup.string().required('Penerbit wajib diisi').max(255, 'Maksimal 255 karakter'),
  issue_date: yup.string().required('Bulan terbit wajib diisi').test('issue-date', 'Bulan terbit tidak valid', value => {
    if (!value) {
      return false
    }
    return parseRequiredDateValue(value) !== null
  }),
  description: yup.string().defined(),
  description_en: yup.string().defined(),
  is_active: yup.boolean().required(),
})

export function createDefaultCertificationFormValues (): CertificationFormValues {
  return {
    name: '',
    name_en: '',
    issuing_organization: '',
    issue_date: '',
    description: '<p></p>',
    description_en: '<p></p>',
    is_active: true,
  }
}
