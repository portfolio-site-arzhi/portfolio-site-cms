import type { Certification } from '@/model/certification'
import {
  deleteCertificationApi,
  fetchCertificationDetailApi,
  fetchCertificationsApi,
  updateCertificationApi,
  updateCertificationsSortApi,
} from '@/api/certification-service'
import { useAppStore } from '@/stores/app'

export function useCertificationsPage () {
  const appStore = useAppStore()

  const certifications = ref<Certification[]>([])
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

  const selectedCertification = ref<Certification | null>(null)
  const loadingCertificationId = ref<number | null>(null)
  const lastOrderBackup = ref<Certification[] | null>(null)

  const isSearchActive = computed(() => (search.value ?? '').trim().length > 0)
  const isSortDisabled = computed(() => sortLoading.value || isSearchActive.value)

  const deleteDialogTitle = computed(() => {
    if (!selectedCertification.value) {
      return 'Hapus certification'
    }

    return 'Konfirmasi hapus certification'
  })

  const deleteDialogMessage = computed(() => {
    if (!selectedCertification.value) {
      return 'Apakah Anda yakin ingin menghapus certification ini?'
    }

    return `Apakah Anda yakin ingin menghapus certification "${selectedCertification.value.name}"?`
  })

  const statusDialogTitle = computed(() => {
    if (!selectedCertification.value) {
      return 'Ubah status'
    }

    return selectedCertification.value.is_active ? 'Nonaktifkan certification' : 'Aktifkan certification'
  })

  const statusDialogMessage = computed(() => {
    if (!selectedCertification.value) {
      return 'Apakah Anda yakin ingin mengubah status certification ini?'
    }

    const nextLabel = selectedCertification.value.is_active ? 'menonaktifkan' : 'mengaktifkan'
    return `Apakah Anda yakin ingin ${nextLabel} certification "${selectedCertification.value.name}"?`
  })

  function refreshPage (): void {
    loadCertifications()
  }

  function loadCertifications (): void {
    loading.value = true
    loadError.value = null
    sortError.value = null

    const normalizedSearch = (search.value ?? '').trim()

    fetchCertificationsApi({
      search: normalizedSearch.length > 0 ? normalizedSearch : null,
    }).then(response => {
      certifications.value = response.data?.data ?? []
      sortDirty.value = false
      lastOrderBackup.value = null
    }).catch(error => {
      console.error('Failed to load certifications', error)
      loadError.value = 'Gagal memuat data certification.'
    }).finally(() => {
      loading.value = false
    })
  }

  function openCreateDialog (): void {
    selectedCertification.value = null
    formErrors.value = []
    createDialog.value = true
  }

  function openEditDialog (certification: Certification): void {
    const id = certification.id

    loadingCertificationId.value = id
    formErrors.value = []

    fetchCertificationDetailApi(id).then(response => {
      selectedCertification.value = response.data.data
      editDialog.value = true
    }).catch(error => {
      console.error('Failed to load certification detail', error)
      loadError.value = 'Gagal memuat detail certification.'
    }).finally(() => {
      loadingCertificationId.value = null
    })
  }

  function openDeleteDialog (certification: Certification): void {
    selectedCertification.value = certification
    deleteDialog.value = true
  }

  function openStatusDialog (certification: Certification): void {
    selectedCertification.value = certification
    statusDialog.value = true
  }

  function onCertificationCreated (_certification: Certification): void {
    formErrors.value = []
    loadCertifications()
    appStore.showSuccess('Certification berhasil dibuat.')
  }

  function onCertificationUpdated (_certification: Certification): void {
    formErrors.value = []
    loadCertifications()
    appStore.showSuccess('Certification berhasil diperbarui.')
  }

  function onFormFailed (errors: string[]): void {
    formErrors.value = errors
  }

  function confirmDelete (): void {
    if (!selectedCertification.value) {
      return
    }

    const id = selectedCertification.value.id

    loadingCertificationId.value = id

    deleteCertificationApi(id).then(() => {
      deleteDialog.value = false
      selectedCertification.value = null
      loadCertifications()
      appStore.showSuccess('Certification berhasil dihapus.')
    }).catch(error => {
      console.error('Failed to delete certification', error)
    }).finally(() => {
      loadingCertificationId.value = null
    })
  }

  function confirmStatusChange (): void {
    if (!selectedCertification.value) {
      return
    }

    const id = selectedCertification.value.id
    const next = !selectedCertification.value.is_active

    loadingCertificationId.value = id

    updateCertificationApi(id, {
      is_active: next,
    }).then(() => {
      loadCertifications()
      appStore.showSuccess('Status certification berhasil diperbarui.')
    }).catch(error => {
      console.error('Failed to update certification status', error)
    }).finally(() => {
      loadingCertificationId.value = null
    })
  }

  function onDragStart (): void {
    if (isSortDisabled.value) {
      return
    }
    sortError.value = null
    if (!lastOrderBackup.value) {
      lastOrderBackup.value = certifications.value.slice()
    }
  }

  function onDragEnd (): void {
    if (isSortDisabled.value) {
      return
    }
    if (certifications.value.length === 0) {
      return
    }

    sortError.value = null
    sortDirty.value = true
  }

  function saveSort (): void {
    if (isSortDisabled.value) {
      return
    }
    if (certifications.value.length === 0) {
      return
    }

    sortLoading.value = true
    sortError.value = null

    const ids = certifications.value.map(item => item.id)

    updateCertificationsSortApi({ ids }).then(() => {
      loadCertifications()
      appStore.showSuccess('Urutan certification berhasil disimpan.')
    }).catch(error => {
      console.error('Failed to update certifications sort', error)
      sortError.value = 'Gagal menyimpan urutan. Urutan dikembalikan seperti semula.'
      sortDirty.value = false

      if (lastOrderBackup.value) {
        certifications.value = lastOrderBackup.value.slice()
      }
    }).finally(() => {
      sortLoading.value = false
      lastOrderBackup.value = null
    })
  }

  function formatIssueDate (certification: Certification): string {
    const value = certification.issue_date
    if (!value) {
      return '—'
    }

    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
    if (!match) {
      return value
    }

    const year = match[1]
    const monthIndex = Number(match[2])

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
    const label = months[monthIndex - 1]
    if (!label) {
      return value
    }

    return `${label} ${year}`
  }

  return {
    certifications,
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
    selectedCertification,
    loadingCertificationId,
    isSearchActive,
    isSortDisabled,
    deleteDialogTitle,
    deleteDialogMessage,
    statusDialogTitle,
    statusDialogMessage,
    refreshPage,
    loadCertifications,
    openCreateDialog,
    openEditDialog,
    openDeleteDialog,
    openStatusDialog,
    onCertificationCreated,
    onCertificationUpdated,
    onFormFailed,
    confirmDelete,
    confirmStatusChange,
    onDragStart,
    onDragEnd,
    saveSort,
    formatIssueDate,
  }
}
