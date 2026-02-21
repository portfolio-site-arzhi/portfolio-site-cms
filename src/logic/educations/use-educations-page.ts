import type { Education } from '@/model/education'
import {
  deleteEducationApi,
  fetchEducationDetailApi,
  fetchEducationsApi,
  updateEducationApi,
  updateEducationsSortApi,
} from '@/api/education-service'
import { useAppStore } from '@/stores/app'

export function useEducationsPage () {
  const appStore = useAppStore()

  const educations = ref<Education[]>([])
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

  const selectedEducation = ref<Education | null>(null)
  const loadingEducationId = ref<number | null>(null)
  const lastOrderBackup = ref<Education[] | null>(null)

  const isSearchActive = computed(() => (search.value ?? '').trim().length > 0)
  const isSortDisabled = computed(() => sortLoading.value || isSearchActive.value)

  const deleteDialogTitle = computed(() => {
    if (!selectedEducation.value) {
      return 'Hapus education'
    }

    return 'Konfirmasi hapus education'
  })

  const deleteDialogMessage = computed(() => {
    if (!selectedEducation.value) {
      return 'Apakah Anda yakin ingin menghapus education ini?'
    }

    return `Apakah Anda yakin ingin menghapus education "${selectedEducation.value.institution_name}"?`
  })

  const statusDialogTitle = computed(() => {
    if (!selectedEducation.value) {
      return 'Ubah status'
    }

    return selectedEducation.value.is_active ? 'Nonaktifkan education' : 'Aktifkan education'
  })

  const statusDialogMessage = computed(() => {
    if (!selectedEducation.value) {
      return 'Apakah Anda yakin ingin mengubah status education ini?'
    }

    const nextLabel = selectedEducation.value.is_active ? 'menonaktifkan' : 'mengaktifkan'
    return `Apakah Anda yakin ingin ${nextLabel} education "${selectedEducation.value.institution_name}"?`
  })

  function refreshPage (): void {
    loadEducations()
  }

  function loadEducations (): void {
    loading.value = true
    loadError.value = null
    sortError.value = null

    const normalizedSearch = (search.value ?? '').trim()

    fetchEducationsApi({
      search: normalizedSearch.length > 0 ? normalizedSearch : null,
    }).then(response => {
      educations.value = response.data?.data ?? []
      sortDirty.value = false
      lastOrderBackup.value = null
    }).catch(error => {
      console.error('Failed to load educations', error)
      loadError.value = 'Gagal memuat data education.'
    }).finally(() => {
      loading.value = false
    })
  }

  function openCreateDialog (): void {
    selectedEducation.value = null
    formErrors.value = []
    createDialog.value = true
  }

  function openEditDialog (education: Education): void {
    const id = education.id

    loadingEducationId.value = id
    formErrors.value = []

    fetchEducationDetailApi(id).then(response => {
      selectedEducation.value = response.data.data
      editDialog.value = true
    }).catch(error => {
      console.error('Failed to load education detail', error)
      loadError.value = 'Gagal memuat detail education.'
    }).finally(() => {
      loadingEducationId.value = null
    })
  }

  function openDeleteDialog (education: Education): void {
    selectedEducation.value = education
    deleteDialog.value = true
  }

  function openStatusDialog (education: Education): void {
    selectedEducation.value = education
    statusDialog.value = true
  }

  function onEducationCreated (_education: Education): void {
    formErrors.value = []
    loadEducations()
    appStore.showSuccess('Education berhasil dibuat.')
  }

  function onEducationUpdated (_education: Education): void {
    formErrors.value = []
    loadEducations()
    appStore.showSuccess('Education berhasil diperbarui.')
  }

  function onFormFailed (errors: string[]): void {
    formErrors.value = errors
  }

  function confirmDelete (): void {
    if (!selectedEducation.value) {
      return
    }

    const id = selectedEducation.value.id

    loadingEducationId.value = id

    deleteEducationApi(id).then(() => {
      deleteDialog.value = false
      selectedEducation.value = null
      loadEducations()
      appStore.showSuccess('Education berhasil dihapus.')
    }).catch(error => {
      console.error('Failed to delete education', error)
    }).finally(() => {
      loadingEducationId.value = null
    })
  }

  function confirmStatusChange (): void {
    if (!selectedEducation.value) {
      return
    }

    const id = selectedEducation.value.id
    const next = !selectedEducation.value.is_active

    loadingEducationId.value = id

    updateEducationApi(id, {
      is_active: next,
    }).then(() => {
      loadEducations()
      appStore.showSuccess('Status education berhasil diperbarui.')
    }).catch(error => {
      console.error('Failed to update education status', error)
    }).finally(() => {
      loadingEducationId.value = null
    })
  }

  function onDragStart (): void {
    if (isSortDisabled.value) {
      return
    }
    sortError.value = null
    if (!lastOrderBackup.value) {
      lastOrderBackup.value = educations.value.slice()
    }
  }

  function onDragEnd (): void {
    if (isSortDisabled.value) {
      return
    }
    if (educations.value.length === 0) {
      return
    }

    sortError.value = null
    sortDirty.value = true
  }

  function saveSort (): void {
    if (isSortDisabled.value) {
      return
    }
    if (educations.value.length === 0) {
      return
    }

    sortLoading.value = true
    sortError.value = null

    const ids = educations.value.map(item => item.id)

    updateEducationsSortApi({ ids }).then(() => {
      loadEducations()
      appStore.showSuccess('Urutan education berhasil disimpan.')
    }).catch(error => {
      console.error('Failed to update educations sort', error)
      sortError.value = 'Gagal menyimpan urutan. Urutan dikembalikan seperti semula.'
      sortDirty.value = false

      if (lastOrderBackup.value) {
        educations.value = lastOrderBackup.value.slice()
      }
    }).finally(() => {
      sortLoading.value = false
      lastOrderBackup.value = null
    })
  }

  function formatMonthYear (value: string | null): string {
    if (!value) {
      return '—'
    }

    const match = /^(\d{4})-(\d{2})-\d{2}$/.exec(value)
    if (!match) {
      return '—'
    }

    const monthIndex = Number(match[2])
    const year = match[1]

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
    const label = months[monthIndex - 1]
    if (!label) {
      return '—'
    }

    return `${label} ${year}`
  }

  function formatPeriod (education: Education): string {
    const start = formatMonthYear(education.start_date)
    if (!education.end_date) {
      return `${start} - Sekarang`
    }

    const end = formatMonthYear(education.end_date)
    return `${start} - ${end}`
  }

  return {
    educations,
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
    selectedEducation,
    loadingEducationId,
    isSearchActive,
    isSortDisabled,
    deleteDialogTitle,
    deleteDialogMessage,
    statusDialogTitle,
    statusDialogMessage,
    refreshPage,
    loadEducations,
    openCreateDialog,
    openEditDialog,
    openDeleteDialog,
    openStatusDialog,
    onEducationCreated,
    onEducationUpdated,
    onFormFailed,
    confirmDelete,
    confirmStatusChange,
    onDragStart,
    onDragEnd,
    saveSort,
    formatPeriod,
  }
}
