import type { AxiosResponse } from 'axios'
import type {
  CreatePortfolioPayload,
  FetchPortfoliosParams,
  PortfolioDetailResponse,
  PortfoliosListResponse,
  UpdatePortfolioPayload,
  UpdatePortfoliosSortPayload,
} from '@/model/portfolio'
import httpClient from '@/api/http'

const JSON_REQUEST_HEADERS = {
  Accept: 'application/json',
}

export function fetchPortfoliosApi (params?: FetchPortfoliosParams): Promise<AxiosResponse<PortfoliosListResponse>> {
  return httpClient.get<PortfoliosListResponse>('/portfolios', {
    params,
  })
}

export function fetchPortfolioDetailApi (id: number): Promise<AxiosResponse<PortfolioDetailResponse>> {
  return httpClient.get<PortfolioDetailResponse>(`/portfolios/${id}`)
}

export function createPortfolioApi (
  payload: CreatePortfolioPayload,
  imageFile?: File | null,
): Promise<AxiosResponse<PortfolioDetailResponse>> {
  const formData = new FormData()

  formData.append('payload', JSON.stringify(payload))

  if (imageFile) {
    formData.append('image', imageFile)
  }

  return httpClient.post<PortfolioDetailResponse>('/portfolios', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export function updatePortfolioApi (
  id: number,
  payload: UpdatePortfolioPayload,
  imageFile?: File | null,
): Promise<AxiosResponse<PortfolioDetailResponse>> {
  const formData = new FormData()

  formData.append('payload', JSON.stringify(payload))

  if (imageFile) {
    formData.append('image', imageFile)
  }

  return httpClient.put<PortfolioDetailResponse>(`/portfolios/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export function deletePortfolioApi (id: number): Promise<AxiosResponse<{ message: string }>> {
  return httpClient.delete<{ message: string }>(`/portfolios/${id}`)
}

export function updatePortfoliosSortApi (payload: UpdatePortfoliosSortPayload): Promise<AxiosResponse<{ message: string }>> {
  return httpClient.patch<{ message: string }>('/portfolios/sort', payload)
}

export function downloadPortfoliosImportSampleApi (): Promise<AxiosResponse<Blob>> {
  return httpClient.get<Blob>('/portfolios/import/sample', {
    headers: JSON_REQUEST_HEADERS,
    responseType: 'blob',
  })
}

export function importPortfoliosApi (file: File): Promise<AxiosResponse<{ message: string }>> {
  const formData = new FormData()

  formData.append('file', file)

  return httpClient.post<{ message: string }>('/portfolios/import', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
