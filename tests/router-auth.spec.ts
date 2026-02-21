import { beforeEach, describe, expect, it, vi } from 'vitest'

import router from '../src/router'

const authStoreMock = {
  isLoggedIn: false,
}

const useAuthStoreMock = vi.fn(() => authStoreMock)

const readIsLoggedInCookieMock = vi.fn(() => false)

vi.mock('@/stores/auth', () => ({
  useAuthStore: () => useAuthStoreMock(),
}))

vi.mock('@/utils/auth-cookie', () => ({
  readIsLoggedInCookie: () => readIsLoggedInCookieMock(),
  clearIsLoggedInCookie: () => {},
}))

describe('Router auth guards', () => {
  beforeEach(async () => {
    authStoreMock.isLoggedIn = false
    readIsLoggedInCookieMock.mockReturnValue(false)

    await router.push('/')
  }, 20_000)

  it('mengalihkan ke /login jika mengakses /home tanpa login', async () => {
    await router.push('/home')

    expect(router.currentRoute.value.path).toBe('/login')
  })

  it('mengalihkan ke /home jika sudah login dan mengakses /login', async () => {
    authStoreMock.isLoggedIn = true

    await router.push('/login')

    expect(router.currentRoute.value.path).toBe('/home')
  })
})
