<template>
  <v-tooltip location="bottom" text="Undo">
    <template #activator="{ props: tooltipProps }">
      <v-btn
        v-bind="tooltipProps"
        :disabled="props.disabled || !canUndo"
        icon
        size="small"
        variant="text"
        @click="onUndo"
      >
        <v-icon icon="mdi-undo" />
      </v-btn>
    </template>
  </v-tooltip>
  <v-tooltip location="bottom" text="Redo">
    <template #activator="{ props: tooltipProps }">
      <v-btn
        v-bind="tooltipProps"
        :disabled="props.disabled || !canRedo"
        icon
        size="small"
        variant="text"
        @click="onRedo"
      >
        <v-icon icon="mdi-redo" />
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

  const canUndo = computed(() => props.editor?.can().chain().focus().undo().run() === true)
  const canRedo = computed(() => props.editor?.can().chain().focus().redo().run() === true)

  function onUndo (): void {
    props.editor?.chain().focus().undo().run()
  }

  function onRedo (): void {
    props.editor?.chain().focus().redo().run()
  }
</script>
