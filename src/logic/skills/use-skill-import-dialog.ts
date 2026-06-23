import type { UseSkillImportDialogOptions } from '@/model/skill-import'
import { useSingleFileImportDialog } from '@/logic/shared/use-single-file-import-dialog'

export function useSkillImportDialog (options: UseSkillImportDialogOptions) {
  return useSingleFileImportDialog({
    getModelValue: () => options.props.modelValue,
    setModelValue: value => options.emit('update:modelValue', value),
    isLoading: () => options.props.loading,
    onSelectFile: file => options.emit('select-file', file),
    onClearFile: () => options.emit('clear-file'),
  })
}
