<template>
  <v-tooltip location="bottom" text="Bold">
    <template #activator="{ props: tooltipProps }">
      <v-btn
        v-bind="tooltipProps"
        :active="isActive('bold')"
        :color="isActive('bold') ? 'primary' : undefined"
        :disabled="props.disabled"
        icon
        size="small"
        variant="text"
        @click="toggleBold"
      >
        <v-icon icon="mdi-format-bold" />
      </v-btn>
    </template>
  </v-tooltip>
  <v-tooltip location="bottom" text="Italic">
    <template #activator="{ props: tooltipProps }">
      <v-btn
        v-bind="tooltipProps"
        :active="isActive('italic')"
        :color="isActive('italic') ? 'primary' : undefined"
        :disabled="props.disabled"
        icon
        size="small"
        variant="text"
        @click="toggleItalic"
      >
        <v-icon icon="mdi-format-italic" />
      </v-btn>
    </template>
  </v-tooltip>
  <v-tooltip location="bottom" text="Underline">
    <template #activator="{ props: tooltipProps }">
      <v-btn
        v-bind="tooltipProps"
        :active="isActive('underline')"
        :color="isActive('underline') ? 'primary' : undefined"
        :disabled="props.disabled"
        icon
        size="small"
        variant="text"
        @click="toggleUnderline"
      >
        <v-icon icon="mdi-format-underline" />
      </v-btn>
    </template>
  </v-tooltip>
  <v-tooltip location="bottom" text="Strikethrough">
    <template #activator="{ props: tooltipProps }">
      <v-btn
        v-bind="tooltipProps"
        :active="isActive('strike')"
        :color="isActive('strike') ? 'primary' : undefined"
        :disabled="props.disabled"
        icon
        size="small"
        variant="text"
        @click="toggleStrike"
      >
        <v-icon icon="mdi-format-strikethrough-variant" />
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

  function isActive (name: string): boolean {
    return props.editor?.isActive(name) === true
  }

  function toggleBold (): void {
    props.editor?.chain().focus().toggleBold().run()
  }

  function toggleItalic (): void {
    props.editor?.chain().focus().toggleItalic().run()
  }

  function toggleUnderline (): void {
    props.editor?.chain().focus().toggleUnderline().run()
  }

  function toggleStrike (): void {
    props.editor?.chain().focus().toggleStrike().run()
  }
</script>
