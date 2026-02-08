<template>
  <v-menu :disabled="props.disabled" location="bottom start">
    <template #activator="{ props: menuProps }">
      <v-tooltip location="bottom" :text="`Format: ${activeBlockLabel}`">
        <template #activator="{ props: tooltipProps }">
          <v-btn
            v-bind="{ ...menuProps, ...tooltipProps }"
            :disabled="props.disabled"
            icon
            size="small"
            variant="text"
          >
            <v-icon :icon="activeBlockIcon" />
          </v-btn>
        </template>
      </v-tooltip>
    </template>

    <v-list density="compact">
      <v-list-item @click="setParagraph">
        <v-list-item-title>Paragraph</v-list-item-title>
      </v-list-item>
      <v-divider />
      <v-list-item @click="setHeading(1)">
        <v-list-item-title>Heading 1</v-list-item-title>
      </v-list-item>
      <v-list-item @click="setHeading(2)">
        <v-list-item-title>Heading 2</v-list-item-title>
      </v-list-item>
      <v-list-item @click="setHeading(3)">
        <v-list-item-title>Heading 3</v-list-item-title>
      </v-list-item>
      <v-list-item @click="setHeading(4)">
        <v-list-item-title>Heading 4</v-list-item-title>
      </v-list-item>
      <v-list-item @click="setHeading(5)">
        <v-list-item-title>Heading 5</v-list-item-title>
      </v-list-item>
      <v-list-item @click="setHeading(6)">
        <v-list-item-title>Heading 6</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts" setup>
  import type { Editor } from '@tiptap/core'

  const props = defineProps<{
    editor: Editor | null
    disabled: boolean
  }>()

  const activeBlockLabel = computed(() => {
    if (!props.editor) {
      return 'Format'
    }

    if (props.editor.isActive('heading', { level: 1 })) {
      return 'Heading 1'
    }
    if (props.editor.isActive('heading', { level: 2 })) {
      return 'Heading 2'
    }
    if (props.editor.isActive('heading', { level: 3 })) {
      return 'Heading 3'
    }
    if (props.editor.isActive('heading', { level: 4 })) {
      return 'Heading 4'
    }
    if (props.editor.isActive('heading', { level: 5 })) {
      return 'Heading 5'
    }
    if (props.editor.isActive('heading', { level: 6 })) {
      return 'Heading 6'
    }
    if (props.editor.isActive('bulletList')) {
      return 'Bullet list'
    }
    if (props.editor.isActive('orderedList')) {
      return 'Numbered list'
    }
    if (props.editor.isActive('blockquote')) {
      return 'Quote'
    }
    if (props.editor.isActive('codeBlock')) {
      return 'Code block'
    }

    return 'Paragraph'
  })

  const activeBlockIcon = computed(() => {
    if (!props.editor) {
      return 'mdi-format-paragraph'
    }

    if (props.editor.isActive('heading', { level: 1 })) {
      return 'mdi-format-header-1'
    }
    if (props.editor.isActive('heading', { level: 2 })) {
      return 'mdi-format-header-2'
    }
    if (props.editor.isActive('heading', { level: 3 })) {
      return 'mdi-format-header-3'
    }
    if (props.editor.isActive('heading', { level: 4 })) {
      return 'mdi-format-header-4'
    }
    if (props.editor.isActive('heading', { level: 5 })) {
      return 'mdi-format-header-5'
    }
    if (props.editor.isActive('heading', { level: 6 })) {
      return 'mdi-format-header-6'
    }

    return 'mdi-format-paragraph'
  })

  function setParagraph (): void {
    props.editor?.chain().focus().setParagraph().run()
  }

  function setHeading (level: 1 | 2 | 3 | 4 | 5 | 6): void {
    props.editor?.chain().focus().toggleHeading({ level }).run()
  }
</script>
