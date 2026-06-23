export interface UseSingleFileImportDialogOptions {
  getModelValue: () => boolean
  setModelValue: (value: boolean) => void
  isLoading: () => boolean
  onSelectFile: (file: File | null) => void
  onClearFile: () => void
}
