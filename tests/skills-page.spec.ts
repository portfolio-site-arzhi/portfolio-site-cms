import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import SkillsPage from '../src/pages/skills.vue'

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

const baseSkillGroup = {
  id: 1,
  name: 'Frontend',
  display_order: 1,
  is_active: true,
  skills: [
    {
      id: 10,
      skill_group_id: 1,
      name: 'Vue.js',
      display_order: 1,
      created_at: '2026-01-05T10:15:00.000Z',
      updated_at: '2026-01-05T10:15:00.000Z',
      created_by: 1,
      updated_by: 1,
    },
  ],
  created_at: '2026-01-05T10:15:00.000Z',
  updated_at: '2026-01-05T10:15:00.000Z',
  created_by: 1,
  updated_by: 1,
}

const {
  fetchSkillsApiMock,
  fetchSkillDetailApiMock,
  updateSkillApiMock,
  deleteSkillApiMock,
  updateSkillsSortApiMock,
} = vi.hoisted(() => ({
  fetchSkillsApiMock: vi.fn(() => Promise.resolve({
    data: {
      data: [
        { ...baseSkillGroup, id: 1, display_order: 1, name: 'Frontend' },
        { ...baseSkillGroup, id: 2, display_order: 2, name: 'Backend', is_active: false },
      ],
    },
  })),
  fetchSkillDetailApiMock: vi.fn(() => Promise.resolve({
    data: {
      data: { ...baseSkillGroup, id: 1, name: 'Frontend' },
    },
  })),
  updateSkillApiMock: vi.fn(() => Promise.resolve({ data: {} })),
  deleteSkillApiMock: vi.fn(() => Promise.resolve({
    data: {
      message: 'Skill berhasil dihapus',
    },
  })),
  updateSkillsSortApiMock: vi.fn(() => Promise.resolve({
    data: {
      message: 'Sort updated',
    },
  })),
}))

vi.mock('@/api/skill-service', () => ({
  fetchSkillsApi: fetchSkillsApiMock,
  fetchSkillDetailApi: fetchSkillDetailApiMock,
  updateSkillApi: updateSkillApiMock,
  deleteSkillApi: deleteSkillApiMock,
  updateSkillsSortApi: updateSkillsSortApiMock,
}))

describe('SkillsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('memuat daftar skill saat mount', async () => {
    const wrapper = mount(SkillsPage, {
      global: {
        stubs: {
          teleport: true,
          SkillDesktopTableCard: true,
          SkillMobileListCard: true,
        },
      },
    })

    await flushPromises()

    expect(fetchSkillsApiMock).toHaveBeenCalledTimes(1)
    expect(fetchSkillsApiMock).toHaveBeenCalledWith({
      search: null,
    })

    const vm = wrapper.vm as unknown as { skillGroups: Array<{ id: number }> }
    expect(vm.skillGroups).toHaveLength(2)
  })

  it('memuat ulang daftar saat kata kunci pencarian berubah', async () => {
    const wrapper = mount(SkillsPage, {
      global: {
        stubs: {
          teleport: true,
          SkillDesktopTableCard: true,
          SkillMobileListCard: true,
        },
      },
    })
    await flushPromises()

    expect(fetchSkillsApiMock).toHaveBeenCalledTimes(1)

    const vm = wrapper.vm as unknown as {
      search: string | null
      refreshPage: () => void
    }

    vm.search = 'front'
    vm.refreshPage()

    await flushPromises()

    expect(fetchSkillsApiMock).toHaveBeenCalledTimes(2)
    expect(fetchSkillsApiMock).toHaveBeenLastCalledWith({
      search: 'front',
    })
  })

  it('mengirim update sort saat tombol simpan ditekan', async () => {
    const wrapper = mount(SkillsPage, {
      global: {
        stubs: {
          teleport: true,
          SkillDesktopTableCard: true,
          SkillMobileListCard: true,
        },
      },
    })
    await flushPromises()

    const vm = wrapper.vm as unknown as {
      skillGroups: Array<{ id: number }>
      onDragStart: () => void
      onDragEnd: () => void
      saveSort: () => void
    }

    vm.skillGroups = [{ ...baseSkillGroup, id: 2 }, { ...baseSkillGroup, id: 1 }]
    vm.onDragStart()
    vm.onDragEnd()

    await flushPromises()

    expect(updateSkillsSortApiMock).not.toHaveBeenCalled()

    vm.saveSort()
    await flushPromises()

    expect(updateSkillsSortApiMock).toHaveBeenCalledWith({
      ids: [2, 1],
    })
  })

  it('mengubah status aktif saat konfirmasi', async () => {
    const wrapper = mount(SkillsPage, {
      global: {
        stubs: {
          teleport: true,
          SkillDesktopTableCard: true,
          SkillMobileListCard: true,
        },
      },
    })
    await flushPromises()

    const vm = wrapper.vm as unknown as {
      openStatusDialog: (skillGroup: any) => void
      confirmStatusChange: () => void
    }

    vm.openStatusDialog({ ...baseSkillGroup, id: 1, is_active: true })
    vm.confirmStatusChange()

    await flushPromises()

    expect(updateSkillApiMock).toHaveBeenCalledWith(1, {
      is_active: false,
    })
  })

  it('menghapus skill group saat konfirmasi', async () => {
    const wrapper = mount(SkillsPage, {
      global: {
        stubs: {
          teleport: true,
          SkillDesktopTableCard: true,
          SkillMobileListCard: true,
        },
      },
    })
    await flushPromises()

    const vm = wrapper.vm as unknown as {
      selectedSkillGroup: any
      confirmDelete: () => void
    }

    vm.selectedSkillGroup = { ...baseSkillGroup, id: 1 }
    vm.confirmDelete()

    await flushPromises()

    expect(deleteSkillApiMock).toHaveBeenCalledWith(1)
  })
})
