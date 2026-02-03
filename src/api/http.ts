import type { FormErrorResponse, RetryAxiosRequestConfig } from '@/model/http'
import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosResponse,
} from 'axios'
import router from '@/router'
import { useAppStore } from '@/stores/app'
import { clearIsLoggedInCookie } from '@/utils/auth-cookie'

const backendUrl = import.meta.env.VITE_APP_BACKEND_URL

const httpClient: AxiosInstance = axios.create({
  baseURL: backendUrl,
  withCredentials: true,
})

let refreshPromise: Promise<AxiosResponse<unknown>> | null = null

function refreshAccessToken (): Promise<AxiosResponse<unknown>> {
  if (refreshPromise !== null) {
    return refreshPromise
  }

  refreshPromise = axios.post(
    `${backendUrl}/auth/refresh-token`,
    {},
    {
      withCredentials: true,
    },
  ).catch(function (error: AxiosError) {
    console.error('Failed to refresh access token', error)
    throw error
  }).finally(function () {
    refreshPromise = null
  })

  return refreshPromise
}

httpClient.interceptors.response.use(
  function (response: AxiosResponse) {
    return response
  },
  function (error: AxiosError) {
    const response = error.response
    if (!response) {
      return Promise.reject(error)
    }

    const status = response.status

    if (status === 400) {
      const data = response.data as FormErrorResponse | undefined

      if (data && Array.isArray(data.errors)) {
        const enhancedError = error as AxiosError<FormErrorResponse> & { formErrors?: string[] }
        enhancedError.formErrors = data.errors

        const appStore = useAppStore()
        appStore.showError(data.errors.join(', '))
      }

      return Promise.reject(error)
    }

    if (status === 403 || status === 429) {
      clearIsLoggedInCookie()

      if (router.currentRoute.value.path !== '/login') {
        router.push('/login').catch(function (navigationError: unknown) {
          console.error('Failed to navigate after forbidden or rate limit', navigationError)
        })
      }

      return Promise.reject(error)
    }

    const requestConfig = error.config as RetryAxiosRequestConfig | undefined

    if (!requestConfig) {
      return Promise.reject(error)
    }

    if (status !== 401) {
      return Promise.reject(error)
    }

    if (requestConfig._retry === true) {
      return Promise.reject(error)
    }

    requestConfig._retry = true

    return refreshAccessToken().then(function () {
      return httpClient(requestConfig)
    }).catch(function (refreshError: AxiosError) {
      console.error('Request failed after refresh token attempt', refreshError)
      throw refreshError
    })
  },
)

export default httpClient
