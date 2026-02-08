import type { Editor } from '@tiptap/core'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import RichTextToolbarLinkButtons from '../src/components/rich-text-editor/RichTextToolbarLinkButtons.vue'

describe('RichTextToolbarLinkButtons', () => {
  function createEditorStub () {
    const chain = {
      focus: vi.fn(() => chain),
      unsetLink: vi.fn(() => chain),
      extendMarkRange: vi.fn(() => chain),
      setLink: vi.fn(() => chain),
      run: vi.fn(() => true),
    }

    const editor = {
      isActive: vi.fn(() => false),
      getAttributes: vi.fn(() => ({ href: '' })),
      chain: vi.fn(() => chain),
    } as unknown as Editor

    return { editor, chain }
  }

  it('menambah prefix https:// saat URL belum punya protocol', () => {
    const { editor, chain } = createEditorStub()

    const wrapper = mount(RichTextToolbarLinkButtons, {
      props: {
        editor,
        readonly: false,
        disabled: false,
      },
    })

    const vm = wrapper.vm as unknown as {
      linkUrl: string
      linkError: string | null
      applyLink: () => void
    }

    vm.linkUrl = 'example.com'
    vm.applyLink()

    expect(vm.linkError).toBeNull()
    expect(chain.setLink).toHaveBeenCalledWith({
      href: 'https://example.com',
      target: '_blank',
      rel: 'noopener noreferrer',
    })
  })

  it('menolak URL javascript: dan menampilkan error', () => {
    const { editor, chain } = createEditorStub()

    const wrapper = mount(RichTextToolbarLinkButtons, {
      props: {
        editor,
        readonly: false,
        disabled: false,
      },
    })

    const vm = wrapper.vm as unknown as {
      linkUrl: string
      linkError: string | null
      applyLink: () => void
    }

    vm.linkUrl = 'javascript:alert(1)'
    vm.applyLink()

    expect(vm.linkError).toBe('URL tidak valid.')
    expect(chain.setLink).not.toHaveBeenCalled()
  })

  it('menghapus link saat URL dikosongkan', () => {
    const { editor, chain } = createEditorStub()

    const wrapper = mount(RichTextToolbarLinkButtons, {
      props: {
        editor,
        readonly: false,
        disabled: false,
      },
    })

    const vm = wrapper.vm as unknown as {
      linkUrl: string
      applyLink: () => void
    }

    vm.linkUrl = '   '
    vm.applyLink()

    expect(chain.unsetLink).toHaveBeenCalled()
    expect(chain.setLink).not.toHaveBeenCalled()
  })
})
