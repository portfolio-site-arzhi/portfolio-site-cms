import { describe, expect, it } from 'vitest'
import { getAuthRedirectPath } from '../src/router/auth-guard'

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
})
