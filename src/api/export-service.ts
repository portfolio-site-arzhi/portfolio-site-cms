import type { AxiosResponse } from 'axios'
import type { ExportLocale } from '@/model/export'
import httpClient from '@/api/http'

const PDF_REQUEST_HEADERS = {
  Accept: 'application/pdf',
}

export function exportCvPdfApi (locale: ExportLocale): Promise<AxiosResponse<Blob>> {
  return httpClient.get<Blob>('/exports/cv', {
    headers: PDF_REQUEST_HEADERS,
    params: {
      locale,
    },
    responseType: 'blob',
  })
}

export function exportPortfoliosPdfApi (locale: ExportLocale): Promise<AxiosResponse<Blob>> {
  return httpClient.get<Blob>('/exports/portfolios', {
    headers: PDF_REQUEST_HEADERS,
    params: {
      locale,
    },
    responseType: 'blob',
  })
}
