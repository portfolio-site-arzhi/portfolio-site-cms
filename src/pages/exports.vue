<template>
  <v-container
    class="py-6"
    fluid
  >
    <v-row class="mb-4">
      <v-col cols="12">
        <div class="mb-4">
          <div class="text-h5 font-weight-medium mb-1">
            Export Dokumen
          </div>
          <div class="text-body-2 text-medium-emphasis">
            Unduh CV ATS dan detail portfolio dalam format PDF dari satu halaman.
          </div>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col
        v-for="documentOption in documentOptions"
        :key="documentOption.type"
        cols="12"
        md="6"
      >
        <ExportActionCard
          :button-icon="documentOption.buttonIcon"
          :button-text="documentOption.buttonText"
          :data-test="`export-${documentOption.type}`"
          :description="documentOption.description"
          :disabled="isDocumentDisabled(documentOption.type)"
          :helper-text="documentOption.helperText"
          :icon="documentOption.icon"
          :loading="isDocumentLoading(documentOption.type)"
          :title="documentOption.title"
          @export="exportDocument(documentOption.type)"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
  import ExportActionCard from '@/components/export/ExportActionCard.vue'
  import { useExportsPage } from '@/logic/exports/use-exports-page'

  const {
    exportingType,
    documentOptions,
    exportLocale,
    isExporting,
    isDocumentLoading,
    isDocumentDisabled,
    exportDocument,
  } = useExportsPage()

  defineExpose({
    exportingType,
    exportLocale,
    isExporting,
    exportDocument,
  })
</script>
