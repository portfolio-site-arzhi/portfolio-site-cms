import type { Portfolio } from '@/model/portfolio'
import {
  deletePortfolioApi,
  fetchPortfolioDetailApi,
  fetchPortfoliosApi,
  updatePortfolioApi,
  updatePortfoliosSortApi,
} from '@/api/portfolio-service'
import { useAppStore } from '@/stores/app'

export function usePortfoliosPage () {
  const appStore = useAppStore()

  const portfolios = ref<Portfolio[]>([])
  const loading = ref(false)
  const loadError = ref<string | null>(null)
  const search = ref<string | null>('')
  const formErrors = ref<string[]>([])
  const sortLoading = ref(false)
  const sortError = ref<string | null>(null)

  const createDialog = ref(false)
  const editDialog = ref(false)
  const deleteDialog = ref(false)
  const statusDialog = ref(false)

  const selectedPortfolio = ref<Portfolio | null>(null)
  const loadingPortfolioId = ref<number | null>(null)
  const lastOrderBackup = ref<Portfolio[] | null>(null)

  const isSearchActive = computed(() => (search.value ?? '').trim().length > 0)
  const isSortDisabled = computed(() => sortLoading.value || isSearchActive.value)

  const deleteDialogTitle = computed(() => {
    if (!selectedPortfolio.value) {
      return 'Hapus portfolio'
    }

    return 'Konfirmasi hapus portfolio'
  })

  const deleteDialogMessage = computed(() => {
    if (!selectedPortfolio.value) {
      return 'Apakah Anda yakin ingin menghapus portfolio ini?'
    }

    return `Apakah Anda yakin ingin menghapus portfolio "${selectedPortfolio.value.title}"?`
  })

  const statusDialogTitle = computed(() => {
    if (!selectedPortfolio.value) {
      return 'Ubah status publish'
    }

    return selectedPortfolio.value.is_published ? 'Jadikan Draft' : 'Publish'
  })

  const statusDialogMessage = computed(() => {
    if (!selectedPortfolio.value) {
      return 'Apakah Anda yakin ingin mengubah status publish portfolio ini?'
    }

    if (selectedPortfolio.value.is_published) {
      return `Apakah Anda yakin ingin menjadikan "${selectedPortfolio.value.title}" sebagai draft?`
    }

    return `Apakah Anda yakin ingin publish "${selectedPortfolio.value.title}"?`
  })

  onMounted(() => {
    loadPortfolios()
  })

  function clearSearch (): void {
    search.value = ''
    refreshPage()
  }

  function refreshPage (): void {
    loadPortfolios()
  }

  function loadPortfolios (): void {
    loading.value = true
    loadError.value = null
    sortError.value = null

    const normalizedSearch = (search.value ?? '').trim()

    fetchPortfoliosApi({
      search: normalizedSearch.length > 0 ? normalizedSearch : null,
    }).then(response => {
      portfolios.value = response.data?.data ?? []
      lastOrderBackup.value = null
    }).catch(error => {
      console.error('Failed to load portfolios', error)
      loadError.value = 'Gagal memuat data portfolio.'
    }).finally(() => {
      loading.value = false
    })
  }

  function openCreateDialog (): void {
    selectedPortfolio.value = null
    formErrors.value = []
    createDialog.value = true
  }

  function openEditDialog (portfolio: Portfolio): void {
    const id = portfolio.id

    loadingPortfolioId.value = id
    formErrors.value = []

    fetchPortfolioDetailApi(id).then(response => {
      selectedPortfolio.value = response.data.data
      editDialog.value = true
    }).catch(error => {
      console.error('Failed to load portfolio detail', error)
      loadError.value = 'Gagal memuat detail portfolio.'
    }).finally(() => {
      loadingPortfolioId.value = null
    })
  }

  function openDeleteDialog (portfolio: Portfolio): void {
    selectedPortfolio.value = portfolio
    deleteDialog.value = true
  }

  function openStatusDialog (portfolio: Portfolio): void {
    selectedPortfolio.value = portfolio
    statusDialog.value = true
  }

  function onPortfolioCreated (_portfolio: Portfolio): void {
    formErrors.value = []
    loadPortfolios()
    appStore.showSuccess('Portfolio berhasil dibuat.')
  }

  function onPortfolioUpdated (_portfolio: Portfolio): void {
    formErrors.value = []
    loadPortfolios()
    appStore.showSuccess('Portfolio berhasil diperbarui.')
  }

  function onFormFailed (errors: string[]): void {
    formErrors.value = errors
  }

  function confirmDelete (): void {
    if (!selectedPortfolio.value) {
      return
    }

    const id = selectedPortfolio.value.id
    loadingPortfolioId.value = id

    deletePortfolioApi(id).then(() => {
      deleteDialog.value = false
      selectedPortfolio.value = null
      loadPortfolios()
      appStore.showSuccess('Portfolio berhasil dihapus.')
    }).catch(error => {
      console.error('Failed to delete portfolio', error)
    }).finally(() => {
      loadingPortfolioId.value = null
    })
  }

  function confirmStatusChange (): void {
    if (!selectedPortfolio.value) {
      return
    }

    const id = selectedPortfolio.value.id
    const next = !selectedPortfolio.value.is_published

    loadingPortfolioId.value = id

    updatePortfolioApi(id, {
      status_file: 0,
      is_published: next,
    }).then(() => {
      loadPortfolios()
      appStore.showSuccess('Status publish portfolio berhasil diperbarui.')
    }).catch(error => {
      console.error('Failed to update portfolio status', error)
    }).finally(() => {
      loadingPortfolioId.value = null
    })
  }

  function onDragStart (): void {
    if (isSortDisabled.value) {
      return
    }

    sortError.value = null
    if (!lastOrderBackup.value) {
      lastOrderBackup.value = portfolios.value.slice()
    }
  }

  function onDragEnd (): void {
    if (isSortDisabled.value) {
      return
    }

    if (portfolios.value.length === 0) {
      return
    }

    sortError.value = null
  }

  function saveSort (): void {
    if (isSortDisabled.value) {
      return
    }

    if (portfolios.value.length === 0) {
      return
    }

    sortLoading.value = true
    sortError.value = null

    const ids = portfolios.value.map(item => item.id)

    updatePortfoliosSortApi({ ids }).then(() => {
      loadPortfolios()
      appStore.showSuccess('Urutan portfolio berhasil disimpan.')
    }).catch(error => {
      console.error('Failed to update portfolios sort', error)
      sortError.value = 'Gagal menyimpan urutan. Urutan dikembalikan seperti semula.'

      if (lastOrderBackup.value) {
        portfolios.value = lastOrderBackup.value.slice()
      }
    }).finally(() => {
      sortLoading.value = false
      lastOrderBackup.value = null
    })
  }

  function formatPublishedAt (value: string | null): string {
    if (!value) {
      return 'Belum diatur'
    }

    const date = new Date(value)
    if (Number.isNaN(date.getTime())) {
      return 'Belum diatur'
    }

    return new Intl.DateTimeFormat('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date)
  }

  function formatDescription (value: string): string {
    const normalized = value.replace(/\s+/g, ' ').trim()
    if (normalized.length <= 120) {
      return normalized
    }

    return `${normalized.slice(0, 117)}...`
  }

  return {
    portfolios,
    loading,
    loadError,
    search,
    formErrors,
    sortLoading,
    sortError,
    createDialog,
    editDialog,
    deleteDialog,
    statusDialog,
    selectedPortfolio,
    loadingPortfolioId,
    isSearchActive,
    isSortDisabled,
    deleteDialogTitle,
    deleteDialogMessage,
    statusDialogTitle,
    statusDialogMessage,
    clearSearch,
    refreshPage,
    loadPortfolios,
    openCreateDialog,
    openEditDialog,
    openDeleteDialog,
    openStatusDialog,
    onPortfolioCreated,
    onPortfolioUpdated,
    onFormFailed,
    confirmDelete,
    confirmStatusChange,
    onDragStart,
    onDragEnd,
    saveSort,
    formatPublishedAt,
    formatDescription,
  }
}
