import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import NotFoundPage from '../src/pages/[...all].vue'

vi.mock('vuetify', () => ({
  useDisplay: () => ({
    smAndDown: {
      value: false,
    },
  }),
}))

describe('NotFoundPage', () => {
  it('menampilkan judul 404', () => {
    const wrapper = mount(NotFoundPage)

    expect(wrapper.text()).toContain('404')
  })

  it('menampilkan pesan halaman tidak ditemukan', () => {
    const wrapper = mount(NotFoundPage)

    expect(wrapper.text()).toContain('Halaman Tidak Ditemukan')
    expect(wrapper.text()).toContain('Halaman yang Anda cari tidak ada atau telah dipindahkan.')
  })

  it('memiliki tombol untuk kembali ke beranda', () => {
    const wrapper = mount(NotFoundPage)

    const button = wrapper.get('v-btn')

    expect(button.text()).toContain('Kembali ke Beranda')
  })

  it('tombol mengarah ke halaman /home', () => {
    const wrapper = mount(NotFoundPage)

    const button = wrapper.get('v-btn')

    expect(button.attributes('to')).toBe('/home')
  })
})
