import type { Experience } from '@/model/experience'
import {
  deleteExperienceApi,
  fetchExperienceDetailApi,
  fetchExperiencesApi,
  updateExperienceApi,
  updateExperiencesSortApi,
} from '@/api/experience-service'
import { useAppStore } from '@/stores/app'

export function useExperiencesPage () {
  const appStore = useAppStore()

  const experiences = ref<Experience[]>([])
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

  const selectedExperience = ref<Experience | null>(null)
  const loadingExperienceId = ref<number | null>(null)
  const lastOrderBackup = ref<Experience[] | null>(null)

  const isSearchActive = computed(() => (search.value ?? '').trim().length > 0)
  const isSortDisabled = computed(() => sortLoading.value || isSearchActive.value)

  const deleteDialogTitle = computed(() => {
    if (!selectedExperience.value) {
      return 'Hapus experience'
    }

    return 'Konfirmasi hapus experience'
  })

  const deleteDialogMessage = computed(() => {
    if (!selectedExperience.value) {
      return 'Apakah Anda yakin ingin menghapus experience ini?'
    }

    return `Apakah Anda yakin ingin menghapus experience "${selectedExperience.value.company_name}"?`
  })

  const statusDialogTitle = computed(() => {
    if (!selectedExperience.value) {
      return 'Ubah status publish'
    }

    return selectedExperience.value.is_published ? 'Jadikan Draft' : 'Publish'
  })

  const statusDialogMessage = computed(() => {
    if (!selectedExperience.value) {
      return 'Apakah Anda yakin ingin mengubah status publish experience ini?'
    }

    if (selectedExperience.value.is_published) {
      return `Apakah Anda yakin ingin menjadikan "${selectedExperience.value.company_name}" sebagai draft?`
    }

    return `Apakah Anda yakin ingin publish "${selectedExperience.value.company_name}"?`
  })

  onMounted(() => {
    loadExperiences()
  })

  function clearSearch (): void {
    search.value = ''
    refreshPage()
  }

  function refreshPage (): void {
    loadExperiences()
  }

  function loadExperiences (): void {
    loading.value = true
    loadError.value = null
    sortError.value = null

    const normalizedSearch = (search.value ?? '').trim()

    fetchExperiencesApi({
      search: normalizedSearch.length > 0 ? normalizedSearch : null,
    }).then(response => {
      experiences.value = response.data?.data ?? []
      sortDirty.value = false
      lastOrderBackup.value = null
    }).catch(error => {
      console.error('Failed to load experiences', error)
      loadError.value = 'Gagal memuat data experience.'
    }).finally(() => {
      loading.value = false
    })
  }

  function openCreateDialog (): void {
    selectedExperience.value = null
    formErrors.value = []
    createDialog.value = true
  }

  function openEditDialog (experience: Experience): void {
    const id = experience.id

    loadingExperienceId.value = id
    formErrors.value = []

    fetchExperienceDetailApi(id).then(response => {
      selectedExperience.value = response.data.data
      editDialog.value = true
    }).catch(error => {
      console.error('Failed to load experience detail', error)
      loadError.value = 'Gagal memuat detail experience.'
    }).finally(() => {
      loadingExperienceId.value = null
    })
  }

  function openDeleteDialog (experience: Experience): void {
    selectedExperience.value = experience
    deleteDialog.value = true
  }

  function openStatusDialog (experience: Experience): void {
    selectedExperience.value = experience
    statusDialog.value = true
  }

  function onExperienceCreated (_experience: Experience): void {
    formErrors.value = []
    loadExperiences()
    appStore.showSuccess('Experience berhasil dibuat.')
  }

  function onExperienceUpdated (_experience: Experience): void {
    formErrors.value = []
    loadExperiences()
    appStore.showSuccess('Experience berhasil diperbarui.')
  }

  function onFormFailed (errors: string[]): void {
    formErrors.value = errors
  }

  function confirmDelete (): void {
    if (!selectedExperience.value) {
      return
    }

    const id = selectedExperience.value.id

    loadingExperienceId.value = id

    deleteExperienceApi(id).then(() => {
      deleteDialog.value = false
      selectedExperience.value = null
      loadExperiences()
      appStore.showSuccess('Experience berhasil dihapus.')
    }).catch(error => {
      console.error('Failed to delete experience', error)
    }).finally(() => {
      loadingExperienceId.value = null
    })
  }

  function confirmStatusChange (): void {
    if (!selectedExperience.value) {
      return
    }

    const id = selectedExperience.value.id
    const next = !selectedExperience.value.is_published

    loadingExperienceId.value = id

    updateExperienceApi(id, {
      is_published: next,
    }).then(() => {
      loadExperiences()
      appStore.showSuccess('Status publish berhasil diperbarui.')
    }).catch(error => {
      console.error('Failed to update experience status', error)
    }).finally(() => {
      loadingExperienceId.value = null
    })
  }

  function onDragStart (): void {
    if (isSortDisabled.value) {
      return
    }
    sortError.value = null
    if (!lastOrderBackup.value) {
      lastOrderBackup.value = experiences.value.slice()
    }
  }

  function onDragEnd (): void {
    if (isSortDisabled.value) {
      return
    }
    if (experiences.value.length === 0) {
      return
    }

    sortError.value = null
    sortDirty.value = true
  }

  function saveSort (): void {
    if (isSortDisabled.value) {
      return
    }
    if (experiences.value.length === 0) {
      return
    }

    sortLoading.value = true
    sortError.value = null

    const ids = experiences.value.map(item => item.id)

    updateExperiencesSortApi({ ids }).then(() => {
      loadExperiences()
      appStore.showSuccess('Urutan experience berhasil disimpan.')
    }).catch(error => {
      console.error('Failed to update experiences sort', error)
      sortError.value = 'Gagal menyimpan urutan. Urutan dikembalikan seperti semula.'
      sortDirty.value = false

      if (lastOrderBackup.value) {
        experiences.value = lastOrderBackup.value.slice()
      }
    }).finally(() => {
      sortLoading.value = false
      lastOrderBackup.value = null
    })
  }

  function formatYears (experience: Experience): string {
    const start = experience.year_start === null ? '—' : String(experience.year_start)
    if (experience.is_current) {
      return `${start} - Sekarang`
    }

    const end = experience.year_end === null ? '—' : String(experience.year_end)
    return `${start} - ${end}`
  }

  return {
    experiences,
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
    selectedExperience,
    loadingExperienceId,
    isSearchActive,
    isSortDisabled,
    deleteDialogTitle,
    deleteDialogMessage,
    statusDialogTitle,
    statusDialogMessage,
    clearSearch,
    refreshPage,
    loadExperiences,
    openCreateDialog,
    openEditDialog,
    openDeleteDialog,
    openStatusDialog,
    onExperienceCreated,
    onExperienceUpdated,
    onFormFailed,
    confirmDelete,
    confirmStatusChange,
    onDragStart,
    onDragEnd,
    saveSort,
    formatYears,
  }
}
