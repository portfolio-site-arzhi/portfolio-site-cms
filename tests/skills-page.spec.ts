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
  exportSkillsApiMock,
  importSkillsApiMock,
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
  exportSkillsApiMock: vi.fn(() => Promise.resolve({
    data: new Blob(['skills export']),
    headers: {
      'content-disposition': 'attachment; filename="skills-export.xlsx"',
    },
  })),
  importSkillsApiMock: vi.fn(() => Promise.resolve({
    data: {
      message: 'Import skill berhasil',
    },
  })),
}))

vi.mock('@/api/skill-service', () => ({
  fetchSkillsApi: fetchSkillsApiMock,
  fetchSkillDetailApi: fetchSkillDetailApiMock,
  updateSkillApi: updateSkillApiMock,
  deleteSkillApi: deleteSkillApiMock,
  updateSkillsSortApi: updateSkillsSortApiMock,
  exportSkillsApi: exportSkillsApiMock,
  importSkillsApi: importSkillsApiMock,
}))

const {
  extractAttachmentFileNameMock,
  triggerBrowserDownloadMock,
} = vi.hoisted(() => ({
  extractAttachmentFileNameMock: vi.fn(() => 'skills-export.xlsx'),
  triggerBrowserDownloadMock: vi.fn(),
}))

vi.mock('@/utils/browser-download', () => ({
  extractAttachmentFileName: extractAttachmentFileNameMock,
  triggerBrowserDownload: triggerBrowserDownloadMock,
}))

describe('SkillsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  function createWrapper () {
    return mount(SkillsPage, {
      global: {
        config: {
          compilerOptions: {
            isCustomElement: tag => tag.startsWith('v-'),
          },
        },
        stubs: {
          teleport: true,
          ConfirmDialog: true,
          SkillFormDialog: true,
          SkillDesktopTableCard: true,
          SkillMobileListCard: true,
        },
      },
    })
  }

  it('memuat daftar skill saat mount', async () => {
    const wrapper = createWrapper()

    await flushPromises()

    expect(fetchSkillsApiMock).toHaveBeenCalledTimes(1)
    expect(fetchSkillsApiMock).toHaveBeenCalledWith({
      search: null,
    })

    const vm = wrapper.vm as unknown as { skillGroups: Array<{ id: number }> }
    expect(vm.skillGroups).toHaveLength(2)
  })

  it('menampilkan search full-width di atas tombol aksi dengan name stabil', async () => {
    const wrapper = createWrapper()

    await flushPromises()

    const html = wrapper.html()

    expect(html).toContain('name="skills_search"')
    expect(html).toContain('class="d-flex flex-wrap ga-3"')
    expect(html).not.toContain('flex-sm-row')
    expect(html).toContain('skill_groups.code')
    expect(html).toContain('skills.group_code')
    expect(html).toContain('membaca <strong>code</strong> dan <strong>group_code</strong> dalam lowercase')
  })

  it('memuat ulang daftar saat kata kunci pencarian berubah', async () => {
    const wrapper = createWrapper()
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
    const wrapper = createWrapper()
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
    const wrapper = createWrapper()
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
    const wrapper = createWrapper()
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

  it('mengunduh file export skills', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    const vm = wrapper.vm as unknown as {
      exportSkillsTemplate: () => void
    }

    vm.exportSkillsTemplate()

    await flushPromises()

    expect(exportSkillsApiMock).toHaveBeenCalledTimes(1)
    expect(extractAttachmentFileNameMock).toHaveBeenCalledTimes(1)
    expect(triggerBrowserDownloadMock).toHaveBeenCalledTimes(1)
    expect(showSuccessMock).toHaveBeenCalledWith('File Excel skills berhasil diunduh.')
  })

  it('membuka dialog import lalu mengirim file hanya setelah dikonfirmasi', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    const vm = wrapper.vm as unknown as {
      importDialog: boolean
      importErrorMessage: string | null
      openImportDialog: () => void
      selectImportFile: (file: File | null) => void
      confirmImportSkills: () => void
    }
    const file = new File(['xlsx-content'], 'skills-import.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })

    vm.openImportDialog()
    vm.selectImportFile(file)

    expect(vm.importDialog).toBe(true)
    expect(importSkillsApiMock).not.toHaveBeenCalled()

    vm.confirmImportSkills()

    await flushPromises()

    expect(importSkillsApiMock).toHaveBeenCalledWith(file)
    expect(fetchSkillsApiMock).toHaveBeenCalledTimes(2)
    expect(showSuccessMock).toHaveBeenCalledWith('Import skill berhasil')
  })

  it('menahan import jika file bukan xlsx', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    const vm = wrapper.vm as unknown as {
      importErrorMessage: string | null
      openImportDialog: () => void
      selectImportFile: (file: File | null) => void
      confirmImportSkills: () => void
    }
    const invalidFile = new File(['csv-content'], 'skills-import.csv', {
      type: 'text/csv',
    })

    vm.openImportDialog()
    vm.selectImportFile(invalidFile)
    vm.confirmImportSkills()

    await flushPromises()

    expect(vm.importErrorMessage).toBe('File yang diunggah harus berformat .xlsx.')
    expect(importSkillsApiMock).not.toHaveBeenCalled()
    expect(showErrorMock).not.toHaveBeenCalled()
  })
})
