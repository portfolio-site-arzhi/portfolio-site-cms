import type { UsePortfolioImportDialogOptions } from '@/model/portfolio-import'
import { useSingleFileImportDialog } from '@/logic/shared/use-single-file-import-dialog'

export function usePortfolioImportDialog (options: UsePortfolioImportDialogOptions) {
  return useSingleFileImportDialog({
    getModelValue: () => options.props.modelValue,
    setModelValue: value => options.emit('update:modelValue', value),
    isLoading: () => options.props.loading,
    onSelectFile: file => options.emit('select-file', file),
    onClearFile: () => options.emit('clear-file'),
  })
}
