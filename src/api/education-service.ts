import type { AxiosResponse } from 'axios'
import type {
  CreateEducationPayload,
  EducationDetailResponse,
  EducationsListResponse,
  FetchEducationsParams,
  UpdateEducationPayload,
  UpdateEducationsSortPayload,
} from '@/model/education'
import httpClient from '@/api/http'

export function fetchEducationsApi (params?: FetchEducationsParams): Promise<AxiosResponse<EducationsListResponse>> {
  return httpClient.get<EducationsListResponse>('/educations', {
    params,
  })
}

export function fetchEducationDetailApi (id: number): Promise<AxiosResponse<EducationDetailResponse>> {
  return httpClient.get<EducationDetailResponse>(`/educations/${id}`)
}

export function createEducationApi (payload: CreateEducationPayload): Promise<AxiosResponse<EducationDetailResponse>> {
  return httpClient.post<EducationDetailResponse>('/educations', payload)
}

export function updateEducationApi (id: number, payload: UpdateEducationPayload): Promise<AxiosResponse<EducationDetailResponse>> {
  return httpClient.put<EducationDetailResponse>(`/educations/${id}`, payload)
}

export function deleteEducationApi (id: number): Promise<AxiosResponse<{ message: string }>> {
  return httpClient.delete<{ message: string }>(`/educations/${id}`)
}

export function updateEducationsSortApi (payload: UpdateEducationsSortPayload): Promise<AxiosResponse<{ message: string }>> {
  return httpClient.patch<{ message: string }>('/educations/sort', payload)
}
