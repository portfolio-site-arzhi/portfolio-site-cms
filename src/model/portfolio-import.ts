export interface PortfolioImportDialogProps {
  modelValue: boolean
  loading: boolean
  selectedFile: File | null
  errorMessage: string | null
}

export interface PortfolioImportDialogEmits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'select-file', file: File | null): void
  (e: 'clear-file' | 'confirm'): void
}

export interface UsePortfolioImportDialogOptions {
  props: PortfolioImportDialogProps
  emit: PortfolioImportDialogEmits
}

export interface UsePortfolioImportOptions {
  onImported: () => void
}
