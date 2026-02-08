import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import ExperiencesPage from '../src/pages/experiences.vue'

vi.mock('vuetify', () => ({
  useDisplay: () => ({
    smAndDown: {
      value: false,
    },
  }),
}))

const { showSuccessMock } = vi.hoisted(() => ({
  showSuccessMock: vi.fn(),
}))

vi.mock('@/stores/app', () => ({
  useAppStore: () => ({
    showSuccess: showSuccessMock,
  }),
}))

vi.mock('vuedraggable', () => ({
  default: defineComponent({
    name: 'draggable',
    props: {
      modelValue: {
        type: Array,
        default: () => [],
      },
      tag: {
        type: String,
        default: 'div',
      },
    },
    emits: ['update:modelValue', 'start', 'end'],
    setup (props, { slots }) {
      return () => h(
        props.tag as any,
        {},
        (props.modelValue as any[]).map(element => (slots.item ? slots.item({ element }) : null)),
      )
    },
  }),
}))

const baseExperience = {
  id: 1,
  sort: 10,
  is_published: true,
  role_id: 'Senior Frontend Developer',
  role_en: 'Senior Frontend Developer',
  company_name: 'Tech Solutions Inc.',
  company_url: 'https://example.com',
  year_start: 2023,
  year_end: null,
  is_current: true,
  description_id: '<p>Memimpin migrasi...</p>',
  description_en: '<p>Led the migration...</p>',
  skills: [],
  created_at: '2026-01-05T10:15:00.000Z',
  updated_at: '2026-01-05T10:15:00.000Z',
}

const {
  fetchExperiencesApiMock,
  fetchExperienceDetailApiMock,
  updateExperienceApiMock,
  deleteExperienceApiMock,
  updateExperiencesSortApiMock,
} = vi.hoisted(() => ({
  fetchExperiencesApiMock: vi.fn(() => Promise.resolve({
    data: {
      data: [
        { ...baseExperience, id: 1, sort: 10, company_name: 'A Company' },
        { ...baseExperience, id: 2, sort: 20, company_name: 'B Company', is_published: false },
      ],
    },
  })),
  fetchExperienceDetailApiMock: vi.fn(() => Promise.resolve({
    data: {
      data: { ...baseExperience, id: 1, company_name: 'A Company' },
    },
  })),
  updateExperienceApiMock: vi.fn(() => Promise.resolve({ data: {} })),
  deleteExperienceApiMock: vi.fn(() => Promise.resolve({
    data: {
      message: 'Experience berhasil dihapus',
    },
  })),
  updateExperiencesSortApiMock: vi.fn(() => Promise.resolve({
    data: {
      message: 'Sort updated',
    },
  })),
}))

vi.mock('@/api/experience-service', () => ({
  fetchExperiencesApi: fetchExperiencesApiMock,
  fetchExperienceDetailApi: fetchExperienceDetailApiMock,
  updateExperienceApi: updateExperienceApiMock,
  deleteExperienceApi: deleteExperienceApiMock,
  updateExperiencesSortApi: updateExperiencesSortApiMock,
}))

describe('ExperiencesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('memuat daftar experience saat mount', async () => {
    const wrapper = mount(ExperiencesPage, {
      global: {
        stubs: {
          teleport: true,
          ExperienceDesktopTableCard: true,
          ExperienceMobileListCard: true,
        },
      },
    })

    await flushPromises()

    expect(fetchExperiencesApiMock).toHaveBeenCalledTimes(1)
    expect(fetchExperiencesApiMock).toHaveBeenCalledWith({
      search: null,
    })

    const vm = wrapper.vm as unknown as { experiences: Array<{ id: number }> }
    expect(vm.experiences).toHaveLength(2)
  })

  it('memuat ulang daftar saat kata kunci pencarian berubah', async () => {
    const wrapper = mount(ExperiencesPage, {
      global: {
        stubs: {
          teleport: true,
          ExperienceDesktopTableCard: true,
          ExperienceMobileListCard: true,
        },
      },
    })
    await flushPromises()

    expect(fetchExperiencesApiMock).toHaveBeenCalledTimes(1)

    const vm = wrapper.vm as unknown as {
      search: string | null
      refreshPage: () => void
    }

    vm.search = 'developer'
    vm.refreshPage()

    await flushPromises()

    expect(fetchExperiencesApiMock).toHaveBeenCalledTimes(2)
    expect(fetchExperiencesApiMock).toHaveBeenLastCalledWith({
      search: 'developer',
    })
  })

  it('mengosongkan input saat clear search dan memuat ulang data', async () => {
    const wrapper = mount(ExperiencesPage, {
      global: {
        stubs: {
          teleport: true,
          ExperienceDesktopTableCard: true,
          ExperienceMobileListCard: true,
        },
      },
    })
    await flushPromises()

    const vm = wrapper.vm as unknown as {
      search: string | null
      clearSearch: () => void
      isSearchActive: boolean
    }

    vm.search = 'developer'
    await flushPromises()
    expect(vm.isSearchActive).toBe(true)

    vm.clearSearch()
    await flushPromises()

    expect(vm.search).toBe('')
    expect(vm.isSearchActive).toBe(false)
    expect(fetchExperiencesApiMock).toHaveBeenCalledTimes(2)
    expect(fetchExperiencesApiMock).toHaveBeenLastCalledWith({
      search: null,
    })
  })

  it('menampilkan snackbar sukses saat experience dibuat', async () => {
    const wrapper = mount(ExperiencesPage, {
      global: {
        stubs: {
          teleport: true,
          ExperienceDesktopTableCard: true,
          ExperienceMobileListCard: true,
        },
      },
    })
    await flushPromises()

    const vm = wrapper.vm as unknown as {
      onExperienceCreated: (exp: any) => void
    }

    vm.onExperienceCreated({ ...baseExperience, id: 99 })

    expect(showSuccessMock).toHaveBeenCalledWith('Experience berhasil dibuat.')
  })

  it('mengirim update sort saat tombol simpan ditekan', async () => {
    const wrapper = mount(ExperiencesPage, {
      global: {
        stubs: {
          teleport: true,
          ExperienceDesktopTableCard: true,
          ExperienceMobileListCard: true,
        },
      },
    })
    await flushPromises()

    const vm = wrapper.vm as unknown as {
      experiences: Array<{ id: number }>
      onDragStart: () => void
      onDragEnd: () => void
      saveSort: () => void
    }

    vm.experiences = [{ ...baseExperience, id: 2 }, { ...baseExperience, id: 1 }]
    vm.onDragStart()
    vm.onDragEnd()

    await flushPromises()

    expect(updateExperiencesSortApiMock).not.toHaveBeenCalled()

    vm.saveSort()
    await flushPromises()

    expect(updateExperiencesSortApiMock).toHaveBeenCalledWith({
      ids: [2, 1],
    })
  })

  it('mengubah status publish saat konfirmasi', async () => {
    const wrapper = mount(ExperiencesPage, {
      global: {
        stubs: {
          teleport: true,
          ExperienceDesktopTableCard: true,
          ExperienceMobileListCard: true,
        },
      },
    })
    await flushPromises()

    const vm = wrapper.vm as unknown as {
      openStatusDialog: (exp: any) => void
      confirmStatusChange: () => void
    }

    vm.openStatusDialog({ ...baseExperience, id: 1, is_published: true })
    vm.confirmStatusChange()

    await flushPromises()

    expect(updateExperienceApiMock).toHaveBeenCalledWith(1, {
      is_published: false,
    })
  })

  it('menghapus experience saat konfirmasi', async () => {
    const wrapper = mount(ExperiencesPage, {
      global: {
        stubs: {
          teleport: true,
          ExperienceDesktopTableCard: true,
          ExperienceMobileListCard: true,
        },
      },
    })
    await flushPromises()

    const vm = wrapper.vm as unknown as {
      selectedExperience: any
      confirmDelete: () => void
    }

    vm.selectedExperience = { ...baseExperience, id: 1 }
    vm.confirmDelete()

    await flushPromises()

    expect(deleteExperienceApiMock).toHaveBeenCalledWith(1)
  })
})
