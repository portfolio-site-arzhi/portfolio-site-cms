<template>
  <v-tooltip location="bottom" text="Bullet list">
    <template #activator="{ props: tooltipProps }">
      <v-btn
        v-bind="tooltipProps"
        :active="isActive('bulletList')"
        :color="isActive('bulletList') ? 'primary' : undefined"
        :disabled="props.disabled"
        icon
        size="small"
        variant="text"
        @click="toggleBulletList"
      >
        <v-icon icon="mdi-format-list-bulleted" />
      </v-btn>
    </template>
  </v-tooltip>

  <v-tooltip location="bottom" text="Numbered list">
    <template #activator="{ props: tooltipProps }">
      <v-btn
        v-bind="tooltipProps"
        :active="isActive('orderedList')"
        :color="isActive('orderedList') ? 'primary' : undefined"
        :disabled="props.disabled"
        icon
        size="small"
        variant="text"
        @click="toggleOrderedList"
      >
        <v-icon icon="mdi-format-list-numbered" />
      </v-btn>
    </template>
  </v-tooltip>

  <v-tooltip location="bottom" text="Quote">
    <template #activator="{ props: tooltipProps }">
      <v-btn
        v-bind="tooltipProps"
        :active="isActive('blockquote')"
        :color="isActive('blockquote') ? 'primary' : undefined"
        :disabled="props.disabled"
        icon
        size="small"
        variant="text"
        @click="toggleBlockquote"
      >
        <v-icon icon="mdi-format-quote-close" />
      </v-btn>
    </template>
  </v-tooltip>

  <v-tooltip location="bottom" text="Code block">
    <template #activator="{ props: tooltipProps }">
      <v-btn
        v-bind="tooltipProps"
        :active="isActive('codeBlock')"
        :color="isActive('codeBlock') ? 'primary' : undefined"
        :disabled="props.disabled"
        icon
        size="small"
        variant="text"
        @click="toggleCodeBlock"
      >
        <v-icon icon="mdi-code-tags" />
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

  function toggleBulletList (): void {
    props.editor?.chain().focus().toggleBulletList().run()
  }

  function toggleOrderedList (): void {
    props.editor?.chain().focus().toggleOrderedList().run()
  }

  function toggleBlockquote (): void {
    props.editor?.chain().focus().toggleBlockquote().run()
  }

  function toggleCodeBlock (): void {
    props.editor?.chain().focus().toggleCodeBlock().run()
  }
</script>
