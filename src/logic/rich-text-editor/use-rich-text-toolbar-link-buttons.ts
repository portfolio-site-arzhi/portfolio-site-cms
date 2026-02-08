import type { Editor } from '@tiptap/core'

type FocusableField = {
  focus: () => void
}

export function useRichTextToolbarLinkButtons (props: {
  editor: Editor | null
  readonly: boolean
  disabled: boolean
}) {
  const linkDialog = ref(false)
  const linkUrl = ref('')
  const linkError = ref<string | null>(null)
  const linkUrlField = ref<FocusableField | null>(null)

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

  function isActive (name: string): boolean {
    return props.editor?.isActive(name) === true
  }

  function openLinkDialog (): void {
    if (props.disabled) {
      return
    }

    linkError.value = null
    linkUrl.value = props.editor?.getAttributes('link')?.href ?? ''
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
    if (!props.editor) {
      return
    }

    linkError.value = null

    const raw = String(linkUrl.value ?? '')
    const trimmed = raw.trim()

    if (/^javascript:/i.test(trimmed)) {
      linkError.value = 'URL tidak valid.'
      return
    }

    const url = normalizeUrl(trimmed)
    if (url.length === 0) {
      props.editor.chain().focus().unsetLink().run()
      linkDialog.value = false
      return
    }

    props.editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: url, target: '_blank', rel: 'noopener noreferrer' })
      .run()

    linkDialog.value = false
  }

  function removeLink (): void {
    props.editor?.chain().focus().unsetLink().run()
  }

  return {
    linkDialog,
    linkUrl,
    linkError,
    linkUrlField,
    isActive,
    openLinkDialog,
    closeLinkDialog,
    applyLink,
    removeLink,
  }
}
