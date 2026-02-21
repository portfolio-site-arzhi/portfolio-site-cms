export interface Education {
  id: number
  institution_name: string
  degree: string
  degree_en: string
  field_of_study: string
  field_of_study_en: string
  start_date: string
  end_date: string | null
  description: string | null
  description_en: string | null
  location: string | null
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
  created_by: number
  updated_by: number
}

export interface EducationsListResponse {
  data: Education[]
}

export interface FetchEducationsParams {
  search?: string | null
}

export interface EducationDetailResponse {
  data: Education
}

export interface CreateEducationPayload {
  institution_name: string
  degree: string
  degree_en: string
  field_of_study: string
  field_of_study_en: string
  start_date: string
  end_date?: string | null
  description?: string | null
  description_en?: string | null
  location?: string | null
  is_active: boolean
}

export interface UpdateEducationPayload {
  institution_name?: string
  degree?: string
  degree_en?: string
  field_of_study?: string
  field_of_study_en?: string
  start_date?: string
  end_date?: string | null
  description?: string | null
  description_en?: string | null
  location?: string | null
  is_active?: boolean
}

export interface UpdateEducationsSortPayload {
  ids: number[]
}

export interface EducationFormValues {
  institution_name: string
  degree: string
  degree_en: string
  field_of_study: string
  field_of_study_en: string
  start_date: string
  end_date: string
  description: string
  description_en: string
  location: string
  is_active: boolean
}
