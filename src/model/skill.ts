export interface SkillItem {
  id: number
  skill_group_id: number
  name: string
  display_order: number
  created_at: string
  updated_at: string
  created_by: number
  updated_by: number
}

export interface SkillGroup {
  id: number
  name: string
  display_order: number
  is_active: boolean
  skills: SkillItem[]
  created_at: string
  updated_at: string
  created_by: number
  updated_by: number
}

export interface SkillsListResponse {
  data: SkillGroup[]
}

export interface FetchSkillsParams {
  search?: string | null
}

export interface SkillDetailResponse {
  data: SkillGroup
}

export interface SkillItemUpsertPayload {
  name: string
}

export interface CreateSkillPayload {
  name: string
  is_active: boolean
  skills: SkillItemUpsertPayload[]
}

export interface UpdateSkillPayload {
  name?: string
  is_active?: boolean
  skills?: SkillItemUpsertPayload[]
}

export interface UpdateSkillsSortPayload {
  ids: number[]
}

export interface SkillItemDraft {
  id: number | null
  name: string
}

export interface SkillFormValues {
  name: string
  is_active: boolean
  skills: string[]
}
