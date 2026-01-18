import type { AxiosResponse } from 'axios'
import type { ProfileResponse } from '@/model/auth'
import httpClient from '@/api/http'

export function fetchProfileApi (): Promise<AxiosResponse<ProfileResponse>> {
  return httpClient.get<ProfileResponse>('/auth/profile')
}

export function logoutApi (): Promise<AxiosResponse<unknown>> {
  return httpClient.post('/auth/logout')
}
