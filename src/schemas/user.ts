import type { UserFormValues } from '@/model/user'
import * as yup from 'yup'

export const userSchema = yup.object({
  email: yup.string().required('Email wajib diisi').email('Email tidak valid'),
  name: yup.string().required('Nama wajib diisi'),
  status: yup.boolean(),
})

export function createDefaultUserFormValues (): UserFormValues {
  return {
    email: '',
    name: '',
    status: true,
  }
}
