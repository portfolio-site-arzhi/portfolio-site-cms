import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import PortfoliosPage from '../src/pages/portfolios.vue'

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

const basePortfolio = {
  id: 1,
  slug: 'ecommerce-dashboard',
  title: 'Ecommerce Dashboard',
  description: 'Dashboard analytics untuk toko online',
  description_en: 'Analytics dashboard for ecommerce store',
  contribution: '<p>Membangun dashboard analytics</p>',
  contribution_en: '<p>Built analytics dashboard</p>',
  outcome: '<p>Meningkatkan conversion rate</p>',
  outcome_en: '<p>Improved conversion rate</p>',
  image: 'https://example.com/image.png',
  role: 'Frontend Lead',
  live_url: 'https://demo.example.com',
  github_url: 'https://github.com/example/repo',
  display_order: 1,
  is_published: true,
  published_at: '2026-04-24T09:00:00.000Z',
  stacks: [],
  created_at: '2026-04-24T09:00:00.000Z',
  updated_at: '2026-04-24T09:00:00.000Z',
  created_by: 1,
  updated_by: 1,
}

const {
  fetchPortfoliosApiMock,
  fetchPortfolioDetailApiMock,
  updatePortfolioApiMock,
  deletePortfolioApiMock,
  updatePortfoliosSortApiMock,
} = vi.hoisted(() => ({
  fetchPortfoliosApiMock: vi.fn(() => Promise.resolve({
    data: {
      data: [
        { ...basePortfolio, id: 1, display_order: 1, title: 'Ecommerce Dashboard' },
        { ...basePortfolio, id: 2, display_order: 2, title: 'Marketing Website', is_published: false },
      ],
    },
  })),
  fetchPortfolioDetailApiMock: vi.fn(() => Promise.resolve({
    data: {
      data: { ...basePortfolio, id: 1, title: 'Ecommerce Dashboard' },
    },
  })),
  updatePortfolioApiMock: vi.fn(() => Promise.resolve({ data: {} })),
  deletePortfolioApiMock: vi.fn(() => Promise.resolve({
    data: {
      message: 'Portfolio berhasil dihapus',
    },
  })),
  updatePortfoliosSortApiMock: vi.fn(() => Promise.resolve({
    data: {
      message: 'Sort updated',
    },
  })),
}))

vi.mock('@/api/portfolio-service', () => ({
  fetchPortfoliosApi: fetchPortfoliosApiMock,
  fetchPortfolioDetailApi: fetchPortfolioDetailApiMock,
  updatePortfolioApi: updatePortfolioApiMock,
  deletePortfolioApi: deletePortfolioApiMock,
  updatePortfoliosSortApi: updatePortfoliosSortApiMock,
}))

describe('PortfoliosPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('memuat daftar portfolio saat mount', async () => {
    const wrapper = mount(PortfoliosPage, {
      global: {
        stubs: {
          teleport: true,
          ConfirmDialog: true,
          PortfolioFormDialog: true,
          PortfolioDesktopTableCard: true,
          PortfolioMobileListCard: true,
        },
      },
    })

    await flushPromises()

    expect(fetchPortfoliosApiMock).toHaveBeenCalledTimes(1)
    expect(fetchPortfoliosApiMock).toHaveBeenCalledWith({
      search: null,
    })

    const vm = wrapper.vm as unknown as { portfolios: Array<{ id: number }> }
    expect(vm.portfolios).toHaveLength(2)
  })

  it('memuat ulang daftar saat kata kunci pencarian berubah', async () => {
    const wrapper = mount(PortfoliosPage, {
      global: {
        stubs: {
          teleport: true,
          ConfirmDialog: true,
          PortfolioFormDialog: true,
          PortfolioDesktopTableCard: true,
          PortfolioMobileListCard: true,
        },
      },
    })
    await flushPromises()

    const vm = wrapper.vm as unknown as {
      search: string | null
      refreshPage: () => void
    }

    vm.search = 'dashboard'
    vm.refreshPage()

    await flushPromises()

    expect(fetchPortfoliosApiMock).toHaveBeenCalledTimes(2)
    expect(fetchPortfoliosApiMock).toHaveBeenLastCalledWith({
      search: 'dashboard',
    })
  })

  it('mengirim update sort saat tombol simpan ditekan', async () => {
    const wrapper = mount(PortfoliosPage, {
      global: {
        stubs: {
          teleport: true,
          ConfirmDialog: true,
          PortfolioFormDialog: true,
          PortfolioDesktopTableCard: true,
          PortfolioMobileListCard: true,
        },
      },
    })
    await flushPromises()

    const vm = wrapper.vm as unknown as {
      portfolios: Array<{ id: number }>
      onDragStart: () => void
      onDragEnd: () => void
      saveSort: () => void
    }

    vm.portfolios = [{ ...basePortfolio, id: 2 }, { ...basePortfolio, id: 1 }]
    vm.onDragStart()
    vm.onDragEnd()

    await flushPromises()

    expect(updatePortfoliosSortApiMock).not.toHaveBeenCalled()

    vm.saveSort()
    await flushPromises()

    expect(updatePortfoliosSortApiMock).toHaveBeenCalledWith({
      ids: [2, 1],
    })
  })

  it('mengubah status publish saat konfirmasi', async () => {
    const wrapper = mount(PortfoliosPage, {
      global: {
        stubs: {
          teleport: true,
          ConfirmDialog: true,
          PortfolioFormDialog: true,
          PortfolioDesktopTableCard: true,
          PortfolioMobileListCard: true,
        },
      },
    })
    await flushPromises()

    const vm = wrapper.vm as unknown as {
      openStatusDialog: (portfolio: any) => void
      confirmStatusChange: () => void
    }

    vm.openStatusDialog({ ...basePortfolio, id: 1, is_published: true })
    vm.confirmStatusChange()

    await flushPromises()

    expect(updatePortfolioApiMock).toHaveBeenCalledWith(1, {
      status_file: 0,
      is_published: false,
    })
  })

  it('menghapus portfolio saat konfirmasi', async () => {
    const wrapper = mount(PortfoliosPage, {
      global: {
        stubs: {
          teleport: true,
          ConfirmDialog: true,
          PortfolioFormDialog: true,
          PortfolioDesktopTableCard: true,
          PortfolioMobileListCard: true,
        },
      },
    })
    await flushPromises()

    const vm = wrapper.vm as unknown as {
      selectedPortfolio: any
      confirmDelete: () => void
    }

    vm.selectedPortfolio = { ...basePortfolio, id: 1 }
    vm.confirmDelete()

    await flushPromises()

    expect(deletePortfolioApiMock).toHaveBeenCalledWith(1)
  })
})
