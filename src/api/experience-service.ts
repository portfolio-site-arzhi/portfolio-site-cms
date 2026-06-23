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

const JSON_REQUEST_HEADERS = {
  Accept: 'application/json',
}

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

export function downloadExperiencesImportSampleApi (): Promise<AxiosResponse<Blob>> {
  return httpClient.get<Blob>('/experiences/import/sample', {
    headers: JSON_REQUEST_HEADERS,
    responseType: 'blob',
  })
}

export function importExperiencesApi (file: File): Promise<AxiosResponse<{ message: string }>> {
  const formData = new FormData()

  formData.append('file', file)

  return httpClient.post<{ message: string }>('/experiences/import', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
