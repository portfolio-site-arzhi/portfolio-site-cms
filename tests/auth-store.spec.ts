import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuthStore } from '../src/stores/auth'

const {
  fetchProfileApiMock,
  logoutApiMock,
  readIsLoggedInCookieMock,
  clearIsLoggedInCookieMock,
  routerPushMock,
} = vi.hoisted(() => ({
  fetchProfileApiMock: vi.fn(() => Promise.resolve({
    data: {
      user: {
        id: 1,
        email: 'user@example.com',
        name: 'Test User',
        status: true,
      },
    },
  })),
  logoutApiMock: vi.fn(() => Promise.resolve({
    data: {
      message: 'Logout berhasil',
    },
  })),
  readIsLoggedInCookieMock: vi.fn(() => true),
  clearIsLoggedInCookieMock: vi.fn(),
  routerPushMock: vi.fn(() => Promise.resolve()),
}))

vi.mock('@/api/auth-service', () => ({
  fetchProfileApi: fetchProfileApiMock,
  logoutApi: logoutApiMock,
}))

vi.mock('@/utils/auth-cookie', () => ({
  readIsLoggedInCookie: readIsLoggedInCookieMock,
  clearIsLoggedInCookie: clearIsLoggedInCookieMock,
}))

vi.mock('@/router', () => ({
  default: {
    currentRoute: {
      value: {
        path: '/',
      },
    },
    push: routerPushMock,
  },
}))

describe('AuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    readIsLoggedInCookieMock.mockClear()
    clearIsLoggedInCookieMock.mockClear()
    fetchProfileApiMock.mockClear()
    logoutApiMock.mockClear()
    routerPushMock.mockClear()
  })

  it('menggunakan cookie is_logged_in saat inisialisasi', () => {
    readIsLoggedInCookieMock.mockReturnValue(true)

    const store = useAuthStore()

    expect(store.isLoggedIn).toBe(true)
  })

  it('fetchProfile mengisi data profil dan menandai sebagai login', async () => {
    readIsLoggedInCookieMock.mockReturnValue(false)

    const store = useAuthStore()

    await store.fetchProfile()

    expect(fetchProfileApiMock).toHaveBeenCalled()
    expect(store.isLoggedIn).toBe(true)
    expect(store.profile).not.toBeNull()
    expect(store.profile?.email).toBe('user@example.com')
    expect(store.sessionResolved).toBe(true)
  })

  it('restoreSession memulihkan sesi backend meski cookie login frontend tidak tersedia', async () => {
    readIsLoggedInCookieMock.mockReturnValue(false)

    const store = useAuthStore()

    const restored = await store.restoreSession()

    expect(restored).toBe(true)
    expect(fetchProfileApiMock).toHaveBeenCalled()
    expect(store.isLoggedIn).toBe(true)
    expect(store.profile?.email).toBe('user@example.com')
    expect(store.sessionResolved).toBe(true)
    expect(routerPushMock).not.toHaveBeenCalled()
  })

  it('restoreSession menandai logout saat sesi backend tidak valid', async () => {
    readIsLoggedInCookieMock.mockReturnValue(false)
    fetchProfileApiMock.mockRejectedValueOnce({
      isAxiosError: true,
      response: {
        status: 401,
      },
    })

    const store = useAuthStore()

    const restored = await store.restoreSession()

    expect(restored).toBe(false)
    expect(store.isLoggedIn).toBe(false)
    expect(store.profile).toBeNull()
    expect(store.sessionResolved).toBe(true)
    expect(clearIsLoggedInCookieMock).toHaveBeenCalled()
    expect(routerPushMock).not.toHaveBeenCalled()
  })

  it('logout menghapus status login dan mengarahkan ke /login', async () => {
    readIsLoggedInCookieMock.mockReturnValue(true)

    const store = useAuthStore()

    await store.logout().catch(() => {
      //
    })

    expect(logoutApiMock).toHaveBeenCalled()
    expect(store.isLoggedIn).toBe(false)
    expect(store.profile).toBeNull()
    expect(clearIsLoggedInCookieMock).toHaveBeenCalled()
    expect(routerPushMock).toHaveBeenCalledWith('/login')
  })
})
