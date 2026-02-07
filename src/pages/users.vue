<template>
  <v-container
    class="py-6"
    fluid
  >
    <v-row class="mb-4" no-gutters>
      <v-col
        class="mb-4"
        cols="12"
      >
        <div class="mb-4">
          <div class="text-h5 font-weight-medium mb-1">
            Manajemen Pengguna
          </div>
          <div class="text-body-2 text-medium-emphasis">
            Kelola akun pengguna yang memiliki akses ke CMS.
          </div>
        </div>

        <div class="d-flex flex-column flex-sm-row">
          <v-text-field
            v-model="search"
            class="mb-3 mb-sm-0 mr-sm-4"
            clearable
            density="compact"
            hide-details
            placeholder="Cari pengguna"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            @change="refreshPage"
            @click:clear="refreshPage"
          />

          <v-btn
            class="align-self-sm-start"
            color="primary"
            data-test="add-user"
            variant="flat"
            @click="openCreateDialog"
          >
            <v-icon
              icon="mdi-account-plus"
              start
            />
            Tambah
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-alert
          v-if="loadError"
          class="mb-4"
          density="comfortable"
          type="error"
          variant="tonal"
        >
          {{ loadError }}
        </v-alert>
        <v-alert
          v-if="formErrors.length > 0"
          class="mb-4"
          density="comfortable"
          type="error"
          variant="tonal"
        >
          <div
            v-for="err in formErrors"
            :key="err"
          >
            {{ err }}
          </div>
        </v-alert>

        <v-data-table-server
          v-model:items-per-page="itemsPerPage"
          v-model:page="page"
          v-model:sort-by="sortBy"
          density="compact"
          :headers="headers"
          item-key="id"
          :items="users"
          :items-length="itemsLength"
          :loading="loading"
          :mobile="smAndDown"
        >
          <template #item.status="{ value }">
            <v-chip
              :color="value ? 'success' : 'warning'"
              label
              size="small"
            >
              {{ value ? 'Aktif' : 'Nonaktif' }}
            </v-chip>
          </template>

          <template #item.actions="{ item }">
            <v-menu location="bottom end">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  :disabled="loadingUserId === getUserFromTableItem(item)?.id"
                  icon
                  :loading="loadingUserId === getUserFromTableItem(item)?.id"
                  variant="text"
                >
                  <v-icon icon="mdi-dots-vertical" />
                </v-btn>
              </template>

              <v-list density="compact">
                <v-list-item @click="getUserFromTableItem(item) && openEditDialog((getUserFromTableItem(item) as User))">
                  <v-list-item-title>
                    Edit
                  </v-list-item-title>
                </v-list-item>
                <v-list-item @click="getUserFromTableItem(item) && openStatusDialog((getUserFromTableItem(item) as User))">
                  <v-list-item-title>
                    {{ getUserFromTableItem(item)?.status ? 'Nonaktifkan' : 'Aktifkan' }}
                  </v-list-item-title>
                </v-list-item>
                <v-list-item @click="getUserFromTableItem(item) && openDeleteDialog((getUserFromTableItem(item) as User))">
                  <v-list-item-title class="text-error">
                    Hapus
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>

          <template #no-data>
            <div class="text-center text-medium-emphasis py-4">
              Belum ada data pengguna.
            </div>
          </template>
        </v-data-table-server>
      </v-col>
    </v-row>

    <UserFormDialog
      v-model="createDialog"
      mode="create"
      @created="onUserCreated"
      @failed="onFormFailed"
    />

    <UserFormDialog
      v-model="editDialog"
      mode="edit"
      :user="selectedUser"
      @failed="onFormFailed"
      @updated="onUserUpdated"
    />

    <ConfirmDialog
      v-model="statusDialog"
      cancel-text="Batal"
      confirm-color="primary"
      confirm-text="Ya, lanjutkan"
      :message="statusDialogMessage"
      :title="statusDialogTitle"
      @confirm="confirmStatusChange"
    />

    <ConfirmDialog
      v-model="deleteDialog"
      cancel-text="Batal"
      confirm-color="error"
      confirm-text="Ya, hapus"
      :message="deleteDialogMessage"
      :title="deleteDialogTitle"
      @confirm="confirmDelete"
    />
  </v-container>
</template>

<script lang="ts" setup>
  // Halaman user ini digunakan sebagai referensi pola komponen data-table server:
  // - Menggunakan v-data-table-server dengan pagination, sorting, dan pencarian server-side
  // - Pencarian menggunakan @change dan @click:clear yang memanggil refreshPage
  // - Aksi penting seperti ubah status dan hapus memakai ConfirmDialog reusable
  // - Pemanggilan API menggunakan Promise chain (.then/.catch/.finally) sesuai aturan proyek

  import type { User, UsersListMeta } from '@/model/user'
  import { useDisplay } from 'vuetify'
  import { deleteUserApi, fetchUserDetailApi, fetchUsersApi, updateUserStatusApi } from '@/api/user-service'
  import ConfirmDialog from '@/components/ConfirmDialog.vue'
  import UserFormDialog from '@/components/user/UserFormDialog.vue'
  import { USERS_TABLE_HEADERS } from '@/constants/user.constant'
  import { useAppStore } from '@/stores/app'

  const { smAndDown } = useDisplay()
  const appStore = useAppStore()

  const users = ref<User[]>([])
  const usersMeta = ref<UsersListMeta | null>(null)
  const loading = ref(false)
  const loadError = ref<string | null>(null)
  const search = ref('')
  const formErrors = ref<string[]>([])

  const page = ref(1)
  const itemsPerPage = ref(10)
  const sortBy = ref<Array<{ key: string, order?: 'asc' | 'desc' }>>([])

  const createDialog = ref(false)
  const editDialog = ref(false)
  const statusDialog = ref(false)
  const deleteDialog = ref(false)

  const selectedUser = ref<User | null>(null)
  const loadingUserId = ref<number | null>(null)

  const headers = USERS_TABLE_HEADERS

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
    const params = {
      page: page.value,
      page_size: itemsPerPage.value,
      search: search.value ? search.value.trim() : null,
    } as {
      page?: number
      page_size?: number
      search?: string | null
      order_field?: 'email' | 'name' | 'status' | 'created_at' | 'updated_at'
      order_dir?: 'asc' | 'desc'
    }

    if (sortBy.value.length > 0) {
      const primarySort = sortBy.value[0]

      if (primarySort && primarySort.key) {
        params.order_field = primarySort.key as 'email' | 'name' | 'status' | 'created_at' | 'updated_at'
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
</script>
