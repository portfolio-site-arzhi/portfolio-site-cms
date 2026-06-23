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

const { showSuccessMock, showErrorMock } = vi.hoisted(() => ({
  showSuccessMock: vi.fn(),
  showErrorMock: vi.fn(),
}))

vi.mock('@/stores/app', () => ({
  useAppStore: () => ({
    showSuccess: showSuccessMock,
    showError: showErrorMock,
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
  start_date: '2023-07-01',
  end_date: null,
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
  downloadExperiencesImportSampleApiMock,
  importExperiencesApiMock,
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
  downloadExperiencesImportSampleApiMock: vi.fn(() => Promise.resolve({
    data: new Blob(['experience import sample']),
    headers: {
      'content-disposition': 'attachment; filename="experiences-import-sample.json"',
    },
  })),
  importExperiencesApiMock: vi.fn(() => Promise.resolve({
    data: {
      message: 'Import experience berhasil',
    },
  })),
}))

vi.mock('@/api/experience-service', () => ({
  fetchExperiencesApi: fetchExperiencesApiMock,
  fetchExperienceDetailApi: fetchExperienceDetailApiMock,
  updateExperienceApi: updateExperienceApiMock,
  deleteExperienceApi: deleteExperienceApiMock,
  updateExperiencesSortApi: updateExperiencesSortApiMock,
  downloadExperiencesImportSampleApi: downloadExperiencesImportSampleApiMock,
  importExperiencesApi: importExperiencesApiMock,
}))

const {
  extractAttachmentFileNameMock,
  triggerBrowserDownloadMock,
} = vi.hoisted(() => ({
  extractAttachmentFileNameMock: vi.fn(() => 'experiences-import-sample.json'),
  triggerBrowserDownloadMock: vi.fn(),
}))

vi.mock('@/utils/browser-download', () => ({
  extractAttachmentFileName: extractAttachmentFileNameMock,
  triggerBrowserDownload: triggerBrowserDownloadMock,
}))

describe('ExperiencesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  function createWrapper () {
    return mount(ExperiencesPage, {
      global: {
        config: {
          compilerOptions: {
            isCustomElement: tag => tag.startsWith('v-'),
          },
        },
        stubs: {
          teleport: true,
          ConfirmDialog: true,
          ExperienceFormDialog: true,
          ExperienceImportDialog: true,
          ExperienceDesktopTableCard: true,
          ExperienceMobileListCard: true,
        },
      },
    })
  }

  it('memuat daftar experience saat mount', async () => {
    const wrapper = createWrapper()

    await flushPromises()

    expect(fetchExperiencesApiMock).toHaveBeenCalledTimes(1)
    expect(fetchExperiencesApiMock).toHaveBeenCalledWith({
      search: null,
    })

    const vm = wrapper.vm as unknown as { experiences: Array<{ id: number }> }
    expect(vm.experiences).toHaveLength(2)
  })

  it('menampilkan search full-width dan catatan import JSON', async () => {
    const wrapper = createWrapper()

    await flushPromises()

    const html = wrapper.html()

    expect(html).toContain('name="experiences_search"')
    expect(html).toContain('class="d-flex flex-wrap ga-3"')
    expect(html).toContain('root object')
    expect(html).toContain('<strong>experiences</strong>')
    expect(html).toContain('YYYY-MM-01')
    expect(html).toContain('<strong>end_date</strong>')
  })

  it('memuat ulang daftar saat kata kunci pencarian berubah', async () => {
    const wrapper = createWrapper()
    await flushPromises()

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
    const wrapper = createWrapper()
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
    const wrapper = createWrapper()
    await flushPromises()

    const vm = wrapper.vm as unknown as {
      onExperienceCreated: (exp: unknown) => void
    }

    vm.onExperienceCreated({ ...baseExperience, id: 99 })

    expect(showSuccessMock).toHaveBeenCalledWith('Experience berhasil dibuat.')
  })

  it('mengirim update sort saat tombol simpan ditekan', async () => {
    const wrapper = createWrapper()
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
    const wrapper = createWrapper()
    await flushPromises()

    const vm = wrapper.vm as unknown as {
      openStatusDialog: (exp: unknown) => void
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
    const wrapper = createWrapper()
    await flushPromises()

    const vm = wrapper.vm as unknown as {
      selectedExperience: unknown
      confirmDelete: () => void
    }

    vm.selectedExperience = { ...baseExperience, id: 1 }
    vm.confirmDelete()

    await flushPromises()

    expect(deleteExperienceApiMock).toHaveBeenCalledWith(1)
  })

  it('mengunduh sample file import experience', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    const vm = wrapper.vm as unknown as {
      downloadImportSample: () => void
    }

    vm.downloadImportSample()

    await flushPromises()

    expect(downloadExperiencesImportSampleApiMock).toHaveBeenCalledTimes(1)
    expect(extractAttachmentFileNameMock).toHaveBeenCalledTimes(1)
    expect(triggerBrowserDownloadMock).toHaveBeenCalledTimes(1)
    expect(showSuccessMock).toHaveBeenCalledWith('File sample import experience berhasil diunduh.')
  })

  it('membuka dialog import lalu mengirim file JSON setelah dikonfirmasi', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    const vm = wrapper.vm as unknown as {
      importDialog: boolean
      openImportDialog: () => void
      selectImportFile: (file: File | null) => void
      confirmImportExperiences: () => void
    }
    const file = new File(['{"experiences": []}'], 'experiences-import.json', {
      type: 'application/json',
    })

    vm.openImportDialog()
    vm.selectImportFile(file)

    expect(vm.importDialog).toBe(true)
    expect(importExperiencesApiMock).not.toHaveBeenCalled()

    vm.confirmImportExperiences()

    await flushPromises()

    expect(importExperiencesApiMock).toHaveBeenCalledWith(file)
    expect(fetchExperiencesApiMock).toHaveBeenCalledTimes(2)
    expect(showSuccessMock).toHaveBeenCalledWith('Import experience berhasil')
  })

  it('menahan import jika file bukan json', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    const vm = wrapper.vm as unknown as {
      importErrorMessage: string | null
      openImportDialog: () => void
      selectImportFile: (file: File | null) => void
      confirmImportExperiences: () => void
    }
    const invalidFile = new File(['plain-text'], 'experiences-import.txt', {
      type: 'text/plain',
    })

    vm.openImportDialog()
    vm.selectImportFile(invalidFile)
    vm.confirmImportExperiences()

    await flushPromises()

    expect(vm.importErrorMessage).toBe('File yang diunggah harus berformat .json.')
    expect(importExperiencesApiMock).not.toHaveBeenCalled()
    expect(showErrorMock).not.toHaveBeenCalled()
  })
})
