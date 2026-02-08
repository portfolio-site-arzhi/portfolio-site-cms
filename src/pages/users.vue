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
            <UserActionsMenu
              :loading-user-id="loadingUserId"
              :user="getUserFromTableItem(item)"
              @delete="openDeleteDialog"
              @edit="openEditDialog"
              @toggle-status="openStatusDialog"
            />
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
  import { useDisplay } from 'vuetify'
  import { USERS_TABLE_HEADERS } from '@/constants/user.constant'
  import { useUsersPage } from '@/logic/users/use-users-page'

  const { smAndDown } = useDisplay()

  const headers = USERS_TABLE_HEADERS

  const {
    users,
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
    openCreateDialog,
    openEditDialog,
    openStatusDialog,
    openDeleteDialog,
    onUserCreated,
    onUserUpdated,
    onFormFailed,
    confirmStatusChange,
    confirmDelete,
  } = useUsersPage()
</script>
