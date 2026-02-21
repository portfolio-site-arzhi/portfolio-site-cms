import type { AxiosResponse } from 'axios'
import type {
  CertificationDetailResponse,
  CertificationsListResponse,
  CreateCertificationPayload,
  FetchCertificationsParams,
  UpdateCertificationPayload,
  UpdateCertificationsSortPayload,
} from '@/model/certification'
import httpClient from '@/api/http'

export function fetchCertificationsApi (params?: FetchCertificationsParams): Promise<AxiosResponse<CertificationsListResponse>> {
  return httpClient.get<CertificationsListResponse>('/certifications', {
    params,
  })
}

export function fetchCertificationDetailApi (id: number): Promise<AxiosResponse<CertificationDetailResponse>> {
  return httpClient.get<CertificationDetailResponse>(`/certifications/${id}`)
}

export function createCertificationApi (payload: CreateCertificationPayload): Promise<AxiosResponse<CertificationDetailResponse>> {
  return httpClient.post<CertificationDetailResponse>('/certifications', payload)
}

export function updateCertificationApi (id: number, payload: UpdateCertificationPayload): Promise<AxiosResponse<CertificationDetailResponse>> {
  return httpClient.put<CertificationDetailResponse>(`/certifications/${id}`, payload)
}

export function deleteCertificationApi (id: number): Promise<AxiosResponse<{ message: string }>> {
  return httpClient.delete<{ message: string }>(`/certifications/${id}`)
}

export function updateCertificationsSortApi (payload: UpdateCertificationsSortPayload): Promise<AxiosResponse<{ message: string }>> {
  return httpClient.patch<{ message: string }>('/certifications/sort', payload)
}
