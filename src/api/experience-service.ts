import type { AxiosResponse } from 'axios'
import type {
  CreateExperiencePayload,
  ExperienceDetailResponse,
  ExperiencesListResponse,
  FetchExperiencesParams,
  UpdateExperiencePayload,
  UpdateExperiencesSortPayload,
} from '@/model/experience'
import httpClient from '@/api/http'

export function fetchExperiencesApi (params?: FetchExperiencesParams): Promise<AxiosResponse<ExperiencesListResponse>> {
  return httpClient.get<ExperiencesListResponse>('/experiences', {
    params,
  })
}

export function fetchExperienceDetailApi (id: number): Promise<AxiosResponse<ExperienceDetailResponse>> {
  return httpClient.get<ExperienceDetailResponse>(`/experiences/${id}`)
}

export function createExperienceApi (payload: CreateExperiencePayload): Promise<AxiosResponse<ExperienceDetailResponse>> {
  return httpClient.post<ExperienceDetailResponse>('/experiences', payload)
}

export function updateExperienceApi (id: number, payload: UpdateExperiencePayload): Promise<AxiosResponse<ExperienceDetailResponse>> {
  return httpClient.put<ExperienceDetailResponse>(`/experiences/${id}`, payload)
}

export function deleteExperienceApi (id: number): Promise<AxiosResponse<{ message: string }>> {
  return httpClient.delete<{ message: string }>(`/experiences/${id}`)
}

export function updateExperiencesSortApi (payload: UpdateExperiencesSortPayload): Promise<AxiosResponse<{ message: string }>> {
  return httpClient.patch<{ message: string }>('/experiences/sort', payload)
}
