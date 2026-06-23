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
            Manajemen Experience
          </div>
          <div class="text-body-2 text-medium-emphasis">
            Kelola pengalaman kerja yang akan ditampilkan di landing page.
          </div>
        </div>

        <div class="mb-3">
          <v-text-field
            v-model="search"
            clearable
            density="compact"
            hide-details
            name="experiences_search"
            placeholder="Cari experience"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            @change="refreshPage"
            @click:clear="clearSearch"
          />
        </div>

        <div class="d-flex flex-wrap ga-3">
          <v-btn
            color="primary"
            data-test="download-experience-import-sample"
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
            data-test="import-experiences"
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
            color="primary"
            data-test="add-experience"
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
          data-test="experiences-import-note"
          density="comfortable"
          type="info"
          variant="tonal"
        >
          Catatan import: file harus <strong>.json</strong> dengan root object
          <strong>experiences</strong>. Field tanggal memakai format <strong>YYYY-MM-01</strong>,
          dan jika <strong>is_current</strong> bernilai true maka <strong>end_date</strong> harus null.
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
          <ExperienceMobileListCard
            v-if="smAndDown"
            v-model="experiences"
            :format-years="formatYears"
            :is-sort-disabled="isSortDisabled"
            :loading-experience-id="loadingExperienceId"
            @delete="openDeleteDialog"
            @drag-end="onDragEnd"
            @drag-start="onDragStart"
            @edit="openEditDialog"
            @toggle-status="openStatusDialog"
          />

          <ExperienceDesktopTableCard
            v-else
            v-model="experiences"
            :format-years="formatYears"
            :is-sort-disabled="isSortDisabled"
            :loading-experience-id="loadingExperienceId"
            @delete="openDeleteDialog"
            @drag-end="onDragEnd"
            @drag-start="onDragStart"
            @edit="openEditDialog"
            @toggle-status="openStatusDialog"
          />
        </template>
      </v-col>
    </v-row>

    <ExperienceFormDialog
      v-model="createDialog"
      mode="create"
      @created="onExperienceCreated"
      @failed="onFormFailed"
    />

    <ExperienceFormDialog
      v-model="editDialog"
      :experience="selectedExperience"
      mode="edit"
      @failed="onFormFailed"
      @updated="onExperienceUpdated"
    />

    <ExperienceImportDialog
      v-model="importDialog"
      :error-message="importErrorMessage"
      :loading="importLoading"
      :selected-file="selectedImportFile"
      @clear-file="clearSelectedImportFile"
      @confirm="confirmImportExperiences"
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
  import ExperienceDesktopTableCard from '@/components/experience/ExperienceDesktopTableCard.vue'
  import ExperienceFormDialog from '@/components/experience/ExperienceFormDialog.vue'
  import ExperienceImportDialog from '@/components/experience/ExperienceImportDialog.vue'
  import ExperienceMobileListCard from '@/components/experience/ExperienceMobileListCard.vue'
  import { useExperiencesPage } from '@/logic/experiences/use-experiences-page'

  const { smAndDown } = useDisplay()

  const {
    experiences,
    loading,
    loadError,
    search,
    formErrors,
    sampleLoading,
    importLoading,
    importDialog,
    selectedImportFile,
    importErrorMessage,
    sortLoading,
    sortError,
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
    downloadImportSample,
    openImportDialog,
    selectImportFile,
    clearSelectedImportFile,
    confirmImportExperiences,
    formatYears,
  } = useExperiencesPage()
</script>
