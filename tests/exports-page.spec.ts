import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import ExportsPage from '../src/pages/exports.vue'

const { showSuccessMock, showErrorMock } = vi.hoisted(() => ({
  showSuccessMock: vi.fn(),
  showErrorMock: vi.fn(),
}))

const {
  exportCvPdfApiMock,
  exportPortfoliosPdfApiMock,
} = vi.hoisted(() => ({
  exportCvPdfApiMock: vi.fn(() => Promise.resolve({
    data: new Blob(['cv'], { type: 'application/pdf' }),
    headers: {
      'content-disposition': 'attachment; filename="cv-ats-en.pdf"',
    },
  })),
  exportPortfoliosPdfApiMock: vi.fn(() => Promise.resolve({
    data: new Blob(['portfolio'], { type: 'application/pdf' }),
    headers: {
      'content-disposition': 'attachment; filename="portfolio-detail-en.pdf"',
    },
  })),
}))

vi.mock('@/stores/app', () => ({
  useAppStore: () => ({
    showSuccess: showSuccessMock,
    showError: showErrorMock,
  }),
}))

vi.mock('@/api/export-service', () => ({
  exportCvPdfApi: exportCvPdfApiMock,
  exportPortfoliosPdfApi: exportPortfoliosPdfApiMock,
}))

describe('ExportsPage', () => {
  const originalCreateObjectURL = URL.createObjectURL
  const originalRevokeObjectURL = URL.revokeObjectURL
  const originalCreateElement = document.createElement.bind(document)

  let createObjectURLMock: ReturnType<typeof vi.fn>
  let revokeObjectURLMock: ReturnType<typeof vi.fn>
  let anchorClickMock: ReturnType<typeof vi.fn>
  let anchorElement: HTMLAnchorElement

  beforeEach(() => {
    vi.clearAllMocks()

    createObjectURLMock = vi.fn(() => 'blob:download')
    revokeObjectURLMock = vi.fn()
    anchorClickMock = vi.fn()
    anchorElement = originalCreateElement('a')
    anchorElement.click = anchorClickMock

    Object.defineProperty(URL, 'createObjectURL', {
      value: createObjectURLMock,
      configurable: true,
    })

    Object.defineProperty(URL, 'revokeObjectURL', {
      value: revokeObjectURLMock,
      configurable: true,
    })

    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName.toLowerCase() === 'a') {
        return anchorElement
      }

      return originalCreateElement(tagName)
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()

    Object.defineProperty(URL, 'createObjectURL', {
      value: originalCreateObjectURL,
      configurable: true,
    })

    Object.defineProperty(URL, 'revokeObjectURL', {
      value: originalRevokeObjectURL,
      configurable: true,
    })
  })

  it('mengunduh CV ATS PDF dengan locale default english', async () => {
    const wrapper = mount(ExportsPage, {
      global: {
        stubs: {
          ExportActionCard: true,
        },
      },
    })

    const vm = wrapper.vm as unknown as {
      exportLocale: 'id' | 'en'
      exportDocument: (type: 'cv' | 'portfolios') => void
    }

    vm.exportDocument('cv')

    await flushPromises()

    expect(wrapper.text()).not.toContain('Bahasa Dokumen')
    expect(exportCvPdfApiMock).toHaveBeenCalledWith('en')
    expect(vm.exportLocale).toBe('en')
    expect(createObjectURLMock).toHaveBeenCalledTimes(1)
    expect(anchorElement.download).toBe('cv-ats-en.pdf')
    expect(anchorClickMock).toHaveBeenCalledTimes(1)
    expect(revokeObjectURLMock).toHaveBeenCalledWith('blob:download')
    expect(showSuccessMock).toHaveBeenCalledWith('CV ATS PDF berhasil diunduh.')
  })

  it('mengunduh portfolio PDF dengan locale default english', async () => {
    const wrapper = mount(ExportsPage, {
      global: {
        stubs: {
          ExportActionCard: true,
        },
      },
    })

    const vm = wrapper.vm as unknown as {
      exportLocale: 'id' | 'en'
      exportDocument: (type: 'cv' | 'portfolios') => void
    }

    vm.exportDocument('portfolios')

    await flushPromises()

    expect(exportPortfoliosPdfApiMock).toHaveBeenCalledWith('en')
    expect(vm.exportLocale).toBe('en')
    expect(anchorElement.download).toBe('portfolio-detail-en.pdf')
    expect(showSuccessMock).toHaveBeenCalledWith('Portfolio PDF berhasil diunduh.')
  })

  it('menampilkan snackbar error saat export gagal', async () => {
    exportCvPdfApiMock.mockRejectedValueOnce(new Error('Network error'))

    const wrapper = mount(ExportsPage, {
      global: {
        stubs: {
          ExportActionCard: true,
        },
      },
    })

    const vm = wrapper.vm as unknown as {
      exportDocument: (type: 'cv' | 'portfolios') => void
      exportingType: 'cv' | 'portfolios' | null
    }

    vm.exportDocument('cv')

    await flushPromises()

    expect(showErrorMock).toHaveBeenCalledWith('Gagal mengunduh CV ATS PDF.')
    expect(vm.exportingType).toBeNull()
  })
})
