<template>
  <v-tooltip location="bottom" text="Tambah/Edit link">
    <template #activator="{ props: tooltipProps }">
      <v-btn
        v-bind="tooltipProps"
        :active="isActive('link')"
        :color="isActive('link') ? 'primary' : undefined"
        :disabled="props.disabled"
        icon
        size="small"
        variant="text"
        @click="openLinkDialog"
      >
        <v-icon icon="mdi-link-variant" />
      </v-btn>
    </template>
  </v-tooltip>
  <v-tooltip location="bottom" text="Hapus link">
    <template #activator="{ props: tooltipProps }">
      <v-btn
        v-bind="tooltipProps"
        :disabled="props.disabled || !isActive('link')"
        icon
        size="small"
        variant="text"
        @click="removeLink"
      >
        <v-icon icon="mdi-link-variant-off" />
      </v-btn>
    </template>
  </v-tooltip>

  <v-dialog
    v-model="linkDialog"
    max-width="520"
  >
    <v-card>
      <v-card-title class="text-h6">
        Link
      </v-card-title>

      <v-card-text>
        <v-text-field
          ref="linkUrlField"
          v-model="linkUrl"
          :bg-color="props.readonly ? 'grey-lighten-3' : undefined"
          density="compact"
          :disabled="props.disabled"
          :error="linkError !== null"
          :error-messages="linkError ? [linkError] : []"
          hide-details="auto"
          label="URL"
          name="rich_text_editor_link_url"
          placeholder="https://example.com"
          variant="outlined"
          @keydown.enter.prevent="applyLink"
          @keydown.esc.prevent="closeLinkDialog"
        />
        <div class="text-caption text-medium-emphasis mt-2">
          Kosongkan URL untuk menghapus link dari selection.
        </div>
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn
          color="secondary"
          variant="text"
          @click="closeLinkDialog"
        >
          Batal
        </v-btn>
        <v-btn
          color="primary"
          :disabled="props.disabled"
          variant="flat"
          @click="applyLink"
        >
          Terapkan
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
  import type { Editor } from '@tiptap/core'
  import { useRichTextToolbarLinkButtons } from '@/logic/rich-text-editor/use-rich-text-toolbar-link-buttons'

  const props = defineProps<{
    editor: Editor | null
    readonly: boolean
    disabled: boolean
  }>()

  const {
    linkDialog,
    linkUrl,
    linkError,
    linkUrlField,
    isActive,
    openLinkDialog,
    closeLinkDialog,
    applyLink,
    removeLink,
  } = useRichTextToolbarLinkButtons(props)
</script>
