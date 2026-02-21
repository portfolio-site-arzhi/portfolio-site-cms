import type { AxiosResponse } from 'axios'
import type {
  CreateSkillPayload,
  FetchSkillsParams,
  SkillDetailResponse,
  SkillsListResponse,
  UpdateSkillPayload,
  UpdateSkillsSortPayload,
} from '@/model/skill'
import httpClient from '@/api/http'

export function fetchSkillsApi (params?: FetchSkillsParams): Promise<AxiosResponse<SkillsListResponse>> {
  return httpClient.get<SkillsListResponse>('/skills', {
    params,
  })
}

export function fetchSkillDetailApi (id: number): Promise<AxiosResponse<SkillDetailResponse>> {
  return httpClient.get<SkillDetailResponse>(`/skills/${id}`)
}

export function createSkillApi (payload: CreateSkillPayload): Promise<AxiosResponse<SkillDetailResponse>> {
  return httpClient.post<SkillDetailResponse>('/skills', payload)
}

export function updateSkillApi (id: number, payload: UpdateSkillPayload): Promise<AxiosResponse<SkillDetailResponse>> {
  return httpClient.put<SkillDetailResponse>(`/skills/${id}`, payload)
}

export function deleteSkillApi (id: number): Promise<AxiosResponse<{ message: string }>> {
  return httpClient.delete<{ message: string }>(`/skills/${id}`)
}

export function updateSkillsSortApi (payload: UpdateSkillsSortPayload): Promise<AxiosResponse<{ message: string }>> {
  return httpClient.patch<{ message: string }>('/skills/sort', payload)
}
