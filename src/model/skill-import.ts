export interface SkillImportDialogProps {
  modelValue: boolean
  loading: boolean
  selectedFile: File | null
  errorMessage: string | null
}

export interface SkillImportDialogEmits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'select-file', file: File | null): void
  (e: 'clear-file' | 'confirm'): void
}

export interface UseSkillImportDialogOptions {
  props: SkillImportDialogProps
  emit: SkillImportDialogEmits
}
