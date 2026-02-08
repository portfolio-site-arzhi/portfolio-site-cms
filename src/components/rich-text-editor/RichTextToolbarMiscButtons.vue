<template>
  <v-tooltip location="bottom" text="Garis horizontal">
    <template #activator="{ props: tooltipProps }">
      <v-btn
        v-bind="tooltipProps"
        :disabled="props.disabled"
        icon
        size="small"
        variant="text"
        @click="insertHorizontalRule"
      >
        <v-icon icon="mdi-minus" />
      </v-btn>
    </template>
  </v-tooltip>
  <v-tooltip location="bottom" text="Bersihkan format">
    <template #activator="{ props: tooltipProps }">
      <v-btn
        v-bind="tooltipProps"
        :disabled="props.disabled"
        icon
        size="small"
        variant="text"
        @click="clearFormatting"
      >
        <v-icon icon="mdi-format-clear" />
      </v-btn>
    </template>
  </v-tooltip>
</template>

<script lang="ts" setup>
  import type { Editor } from '@tiptap/core'

  const props = defineProps<{
    editor: Editor | null
    disabled: boolean
  }>()

  function insertHorizontalRule (): void {
    props.editor?.chain().focus().setHorizontalRule().run()
  }

  function clearFormatting (): void {
    props.editor?.chain().focus().unsetAllMarks().clearNodes().run()
  }
</script>
