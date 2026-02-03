import type { AxiosResponse } from 'axios'
import type { SiteConfigBulkPayload, SiteConfigListResponse } from '@/model/site-config'
import httpClient from '@/api/http'

export function fetchSiteConfigsApi (): Promise<AxiosResponse<SiteConfigListResponse>> {
  return httpClient.get<SiteConfigListResponse>('/site-configs')
}

export function saveSiteConfigsBulkApi (payload: SiteConfigBulkPayload, file?: File | null): Promise<AxiosResponse<void>> {
  const jsonPayload: unknown = {
    system: {
      primary_color: payload.system.primary_color,
      secondary_color: payload.system.secondary_color,
    },
    home: {
      status_file: payload.home.status_file ?? 0,
      value: {
        name: payload.home.name,
        position: payload.home.position,
        description: {
          id: payload.home.description.id,
          en: payload.home.description.en,
        },
        // Field photo bersifat optional.
        // - Jika ada file upload, backend akan mengatur photo sendiri.
        // - Jika tidak ada file dan tidak ada URL photo yang valid, field ini tidak boleh dikirim
        //   (menghindari nilai "" yang menyebabkan zod.url() gagal).
        ...(file || !payload.home.photo ? {} : { photo: payload.home.photo }),
      },
    },
    about: {
      value: {
        about_me: {
          id: payload.about.about_me.id,
          en: payload.about.about_me.en,
        },
        email: payload.about.email,
      },
    },
    footer: {
      value: {
        github: payload.footer.github,
        linkedin: payload.footer.linkedin,
        instagram: payload.footer.instagram,
      },
    },
  }

  const formData = new FormData()

  // Append payload JSON
  formData.append('payload', JSON.stringify(jsonPayload))

  // Append files if exists
  if (file) {
    formData.append('home_photo', file)
  }

  return httpClient.post<void>('/site-configs/bulk', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
