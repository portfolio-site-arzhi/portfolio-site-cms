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

const EXCEL_REQUEST_HEADERS = {
  Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
}

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

export function exportSkillsApi (): Promise<AxiosResponse<Blob>> {
  return httpClient.get<Blob>('/skills/export', {
    headers: EXCEL_REQUEST_HEADERS,
    responseType: 'blob',
  })
}

export function importSkillsApi (file: File): Promise<AxiosResponse<{ message: string }>> {
  const formData = new FormData()

  formData.append('file', file)

  return httpClient.post<{ message: string }>('/skills/import', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
