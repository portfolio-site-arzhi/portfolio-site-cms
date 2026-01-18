import type { AxiosError, AxiosResponse } from 'axios'
import type { AuthState, ProfileResponse } from '@/model/auth'
import { defineStore } from 'pinia'
import { fetchProfileApi, logoutApi } from '@/api/auth-service'
import router from '@/router'
import { clearIsLoggedInCookie, readIsLoggedInCookie } from '@/utils/auth-cookie'

function isUnauthorizedStatus (status: number | undefined): boolean {
  return status === 401 || status === 403
}

function extractAxiosError (error: unknown): AxiosError | null {
  if (typeof error !== 'object' || error === null) {
    return null
  }

  if (!('isAxiosError' in error)) {
    return null
  }

  return error as AxiosError
}

export const useAuthStore = defineStore('auth', {
  state (): AuthState {
    return {
      isLoggedIn: readIsLoggedInCookie(),
      loadingProfile: false,
      profile: null,
    }
  },
  actions: {
    setLoggedOut (): void {
      this.isLoggedIn = false
      this.profile = null
      clearIsLoggedInCookie()
    },
    handleUnauthorizedError (error: unknown): void {
      const axiosError = extractAxiosError(error)

      if (!axiosError || !isUnauthorizedStatus(axiosError.response?.status)) {
        return
      }

      this.setLoggedOut()

      if (router.currentRoute.value.path !== '/login') {
        router.push('/login').catch(function (navigationError: unknown) {
          const navigationAxiosError = extractAxiosError(navigationError)

          if (navigationAxiosError) {
            console.error('Failed during unauthorized navigation', navigationAxiosError)
          }
        })
      }
    },
    fetchProfile (): Promise<AxiosResponse<ProfileResponse>> {
      this.loadingProfile = true

      return fetchProfileApi().then(response => {
        this.isLoggedIn = true
        this.profile = response.data.user

        return response
      }).catch((error: AxiosError) => {
        console.error('Failed to fetch user profile', error)
        this.handleUnauthorizedError(error)

        throw error
      }).finally(() => {
        this.loadingProfile = false
      })
    },
    logout (): Promise<AxiosResponse<unknown>> {
      return logoutApi().then(response => {
        this.setLoggedOut()
        router.push('/login').catch(function (error: unknown) {
          const axiosError = extractAxiosError(error)

          if (axiosError) {
            console.error('Failed to navigate after logout', axiosError)
          }
        })

        return response
      }).catch((error: AxiosError) => {
        console.error('Failed to logout', error)
        this.setLoggedOut()

        throw error
      })
    },
  },
})
