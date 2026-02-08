import type { SiteConfigHomeValue } from '@/model/site-config'

type ModelRef<T> = {
  value: T
}

export function useHomeTab (options: {
  modelValue: ModelRef<(SiteConfigHomeValue & { status_file?: number })>
  file: ModelRef<File | null>
  validateField?: (path: string) => unknown
}) {
  const fileInput = ref<HTMLInputElement | null>(null)
  const previewUrl = ref<string>('')

  const displayPhoto = computed(() => {
    if (previewUrl.value) {
      return previewUrl.value
    }
    if (options.modelValue.value.photo) {
      return options.modelValue.value.photo
    }
    return ''
  })

  watch(() => options.file.value, newFile => {
    if (newFile) {
      if (previewUrl.value && previewUrl.value.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl.value)
      }
      previewUrl.value = URL.createObjectURL(newFile)
    } else {
      if (previewUrl.value && previewUrl.value.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl.value)
      }
      previewUrl.value = ''
    }
  })

  onUnmounted(() => {
    if (previewUrl.value && previewUrl.value.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl.value)
    }
  })

  function triggerFileInput (): void {
    fileInput.value?.click()
  }

  function handleFileChange (event: Event): void {
    const target = event.target as HTMLInputElement
    if (target.files && target.files.length > 0) {
      const selectedFile = target.files[0]
      if (selectedFile) {
        options.file.value = selectedFile

        options.modelValue.value = {
          ...options.modelValue.value,
          status_file: 1,
        }
      }
    }

    target.value = ''
  }

  function handleDeletePhoto (): void {
    options.file.value = null
    previewUrl.value = ''

    options.modelValue.value = {
      ...options.modelValue.value,
      status_file: 1,
      photo: null,
    }
  }

  function updateSingle (field: 'name' | 'position', value: string): void {
    options.modelValue.value = {
      ...options.modelValue.value,
      [field]: value,
    }
    if (options.validateField) {
      options.validateField(`home.${field}`)
    }
  }

  function updateDescription (locale: 'id' | 'en', value: string): void {
    options.modelValue.value = {
      ...options.modelValue.value,
      description: {
        ...options.modelValue.value.description,
        [locale]: value,
      },
    }
    if (options.validateField) {
      options.validateField(`home.description.${locale}`)
    }
  }

  return {
    fileInput,
    displayPhoto,
    triggerFileInput,
    handleFileChange,
    handleDeletePhoto,
    updateSingle,
    updateDescription,
  }
}
