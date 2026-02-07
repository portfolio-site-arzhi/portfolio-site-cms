import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import ExperienceFormDialog from '../src/components/experience/ExperienceFormDialog.vue'

const smAndDownMock = ref(false)

vi.mock('vuetify', () => ({
  useDisplay: () => ({
    smAndDown: smAndDownMock,
  }),
}))

const {
  createExperienceApiMock,
  updateExperienceApiMock,
} = vi.hoisted(() => ({
  createExperienceApiMock: vi.fn(() => Promise.resolve({
    data: {
      data: {
        id: 1,
      },
    },
  })),
  updateExperienceApiMock: vi.fn(() => Promise.resolve({
    data: {
      data: {
        id: 1,
      },
    },
  })),
}))

vi.mock('@/api/experience-service', () => ({
  createExperienceApi: createExperienceApiMock,
  updateExperienceApi: updateExperienceApiMock,
}))

describe('ExperienceFormDialog', () => {
  it('mengirim data ke API saat membuat experience', async () => {
    const wrapper = mount(ExperienceFormDialog, {
      props: {
        modelValue: true,
        mode: 'create',
      },
      global: {
        stubs: {
          RichTextEditor: {
            props: ['modelValue'],
            emits: ['update:modelValue'],
            template: '<div />',
          },
          teleport: true,
        },
      },
    })

    const vm = wrapper.vm as unknown as {
      setValues: (values: any) => void
      onSubmit: () => Promise<void> | void
    }

    vm.setValues({
      is_published: true,
      role_id: ' Role ID ',
      role_en: ' Role EN ',
      company_name: ' Company ',
      company_url: '',
      year_start: '2023',
      year_end: '2025',
      is_current: true,
      description_id: '<p>ID</p>',
      description_en: '<p>EN</p>',
      skills: ['Vue', 'TypeScript', 'Vue'],
    })

    await vm.onSubmit()
    await flushPromises()

    expect(createExperienceApiMock).toHaveBeenCalledWith({
      is_published: true,
      role_id: 'Role ID',
      role_en: 'Role EN',
      company_name: 'Company',
      company_url: null,
      year_start: 2023,
      year_end: null,
      is_current: true,
      description_id: '<p>ID</p>',
      description_en: '<p>EN</p>',
      skills: [{ skill_name: 'Vue' }, { skill_name: 'TypeScript' }],
    })
  })

  it('mengirim data ke API saat mengedit experience', async () => {
    const existingExperience = {
      id: 7,
      sort: 10,
      is_published: false,
      role_id: 'Old',
      role_en: 'Old',
      company_name: 'Old Company',
      company_url: null,
      year_start: 2020,
      year_end: 2021,
      is_current: false,
      description_id: '<p>Old</p>',
      description_en: '<p>Old</p>',
      skills: [],
      created_at: '2026-01-01T00:00:00.000Z',
      updated_at: '2026-01-01T00:00:00.000Z',
    }

    const wrapper = mount(ExperienceFormDialog, {
      props: {
        modelValue: true,
        mode: 'edit',
        experience: existingExperience,
      },
      global: {
        stubs: {
          RichTextEditor: {
            props: ['modelValue'],
            emits: ['update:modelValue'],
            template: '<div />',
          },
          teleport: true,
        },
      },
    })

    const vm = wrapper.vm as unknown as {
      setValues: (values: any) => void
      onSubmit: () => Promise<void> | void
    }

    vm.setValues({
      is_published: false,
      role_id: 'New Role',
      role_en: 'New Role',
      company_name: 'New Company',
      company_url: 'https://example.com',
      year_start: '2021',
      year_end: '2022',
      is_current: false,
      description_id: '<p>New</p>',
      description_en: '<p>New</p>',
      skills: [],
    })

    await vm.onSubmit()
    await flushPromises()

    expect(updateExperienceApiMock).toHaveBeenCalledWith(7, expect.objectContaining({
      role_id: 'New Role',
      company_name: 'New Company',
      year_start: 2021,
      year_end: 2022,
    }))
  })

  it('menambahkan skill lewat dialog dan menampilkan di tabel', async () => {
    smAndDownMock.value = false

    const wrapper = mount(ExperienceFormDialog, {
      props: {
        modelValue: true,
        mode: 'create',
      },
      global: {
        stubs: {
          RichTextEditor: {
            props: ['modelValue'],
            emits: ['update:modelValue'],
            template: '<div />',
          },
          teleport: true,
        },
      },
    })

    const vm = wrapper.vm as unknown as {
      openSkillDialog: () => void
      saveSkill: () => void
      skillName: string
      skills: string[]
    }

    vm.openSkillDialog()
    vm.skillName = 'TypeScript'
    vm.saveSkill()

    await flushPromises()

    expect(vm.skills).toContain('TypeScript')
    expect(wrapper.html()).toContain('<v-table')
  })

  it('menolak skill kosong dan menampilkan pesan error', async () => {
    const wrapper = mount(ExperienceFormDialog, {
      props: {
        modelValue: true,
        mode: 'create',
      },
      global: {
        stubs: {
          RichTextEditor: {
            props: ['modelValue'],
            emits: ['update:modelValue'],
            template: '<div />',
          },
          teleport: true,
        },
      },
    })

    const vm = wrapper.vm as unknown as {
      openSkillDialog: () => void
      saveSkill: () => void
      skillError: string | null
    }

    vm.openSkillDialog()
    vm.saveSkill()

    expect(vm.skillError).toBe('Nama skill wajib diisi')
  })

  it('menampilkan daftar skill versi mobile saat smAndDown aktif', async () => {
    smAndDownMock.value = true

    const wrapper = mount(ExperienceFormDialog, {
      props: {
        modelValue: true,
        mode: 'create',
      },
      global: {
        stubs: {
          RichTextEditor: {
            props: ['modelValue'],
            emits: ['update:modelValue'],
            template: '<div />',
          },
          teleport: true,
        },
      },
    })

    const vm = wrapper.vm as unknown as {
      setValues: (values: any) => void
    }

    vm.setValues({
      skills: ['Vue'],
    })

    await flushPromises()

    expect(wrapper.text()).toContain('Vue')
    expect(wrapper.html()).not.toContain('<v-table')
  })

  it('mengirim urutan skill sesuai array saat mengedit experience', async () => {
    vi.clearAllMocks()
    smAndDownMock.value = false

    const existingExperience = {
      id: 7,
      sort: 10,
      is_published: false,
      role_id: 'Old',
      role_en: 'Old',
      company_name: 'Old Company',
      company_url: null,
      year_start: 2020,
      year_end: 2021,
      is_current: false,
      description_id: '<p>Old</p>',
      description_en: '<p>Old</p>',
      skills: [
        { id: 12, skill_name: 'TypeScript', sort: 1 },
        { id: 10, skill_name: 'Vue', sort: 2 },
        { id: 11, skill_name: 'Pinia', sort: 3 },
      ],
      created_at: '2026-01-01T00:00:00.000Z',
      updated_at: '2026-01-01T00:00:00.000Z',
    }

    const wrapper = mount(ExperienceFormDialog, {
      props: {
        modelValue: true,
        mode: 'edit',
        experience: existingExperience,
      },
      global: {
        stubs: {
          RichTextEditor: {
            props: ['modelValue'],
            emits: ['update:modelValue'],
            template: '<div />',
          },
          teleport: true,
        },
      },
    })

    const vm = wrapper.vm as unknown as {
      setValues: (values: any) => void
      onSkillsDragEnd: () => void
      skillsDraft: Array<{ id: number | null, skill_name: string }>
      onSubmit: () => Promise<void> | void
    }

    vm.setValues({
      is_published: false,
      role_id: 'New Role',
      role_en: 'New Role',
      company_name: 'New Company',
      company_url: 'https://example.com',
      year_start: '2021',
      year_end: '2022',
      is_current: false,
      description_id: '<p>New</p>',
      description_en: '<p>New</p>',
      skills: ['TypeScript', 'Vue', 'Pinia'],
    })

    vm.skillsDraft = [
      { id: 10, skill_name: 'Vue' },
      { id: 12, skill_name: 'TypeScript' },
      { id: 11, skill_name: 'Pinia' },
    ]
    vm.onSkillsDragEnd()
    await flushPromises()

    await vm.onSubmit()
    await flushPromises()

    expect(updateExperienceApiMock).toHaveBeenCalledWith(7, expect.objectContaining({
      skills: [
        { skill_name: 'Vue' },
        { skill_name: 'TypeScript' },
        { skill_name: 'Pinia' },
      ],
    }))
  })

  it('mengirim skills dari dialog ke payload create', async () => {
    smAndDownMock.value = false

    const wrapper = mount(ExperienceFormDialog, {
      props: {
        modelValue: true,
        mode: 'create',
      },
      global: {
        stubs: {
          RichTextEditor: {
            props: ['modelValue'],
            emits: ['update:modelValue'],
            template: '<div />',
          },
          teleport: true,
        },
      },
    })

    const vm = wrapper.vm as unknown as {
      openSkillDialog: () => void
      saveSkill: () => void
      skillName: string
      setValues: (values: any) => void
      onSubmit: () => Promise<void> | void
    }

    vm.openSkillDialog()
    vm.skillName = 'Vue'
    vm.saveSkill()

    vm.setValues({
      role_id: 'Role ID',
      role_en: 'Role EN',
      company_name: 'Company',
      company_url: '',
      year_start: '',
      year_end: '',
      is_current: true,
      description_id: '<p>ID</p>',
      description_en: '<p>EN</p>',
    })

    await vm.onSubmit()
    await flushPromises()

    expect(createExperienceApiMock).toHaveBeenCalledWith(expect.objectContaining({
      skills: [{ skill_name: 'Vue' }],
    }))
  })
})
