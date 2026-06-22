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
            Manajemen Skills
          </div>
          <div class="text-body-2 text-medium-emphasis">
            Kelola grup skill dan daftar skill untuk ditampilkan di halaman About.
          </div>
        </div>

        <div class="mb-3">
          <v-text-field
            v-model="search"
            clearable
            density="compact"
            hide-details
            name="skills_search"
            placeholder="Cari skill"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            @change="refreshPage"
            @click:clear="refreshPage"
          />
        </div>

        <div class="d-flex flex-wrap ga-3">
          <v-btn
            color="primary"
            data-test="export-skills"
            :disabled="importLoading"
            :loading="exportLoading"
            variant="outlined"
            @click="exportSkillsTemplate"
          >
            <v-icon
              icon="mdi-download"
              start
            />
            Sample Excel
          </v-btn>

          <v-btn
            color="primary"
            data-test="import-skills"
            :disabled="exportLoading"
            :loading="importLoading"
            variant="outlined"
            @click="openImportDialog"
          >
            <v-icon
              icon="mdi-upload"
              start
            />
            Import Excel
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
            data-test="add-skill-group"
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
          data-test="skills-import-note"
          density="comfortable"
          type="info"
          variant="tonal"
        >
          Catatan import: <strong>skill_groups.code</strong> dan <strong>skills.group_code</strong>
          harus mengacu ke kode yang sama. Spasi pada field code akan diabaikan, lalu sistem
          membaca <strong>code</strong> dan <strong>group_code</strong> dalam lowercase.
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
          <SkillMobileListCard
            v-if="smAndDown"
            v-model="skillGroups"
            :format-skills-preview="formatSkillsPreview"
            :is-sort-disabled="isSortDisabled"
            :loading-skill-group-id="loadingSkillGroupId"
            @delete="openDeleteDialog"
            @drag-end="onDragEnd"
            @drag-start="onDragStart"
            @edit="openEditDialog"
            @toggle-status="openStatusDialog"
          />

          <SkillDesktopTableCard
            v-else
            v-model="skillGroups"
            :format-skills-preview="formatSkillsPreview"
            :is-sort-disabled="isSortDisabled"
            :loading-skill-group-id="loadingSkillGroupId"
            @delete="openDeleteDialog"
            @drag-end="onDragEnd"
            @drag-start="onDragStart"
            @edit="openEditDialog"
            @toggle-status="openStatusDialog"
          />
        </template>
      </v-col>
    </v-row>

    <SkillFormDialog
      v-model="createDialog"
      mode="create"
      @created="onSkillCreated"
      @failed="onFormFailed"
    />

    <SkillFormDialog
      v-model="editDialog"
      mode="edit"
      :skill="selectedSkillGroup"
      @failed="onFormFailed"
      @updated="onSkillUpdated"
    />

    <SkillImportDialog
      v-model="importDialog"
      :error-message="importErrorMessage"
      :loading="importLoading"
      :selected-file="selectedImportFile"
      @clear-file="clearSelectedImportFile"
      @confirm="confirmImportSkills"
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
      confirm-text="Ya"
      :message="statusDialogMessage"
      :title="statusDialogTitle"
      @confirm="confirmStatusChange"
    />
  </v-container>
</template>

<script lang="ts" setup>
  import { useDisplay } from 'vuetify'
  import ConfirmDialog from '@/components/ConfirmDialog.vue'
  import SkillDesktopTableCard from '@/components/skill/SkillDesktopTableCard.vue'
  import SkillFormDialog from '@/components/skill/SkillFormDialog.vue'
  import SkillImportDialog from '@/components/skill/SkillImportDialog.vue'
  import SkillMobileListCard from '@/components/skill/SkillMobileListCard.vue'
  import { useSkillsPage } from '@/logic/skills/use-skills-page'

  const { smAndDown } = useDisplay()

  const {
    skillGroups,
    loading,
    loadError,
    search,
    formErrors,
    sortLoading,
    sortError,
    exportLoading,
    importLoading,
    importDialog,
    selectedImportFile,
    importErrorMessage,
    createDialog,
    editDialog,
    deleteDialog,
    statusDialog,
    selectedSkillGroup,
    loadingSkillGroupId,
    isSearchActive,
    isSortDisabled,
    deleteDialogTitle,
    deleteDialogMessage,
    statusDialogTitle,
    statusDialogMessage,
    refreshPage,
    openCreateDialog,
    openEditDialog,
    openDeleteDialog,
    openStatusDialog,
    onSkillCreated,
    onSkillUpdated,
    onFormFailed,
    confirmDelete,
    confirmStatusChange,
    onDragStart,
    onDragEnd,
    saveSort,
    exportSkillsTemplate,
    openImportDialog,
    selectImportFile,
    clearSelectedImportFile,
    confirmImportSkills,
    formatSkillsPreview,
  } = useSkillsPage()
</script>
