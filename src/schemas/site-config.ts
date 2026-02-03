import type { SiteConfigFormValues } from '@/model/site-config'
import * as yup from 'yup'

export const siteConfigSchema = yup.object({
  system: yup.object({
    primary_color: yup.string().required('Primary color is required'),
    secondary_color: yup.string().required('Secondary color is required'),
  }),
  home: yup.object({
    status_file: yup.number(),
    name: yup.string().required('Nama wajib diisi'),
    position: yup.string().required('Posisi wajib diisi'),
    description: yup.object({
      id: yup.string().required('Deskripsi (ID) wajib diisi'),
      en: yup.string().required('Description (EN) is required'),
    }),
    photo: yup.string().nullable(),
  }),
  about: yup.object({
    about_me: yup.object({
      id: yup.string().required('Tentang saya wajib diisi'),
      en: yup.string().required('About me is required'),
    }),
    email: yup.string().email('Email tidak valid').required('Email wajib diisi'),
  }),
  footer: yup.object({
    github: yup.string().url('URL tidak valid').required('Github URL wajib diisi'),
    linkedin: yup.string().url('URL tidak valid').required('Linkedin URL wajib diisi'),
    instagram: yup.string().url('URL tidak valid').required('Instagram URL wajib diisi'),
  }),
})

export function createDefaultSiteConfigFormValues (): SiteConfigFormValues {
  return {
    system: {
      primary_color: '',
      secondary_color: '',
    },
    home: {
      status_file: 0,
      name: '',
      position: '',
      description: {
        id: '',
        en: '',
      },
      photo: '',
    },
    about: {
      about_me: {
        id: '',
        en: '',
      },
      email: '',
    },
    footer: {
      github: '',
      linkedin: '',
      instagram: '',
    },
  }
}
