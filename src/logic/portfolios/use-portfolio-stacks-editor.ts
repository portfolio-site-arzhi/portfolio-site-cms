import type { PortfolioStackDraft } from '@/model/portfolio'

export function usePortfolioStacksEditor (options: {
  props: {
    modelValue: PortfolioStackDraft[]
    disabled: boolean
  }
  emit: {
    (e: 'update:modelValue', value: PortfolioStackDraft[]): void
    (e: 'changed'): void
  }
}) {
  const stackDialog = ref(false)
  const stackName = ref('')
  const stackError = ref<string | null>(null)
  const editingIndex = ref<number | null>(null)

  const stacksDraft = ref<PortfolioStackDraft[]>([])
  const isSyncingModel = ref(false)

  const isStacksSortDisabled = computed(() => options.props.disabled)

  watch(
    () => options.props.modelValue,
    next => {
      if (isSyncingModel.value) {
        return
      }

      stacksDraft.value = Array.isArray(next)
        ? next.map(item => ({
            id: item.id,
            name: String(item.name ?? ''),
          }))
        : []
    },
    {
      deep: true,
      immediate: true,
    },
  )

  function emitModelFromDraft (): void {
    isSyncingModel.value = true
    options.emit('update:modelValue', stacksDraft.value.map(item => ({
      id: item.id,
      name: item.name,
    })))
    isSyncingModel.value = false
    options.emit('changed')
  }

  function openCreateStackDialog (): void {
    editingIndex.value = null
    stackName.value = ''
    stackError.value = null
    stackDialog.value = true
  }

  function openEditStackDialog (index: number): void {
    const selected = stacksDraft.value[index]
    if (!selected) {
      return
    }

    editingIndex.value = index
    stackName.value = selected.name
    stackError.value = null
    stackDialog.value = true
  }

  function onStackDialogUpdate (value: boolean): void {
    if (value) {
      stackDialog.value = true
      return
    }

    closeStackDialog()
  }

  function onStackNameUpdate (value: string): void {
    stackName.value = value
  }

  function closeStackDialog (): void {
    stackDialog.value = false
    stackError.value = null
    stackName.value = ''
    editingIndex.value = null
  }

  function saveStack (): void {
    const normalizedName = stackName.value.trim()

    if (normalizedName.length === 0) {
      stackError.value = 'Nama stack wajib diisi'
      return
    }

    if (normalizedName.length > 120) {
      stackError.value = 'Nama stack maksimal 120 karakter'
      return
    }

    const existing = stacksDraft.value.findIndex((item, index) => (
      index !== editingIndex.value && item.name.trim().toLowerCase() === normalizedName.toLowerCase()
    ))

    if (existing !== -1) {
      stackError.value = 'Stack sudah ada'
      return
    }

    const nextItem: PortfolioStackDraft = {
      id: editingIndex.value === null ? null : stacksDraft.value[editingIndex.value]?.id ?? null,
      name: normalizedName,
    }

    if (editingIndex.value === null) {
      stacksDraft.value = [...stacksDraft.value, nextItem]
    } else {
      const next = stacksDraft.value.slice()
      next.splice(editingIndex.value, 1, nextItem)
      stacksDraft.value = next
    }

    emitModelFromDraft()
    closeStackDialog()
  }

  function removeStackAt (index: number): void {
    if (index < 0 || index >= stacksDraft.value.length) {
      return
    }

    const next = stacksDraft.value.slice()
    next.splice(index, 1)
    stacksDraft.value = next
    emitModelFromDraft()
  }

  function stackKey (stack: PortfolioStackDraft): string {
    if (stack.id !== null) {
      return `id-${stack.id}`
    }

    return `new-${stack.name.toLowerCase()}`
  }

  function onStacksDragEnd (): void {
    if (isStacksSortDisabled.value) {
      return
    }

    emitModelFromDraft()
  }

  return {
    stackDialog,
    stackName,
    stackError,
    stacksDraft,
    isStacksSortDisabled,
    openCreateStackDialog,
    openEditStackDialog,
    onStackDialogUpdate,
    onStackNameUpdate,
    saveStack,
    removeStackAt,
    stackKey,
    onStacksDragEnd,
  }
}
