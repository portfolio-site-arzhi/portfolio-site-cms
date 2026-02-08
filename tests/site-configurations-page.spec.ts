import { createTestingPinia } from '@pinia/testing'
import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import ColorPickerInput from '../src/components/ColorPickerInput.vue'
import ConfirmDialog from '../src/components/ConfirmDialog.vue'
import HomeTab from '../src/components/site-config/HomeTab.vue'
import SystemTab from '../src/components/site-config/SystemTab.vue'
import SiteConfigurationsPage from '../src/pages/site-configurations.vue'
import { useSiteConfigStore } from '../src/stores/site-config'

vi.mock('vuetify', () => ({
  useDisplay: () => ({
    smAndDown: {
      value: false,
    },
  }),
  useTheme: () => ({
    themes: {
      value: {
        light: {
          colors: {
            primary: '#000000',
            secondary: '#ffffff',
          },
        },
      },
    },
  }),
}))

const mockResponse = {
  data: {
    data: {
      system: {
        primary_color: '#000000',
        secondary_color: '#ffffff',
      },
      home: {
        name: 'Nama ID',
        position: 'Posisi ID',
        description: {
          id: 'Desc ID',
          en: 'Desc EN',
        },
        photo: 'img.jpg',
      },
      about: {
        about_me: {
          id: 'About ID',
          en: 'About EN',
        },
        email: 'test@example.com',
      },
      footer: {
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
        instagram: 'https://instagram.com',
      },
    },
  },
}

const {
  fetchSiteConfigsApiMock,
  saveSiteConfigsBulkApiMock,
} = vi.hoisted(() => ({
  fetchSiteConfigsApiMock: vi.fn(),
  saveSiteConfigsBulkApiMock: vi.fn(),
}))

vi.mock('@/api/site-config-service', () => ({
  fetchSiteConfigsApi: fetchSiteConfigsApiMock,
  saveSiteConfigsBulkApi: saveSiteConfigsBulkApiMock,
}))

describe('SiteConfigurationsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    fetchSiteConfigsApiMock.mockResolvedValue(structuredClone(mockResponse))
    saveSiteConfigsBulkApiMock.mockResolvedValue({ data: {} })
  })

  it('should load configurations on mount', async () => {
    const wrapper = mount(SiteConfigurationsPage, {
      global: {
        plugins: [createTestingPinia({
          createSpy: vi.fn,
          initialState: {
            'site-config': {
              loaded: false,
              loading: false,
              system: { primary_color: '#000000', secondary_color: '#ffffff' },
            },
          },
        })],
        stubs: {
          teleport: true,
        },
      },
    })

    // Manually trigger fetch if it wasn't called by store (since we mock it)
    // Actually createTestingPinia mocks actions by default, so we check if the action was called
    const store = useSiteConfigStore()
    expect(store.fetchSiteConfigs).toHaveBeenCalled()

    await flushPromises()

    const confirmDialog = wrapper.findComponent(ConfirmDialog)
    expect(confirmDialog.exists()).toBe(true)
  })

  it('should populate form values from API response', async () => {
    const wrapper = mount(SiteConfigurationsPage, {
      global: {
        plugins: [createTestingPinia({
          createSpy: vi.fn,
          stubActions: false,
        })],
        stubs: {
          teleport: true,
        },
      },
    })

    await flushPromises()

    const vm = wrapper.vm as any

    expect(vm.form.system.primary_color).toBe('#000000')
    expect(vm.form.system.secondary_color).toBe('#ffffff')

    expect(vm.form.home.name).toBe('Nama ID')
    expect(vm.form.home.position).toBe('Posisi ID')
    expect(vm.form.home.description.id).toBe('Desc ID')
    expect(vm.form.home.description.en).toBe('Desc EN')

    expect(vm.form.about.about_me.id).toBe('About ID')
    expect(vm.form.about.about_me.en).toBe('About EN')
    expect(vm.form.about.email).toBe('test@example.com')

    expect(vm.form.footer.github).toBe('https://github.com')
    expect(vm.form.footer.linkedin).toBe('https://linkedin.com')
    expect(vm.form.footer.instagram).toBe('https://instagram.com')
  })

  it('should save with updated values when form is valid', async () => {
    // Override mock to ensure all required fields are present
    fetchSiteConfigsApiMock.mockResolvedValue({
      data: {
        data: {
          system: {
            primary_color: '#000000',
            secondary_color: '#ffffff',
          },
          home: {
            name: 'Nama ID',
            position: 'Posisi ID',
            description: {
              id: 'Desc ID',
              en: 'Desc EN',
            },
            photo: 'img.jpg',
          },
          about: {
            about_me: {
              id: 'About ID',
              en: 'About EN',
            },
            email: 'test@example.com',
          },
          footer: {
            github: 'https://github.com',
            linkedin: 'https://linkedin.com',
            instagram: 'https://instagram.com',
          },
        },
      },
    })

    const wrapper = mount(SiteConfigurationsPage, {
      global: {
        plugins: [createTestingPinia({
          createSpy: vi.fn,
          stubActions: false, // We want real actions to populate store if we are testing integration
          initialState: {
            'site-config': {
              loaded: false,
              loading: false,
              system: { primary_color: '#000000', secondary_color: '#ffffff' },
              home: {
                name: 'Nama ID',
                position: 'Posisi ID',
                description: { id: 'Desc ID', en: 'Desc EN' },
                photo: 'img.jpg',
              },
              about: {
                about_me: { id: 'About ID', en: 'About EN' },
                email: 'test@example.com',
              },
              footer: {
                github: 'https://github.com',
                linkedin: 'https://linkedin.com',
                instagram: 'https://instagram.com',
              },
            },
          },
        })],
        stubs: {
          teleport: true,
        },
      },
    })

    await flushPromises()

    // 1. Change Primary Color in System Tab
    // System Tab is active by default
    const systemTab = wrapper.findComponent(SystemTab)
    expect(systemTab.exists()).toBe(true)

    // Find ColorPickerInput inside SystemTab
    const colorPickers = systemTab.findAllComponents(ColorPickerInput)
    expect(colorPickers.length).toBeGreaterThan(0)

    // Interact with the first ColorPickerInput (Primary Color)
    // Emit update event to simulate user picking a color
    await colorPickers[0].vm.$emit('update:modelValue', '#FF0000')

    // Verify update
    const vm = wrapper.vm as any
    expect(vm.form.system.primary_color).toBe('#FF0000')

    // 2. Click Save Button
    const saveBtn = wrapper.findAll('v-btn').find(w => w.text().includes('Simpan Perubahan'))
    expect(saveBtn).toBeDefined()

    if (saveBtn) {
      await saveBtn.trigger('click')

      // Wait for validation
      await flushPromises()
      await new Promise(resolve => setTimeout(resolve, 100))

      // 3. Confirm Dialog should appear
      const confirmDialog = wrapper.findComponent(ConfirmDialog)
      expect(confirmDialog.exists()).toBe(true)
      expect(confirmDialog.props('modelValue')).toBe(true)

      // 4. Click "Ya, Simpan" inside dialog
      const confirmBtn = confirmDialog.findAll('v-btn').find(w => w.text().includes('Ya, Simpan'))
      expect(confirmBtn).toBeDefined()

      if (confirmBtn) {
        await confirmBtn.trigger('click')
        await flushPromises() // Wait for API call

        expect(saveSiteConfigsBulkApiMock).toHaveBeenCalled()

        // 5. Check if the payload has the updated value
        const lastCallArgs = saveSiteConfigsBulkApiMock.mock.calls[0][0]
        expect(lastCallArgs.system.primary_color).toBe('#FF0000')
      }
    }
  })

  it('should show validation error and block save when required home.name is empty', async () => {
    const wrapper = mount(SiteConfigurationsPage, {
      global: {
        plugins: [createTestingPinia({
          createSpy: vi.fn,
          stubActions: false,
          initialState: {
            'site-config': {
              loaded: false,
              loading: false,
              system: { primary_color: '#000000', secondary_color: '#ffffff' },
              home: {
                name: 'Nama ID',
                position: 'Posisi ID',
                description: { id: 'Desc ID', en: 'Desc EN' },
                photo: 'img.jpg',
              },
              about: {
                about_me: { id: 'About ID', en: 'About EN' },
                email: 'test@example.com',
              },
              footer: {
                github: 'https://github.com',
                linkedin: 'https://linkedin.com',
                instagram: 'https://instagram.com',
              },
            },
          },
        })],
        stubs: {
          teleport: true,
        },
      },
    })

    await flushPromises()

    const vm = wrapper.vm as any

    vm.setFieldValue('home.name', '')

    const validationResult = await vm.validateField('home.name')
    expect(validationResult.valid).toBe(false)
    expect(validationResult.errors[0]).toBe('Nama wajib diisi')

    expect(vm.errors['home.name']).toBe('Nama wajib diisi')

    await flushPromises()

    const saveBtn = wrapper.findAll('v-btn').find(w => w.text().includes('Simpan Perubahan'))
    expect(saveBtn).toBeDefined()

    if (saveBtn) {
      await saveBtn.trigger('click')
      await flushPromises()

      const confirmDialog = wrapper.findComponent(ConfirmDialog)
      expect(confirmDialog.exists()).toBe(true)
      expect(confirmDialog.props('modelValue')).toBe(false)

      expect(saveSiteConfigsBulkApiMock).not.toHaveBeenCalled()

      const nameField = wrapper.find('v-text-field[name="home_name"]')
      expect(nameField.exists()).toBe(true)
      expect(nameField.attributes('error-messages')).toBe('Nama wajib diisi')
    }
  })

  it('HomeTab: set status_file saat foto dipilih', async () => {
    const createObjectURLMock = vi.fn(() => 'blob:preview')
    const revokeObjectURLMock = vi.fn()

    const originalCreateObjectURL = URL.createObjectURL
    const originalRevokeObjectURL = URL.revokeObjectURL

    ;(URL as unknown as { createObjectURL: unknown }).createObjectURL = createObjectURLMock
    ;(URL as unknown as { revokeObjectURL: unknown }).revokeObjectURL = revokeObjectURLMock

    let model: {
      name: string
      position: string
      description: { id: string, en: string }
      photo: string | null
      status_file?: number
    } = {
      name: 'Nama',
      position: 'Posisi',
      description: { id: 'ID', en: 'EN' },
      photo: null,
    }
    let file: File | null = null

    const wrapper = mount(HomeTab, {
      props: {
        'modelValue': model,
        file,
        'onUpdate:modelValue': (val: any) => {
          model = val
          wrapper.setProps({ modelValue: val })
        },
        'onUpdate:file': (val: any) => {
          file = val
          wrapper.setProps({ file: val })
        },
      },
    })

    const input = wrapper.get('input[type="file"]')
    const selectedFile = new File(['x'], 'photo.png', { type: 'image/png' })

    Object.defineProperty(input.element, 'files', {
      value: [selectedFile],
      configurable: true,
    })

    await input.trigger('change')
    await flushPromises()

    expect(file).toBe(selectedFile)
    expect(model.status_file).toBe(1)
    expect(createObjectURLMock).toHaveBeenCalled()

    ;(URL as unknown as { createObjectURL: unknown }).createObjectURL = originalCreateObjectURL
    ;(URL as unknown as { revokeObjectURL: unknown }).revokeObjectURL = originalRevokeObjectURL
  })

  it('HomeTab: hapus foto mengosongkan photo dan set status_file', async () => {
    let model: {
      name: string
      position: string
      description: { id: string, en: string }
      photo: string | null
      status_file?: number
    } = {
      name: 'Nama',
      position: 'Posisi',
      description: { id: 'ID', en: 'EN' },
      photo: 'img.jpg',
    }
    let file: File | null = new File(['x'], 'photo.png', { type: 'image/png' })

    const wrapper = mount(HomeTab, {
      props: {
        'modelValue': model,
        file,
        'onUpdate:modelValue': (val: any) => {
          model = val
          wrapper.setProps({ modelValue: val })
        },
        'onUpdate:file': (val: any) => {
          file = val
          wrapper.setProps({ file: val })
        },
      },
    })

    const deleteBtn = wrapper.get('v-btn')
    await deleteBtn.trigger('click')
    await flushPromises()

    expect(file).toBeNull()
    expect(model.photo).toBeNull()
    expect(model.status_file).toBe(1)
  })
})
