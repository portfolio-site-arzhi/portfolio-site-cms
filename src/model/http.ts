import type { AxiosRequestConfig } from 'axios'

export interface RetryAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean
}

export interface FormErrorResponse {
  errors: string[]
}
