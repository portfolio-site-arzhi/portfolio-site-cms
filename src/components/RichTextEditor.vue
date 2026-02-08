<template>
  <div class="rte-root">
    <div
      v-if="label"
      class="text-subtitle-2 mb-2"
    >
      {{ label }}
    </div>

    <div
      class="rte-shell"
      :class="{
        'rte-shell--error': errorMessages.length > 0,
        'rte-shell--readonly': readonly,
      }"
    >
      <RichTextEditorToolbar
        :disabled="disabled"
        :editor="editor ?? null"
        :readonly="readonly"
      />

      <div
        class="rte-surface px-3 py-2"
        @click="focusEditor"
      >
        <editor-content :editor="editor" />
      </div>
    </div>

    <div
      v-if="errorMessages.length > 0"
      class="text-caption text-error mt-1"
    >
      {{ errorMessages[0] }}
    </div>
  </div>
</template>

<script lang="ts" setup>
  import Placeholder from '@tiptap/extension-placeholder'
  import TextAlign from '@tiptap/extension-text-align'
  import StarterKit from '@tiptap/starter-kit'
  import { EditorContent, useEditor } from '@tiptap/vue-3'
  import RichTextEditorToolbar from '@/components/rich-text-editor/RichTextEditorToolbar.vue'

  const props = defineProps<{
    modelValue: string
    label?: string
    placeholder?: string
    readonly?: boolean
    disabled?: boolean
    errorMessages?: string[]
  }>()

  const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
  }>()

  const readonly = computed(() => props.readonly === true)
  const disabled = computed(() => props.disabled === true)
  const errorMessages = computed(() => props.errorMessages ?? [])

  const editor = useEditor({
    content: props.modelValue ?? '<p></p>',
    extensions: [
      StarterKit.configure({
        link: {
          openOnClick: false,
          HTMLAttributes: {
            rel: 'noopener noreferrer',
            target: '_blank',
          },
          isAllowedUri: (url, ctx) => {
            if (/^javascript:/i.test(url)) {
              return false
            }
            return ctx.defaultValidate(url)
          },
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder: props.placeholder ?? 'Tulis sesuatu…',
      }),
    ],
    editable: !(readonly.value || disabled.value),
    onUpdate ({ editor }) {
      emit('update:modelValue', editor.getHTML())
    },
  })

  watch(
    () => [props.modelValue, readonly.value, disabled.value] as const,
    ([nextHtml, isReadonly, isDisabled]) => {
      if (!editor.value) {
        return
      }

      editor.value.setOptions({
        editable: !(isReadonly || isDisabled),
      })

      const html = typeof nextHtml === 'string' ? nextHtml : '<p></p>'
      const current = editor.value.getHTML()

      if (html !== current) {
        editor.value.commands.setContent(html, { emitUpdate: false })
      }
    },
  )

  function focusEditor (): void {
    editor.value?.chain().focus().run()
  }
</script>

<style scoped>
  .rte-shell {
    border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
    border-radius: 8px;
    overflow: hidden;
    background: rgb(var(--v-theme-surface));
  }

  .rte-shell--readonly {
    background: rgb(var(--v-theme-surface));
  }

  .rte-shell--error {
    border-color: rgb(var(--v-theme-error));
  }

  :deep(.rte-toolbar) {
    border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
    background: rgb(var(--v-theme-surface));
  }

  .rte-surface {
    border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
    min-height: 140px;
    background: rgb(var(--v-theme-surface));
    border: none;
  }

  :deep(.ProseMirror) {
    outline: none;
    min-height: 120px;
  }

  :deep(.ProseMirror p.is-editor-empty:first-child::before) {
    color: rgba(var(--v-theme-on-surface), 0.45);
    content: attr(data-placeholder);
    float: left;
    height: 0;
    pointer-events: none;
  }

  :deep(.ProseMirror p) {
    margin: 0.4rem 0;
  }

  :deep(.ProseMirror ul),
  :deep(.ProseMirror ol) {
    margin: 0.4rem 0;
    padding-left: 1.75rem;
    list-style-position: outside;
  }

  :deep(.ProseMirror ul) {
    list-style-type: disc;
  }

  :deep(.ProseMirror ol) {
    list-style-type: decimal;
  }

  :deep(.ProseMirror li) {
    margin: 0.15rem 0;
  }
</style>
