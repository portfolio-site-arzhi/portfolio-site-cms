import type { AxiosError, AxiosResponse } from 'axios'
import type { AuthState, ProfileResponse } from '@/model/auth'
import { defineStore } from 'pinia'
import { fetchProfileApi, logoutApi } from '@/api/auth-service'
import router from '@/router'
import { clearIsLoggedInCookie, readIsLoggedInCookie } from '@/utils/auth-cookie'

let restoreSessionPromise: Promise<boolean> | null = null

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

function isCurrentRouteLogin (): boolean {
  return router.currentRoute.value.path === '/login'
}

export const useAuthStore = defineStore('auth', {
  state (): AuthState {
    return {
      isLoggedIn: readIsLoggedInCookie(),
      loadingProfile: false,
      profile: null,
      sessionResolved: false,
    }
  },
  actions: {
    setAuthenticatedProfile (profile: ProfileResponse['user']): void {
      this.isLoggedIn = true
      this.profile = profile
      this.sessionResolved = true
    },
    setLoggedOut (): void {
      this.isLoggedIn = false
      this.profile = null
      this.sessionResolved = true
      clearIsLoggedInCookie()
    },
    handleUnauthorizedError (error: unknown): void {
      const axiosError = extractAxiosError(error)

      if (!axiosError || !isUnauthorizedStatus(axiosError.response?.status)) {
        return
      }

      this.setLoggedOut()

      if (!isCurrentRouteLogin()) {
        router.push('/login').catch(function (navigationError: unknown) {
          const navigationAxiosError = extractAxiosError(navigationError)

          if (navigationAxiosError) {
            console.error('Failed during unauthorized navigation', navigationAxiosError)
          }
        })
      }
    },
    restoreSession (): Promise<boolean> {
      if (this.profile) {
        this.isLoggedIn = true
        this.sessionResolved = true

        return Promise.resolve(true)
      }

      if (this.sessionResolved && !this.isLoggedIn) {
        return Promise.resolve(false)
      }

      if (restoreSessionPromise !== null) {
        return restoreSessionPromise
      }

      this.loadingProfile = true

      restoreSessionPromise = fetchProfileApi().then(response => {
        this.setAuthenticatedProfile(response.data.user)

        return true
      }).catch((error: AxiosError) => {
        console.error('Failed to restore user session', error)
        this.setLoggedOut()

        return false
      }).finally(() => {
        this.loadingProfile = false
        this.sessionResolved = true
        restoreSessionPromise = null
      })

      return restoreSessionPromise
    },
    fetchProfile (): Promise<AxiosResponse<ProfileResponse>> {
      this.loadingProfile = true

      return fetchProfileApi().then(response => {
        this.setAuthenticatedProfile(response.data.user)

        return response
      }).catch((error: AxiosError) => {
        console.error('Failed to fetch user profile', error)
        this.handleUnauthorizedError(error)

        throw error
      }).finally(() => {
        this.loadingProfile = false
        this.sessionResolved = true
      })
    },
    logout (): Promise<AxiosResponse<unknown>> {
      return logoutApi().then(response => {
        this.setLoggedOut()
        if (!isCurrentRouteLogin()) {
          router.push('/login').catch(function (error: unknown) {
            const axiosError = extractAxiosError(error)

            if (axiosError) {
              console.error('Failed to navigate after logout', axiosError)
            }
          })
        }

        return response
      }).catch((error: AxiosError) => {
        console.error('Failed to logout', error)
        this.setLoggedOut()

        throw error
      })
    },
  },
})
