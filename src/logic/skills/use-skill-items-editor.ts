import type { SkillItemDraft } from '@/model/skill'

export function useSkillItemsEditor (options: {
  props: {
    modelValue: string[]
    disabled: boolean
  }
  emit: {
    (e: 'update:modelValue', value: string[]): void
    (e: 'changed'): void
  }
}) {
  const skillDialog = ref(false)
  const skillName = ref('')
  const skillError = ref<string | null>(null)

  const skillsDraft = ref<SkillItemDraft[]>([])
  const isSyncingModel = ref(false)

  const isSkillsSortDisabled = computed(() => options.props.disabled)

  watch(
    () => options.props.modelValue,
    next => {
      if (isSyncingModel.value) {
        return
      }

      const normalized = normalizeSkills(next)
      skillsDraft.value = normalized.map(name => ({
        id: null,
        name,
      }))
    },
    {
      deep: true,
      immediate: true,
    },
  )

  function normalizeSkills (value: string[]): string[] {
    const cleaned = Array.isArray(value)
      ? value.map(v => String(v ?? '').trim()).filter(v => v.length > 0)
      : []

    const unique: string[] = []
    for (const item of cleaned) {
      const key = item.toLowerCase()
      if (!unique.some(existing => existing.toLowerCase() === key)) {
        unique.push(item)
      }
    }

    return unique
  }

  function emitModelFromDraft (): void {
    isSyncingModel.value = true
    options.emit('update:modelValue', skillsDraft.value.map(item => item.name))
    isSyncingModel.value = false
    options.emit('changed')
  }

  function openSkillDialog (): void {
    skillError.value = null
    skillName.value = ''
    skillDialog.value = true
  }

  function onSkillDialogUpdate (value: boolean): void {
    if (value) {
      skillDialog.value = true
      return
    }

    closeSkillDialog()
  }

  function onSkillNameUpdate (value: string): void {
    skillName.value = value
  }

  function closeSkillDialog (): void {
    skillDialog.value = false
    skillError.value = null
    skillName.value = ''
  }

  function saveSkill (): void {
    const raw = String(skillName.value ?? '')
    const normalized = raw.trim()

    if (normalized.length === 0) {
      skillError.value = 'Nama skill wajib diisi'
      return
    }

    if (normalized.length > 100) {
      skillError.value = 'Nama skill maksimal 100 karakter'
      return
    }

    const existing = skillsDraft.value.map(s => s.name.trim().toLowerCase())
    if (existing.includes(normalized.toLowerCase())) {
      skillError.value = 'Skill sudah ada'
      return
    }

    skillsDraft.value = [...skillsDraft.value, { id: null, name: normalized }]
    skillError.value = null
    emitModelFromDraft()
    closeSkillDialog()
  }

  function removeSkillAt (index: number): void {
    if (index < 0 || index >= skillsDraft.value.length) {
      return
    }

    const next = skillsDraft.value.slice()
    next.splice(index, 1)
    skillsDraft.value = next
    emitModelFromDraft()
  }

  function skillKey (skill: SkillItemDraft): string {
    if (skill.id !== null) {
      return `id-${skill.id}`
    }

    return `new-${skill.name}`
  }

  function onSkillsDragEnd (): void {
    if (isSkillsSortDisabled.value) {
      return
    }

    emitModelFromDraft()
  }

  return {
    skillDialog,
    skillName,
    skillError,
    skillsDraft,
    isSkillsSortDisabled,
    openSkillDialog,
    onSkillDialogUpdate,
    onSkillNameUpdate,
    saveSkill,
    removeSkillAt,
    skillKey,
    onSkillsDragEnd,
  }
}
