export interface ExperienceImportDialogProps {
  modelValue: boolean
  loading: boolean
  selectedFile: File | null
  errorMessage: string | null
}

export interface ExperienceImportDialogEmits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'select-file', file: File | null): void
  (e: 'clear-file' | 'confirm'): void
}

export interface UseExperienceImportDialogOptions {
  props: ExperienceImportDialogProps
  emit: ExperienceImportDialogEmits
}

export interface UseExperienceImportOptions {
  onImported: () => void
}
