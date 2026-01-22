export interface User {
  id: number
  email: string
  name: string
  status: boolean
  created_at: string
  updated_at: string
}

export interface UsersListResponse {
  data: User[]
  meta: UsersListMeta
}

export interface UserDetailResponse {
  data: User
}

export interface CreateUserPayload {
  email: string
  name: string
  status: boolean
}

export interface UpdateUserPayload {
  name: string
}

export interface UpdateUserStatusPayload {
  status: boolean
}

export interface UsersListMeta {
  page: number
  page_size: number
  search: string | null
  order_field: 'email' | 'name' | 'status' | 'created_at' | 'updated_at' | null
  order_dir: 'asc' | 'desc' | null
}
