import type { AxiosResponse } from 'axios'
import type { ExportDocumentOption, ExportDocumentType, ExportLocale } from '@/model/export'
import { exportCvPdfApi, exportPortfoliosPdfApi } from '@/api/export-service'
import { DEFAULT_EXPORT_LOCALE, EXPORT_DOCUMENT_OPTIONS } from '@/constants/export.constant'
import { useAppStore } from '@/stores/app'
import { extractAttachmentFileName, triggerBrowserDownload } from '@/utils/browser-download'

type ExportHandler = (locale: ExportLocale) => Promise<AxiosResponse<Blob>>

const EXPORT_API_HANDLERS: Record<ExportDocumentType, ExportHandler> = {
  cv: exportCvPdfApi,
  portfolios: exportPortfoliosPdfApi,
}

function findDocumentOption (type: ExportDocumentType): ExportDocumentOption {
  const documentOption = EXPORT_DOCUMENT_OPTIONS.find(item => item.type === type)

  if (!documentOption) {
    throw new Error(`Unknown export document type: ${type}`)
  }

  return documentOption
}

export function useExportsPage () {
  const appStore = useAppStore()

  const exportingType = ref<ExportDocumentType | null>(null)

  const documentOptions = EXPORT_DOCUMENT_OPTIONS
  const exportLocale: ExportLocale = DEFAULT_EXPORT_LOCALE
  const isExporting = computed(() => exportingType.value !== null)

  function isDocumentLoading (type: ExportDocumentType): boolean {
    return exportingType.value === type
  }

  function isDocumentDisabled (type: ExportDocumentType): boolean {
    return exportingType.value !== null && exportingType.value !== type
  }

  function exportDocument (type: ExportDocumentType): void {
    if (exportingType.value !== null) {
      return
    }

    exportingType.value = type

    const documentOption = findDocumentOption(type)

    EXPORT_API_HANDLERS[type](exportLocale)
      .then(response => {
        const resolvedFileName = extractAttachmentFileName(
          response,
          `${documentOption.fallbackFileName}-${exportLocale}.pdf`,
        )

        triggerBrowserDownload(response.data, resolvedFileName)
        appStore.showSuccess(documentOption.successMessage)
      })
      .catch(error => {
        console.error(`Failed to export ${type} pdf`, error)
        appStore.showError(documentOption.errorMessage)
      })
      .finally(() => {
        exportingType.value = null
      })
  }

  return {
    exportingType,
    documentOptions,
    exportLocale,
    isExporting,
    isDocumentLoading,
    isDocumentDisabled,
    exportDocument,
  }
}
