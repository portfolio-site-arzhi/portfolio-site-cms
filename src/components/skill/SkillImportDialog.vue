<template>
  <v-dialog
    v-model="internalModel"
    max-width="560"
    :persistent="loading"
  >
    <v-card>
      <v-card-title class="text-h6">
        Import Excel Skills
      </v-card-title>

      <v-card-text>
        <div class="text-body-2 text-medium-emphasis mb-4">
          Pilih file Excel terlebih dahulu, lalu klik tombol import untuk menjalankan proses upload.
        </div>

        <div
          class="skill-import-dropzone"
          :class="{
            'skill-import-dropzone--active': isDragging,
            'skill-import-dropzone--disabled': loading,
          }"
          data-test="skill-import-dropzone"
          role="button"
          tabindex="0"
          @click="onDropzoneClick"
          @dragenter.prevent="onDragEnter"
          @dragleave.prevent="onDragLeave"
          @dragover.prevent="onDragOver"
          @drop.prevent="onDrop"
          @keydown.enter.prevent="onDropzoneClick"
          @keydown.space.prevent="onDropzoneClick"
        >
          <v-icon
            class="mb-3"
            color="primary"
            icon="mdi-file-excel"
            size="40"
          />

          <div class="text-subtitle-1 font-weight-medium mb-1">
            Tarik dan lepas file Excel di sini
          </div>

          <div class="text-body-2 text-medium-emphasis mb-4">
            atau klik area ini untuk memilih file berformat .xlsx
          </div>

          <v-btn
            color="primary"
            :disabled="loading"
            prepend-icon="mdi-upload"
            variant="outlined"
            @click.stop="openPicker"
          >
            Pilih File
          </v-btn>
        </div>

        <input
          ref="fileInput"
          accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          class="d-none"
          data-test="skills-import-input"
          name="skills_import_file"
          type="file"
          @change="onFileChange"
        >

        <v-alert
          v-if="selectedFile"
          class="mt-4"
          density="comfortable"
          type="success"
          variant="tonal"
        >
          <div class="d-flex flex-wrap align-center justify-space-between ga-2">
            <span class="text-body-2">
              File terpilih: <strong>{{ selectedFile.name }}</strong>
            </span>

            <v-btn
              color="secondary"
              :disabled="loading"
              size="small"
              variant="text"
              @click.stop="clearFile"
            >
              Hapus File
            </v-btn>
          </div>
        </v-alert>

        <v-alert
          v-if="errorMessage"
          class="mt-4"
          density="comfortable"
          type="error"
          variant="tonal"
        >
          {{ errorMessage }}
        </v-alert>
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn
          color="secondary"
          :disabled="loading"
          variant="text"
          @click="internalModel = false"
        >
          Batal
        </v-btn>

        <v-btn
          color="primary"
          :disabled="!selectedFile || loading"
          :loading="loading"
          variant="flat"
          @click="emit('confirm')"
        >
          Import
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
  import {
    type SkillImportDialogEmits,
    type SkillImportDialogProps,
    useSkillImportDialog,
  } from '@/logic/skills/use-skill-import-dialog'

  const props = defineProps<SkillImportDialogProps>()
  const emit = defineEmits<SkillImportDialogEmits>()

  const {
    fileInput,
    isDragging,
    internalModel,
    openPicker,
    onDropzoneClick,
    onFileChange,
    onDragEnter,
    onDragOver,
    onDragLeave,
    onDrop,
    clearFile,
  } = useSkillImportDialog({
    props,
    emit,
  })
</script>

<style scoped>
  .skill-import-dropzone {
    border: 1px dashed rgba(var(--v-border-color), var(--v-border-opacity));
    border-radius: 12px;
    background: rgb(var(--v-theme-surface));
    cursor: pointer;
    min-height: 220px;
    padding: 24px;
    text-align: center;
    transition: border-color 0.2s ease, background-color 0.2s ease, transform 0.2s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .skill-import-dropzone--active {
    border-color: rgb(var(--v-theme-primary));
    background: rgba(var(--v-theme-primary), 0.08);
    transform: translateY(-1px);
  }

  .skill-import-dropzone--disabled {
    cursor: not-allowed;
    opacity: 0.72;
  }
</style>
