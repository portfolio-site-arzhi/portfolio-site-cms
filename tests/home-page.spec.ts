import { createTestingPinia } from '@pinia/testing'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import HomePage from '../src/pages/home.vue'

describe('HomePage', () => {
  it('menampilkan fallback saat profil null dan belum login', () => {
    const wrapper = mount(HomePage, {
      global: {
        plugins: [createTestingPinia({
          createSpy: vi.fn,
          initialState: {
            auth: {
              isLoggedIn: false,
              profile: null,
            },
          },
        })],
      },
    })

    expect(wrapper.text()).toContain('Pengguna')
    expect(wrapper.text()).toContain('Email belum tersedia')
    expect(wrapper.text()).toContain('Belum login')
  })

  it('menampilkan data profil saat tersedia', () => {
    const wrapper = mount(HomePage, {
      global: {
        plugins: [createTestingPinia({
          createSpy: vi.fn,
          initialState: {
            auth: {
              isLoggedIn: true,
              profile: {
                name: 'Ardi',
                email: 'ardi@example.com',
                status: true,
              },
            },
          },
        })],
      },
    })

    expect(wrapper.text()).toContain('Ardi')
    expect(wrapper.text()).toContain('ardi@example.com')
    expect(wrapper.text()).toContain('Aktif')
  })
})
