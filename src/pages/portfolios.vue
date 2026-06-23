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
            Manajemen Portfolio
          </div>
          <div class="text-body-2 text-medium-emphasis">
            Kelola project portfolio yang akan ditampilkan di landing page.
          </div>
        </div>

        <div class="mb-3">
          <v-text-field
            v-model="search"
            clearable
            density="compact"
            hide-details
            name="portfolios_search"
            placeholder="Cari portfolio"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            @change="refreshPage"
            @click:clear="clearSearch"
          />
        </div>

        <div class="d-flex flex-wrap ga-3">
          <v-btn
            color="primary"
            data-test="download-portfolio-import-sample"
            :disabled="importLoading"
            :loading="sampleLoading"
            variant="outlined"
            @click="downloadImportSample"
          >
            <v-icon
              icon="mdi-download"
              start
            />
            Sample JSON
          </v-btn>

          <v-btn
            color="primary"
            data-test="import-portfolios"
            :disabled="sampleLoading"
            :loading="importLoading"
            variant="outlined"
            @click="openImportDialog"
          >
            <v-icon
              icon="mdi-upload"
              start
            />
            Import JSON
          </v-btn>

          <v-btn
            color="primary"
            data-test="save-portfolio-sort"
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
            color="primary"
            data-test="add-portfolio"
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

        <v-alert
          class="mt-3 mb-0"
          data-test="portfolios-import-note"
          density="comfortable"
          type="info"
          variant="tonal"
        >
          Catatan import: file harus <strong>.json</strong> dengan root object
          <strong>portfolios</strong>. Field <strong>image</strong> tidak ikut diimport,
          dan <strong>published_at</strong> memakai format <strong>ISO 8601</strong> atau
          <strong>null</strong>.
        </v-alert>
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
          <PortfolioMobileListCard
            v-if="smAndDown"
            v-model="portfolios"
            :format-description="formatDescription"
            :format-published-at="formatPublishedAt"
            :is-sort-disabled="isSortDisabled"
            :loading-portfolio-id="loadingPortfolioId"
            @delete="openDeleteDialog"
            @drag-end="onDragEnd"
            @drag-start="onDragStart"
            @edit="openEditDialog"
            @toggle-status="openStatusDialog"
          />

          <PortfolioDesktopTableCard
            v-else
            v-model="portfolios"
            :format-description="formatDescription"
            :format-published-at="formatPublishedAt"
            :is-sort-disabled="isSortDisabled"
            :loading-portfolio-id="loadingPortfolioId"
            @delete="openDeleteDialog"
            @drag-end="onDragEnd"
            @drag-start="onDragStart"
            @edit="openEditDialog"
            @toggle-status="openStatusDialog"
          />
        </template>
      </v-col>
    </v-row>

    <PortfolioFormDialog
      v-model="createDialog"
      mode="create"
      @created="onPortfolioCreated"
      @failed="onFormFailed"
    />

    <PortfolioFormDialog
      v-model="editDialog"
      mode="edit"
      :portfolio="selectedPortfolio"
      @failed="onFormFailed"
      @updated="onPortfolioUpdated"
    />

    <PortfolioImportDialog
      v-model="importDialog"
      :error-message="importErrorMessage"
      :loading="importLoading"
      :selected-file="selectedImportFile"
      @clear-file="clearSelectedImportFile"
      @confirm="confirmImportPortfolios"
      @select-file="selectImportFile"
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
      confirm-text="Ya, lanjutkan"
      :message="statusDialogMessage"
      :title="statusDialogTitle"
      @confirm="confirmStatusChange"
    />
  </v-container>
</template>

<script lang="ts" setup>
  import { useDisplay } from 'vuetify'
  import ConfirmDialog from '@/components/ConfirmDialog.vue'
  import PortfolioDesktopTableCard from '@/components/portfolio/PortfolioDesktopTableCard.vue'
  import PortfolioFormDialog from '@/components/portfolio/PortfolioFormDialog.vue'
  import PortfolioImportDialog from '@/components/portfolio/PortfolioImportDialog.vue'
  import PortfolioMobileListCard from '@/components/portfolio/PortfolioMobileListCard.vue'
  import { usePortfoliosPage } from '@/logic/portfolios/use-portfolios-page'

  const { smAndDown } = useDisplay()

  const {
    portfolios,
    loading,
    loadError,
    search,
    formErrors,
    sampleLoading,
    sortLoading,
    sortError,
    createDialog,
    editDialog,
    deleteDialog,
    statusDialog,
    importLoading,
    importDialog,
    selectedImportFile,
    importErrorMessage,
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
    downloadImportSample,
    openImportDialog,
    selectImportFile,
    clearSelectedImportFile,
    confirmImportPortfolios,
    formatPublishedAt,
    formatDescription,
  } = usePortfoliosPage()
</script>
