import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import LoginPage from '../src/pages/login.vue'

const { navigateToUrlMock } = vi.hoisted(() => ({
  navigateToUrlMock: vi.fn(),
}))

vi.mock('../src/utils/navigation', () => ({
  navigateToUrl: navigateToUrlMock,
}))

describe('LoginPage', () => {
  it('menampilkan teks informasi login', () => {
    const wrapper = mount(LoginPage)

    expect(wrapper.text()).toContain('Login ke CMS')
    expect(wrapper.text()).toContain('Kelola konten portfolio Anda dengan aman menggunakan akun Google.')
  })

  it('mengarah ke endpoint auth google saat tombol diklik', async () => {
    const backendUrl = 'http://localhost:9000'
    vi.stubEnv('VITE_APP_BACKEND_URL', backendUrl)

    const wrapper = mount(LoginPage)
    const button = wrapper.get('v-btn')

    await button.trigger('click')

    expect(navigateToUrlMock).toHaveBeenCalledWith(`${backendUrl}/auth/google`)
  })

  //
})
