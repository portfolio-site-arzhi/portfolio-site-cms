import { importSkillsApi } from '@/api/skill-service'
import { useAppStore } from '@/stores/app'

type UseSkillImportOptions = {
  isBlocked: () => boolean
  onImported: () => void
}

export function useSkillImport (options: UseSkillImportOptions) {
  const appStore = useAppStore()

  const importDialog = ref(false)
  const importLoading = ref(false)
  const selectedImportFile = ref<File | null>(null)
  const importErrorMessage = ref<string | null>(null)

  function resetImportState (): void {
    selectedImportFile.value = null
    importErrorMessage.value = null
  }

  function openImportDialog (): void {
    if (options.isBlocked() || importLoading.value) {
      return
    }

    resetImportState()
    importDialog.value = true
  }

  function selectImportFile (file: File | null): void {
    if (!file) {
      return
    }

    if (!/\.xlsx$/i.test(file.name)) {
      selectedImportFile.value = null
      importErrorMessage.value = 'File yang diunggah harus berformat .xlsx.'
      return
    }

    selectedImportFile.value = file
    importErrorMessage.value = null
  }

  function clearSelectedImportFile (): void {
    resetImportState()
  }

  function confirmImport (): void {
    if (options.isBlocked() || importLoading.value) {
      return
    }

    if (!selectedImportFile.value) {
      if (!importErrorMessage.value) {
        importErrorMessage.value = 'Pilih file Excel terlebih dahulu.'
      }

      return
    }

    importLoading.value = true
    importErrorMessage.value = null

    importSkillsApi(selectedImportFile.value).then(response => {
      importDialog.value = false
      resetImportState()
      options.onImported()
      appStore.showSuccess(response.data.message || 'Data skills berhasil diimport.')
    }).catch(error => {
      console.error('Failed to import skills excel', error)
      importErrorMessage.value = 'Import gagal. Periksa file lalu coba lagi.'
      appStore.showError('Gagal mengimpor file Excel skills.')
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
    importDialog,
    importLoading,
    selectedImportFile,
    importErrorMessage,
    openImportDialog,
    selectImportFile,
    clearSelectedImportFile,
    confirmImport,
  }
}
