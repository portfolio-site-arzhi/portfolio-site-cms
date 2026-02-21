import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import CertificationsPage from '../src/pages/certifications.vue'

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

const baseCertification = {
  id: 1,
  name: 'Sertifikasi A',
  name_en: 'Certification A',
  issuing_organization: 'Org A',
  issue_date: '2022-08-01',
  description: '<p>Desc</p>',
  description_en: '<p>Desc</p>',
  sort_order: 10,
  is_active: true,
  created_at: '2026-01-05T10:15:00.000Z',
  updated_at: '2026-01-05T10:15:00.000Z',
  created_by: 1,
  updated_by: 1,
}

const {
  fetchCertificationsApiMock,
  fetchCertificationDetailApiMock,
  updateCertificationApiMock,
  deleteCertificationApiMock,
  updateCertificationsSortApiMock,
} = vi.hoisted(() => ({
  fetchCertificationsApiMock: vi.fn(() => Promise.resolve({
    data: {
      data: [
        { ...baseCertification, id: 1, sort_order: 10, name: 'Sertifikasi A' },
        { ...baseCertification, id: 2, sort_order: 20, name: 'Sertifikasi B', is_active: false },
      ],
    },
  })),
  fetchCertificationDetailApiMock: vi.fn(() => Promise.resolve({
    data: {
      data: { ...baseCertification, id: 1, name: 'Sertifikasi A' },
    },
  })),
  updateCertificationApiMock: vi.fn(() => Promise.resolve({ data: {} })),
  deleteCertificationApiMock: vi.fn(() => Promise.resolve({
    data: {
      message: 'Certification berhasil dihapus',
    },
  })),
  updateCertificationsSortApiMock: vi.fn(() => Promise.resolve({
    data: {
      message: 'Sort updated',
    },
  })),
}))

vi.mock('@/api/certification-service', () => ({
  fetchCertificationsApi: fetchCertificationsApiMock,
  fetchCertificationDetailApi: fetchCertificationDetailApiMock,
  updateCertificationApi: updateCertificationApiMock,
  deleteCertificationApi: deleteCertificationApiMock,
  updateCertificationsSortApi: updateCertificationsSortApiMock,
}))

describe('CertificationsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('memuat daftar certification saat mount', async () => {
    const wrapper = mount(CertificationsPage, {
      global: {
        stubs: {
          teleport: true,
          CertificationDesktopTableCard: true,
          CertificationMobileListCard: true,
        },
      },
    })

    await flushPromises()

    expect(fetchCertificationsApiMock).toHaveBeenCalledTimes(1)
    expect(fetchCertificationsApiMock).toHaveBeenCalledWith({
      search: null,
    })

    const vm = wrapper.vm as unknown as { certifications: Array<{ id: number }> }
    expect(vm.certifications).toHaveLength(2)
  })

  it('memuat ulang daftar saat kata kunci pencarian berubah', async () => {
    const wrapper = mount(CertificationsPage, {
      global: {
        stubs: {
          teleport: true,
          CertificationDesktopTableCard: true,
          CertificationMobileListCard: true,
        },
      },
    })
    await flushPromises()

    expect(fetchCertificationsApiMock).toHaveBeenCalledTimes(1)

    const vm = wrapper.vm as unknown as {
      search: string | null
      refreshPage: () => void
    }

    vm.search = 'sertifikasi'
    vm.refreshPage()

    await flushPromises()

    expect(fetchCertificationsApiMock).toHaveBeenCalledTimes(2)
    expect(fetchCertificationsApiMock).toHaveBeenLastCalledWith({
      search: 'sertifikasi',
    })
  })

  it('mengirim update sort saat tombol simpan ditekan', async () => {
    const wrapper = mount(CertificationsPage, {
      global: {
        stubs: {
          teleport: true,
          CertificationDesktopTableCard: true,
          CertificationMobileListCard: true,
        },
      },
    })
    await flushPromises()

    const vm = wrapper.vm as unknown as {
      certifications: Array<{ id: number }>
      onDragStart: () => void
      onDragEnd: () => void
      saveSort: () => void
    }

    vm.certifications = [{ ...baseCertification, id: 2 }, { ...baseCertification, id: 1 }]
    vm.onDragStart()
    vm.onDragEnd()

    await flushPromises()

    expect(updateCertificationsSortApiMock).not.toHaveBeenCalled()

    vm.saveSort()
    await flushPromises()

    expect(updateCertificationsSortApiMock).toHaveBeenCalledWith({
      ids: [2, 1],
    })
  })

  it('mengubah status aktif saat konfirmasi', async () => {
    const wrapper = mount(CertificationsPage, {
      global: {
        stubs: {
          teleport: true,
          CertificationDesktopTableCard: true,
          CertificationMobileListCard: true,
        },
      },
    })
    await flushPromises()

    const vm = wrapper.vm as unknown as {
      openStatusDialog: (cert: any) => void
      confirmStatusChange: () => void
    }

    vm.openStatusDialog({ ...baseCertification, id: 1, is_active: true })
    vm.confirmStatusChange()

    await flushPromises()

    expect(updateCertificationApiMock).toHaveBeenCalledWith(1, {
      is_active: false,
    })
  })

  it('menghapus certification saat konfirmasi', async () => {
    const wrapper = mount(CertificationsPage, {
      global: {
        stubs: {
          teleport: true,
          CertificationDesktopTableCard: true,
          CertificationMobileListCard: true,
        },
      },
    })
    await flushPromises()

    const vm = wrapper.vm as unknown as {
      selectedCertification: any
      confirmDelete: () => void
    }

    vm.selectedCertification = { ...baseCertification, id: 1 }
    vm.confirmDelete()

    await flushPromises()

    expect(deleteCertificationApiMock).toHaveBeenCalledWith(1)
  })
})
