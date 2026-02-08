import type { FetchUsersParams, User, UsersListMeta, UsersSortByItem } from '@/model/user'
import { deleteUserApi, fetchUserDetailApi, fetchUsersApi, updateUserStatusApi } from '@/api/user-service'
import { useAppStore } from '@/stores/app'

export function useUsersPage () {
  const appStore = useAppStore()

  const users = ref<User[]>([])
  const usersMeta = ref<UsersListMeta | null>(null)
  const loading = ref(false)
  const loadError = ref<string | null>(null)
  const search = ref('')
  const formErrors = ref<string[]>([])

  const page = ref(1)
  const itemsPerPage = ref(10)
  const sortBy = ref<UsersSortByItem[]>([])

  const createDialog = ref(false)
  const editDialog = ref(false)
  const statusDialog = ref(false)
  const deleteDialog = ref(false)

  const selectedUser = ref<User | null>(null)
  const loadingUserId = ref<number | null>(null)

  const itemsLength = computed(() => {
    if (!usersMeta.value) {
      return users.value.length
    }

    const currentPage = usersMeta.value.page
    const pageSize = usersMeta.value.page_size

    return (currentPage - 1) * pageSize + users.value.length
  })

  const statusDialogTitle = computed(() => {
    if (!selectedUser.value) {
      return 'Konfirmasi status pengguna'
    }

    if (selectedUser.value.status) {
      return 'Nonaktifkan pengguna'
    }

    return 'Aktifkan pengguna'
  })

  const statusDialogMessage = computed(() => {
    if (!selectedUser.value) {
      return 'Apakah Anda yakin ingin mengubah status pengguna ini?'
    }

    if (selectedUser.value.status) {
      return `Apakah Anda yakin ingin menonaktifkan pengguna "${selectedUser.value.name}"?`
    }

    return `Apakah Anda yakin ingin mengaktifkan pengguna "${selectedUser.value.name}"?`
  })

  const deleteDialogTitle = computed(() => {
    if (!selectedUser.value) {
      return 'Hapus pengguna'
    }

    return 'Konfirmasi hapus pengguna'
  })

  const deleteDialogMessage = computed(() => {
    if (!selectedUser.value) {
      return 'Apakah Anda yakin ingin menghapus pengguna ini?'
    }

    return `Apakah Anda yakin ingin menghapus pengguna "${selectedUser.value.name}"?`
  })

  onMounted(() => {
    loadUsers()
  })

  watch(
    () => ({
      page: page.value,
      itemsPerPage: itemsPerPage.value,
      sortBy: sortBy.value,
    }),
    () => {
      loadUsers()
    },
  )

  function getUserFromTableItem (item: unknown): User | null {
    if (typeof item !== 'object' || item === null) {
      return null
    }

    if ('raw' in item) {
      const raw = (item as { raw?: unknown }).raw

      if (raw && typeof raw === 'object') {
        return raw as User
      }
    }

    const candidate = item as Partial<User>

    if (
      typeof candidate.id === 'number'
      && typeof candidate.email === 'string'
      && typeof candidate.name === 'string'
    ) {
      return candidate as User
    }

    return null
  }

  function refreshPage (): void {
    page.value = 1
    loadUsers()
  }

  function loadUsers (): void {
    loading.value = true
    loadError.value = null

    const params: FetchUsersParams = {
      page: page.value,
      page_size: itemsPerPage.value,
      search: search.value ? search.value.trim() : null,
    }

    if (sortBy.value.length > 0) {
      const primarySort = sortBy.value[0]

      if (primarySort && primarySort.key) {
        params.order_field = primarySort.key
      }

      if (primarySort && (primarySort.order === 'asc' || primarySort.order === 'desc')) {
        params.order_dir = primarySort.order
      }
    }

    fetchUsersApi(params).then(response => {
      const responseData = response.data
      users.value = responseData?.data ?? []
      usersMeta.value = responseData?.meta ?? null

      if (usersMeta.value) {
        page.value = usersMeta.value.page
        itemsPerPage.value = usersMeta.value.page_size
      }
    }).catch(error => {
      console.error('Failed to load users', error)
      loadError.value = 'Gagal memuat data pengguna.'
    }).finally(() => {
      loading.value = false
    })
  }

  function openCreateDialog (): void {
    createDialog.value = true
  }

  function openEditDialog (user: User): void {
    const id = user.id

    loadingUserId.value = id

    fetchUserDetailApi(id).then(response => {
      selectedUser.value = response.data.data
      editDialog.value = true
    }).catch(error => {
      console.error('Failed to load user detail', error)
    }).finally(() => {
      loadingUserId.value = null
    })
  }

  function openStatusDialog (user: User): void {
    selectedUser.value = user
    statusDialog.value = true
  }

  function openDeleteDialog (user: User): void {
    selectedUser.value = user
    deleteDialog.value = true
  }

  function onUserCreated (_user: User): void {
    formErrors.value = []
    loadUsers()
    appStore.showSuccess('Pengguna berhasil dibuat.')
  }

  function onUserUpdated (_user: User): void {
    formErrors.value = []
    loadUsers()
    appStore.showSuccess('Pengguna berhasil diperbarui.')
  }

  function onFormFailed (errors: string[]): void {
    formErrors.value = errors
  }

  function confirmStatusChange (): void {
    if (!selectedUser.value) {
      return
    }

    const id = selectedUser.value.id
    const nextStatus = !selectedUser.value.status

    loadingUserId.value = id

    updateUserStatusApi(id, {
      status: nextStatus,
    }).then(() => {
      loadUsers()
      appStore.showSuccess('Status pengguna berhasil diperbarui.')
    }).catch(error => {
      console.error('Failed to update user status', error)
    }).finally(() => {
      loadingUserId.value = null
    })
  }

  function confirmDelete (): void {
    if (!selectedUser.value) {
      return
    }

    const id = selectedUser.value.id

    loadingUserId.value = id

    deleteUserApi(id).then(() => {
      deleteDialog.value = false
      selectedUser.value = null
      loadUsers()
      appStore.showSuccess('Pengguna berhasil dihapus.')
    }).catch(error => {
      console.error('Failed to delete user', error)
    }).finally(() => {
      loadingUserId.value = null
    })
  }

  return {
    users,
    usersMeta,
    loading,
    loadError,
    search,
    formErrors,
    page,
    itemsPerPage,
    sortBy,
    createDialog,
    editDialog,
    statusDialog,
    deleteDialog,
    selectedUser,
    loadingUserId,
    itemsLength,
    statusDialogTitle,
    statusDialogMessage,
    deleteDialogTitle,
    deleteDialogMessage,
    getUserFromTableItem,
    refreshPage,
    loadUsers,
    openCreateDialog,
    openEditDialog,
    openStatusDialog,
    openDeleteDialog,
    onUserCreated,
    onUserUpdated,
    onFormFailed,
    confirmStatusChange,
    confirmDelete,
  }
}
