import { openFileInput, readSingleFileFromChangeEvent, readSingleFileFromDropEvent } from '@/helper/file-input'

export type SkillImportDialogProps = {
  modelValue: boolean
  loading: boolean
  selectedFile: File | null
  errorMessage: string | null
}

export type SkillImportDialogEmits = {
  (e: 'update:modelValue', value: boolean): void
  (e: 'select-file', file: File | null): void
  (e: 'clear-file' | 'confirm'): void
}

type UseSkillImportDialogOptions = {
  props: SkillImportDialogProps
  emit: SkillImportDialogEmits
}

export function useSkillImportDialog (options: UseSkillImportDialogOptions) {
  const fileInput = ref<HTMLInputElement | null>(null)
  const isDragging = ref(false)
  const dragDepth = ref(0)

  const internalModel = computed({
    get () {
      return options.props.modelValue
    },
    set (value: boolean) {
      options.emit('update:modelValue', value)
    },
  })

  function openPicker (): void {
    if (options.props.loading) {
      return
    }

    openFileInput(fileInput.value)
  }

  function onDropzoneClick (): void {
    openPicker()
  }

  function onFileChange (event: Event): void {
    options.emit('select-file', readSingleFileFromChangeEvent(event))
  }

  function onDragEnter (): void {
    if (options.props.loading) {
      return
    }

    dragDepth.value += 1
    isDragging.value = true
  }

  function onDragOver (): void {
    if (options.props.loading) {
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

    if (options.props.loading) {
      return
    }

    options.emit('select-file', readSingleFileFromDropEvent(event))
  }

  function clearFile (): void {
    options.emit('clear-file')
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
