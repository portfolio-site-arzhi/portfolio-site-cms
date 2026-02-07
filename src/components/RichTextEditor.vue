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
      <div class="rte-toolbar d-flex flex-wrap align-center ga-1 px-2 py-2">
        <v-tooltip location="bottom" text="Undo">
          <template #activator="{ props: tooltipProps }">
            <v-btn
              v-bind="tooltipProps"
              :disabled="isToolbarDisabled || !canUndo"
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
              :disabled="isToolbarDisabled || !canRedo"
              icon
              size="small"
              variant="text"
              @click="onRedo"
            >
              <v-icon icon="mdi-redo" />
            </v-btn>
          </template>
        </v-tooltip>

        <v-divider class="mx-1" vertical />

        <v-menu :disabled="isToolbarDisabled" location="bottom start">
          <template #activator="{ props: menuProps }">
            <v-tooltip location="bottom" :text="`Format: ${activeBlockLabel}`">
              <template #activator="{ props: tooltipProps }">
                <v-btn
                  v-bind="{ ...menuProps, ...tooltipProps }"
                  :disabled="isToolbarDisabled"
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

        <v-tooltip location="bottom" text="Bullet list">
          <template #activator="{ props: tooltipProps }">
            <v-btn
              v-bind="tooltipProps"
              :active="isActive('bulletList')"
              :color="isActive('bulletList') ? 'primary' : undefined"
              :disabled="isToolbarDisabled"
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
              :disabled="isToolbarDisabled"
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
              :disabled="isToolbarDisabled"
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
              :disabled="isToolbarDisabled"
              icon
              size="small"
              variant="text"
              @click="toggleCodeBlock"
            >
              <v-icon icon="mdi-code-tags" />
            </v-btn>
          </template>
        </v-tooltip>

        <v-divider class="mx-1" vertical />

        <v-tooltip location="bottom" text="Bold">
          <template #activator="{ props: tooltipProps }">
            <v-btn
              v-bind="tooltipProps"
              :active="isActive('bold')"
              :color="isActive('bold') ? 'primary' : undefined"
              :disabled="isToolbarDisabled"
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
              :disabled="isToolbarDisabled"
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
              :disabled="isToolbarDisabled"
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
              :disabled="isToolbarDisabled"
              icon
              size="small"
              variant="text"
              @click="toggleStrike"
            >
              <v-icon icon="mdi-format-strikethrough-variant" />
            </v-btn>
          </template>
        </v-tooltip>

        <v-divider class="mx-1" vertical />

        <v-tooltip location="bottom" text="Rata kiri">
          <template #activator="{ props: tooltipProps }">
            <v-btn
              v-bind="tooltipProps"
              :active="isAlignActive('left')"
              :color="isAlignActive('left') ? 'primary' : undefined"
              :disabled="isToolbarDisabled"
              icon
              size="small"
              variant="text"
              @click="setAlign('left')"
            >
              <v-icon icon="mdi-format-align-left" />
            </v-btn>
          </template>
        </v-tooltip>
        <v-tooltip location="bottom" text="Rata tengah">
          <template #activator="{ props: tooltipProps }">
            <v-btn
              v-bind="tooltipProps"
              :active="isAlignActive('center')"
              :color="isAlignActive('center') ? 'primary' : undefined"
              :disabled="isToolbarDisabled"
              icon
              size="small"
              variant="text"
              @click="setAlign('center')"
            >
              <v-icon icon="mdi-format-align-center" />
            </v-btn>
          </template>
        </v-tooltip>
        <v-tooltip location="bottom" text="Rata kanan">
          <template #activator="{ props: tooltipProps }">
            <v-btn
              v-bind="tooltipProps"
              :active="isAlignActive('right')"
              :color="isAlignActive('right') ? 'primary' : undefined"
              :disabled="isToolbarDisabled"
              icon
              size="small"
              variant="text"
              @click="setAlign('right')"
            >
              <v-icon icon="mdi-format-align-right" />
            </v-btn>
          </template>
        </v-tooltip>
        <v-tooltip location="bottom" text="Rata kiri-kanan (justify)">
          <template #activator="{ props: tooltipProps }">
            <v-btn
              v-bind="tooltipProps"
              :active="isAlignActive('justify')"
              :color="isAlignActive('justify') ? 'primary' : undefined"
              :disabled="isToolbarDisabled"
              icon
              size="small"
              variant="text"
              @click="setAlign('justify')"
            >
              <v-icon icon="mdi-format-align-justify" />
            </v-btn>
          </template>
        </v-tooltip>

        <v-divider class="mx-1" vertical />

        <v-tooltip location="bottom" text="Tambah/Edit link">
          <template #activator="{ props: tooltipProps }">
            <v-btn
              v-bind="tooltipProps"
              :active="isActive('link')"
              :color="isActive('link') ? 'primary' : undefined"
              :disabled="isToolbarDisabled"
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
              :disabled="isToolbarDisabled || !isActive('link')"
              icon
              size="small"
              variant="text"
              @click="removeLink"
            >
              <v-icon icon="mdi-link-variant-off" />
            </v-btn>
          </template>
        </v-tooltip>

        <v-divider class="mx-1" vertical />

        <v-tooltip location="bottom" text="Garis horizontal">
          <template #activator="{ props: tooltipProps }">
            <v-btn
              v-bind="tooltipProps"
              :disabled="isToolbarDisabled"
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
              :disabled="isToolbarDisabled"
              icon
              size="small"
              variant="text"
              @click="clearFormatting"
            >
              <v-icon icon="mdi-format-clear" />
            </v-btn>
          </template>
        </v-tooltip>
      </div>

      <div
        class="rte-surface px-3 py-2"
        @click="editor?.chain().focus().run()"
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
            :bg-color="readonly ? 'grey-lighten-3' : undefined"
            density="compact"
            :disabled="isToolbarDisabled"
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
          <div
            class="text-caption text-medium-emphasis mt-2"
          >
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
            :disabled="isToolbarDisabled"
            variant="flat"
            @click="applyLink"
          >
            Terapkan
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts" setup>
  import Placeholder from '@tiptap/extension-placeholder'
  import TextAlign from '@tiptap/extension-text-align'
  import StarterKit from '@tiptap/starter-kit'
  import { EditorContent, useEditor } from '@tiptap/vue-3'

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

  const isToolbarDisabled = computed(() => disabled.value || readonly.value || !editor.value)

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

  const canUndo = computed(() => editor.value?.can().chain().focus().undo().run() === true)
  const canRedo = computed(() => editor.value?.can().chain().focus().redo().run() === true)

  const linkDialog = ref(false)
  const linkUrl = ref('')
  const linkError = ref<string | null>(null)
  const linkUrlField = ref<{ focus: () => void } | null>(null)

  watch(
    () => linkDialog.value,
    isOpen => {
      if (!isOpen) {
        return
      }

      nextTick(() => {
        linkUrlField.value?.focus()
      })
    },
  )

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

  function isActive (name: string): boolean {
    return editor.value?.isActive(name) === true
  }

  const activeBlockLabel = computed(() => {
    if (!editor.value) {
      return 'Format'
    }

    if (editor.value.isActive('heading', { level: 1 })) {
      return 'Heading 1'
    }
    if (editor.value.isActive('heading', { level: 2 })) {
      return 'Heading 2'
    }
    if (editor.value.isActive('heading', { level: 3 })) {
      return 'Heading 3'
    }
    if (editor.value.isActive('heading', { level: 4 })) {
      return 'Heading 4'
    }
    if (editor.value.isActive('heading', { level: 5 })) {
      return 'Heading 5'
    }
    if (editor.value.isActive('heading', { level: 6 })) {
      return 'Heading 6'
    }
    if (editor.value.isActive('bulletList')) {
      return 'Bullet list'
    }
    if (editor.value.isActive('orderedList')) {
      return 'Numbered list'
    }
    if (editor.value.isActive('blockquote')) {
      return 'Quote'
    }
    if (editor.value.isActive('codeBlock')) {
      return 'Code block'
    }

    return 'Paragraph'
  })

  const activeBlockIcon = computed(() => {
    if (!editor.value) {
      return 'mdi-format-paragraph'
    }

    if (editor.value.isActive('heading', { level: 1 })) {
      return 'mdi-format-header-1'
    }
    if (editor.value.isActive('heading', { level: 2 })) {
      return 'mdi-format-header-2'
    }
    if (editor.value.isActive('heading', { level: 3 })) {
      return 'mdi-format-header-3'
    }
    if (editor.value.isActive('heading', { level: 4 })) {
      return 'mdi-format-header-4'
    }
    if (editor.value.isActive('heading', { level: 5 })) {
      return 'mdi-format-header-5'
    }
    if (editor.value.isActive('heading', { level: 6 })) {
      return 'mdi-format-header-6'
    }

    return 'mdi-format-paragraph'
  })

  function toggleBold (): void {
    editor.value?.chain().focus().toggleBold().run()
  }

  function toggleItalic (): void {
    editor.value?.chain().focus().toggleItalic().run()
  }

  function toggleUnderline (): void {
    editor.value?.chain().focus().toggleUnderline().run()
  }

  function toggleStrike (): void {
    editor.value?.chain().focus().toggleStrike().run()
  }

  function setParagraph (): void {
    editor.value?.chain().focus().setParagraph().run()
  }

  function setHeading (level: 1 | 2 | 3 | 4 | 5 | 6): void {
    editor.value?.chain().focus().toggleHeading({ level }).run()
  }

  function toggleBulletList (): void {
    editor.value?.chain().focus().toggleBulletList().run()
  }

  function toggleOrderedList (): void {
    editor.value?.chain().focus().toggleOrderedList().run()
  }

  function toggleBlockquote (): void {
    editor.value?.chain().focus().toggleBlockquote().run()
  }

  function toggleCodeBlock (): void {
    editor.value?.chain().focus().toggleCodeBlock().run()
  }

  function insertHorizontalRule (): void {
    editor.value?.chain().focus().setHorizontalRule().run()
  }

  function clearFormatting (): void {
    editor.value?.chain().focus().unsetAllMarks().clearNodes().run()
  }

  function onUndo (): void {
    editor.value?.chain().focus().undo().run()
  }

  function onRedo (): void {
    editor.value?.chain().focus().redo().run()
  }

  function isAlignActive (align: 'left' | 'center' | 'right' | 'justify'): boolean {
    return editor.value?.isActive({ textAlign: align }) === true
  }

  function setAlign (align: 'left' | 'center' | 'right' | 'justify'): void {
    editor.value?.chain().focus().setTextAlign(align).run()
  }

  function openLinkDialog (): void {
    if (isToolbarDisabled.value) {
      return
    }

    linkError.value = null
    linkUrl.value = editor.value?.getAttributes('link')?.href ?? ''
    linkDialog.value = true
  }

  function closeLinkDialog (): void {
    linkDialog.value = false
  }

  function normalizeUrl (raw: string): string {
    const url = raw.trim()
    if (url.length === 0) {
      return ''
    }

    if (url.startsWith('#')) {
      return url
    }

    if (/^(https?:\/\/|mailto:|tel:)/i.test(url)) {
      return url
    }

    return `https://${url}`
  }

  function applyLink (): void {
    if (!editor.value) {
      return
    }

    linkError.value = null

    const url = normalizeUrl(linkUrl.value)
    if (url.length === 0) {
      editor.value.chain().focus().unsetLink().run()
      linkDialog.value = false
      return
    }

    if (/^javascript:/i.test(url)) {
      linkError.value = 'URL tidak valid.'
      return
    }

    editor.value
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: url, target: '_blank', rel: 'noopener noreferrer' })
      .run()

    linkDialog.value = false
  }

  function removeLink (): void {
    editor.value?.chain().focus().unsetLink().run()
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

  .rte-toolbar {
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
