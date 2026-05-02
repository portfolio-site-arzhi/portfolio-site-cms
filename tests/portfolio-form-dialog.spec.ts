import { flushPromises, mount } from '@vue/test-utils'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import PortfolioFormDialog from '../src/components/portfolio/PortfolioFormDialog.vue'
import PortfolioStacksEditor from '../src/components/portfolio/PortfolioStacksEditor.vue'

const smAndDownMock = ref(false)

vi.mock('vuetify', () => ({
  useDisplay: () => ({
    smAndDown: smAndDownMock,
  }),
}))

vi.mock('vuedraggable', () => ({
  default: defineComponent({
    name: 'draggable',
    props: {
      modelValue: {
        type: Array,
        default: () => [],
      },
      tag: {
        type: String,
        default: 'div',
      },
    },
    emits: ['update:modelValue', 'start', 'end'],
    setup (props, { slots }) {
      return () => h(
        props.tag as any,
        {},
        (props.modelValue as any[]).map((element, index) => (slots.item ? slots.item({ element, index }) : null)),
      )
    },
  }),
}))

const {
  createPortfolioApiMock,
  updatePortfolioApiMock,
} = vi.hoisted(() => ({
  createPortfolioApiMock: vi.fn(() => Promise.resolve({
    data: {
      data: {
        id: 1,
      },
    },
  })),
  updatePortfolioApiMock: vi.fn(() => Promise.resolve({
    data: {
      data: {
        id: 1,
      },
    },
  })),
}))

vi.mock('@/api/portfolio-service', () => ({
  createPortfolioApi: createPortfolioApiMock,
  updatePortfolioApi: updatePortfolioApiMock,
}))

beforeAll(() => {
  Object.defineProperty(URL, 'createObjectURL', {
    value: vi.fn(() => 'blob:preview'),
    configurable: true,
  })

  Object.defineProperty(URL, 'revokeObjectURL', {
    value: vi.fn(),
    configurable: true,
  })
})

describe('PortfolioFormDialog', () => {
  it('mengirim data ke API saat membuat portfolio', async () => {
    const wrapper = mount(PortfolioFormDialog, {
      props: {
        modelValue: true,
        mode: 'create',
      },
      global: {
        stubs: {
          RichTextEditor: {
            props: ['modelValue'],
            emits: ['update:modelValue'],
            template: '<div />',
          },
          teleport: true,
        },
      },
    })

    const imageFile = new File(['image'], 'portfolio.png', { type: 'image/png' })

    const vm = wrapper.vm as unknown as {
      setValues: (values: any) => void
      onSubmit: () => Promise<void> | void
      onImageChange: (file: File | null) => void
    }

    vm.onImageChange(imageFile)
    vm.setValues({
      title: ' Ecommerce Dashboard ',
      description: ' Dashboard analytics untuk toko online ',
      description_en: ' Analytics dashboard for ecommerce store ',
      contribution: '<p>Membangun dashboard analytics</p>',
      contribution_en: '<p>Built analytics dashboard</p>',
      outcome: '<p>Meningkatkan conversion rate</p>',
      outcome_en: '<p>Improved conversion rate</p>',
      role: ' Frontend Lead ',
      live_url: 'https://demo.example.com/ecommerce-dashboard',
      github_url: 'https://github.com/example/ecommerce-dashboard',
      is_published: true,
      published_at: '2026-04-24T16:00',
      stacks: [
        { id: null, name: 'Vue 3' },
        { id: null, name: 'TypeScript' },
      ],
    })

    await vm.onSubmit()
    await flushPromises()

    expect(createPortfolioApiMock).toHaveBeenCalledWith({
      title: 'Ecommerce Dashboard',
      description: 'Dashboard analytics untuk toko online',
      description_en: 'Analytics dashboard for ecommerce store',
      contribution: '<p>Membangun dashboard analytics</p>',
      contribution_en: '<p>Built analytics dashboard</p>',
      outcome: '<p>Meningkatkan conversion rate</p>',
      outcome_en: '<p>Improved conversion rate</p>',
      role: 'Frontend Lead',
      live_url: 'https://demo.example.com/ecommerce-dashboard',
      github_url: 'https://github.com/example/ecommerce-dashboard',
      is_published: true,
      published_at: new Date('2026-04-24T16:00').toISOString(),
      stacks: [
        { name: 'Vue 3' },
        { name: 'TypeScript' },
      ],
    }, imageFile)
  })

  it('mengirim data ke API saat membuat portfolio tanpa gambar', async () => {
    const wrapper = mount(PortfolioFormDialog, {
      props: {
        modelValue: true,
        mode: 'create',
      },
      global: {
        stubs: {
          RichTextEditor: {
            props: ['modelValue'],
            emits: ['update:modelValue'],
            template: '<div />',
          },
          teleport: true,
        },
      },
    })

    const vm = wrapper.vm as unknown as {
      setValues: (values: unknown) => void
      onSubmit: () => Promise<void> | void
    }

    vm.setValues({
      title: 'Internal Notification Service',
      description: 'Service internal untuk notifikasi multi channel',
      description_en: 'Internal service for multi-channel notifications',
      contribution: '<p>Membangun arsitektur service dan queue worker</p>',
      contribution_en: '<p>Built service architecture and queue workers</p>',
      outcome: '<p>Mempercepat pengiriman notifikasi sistem</p>',
      outcome_en: '<p>Improved system notification delivery speed</p>',
      role: 'Backend Engineer',
      live_url: '',
      github_url: 'https://github.com/example/internal-notification-service',
      is_published: true,
      published_at: '2026-04-24T16:00',
      stacks: [
        { id: null, name: 'Node.js' },
        { id: null, name: 'Redis' },
      ],
    })

    await vm.onSubmit()
    await flushPromises()

    expect(createPortfolioApiMock).toHaveBeenCalledWith({
      title: 'Internal Notification Service',
      description: 'Service internal untuk notifikasi multi channel',
      description_en: 'Internal service for multi-channel notifications',
      contribution: '<p>Membangun arsitektur service dan queue worker</p>',
      contribution_en: '<p>Built service architecture and queue workers</p>',
      outcome: '<p>Mempercepat pengiriman notifikasi sistem</p>',
      outcome_en: '<p>Improved system notification delivery speed</p>',
      role: 'Backend Engineer',
      live_url: null,
      github_url: 'https://github.com/example/internal-notification-service',
      is_published: true,
      published_at: new Date('2026-04-24T16:00').toISOString(),
      stacks: [
        { name: 'Node.js' },
        { name: 'Redis' },
      ],
    }, null)
  })

  it('mengirim status_file 1 tanpa file saat gambar dihapus pada mode edit', async () => {
    const existingPortfolio = {
      id: 7,
      slug: 'legacy-project',
      title: 'Legacy Project',
      description: 'Legacy description',
      description_en: 'Legacy description en',
      contribution: '<p>Legacy contribution</p>',
      contribution_en: '<p>Legacy contribution en</p>',
      outcome: '<p>Legacy outcome</p>',
      outcome_en: '<p>Legacy outcome en</p>',
      image: 'https://example.com/legacy.png',
      role: 'Frontend Developer',
      live_url: null,
      github_url: null,
      display_order: 1,
      is_published: false,
      published_at: '2026-04-24T09:00:00.000Z',
      stacks: [],
      created_at: '2026-04-24T09:00:00.000Z',
      updated_at: '2026-04-24T09:00:00.000Z',
      created_by: 1,
      updated_by: 1,
    }

    const wrapper = mount(PortfolioFormDialog, {
      props: {
        modelValue: true,
        mode: 'edit',
        portfolio: existingPortfolio,
      },
      global: {
        stubs: {
          RichTextEditor: {
            props: ['modelValue'],
            emits: ['update:modelValue'],
            template: '<div />',
          },
          teleport: true,
        },
      },
    })

    const vm = wrapper.vm as unknown as {
      setValues: (values: any) => void
      onSubmit: () => Promise<void> | void
      onImageRemove: () => void
    }

    vm.onImageRemove()
    vm.setValues({
      title: 'Legacy Project Revamp',
      description: 'Updated description',
      description_en: '',
      contribution: '<p>Updated contribution</p>',
      contribution_en: '',
      outcome: '<p>Updated outcome</p>',
      outcome_en: '',
      role: 'Frontend Lead',
      live_url: '',
      github_url: '',
      is_published: true,
      published_at: '',
      stacks: [],
    })

    await vm.onSubmit()
    await flushPromises()

    expect(updatePortfolioApiMock).toHaveBeenCalledWith(7, {
      status_file: 1,
      title: 'Legacy Project Revamp',
      description: 'Updated description',
      description_en: null,
      contribution: '<p>Updated contribution</p>',
      contribution_en: null,
      outcome: '<p>Updated outcome</p>',
      outcome_en: null,
      role: 'Frontend Lead',
      live_url: null,
      github_url: null,
      is_published: true,
      published_at: null,
      stacks: [],
    }, null)
  })

  it('menambahkan stack lewat editor sebelum submit', async () => {
    const wrapper = mount(PortfolioFormDialog, {
      props: {
        modelValue: true,
        mode: 'create',
      },
      global: {
        stubs: {
          RichTextEditor: {
            props: ['modelValue'],
            emits: ['update:modelValue'],
            template: '<div />',
          },
          teleport: true,
        },
      },
    })

    const imageFile = new File(['image'], 'portfolio.png', { type: 'image/png' })

    const vm = wrapper.vm as unknown as {
      setValues: (values: any) => void
      onSubmit: () => Promise<void> | void
      onImageChange: (file: File | null) => void
    }

    const stacksEditor = wrapper.findComponent(PortfolioStacksEditor)
    const stacksEditorVm = stacksEditor.vm as unknown as {
      openCreateStackDialog: () => void
      saveStack: () => void
      stackName: string
    }

    stacksEditorVm.openCreateStackDialog()
    stacksEditorVm.stackName = 'Nuxt'
    stacksEditorVm.saveStack()
    await flushPromises()

    vm.onImageChange(imageFile)
    vm.setValues({
      title: 'Nuxt Portfolio',
      description: 'Portfolio berbasis Nuxt',
      description_en: '',
      contribution: '<p></p>',
      contribution_en: '<p></p>',
      outcome: '<p></p>',
      outcome_en: '<p></p>',
      role: '',
      live_url: '',
      github_url: '',
      is_published: true,
      published_at: '',
    })

    await vm.onSubmit()
    await flushPromises()

    expect(createPortfolioApiMock).toHaveBeenCalledWith(expect.objectContaining({
      stacks: [{ name: 'Nuxt' }],
    }), imageFile)
  })

  it('mengirim contribution dan outcome dari editor tunggal saat submit', async () => {
    const wrapper = mount(PortfolioFormDialog, {
      props: {
        modelValue: true,
        mode: 'create',
      },
      global: {
        stubs: {
          RichTextEditor: {
            props: ['modelValue'],
            emits: ['update:modelValue'],
            template: '<div />',
          },
          teleport: true,
        },
      },
    })

    const imageFile = new File(['image'], 'portfolio.png', { type: 'image/png' })

    const vm = wrapper.vm as unknown as {
      setValues: (values: any) => void
      onSubmit: () => Promise<void> | void
      onImageChange: (file: File | null) => void
    }

    vm.onImageChange(imageFile)
    vm.setValues({
      title: 'Portfolio Module',
      description: 'Modul portfolio',
      description_en: '',
      contribution: '<p>Membangun modul portfolio</p>',
      contribution_en: '<p>Built portfolio module</p>',
      outcome: '<p>Outcome modul portfolio</p>',
      outcome_en: '<p>Portfolio module outcome</p>',
      role: '',
      live_url: '',
      github_url: '',
      is_published: true,
      published_at: '',
      stacks: [],
    })

    await vm.onSubmit()
    await flushPromises()

    expect(createPortfolioApiMock).toHaveBeenCalledWith(expect.objectContaining({
      contribution: '<p>Membangun modul portfolio</p>',
      contribution_en: '<p>Built portfolio module</p>',
      outcome: '<p>Outcome modul portfolio</p>',
      outcome_en: '<p>Portfolio module outcome</p>',
    }), imageFile)
  })

  it('menampilkan info ukuran file maksimal 5 MB pada upload gambar', () => {
    const wrapper = mount(PortfolioFormDialog, {
      props: {
        modelValue: true,
        mode: 'create',
      },
      global: {
        stubs: {
          RichTextEditor: {
            props: ['modelValue'],
            emits: ['update:modelValue'],
            template: '<div />',
          },
          teleport: true,
        },
      },
    })

    expect(wrapper.text()).toContain('Ukuran file maksimal 5 MB')
  })
})
