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
            Manajemen Certification
          </div>
          <div class="text-body-2 text-medium-emphasis">
            Kelola data certification yang akan ditampilkan di landing page.
          </div>
        </div>

        <div class="d-flex flex-column flex-sm-row">
          <v-text-field
            v-model="search"
            class="mb-3 mb-sm-0 mr-sm-4"
            clearable
            density="compact"
            hide-details
            placeholder="Cari certification"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            @change="refreshPage"
            @click:clear="refreshPage"
          />

          <v-btn
            class="align-self-sm-start mb-3 mb-sm-0 mr-sm-3"
            color="primary"
            data-test="save-sort"
            :disabled="isSortDisabled"
            :loading="sortLoading"
            variant="outlined"
            @click="saveSort"
          >
            <v-icon
              icon="mdi-content-save"
              start
            />
            Simpan Urutan
          </v-btn>

          <v-btn
            class="align-self-sm-start"
            color="primary"
            data-test="add-certification"
            variant="flat"
            @click="openCreateDialog"
          >
            <v-icon
              icon="mdi-plus"
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

        <v-alert
          v-if="sortError"
          class="mb-4"
          density="comfortable"
          type="error"
          variant="tonal"
        >
          {{ sortError }}
        </v-alert>

        <v-alert
          v-if="isSearchActive"
          class="mb-4"
          density="comfortable"
          type="info"
          variant="tonal"
        >
          Sorting dinonaktifkan saat pencarian aktif. Hapus kata kunci untuk mengubah urutan.
        </v-alert>

        <v-skeleton-loader
          v-if="loading"
          type="table"
        />

        <template v-else>
          <CertificationMobileListCard
            v-if="smAndDown"
            v-model="certifications"
            :format-issue-date="formatIssueDate"
            :is-sort-disabled="isSortDisabled"
            :loading-certification-id="loadingCertificationId"
            @delete="openDeleteDialog"
            @drag-end="onDragEnd"
            @drag-start="onDragStart"
            @edit="openEditDialog"
            @toggle-status="openStatusDialog"
          />

          <CertificationDesktopTableCard
            v-else
            v-model="certifications"
            :format-issue-date="formatIssueDate"
            :is-sort-disabled="isSortDisabled"
            :loading-certification-id="loadingCertificationId"
            @delete="openDeleteDialog"
            @drag-end="onDragEnd"
            @drag-start="onDragStart"
            @edit="openEditDialog"
            @toggle-status="openStatusDialog"
          />
        </template>
      </v-col>
    </v-row>

    <CertificationFormDialog
      v-model="createDialog"
      mode="create"
      @created="onCertificationCreated"
      @failed="onFormFailed"
    />

    <CertificationFormDialog
      v-model="editDialog"
      :certification="selectedCertification"
      mode="edit"
      @failed="onFormFailed"
      @updated="onCertificationUpdated"
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

    <ConfirmDialog
      v-model="statusDialog"
      cancel-text="Batal"
      confirm-color="primary"
      confirm-text="Ya"
      :message="statusDialogMessage"
      :title="statusDialogTitle"
      @confirm="confirmStatusChange"
    />
  </v-container>
</template>

<script lang="ts" setup>
  import { useDisplay } from 'vuetify'
  import CertificationDesktopTableCard from '@/components/certification/CertificationDesktopTableCard.vue'
  import CertificationFormDialog from '@/components/certification/CertificationFormDialog.vue'
  import CertificationMobileListCard from '@/components/certification/CertificationMobileListCard.vue'
  import ConfirmDialog from '@/components/ConfirmDialog.vue'
  import { useCertificationsPage } from '@/logic/certifications/use-certifications-page'

  const { smAndDown } = useDisplay()

  const {
    certifications,
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
  } = useCertificationsPage()

  onMounted(() => {
    loadCertifications()
  })
</script>
