import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import EducationsPage from '../src/pages/educations.vue'

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

const baseEducation = {
  id: 1,
  institution_name: 'Institut A',
  degree: 'S1',
  degree_en: 'Bachelor',
  field_of_study: 'Informatika',
  field_of_study_en: 'Computer Science',
  start_date: '2018-08-01',
  end_date: '2022-07-01',
  description: '<p>Desc</p>',
  description_en: '<p>Desc</p>',
  location: 'Bandung',
  sort_order: 10,
  is_active: true,
  created_at: '2026-01-05T10:15:00.000Z',
  updated_at: '2026-01-05T10:15:00.000Z',
  created_by: 1,
  updated_by: 1,
}

const {
  fetchEducationsApiMock,
  fetchEducationDetailApiMock,
  updateEducationApiMock,
  deleteEducationApiMock,
  updateEducationsSortApiMock,
} = vi.hoisted(() => ({
  fetchEducationsApiMock: vi.fn(() => Promise.resolve({
    data: {
      data: [
        { ...baseEducation, id: 1, sort_order: 10, institution_name: 'Institut A' },
        { ...baseEducation, id: 2, sort_order: 20, institution_name: 'Institut B', is_active: false },
      ],
    },
  })),
  fetchEducationDetailApiMock: vi.fn(() => Promise.resolve({
    data: {
      data: { ...baseEducation, id: 1, institution_name: 'Institut A' },
    },
  })),
  updateEducationApiMock: vi.fn(() => Promise.resolve({ data: {} })),
  deleteEducationApiMock: vi.fn(() => Promise.resolve({
    data: {
      message: 'Education berhasil dihapus',
    },
  })),
  updateEducationsSortApiMock: vi.fn(() => Promise.resolve({
    data: {
      message: 'Sort updated',
    },
  })),
}))

vi.mock('@/api/education-service', () => ({
  fetchEducationsApi: fetchEducationsApiMock,
  fetchEducationDetailApi: fetchEducationDetailApiMock,
  updateEducationApi: updateEducationApiMock,
  deleteEducationApi: deleteEducationApiMock,
  updateEducationsSortApi: updateEducationsSortApiMock,
}))

describe('EducationsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('memuat daftar education saat mount', async () => {
    const wrapper = mount(EducationsPage, {
      global: {
        stubs: {
          teleport: true,
          EducationDesktopTableCard: true,
          EducationMobileListCard: true,
        },
      },
    })

    await flushPromises()

    expect(fetchEducationsApiMock).toHaveBeenCalledTimes(1)
    expect(fetchEducationsApiMock).toHaveBeenCalledWith({
      search: null,
    })

    const vm = wrapper.vm as unknown as { educations: Array<{ id: number }> }
    expect(vm.educations).toHaveLength(2)
  })

  it('memuat ulang daftar saat kata kunci pencarian berubah', async () => {
    const wrapper = mount(EducationsPage, {
      global: {
        stubs: {
          teleport: true,
          EducationDesktopTableCard: true,
          EducationMobileListCard: true,
        },
      },
    })
    await flushPromises()

    expect(fetchEducationsApiMock).toHaveBeenCalledTimes(1)

    const vm = wrapper.vm as unknown as {
      search: string | null
      refreshPage: () => void
    }

    vm.search = 'institut'
    vm.refreshPage()

    await flushPromises()

    expect(fetchEducationsApiMock).toHaveBeenCalledTimes(2)
    expect(fetchEducationsApiMock).toHaveBeenLastCalledWith({
      search: 'institut',
    })
  })

  it('mengirim update sort saat tombol simpan ditekan', async () => {
    const wrapper = mount(EducationsPage, {
      global: {
        stubs: {
          teleport: true,
          EducationDesktopTableCard: true,
          EducationMobileListCard: true,
        },
      },
    })
    await flushPromises()

    const vm = wrapper.vm as unknown as {
      educations: Array<{ id: number }>
      onDragStart: () => void
      onDragEnd: () => void
      saveSort: () => void
    }

    vm.educations = [{ ...baseEducation, id: 2 }, { ...baseEducation, id: 1 }]
    vm.onDragStart()
    vm.onDragEnd()

    await flushPromises()

    expect(updateEducationsSortApiMock).not.toHaveBeenCalled()

    vm.saveSort()
    await flushPromises()

    expect(updateEducationsSortApiMock).toHaveBeenCalledWith({
      ids: [2, 1],
    })
  })

  it('mengubah status aktif saat konfirmasi', async () => {
    const wrapper = mount(EducationsPage, {
      global: {
        stubs: {
          teleport: true,
          EducationDesktopTableCard: true,
          EducationMobileListCard: true,
        },
      },
    })
    await flushPromises()

    const vm = wrapper.vm as unknown as {
      openStatusDialog: (edu: any) => void
      confirmStatusChange: () => void
    }

    vm.openStatusDialog({ ...baseEducation, id: 1, is_active: true })
    vm.confirmStatusChange()

    await flushPromises()

    expect(updateEducationApiMock).toHaveBeenCalledWith(1, {
      is_active: false,
    })
  })

  it('menghapus education saat konfirmasi', async () => {
    const wrapper = mount(EducationsPage, {
      global: {
        stubs: {
          teleport: true,
          EducationDesktopTableCard: true,
          EducationMobileListCard: true,
        },
      },
    })
    await flushPromises()

    const vm = wrapper.vm as unknown as {
      selectedEducation: any
      confirmDelete: () => void
    }

    vm.selectedEducation = { ...baseEducation, id: 1 }
    vm.confirmDelete()

    await flushPromises()

    expect(deleteEducationApiMock).toHaveBeenCalledWith(1)
  })
})
