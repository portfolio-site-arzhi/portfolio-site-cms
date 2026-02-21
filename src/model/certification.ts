export interface Certification {
  id: number
  name: string
  name_en: string
  issuing_organization: string
  issue_date: string
  description: string | null
  description_en: string | null
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
  created_by: number
  updated_by: number
}

export interface CertificationsListResponse {
  data: Certification[]
}

export interface FetchCertificationsParams {
  search?: string | null
}

export interface CertificationDetailResponse {
  data: Certification
}

export interface CreateCertificationPayload {
  name: string
  name_en: string
  issuing_organization: string
  issue_date: string
  description?: string | null
  description_en?: string | null
  is_active: boolean
}

export interface UpdateCertificationPayload {
  name?: string
  name_en?: string
  issuing_organization?: string
  issue_date?: string
  description?: string | null
  description_en?: string | null
  is_active?: boolean
}

export interface UpdateCertificationsSortPayload {
  ids: number[]
}

export interface CertificationFormValues {
  name: string
  name_en: string
  issuing_organization: string
  issue_date: string
  description: string
  description_en: string
  is_active: boolean
}
