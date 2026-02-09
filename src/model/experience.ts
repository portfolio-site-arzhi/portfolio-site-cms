export interface ExperienceSkill {
  id: number
  skill_name: string
  sort: number
}

export interface Experience {
  id: number
  sort: number
  is_published: boolean
  role_id: string
  role_en: string
  company_name: string
  company_url: string | null
  start_date: string | null
  end_date: string | null
  is_current: boolean
  description_id: string
  description_en: string
  skills: ExperienceSkill[]
  created_at: string
  updated_at: string
}

export interface ExperiencesListResponse {
  data: Experience[]
}

export interface FetchExperiencesParams {
  search?: string | null
}

export interface ExperienceDetailResponse {
  data: Experience
}

export interface ExperienceSkillUpsertPayload {
  skill_name: string
}

export interface CreateExperiencePayload {
  is_published: boolean
  role_id: string
  role_en: string
  company_name: string
  company_url?: string | null
  start_date?: string | null
  end_date?: string | null
  is_current: boolean
  description_id: string
  description_en: string
  skills?: ExperienceSkillUpsertPayload[]
}

export interface UpdateExperiencePayload {
  is_published?: boolean
  role_id?: string
  role_en?: string
  company_name?: string
  company_url?: string | null
  start_date?: string | null
  end_date?: string | null
  is_current?: boolean
  description_id?: string
  description_en?: string
  skills?: ExperienceSkillUpsertPayload[]
}

export interface UpdateExperiencesSortPayload {
  ids: number[]
}

export interface ExperienceSkillDraft {
  id: number | null
  skill_name: string
}

export interface ExperienceFormValues {
  is_published: boolean
  role_id: string
  role_en: string
  company_name: string
  company_url: string
  start_date: string
  end_date: string
  is_current: boolean
  description_id: string
  description_en: string
  skills: string[]
}
