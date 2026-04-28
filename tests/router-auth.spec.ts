import { describe, expect, it } from 'vitest'
import {
  getAuthRedirectPath,
  shouldRestoreSessionForRoute,
} from '../src/router/auth-guard'

describe('Router auth guards', () => {
  it('mengalihkan ke /login jika mengakses /home tanpa login', () => {
    const redirectPath = getAuthRedirectPath({
      path: '/home',
      meta: {},
      isLoggedIn: false,
    })

    expect(redirectPath).toBe('/login')
  })

  it('mengalihkan ke /home jika sudah login dan mengakses /login', () => {
    const redirectPath = getAuthRedirectPath({
      path: '/login',
      meta: {
        public: true,
      },
      isLoggedIn: true,
    })

    expect(redirectPath).toBe('/home')
  })

  it('meminta restore session saat masuk route protected tanpa status login yang sudah terverifikasi', () => {
    const shouldRestore = shouldRestoreSessionForRoute({
      path: '/home',
      meta: {},
      isLoggedIn: false,
      sessionResolved: false,
    })

    expect(shouldRestore).toBe(true)
  })

  it('meminta restore session saat membuka login agar sesi lintas subdomain tetap terdeteksi', () => {
    const shouldRestore = shouldRestoreSessionForRoute({
      path: '/login',
      meta: {
        public: true,
      },
      isLoggedIn: false,
      sessionResolved: false,
    })

    expect(shouldRestore).toBe(true)
  })

  it('tidak restore session lagi jika status auth sudah pernah dipastikan', () => {
    const shouldRestore = shouldRestoreSessionForRoute({
      path: '/home',
      meta: {},
      isLoggedIn: false,
      sessionResolved: true,
    })

    expect(shouldRestore).toBe(false)
  })
})
