import type { SkillFormValues } from '@/model/skill'
import * as yup from 'yup'

export const skillSchema: yup.ObjectSchema<SkillFormValues> = yup.object({
  name: yup.string().required('Nama grup skill wajib diisi').max(100, 'Maksimal 100 karakter'),
  is_active: yup.boolean().required(),
  skills: yup.array().of(
    yup.string().transform(value => String(value ?? '').trim()).required('Nama skill wajib diisi').max(100, 'Maksimal 100 karakter'),
  ).min(1, 'Minimal 1 skill wajib diisi').defined(),
})

export function createDefaultSkillFormValues (): SkillFormValues {
  return {
    name: '',
    is_active: true,
    skills: [],
  }
}
