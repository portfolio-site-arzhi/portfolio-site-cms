import type { UseSingleFileImportDialogOptions } from '@/model/file-import'
import { openFileInput, readSingleFileFromChangeEvent, readSingleFileFromDropEvent } from '@/helper/file-input'

export function useSingleFileImportDialog (options: UseSingleFileImportDialogOptions) {
  const fileInput = ref<HTMLInputElement | null>(null)
  const isDragging = ref(false)
  const dragDepth = ref(0)

  const internalModel = computed({
    get () {
      return options.getModelValue()
    },
    set (value: boolean) {
      options.setModelValue(value)
    },
  })

  function openPicker (): void {
    if (options.isLoading()) {
      return
    }

    openFileInput(fileInput.value)
  }

  function onDropzoneClick (): void {
    openPicker()
  }

  function onFileChange (event: Event): void {
    options.onSelectFile(readSingleFileFromChangeEvent(event))
  }

  function onDragEnter (): void {
    if (options.isLoading()) {
      return
    }

    dragDepth.value += 1
    isDragging.value = true
  }

  function onDragOver (): void {
    if (options.isLoading()) {
      return
    }

    isDragging.value = true
  }

  function onDragLeave (): void {
    if (dragDepth.value > 0) {
      dragDepth.value -= 1
    }

    if (dragDepth.value === 0) {
      isDragging.value = false
    }
  }

  function onDrop (event: DragEvent): void {
    dragDepth.value = 0
    isDragging.value = false

    if (options.isLoading()) {
      return
    }

    options.onSelectFile(readSingleFileFromDropEvent(event))
  }

  function clearFile (): void {
    options.onClearFile()
  }

  return {
    fileInput,
    isDragging,
    internalModel,
    openPicker,
    onDropzoneClick,
    onFileChange,
    onDragEnter,
    onDragOver,
    onDragLeave,
    onDrop,
    clearFile,
  }
}
