export interface PortfolioStack {
  id: number
  portfolio_id: number
  name: string
  display_order: number
  created_at: string
  updated_at: string
  created_by: number
  updated_by: number | null
}

export interface Portfolio {
  id: number
  slug: string
  title: string
  description: string
  description_en: string | null
  contribution: string | null
  contribution_en: string | null
  outcome: string | null
  outcome_en: string | null
  image: string | null
  role: string | null
  live_url: string | null
  github_url: string | null
  display_order: number
  is_published: boolean
  published_at: string | null
  stacks: PortfolioStack[]
  created_at: string
  updated_at: string
  created_by: number
  updated_by: number | null
}

export interface PortfoliosListResponse {
  data: Portfolio[]
}

export interface FetchPortfoliosParams {
  search?: string | null
}

export interface PortfolioDetailResponse {
  data: Portfolio
}

export interface PortfolioStackUpsertPayload {
  name: string
}

export interface CreatePortfolioPayload {
  title: string
  description: string
  description_en?: string | null
  contribution?: string | null
  contribution_en?: string | null
  outcome?: string | null
  outcome_en?: string | null
  role?: string | null
  live_url?: string | null
  github_url?: string | null
  is_published: boolean
  published_at?: string | null
  stacks: PortfolioStackUpsertPayload[]
}

export interface UpdatePortfolioPayload {
  status_file: 0 | 1
  title?: string
  description?: string
  description_en?: string | null
  contribution?: string | null
  contribution_en?: string | null
  outcome?: string | null
  outcome_en?: string | null
  role?: string | null
  live_url?: string | null
  github_url?: string | null
  is_published?: boolean
  published_at?: string | null
  stacks?: PortfolioStackUpsertPayload[]
}

export interface UpdatePortfoliosSortPayload {
  ids: number[]
}

export interface PortfolioStackDraft {
  id: number | null
  name: string
}

export interface PortfolioFormValues {
  title: string
  description: string
  description_en: string
  contribution: string
  contribution_en: string
  outcome: string
  outcome_en: string
  role: string
  live_url: string
  github_url: string
  is_published: boolean
  published_at: string
  image_file: File | null
  image_url: string | null
  status_file: 0 | 1
  stacks: PortfolioStackDraft[]
}
