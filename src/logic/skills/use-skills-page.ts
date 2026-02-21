import type { SkillGroup } from '@/model/skill'
import {
  deleteSkillApi,
  fetchSkillDetailApi,
  fetchSkillsApi,
  updateSkillApi,
  updateSkillsSortApi,
} from '@/api/skill-service'
import { useAppStore } from '@/stores/app'

export function useSkillsPage () {
  const appStore = useAppStore()

  const skillGroups = ref<SkillGroup[]>([])
  const loading = ref(false)
  const loadError = ref<string | null>(null)
  const search = ref<string | null>('')
  const formErrors = ref<string[]>([])
  const sortLoading = ref(false)
  const sortError = ref<string | null>(null)
  const sortDirty = ref(false)

  const createDialog = ref(false)
  const editDialog = ref(false)
  const deleteDialog = ref(false)
  const statusDialog = ref(false)

  const selectedSkillGroup = ref<SkillGroup | null>(null)
  const loadingSkillGroupId = ref<number | null>(null)
  const lastOrderBackup = ref<SkillGroup[] | null>(null)

  const isSearchActive = computed(() => (search.value ?? '').trim().length > 0)
  const isSortDisabled = computed(() => sortLoading.value || isSearchActive.value)

  const deleteDialogTitle = computed(() => {
    if (!selectedSkillGroup.value) {
      return 'Hapus grup skill'
    }

    return 'Konfirmasi hapus grup skill'
  })

  const deleteDialogMessage = computed(() => {
    if (!selectedSkillGroup.value) {
      return 'Apakah Anda yakin ingin menghapus grup skill ini?'
    }

    return `Apakah Anda yakin ingin menghapus grup skill "${selectedSkillGroup.value.name}"?`
  })

  const statusDialogTitle = computed(() => {
    if (!selectedSkillGroup.value) {
      return 'Ubah status'
    }

    return selectedSkillGroup.value.is_active ? 'Nonaktifkan grup skill' : 'Aktifkan grup skill'
  })

  const statusDialogMessage = computed(() => {
    if (!selectedSkillGroup.value) {
      return 'Apakah Anda yakin ingin mengubah status grup skill ini?'
    }

    const nextLabel = selectedSkillGroup.value.is_active ? 'menonaktifkan' : 'mengaktifkan'
    return `Apakah Anda yakin ingin ${nextLabel} grup skill "${selectedSkillGroup.value.name}"?`
  })

  function refreshPage (): void {
    loadSkillGroups()
  }

  function loadSkillGroups (): void {
    loading.value = true
    loadError.value = null
    sortError.value = null

    const normalizedSearch = (search.value ?? '').trim()

    fetchSkillsApi({
      search: normalizedSearch.length > 0 ? normalizedSearch : null,
    }).then(response => {
      skillGroups.value = response.data?.data ?? []
      sortDirty.value = false
      lastOrderBackup.value = null
    }).catch(error => {
      console.error('Failed to load skill groups', error)
      loadError.value = 'Gagal memuat data skills.'
    }).finally(() => {
      loading.value = false
    })
  }

  function openCreateDialog (): void {
    selectedSkillGroup.value = null
    formErrors.value = []
    createDialog.value = true
  }

  function openEditDialog (skillGroup: SkillGroup): void {
    const id = skillGroup.id

    loadingSkillGroupId.value = id
    formErrors.value = []

    fetchSkillDetailApi(id).then(response => {
      selectedSkillGroup.value = response.data.data
      editDialog.value = true
    }).catch(error => {
      console.error('Failed to load skill detail', error)
      loadError.value = 'Gagal memuat detail skills.'
    }).finally(() => {
      loadingSkillGroupId.value = null
    })
  }

  function openDeleteDialog (skillGroup: SkillGroup): void {
    selectedSkillGroup.value = skillGroup
    deleteDialog.value = true
  }

  function openStatusDialog (skillGroup: SkillGroup): void {
    selectedSkillGroup.value = skillGroup
    statusDialog.value = true
  }

  function onSkillCreated (_skill: SkillGroup): void {
    formErrors.value = []
    loadSkillGroups()
    appStore.showSuccess('Grup skill berhasil dibuat.')
  }

  function onSkillUpdated (_skill: SkillGroup): void {
    formErrors.value = []
    loadSkillGroups()
    appStore.showSuccess('Grup skill berhasil diperbarui.')
  }

  function onFormFailed (errors: string[]): void {
    formErrors.value = errors
  }

  function confirmDelete (): void {
    if (!selectedSkillGroup.value) {
      return
    }

    const id = selectedSkillGroup.value.id

    loadingSkillGroupId.value = id

    deleteSkillApi(id).then(() => {
      deleteDialog.value = false
      selectedSkillGroup.value = null
      loadSkillGroups()
      appStore.showSuccess('Grup skill berhasil dihapus.')
    }).catch(error => {
      console.error('Failed to delete skill group', error)
    }).finally(() => {
      loadingSkillGroupId.value = null
    })
  }

  function confirmStatusChange (): void {
    if (!selectedSkillGroup.value) {
      return
    }

    const id = selectedSkillGroup.value.id
    const next = !selectedSkillGroup.value.is_active

    loadingSkillGroupId.value = id

    updateSkillApi(id, {
      is_active: next,
    }).then(() => {
      loadSkillGroups()
      appStore.showSuccess('Status grup skill berhasil diperbarui.')
    }).catch(error => {
      console.error('Failed to update skill group status', error)
    }).finally(() => {
      loadingSkillGroupId.value = null
    })
  }

  function onDragStart (): void {
    if (isSortDisabled.value) {
      return
    }

    sortError.value = null
    if (!lastOrderBackup.value) {
      lastOrderBackup.value = skillGroups.value.slice()
    }
  }

  function onDragEnd (): void {
    if (isSortDisabled.value) {
      return
    }

    if (skillGroups.value.length === 0) {
      return
    }

    sortError.value = null
    sortDirty.value = true
  }

  function saveSort (): void {
    if (isSortDisabled.value) {
      return
    }

    if (skillGroups.value.length === 0) {
      return
    }

    sortLoading.value = true
    sortError.value = null

    const ids = skillGroups.value.map(item => item.id)

    updateSkillsSortApi({ ids }).then(() => {
      loadSkillGroups()
      appStore.showSuccess('Urutan skill berhasil disimpan.')
    }).catch(error => {
      console.error('Failed to update skills sort', error)
      sortError.value = 'Gagal menyimpan urutan. Urutan dikembalikan seperti semula.'
      sortDirty.value = false

      if (lastOrderBackup.value) {
        skillGroups.value = lastOrderBackup.value.slice()
      }
    }).finally(() => {
      sortLoading.value = false
      lastOrderBackup.value = null
    })
  }

  function formatSkillsPreview (skillGroup: SkillGroup): string {
    if (!Array.isArray(skillGroup.skills) || skillGroup.skills.length === 0) {
      return 'Belum ada skill'
    }

    return skillGroup.skills.map(item => item.name).join(', ')
  }

  return {
    skillGroups,
    loading,
    loadError,
    search,
    formErrors,
    sortLoading,
    sortError,
    sortDirty,
    createDialog,
    editDialog,
    deleteDialog,
    statusDialog,
    selectedSkillGroup,
    loadingSkillGroupId,
    isSearchActive,
    isSortDisabled,
    deleteDialogTitle,
    deleteDialogMessage,
    statusDialogTitle,
    statusDialogMessage,
    refreshPage,
    loadSkillGroups,
    openCreateDialog,
    openEditDialog,
    openDeleteDialog,
    openStatusDialog,
    onSkillCreated,
    onSkillUpdated,
    onFormFailed,
    confirmDelete,
    confirmStatusChange,
    onDragStart,
    onDragEnd,
    saveSort,
    formatSkillsPreview,
  }
}
