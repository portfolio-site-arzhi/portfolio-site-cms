import type { AxiosResponse } from 'axios'
import type {
  CreateUserPayload,
  UpdateUserPayload,
  UpdateUserStatusPayload,
  UserDetailResponse,
  UsersListResponse,
} from '@/model/user'
import httpClient from '@/api/http'

export interface FetchUsersParams {
  page?: number
  page_size?: number
  search?: string | null
  order_field?: 'email' | 'name' | 'status' | 'created_at' | 'updated_at'
  order_dir?: 'asc' | 'desc'
}

export function fetchUsersApi (params?: FetchUsersParams): Promise<AxiosResponse<UsersListResponse>> {
  return httpClient.get<UsersListResponse>('/users', {
    params,
  })
}

export function fetchUserDetailApi (id: number): Promise<AxiosResponse<UserDetailResponse>> {
  return httpClient.get<UserDetailResponse>(`/users/${id}`)
}

export function createUserApi (payload: CreateUserPayload): Promise<AxiosResponse<UserDetailResponse>> {
  return httpClient.post<UserDetailResponse>('/users', payload)
}

export function updateUserApi (id: number, payload: UpdateUserPayload): Promise<AxiosResponse<UserDetailResponse>> {
  return httpClient.put<UserDetailResponse>(`/users/${id}`, payload)
}

export function updateUserStatusApi (id: number, payload: UpdateUserStatusPayload): Promise<AxiosResponse<UserDetailResponse>> {
  return httpClient.patch<UserDetailResponse>(`/users/${id}/status`, payload)
}

export function deleteUserApi (id: number): Promise<AxiosResponse<{ message: string }>> {
  return httpClient.delete<{ message: string }>(`/users/${id}`)
}
