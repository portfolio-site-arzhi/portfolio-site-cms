import type { UseExperienceImportOptions } from '@/model/experience-import'
import { downloadExperiencesImportSampleApi, importExperiencesApi } from '@/api/experience-service'
import { useAppStore } from '@/stores/app'
import { extractAttachmentFileName, triggerBrowserDownload } from '@/utils/browser-download'

export function useExperienceImport (options: UseExperienceImportOptions) {
  const appStore = useAppStore()

  const sampleLoading = ref(false)
  const importDialog = ref(false)
  const importLoading = ref(false)
  const selectedImportFile = ref<File | null>(null)
  const importErrorMessage = ref<string | null>(null)

  function resetImportState (): void {
    selectedImportFile.value = null
    importErrorMessage.value = null
  }

  function openImportDialog (): void {
    if (sampleLoading.value || importLoading.value) {
      return
    }

    resetImportState()
    importDialog.value = true
  }

  function selectImportFile (file: File | null): void {
    if (!file) {
      return
    }

    if (!/\.json$/i.test(file.name)) {
      selectedImportFile.value = null
      importErrorMessage.value = 'File yang diunggah harus berformat .json.'
      return
    }

    selectedImportFile.value = file
    importErrorMessage.value = null
  }

  function clearSelectedImportFile (): void {
    resetImportState()
  }

  function downloadImportSample (): void {
    if (sampleLoading.value || importLoading.value) {
      return
    }

    sampleLoading.value = true

    downloadExperiencesImportSampleApi().then(response => {
      const fileName = extractAttachmentFileName(response, 'experiences-import-sample.json')

      triggerBrowserDownload(response.data, fileName)
      appStore.showSuccess('File sample import experience berhasil diunduh.')
    }).catch(error => {
      console.error('Failed to download experience import sample', error)
      appStore.showError('Gagal mengunduh file sample import experience.')
    }).finally(() => {
      sampleLoading.value = false
    })
  }

  function confirmImport (): void {
    if (sampleLoading.value || importLoading.value) {
      return
    }

    if (!selectedImportFile.value) {
      if (!importErrorMessage.value) {
        importErrorMessage.value = 'Pilih file JSON terlebih dahulu.'
      }

      return
    }

    importLoading.value = true
    importErrorMessage.value = null

    importExperiencesApi(selectedImportFile.value).then(response => {
      importDialog.value = false
      resetImportState()
      options.onImported()
      appStore.showSuccess(response.data.message || 'Data experience berhasil diimport.')
    }).catch(error => {
      console.error('Failed to import experiences json', error)
      importErrorMessage.value = 'Import gagal. Periksa file lalu coba lagi.'
      appStore.showError('Gagal mengimpor file JSON experience.')
    }).finally(() => {
      importLoading.value = false
    })
  }

  watch(importDialog, isOpen => {
    if (!isOpen && !importLoading.value) {
      resetImportState()
    }
  })

  return {
    sampleLoading,
    importDialog,
    importLoading,
    selectedImportFile,
    importErrorMessage,
    downloadImportSample,
    openImportDialog,
    selectImportFile,
    clearSelectedImportFile,
    confirmImport,
  }
}
