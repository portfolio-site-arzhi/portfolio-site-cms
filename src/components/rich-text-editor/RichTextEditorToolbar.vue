<template>
  <div class="rte-toolbar d-flex flex-wrap align-center ga-1 px-2 py-2">
    <RichTextToolbarHistoryButtons :disabled="isToolbarDisabled" :editor="props.editor" />

    <v-divider class="mx-1" vertical />

    <RichTextToolbarBlockMenu :disabled="isToolbarDisabled" :editor="props.editor" />

    <RichTextToolbarListButtons :disabled="isToolbarDisabled" :editor="props.editor" />

    <v-divider class="mx-1" vertical />

    <RichTextToolbarMarkButtons :disabled="isToolbarDisabled" :editor="props.editor" />

    <v-divider class="mx-1" vertical />

    <RichTextToolbarAlignButtons :disabled="isToolbarDisabled" :editor="props.editor" />

    <v-divider class="mx-1" vertical />

    <RichTextToolbarLinkButtons
      :disabled="isToolbarDisabled"
      :editor="props.editor"
      :readonly="props.readonly"
    />

    <v-divider class="mx-1" vertical />

    <RichTextToolbarMiscButtons :disabled="isToolbarDisabled" :editor="props.editor" />
  </div>
</template>

<script lang="ts" setup>
  import type { Editor } from '@tiptap/core'

  import RichTextToolbarAlignButtons from '@/components/rich-text-editor/RichTextToolbarAlignButtons.vue'
  import RichTextToolbarBlockMenu from '@/components/rich-text-editor/RichTextToolbarBlockMenu.vue'
  import RichTextToolbarHistoryButtons from '@/components/rich-text-editor/RichTextToolbarHistoryButtons.vue'
  import RichTextToolbarLinkButtons from '@/components/rich-text-editor/RichTextToolbarLinkButtons.vue'
  import RichTextToolbarListButtons from '@/components/rich-text-editor/RichTextToolbarListButtons.vue'
  import RichTextToolbarMarkButtons from '@/components/rich-text-editor/RichTextToolbarMarkButtons.vue'
  import RichTextToolbarMiscButtons from '@/components/rich-text-editor/RichTextToolbarMiscButtons.vue'

  const props = defineProps<{
    editor: Editor | null
    readonly: boolean
    disabled: boolean
  }>()

  const isToolbarDisabled = computed(() => props.disabled || props.readonly || !props.editor)
</script>
